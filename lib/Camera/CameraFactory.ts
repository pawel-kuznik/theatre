import Camera from "../Camera";
import CameraOptions from "./CameraOptions";
import TopDownCamera from "./TopDownCamera";
/**
 *  A special class to create a camera based
 *  on provided camera options.
 */
export default class CameraFactory {

    /**
     *  The constructor.
     */
    constructor(private readonly _options:CameraOptions) {

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

        return new TopDownCamera(this._options);
    }
};