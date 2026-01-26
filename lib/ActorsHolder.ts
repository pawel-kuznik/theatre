import Actor from "./Actor";
import { InstancedActor } from "./InstancedActor";

/**
 *  This is an interface that descibes an entity holding actors.
 */
export default interface ActorsHolder {

    /**
     *  The actors inside the holder.
     */
    get actors() : Array<Actor|InstancedActor>;

    /**
     *  Fetch an actor by uuid of it's main object.
     */
    fetch(uuid:string) : Actor|InstancedActor|undefined;
}