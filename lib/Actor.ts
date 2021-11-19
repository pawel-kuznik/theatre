import { Mesh, Object3D } from "three";
import Position from "./Position";

/**
 *  This is a class describing an actor on a stage. This is basically a collection of 3D models
 *  with some light logic around to get the very basic handling of an actors.
 */
export default abstract class Actor {

    /**
     *  The actual object that we are dealing with.
     */
    protected readonly _object:Object3D = new Object3D();

    /**
     *  Get access to the position.
     */
    get position() : Position { return new Position(this._object.position); }

    /**
     *  Detach the actor
     */
    detach() : void {

        this._object.removeFromParent();
    }

    /**
     *  Dispose of the data allocated by the actor.
     */
    dispose() : void {

        for (let child of this._object.children) {

            if (child instanceof Mesh) {

                child.geometry.dispose();

                // @todo figure out if the material is owned by the actor. If so,
                // we need to dispose it.
            }
        }
    }
};