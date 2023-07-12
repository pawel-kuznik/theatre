console.log('Example 9');

class Box extends THEATRE.Actor {

    _initObject() {

        const g = new THREE.BoxGeometry(1, 1, 1);
        const m = new THREE.MeshBasicMaterial({ color: 0x0000ff });

        return new THREE.Mesh(g, m);
    }
};

class Terrain extends THEATRE.RTSTerrain {

    constructor() {
        super(5);
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
