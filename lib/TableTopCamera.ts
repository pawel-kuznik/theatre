import { PerspectiveCamera, Camera as ThreeJSCamera  } from "three";

/**
 *  This is a special camera implementation that is suitable for table top
 *  view of the scene.
 */
export default class TableTopCamera {

    private readonly _camera:PerspectiveCamera;

    /**
     *  The construct of the camera.
     */
    constructor(aspect:number) {

        // construct the actual camera instance
        this._camera = new PerspectiveCamera(45, aspect, 0.1, 8000);

        // position the camera
        this._camera.position.x = 0;
        this._camera.position.y = -2.5;
        this._camera.position.z = 10;

        // make it look at the center of the board
        this._camera.lookAt(0, 0, 0);
    }
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

    /**
     *  Update aspect ratio of the camera.
     */
    aspect(aspect:number) {

        // update the aspect ratio of the camera
        this._camera.aspect = aspect;

        // and update the project matrix
        this._camera.updateProjectionMatrix();
    }

    /**
     *  Set the height of the camera. Calling it with no param will reset the camera
     *  to the default height.
     */
    lift(height:number = 10) {

        // set the height
        this._camera.position.z = height;

        // update where the camera is looking
        this._camera.lookAt(this._camera.position.x, this._camera.position.y + 2.5, 0);
    }

    /**
     *  Move the camera by certain x and y values.
     */
    moveBy(x:number, y:number) {

        this.moveTo(this._camera.position.x + x, this._camera.position.y + y);
    }

    /** 
     *  Move camera to a certain x and y values.
     */
    moveTo(x:number, y:number) {

        // update camera position
        this._camera.position.x = x;
        this._camera.position.y = y;

        // update where the camera is looking
        this._camera.lookAt(this._camera.position.x, this._camera.position.y + 2.5, 0);
    }
};