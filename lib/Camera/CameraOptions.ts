/**
 *  Options shared by all camera types.
 */
export default interface CameraOptions {

    /**
     *  The type of the camera.
     */
    type:'topdown';

    /**
     *  The limit of near vision.
     */
    near?: number;

    /**
     *  The Field of View angle.
     */
    fov?: number;

    /**
     *  The limit of far vision.
     */
    far?: number;
};