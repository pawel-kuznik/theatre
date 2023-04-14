import { EmitterLike } from "@pawel-kuznik/iventy";
import RenderParticipant from "../RenderParticipant";

/**
 *  The base interface all camera movers needs to adhere to.
 */
export default interface CameraMover extends RenderParticipant, EmitterLike {

    /**
     *  Handle a user input event.
     */
    handlePointer(event:KeyboardEvent|PointerEvent|WheelEvent) : void;
};