import { Emitter } from "@pawel-kuznik/iventy";
import { Raycaster, Vector2 } from "three";
import Actor from "../Actor";
import ActorsHolder from "../ActorsHolder";
import Camera from "../Camera";
import buildPickEventData from "./buildPickEventData";
import CameraPicker from "./CameraPicker";

/**
 *  This is a class that allows the user to pick actors with mouse. Useful in strategy games
 *  or similar.
 */
 export default class CameraHoverPicker extends Emitter implements CameraPicker {

    /**
     *  The raycaster that will do the checking.
     */
    private readonly _raycaster:Raycaster = new Raycaster();

    /**
     *  The constructor.
     */
    constructor(private readonly _camera:Camera, private readonly _actorsHolder:ActorsHolder) {

        super();
    }

    /**
     *  Handle mouse event and try to pick actors.
     */
    handlePointer(event:PointerEvent) {

        if (event.type !== 'pointermove') return;

        if (event.button !== -1) return;

        const screenClick = new Vector2((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);

        this._raycaster.setFromCamera(screenClick, this._camera.native);

        const objects = this._actorsHolder.actors.map((actor:Actor) => actor.object);

        const intersections = this._raycaster.intersectObjects(objects, true);

        this.trigger('hover', buildPickEventData(intersections, this._actorsHolder));
    }
};