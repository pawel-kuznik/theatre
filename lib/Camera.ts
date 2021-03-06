import { Camera as ThreeJSCamera, Vector3 } from "three";
import RenderParticipant from "./RenderParticipant";
/**
 *  An interface describing a camera in the theatre.
 */
export default interface Camera extends RenderParticipant {

    /**
     *  Get access to the Three.js camera instance.
     */
    get native() : ThreeJSCamera;

    /**
     *  Did camera moved in this render pass?
     */
    get moved() : boolean;

    /**
     *  Handle an input event related to the camera.
     */
    handle(event:KeyboardEvent|PointerEvent|WheelEvent) : void;

    /**
     *  Update camera aspect ratio.
     */
    updateAspectRatio(aspectRatio:number) : void;

    /**
     *  At which point the camera is looking at.
     */
    getLookAt() : Vector3;
};