import { Object3D, Event, OctahedronGeometry, MeshBasicMaterial, Mesh } from "three";
import Actor from "./Actor";
import Theatre from "./Theatre";
import Warderobe from "./Warderobe";

export default class HexSphere extends Actor {

    protected _initObject(warderobe: Warderobe): Object3D<Event> {

        const geometry = new OctahedronGeometry(200, 3);
        const material = new MeshBasicMaterial({
            color: 0xffffff
        });

        const mesh = new Mesh(geometry, material);

        return mesh;


        // geometry = new THREE.OctahedronGeometry(200, 3)
        // material = new THREE.MeshBasicMaterial({
        //     color        : 0xFFFFFF,
        //     shading      : THREE.FlatShading,
        //     side         : THREE.DoubleSide,
        //     vertexColors : THREE.FaceColors,
        //     overdraw     : true 
        //     })

        // # Explode geometry so each face has unique vertices
        // explodeModifier = new THREE.ExplodeModifier()
        // explodeModifier.modify(geometry)

        // geodesicMesh = new THREE.Mesh(geometry , material)
        // geodesicFaces = geometry.faces  

        // for i in [0..geodesicFaces.length-1]
        //     geodesicFaces[i].color.setRGB(Math.random(), Math.random(), Math.random())

        // geodesicMesh.position.x = 0
        // geodesicMesh.position.y = 0
        // geodesicMesh.position.z = 0

        // scene.add(geodesicMesh)


        throw new Error("Method not implemented.");
    }

};