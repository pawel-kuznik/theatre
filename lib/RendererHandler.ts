import { Object3D, PCFSoftShadowMap, Vector3, WebGLRenderer } from "three";
import { CSS3DRenderer } from "@pawel-kuznik/three-css3d";
import RenderingQualitySettings from "./RenderingQualitySettings";
import { RenderSize } from "./RenderSize";

export type ResizeHandler = (width:number, height:number) => void;

/**
 *  This is a class that handlers the canvas element and its relation to the renderer
 *  for us.
 */
export default class RendererHandler {

    private readonly _renderer:WebGLRenderer;

    private readonly _observer:ResizeObserver;
    private readonly _renderSize: RenderSize;

    private readonly _css: CSS3DRenderer = new CSS3DRenderer();

    private _container: HTMLElement;

    private _canvas: HTMLCanvasElement;

    private _resizeHandler:ResizeHandler|undefined;

    public constructor(container:HTMLElement, options:RenderingQualitySettings) {

        container.style.position = 'relative';

        this._container = container;

        this._canvas = document.createElement('canvas');
        container.append(this._canvas);
        container.append(this._css.domElement);

        this._canvas.style.position = 'absolute';
        this._css.domElement.style.position = 'absolute';
        this._css.domElement.style.pointerEvents = 'none';

        this._renderer = new WebGLRenderer({
            canvas:             this._canvas,
            antialias:          options.antialiasing,
            precision:          options.shaderPrecision,
            powerPreference:    options.powerPreference
        });

        Object3D.DEFAULT_UP = new Vector3(0, 0, 1);

        this._renderer.shadowMap.enabled = true;
        this._renderer.shadowMap.type = PCFSoftShadowMap;

        this._observer = new ResizeObserver(() => void this._resize());

        const bb = this._canvas.getBoundingClientRect();
        this._renderSize = new RenderSize(bb.width, bb.height);

        this._resize();
        this._observer.observe(container);

        // mark the renderes with out data-* attribute
        this._css.domElement.setAttribute("data-theatre", "yes");
        this._canvas.setAttribute("data-theatre", "yes");
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
     *  Get access to the CSS renderer.
     */
    get css() : CSS3DRenderer { return this._css; }

    /**
     *  Get the aspect ratio of the renderer.
     */
    get aspectRatio() : number { return this._renderSize.aspectRatio; }

    /**
     *  Get an object that tells what is the rendering size.
     */
    get renderSize() : RenderSize { return this._renderSize; }

    /**
     *  Cleanup any resources of this class.
     */
    public dispose() : void {

        this._observer.disconnect();
        this._renderer.dispose();

        // remove the CSSRenderer. We only remove its dom element cause it doesn't
        // have a dedicated dispose, remove, or destroy method.
        this._css.domElement.remove()

        // remove created canvas.
        this._canvas.remove();
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

        // @note This one is strange. On some devices (MacBook) the scale has
        // to be same as window.devicePixelRation. This was also the case with
        // MS Surface Book, but after updates it produces a lot of issues with
        // resizing. Why? Dunno. So now the scale is set to 1, but this needs 
        // futther investigation.
        // @todo get to the bottom of this issue.

        // const scale = window.devicePixelRatio;
        const scale = 1;
        const bb = this._container.getBoundingClientRect();

        // resize the observer, but don't allow the renderer to resize
        // the canvas. This would make it a somewhat silly loop.
        this._renderer.setSize(bb.width * scale, bb.height * scale, false);

        this._css.setSize(bb.width * scale, bb.height * scale);
        this._renderSize.adjust(bb.width * scale, bb.height * scale);

        if (this._resizeHandler) this._resizeHandler(bb.width, bb.height);
    };
};
