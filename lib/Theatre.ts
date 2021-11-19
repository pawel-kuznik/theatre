import Stage from "./Stage";
import Warderobe from "./Warderobe";

/**
 *  This is the main class that creates the theater and allows
 *  to compose the scene.
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
};