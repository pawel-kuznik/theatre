import RenderParticipant from "./RenderParticipant";

/**
 *  This is a special interface describing a transition that can be performed on an actor.
 */
export default interface ActorTransition extends RenderParticipant {

    /**
     *  Start transition.
     */
    start() : void;
};