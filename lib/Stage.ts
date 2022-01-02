import { Scene } from "three";
import Actor from './Actor';

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
     *  The the current actors of the scene.
     */
    get actors() : Array<Actor> { return [...this._actors]; }
};