import Actor from "./Actor";
import ActorsHolder from "./ActorsHolder";
import EmptyStage from "./EmptyStage";
import { InstantiatedActor } from "./InstantiatedActor";
import RenderParticipant from "./RenderParticipant";
import { RenderStep } from "./RenderStep";
import Stage from "./Stage";

/**
 *  This is a special class that makes sure there is always
 *  a stage and allows for switching between stages. The switch
 *  can be done with a specific transition or loading state
 *  which is not a stage of itself.
 * 
 *  @todo   make the transition/loader
 */
export default class StageContainer implements RenderParticipant, ActorsHolder {
    
    
    /**
     *  The current stage.
     */
    private _stage:Stage = new EmptyStage();

    /**
     *  Expose the stage.
     */
    get stage() : Stage { return this._stage; }

    /**
     *  The actors inside this container.
     */
    get actors(): Array<Actor|InstantiatedActor> { return this._stage.actors; } 

    /**
     *  Mount new stage. A promise of fully mounted stage is returned.
     *  This promise resolves when the provided stage is fully loaded.
     */
    mount(stage:Stage) : Promise<void> {
        
        this._stage = stage;

        return Promise.resolve();
    }

    /**
     *  Fetch an actor by it's object uuid.
     */
    fetch(uuid: string): Actor | InstantiatedActor | undefined {

        return this._stage.fetch(uuid);
    }

    /**
     *  Make a render update.
     */
    renderUpdate(step: RenderStep): void {
        
        this._stage.renderUpdate(step);
    }
};