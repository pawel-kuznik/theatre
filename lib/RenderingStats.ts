import { Vector4, WebGLRenderer } from "three";
import RenderingLoop from "./RenderingLoop";

/**
 *  This is a class that represents current rendering stats.
 */
export class RenderingStats {

    private _renderingLoop: RenderingLoop;
    private _renderer: WebGLRenderer;

    get fps() : number { return this._renderingLoop.fps; }
    get running() : boolean { return this._renderingLoop.runnig; }

    get triangles() : number { return this._renderer.info.render.triangles; }
    get calls() : number { return this._renderer.info.render.calls; }
    get goemetries() : number { return this._renderer.info.memory.geometries; }
    get textures() : number { return this._renderer.info.memory.textures; }

    get viewport() : Vector4 {
        const viewport = new Vector4();
        this._renderer.getViewport(viewport);
        return viewport;
    }

    constructor(loop: RenderingLoop, renderer: WebGLRenderer) {
        this._renderingLoop = loop;
        this._renderer = renderer;

        renderer.info.render.frame
    }

    toJSON() {
        return {
            fps: this.fps,
            running: this.running,
            triangles: this.triangles,
            calls: this.calls,
            geometries: this.goemetries,
            textures: this.textures
        };
    }
};
