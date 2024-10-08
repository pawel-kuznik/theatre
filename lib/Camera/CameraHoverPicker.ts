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
 export default class CameraHoverPicker extends Emitter implements CameraPicker {

    /**
     *  The raycaster that will do the checking.
     */
    private readonly _raycaster:Raycaster = new Raycaster();

    /**
     *  The last pointer event that qualifies for hover pick event.
     */
    private _lastPointerEvent: PointerEvent | undefined;

    /**
     *  Is the picker enabled?
     */
    private _enabled: boolean = true;

    /**
     *  The constructor.
     */
    constructor(private readonly _camera:Camera, private readonly _actorsHolder:ActorsHolder, private readonly _renderSize: RenderSize) {
        super();
    }

    enable() {

        this._enabled = true;
    }

    disable() {

        this._enabled = false;
    }

    restrictLayers(layers: number[]) {

        this._raycaster.layers.disableAll();

        for (let layer of layers) {
            this._raycaster.layers.enable(layer);
        }
    }

    renderUpdate(step: RenderStep): void {
    
        if (!this._lastPointerEvent || !this._enabled) return;

        const event = this._lastPointerEvent;

        const point = new Vector2(
            (event.offsetX / this._renderSize.width) * 2 - 1,
            - (event.offsetY / this._renderSize.height) * 2 + 1
        );

        this._raycaster.setFromCamera(point, this._camera.native);

        const objects = this._actorsHolder.actors
            .map((actor:Actor|InstantiatedActor) => actor.object);

        const intersections = this._raycaster.intersectObjects(objects, true);

        this.trigger('hover', buildPickEventData(intersections, this._actorsHolder, event));
    }

    /**
     *  Handle mouse event and try to pick actors.
     */
    handlePointer(event:PointerEvent) {

        // is it pointer move? and no buttons are pressed?
        if (event.type !== 'pointermove' || event.button !== -1) return;

        // the actual handling has to happen in the render step to make sure that
        // the handling occurs a the same speed as the rendering. 
        this._lastPointerEvent= event;
    }
};