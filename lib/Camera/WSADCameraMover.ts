import CameraMover from "./CameraMover";
import FreefloatCamera from "./FreefloatCamera";

/**
 *  This is a camera mover that controls the camera based on pressing WSAD
 *  keys and move the camera in a top-down position.
 */
export default class WSADCameraMover implements CameraMover {

    /**
     *  The constructor.
     */
    public constructor () { }

    /**
     *  Handle input event.
     */
    public handle(event:KeyboardEvent|MouseEvent, camera:FreefloatCamera) {

        if (event.type === 'keydown') {

            const keyboardEvent = event as KeyboardEvent;

            if (keyboardEvent.code === 'KeyA') camera.moveBy(-1, 0);
            if (keyboardEvent.code === 'KeyD') camera.moveBy(1, 0);
            if (keyboardEvent.code === 'KeyW') camera.moveBy(0, -1);
            if (keyboardEvent.code === 'KeyS') camera.moveBy(0, 1);
        }
    }
};