import { Emitter } from '@pawel-kuznik/iventy';
import RendererHandler from "./RendererHandler";
import RenderingLoop from "./RenderingLoop";
import Stage from "./Stage";
import StageContainer from "./StageContainer";
import Warderobe from "./Warderobe";
import Camera from "./Camera";
import CameraFactory, { CameraFactorySpecs } from "./Camera/CameraFactory";
import { RenderStep } from "./RenderStep";
import RenderingQualitySettings, { PowerPreferenceSetting, ShaderPrecisionSetting } from "./RenderingQualitySettings";
import { RenderingStats } from "./RenderingStats";

/**
 *  The options for the main object.
 */
export interface TheatreOptions {

    quality?:Partial<RenderingQualitySettings>;

    camera:CameraFactorySpecs;
};

/**
 *  This is the main class that creates the theater and allows to compose the scene.
 *  The theatre in our case is the whole 3D rendering frame inside a canvas element.
 * 
 *  This class is here to provide a high-level api to everything that is happening
 *  inside the rendering frame:
 *
 *  - scene switching
 *  - defining resources that actors can use
 *  - providing a way to transition actors between scenes
 * 
 *  @event  resize      This event triggers when the canvas resizes and the renderer
 *                      updated to the new size.
 */
export default class Theatre extends Emitter  {

    /**
     *  The warderobe for the theathre.
     */
    public readonly warderobe:Warderobe = new Warderobe();

    /**
     *  Rendering statistics.
     */
    readonly stats: RenderingStats;

    /**
     *  The container wrapping around the current stage and providing us
     *  with ability to transition from one stage to another.
     */
    private readonly _stageContainer:StageContainer = new StageContainer();

    /**
     *  The stages created inside the theatre.
     */
    private readonly _stages:Map<string,Stage> = new Map();

    /**
     *  The active camera of the game.
     */
    private readonly _camera:Camera;

    /**
     *  An instance of the renderer, but wrapped in a cosy handler that
     *  takes care of all canvas-renderer interactions.
     */
    private readonly _rendererHandler:RendererHandler;

    /**
     *  A special class allowing us to affect rendering loop.
     */
    private readonly _loop:RenderingLoop;

    private _onDocumentKeyDown: any;
    private _onDocumentWheel: any;
    private _onCanvasClick: any;
    private _onCanvasPointerMove: any;

    /**
     *  The camera responsible for showing the game.
     */
    get camera() : Camera { return this._camera; }

    /**
     *  The constructor
     *
     *  @throw  Error   When initialization fails. The message contains the reason.
     */
    constructor(canvasContainer:HTMLElement, options?:TheatreOptions) {

        super();

        if (!(window as any).__THREE__) throw Error("Trying to use Theatre without THREE.js");

        const container = document.createElement('div');
        container.className = "theatre-container";

        canvasContainer.append(container);

        this._rendererHandler = new RendererHandler(container, Object.assign({ }, {
            antialiasing:       true,
            shaderPrecision:    ShaderPrecisionSetting.high,
            powerPreference:    PowerPreferenceSetting.default      
        }));

        const canvas = this._rendererHandler.canvas;

        const cameraDefaults:CameraFactorySpecs = {
            type:           'topdown',
            movers:         [ { type: 'wsad' },  { type: 'wheellifter' }],
            pickers:        ['primary', 'hover']
        };

        const cameraOptions = options ? (options.camera || cameraDefaults) : cameraDefaults;

        this._camera = (new CameraFactory(cameraOptions, this._stageContainer, this)).build();

        this._camera.updateAspectRatio(this._rendererHandler.aspectRatio);

        this._loop = new RenderingLoop((step:RenderStep) => {

            this._stageContainer.stage.updateShadowCamera(this._camera);
            this._camera.renderUpdate(step);

            this.warderobe.renderUpdate(step);

            this._stageContainer.renderUpdate(step);

            this._rendererHandler.renderer.render(this._stageContainer.stage.scene, this._camera.native);

            this._rendererHandler.css.render(this._stageContainer.stage.scene, this._camera.native);
        });

        // @todo This whole thing should be disposable and this event handler should be uninstalled.
        canvas.ownerDocument.body.addEventListener('keydown', this._onDocumentKeyDown = (event:KeyboardEvent) => {

            this._camera.handlePointer(event);
        });

        canvas.ownerDocument.body.addEventListener('wheel', this._onDocumentWheel = (event:WheelEvent) => {

            this._camera.handlePointer(event);
        });

        canvas.addEventListener('click', this._onCanvasClick = (e:MouseEvent) => {

            e.preventDefault();

            // @note we cast the event as a pointer event, cause indeed it's a pointer event.
            // For some (most likely historical) reason, TS lib thinks it's a MouseEvent, but
            // modern browsers emit a PointerEvent instead.
            const event = e as PointerEvent;

            this._camera.handlePointer(event);
        });

        canvas.addEventListener('pointermove', this._onCanvasPointerMove = (event:PointerEvent) => {

            this._camera.handlePointer(event);
        });

        // @todo figure out how to deal with double-click. TS doesn't like this event handler
        // canvas.addEventListener('dblclick ', (e:PointerEvent) => { });
        
        this._rendererHandler.onResize((x:number, y:number) => {

            const aspectRatio = x/y;

            this._camera.updateAspectRatio(aspectRatio);

            this.trigger('resize', { width:x, height:y, aspectRatio });
        });

        this._loop.start();

        this.stats = new RenderingStats(this._loop, this._rendererHandler.renderer);
    }

    /**
     *  Get the current stage.
     */
    get stage() : Stage { return this._stageContainer.stage; }

    /**
     *  Create a new stage.
     * 
     *  @throws Error   When a stage of a given name already exists.
     */
    createStage(name:string, Constructor:new (...args:any[]) => Stage = Stage, ...args:any[]) : Stage {

        if (this._stages.has(name)) throw new Error('Theatre: Stage with this name already exists.');

        const stage = new Constructor(...args);

        this._stages.set(name, stage);

        return stage;
    }

    /**
     *  Transition to a specific stage by it's name.
     */
    transitionTo(stageName:string) {

        const stage = this._stages.get(stageName);

        if (!stage) throw new Error('Theatre: Stage with this name does not exists.');

        this._stageContainer.mount(stage);

        this._stageContainer.stage.hydrate(this.warderobe);
    }

    /**
     *  Unallocate all resources allocated by the renderer.
     */
    dispose() {

        // first dispose of the loop as we really don't want to make any operations while cleanups
        this._loop.dispose();

        // now we need to clean up all stages
        for(let stage of this._stages.values()) {
            stage.dispose();
        }

        this._rendererHandler.canvas.ownerDocument.body.removeEventListener('keydown', this._onDocumentKeyDown);
        this._rendererHandler.canvas.ownerDocument.body.removeEventListener('wheel', this._onDocumentWheel);
        this._rendererHandler.canvas.removeEventListener('click', this._onCanvasClick);
        this._rendererHandler.canvas.removeEventListener('pointermove', this._onCanvasPointerMove);

        this._stages.clear();

        this._rendererHandler.dispose();
    }
};