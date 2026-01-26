class Boxes extends THEATRE.InstancedActor {

    _initGeometry(warderobe) {

        return new THREE.BoxGeometry(0.8, 0.8, 0.8);
    }

    _initMaterial(warderobe) {

        console.log("init material");

        // Get the loaded textures
        const crateTexture = warderobe.fetchTexture('crate:side');
        const floorTexture = warderobe.fetchTexture('floor:top');
        const stoneTexture = warderobe.fetchTexture('stone');
        const lazulTexture = warderobe.fetchTexture('lazul');

        console.log("fetch textures", crateTexture, floorTexture, stoneTexture, lazulTexture);

        // Create texture atlas from both textures (assuming 32x32 pixel textures)
        const atlas = THEATRE.createTextureAtlas([crateTexture, floorTexture, stoneTexture, lazulTexture], 32);

        // Create the atlas material with 2 textures
        this._atlasMaterial = new THEATRE.TextureAtlasMaterial(atlas, 2, {
            unlit: false,
            // receiveShadows: false
        });

        // Use the pre-created atlas material
        return this._atlasMaterial;
        // return new THREE.MeshPhongMaterial({ color: new THREE.Color(0x000000), map: crateTexture });
        
        // return new THREE.MeshPhongMaterial({ color: new THREE.Color(0xff00ff)});
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

    // construct a theatre
    const theatre = new THEATRE.Theatre(document.body);

    theatre.on('pick', (event) => {
        console.log('pick', event);
    });

    const testStage = theatre.createStage('test');
    testStage.setAmbience({
        ambientColor: new THREE.Color( 0xffffff )
    });

    theatre.warderobe.importTexture('crate:side', './crate.png', 'pixelart');
    theatre.warderobe.importTexture('floor:top', './floor.png', 'pixelart');
    theatre.warderobe.importTexture('stone', './stone.png', 'pixelart');
    theatre.warderobe.importTexture('lazul', './lazul.png', 'pixelart');


    let size = 1;

    const boxes = new Boxes(size * size);
    const crate = new Crate();

    function resize(newSize) {

        boxes.resize(newSize * newSize);

        for (let i = 0; i < newSize * newSize; i++) {

            let x = i % newSize;
            let y = Math.floor(i / newSize);

            boxes.setPositionAt(i, new THREE.Vector3(x,y,0));
            boxes.setColorAt(i, new THREE.Color(0xffffff));
            boxes.setUniformAt(i, 'textureIndex', i % 4);
        }
    }

    theatre.warderobe.wait().then(() => {

        console.log("warderobe ready");

        theatre.transitionTo('test');
        testStage.insert(boxes);
        testStage.insert(crate);

        console.log(testStage);

        resize();
        
        crate.moveTo(0, 0, 3);

        setTimeout(() => {

            resize(10);

            console.log('resized to', 10);
        }, 5000);

        setTimeout(() => {

            resize(4);

            console.log('resized to', 4);
        }, 15000);

        setInterval(() => {
            console.log(theatre.stats.toJSON());
        }, 1000);
    });
});
