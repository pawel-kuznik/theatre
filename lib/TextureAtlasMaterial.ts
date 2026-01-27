import { ShaderMaterial, Texture, CanvasTexture, NearestFilter, ShaderLib, UniformsUtils, Color, SRGBColorSpace } from 'three';

/**
 * TextureAtlasMaterial - A custom material for instanced rendering with texture atlases
 *
 * Example usage with InstancedActor:
 *
 * ```typescript
 * // 1. Load your textures
 * const textures = [
 *     textureLoader.load('texture1.png'),
 *     textureLoader.load('texture2.png'),
 *     textureLoader.load('texture3.png'),
 * ];
 *
 * // 2. Create texture atlas
 * const atlas = createTextureAtlas(textures, 256); // 256 = texture size in pixels
 *
 * // 3. Create material with atlas
 * const material = new TextureAtlasMaterial(atlas, textures.length);
 *
 * // 4. Use with InstancedActor
 * class MyActor extends InstancedActor {
 *     protected _initMaterial(warderobe: Warderobe) {
 *         return material;
 *     }
 * }
 *
 * // 5. Set texture index for each instance
 * const actor = new MyActor(100);
 * actor.setUniformAt(0, 'textureIndex', 0);  // Use first texture
 * actor.setUniformAt(1, 'textureIndex', 1);  // Use second texture
 * actor.setUniformAt(2, 'textureIndex', 2);  // Use third texture
 * ```
 */

export interface CreateTextureAtlasOptions {

    /**
     *  This option is to flip the texture atlas vertically.
     *  @default false
     */
    flipY?: boolean;

    /**
     *  This option is to quickly mount the texture atlas canvas to the DOM.
     *  Use this option to quickly debug the texture atlas.
     *  @default false
     */
    debugMount?: boolean;
}

/**
 * Creates a texture atlas from an array of square textures of the same size.
 *
 * @param textures Array of textures to combine into an atlas
 * @param textureSize Size of each individual texture (assumes square textures)
 * @returns A texture containing all input textures arranged in a grid
 */
export function createTextureAtlas(textures: Texture[], textureSize: number, options?: CreateTextureAtlasOptions): Texture {

    const flipY = options?.flipY ?? false;
    const debugMount = options?.debugMount ?? false;

    if (textures.length === 0) {
        throw new Error('Cannot create texture atlas from empty array');
    }

    // Calculate grid dimensions (smallest square that fits all textures)
    const gridSize = Math.ceil(Math.sqrt(textures.length));
    const atlasSize = gridSize * textureSize;

    // Create a canvas to draw the atlas
    const canvas = document.createElement('canvas');
    canvas.width = atlasSize;
    canvas.height = atlasSize;
    const ctx = canvas.getContext('2d');

    if (debugMount) {
        canvas.style.display = 'block';
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.border = '1px solid red';
        document.body.appendChild(canvas);
    }

    if (!ctx) {
        throw new Error('Could not get 2D context for atlas canvas');
    }

    // Draw each texture into the atlas
    textures.forEach((texture, index) => {
        const x = (index % gridSize) * textureSize;
        const y = Math.floor(index / gridSize) * textureSize;

        // Get the image from the texture
        const image = texture.image as CanvasImageSource;
        if (image) {
            ctx.drawImage(image, x, y, textureSize, textureSize);
        }
    });

    // Create a Three.js texture from the canvas
    const atlasTexture = new CanvasTexture(canvas);
    atlasTexture.flipY = flipY;
    atlasTexture.minFilter = NearestFilter;
    atlasTexture.magFilter = NearestFilter;
    atlasTexture.colorSpace = SRGBColorSpace;

    return atlasTexture;
}

/**
 * Custom material that supports texture atlas rendering with per-instance texture indices.
 * Extends standard material with PBR lighting support.
 */
export interface TextureAtlasMaterialOptions {
    receiveShadows?: boolean;
    unlit?: boolean;
    flipY?: boolean;
    metalness?: number;
    roughness?: number;
    diffuse?: Color;
}

export class TextureAtlasMaterial extends ShaderMaterial {

    private _gridSize: number;
    private _textureCount: number;
    private _receiveShadows: boolean;
    private _unlit: boolean;
    private _flipY: boolean;

    constructor(atlasTexture: Texture, textureCount: number, options?: TextureAtlasMaterialOptions, params?: any) {

        const receiveShadows = options?.receiveShadows ?? true;
        const unlit = options?.unlit ?? false;
        const flipY = options?.flipY ?? true;
        const metalness = options?.metalness ?? 0;
        const roughness = options?.roughness ?? 1;
        const diffuse = options?.diffuse ?? new Color(0xffffff);

        // Calculate grid size from texture count
        const gridSize = Math.ceil(Math.sqrt(textureCount));

        // Build uniforms based on lighting mode
        let uniforms;
        // Start with standard material uniforms for PBR lighting
        const standardUniforms = UniformsUtils.clone(ShaderLib.standard.uniforms);

        // Set sensible defaults to prevent overly dark rendering
        standardUniforms.diffuse.value = diffuse;
        standardUniforms.metalness.value = metalness;
        standardUniforms.roughness.value = roughness;

        // For unlit mode, set emissive to white so texture shows at full brightness
        if (unlit) {
            standardUniforms.emissive.value = new Color(0xffffff);
        }

        uniforms = UniformsUtils.merge([
            standardUniforms,
            {
                atlasTexture: { value: atlasTexture },
                gridSize: { value: gridSize },
                textureCount: { value: textureCount }
            }
        ]);

        super({
            uniforms: uniforms,
            vertexShader: getVertexShader(receiveShadows),
            fragmentShader: getFragmentShader(receiveShadows, unlit, flipY),
            lights: true,
            ...params
        });

        this._gridSize = gridSize;
        this._textureCount = textureCount;
        this._receiveShadows = receiveShadows;
        this._unlit = unlit;
        this._flipY = flipY;
    }

    get gridSize(): number {
        return this._gridSize;
    }

    get textureCount(): number {
        return this._textureCount;
    }

    get receiveShadows(): boolean {
        return this._receiveShadows;
    }

    get unlit(): boolean {
        return this._unlit;
    }

    get flipY(): boolean {
        return this._flipY;
    }
}

/**
 * Vertex shader that passes texture index from instance attribute to fragment shader
 */
function getVertexShader(receiveShadows: boolean): string {
    return `
        #define STANDARD
        #define USE_UV
        ${receiveShadows ? '' : '#undef USE_SHADOWMAP'}

        varying vec3 vViewPosition;

        #include <common>
        #include <uv_pars_vertex>
        #include <displacementmap_pars_vertex>
        #include <color_pars_vertex>
        #include <fog_pars_vertex>
        #include <normal_pars_vertex>
        #include <morphtarget_pars_vertex>
        #include <skinning_pars_vertex>
        ${receiveShadows ? '#include <shadowmap_pars_vertex>' : ''}
        #include <logdepthbuf_pars_vertex>
        #include <clipping_planes_pars_vertex>

        // Custom attribute for texture index
        attribute float textureIndex;
        varying float vTextureIndex;

        void main() {

            #include <uv_vertex>
            #include <color_vertex>
            #include <morphcolor_vertex>

            #include <beginnormal_vertex>
            #include <morphnormal_vertex>
            #include <skinbase_vertex>
            #include <skinnormal_vertex>
            #include <defaultnormal_vertex>
            #include <normal_vertex>

            #include <begin_vertex>
            #include <morphtarget_vertex>
            #include <skinning_vertex>
            #include <displacementmap_vertex>
            #include <project_vertex>
            #include <logdepthbuf_vertex>
            #include <clipping_planes_vertex>

            vViewPosition = - mvPosition.xyz;

            #include <worldpos_vertex>
            ${receiveShadows ? '#include <shadowmap_vertex>' : ''}
            #include <fog_vertex>

            // Pass texture index to fragment shader
            vTextureIndex = textureIndex;
        }
    `;
}

/**
 * Fragment shader that samples from the atlas based on the texture index
 */
function getFragmentShader(receiveShadows: boolean, unlit: boolean = false, flipY: boolean = true): string {
    return `
        #define STANDARD
        #define USE_UV
        ${receiveShadows ? '' : '#undef USE_SHADOWMAP'}
        ${unlit ? '#define UNLIT' : ''}
        ${flipY ? '#define FLIP_Y' : ''}

        #ifdef PHYSICAL
            #define IOR
            #define USE_SPECULAR
        #endif

        uniform vec3 diffuse;
        uniform vec3 emissive;
        uniform float roughness;
        uniform float metalness;
        uniform float opacity;

        #ifdef IOR
            uniform float ior;
        #endif

        #ifdef USE_SPECULAR
            uniform float specularIntensity;
            uniform vec3 specularColor;

            #ifdef USE_SPECULAR_COLORMAP
                uniform sampler2D specularColorMap;
            #endif

            #ifdef USE_SPECULAR_INTENSITYMAP
                uniform sampler2D specularIntensityMap;
            #endif
        #endif

        #ifdef USE_CLEARCOAT
            uniform float clearcoat;
            uniform float clearcoatRoughness;
        #endif

        #ifdef USE_IRIDESCENCE
            uniform float iridescence;
            uniform float iridescenceIOR;
            uniform float iridescenceThicknessMinimum;
            uniform float iridescenceThicknessMaximum;
        #endif

        #ifdef USE_SHEEN
            uniform vec3 sheenColor;
            uniform float sheenRoughness;

            #ifdef USE_SHEEN_COLORMAP
                uniform sampler2D sheenColorMap;
            #endif

            #ifdef USE_SHEEN_ROUGHNESSMAP
                uniform sampler2D sheenRoughnessMap;
            #endif
        #endif

        #ifdef USE_ANISOTROPY
            uniform vec2 anisotropyVector;

            #ifdef USE_ANISOTROPYMAP
                uniform sampler2D anisotropyMap;
            #endif
        #endif

        varying vec3 vViewPosition;

        #include <common>
        #include <packing>
        #include <dithering_pars_fragment>
        #include <color_pars_fragment>
        #include <uv_pars_fragment>
        #include <map_pars_fragment>
        #include <alphamap_pars_fragment>
        #include <alphatest_pars_fragment>
        #include <alphahash_pars_fragment>
        #include <aomap_pars_fragment>
        #include <lightmap_pars_fragment>
        #include <emissivemap_pars_fragment>
        #include <iridescence_fragment>
        #include <cube_uv_reflection_fragment>
        #include <envmap_common_pars_fragment>
        #include <envmap_physical_pars_fragment>
        #include <fog_pars_fragment>
        #include <lights_pars_begin>
        #include <normal_pars_fragment>
        #include <lights_physical_pars_fragment>
        #include <transmission_pars_fragment>
        ${receiveShadows ? '#include <shadowmap_pars_fragment>' : ''}
        #include <bumpmap_pars_fragment>
        #include <normalmap_pars_fragment>
        #include <clearcoat_pars_fragment>
        #include <iridescence_pars_fragment>
        #include <roughnessmap_pars_fragment>
        #include <metalnessmap_pars_fragment>
        #include <logdepthbuf_pars_fragment>
        #include <clipping_planes_pars_fragment>

        // Custom uniforms for texture atlas
        uniform sampler2D atlasTexture;
        uniform float gridSize;
        uniform float textureCount;

        varying float vTextureIndex;

        void main() {

            #include <clipping_planes_fragment>

            vec4 diffuseColor = vec4( diffuse, opacity );
            ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
            vec3 totalEmissiveRadiance = emissive;

            // Calculate atlas UV coordinates based on texture index
            // Add 0.5 before floor to round to nearest integer (avoids precision issues)
            float index = floor(vTextureIndex + 0.5);
            float tileX = mod(index, gridSize);
            float tileY = floor(index / gridSize);

            // Transform UVs to sample from the correct tile in the atlas
            #ifdef FLIP_Y
                vec2 correctedUV = vec2(vUv.x, 1.0 - vUv.y);
            #else
                vec2 correctedUV = vUv;
            #endif
            vec2 tileUV = correctedUV / gridSize;
            vec2 tileOffset = vec2(tileX, tileY) / gridSize;
            vec2 atlasUV = tileUV + tileOffset;

            // Sample from atlas
            vec4 texelColor = texture2D(atlasTexture, atlasUV);
            diffuseColor *= texelColor;

            #ifdef UNLIT
                gl_FragColor = vec4(diffuseColor.rgb, diffuseColor.a);
                #include <colorspace_fragment>
                return;
            #endif

            #include <logdepthbuf_fragment>
            #include <color_fragment>
            #include <alphamap_fragment>
            #include <alphatest_fragment>
            #include <alphahash_fragment>
            #include <roughnessmap_fragment>
            #include <metalnessmap_fragment>
            #include <normal_fragment_begin>
            #include <normal_fragment_maps>
            #include <clearcoat_normal_fragment_begin>
            #include <clearcoat_normal_fragment_maps>
            #include <emissivemap_fragment>

            // accumulation
            #include <lights_physical_fragment>
            #include <lights_fragment_begin>
            #include <lights_fragment_maps>
            #include <lights_fragment_end>

            // modulation
            #include <aomap_fragment>

            vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
            vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;

            #include <transmission_fragment>

            vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;

            #ifdef USE_SHEEN
                // Sheen energy compensation approximation calculation can be found at the end of
                // https://drive.google.com/file/d/1T0D1VSyR4AllqIJTQAraEIzjlb5h4FKH/view?usp=sharing
                float sheenEnergyComp = 1.0 - 0.157 * max3( sheenColor );

                outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
            #endif

            #ifdef USE_CLEARCOAT
                float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );

                vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );

                outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
            #endif

            #include <opaque_fragment>
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
            #include <fog_fragment>
            #include <premultiplied_alpha_fragment>
            #include <dithering_fragment>
        }
    `;
}

/**
 * Simple unlit vertex shader - just passes position and UVs
 */
function getUnlitVertexShader(): string {
    return `
        attribute float textureIndex;

        varying float vTextureIndex;
        varying vec2 vUv;

        void main() {
            vUv = uv;
            vTextureIndex = textureIndex;

            vec4 mvPosition = vec4(position, 1.0);

            #ifdef USE_INSTANCING
                mvPosition = instanceMatrix * mvPosition;
            #endif

            gl_Position = projectionMatrix * modelViewMatrix * mvPosition;
        }
    `;
}

/**
 * Simple unlit fragment shader - just outputs texture color
 */
function getUnlitFragmentShader(): string {
    return `
        precision highp float;

        uniform float opacity;
        uniform sampler2D map;
        uniform float gridSize;

        varying float vTextureIndex;
        varying vec2 vUv;

        void main() {
            // Calculate atlas UV coordinates based on texture index
            // Add 0.5 before floor to round to nearest integer (avoids precision issues)
            float index = floor(vTextureIndex + 0.5);
            float tileX = mod(index, gridSize);
            float tileY = floor(index / gridSize);

            // Transform UVs to sample from the correct tile in the atlas
            #ifdef FLIP_Y
                vec2 correctedUV = vec2(vUv.x, 1.0 - vUv.y);
            #else
                vec2 correctedUV = vUv;
            #endif
            vec2 tileUV = correctedUV / gridSize;
            vec2 tileOffset = vec2(tileX, tileY) / gridSize;
            vec2 atlasUV = tileUV + tileOffset;

            // Sample from atlas and output directly
            vec4 texelColor = texture2D(map, atlasUV);
            gl_FragColor = texelColor;
        }
    `;
}
