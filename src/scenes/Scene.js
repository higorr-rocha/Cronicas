import { Lyra } from './Lyra.js';

export class Scene extends Phaser.Scene {
    constructor() {
        super('Scene');
    }

    create() {
        // Adiciona o fundo centralizado
        this.add.image(640, 360, 'background');

        // Adiciona a personagem na cena
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        this.lyra = new Lyra(this, centerX - 428, centerY + 125);
    }

    update() {
        this.lyra.update();
    }
}
