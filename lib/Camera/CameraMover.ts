import RenderParticipant from "../RenderParticipant";

/**
 *  The base interface all camera movers needs to adhere to.
 */
export default interface CameraMover extends RenderParticipant {

    /**
     *  Handle a user input event.
     */
    handle(event:KeyboardEvent|MouseEvent|WheelEvent) : void;
};