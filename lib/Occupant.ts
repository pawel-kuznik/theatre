import { Object3D } from "three";

/**
 *  This is a special interface describing an instance that
 *  can be mounted instance a scene or a 3D object. This interface
 *  is meant to provice a way to mount actors or other stage
 *  object inside a scene.
 */
export default interface Occupant {

    /**
     *  Tell the instance to occupy a specific scene or object.
     */
    occupy(scene:Object3D) : void;

    /**
     *  Tell the instance to vacate current parent.
     */
    vacate() : void;
};