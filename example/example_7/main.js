class Boxes extends THEATRE.InstantiatedActor {

    _initGoemetry(warderobe) {

        return new THREE.BoxGeometry(0.8, 0.8, 0.8);
    }

    _initMaterial(warderobe) {
        return new THREE.MeshPhongMaterial({ color: new THREE.Color(0xff00ff)});
        // return new THREE.MeshPhongMaterial({ map: warderobe.fetchTexture('crate:side') });
    }
};

class Crate extends THEATRE.Actor {

    _initObject(warderobe) {

        const g = new THREE.BoxGeometry(1, 1, 1);
        const texturedMaterial = new THREE.MeshPhongMaterial({ map: warderobe.fetchTexture('crate:side') });

        return new THREE.Mesh(g, texturedMaterial);
    }
};

document.addEventListener('DOMContentLoaded', () => {

    const canvas = document.querySelector('canvas');

    // construct a theatre
    const theatre = new THEATRE.Theatre(canvas);

    theatre.on('pick', (event) => {
        console.log('pick', event);
    });

    const testStage = theatre.createStage('test');
    testStage.setAmbience({
        ambientColor: new THREE.Color( 0xffffff )
    });

    theatre.warderobe.importTexture('crate:side', './crate.png', 'pixelart');

    let size = 1;

    const boxes = new Boxes(size * size);
    const crate = new Crate();

    function resize(newSize) {

        boxes.resize(newSize * newSize);

        let x = 0;
        let y = 0;
        for (let i = 0; i < newSize * newSize; i++) {

            x += 1;
            if (x > newSize) {
                y += 1;
                x = 0;
            }

            boxes.setPositionAt(i, new THREE.Vector3(x,y,0));
            boxes.setColorAt(i, new THREE.Color(0xffffff));
        }
    }

    theatre.warderobe.wait().then(() => {

        theatre.transitionTo('test');        
        testStage.insert(boxes);
        testStage.insert(crate);

        resize();
        
        crate.moveTo(0, 0, 3);

        setTimeout(() => {

            resize(150);

            console.log('resized to', 150);
        }, 5000);

        setTimeout(() => {

            resize(50);

            console.log('resized to', 50);
        }, 15000);

        setInterval(() => {
            console.log(theatre.stats.toJSON());
        }, 1000);
    });
});
