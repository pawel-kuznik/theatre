import { Intersection, Object3D, Vector3 } from "three";
import Actor from "./Actor";
import { InstantiatedActor } from "./InstantiatedActor";

/**
 *  This is a structure that we get when we intersect something with an actor. This is useful,
 *  cause in some cases the intersection is made with a specific subobject of the actor and
 *  we want to know about it.
 */
export default class ActorIntersection {

    private _intersection: Intersection<Object3D>;

    get intersection(): Intersection<Object3D> { return this._intersection; }
    get position() : Vector3 { return this._intersection.point; }

    constructor(
        intersection: Intersection<Object3D>,
        public readonly actor:Actor|InstantiatedActor,
        public readonly child:number|undefined = undefined
    ) {
        this._intersection = intersection;
    }
};
