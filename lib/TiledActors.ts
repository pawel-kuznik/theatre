import { Object3D } from "three";
import Actor from "./Actor";

export interface TiledActorsOptions {

    /**
     *  The size of a tile that actor can occupy.
     */
    tileSize?:number;

    /**
     *  Spacing between tiles in X and Y dimension.
     */
    spacing?:number;
};

/**
 *  This is a special actor type that gathers actors and allows for placing them
 *  in a tiled distribution. This is useful for creating board games, chess, or 
 *  grid like display.
 */
export default class TiledActors extends Actor {

    /**
     *  Current values of options.
     */
    private _tileSize:number = 1;
    private _spacing:number = .1;

    private _children:Map<string, Actor> = new Map();

    public constructor(options:TiledActorsOptions = { }) {

        super();

        this._tileSize = options.tileSize ?? 1;
        this._spacing = options.spacing ?? .05;
    }

    protected _initObject(): Object3D {
        return new Object3D();
    }

    /**
     *  The children of this tiled actors instance.
     */
    get actors() : Array<Actor> {

        return [...this._children.values()];
    }

    /**
     *  Insert an actor inside the tiles at given position.
     * 
     *  @note x and y should be whole numbers to it to work correctly.
     */
    insert(actor:Actor, x:number, y:number) {

        this._children.set(`${x}:${y}`, actor);

        actor.attachTo(this._object);

        const tileCenter = this.centerOf(x, y);

        actor.moveTo(tileCenter.x, tileCenter.y);
    }

    /**
     *  Get actor situated at specific tile coordinates.
     */
    at(x:number, y:number) : Actor|null {

        return this._children.get(`${x}:${y}`) || null;
    }

    /**
     *  Check if a specific tile position is filled with an actor.
     */
    filledAt(x:number, y:number) : boolean {

        return this._children.has(`${x}:${y}`);
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