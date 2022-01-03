import EmptyStage from "./EmptyStage";
import Stage from "./Stage";

/**
 *  This is a special class that makes sure there is always
 *  a stage and allows for switching between stages. The switch
 *  can be done with a specific transition or loading state
 *  which is not a stage of itself.
 * 
 *  @todo   make the transition/loader
 */
export default class StageContainer {
    
    /**
     *  The current stage.
     */
    private _stage:Stage = new EmptyStage();

    /**
     *  Expose the stage.
     */
    get stage() : Stage { return this._stage; }

    /**
     *  Mount new stage. A promise of fully mounted stage is returned.
     *  This promise resolves when the provided stage is fully loaded.
     */
    mount(stage:Stage) : Promise<void> {
        
        this._stage = stage;

        return Promise.resolve();
    }
};