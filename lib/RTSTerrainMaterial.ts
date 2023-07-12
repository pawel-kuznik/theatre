import { ShaderMaterial } from "three";

const vertexShader = `
varying float v_topo;

void main() {

    v_topo = position.z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

const fragmentShader = `
varying float v_topo;

void main() {

    vec3 color = vec3(v_topo / 6.0, v_topo / 6.0, 1.0);

    gl_FragColor.rgb = color;
    gl_FragColor.a = 1.0;
}
`;

export class RTSTerrainMaterial extends ShaderMaterial {

    constructor() {
        super({
            vertexShader,
            fragmentShader
        });

        
        this.extensions.derivatives = true;
    }
};
