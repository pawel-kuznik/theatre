import { Emitter } from "@pawel-kuznik/iventy";
import { Raycaster, Vector2 } from "three";
import Actor from "../Actor";
import ActorsHolder from "../ActorsHolder";
import Camera from "../Camera";
import buildPickEventData from "./buildPickEventData";
import CameraPicker from "./CameraPicker";
import { InstantiatedActor } from "../InstantiatedActor";
import { RenderSize } from "../RenderSize";
import { RenderStep } from "../RenderStep";

/**
 *  This is a class that allows the user to pick actors with mouse. Useful in strategy games
 *  or similar.
 */
export default class CameraMousePicker extends Emitter implements CameraPicker {

    /**
     *  The raycaster that will do the checking.
     */
    private readonly _raycaster:Raycaster = new Raycaster();

    private _point: Vector2 = new Vector2(0, 0);
    private _toPick: boolean = false;

    /**
     *  The constructor.
     */
    constructor(private readonly _camera:Camera, private readonly _actorsHolder:ActorsHolder, private readonly _renderSize: RenderSize) {

        super();
    }

    renderUpdate(step: RenderStep): void {
     
        if (!this._toPick) return;

        const objects = this._actorsHolder.actors.map((actor:Actor|InstantiatedActor) => actor.object);

        this._raycaster.setFromCamera(this._point, this._camera.native);

        const intersections = this._raycaster.intersectObjects(objects, true);

        this.trigger('pick', buildPickEventData(intersections, this._actorsHolder));

        this._toPick = false;
    }

    /**
     *  Handle mouse event and try to pick actors.
     */
    handlePointer(event:PointerEvent) {

        if (event.type !== 'click') return;

        // only handle primary button clicks
        if (event.button !== 0) return;

        this._point.x = (event.offsetX / this._renderSize.width) * 2 - 1;
        this._point.y = - (event.offsetY / this._renderSize.height) * 2 + 1;

        this._toPick = true;
    }
};