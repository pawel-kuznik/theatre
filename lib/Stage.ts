import { Scene } from "three";
import Actor from './Actor';
import ActorsHolder from "./ActorsHolder";
import Camera from "./Camera";
import RenderParticipant from "./RenderParticipant";
import { RenderStep } from "./RenderStep";
import StageAmbience from "./Stage/StageAmbience";
import StageAmbienceProperties from "./StageAmbienceProperties";
import Warderobe from "./Warderobe";
import { InstancedActor } from "./InstancedActor";
import { HTMLActor } from "./HTMLActor";

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
     *  The instanced actors.
     */
    private readonly _instancedActors: Set<InstancedActor> = new Set();

    /**
     *  The HTML actors.
     */
    private readonly _htmlActors: Set<HTMLActor> = new Set();

    /**
     *  The current scene ambience.
     */
    private _ambience:StageAmbience|null = null;

    /**
     *  Cached warderobe.
     */
    private _warderobe:Warderobe|undefined;

    /**
     *  Fetch an actor by uuid of it's main object.
     */
    fetch(uuid:string) : Actor|InstancedActor|HTMLActor|undefined {

        for (let actor of this._actors) {
            
            if (actor.renderUUID === uuid) return actor;
        }

        for (let actor of this._instancedActors) {

            if (actor.renderUUID === uuid) return actor;
        }

        for (let actor of this._htmlActors) {

            if (actor.renderUUID === uuid) return actor;
        }

        return undefined;
    }

    /**
     *  Make a render update for all actors.
     */
    renderUpdate(step: RenderStep): void {

        for (let actor of this._htmlActors) actor.renderUpdate(step);
        
        for (let actor of this._actors) actor.renderUpdate(step);

        for (let actor of this._instancedActors) actor.renderUpdate(step);
    }

    /**
     *  The the current actors of the scene.
     */
    get actors() : Array<Actor|InstancedActor|HTMLActor> { return [...this._actors, ...this._instancedActors, ...this._htmlActors]; }

    /**
     *  Insert an actor into the scene.
     */
    insert(actor:Actor|InstancedActor|HTMLActor) {

        if (actor instanceof HTMLActor) {

            this._htmlActors.add(actor);
            if (this._warderobe) actor.hydrate(this._warderobe);
            actor.attachTo(this.scene);
        }

        else if (actor instanceof Actor) {

            this._actors.add(actor);
            if (this._warderobe) actor.hydrate(this._warderobe);
            actor.attachTo(this.scene); 
        }

        else if (actor instanceof InstancedActor) {
            
            this._instancedActors.add(actor);
            if (this._warderobe) actor.hydrate(this._warderobe);
            actor.attachTo(this.scene);
        }
    }

    /**
     *  Destroy a target actor residing in this scene. If the actor is not inside
     *  the scene no action will be done.
     */
    destroy(actor:Actor|InstancedActor|HTMLActor) {

        // check for the HTMLActor before we check for the Actor cause HTMLActor
        // inherits from an Actor
        if (actor instanceof HTMLActor) this._htmlActors.delete(actor);
        else if (actor instanceof Actor) this._actors.delete(actor);
        else if (actor instanceof InstancedActor) this._instancedActors.delete(actor);

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

        for (let actor of this._htmlActors) actor.hydrate(warderobe);

    for (let actor of this._actors) actor.hydrate(warderobe);

        for (let actor of this._instancedActors) actor.hydrate(warderobe);
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

    /**
     *  Dispose the scene.
     */
    dispose() {

        for(let actor of this._actors) {
            this.destroy(actor);
        }
        
        for (let actor of this._instancedActors) {
            this.destroy(actor);
        }

        for (let actor of this._htmlActors) {
            this.destroy(actor);
        }

        this._actors.clear();
        this._instancedActors.clear();
        this._htmlActors.clear();

        if (this._ambience) this._ambience.vacate();
    }
};