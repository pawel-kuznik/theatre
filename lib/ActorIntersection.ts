import Actor from "./Actor";

/**
 *  This is a structure that we get when we intersect something with an actor. This is useful,
 *  cause in some cases the intersection is made with a specific subobject of the actor and
 *  we want to know about it.
 */
export default class ActorIntersection {

    constructor(public readonly actor:Actor, public readonly child:number|undefined = undefined) { }
}