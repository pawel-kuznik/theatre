import RenderParticipant from "./RenderParticipant";

/**
 *  This is a special interface describing a transition that can be performed on an actor.
 */
export default interface ActorTransition extends RenderParticipant {

    /**
     *  Is the transition currently running.
     */
    active : boolean;

    /**
     *  Start transition.
     */
    start() : void;
};