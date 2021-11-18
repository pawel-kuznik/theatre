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
    private _scene:Scene = new Scene();

    /**
     *  The actors.
     */
    private _actors:Set<Actor> = new Set();

    /**
     *  Get the current stage scene.
     */
    get scene() : Scene { return this._scene; }

    /**
     *  The the current actors of the scene.
     */
    get actors() : Array<Actor> { return [...this._actors]; }
};