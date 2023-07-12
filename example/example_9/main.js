class Box extends THEATRE.Actor {

    _initObject() {

        const g = new THREE.BoxGeometry(1, 1, 1);
        const m = new THREE.MeshBasicMaterial({ color: 0x0000ff });

        return new THREE.Mesh(g, m);
    }
};

class Terrain extends THEATRE.RTSTerrain {

    constructor() {
        super(10);

        this.setHeight(1, 1, 2);
        this.setHeight(0, 0, 2);
        this.setHeight(1, 0, 2);

        this.setHeight(4, 4, 1);
        this.setHeight(3, 4, 1);
    }

    getTerrainMaterial() {
        return new THEATRE.RTSTerrainMaterial();
        // return new THREE.MeshPhongMaterial({ color: 0xff00ff });
        // return new THREE.MeshBasicMaterial({ color: 0xff00ff });
    }
};

document.addEventListener('DOMContentLoaded', () => {

    const container = document.body;

    // construct a theatre
    const theatre = new THEATRE.Theatre(container);

    const introStage = theatre.createStage('intro');
    introStage.setAmbience({
        ambientColor: new THREE.Color( 0xff0000 )
    });
   
    const box = new Box();
    box.moveTo(0, -1);

    introStage.insert(box);

    const terrain = new Terrain();
    introStage.insert(terrain);
   
    theatre.transitionTo('intro');
});
