import { Scene } from "three";
import Actor from './Actor';
import ActorsHolder from "./ActorsHolder";
import Camera from "./Camera";
import RenderParticipant from "./RenderParticipant";
import { RenderStep } from "./RenderStep";
import StageAmbience from "./Stage/StageAmbience";
import StageAmbienceProperties from "./StageAmbienceProperties";
import Warderobe from "./Warderobe";

/**
 *  This is the stage. This class represents the scene as well as definition for
 *  lights and actors.
 */
export default class Stage implements RenderParticipant, ActorsHolder {

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

    /**
     *  Cached warderobe.
     */
    private _warderobe:Warderobe|undefined;

    constructor() { }

    /**
     *  Fetch an actor by uuid of it's main object.
     */
    fetch(uuid:string) : Actor|undefined {

        for (let actor of this._actors) {
            
            if (actor.object.uuid === uuid) return actor;
        }

        return undefined;
    }

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

        if (this._warderobe) actor.hydrate(this._warderobe);
    }

    /**
     *  Destroy a target actor residing in this scene. If the actor is not inside
     *  the scene no action will be done.
     */
    destroy(actor:Actor) {

        if (!this._actors.has(actor)) return;

        this._actors.delete(actor);

        actor.detach();
        actor.dispose();
    }

    /**
     *  Hydrate all actors with resources they need to function. This method will
     *  also ensure that all actors inserted into the scene after it's called, will
     *  be hydrated with the same pool of resources.
     */
    hydrate(warderobe:Warderobe) {

        this._warderobe = warderobe;

        for (let actor of this._actors) actor.hydrate(warderobe);
    }

    /**
     *  Update shadow camera to be in-line with another camera.
     */
    updateShadowCamera(camera:Camera) { 

        if (this._ambience) this._ambience.updateShadowCamera(camera);
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