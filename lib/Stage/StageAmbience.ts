import { AmbientLight, CameraHelper, DirectionalLight, Scene, Vector3 } from "three";
import Camera from "../Camera";
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

    private _shadowsRange: number;

    constructor(properties:StageAmbienceProperties) {

        this._ambientLight = new AmbientLight(properties.ambientColor, .5);

        this._shadowsRange = properties.shadowsRange || 10;

        this._overheadLight = new DirectionalLight(0xffffff, .5);
        this._overheadLight.position.set(0, 0, properties.overheadCeiling || 10);
        this._overheadLight.lookAt(new Vector3(0, 0, 0));
        this._overheadLight.castShadow = true;

        this._overheadLight.shadow.mapSize.width = 512;
        this._overheadLight.shadow.mapSize.height = 512;
        this._overheadLight.shadow.camera.near = 0;
        this._overheadLight.shadow.camera.far = 250;

        this._overheadLight.shadow.camera.left = -this._shadowsRange;
        this._overheadLight.shadow.camera.right = this._shadowsRange;
        this._overheadLight.shadow.camera.top = this._shadowsRange;
        this._overheadLight.shadow.camera.bottom = -this._shadowsRange;
    }

    /**
     *  Update shadow camera to be in-line with another camera.
     */
    updateShadowCamera(camera:Camera) { 

        // @todo: at height 10 we want to have a radius of 10 units around the camera with
        // shadows. This however is very specific to top-down camera and we will need
        // a different ration for cameras dealing with first person view.
        // Or we could ask the camera what kind of radius of shadows it wants...
        const radius = Math.max(this._shadowsRange * (camera.native.position.z / this._shadowsRange), this._shadowsRange / 2);

        // to make sure that the shadows render we need to "move" the frustrum (field of view)
        // of the shadow camera to match our actual camera. However, we don't want to move
        // the directional light. 
        this._overheadLight.shadow.camera.left = -radius * 2 + camera.native.position.x;
        this._overheadLight.shadow.camera.right = radius * 2 + camera.native.position.x;
        this._overheadLight.shadow.camera.top = radius + camera.native.position.y;
        this._overheadLight.shadow.camera.bottom = -radius + camera.native.position.y;

        // @todo check if this makes performance issues?
        this._overheadLight.shadow.camera.updateProjectionMatrix();
    }

    /**
     *  Occupy/mount scene ambience.
     */
    occupy(scene: Scene): void {

        scene.add(this._ambientLight);
        scene.add(this._overheadLight);
        scene.add(this._overheadLight.target);

        // @debug this is useful when debugging shadow camera
        // scene.add(new CameraHelper(this._overheadLight.shadow.camera));
    }

    /**
     *  Vacate/unmount the scene.
     */
    vacate(): void {

        this._ambientLight.removeFromParent();
        this._overheadLight.removeFromParent();
    }
};