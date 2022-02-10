import { Color, FrontSide, InstancedMesh, Matrix4, MeshPhongMaterial, PlaneGeometry } from "three";
import Actor from "./Actor";
import Warderobe from "./Warderobe";

interface TilePosition {
    x:number;
    y:number;
};

interface TileFloorOptions {

    /**
     *  The max number of tiles in the whole floor.
     */
    size:number;

    /**
     *  The color in which the tiles should be higlighted.
     */
    highlightColor?:Color;
};

/**
 *  This is a special class that allows for creating a floor based on 
 */
export default class TiledFloor extends Actor {

    /**
     *  Mapping of all positions inside the floor.
     */
    private _positions:Map<number, TilePosition> = new Map();

    private readonly _size:number;

    private readonly _highlighted:Array<number> = [];
    private readonly _highlightColor:Color;

    constructor(private _texture:string, options:TileFloorOptions) {

        super();

        this._size = options.size;
        this._highlightColor = options.highlightColor || new Color(0x00ff00);
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
                object.setColorAt(idx, new Color(0xffffff));

                this._positions.set(idx, { x, y });

                idx++;
            }
        }

        object.instanceMatrix.needsUpdate = true;
        if (object.instanceColor) object.instanceColor.needsUpdate = true;
    }

    /**
     *  Set highligted tiles.
     */
    setHighlight(ids:Array<number>) {

        const sorted = [...ids].sort();
        
        if (sorted.toString() === this._highlighted.toString()) return;

        const object = this._object as InstancedMesh;

        this._highlighted.splice(0, this._highlighted.length, ...this._highlighted.filter((value:number) => {
            
            if (sorted.includes(value)) return true;

            object.setColorAt(value, new Color(0xffffff));

            return false;
        }));

        for (let idx of sorted) {

            if (this._highlighted.includes(idx)) continue;

            this._highlighted.push(idx);
            object.setColorAt(idx, this._highlightColor);
        }

        if (object.instanceColor) object.instanceColor.needsUpdate = true;
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