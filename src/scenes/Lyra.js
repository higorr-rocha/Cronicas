export class Lyra extends Phaser.GameObjects.Sprite {
    static DEFAULT_SPEED = 3; // Valor padrão de velocidade

    constructor(scene, x, y) {
        super(scene, x, y, 'lyra');
        scene.add.existing(this);

        this.setFrame(4); // Define o quadro inicial

        // Cria animações apenas se ainda não existirem
        if (!scene.anims.exists('up')) {
            scene.anims.create({
                key: 'up',
                frames: scene.anims.generateFrameNumbers('lyra', { start: 1, end: 3 }),
                frameRate: 5,
                repeat: -1
            });
        }
        if (!scene.anims.exists('down')) {
            scene.anims.create({
                key: 'down',
                frames: scene.anims.generateFrameNumbers('lyra', { start: 5, end: 7 }),
                frameRate: 5,
                repeat: -1
            });
        }
        if (!scene.anims.exists('left')) {
            scene.anims.create({
                key: 'left',
                frames: scene.anims.generateFrameNumbers('lyra', { start: 9, end: 11 }),
                frameRate: 5,
                repeat: -1
            });
        }
        if (!scene.anims.exists('right')) {
            scene.anims.create({
                key: 'right',
                frames: scene.anims.generateFrameNumbers('lyra', { start: 13, end: 15 }),
                frameRate: 5,
                repeat: -1
            });
        }

        // Adiciona controles WASD
        this.keys = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.lastDirection = 'down'; // Direção inicial
    }

    update() {
        const speed = Lyra.DEFAULT_SPEED;
        let moving = false;

        if (this.keys.up.isDown) {
            this.y -= speed;
            this.play('up', true);
            this.lastDirection = 'up';
            moving = true;
        } else if (this.keys.down.isDown) {
            this.y += speed;
            this.play('down', true);
            this.lastDirection = 'down';
            moving = true;
        } else if (this.keys.left.isDown) {
            this.x -= speed;
            this.play('left', true);
            this.lastDirection = 'left';
            moving = true;
        } else if (this.keys.right.isDown) {
            this.x += speed;
            this.play('right', true);
            this.lastDirection = 'right';
            moving = true;
        }

        // Limita a posição dentro dos limites da câmera
        this.x = Phaser.Math.Clamp(this.x, 0, this.scene.cameras.main.width);
        this.y = Phaser.Math.Clamp(this.y, 0, this.scene.cameras.main.height);

        if (!moving) {
            this.anims.stop();
            // Define o frame de parada conforme a última direção
            if (this.lastDirection === 'up') this.setFrame(0);
            else if (this.lastDirection === 'down') this.setFrame(4);
            else if (this.lastDirection === 'left') this.setFrame(8);
            else if (this.lastDirection === 'right') this.setFrame(12);
        }
    }
}