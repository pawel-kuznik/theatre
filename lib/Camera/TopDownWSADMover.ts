import Camera from "../Camera";

/**
 *  This is a camera mover that controls the camera based on pressing WSAD
 *  keys and move the camera in a top-down position.
 */
export default class TopDownWSADCameraMover {

    /**
     *  The constructor.
     */
    public constructor (private readonly _camera:Camera) { }

    /**
     *  Handle input event.
     */
    public handle(e:Event) {

        if (e.type !== 'keydown') return;

        const event = e as KeyboardEvent;

        // @todo here we should have a way to identify the action based on a character code.

        console.log(event.code);
    }
};