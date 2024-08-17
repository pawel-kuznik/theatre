import { Emitter } from "@pawel-kuznik/iventy";
import { RenderStep } from "../RenderStep";
import CameraMover from "./CameraMover";
import { CameraTracker } from "./CameraTracker";
import FreefloatCamera from "./FreefloatCamera";

/**
 *  This is a camera mover that handlers lifting camera up/down in reaction
 *  to a mouse wheel wheel.
 */
export default class WheelLifterCameraMover extends Emitter implements CameraMover {

    /**
     *  The target position the mover aims to move the camera to.
     */
    private _target:number|undefined;

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
     *  The speed of the camera in render units.
     */
    private readonly _speed:number = 0.5;

    /**
     *  The minimal and maximal height the camera could be on.
     */
    private _minHeight:number = 1;
    private _maxHeight:number = 500;

    /**
     *  The constructor.
     */
    public constructor (private readonly _camera:FreefloatCamera, private readonly _tracker?: CameraTracker) {
        super();

        if (this._tracker) this._tracker.bubbleTo(this);
    }

    /**
     *  Handle input event.
     */
    public handlePointer(event:KeyboardEvent|PointerEvent|WheelEvent) {

        if (event.type !== 'wheel') return;

        const wheelEvent = event as WheelEvent;

        // if the control, shift, or alt key are pressed, we don't handle. This is cause
        // there might be other actions associated with these combinations and as long as
        // we don't have an explicit configuration to enable them, we want to opt out from
        // handling these cases.
        if (wheelEvent.ctrlKey || wheelEvent.shiftKey || wheelEvent.altKey) return;

        // if the wheel happens on an element that is not controlled by the theatre, then
        // we don't want to do any camera lifting.
        const target = wheelEvent.target as HTMLElement;
        console.log(target);
        if (!target.closest("[data-theatre]")) return;

        const delta = wheelEvent.deltaY;

        let position = this._target !== undefined ? this._target : this._camera.height;

        this._target = position + delta * this._speed;

        this._target = Math.max(this._minHeight, this._target);
        this._target = Math.min(this._maxHeight, this._target);

        this._begin = performance.now();
        this._final = performance.now() + this._smoothing;
    }

    /**
     *  Update the mover with render update. 
     */
    public renderUpdate(step: RenderStep): void {
        
        if (!this._target || !this._final || !this._begin) return;

        if (step.now > this._final) {

            this._begin = undefined;
            this._final = undefined;
            this._target = undefined;

            return;
        }

        const factor = step.difference / this._smoothing;
        this._camera.liftBy((this._target - this._camera.height) * factor);

        if (this._tracker) this._tracker.notify(this._camera.native.position);
    }
};