import { BoxGeometry } from "three";
import Actor from "./Actor";

export default class CompanionActor extends Actor {

    constructor() {

        super();

        const geometry = new BoxGeometry(1, 1, 1);
        

        this._object.add()
    }
};