import { Emitter } from "iventy";
import ActorsHolder from "../ActorsHolder";
import Camera from "../Camera";
import CameraHoverPicker from "./CameraHoverPicker";
import CameraMousePicker from "./CameraMousePicker";
import CameraMoverOptions from "./CameraMoverOptions";
import CameraOptions from "./CameraOptions";
import FreefloatCamera from "./FreefloatCamera";
import TopDownCamera from "./TopDownCamera";
import WheelLifterCameraMover from "./WheelLifterCameraMover";
import WSADCameraMover from "./WSADCameraMover";

export type CameraFactorySpecs = CameraOptions & {

    movers:Array<CameraMoverOptions>;

    pickers:Array<"primary"|"hover">
};

/**
 *  A special class to create a camera based
 *  on provided camera options.
 */
export default class CameraFactory {

    /**
     *  The constructor.
     */
    constructor(private readonly _options:CameraFactorySpecs, private readonly _actorsHolder:ActorsHolder, private readonly _eventTarget:Emitter) {

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
            pickers:        this._options.pickers
        });

        const camera = new TopDownCamera(options);

        for (let moverOptions of this._options.movers) {

            if (moverOptions.type === 'wsad') camera.appendMover(this.buildWSADMover(camera, moverOptions));
            if (moverOptions.type === 'wheellifter') camera.appendMover(this.buildWheelLifter(camera, moverOptions));
        }

        if (options.pickers.includes('primary')) {

            const picker = new CameraMousePicker(camera, this._actorsHolder);

            picker.bubbleTo(this._eventTarget);
            
            camera.appendPicker(picker);
        }

        if (options.pickers.includes('hover')) {

            const picker = new CameraHoverPicker(camera, this._actorsHolder);

            picker.bubbleTo(this._eventTarget);

            camera.appendPicker(picker);
        }

        return camera;
    }

    /**
     *  Build a camera mover that reacts to WSAD keys.
     */
    private buildWSADMover(camera:FreefloatCamera, options:CameraMoverOptions) : WSADCameraMover {

        return new WSADCameraMover(camera);
    }

    /**
     *  Build a camera mover that reacts to mouse wheel and lifts the camera up and down.
     */
    private buildWheelLifter(camera:FreefloatCamera, options:CameraMoverOptions) : WheelLifterCameraMover {

        return new WheelLifterCameraMover(camera);
    }
};