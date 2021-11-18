import { Object3D } from "three";
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
};