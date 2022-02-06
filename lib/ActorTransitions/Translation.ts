import { Vector3 } from "three";
import Actor from "../Actor";
import ActorTransition from "../ActorTransition";
import { RenderStep } from "../RenderStep";

export default class Translation implements ActorTransition {

    private _begin:DOMHighResTimeStamp|undefined;

    private _initial:Vector3|undefined = undefined;

    private _providedInitial:Vector3|undefined = undefined;

    /**
     *  The constructor.
     * 
     *  The duration is in miliseconds.
     * 
     *  When the initial position is not supplied, the transition will take the current position
     *  of the actor at the time of the start.
     */
    constructor(public readonly actor:Actor, public readonly duration:number, public readonly finish:Vector3, initial:Vector3|undefined = undefined) {

        this._providedInitial = initial;
    }

    /**
     *  Is the transition active?
     */
    get active() : boolean { return !!this._begin; }

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

            this.actor.position.vector.copy(this.finish);

            this._initial = undefined;

            return;
        }

        if (this._initial === undefined) this._initial = this._providedInitial || this.actor.position.vector.clone();

        const factor = (step.difference) / (this.duration);

        const move = this.finish.clone().sub(this._initial).multiplyScalar(factor);

        this.actor.position.vector.add(move);
    }
};