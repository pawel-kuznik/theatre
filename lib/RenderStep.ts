/**
 *  This is an interface describing a render step. This means
 *  from the previous render update till now.
 */
export class RenderStep {

    /**
     *  The constructor.
     */
    constructor(public readonly prev:DOMHighResTimeStamp, public readonly now:DOMHighResTimeStamp) { }

    /**
     *  Get the difference between the two timestamops.
     */
    get difference() : number { return this.now.valueOf() - this.prev.valueOf(); }

    /**
     *  Proceed to the next step.
     */
    proceed(next:DOMHighResTimeStamp) : RenderStep {

        return new RenderStep(this.now, next);
    }
};