import { Mesh, Object3D } from "three";
import Position from "./Position";
import RenderParticipant from "./RenderParticipant";
import { RenderStep } from "./RenderStep";
import Warderobe from "./Warderobe";

/**
 *  This is a class describing an actor on a stage. This is basically a collection of 3D models
 *  with some light logic around to get the very basic handling of an actors.
 * 
 *  @todo check if Actor should implement Occupant interface.
 */
export default abstract class Actor implements RenderParticipant {

    /**
     *  The actual object that we are dealing with.
     */
    protected _object:Object3D = new Object3D();

    /**
     *  Get the object associated with the actor.
     */
    get object() : Object3D { return this._object; }

    /**
     *  Get access to the position.
     */
    get position() : Position { return new Position(this._object.position); }

    /**
     *  The UUID of the top object.
     */
    get renderUUID() : string { return this.object.uuid || ''; }

    /**
     *  A function that is called to initialize the main object
     *  of the actor.
     */
    protected abstract _initObject(warderobe:Warderobe) : Object3D;

    /**
     *  A method to dispose actor's object.
     */
    protected _disposeObject() : void {

        for (let child of this._object.children) {

            if (child instanceof Mesh) {

                child.geometry.dispose();

                // @todo figure out if the material is owned by the actor. If so,
                // we need to dispose it.
            }
        }
    }

    /**
     *  A method called after the actor is hydrated. It might be that the child class
     *  has some special logic to wrap up initialization.
     */
    protected _afterHydrate() {

        // ... nothing really. The child class can implement special logic if it wishes.
    }

    /**
     *  A method to make a render update.
     */
    renderUpdate(step: RenderStep): void {

        // nothing. This one is to implement by extending classes when they need animations
    }

    /**
     *  Hydrate the actor with needed data from the top-most resouce holders. This
     *  can be done when everything is loaded and this method should be synchronous.
     * 
     *  This method doesn't do much, but makes sure that current object
     *  can be reinitialized.
     */
    hydrate(warderobe:Warderobe) : void {

        const parentObject = this._object.parent;
        const oldObject = this._object;

        this.detach();
        this._disposeObject();

        this._object = this._initObject(warderobe);

        this._object.position.x = oldObject.position.x;
        this._object.position.y = oldObject.position.y;
        this._object.position.z = oldObject.position.z;

        parentObject?.add(this._object);

        this._afterHydrate();
    }

    /**
     *  Move actor to given spacial coordinates.
     */
    moveTo(x:number, y:number, z:number|undefined = undefined) {

        this._object.position.x = x;
        this._object.position.y = y;

        if (z !== undefined) this._object.position.z = z;
    }

    /**
     *  Detach the actor
     */
    detach() : void {

        this._object.removeFromParent();
    }

    /**
     *  Attach the actor to a parent object.
     */
    attachTo(parent:Object3D) {

        parent.add(this._object);
    }

    /**
     *  Dispose of the data allocated by the actor.
     */
    dispose() : void {

        this._disposeObject();   
    }
};