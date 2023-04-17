import { BoxGeometry, BufferGeometry, Color, DynamicDrawUsage, InstancedMesh, Material, Matrix4, MeshBasicMaterial, Object3D, Vector3 } from "three";
import Warderobe from "./Warderobe";
import RenderParticipant from "./RenderParticipant";
import { RenderStep } from "./RenderStep";

/**
 *  This a variation on an actor that allows to render a lot of actors in one draw call.
 *  Meaning, it makes it performant when dealing with a lot of actors that have same
 *  geometry and material.
 */
export abstract class InstantiatedActor implements RenderParticipant {

    private _mesh: InstancedMesh = new InstancedMesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial({ color: 0x55ffcc }), 1);

    /**
     *  The max number of actors to show in the scene. 
     */
    private _count: number;

    protected get count() { return this._count; }

    protected abstract _initGoemetry(warderobe: Warderobe) : BufferGeometry;

    protected abstract _initMaterial(warderobe: Warderobe) : Material;

    /**
     *  The UUID of the top object.
     */
    get renderUUID() : string { return this._mesh?.uuid || ''; }

    get object() : Object3D { return this._mesh; }

    constructor(count: number) {
        this._count = count;
    }

    /**
     *  Initialize the instance.
     */
    protected _init(warderobe: Warderobe) : InstancedMesh {

        const geometry = this._initGoemetry(warderobe);
        const material = this._initMaterial(warderobe);

        const mesh = new InstancedMesh(geometry, material, this._count);

        // this line will make sure that the mesh will be updated every frame.
        // @todo this might need to be an option
        mesh.instanceMatrix.setUsage( DynamicDrawUsage );

        return mesh;
    }

    /**
     *  Hydrate the actor with needed data from the top-most resouce holders. This
     *  can be done when everything is loaded and this method should be synchronous.
     * 
     *  This method doesn't do much, but makes sure that current object
     *  can be reinitialized.
     */
    hydrate(warderobe:Warderobe) : void {

        const parentObject = this._mesh?.parent;
        const oldObject = this._mesh;

        this._disposeObject();

        this._mesh = this._init(warderobe);

        if (oldObject) {
            this._mesh.position.x = oldObject.position.x;
            this._mesh.position.y = oldObject.position.y;
            this._mesh.position.z = oldObject.position.z;
        }

        parentObject?.add(this._mesh);

        this._afterHydrate();
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
    public renderUpdate(step: RenderStep): void {
        // nothing. This can be implemented in extending class for custom logic.
    }

    /**
     *  A method to dispose actor's object.
     */
    protected _disposeObject() : void {

        this._mesh.dispose();
    }

    /**
     *  Detach the actor
     */
    detach() : void {

        this._mesh.removeFromParent();
    }

    /**
     *  Attach the actor to a parent object.
     */
    attachTo(parent:Object3D) {

        if (!this._mesh) return;
        parent.add(this._mesh);
    }

    /**
     *  Dispose of the data allocated by the actor.
     */
    dispose() : void {

        this._disposeObject();
    }

    /**
     *  Get position of an instance of the actor.
     */
    getPositionAt(index: number) : Vector3|undefined {

        if (index >= this._count) return undefined

        const matrix = new Matrix4();
        this._mesh.getMatrixAt(index, matrix);
        
        return new Vector3().setFromMatrixPosition(matrix); 
    }

    /**
     *  Set position of an instance of an actor.
     */
    setPositionAt(index: number, position: Vector3) {

        if (index >= this._count) return undefined

        const matrix = new Matrix4();
        this._mesh.getMatrixAt(index, matrix);

        matrix.setPosition(position);

        this._mesh.setMatrixAt(index, matrix);
        this._mesh.updateMatrix();
        this._mesh.instanceMatrix.needsUpdate = true;
    } 

    /**
     *  Set color of an instance of an actor.
     */
    setColorAt(index: number, color: Color) {

        if (index >= this._count) return undefined
        
        this._mesh.setColorAt(index, color);
        this._mesh.instanceMatrix.needsUpdate = true;
    }
};
