import { InstancedMesh, Intersection, Object3D } from "three";
import Actor from "../Actor";
import ActorIntersection from "../ActorIntersection";
import ActorsHolder from "../ActorsHolder";

/**
 *  This is a helper function to get the actor based on an intersected object.
 *  We need to check the immediate object but then start looking at the parent
 *  of the handed object cause actors can be constructed out of many objects.
 */
function lookUp(object:Object3D, holder:ActorsHolder) : Actor|null {

    const find = holder.fetch(object.uuid);

    if (find) return find;

    const parent = object.parent;

    if (parent) return lookUp(parent, holder);

    return null;
};

/**
 *  This is a helper function that allows for preparing data for pick-like event
 *  of different CameraPickers.
 */
export default function buildPickEventData(intersections:Array<Intersection<Object3D>>, holder:ActorsHolder) : any {

    const result = intersections.map((value:Intersection<Object3D>) => {

        const actor = lookUp(value.object, holder);

        if (!actor) return undefined;

        const child = value.object instanceof InstancedMesh ? value.instanceId : undefined;

        return new ActorIntersection(actor, child);
    }).filter((value:ActorIntersection|undefined) => !!value);

    return {
        intersections: result,
        first: result[0]
    };
};