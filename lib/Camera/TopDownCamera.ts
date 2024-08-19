import { PerspectiveCamera, Camera as ThreeJSCamera, Vector3  } from "three";
import { RenderStep } from "../RenderStep";
import CameraMover from "./CameraMover";
import CameraOptions from "./CameraOptions";
import CameraPicker from "./CameraPicker";
import FreefloatCamera from "./FreefloatCamera";
import { Emitter } from "@pawel-kuznik/iventy";

/**
 *  The specific options for top-down camera.
 */
export interface TopDownCameraOptions extends CameraOptions {

    // obligatory for CameraOptions
    type: 'topdown';
};

/**
 *  This is a special camera implementation that is suitable for a top-down
 *  view akin to board games or RTS games.
 */
export default class TopDownCamera extends Emitter implements FreefloatCamera {

    private readonly _camera:PerspectiveCamera;

    private readonly _movers:Array<CameraMover> = [];

    private readonly _pickers:Array<CameraPicker> = [];

    private _looktAt:Vector3 = new Vector3();

    private _moved:boolean = true;

    get movers() { return this._movers; }
    get pickers() { return this._pickers; }

    /**
     *  The construct of the camera.
     */
    constructor(options:TopDownCameraOptions) {

        super();

        // construct the actual camera instance
        this._camera = new PerspectiveCamera(
            options.fov || 65, 
            45,
            options.near || 0.1,
            options.far || 8000
        );

        // position the camera
        this._camera.position.x = 0;
        this._camera.position.y = -2.5;
        this._camera.position.z = 10;

        // make it look at the center of the board
        this._camera.lookAt(0, 0, 0);
    }

    /**
     *  The point the camera looks at.
     */
    getLookAt(): Vector3 { return this._looktAt.clone(); }

    /**
     *  Did camera moved in current render pass?
     */
    get moved(): boolean { return this._moved; }

    /**
     *  Get access to the Three.js camera instance.
     */
    get native() : ThreeJSCamera { return this._camera; }

    /**
     *  Get the current height of the camera. Effectively the Z position of the camera.
     */
    get height() : number { return this._camera.position.z; }

    /**
     *  Expose the camera x and y position. This is the position on the Z=0
     *  on the scene.
     */
    get x() :number { return this._camera.position.x; }
    get y() :number { return this._camera.position.y; }

    get heigth() : number { return this._camera.position.z; }

    /**
     *  Update aspect ratio of the camera.
     */
    public aspect(aspect:number) {

        // update the aspect ratio of the camera
        this._camera.aspect = aspect;

        // and update the project matrix
        this._camera.updateProjectionMatrix();
    }

    /**
     *  Set the height of the camera. Calling it with no param will reset the camera
     *  to the default height.
     */
    public liftTo(height:number = 10) {

        this._camera.position.z = height;
        this._looktAt= new Vector3(this._camera.position.x, this._camera.position.y + 2.5, 0);
        this._camera.lookAt(this._looktAt);

        this._moved = true;
    }

    /**
     *  Lift camera by specific height.
     */
    liftBy(height: number): void {
        
        this.liftTo(this.height + height);
    }

    /**
     *  Move the camera by certain x and y values.
     */
    public moveBy(x:number, y:number) {

        this.moveTo(this._camera.position.x + x, this._camera.position.y + y);
    }

    /** 
     *  Move camera to a certain x and y values.
     */
    public moveTo(x:number, y:number, z: number|undefined = undefined) {

        this._camera.position.x = x;
        this._camera.position.y = y;
        if (z !== undefined) this._camera.position.z = z;
        this._looktAt= new Vector3(this._camera.position.x, this._camera.position.y + 2.5, 0);
        this._camera.lookAt(this._looktAt);

        this._moved = true;
    }

    /**
     *  Handle event related to the user input.
     */
    public handlePointer(event:KeyboardEvent|PointerEvent|WheelEvent) {

        for (let mover of this._movers) mover.handlePointer(event);

        if (event.type === 'click') for (let picker of this._pickers) picker.handlePointer(event as PointerEvent);

        if (event.type === 'pointermove') for (let picker of this._pickers) picker.handlePointer(event as PointerEvent);
    }

    /**
     *  A method to update aspect ratio of the camera.
     */
    public updateAspectRatio(aspectRatio: number): void {

        this._camera.aspect = aspectRatio;

        this._camera.updateProjectionMatrix();
    }

    /**
     *  Add a mover to the camera.
     */
    public appendMover(mover:CameraMover) {

        this._movers.push(mover);

        mover.on('chunk-moved', (event) => void this.trigger(event));
    }

    /**
     *  Append an actor picker.
     */
    public appendPicker(picker:CameraPicker) {

        this._pickers.push(picker);
    }

    /**
     *  Update the camera on render step.
     */
    renderUpdate(step:RenderStep) : void {

        for (let mover of this._movers) mover.renderUpdate(step);

        for (let picker of this._pickers) picker.renderUpdate(step);

        this._moved = false;
    }
};