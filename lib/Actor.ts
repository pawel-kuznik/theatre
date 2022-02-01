import { Mesh, Object3D, UnsignedShort4444Type } from "three";
import Position from "./Position";

/**
 *  This is a class describing an actor on a stage. This is basically a collection of 3D models
 *  with some light logic around to get the very basic handling of an actors.
 */
export default abstract class Actor {

    /**
     *  The actual object that we are dealing with.
     */
    protected readonly _object:Object3D = this._initObject();

    /**
     *  Get access to the position.
     */
    get position() : Position { return new Position(this._object.position); }

    /**
     *  A function that is called to initialize the main object
     *  of the actor.
     */
    protected abstract _initObject() : Object3D;

    /**
     *  Move actor to given spacial coordinates.
     */
    moveTo(x:number, y:number, z:number|undefined = undefined) {

        this._object.position.x = x;
        this._object.position.y = y;

        if (z !== undefined) this._object.position.z;
    }

    /**
     *  Detach the actor
     */
    detach() : void {

        this._object.removeFromParent();
    }

    /**
     *  Attach the actor to a parent object.
     */
    attach(parent:Object3D) {

        parent.add(this._object);
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