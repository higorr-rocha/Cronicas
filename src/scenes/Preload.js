export class Preload extends Phaser.Scene {
    constructor() {
        super('Preload');
    }

    preload() {
        this.load.image('background', 'assets/Maps/exterior.png');
        this.load.image('deserto', 'assets/Maps/deserto_templo.jpeg');
        this.load.image('tiles', 'assets/Maps/templo-16x16.png');
        this.load.tilemapTiledJSON('templo', 'assets/Maps/templo_1_interior.json');
        this.load.spritesheet('lyra', 'assets/Character/Lyra-Spritesheet.png', { frameWidth: 32, frameHeight: 64 });
    }

    create() {
        this.scene.start('Scene'); // Troca para a cena principal após carregar tudo
    }
}