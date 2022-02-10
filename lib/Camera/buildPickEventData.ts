import { InstancedMesh, Intersection, Object3D } from "three";
import ActorIntersection from "../ActorIntersection";
import ActorsHolder from "../ActorsHolder";

/**
 *  This is a helper function that allows for preparing data for pick-like event
 *  of different CameraPickers.
 */
export default function buildPickEventData(intersections:Array<Intersection<Object3D>>, holder:ActorsHolder) : any {

    const result = intersections.map((value:Intersection<Object3D>) => {

        const actor = holder.fetch(value.object.uuid);

        if (!actor) return undefined;

        const child = value.object instanceof InstancedMesh ? value.instanceId : undefined;

        return new ActorIntersection(actor, child);
    }).filter((value:ActorIntersection|undefined) => !!value);

    return {
        intersections: result,
        first: result[0]
    };
};