class CheckerboardTiles extends THEATRE.InstantiatedActor {

    _atlasMaterial = null;

    _initMaterial(warderobe) {

        // Get the loaded textures
        const crateTexture = warderobe.fetchTexture('crate:side');
        const floorTexture = warderobe.fetchTexture('floor:top');

        // Create texture atlas from both textures (assuming 32x32 pixel textures)
        // const atlas = THEATRE.createTextureAtlas([crateTexture, floorTexture], 32);

        // Create the atlas material with 2 textures
        // this._atlasMaterial = new THEATRE.TextureAtlasMaterial(atlas, 2);

        // Use the pre-created atlas material
        // return atlasMaterial;
        return new THREE.MeshPhongMaterial({ color: new THREE.Color(0xff00ff)});
    }

    _initGeometry(warderobe) {
        return new THREE.BoxGeometry(0.9, 0.9, 0.2);
    }
};

document.addEventListener('DOMContentLoaded', () => {

    const canvas = document.querySelector('canvas');

    // construct a theatre
    const theatre = new THEATRE.Theatre(document.body, {
        canvas
    });

    const testStage = theatre.createStage('test');
    testStage.setAmbience({
        ambientColor: new THREE.Color( 0xffffff )
    });

    // Import both textures
    theatre.warderobe.importTexture('crate:side', './crate.png', 'pixelart');
    theatre.warderobe.importTexture('floor:top', './floor.png', 'pixelart');

    // Create an 8x8 grid of tiles (64 instances)
    const gridSize = 8;
    const tiles = new CheckerboardTiles(gridSize * gridSize);

    // Position tiles in a checkerboard pattern
    let index = 0;
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            // Position each tile
            tiles.setPositionAt(index, new THREE.Vector3(x, y, 0));

            // Create checkerboard pattern: alternate between texture 0 (crate) and 1 (floor)
            const textureIndex = (x + y) % 2;
            // tiles.setUniformAt(index, 'textureIndex', textureIndex);

            index++;
        }
    }

    // Wait for textures to load before creating the atlas
    theatre.warderobe.wait().then(() => {

        testStage.insert(tiles);
        console.log('Created', tiles.count, 'tiles in checkerboard pattern');

        theatre.transitionTo('test');
    });
});
