import RendererHandler from "./RendererHandler";
import Stage from "./Stage";
import Warderobe from "./Warderobe";

/**
 *  This is the main class that creates the theater and allows
 *  to compose the scene. The theatre in our case is the whole
 *  3D rendering frame inside a canvas element.
 * 
 *  This class is here to provide a high-level api to everything
 *  that is happening inside the rendering frame:
 *
 *  - scene switching
 *  - defining resources that actors can use
 *  - providing a way to transition actors between scenes
 */
export default class Theatre {

    /**
     *  The warderobe for the theathre.
     */
    public readonly warderobe:Warderobe = new Warderobe();

    /**
     *  The current stage.
     */
    public readonly stage:Stage = new Stage();

    /**
     *  An instance of the renderer, but wrapped in a a cosy handler that
     *  takes care of all canvas-renderer interactions.
     */
    private readonly _rendererHandler:RendererHandler;

    constructor(canvas:HTMLCanvasElement) {

        this._rendererHandler = new RendererHandler(canvas);
    }

    /**
     *  Create a new stage.
     */
    createStage(name:string) : Stage {

        return this.stage;
    }
};