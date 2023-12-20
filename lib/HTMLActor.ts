import { CSS3DObject } from "@pawel-kuznik/three-css3d";
import Actor from "./Actor";
import Warderobe from "./Warderobe";

export abstract class HTMLActor extends Actor {

    private _element: HTMLElement;

    private _scale: number;
    
    get element() : HTMLElement { return this._element; }

    constructor(scale: number = .01) {

        super();

        this._scale = scale;

        this._element = document.createElement("DIV");
    }

    /**
     *  Dispose all resources the actor consumes.
     */
    dispose(): void {

        this._element.remove();
        super.dispose();
    }
    
    /**
     *  This method should initialize the element for the actor
     */
    protected abstract _initElement() : HTMLElement;

    /**
     *  A function that is called to initialize the main object
     *  of the actor.
     */
    protected _initObject(warderobe:Warderobe) : CSS3DObject {

        const wrapper = document.createElement('div');

        this._element = this._initElement();

        this._element.style.transform = `scale(${this._scale})`;

        // this help with blurriness when we apply scale
        this._element.style.backfaceVisibility = 'hidden';

        wrapper.append(this._element);
     
        return new CSS3DObject(wrapper);
    }
};