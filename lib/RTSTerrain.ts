import { Object3D, Event, Material, Mesh, BufferGeometry, BufferAttribute } from "three";
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

        const idx = this._posToIdx(x, y);
        this._heights.set([ height ], idx);
    }

    getHeight(x: number, y: number) : number {
        const idx = this._posToIdx(x, y);
        return this._heights[idx];
    }

    protected abstract getTerrainMaterial(warderobe: Warderobe) : Material;

    protected _initObject(warderobe: Warderobe): Object3D<Event> {

        const vertices = new Float32Array(this._size * this._size * 6 * 3);

        for (let y = 0; y < this._size - 1; y++) {
            for (let x = 0; x < this._size - 1; x++) {

                const p1 = this.getHeight(x, y);
                const p2 = this.getHeight(x + 1, y);
                const p3 = this.getHeight(x + 1, y + 1);
                const p4 = this.getHeight(x, y + 1);

                vertices.set([
                    // lower-right tiangle
                    x, y, p1,
                    x + 1, y, p2,
                    x + 1, y + 1, p3,
                    
                    // upper-left triangle
                    x + 1, y + 1, p3,
                    x, y + 1, p4,
                    x, y, p1
                ], (x + (y * this._size)) * 6 * 3);
            }
        }

        const geometry = new BufferGeometry();
        geometry.setAttribute('position', new BufferAttribute( vertices, 3 ) );
        geometry.computeVertexNormals();

        const material = this.getTerrainMaterial(warderobe);

        return new Mesh(geometry, material);
    }

    private _posToIdx(x: number, y: number) : number {
        return x + (y * this._size);
    }
};