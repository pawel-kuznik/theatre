import { Emitter } from "iventy";
import { InstancedMesh, Intersection, Object3D, Raycaster, Vector2 } from "three";
import Actor from "../Actor";
import ActorIntersection from "../ActorIntersection";
import ActorsHolder from "../ActorsHolder";
import Camera from "../Camera";

/**
 *  This is a class that allows the user to pick actors with mouse. Useful in strategy games
 *  or similar.
 */
export default class CameraMousePicker extends Emitter {

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
    handle(event:MouseEvent) {

        if (event.type !== 'click') return;

        const screenClick = new Vector2((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);

        this._raycaster.setFromCamera(screenClick, this._camera.native);

        const objects = this._actorsHolder.actors.map((actor:Actor) => actor.object);

        const intersections = this._raycaster.intersectObjects(objects, true).map((value:Intersection<Object3D>) => {

            const actor = this._actorsHolder.fetch(value.object.uuid);
            const child = value.object instanceof InstancedMesh ? value.instanceId : undefined;

            if (!actor) return undefined;

            return new ActorIntersection(actor, child);
        }).filter((value:ActorIntersection|undefined) => !!value);

        this.trigger('pick', { intersections });
    }
};