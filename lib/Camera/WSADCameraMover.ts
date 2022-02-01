import { RenderStep } from "../RenderStep";
import CameraMover from "./CameraMover";
import FreefloatCamera from "./FreefloatCamera";

interface Position { 
    x:number;
    y:number;
};

/**
 *  This is a camera mover that controls the camera based on pressing WSAD
 *  keys and move the camera in a top-down position.
 */
export default class WSADCameraMover implements CameraMover {

    /**
     *  The target position the mover aims to move the camera to.
     */
    private _target:Position|undefined;

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
    private readonly _speed:number = 1.25;

    /**
     *  How far ahead the target position could be from the current position?
     */
    private readonly _rangeLimit:number = this._speed * 2;

    /**
     *  The constructor.
     */
    public constructor (private readonly _camera:FreefloatCamera) { }

    /**
     *  Handle input event.
     */
    public handle(event:KeyboardEvent|MouseEvent) {

        if (event.type !== 'keydown') return;

        const keyboardEvent = event as KeyboardEvent;

        if (![ 'KeyA', 'KeyD', 'KeyW', 'KeyS' ].includes(keyboardEvent.code)) return;

        const kick = this._target ? 1 : 2.5;
        const position = this._target || { x: this._camera.x, y: this._camera.y };

        if (keyboardEvent.code === 'KeyA') position.x -= this._speed * kick;
        if (keyboardEvent.code === 'KeyD') position.x += this._speed * kick;
        if (keyboardEvent.code === 'KeyW') position.y += this._speed * kick;
        if (keyboardEvent.code === 'KeyS') position.y -= this._speed * kick;

        this._target = {
            x: Math.min(Math.max(position.x, this._camera.x - this._rangeLimit), this._camera.x + this._rangeLimit),
            y: Math.min(Math.max(position.y, this._camera.y - this._rangeLimit), this._camera.y + this._rangeLimit)
        };

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

        const move = { x: (this._target.x - this._camera.x) * factor, y: (this._target.y - this._camera.y) * factor };

        this._camera.moveBy(move.x, move.y);
    }
};