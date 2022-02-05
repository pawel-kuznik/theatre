import { Vector3 } from "three";
import Actor from "../Actor";
import ActorTransition from "../ActorTransition";
import { RenderStep } from "../RenderStep";

export default class Translation implements ActorTransition {

    private _begin:DOMHighResTimeStamp|undefined;

    /**
     *  The constructor.
     * 
     *  The duration is in miliseconds.
     */
    constructor(public readonly actor:Actor, public readonly initial:Vector3, public readonly finish:Vector3, public readonly duration:number) { }

    /**
     *  Start the translation.
     */
    start() : void {

        this._begin = performance.now();
    }

    /**
     *  Handle render updates.
     */
    renderUpdate(step: RenderStep): void {

        if (!this._begin) return;

        if (this._begin + this.duration < step.now) {

            this._begin = undefined;

            return;
        }

        const factor = (step.difference) / (this.duration);

        const move = this.finish.sub(this.initial).multiplyScalar(factor);

        this.actor.position.vector.add(move);
    }
};