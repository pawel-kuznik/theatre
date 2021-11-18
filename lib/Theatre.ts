import Stage from "./Stage";
import Warderobe from "./Warderobe";

export default class Theatre {

    /**
     *  The warderobe for the theathre.
     */
    private _warderobe:Warderobe = new Warderobe();

    /**
     *  The current stage.
     */
    private _stage:Stage = new Stage();

};