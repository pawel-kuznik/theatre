import { Material, Texture } from "three";

/**
 *  This class represents a warderobe of many thins that are useful for actors. This
 *  can be textures, materials, and so on. We use this centralized store cause there
 *  is no point in holding all possible textures and materials inside each actor that
 *  needs them. Instead we want to create them once and then reuse them when we need
 *  them again.
 */
export default class Warderobe {

    /**
     *  All of loaded textures.
     */
    private readonly _textures:Map<string,Texture> = new Map();

    /**
     *  All of registered materials.
     */
    private readonly _materials:Map<string,Material> = new Map();

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
    public registerMaterial(name:string, material:Material) : void {

        this._materials.set(name, material);
    }
};