import { Material, MeshBasicMaterial, MeshPhongMaterial, NearestFilter, Texture, TextureLoader } from "three";
import RenderParticipant from "./RenderParticipant";
import { RenderStep } from "./RenderStep";
import TextureAnimator from "./TextureAnimator";

/**
 *  This class represents a warderobe of many thins that are useful for actors. This
 *  can be textures, materials, and so on. We use this centralized store cause there
 *  is no point in holding all possible textures and materials inside each actor that
 *  needs them. Instead we want to create them once and then reuse them when we need
 *  them again.
 */
export default class Warderobe implements RenderParticipant {

    /**
     *  All of loaded textures.
     */
    private readonly _textures:Map<string,Texture> = new Map();
    private readonly _loadingTextures:Map<string, Promise<Texture>> = new Map();

    /**
     *  All of registered materials.
     */
    private readonly _materials:Map<string,Material> = new Map();

    /**
     *  All registered material animators.
     */
    private readonly _animators:Map<string,TextureAnimator> = new Map();

    /**
     *  A texture loader.
     */
    private readonly _loader = new TextureLoader();

    /**
     *  Fetch texture by name.
     */
    public fetchTexture(name:string) : Texture {

        return this._textures.get(name) || new Texture();
    }

    /**
     *  Register new texture.
     */
    public registerTexture(name:string, texture:Texture) : void {

        this._textures.set(name, texture);
    }

    /**
     *  Fetch material by name.
     */
    public fetchMaterial(name:string) : Material {

        return this._materials.get(name) || new Material();
    };

    /**
     *  Register new material.
     */
    public registerMaterial(name:string, material:MeshBasicMaterial|MeshPhongMaterial) : void {

        this._materials.set(name, material);
    }

    /**
     *  Register a new texture animator on a already defined texture.
     */
    public registerTextureAnimator(name:string) : TextureAnimator {

        const texture = this._textures.get(name);

        if (!texture) throw Error('Missing texture');

        const animator = new TextureAnimator(texture, 2);

        this._animators.set(name, animator);

        return animator;
    };

    /**
     *  Import texture to the warderobe by an url or a promise of a url. The promise
     *  of an url is useful when the url has to be detected in some kind of async
     *  way.
     */
    public importTexture(name:string, url:string|Promise<string>, options:'pixelart'|'default' = 'default') : Promise<Texture> {

        const promise = (url instanceof Promise ? url : Promise.resolve(url)).then((url:string) => {

            return this._loader.loadAsync(url).then((texture:Texture) => {

                if (options === 'pixelart') {
    
                    texture.minFilter = NearestFilter;
                    texture.magFilter = NearestFilter;
                }
    
                this.registerTexture(name, texture);
    
                this._loadingTextures.delete(name);
    
                return texture;
            });
        });

        this._loadingTextures.set(name, promise);

        return promise;
    }

    /**
     *  Wait for all resources to be proplery loaded.
     */
    public wait() : Promise<void> {

        return Promise.all([...this._loadingTextures.values()]).then(() => { });
    }

    /**
     *  Make a render step.
     */
    renderUpdate(step: RenderStep): void {

        for (let [key, animator] of this._animators) animator.renderUpdate(step);
    }
};