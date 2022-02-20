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

    /**
     *  Should there be an out of the box support for receiving shadows
     *  on this floor?
     */
    shadows?:boolean;
};

/**
 *  This is a special class that allows for creating a floor based on a specific texture.
 *  This is useful for creting the actual floor of a stage and then placing actors on top
 *  of it.
 */
export default class TiledFloor extends Actor {

    /**
     *  Was the floor already initialized?
     */
    private _initialized:boolean = false

    /**
     *  Mapping of all positions inside the floor.
     */
    private _positions:Map<number, TilePosition> = new Map();

    /**
     *  The max number of tiles the floor can render.
     */
    private readonly _size:number;

    /**
     *  The options related to highlighting specific tiles.
     */
    private readonly _highlighted:Array<number> = [];
    private readonly _highlightColor:Color;

    /**
     *  Options related to shadows support.
     */
    private readonly _shadows:boolean;

    /**
     *  A special set we keep to remember which tile positions we need to
     *  fill when the object is fully initialized.
     */
    private _toFill:Set<TilePosition> = new Set();

    constructor(private _texture:string, options:TileFloorOptions) {

        super();

        this._size = options.size;
        this._highlightColor = options.highlightColor || new Color(0x00ff00);
        this._shadows = options.shadows || true; 
    }

    /**
     *  Initialize the object
     */
    protected _initObject(warderobe: Warderobe): InstancedMesh {

        this._initialized = true;

        const geometry = new PlaneGeometry(1, 1);
        const material = new MeshPhongMaterial({ map: warderobe.fetchTexture(this._texture), shadowSide: this._shadows ? FrontSide : undefined });
        
        const object = new InstancedMesh(geometry, material, this._size + 1);

        if (this._shadows) object.receiveShadow = true;
            
        return object;
    }

    /**
     *  Wrap up initialization after hydrate.
     */
    protected _afterHydrate(): void {
        
        if (this._toFill) this._doFill([...this._toFill]);        

        super._afterHydrate();
    }

    /**
     *  Dispose of the object.
     */
    dispose(): void {
        
        this._initialized = false;

        return super.dispose();
    }

    /**
     *  Fill the floor with positions
     */
    fill(xStart:number, yStart:number, xStop:number, yStop:number) : void {

        const positions:TilePosition[] = [];

        for (let y = yStart; y <= yStop; y++) {
            for (let x = xStart; x <= xStop; x++) {
                positions.push({ x, y });
            }
        }

        this._prepareFill(positions);
        if (this._initialized) this._doFill(positions);
    }

    /** 
     *  Prepare positions to fill when the tiled floor is initialized.
     */
    private _prepareFill(positions:TilePosition[]) {

        this._toFill = new Set(positions);
    }

    /**
     *  Actually fill in the floor with positions.
     */
    private _doFill(positions:TilePosition[]) {

        const object = this._object as InstancedMesh;

        positions.forEach((value:TilePosition, index:number) => {

            object.setMatrixAt(index, new Matrix4().makeTranslation(value.x, value.y, -.5));
            object.setColorAt(index, new Color(0xffffff));

            this._positions.set(index, value);
        });

        console.log(object);

        object.instanceMatrix.needsUpdate = true;
        if (object.instanceColor) object.instanceColor.needsUpdate = true;
    };

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