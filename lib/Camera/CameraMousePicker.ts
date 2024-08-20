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

    /**
     *  The last pointerevent that qualifies for hover pick event.
     */
    private _lastPointerEvent: PointerEvent | undefined;

    /**
     *  The constructor.
     */
    constructor(private readonly _camera:Camera, private readonly _actorsHolder:ActorsHolder, private readonly _renderSize: RenderSize) {
        super();
    }

    renderUpdate(step: RenderStep): void {
     
        if (!this._lastPointerEvent) return;

        const event = this._lastPointerEvent;

        const point = new Vector2(
            (event.offsetX / this._renderSize.width) * 2 - 1,
            - (event.offsetY / this._renderSize.height) * 2 + 1
        );

        this._raycaster.setFromCamera(point, this._camera.native);

        const objects = this._actorsHolder.actors
            .map((actor:Actor|InstantiatedActor) => actor.object);
        
        const intersections = this._raycaster.intersectObjects(objects, true);

        this.trigger('pick', buildPickEventData(intersections, this._actorsHolder, event));

        this._lastPointerEvent = undefined;
    }

    /**
     *  Handle mouse event and try to pick actors.
     */
    handlePointer(event: PointerEvent) {

        if (event.type !== 'click') return;

        // only handle primary button clicks
        if (event.button !== 0) return;

        this._lastPointerEvent = event;
    }
};