import { BoxGeometry, BufferGeometry, Color, DynamicDrawUsage, Material, Matrix4, MeshBasicMaterial, Object3D, Vector3, InstancedMesh, InstancedBufferAttribute } from "three";
import Warderobe from "./Warderobe";
import RenderParticipant from "./RenderParticipant";
import { RenderStep } from "./RenderStep";

/**
 *  This a variation on an actor that allows to render a lot of actors in one draw call.
 *  Meaning, it makes it performant when dealing with a lot of actors that have same
 *  geometry and material.
 */
export abstract class InstantiatedActor<TMaterial extends Material = Material> implements RenderParticipant {

    // private _mesh: InstancedUniformsMesh<Material> = new InstancedUniformsMesh<Material>(new BoxGeometry(1, 1, 1), new MeshBasicMaterial({ color: 0x55ffcc }), 1);

    /**
     *  The actual mesh of the actor.
     */
    private _mesh: InstancedMesh = new InstancedMesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial({ color: 0x55ffcc }), 1);

    /**
     *  The max number of actors to show in the scene. 
     */
    private _count: number;

    /**
     * The number of instances of the actor.
     */
    public get count() { return this._mesh.count; }

    /**
     * The method that has to be implemented by the child class to initialize the geometry of the actor.
     */
    protected abstract _initGeometry(warderobe: Warderobe) : BufferGeometry;

    /**
     * The method that has to be implemented by the child class to initialize the material of the actor.
     */
    protected abstract _initMaterial(warderobe: Warderobe) : TMaterial;

    /**
     *  The UUID of the top object.
     */
    get renderUUID() : string { return this._mesh?.uuid || ''; }

    /**
     * The object associated with the actor.
     */
    get object() : Object3D { return this._mesh; }

    constructor(count: number) {
        this._count = count;
    }

    /**
     *  Initialize the instance.
     */
    private _init(warderobe: Warderobe) : InstancedMesh<BufferGeometry, TMaterial> {

        const geometry = this._initGeometry(warderobe);
        const material = this._initMaterial(warderobe);

        const mesh = new InstancedMesh<BufferGeometry, TMaterial>(geometry, material, this._count);

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

        this.detach();
        this._disposeObject();

        this._mesh = this._init(warderobe);

        this._mesh.position.x = oldObject.position.x;
        this._mesh.position.y = oldObject.position.y;
        this._mesh.position.z = oldObject.position.z;

        parentObject?.add(this._mesh);

        this._afterHydrate();
    }

    /**
     *  Resize the number of rendered instances.
     */
    resize(newSize: number) {

        // are we dealing with a size that would be bigger than current count of
        // instances meshes? Then we need to create a new instanced mesh.
        if (this._count < newSize) {

            this._count = newSize;

            const parentObject = this._mesh?.parent;
            const oldObject = this._mesh;

            this.detach();
            this._disposeObject();

            this._mesh = new InstancedMesh(oldObject.geometry, oldObject.material, this._count);

            // this line will make sure that the mesh will be updated every frame.
            // @todo this might need to be an option
            this._mesh.instanceMatrix.setUsage( DynamicDrawUsage );

            this._mesh.position.x = oldObject.position.x;
            this._mesh.position.y = oldObject.position.y;
            this._mesh.position.z = oldObject.position.z;

            parentObject?.add(this._mesh);

            this._afterHydrate();            
        }

        else this._mesh.count = newSize;

        this._mesh.updateMatrix();
        this._mesh.instanceMatrix.needsUpdate = true;
        if (this._mesh.instanceColor) this._mesh.instanceColor.needsUpdate = true;
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

        this._mesh.count = 0;
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
        if (this._mesh.instanceColor) this._mesh.instanceColor.needsUpdate = true;
    }

    /**
     * Helper function to determine the size and array representation of a uniform value.
     */
    private getUniformSize(value: any): { itemSize: number, arrayValue: number[] } | null {

        if (typeof value === 'number') {
            return { itemSize: 1, arrayValue: [value] };
        } else if (value.isVector2) {
            return { itemSize: 2, arrayValue: [value.x, value.y] };
        } else if (value.isVector3) {
            return { itemSize: 3, arrayValue: [value.x, value.y, value.z] };
        } else if (value.isVector4 || value.isQuaternion) {
            return { itemSize: 4, arrayValue: [value.x, value.y, value.z, value.w] };
        } else if (value.isColor) {
            return { itemSize: 3, arrayValue: [value.r, value.g, value.b] };
        } else if (Array.isArray(value)) {
            return { itemSize: value.length, arrayValue: value };
        }

        return null;
    }

    /**
     * Set a uniform value for an instance of an actor.
     */
    setUniformAt(index: number, name: string, value: any) {

        if (index >= this._count) return undefined;

        const uniformData = this.getUniformSize(value);

        if (!uniformData) {
            console.warn(`Unsupported uniform type for ${name}`);
            return;
        }

        const { itemSize, arrayValue } = uniformData;
        const attr = this._mesh.geometry.getAttribute(name);

        if (attr instanceof InstancedBufferAttribute) {
            // Update existing attribute
            if (attr.itemSize !== itemSize) {
                console.warn(`Item size mismatch for uniform ${name}: expected ${attr.itemSize}, got ${itemSize}`);
                return;
            }

            for (let i = 0; i < itemSize; i++) {
                attr.setComponent(index, i, arrayValue[i]);
            }
            attr.needsUpdate = true;
        } else {
            // Create a new InstancedBufferAttribute
            const buffer = new Float32Array(this._count * itemSize);

            // Set the value at the specified index
            const offset = index * itemSize;
            for (let i = 0; i < itemSize; i++) {
                buffer[offset + i] = arrayValue[i];
            }

            const newAttr = new InstancedBufferAttribute(buffer, itemSize);
            this._mesh.geometry.setAttribute(name, newAttr);
        }
    }

    /**
     * Unset a uniform value for all instances of an actor.
     */
    unsetUniform(name: string) {
        this._mesh.geometry.deleteAttribute(name);
    }
};
