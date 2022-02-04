import { Texture } from "three";
import RenderParticipant from "./RenderParticipant";
import { RenderStep } from "./RenderStep";

/**
 *  This is a class that allows for animating textures like a sprite
 *  sheet animation. The actual map has to be formatted in a strip of animation
 *  steps.
 */
export default class TextureAnimator implements RenderParticipant {

    /**
     *  The current step.
     */
    private _current:number = 0;

    /**
     *  The last time the animator ran.
     */
    private _lastTime:DOMHighResTimeStamp|undefined;

    /**
     *  The constructor.
     */
    constructor(private _texture:Texture, private _size:number) {

        this._texture.repeat.set(1/this._size, 1);
    }

    /**
     *  Update the material map.
     */
    renderUpdate(step: RenderStep): void {

        if (this._lastTime === undefined) this._lastTime = step.prev;

        const current = Math.floor(step.now / 1000) % this._size;

        if (current === this._current) return;

        this._texture.offset.x = current / this._size;

        this._current = current;
    }
};