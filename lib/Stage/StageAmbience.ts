import { AmbientLight, Scene } from "three";
import Occupant from "../Occupant";
import StageAmbienceProperties from "../StageAmbienceProperties";

/**
 *  This is a class that provides ambience for the stage. This includes
 *  ambient lightning and possible ambience objects (like a world box
 *  or similar).
 */
export default class StageAmbience implements Occupant {

    private _ambientLight:AmbientLight;

    constructor(properties:StageAmbienceProperties) {

        this._ambientLight = new AmbientLight(properties.ambientColor);
    }

    /**
     *  Occupy/mount scene ambience.
     */
    occupy(scene: Scene): void {

        scene.add(this._ambientLight);
    }

    /**
     *  Vacate/unmount the scene.
     */
    vacate(): void {

        this._ambientLight.removeFromParent();
    }
};