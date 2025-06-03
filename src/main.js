import { Preload } from './scenes/Preload.js';
import { Scene } from './scenes/Scene.js';

const config = {
    type: Phaser.AUTO,
    title: 'Cronicas do Khronóvoros',
    description: '',
    parent: 'game-container',
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    pixelArt: true,
        physics: {
        default: 'arcade',
        arcade: {
            debug: false // ou true se quiser ver colisões visualmente
        }
    },
    scene: [Preload, Scene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
