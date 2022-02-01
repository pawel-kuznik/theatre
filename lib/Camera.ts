import { Camera as ThreeJSCamera } from "three";
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
     *  Handle an input event related to the camera.
     */
    handle(event:KeyboardEvent|MouseEvent) : void;

    /**
     *  Update camera aspect ratio.
     */
    updateAspectRatio(aspectRatio:number) : void;
};