import { BoxGeometry, MeshBasicMaterial, Mesh, Event, Object3D } from "three";
import Actor from "./Actor";

/**
 *  This is a class to test stuff around when we are developing code.
 */
export default class CompanionActor extends Actor {

    protected _initObject(): Object3D {

        const geometry = new BoxGeometry(1, 1, 1);
        const material = new MeshBasicMaterial({ color: 'red' });

        return new Mesh(geometry, material);   
    }
};