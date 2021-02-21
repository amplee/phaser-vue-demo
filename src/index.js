/*
 * @Descripttion: 
 * @Author: amplee
 * @Date: 2021-02-08 11:55:16
 * @LastEditors: amplee
 * @LastEditTime: 2021-02-21 10:05:58
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
        // 移动端自适应
        if (!this.game.device.os.desktop) {
            this.scale.scaleMode = Phaser.Scale.FIT;
            this.scale.refresh();
        }
        
        // 加载资源
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

        // 添加百分比进度条
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

        // 加载过程中，添加百分比进度条
        this.load.on('progress', function(value) {
            percentText.setText(parseInt(value * 100) + '%');
        });

        // 状态完成，移除百分比进度条
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
        // 添加背景
        const bg = this.add.image(0, 0, 'bg').setOrigin(0);
        // 添加飞机精灵
        const plane = this.add.sprite(this.game.config.width / 2, 100, 'myplane');
        // 创建飞行帧动画
        this.anims.create({
          key: 'fly',
          frames: this.anims.generateFrameNumbers('myplane', { start: 0, end: 3}),
          frameRate: 10,
          repeat: -1 // 重复
      });
      // 飞机调用飞行动画
      plane.anims.play('fly');

      // 添加开始按钮
      const startbutton = this.add.sprite(this.game.config.width / 2, 200, 'startbutton', 1).setInteractive();
      // 开始按钮事件
      startbutton.on('pointerdown', () => {
          startbutton.setFrame(0);
      });
      startbutton.on('pointerup', () => {
          startbutton.setFrame(1);
          console.log('start game');
          this.scene.start('play');
          startAudio.stop();
      });

      // 添加声音
      const startAudio = this.sound.add('normalback');
      startAudio.play({
          loop: true,
          volume: 0.1
      })
    },
    update() {},
}

gameSenceCenter.play = {
    key: 'play',
    create() {
        // 重置数据
      this.gameOver = false;
      // 添加背景
      this.bg = this.add.tileSprite(0, 0, this.game.config.width, this.game.config.height, 'bg').setOrigin(0);

      // 添加计分文本
      this.scoreText = this.add.text(0, 0, 'Score: 0', { color: '#ff0000', fontSize: '16px'});
      this.score = 0;

      // 引入飞机精灵
      this.plane = this.add.sprite(this.game.config.width / 2, 100, 'myplane').setInteractive({ draggable: true});
      // 创建飞行帧动画
      this.anims.create({
          key: 'fly',
          frames: this.anims.generateFrameNumbers('myplane', { start: 0, end: 3}),
          frameRate: 10,
          repeat: -1
      });
      // 飞机调用飞行动画
      this.plane.anims.play('fly');
      this.tweens.add({
          targets: this.plane,
          y: this.game.config.height - this.plane.height,
          duration: 1000,
          onComplete: () => {
              // 飞机拖拽处理
              this.plane.on('drag', function(pointer, dragX, dragY) {
                  this.x = dragX;
                  this.y = dragY;
              });
              // 飞机添加边缘检测
              this.physics.add.existing(this.plane);
              this.plane.body.setCollideWorldBounds(true);
          }
      });

      // 创建子弹组
      this.bullets = this.add.group();

      // 创建敌机
      this.enemySmall = this.add.sprite(30, 30, 'enemy1');
      this.physics.add.existing(this.enemySmall);
      
      // 设置子弹默认时间为0
      this.myBulletBeforeTime = 0;

    },
    updated() {
      const time = new Date().getTime();
      // 子弹
      if (time - this.myBulletBeforeTime > 200 && !this.gameOver) {
        //   createBulletByLife.call(this);
          const bullet = this.add.sprite(this.plane.x, this.plane.y - this.plane.height / 2, 'mybullet');

          this.myBulletBeforeTime = time;
          this.physics.add.existing(bullet);
          bullet.body.setVelocity(0, -300);
      }
      // 背景滚动
      this.bg.tilePositionY -= 1;
    },
}

function createBulletByLife() {
    if (this.plane.life === 2) {
        for (let index = 0; index < 3; index++) {
            createBullets.call(this, index - 1);
        }
    } else if (this.plane.life === 3) {
        for (let index = 0; index < 5; index++) {
            createBullets.call(this, index - 2);
        }
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 240,
    height: 400,
    scene: [gameSenceCenter.boot, gameSenceCenter.start, gameSenceCenter.play],
    physics: {
        default: 'arcade'
    }
};

const game = new Phaser.Game(config);
