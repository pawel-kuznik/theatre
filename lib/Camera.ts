import { Camera as ThreeJSCamera, Vector3 } from "three";
import RenderParticipant from "./RenderParticipant";
import { EmitterLike } from "@pawel-kuznik/iventy";
/**
 *  An interface describing a camera in the theatre.
 */
export default interface Camera extends RenderParticipant, EmitterLike {

    /**
     *  Get access to the Three.js camera instance.
     */
    get native() : ThreeJSCamera;

    /**
     *  Did camera moved in this render pass?
     */
    get moved() : boolean;

    /**
     *  The position of the camera.
     */
    get x() : number;
    get y() : number;

    /**
     *  Get the height on which the camera resides.
     */
    get heigth() : number;

    /**
     *  Handle an input event related to the camera.
     */
    handlePointer(event:KeyboardEvent|PointerEvent|WheelEvent) : void;

    /**
     *  Update camera aspect ratio.
     */
    updateAspectRatio(aspectRatio:number) : void;

    /**
     *  At which point the camera is looking at.
     */
    getLookAt() : Vector3;

    /**
     *  Move camera to given position.
     */
    moveTo(x: number, y: number, z: number|undefined) : void;
};