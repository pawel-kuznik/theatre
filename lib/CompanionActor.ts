import { BoxGeometry, MeshBasicMaterial, Mesh } from "three";
import Actor from "./Actor";

/**
 *  This is a class to test stuff around when we are developing code.
 */
export default class CompanionActor extends Actor {

    constructor() {

        super();

        const geometry = new BoxGeometry(1, 1, 1);
        const material = new MeshBasicMaterial({ color: 'red' });

        const mesh = new Mesh(geometry, material);

        this._object.add(mesh);
    }
};