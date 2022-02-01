import { Object3D } from "three";
import Actor from "./Actor";

/**
 *  This is a special actor type that gathers actors and allows for placing them
 *  in a tiled distribution. This is useful for creating board games, chess, or 
 *  grid like display.
 */
export default class TiledActors extends Actor {

    /**
     *  The tile size that the actor can occupy.
     */
    private _tileSize:number = 1;

    /**
     *  The spacing between the tiles.
     */
    private _spacing:number = .1;

    public constructor(tileSize:number = 1, spacing:number = .05) {

        super();

        this._tileSize = tileSize;
        this._spacing = spacing;
    }

    protected _initObject(): Object3D {
        return new Object3D();
    }

    /**
     *  Insert an actor inside the tiles at given position.
     * 
     *  @note x and y should be whole numbers to it to work correctly.
     */
    insert(actor:Actor, x:number, y:number) {

        actor.attach(this._object);

        const tileCenter = this.centerOf(x, y);

        actor.moveTo(tileCenter.x, tileCenter.y);
    }

    /**
     *  Spatial coordinates of the center of a specific tile.
     */
    centerOf(x:number, y:number) : { x: number, y:number } {

        const tileX = x * (this._tileSize + this._spacing);
        const tileY = y * (this._tileSize + this._spacing);

        return { x: tileX - this._tileSize / 2, y: tileY - this._tileSize / 2 };
    }
};