import Camera from "../Camera";

/**
 *  The base interface all camera movers needs to adhere to.
 */
export default interface CameraMover {

    /**
     *  Handle a user input event.
     */
    handle(event:KeyboardEvent|MouseEvent, camera:Camera) : void;
};