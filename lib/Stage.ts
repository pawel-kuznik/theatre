import { BoxGeometry, Mesh, MeshBasicMaterial, Scene } from "three";
import Actor from './Actor';
import StageAmbience from "./Stage/StageAmbience";
import StageAmbienceProperties from "./StageAmbienceProperties";

/**
 *  This is the stage. This class represents the scene as well as definition for
 *  lights and actors.
 */
export default class Stage {

    /**
     *  The current scene of the stage.
     */
    public readonly scene:Scene = new Scene();

    /**
     *  The actors.
     */
    private readonly _actors:Set<Actor> = new Set();

    /**
     *  The current scene ambience.
     */
    private _ambience:StageAmbience|null = null;

    constructor() {

        const g = new BoxGeometry(1, 1, 1);
        const m = new MeshBasicMaterial({ color: 0x0000ff });
        const b = new Mesh(g, m);

        this.scene.add(b);
    }

    /**
     *  The the current actors of the scene.
     */
    get actors() : Array<Actor> { return [...this._actors]; }

    /**
     *  Set Ambience.
     */
    setAmbience(props:StageAmbienceProperties) : void {

        if (this._ambience) this._ambience.vacate();

        this._ambience = new StageAmbience(props);
        this._ambience.occupy(this.scene);
    }
};