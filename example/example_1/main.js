class Box extends THEATRE.Actor {

    _initObject() {

        const g = new THREE.BoxGeometry(1, 1, 1);
        const m = new THREE.MeshBasicMaterial({ color: 0x0000ff });

        return new THREE.Mesh(g, m);
    }
};

document.addEventListener('DOMContentLoaded', () => {

    const canvas = document.querySelector('canvas');

    // construct a theatre
    const theatre = new THEATRE.Theatre(canvas);

    const introStage = theatre.createStage('intro');
    introStage.setAmbience({
        ambientColor: new THREE.Color( 0xff0000 )
    });
    const mainStage = theatre.createStage('main');
    introStage.setAmbience({
        ambientColor: new THREE.Color( 0x00ff00 )
    });

    introStage.insert(new Box());

    theatre.transitionTo('intro');

    console.log(theatre);
});
