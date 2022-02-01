import { Camera as ThreeJSCamera } from "three";
/**
 *  An interface describing a camera in the theatre.
 */
export default interface Camera {

    /**
     *  Get access to the Three.js camera instance.
     */
     get native() : ThreeJSCamera;

    // @todo add a renderUpdate() method that would be called inside the rendering loop
    // and update the camera position and so on.

    /**
     *  Handle an input event related to the camera.
     */
    handle(event:KeyboardEvent|MouseEvent) : void;

    /**
     *  Update camera aspect ratio.
     */
    updateAspectRatio(aspectRatio:number) : void;
};