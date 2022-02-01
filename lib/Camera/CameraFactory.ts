import Camera from "../Camera";
import CameraMoverOptions from "./CameraMoverOptions";
import CameraOptions from "./CameraOptions";
import FreefloatCamera from "./FreefloatCamera";
import TopDownCamera from "./TopDownCamera";
import WSADCameraMover from "./WSADCameraMover";

export type CameraFactorySpecs = CameraOptions & {

    movers:Array<CameraMoverOptions>;
};

/**
 *  A special class to create a camera based
 *  on provided camera options.
 */
export default class CameraFactory {

    /**
     *  The constructor.
     */
    constructor(private readonly _options:CameraFactorySpecs) {

    }

    /**
     *  Build an instance of the camera based
     *  on current state of the factory.
     * 
     *  Or throw an exception if the camera can't be built.
     */
    build() : Camera {

        if (this._options.type === 'topdown') return this.buildTopDown();

        throw Error('Not supported camera type');
    }

    /**
     *  Built a topdown camera instance.
     */
    private buildTopDown() : TopDownCamera {

        const options = Object.assign({ }, {
            type:           this._options.type,
            aspectRatio:    this._options.aspectRatio
        });

        const camera = new TopDownCamera(options);

        for (let moverOptions of this._options.movers) {

            if (moverOptions.type === 'wsad') camera.appendMover(this.buildWSADMover(camera, moverOptions));
        }

        return camera;
    }

    /**
     *  Build a camera mover that reacts to WSAD keys.
     */
    private buildWSADMover(camera:FreefloatCamera, options:CameraMoverOptions) : WSADCameraMover {

        return new WSADCameraMover(camera);
    } 
};