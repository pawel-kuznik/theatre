/**
 *  An interface that describes all sorts of ways of picking up actors from from
 *  the camera.
 */
export default interface CameraPicker {

    /**
     *  Handle a pointer event.
     */
    handle(event:PointerEvent) : void;
};