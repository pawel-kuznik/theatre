class Box extends THEATRE.Actor {

    _initObject() {

        const g = new THREE.BoxGeometry(1, 1, 1);
        const m = new THREE.MeshBasicMaterial({ color: 0x0000ff });

        return new THREE.Mesh(g, m);
    }
};


class Card extends THEATRE.HTMLActor {

    _initElement() {

        const elem = document.createElement('div');

        elem.style.width = '120px';
        elem.style.height = '20px';
        elem.style.background = 'red';

        elem.textContent = "TEST";

        const input = document.createElement('input');
        input.type = 'text';
        elem.append(input); 

        const button = document.createElement('button');
        button.textContent = 'Click';
        elem.append(button);

        return elem;
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
    const mainStage = theatre.createStage('main');
    introStage.setAmbience({
        ambientColor: new THREE.Color( 0x00ff00 )
    });

    const box = new Box();

    box.moveTo(0, -1);

    introStage.insert(box);
    const card = new Card();

    introStage.insert(card);

    card.moveTo(0, 0, 2);

    theatre.transitionTo('intro');
});
