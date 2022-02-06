import { AmbientLight, CameraHelper, DirectionalLight, Scene, Vector3 } from "three";
import Occupant from "../Occupant";
import StageAmbienceProperties from "../StageAmbienceProperties";

/**
 *  This is a class that provides ambience for the stage. This includes
 *  ambient lightning and possible ambience objects (like a world box
 *  or similar).
 */
export default class StageAmbience implements Occupant {

    private _ambientLight:AmbientLight;

    private _overheadLight:DirectionalLight;

    constructor(properties:StageAmbienceProperties) {

        this._ambientLight = new AmbientLight(properties.ambientColor, .5);

        this._overheadLight = new DirectionalLight(0xffffff, .5);
        this._overheadLight.position.set(0, 0, 10000);
        this._overheadLight.lookAt(new Vector3(0, 0, 0));
        this._overheadLight.castShadow = true;

        this._overheadLight.shadow.mapSize.width = 512;
        this._overheadLight.shadow.mapSize.height = 512;
        this._overheadLight.shadow.camera.near = 0.5;
        this._overheadLight.shadow.camera.far = 150000;
        this._overheadLight.shadow.camera.position.set(0, 0, 10000);
    }

    /**
     *  Occupy/mount scene ambience.
     */
    occupy(scene: Scene): void {

        scene.add(this._ambientLight);
        scene.add(this._overheadLight);
    }

    /**
     *  Vacate/unmount the scene.
     */
    vacate(): void {

        this._ambientLight.removeFromParent();
        this._overheadLight.removeFromParent();
    }
};