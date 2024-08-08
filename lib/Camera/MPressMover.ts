import { Emitter } from "@pawel-kuznik/iventy";
import CameraMover from "./CameraMover";
import { RenderStep } from "../RenderStep";
import FreefloatCamera from "./FreefloatCamera";
import { CameraTracker } from "./CameraTracker";

interface Position { 
    x:number;
    y:number;
};

export default class MPressMover extends Emitter implements CameraMover {

    /**
     *  The target position the mover aims to move the camera to.
     */
    private _target:Position|undefined;

    private readonly _speed:number = .0075;

    /**
     *  The planned start and end of the animation for the camera.
     */
    private _begin:DOMHighResTimeStamp|undefined;
    private _final:DOMHighResTimeStamp|undefined;

    /**
     *  The smoothing of the camera in miliseconds. This is used to define
     *  a time period from the key down till the animation would end. This
     *  should be bigger than the speed at which the keydown repeats + some
     *  more for giving it a slowing down effect.
     */
    private readonly _smoothing:number = 600;

    /**
     *  How far ahead the target position could be from the current position?
     */
    private readonly _rangeLimit:number = this._speed * 8;

    public constructor (private readonly _camera:FreefloatCamera, private readonly _tracker?: CameraTracker) {
        super();

        if (this._tracker) this._tracker?.bubbleTo(this);
    }

    handlePointer(event: KeyboardEvent | PointerEvent | WheelEvent): void {
     
        if (event.type === "pointerdown" && (event as PointerEvent).button === 1 ) this.handlePointerDown(event as PointerEvent);
    }

    renderUpdate(step: RenderStep): void {

        if (!this._target || !this._final || !this._begin) return;

        if (step.now > this._final) {

            this._begin = undefined;
            this._final = undefined;
            this._target = undefined;

            return;
        }

        const factor = step.difference / this._smoothing;

        const move = { x: (this._target.x - this._camera.x) * factor, y: (this._target.y - this._camera.y) * factor };

        this._camera.moveBy(move.x, move.y);

        if (this._tracker) this._tracker.notify(this._camera.native.position);
    }

    private handlePointerDown(event: PointerEvent) {

        const target = event.target as HTMLElement;
        target.setPointerCapture(event.pointerId);

        const moveHandler = (event: PointerEvent) => {

            const kick = this._target ? 1 : 2.5;
            const position = this._target || { x: this._camera.x, y: this._camera.y };
    
            const factor = this._camera.native.position.z;
    
            // const speed = this._speed * factor;
            const speed = this._speed * factor;

            position.x += -1 * speed * event.movementX;
            position.y += speed * event.movementY;
    
            const rangeLimit = this._rangeLimit * factor;
    
            this._target = {
                x: position.x,
                y: position.y
            };
    
            this._begin = performance.now();
            this._final = performance.now() + this._smoothing;
        };

        const upHandler = (event: PointerEvent) => {

            target.removeEventListener("pointerup", upHandler);
            target.removeEventListener("pointermove", moveHandler);

            target.releasePointerCapture(event.pointerId);
        };

        target.addEventListener("pointerup", upHandler);
        target.addEventListener("pointermove", moveHandler);
    }
};
