import { RenderStep } from "./RenderStep";

/**
 *  An interface describing a renderable entity or an instance
 *  that should be keept in renderable loop.
 */
export default interface RenderParticipant {

    /**
     *  A method that would be called when it's needed to pass a render
     *  tick to the entity.
     */
    renderUpdate(step:RenderStep) : void;
};