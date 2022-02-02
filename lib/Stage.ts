import { Scene } from "three";
import Actor from './Actor';
import RenderParticipant from "./RenderParticipant";
import { RenderStep } from "./RenderStep";
import StageAmbience from "./Stage/StageAmbience";
import StageAmbienceProperties from "./StageAmbienceProperties";
import Warderobe from "./Warderobe";

/**
 *  This is the stage. This class represents the scene as well as definition for
 *  lights and actors.
 */
export default class Stage implements RenderParticipant {

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

    constructor() { }

    /**
     *  Make a render update for all actors.
     */
    renderUpdate(step: RenderStep): void {
        
        for (let actor of this._actors) actor.renderUpdate(step);
    }

    /**
     *  The the current actors of the scene.
     */
    get actors() : Array<Actor> { return [...this._actors]; }

    /**
     *  Insert an actor into the scene.
     */
    insert(actor:Actor) {

        this._actors.add(actor);
        actor.attachTo(this.scene);
    }

    /**
     *  Hydrate all actors with resources they need to function.
     */
    hydrate(warderobe:Warderobe) {

        for (let actor of this._actors) actor.hydrate(warderobe);
    }

    /**
     *  Set Ambience.
     */
    setAmbience(props:StageAmbienceProperties) : void {

        if (this._ambience) this._ambience.vacate();

        this._ambience = new StageAmbience(props);
        this._ambience.occupy(this.scene);
    }
};