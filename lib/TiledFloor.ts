import { DoubleSide, FrontSide, InstancedMesh, Matrix4, MeshPhongMaterial, PlaneGeometry, Texture } from "three";
import Actor from "./Actor";
import Warderobe from "./Warderobe";

/**
 *  This is a special class that allows for creating a floor based on 
 */
export default class TiledFloor extends Actor {

    /**
     *  A set containing all position the floor should show up.
     */
    private _positions:Set<string> = new Set();

    constructor(private _texture:string, private _size:number) {

        super();
    }

    /**
     *  Initialize the object
     */
    protected _initObject(warderobe: Warderobe): InstancedMesh {

        const geometry = new PlaneGeometry(1, 1);
        const material = new MeshPhongMaterial({ map: warderobe.fetchTexture(this._texture), shadowSide: FrontSide });
        
        const object = new InstancedMesh(geometry, material, this._size);

        object.receiveShadow = true;

        return object;
    } 

    /**
     *  Fill the floor with positions
     */
    fill(xStart:number, yStart:number, xStop:number, yStop:number) : void {

        const object = this._object as InstancedMesh;

        let idx = 0;

        for (let y = yStart; y <= yStop; y++) {
            for (let x = xStart; x <= xStop; x++) {

                object.setMatrixAt(idx, new Matrix4().makeTranslation(x, y, -.5));

                idx++;
            }
        }

        object.instanceMatrix.needsUpdate = true;
    }
};