import { Object3D, Event, Material, Mesh, BufferGeometry } from "three";
import Actor from "./Actor";
import Warderobe from "./Warderobe";

/**
 *  This is an actor that renders a terrain based on height map in a similar way
 *  the gold-age rts were (or at least what I remember). The terrain in rendered
 *  with square tiles which can go up and down.
 */
export abstract class RTSTerrain extends Actor {

    private _size: number;
    private _heights: Int16Array;

    constructor(size: number) {

        super();

        this._size = size;
        this._heights = new Int16Array(this._size * this._size);
    }

    setHeight(x: number, y: number, height: number) {

    }

    getHeight(x: number, y: number) : number {
        return 0;
    }

    protected abstract getTerrainMaterial(warderobe: Warderobe) : Material;

    protected _initObject(warderobe: Warderobe): Object3D<Event> {

        const vertices = new Float32Array(3 * (this._size - 1) * 6);

        for (let x = 0; x < this._size - 1; x++) {
            for (let y = 0; y < this._size - 1; y++) {

                const p1 = this.getHeight(x, y);
                const p2 = this.getHeight(x + 1, y);
                const p3 = this.getHeight(x + 1, y + 1);
                const p4 = this.getHeight(x, y + 1);

                [
                    // lower-right tiangle
                    x, y, p1,
                    x + 1, y, p2,
                    x + 1, y + 1, p3,
                    
                    // upper-left triangle
                    x + 1, y + 1, p3,
                    x, y + 1, p4,
                    x, y, p1
                ]
            }
        }

        const geometry = new BufferGeometry();
        const material = this.getTerrainMaterial(warderobe);

        return new Mesh(geometry, material);
    }
};