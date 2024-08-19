import RenderParticipant from "../RenderParticipant";

/**
 *  An interface that describes all sorts of ways of picking up actors from from
 *  the camera.
 */
export default interface CameraPicker extends RenderParticipant {

    /**
     *  Handle a pointer event.
     */
    handlePointer(event:PointerEvent) : void;
};