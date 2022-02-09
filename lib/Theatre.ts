import RendererHandler from "./RendererHandler";
import RenderingLoop from "./RenderingLoop";
import Stage from "./Stage";
import StageContainer from "./StageContainer";
import Warderobe from "./Warderobe";
import Camera from "./Camera";
import CameraFactory, { CameraFactorySpecs } from "./Camera/CameraFactory";
import { RenderStep } from "./RenderStep";
import { Emitter } from 'iventy';

/**
 *  The options for the main object.
 */
export interface TheatreOptions {

    camera:CameraFactorySpecs;
};

/**
 *  This is the main class that creates the theater and allows
 *  to compose the scene. The theatre in our case is the whole
 *  3D rendering frame inside a canvas element.
 * 
 *  This class is here to provide a high-level api to everything
 *  that is happening inside the rendering frame:
 *
 *  - scene switching
 *  - defining resources that actors can use
 *  - providing a way to transition actors between scenes
 */
export default class Theatr extends Emitter  {

    /**
     *  The warderobe for the theathre.
     */
    public readonly warderobe:Warderobe = new Warderobe();

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

    /**
     *  The constructor
     *
     *  @throw  Error   When initialization fails. The message contains the reason.
     */
    constructor(canvas:HTMLCanvasElement, options?:TheatreOptions) {

        super();

        this._rendererHandler = new RendererHandler(canvas);

        const cameraDefaults:CameraFactorySpecs = {
            type:           'topdown',
            movers:         [ { type: 'wsad' },  { type: 'wheellifter' }],
            mousePicker:    true
        };

        const cameraOptions = options ? (options.camera || cameraDefaults) : cameraDefaults;

        this._camera = (new CameraFactory(cameraOptions, this._stageContainer, this)).build();

        this._camera.updateAspectRatio(this._rendererHandler.aspectRatio);

        this._loop = new RenderingLoop((step:RenderStep) => {

            this._camera.renderUpdate(step);

            this.warderobe.renderUpdate(step);

            this._stageContainer.renderUpdate(step);

            this._rendererHandler.renderer.render(this._stageContainer.stage.scene, this._camera.native);
        });

        // @todo This whole thing should be disposable and this event handler should be uninstalled.
        canvas.ownerDocument.body.addEventListener('keydown', (event:KeyboardEvent) => {

            this._camera.handle(event);
        });

        canvas.ownerDocument.body.addEventListener('wheel', (event:WheelEvent) => {

            this._camera.handle(event);
        });

        canvas.ownerDocument.body.addEventListener('click', (event:MouseEvent) => {

            this._camera.handle(event);
        });

        this._rendererHandler.onResize((x:number, y:number) => {

            this._camera.updateAspectRatio(x/y);
        });

        this._loop.start();
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
    createStage(name:string) : Stage {

        if (this._stages.has(name)) throw new Error('Theatre: Stage with this name already exists.');

        const stage = new Stage();

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
};