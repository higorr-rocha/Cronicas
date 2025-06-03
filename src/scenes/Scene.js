import { Lyra } from './Lyra.js';

export class Scene extends Phaser.Scene {
    constructor() {
        super('Scene');
    }

    create() {
        const map = this.make.tilemap({ key: 'templo' });
        const tileset = map.addTilesetImage('templo', 'tiles');

        map.createLayer('chao', tileset, 0, 0);
        const paredes = map.createLayer('parede', tileset, 0, 0);
        paredes.setCollisionByProperty({ colisao: true });
        const porta = map.createLayer('porta fechada', tileset, 0, 0);
        porta.setCollisionByProperty({ colisao: true });
        map.createLayer('botao', tileset, 0, 0);

        const centerMapX = map.widthInPixels / 2;
        const centerMapY = map.heightInPixels / 2;

        this.lyra = new Lyra(this, centerMapX -600, centerMapY-20);

        this.physics.add.collider(this.lyra, paredes);
        this.physics.add.collider(this.lyra, porta);

        // Faz a câmera seguir Lyra
        this.cameras.main.startFollow(this.lyra);

        // Define os limites da câmera para o tamanho do mapa
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Aplica zoom (opcional)
        this.cameras.main.setZoom(2);
    }

    update() {
        this.lyra.update();
    }
}
