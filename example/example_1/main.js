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

    theatre.transitionTo('intro');

    console.log(theatre);
});
