import ActorTransition from "./ActorTransition";
import RenderParticipant from "./RenderParticipant";
import { RenderStep } from "./RenderStep";

export default class TransitionCycle implements RenderParticipant {

    /**
     *  The current transition in the cycle.
     */
    private _current:number = 0;
    
    /**
     *  The actual cycle of transitions to run.
     */
    private _transitions:Array<ActorTransition> = [];

    /**
     *  Get the current transition.
     */
    get current() : ActorTransition|undefined { return this._transitions[this._current]; }

    /**
     *  Start the cycle.
     */
    start() {

        this.current?.start();
    }

    /**
     *  Add a new transition to the cycle.
     */
    add(transition:ActorTransition) {

        this._transitions.push(transition);
    }

    /**
     *  Clear a specific transition from the cycle.
     */
    clear(transition:ActorTransition) {

        const idx = this._transitions.indexOf(transition);

        if (idx === -1) return;

        if (idx === this._current) this.next();

        this._transitions.splice(idx, 1);
    }

    /**
     *  Immediately proceed to the next transition.
     */
    next() : void {

        if (this._current >= this._transitions.length - 1) this._current = 0;
        else this._current++;

        this.current?.start();
    }

    /**
     *  Make a render update.
     */
    renderUpdate(step: RenderStep): void {

        const transition = this._transitions[this._current];

        if (transition) transition.renderUpdate(step);

        if (!transition.active) this.next();
    }
};