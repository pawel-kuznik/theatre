import { FrontSide, InstancedMesh, Matrix4, MeshPhongMaterial, PlaneGeometry } from "three";
import Actor from "./Actor";
import Warderobe from "./Warderobe";

interface TilePosition {
    x:number;
    y:number;
};

/**
 *  This is a special class that allows for creating a floor based on 
 */
export default class TiledFloor extends Actor {

    /**
     *  Mapping of all positions inside the floor.
     */
    private _positions:Map<number, TilePosition> = new Map();

    constructor(private _texture:string, private _size:number) {

        super();
    }

    /**
     *  Initialize the object
     */
    protected _initObject(warderobe: Warderobe): InstancedMesh {

        const geometry = new PlaneGeometry(1, 1);
        const material = new MeshPhongMaterial({ map: warderobe.fetchTexture(this._texture), shadowSide: FrontSide });
        
        const object = new InstancedMesh(geometry, material, this._size + 1);

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

                this._positions.set(idx, { x, y });

                idx++;
            }
        }

        object.instanceMatrix.needsUpdate = true;
    }

    /**
     *  Remove an instance from the floor;
     */
    remove(position: TilePosition) : void;
    remove(x:number, y:number) : void;
    remove(idx:number) : void;
    remove(x:any, y?:any) : void {

        // @todo implement

    };

    /**
     *  Translate a possible idx into a position in this floor.
     */
    positionFromIdx(idx:number) : { x: number, y:number }|undefined {

        return this._positions.get(idx);
    };
};