import { WebGLRenderer } from "three";

export type ResizeHandler = (width:number, height:number) => void;

/**
 *  This is a class that handlers the canvas element and its relation to the renderer
 *  for us.
 */
export default class RendererHandler {

    private readonly _renderer:WebGLRenderer;

    private readonly _observer:ResizeObserver;

    private _resizeHandler:ResizeHandler|undefined;

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
     *  Get the aspect ratio of the renderer.
     */
    get aspectRatio() : number { 

        const bb = this._canvas.getBoundingClientRect();

        return bb.width / bb.height;
    }

    /**
     *  Cleanup any resources of this class.
     */
    public dispose() : void {

        this._observer.disconnect();
        this._renderer.dispose();
    }

    /**
     *  Pass an on resize handler. This one will replace any existing ones.
     *  Note that this handler will be called on all resize.
     */
    public onResize(handler:ResizeHandler|undefined) {

        this._resizeHandler = handler;
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

        if (this._resizeHandler) this._resizeHandler(bb.width, bb.height);
    };
};