import { WebGLRenderer } from "three";

/**
 *  This is a class that handlers the canvas element and its relation to the renderer
 *  for us.
 */
export default class RendererHandler {

    private readonly _renderer:WebGLRenderer;

    private readonly _observer:ResizeObserver;

    public constructor(private _canvas:HTMLCanvasElement) {

        this._renderer = new WebGLRenderer({
            canvas: this._canvas
        });

        this._observer = new ResizeObserver(() => void this._resize());

        this._resize();
        this._observer.observe(this._canvas);
    }

    /**
     *  Get access to the actual renderer.
     */
    get renderer() : WebGLRenderer { return this._renderer; }

    /**
     *  Get acecss to the actual canvas element
     */
    get canvas() : HTMLCanvasElement { return this._canvas; }

    /**
     *  Cleanup any resources of this class.
     */
    dispose() : void {

        this._observer.disconnect();
        this._renderer.dispose();
    }

    /**
     *  Resize the renderer to match the current canvas size.
     */
    private _resize() : void {

        const scale = window.devicePixelRatio;
        const bb = this._canvas.getBoundingClientRect();

        // resize the observer, but don't allow the renderer to resize
        // the canvas. This would make it a somewhat silly loop.
        this._renderer.setSize(bb.width * scale, bb.height * scale, false);
    };
};