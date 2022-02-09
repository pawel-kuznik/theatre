import Actor from "./Actor";

/**
 *  This is an interface that descibes an entity holding actors.
 */
export default interface ActorsHolder {

    /**
     *  The actors inside the holder.
     */
    get actors() : Array<Actor>;

    /**
     *  Fetch an actor by uuid of it's main object.
     */
    fetch(uuid:string) : Actor|undefined;
}