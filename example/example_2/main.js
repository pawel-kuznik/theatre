class Tile extends THEATRE.Actor {

    _initObject() {

        const g = new THREE.BoxGeometry(1, 1, .2);
        const m = new THREE.MeshBasicMaterial({ color: 0x0000ff });

        return new THREE.Mesh(g, m);
    }
};


document.addEventListener('DOMContentLoaded', () => {

    const canvas = document.querySelector('canvas');

    // construct a theatre
    const theatre = new THEATRE.Theatre(canvas);

    const testStage = theatre.createStage('test');
    testStage.setAmbience({
        ambientColor: new THREE.Color( 0xff0000 )
    });

    const grid = new THEATRE.TiledActors();

    grid.insert(new Tile, 0, 0);
    grid.insert(new Tile, 1, 0);
    grid.insert(new Tile, -1, 0);
    grid.insert(new Tile, 2, 0);
    grid.insert(new Tile, 2, 1);
    grid.insert(new Tile, 2, -1);

    testStage.insert(grid);

    theatre.transitionTo('test');
});
