/*
 * @Descripttion: 
 * @Author: amplee
 * @Date: 2021-02-08 11:55:16
 * @LastEditors: amplee
 * @LastEditTime: 2021-02-08 17:54:03
 */
import Phaser from 'phaser';
const assetsMap = require('./asset_map.json');
const asset = {};
const gameSenceCenter = {};
class MyGame extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        for(const key in assetsMap) {
            if (assetsMap.hasOwnProperty(key)) {
                asset[key] = this.load.image(key, require(`./${assetsMap[key]}`))
            }
        }
    }
      
    create ()
    {
        const bg = this.add.image(0, 0, 'bg');
        bg.setOrigin(0, 0);      
    }
}
gameSenceCenter.boot = {
    key: 'boot',
    preload() {
        for(const key in assetsMap) {
            if (assetsMap.hasOwnProperty(key)) {
                switch(key) {
                    case 'myplane':
                        this.load.spritesheet(key, require(`./${assetsMap[key]}`), {
                            frameWidth: 40,
                            frameHeight: 40,
                        });
                    continue;
                    case 'startbutton':
                        this.load.spritesheet(key, require(`./${assetsMap[key]}`), {
                            frameWidth: 100,
                            frameHeight: 40,
                        });
                    continue;
                    case 'replaybutton':
                        this.load.spritesheet(key, require(`./${assetsMap[key]}`), {
                            frameWidth: 80,
                            frameHeight: 30
                        });
                    continue;
                    case 'explode1':
                        this.load.spritesheet(key, require(`./${assetsMap[key]}`), {
                            frameWidth: 20,
                            frameHeight: 20,
                        });
                    continue;
                    case 'explode2':
                        this.load.spritesheet(key, require(`./${assetsMap[key]}`), {
                            frameWidth: 30,
                            frameHeight: 30,
                        });
                    continue;
                    case 'explode3':
                        this.load.spritesheet(key, require(`./${assetsMap[key]}`), {
                            frameWidth: 50,
                            frameHeight: 50,
                        });
                    continue;
                    case 'myexplode':
                        this.load.spritesheet(key, require(`./${assetsMap[key]}`), {
                            frameWidth: 40,
                            frameHeight: 40,
                        });
                    continue;
                    case 'ao':
                    case 'crash1':
                    case 'crash2':
                    case 'crash3':
                    case 'deng':
                    case 'fashe':
                    case 'normalback':
                    case 'pi':
                    case 'playback':
                        this.load.audio(key, require(`./${assetsMap[key]}`));
                    continue;
                    default:
                        assetsMap[key] = this.load.image(key, require(`./${assetsMap[key]}`))
                    continue;
                }
            }
        }

        const percentText = this.make.text({
            x: this.game.config.width / 2,
            y: this.game.config.height / 2 - 5,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#fff'
            }
        })
        .setOrigin(0.5, 0.5);
        if (!this.game.device.os.desktop) {
            this.scale.scaleMode = Phaser.Scale.FIT;
            this.scale.refresh();
        }

        this.load.on('progress', function(value) {
            percentText.setText(parseInt(value * 100) + '%');
        });

        this.load.on('complete', function () {
            percentText.destroy();
        });
    },
    create() {
        this.scene.start('start');
    }
}

gameSenceCenter.start = {
    key: 'start',
    create() {
      this.add.image(0, 0, 'bg').setOrigin(0);
      const plane = this.add.sprite(this.game.config.width / 2, 100, 'myplane');
      this.anims.create({
          key: 'fly',
          frames: this.anims.generateFrameNumbers('myplane', { start: 0, end: 3}),
          frameRate: 10,
          repeat: -1
      });
      plane.anims.play('fly');

      const startbutton = this.add.sprite(this.game.config.width / 2, 200, 'startbutton', 1).setInteractive();
      startbutton.on('pointerdown', () => {
          startbutton.setFrame(0);
      });
      startbutton.on('pointerup', () => {
          startbutton.setFrame(1);
      })
    },
    update() {},
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 240,
    height: 400,
    scene: [gameSenceCenter.boot, gameSenceCenter.start],
};

const game = new Phaser.Game(config);
