class Boxes extends THEATRE.InstantiatedActor {

    _initGoemetry(warderobe) {

        return new THREE.BoxGeometry(0.8, 0.8, 0.8);
    }

    _initMaterial(warderobe) {
        return new THREE.MeshBasicMaterial({ color: new THREE.Color(0xff00ff)});
        // return new THREE.MeshPhongMaterial({ map: warderobe.fetchTexture('crate:side') });
    }
};

document.addEventListener('DOMContentLoaded', () => {

    const canvas = document.querySelector('canvas');

    // construct a theatre
    const theatre = new THEATRE.Theatre(canvas);

    const testStage = theatre.createStage('test');
    testStage.setAmbience({
        ambientColor: new THREE.Color( 0xffffff )
    });

    theatre.warderobe.importTexture('crate:side', './crate.png', 'pixelart');

    const boxes = new Boxes(20);
    
    testStage.insert(boxes);

    boxes.setPositionAt(0, new THREE.Vector3(1,1,0));
    boxes.setPositionAt(1, new THREE.Vector3(1,2,0));
    boxes.setPositionAt(2, new THREE.Vector3(2,1,0));
    boxes.setPositionAt(3, new THREE.Vector3(2,2,0));

    theatre.warderobe.wait().then(() => {

        theatre.transitionTo('test');

        setInterval(() => {
            console.log(theatre.stats.toJSON());
        }, 1000);
    });
});
