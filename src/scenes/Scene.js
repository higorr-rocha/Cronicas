import { Lyra } from './Lyra.js';

export class Scene extends Phaser.Scene {
    constructor() {
        super('Scene');
    }

    create() {
        // Adiciona o fundo centralizado
        this.add.image(640, 360, 'background');

        // Adiciona a personagem na cena
        this.lyra = new Lyra(this, 212, 490);
    }

    update() {
        this.lyra.update();
    }
}
