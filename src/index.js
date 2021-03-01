/*
 * @Descripttion: 飞机大战
 * @Author: amplee
 * @Date: 2021-02-08 11:55:16
 * @LastEditors: amplee
 * @LastEditTime: 2021-03-01 15:41:52
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
      
        // 添加声音
        this.startAudio = this.sound.add('playback');
        this.explode = this.sound.add('crash3');
        this.pi = this.sound.add('pi');
        this.ao = this.sound.add('ao');
        this.startAudio.play({
            loop: true,
            volume: 0.1,
        })
      // 引入飞机精灵
      this.plane = this.add.sprite(this.game.config.width / 2, 100, 'myplane').setInteractive({ draggable: true});
      // 创建飞行帧动画
      this.anims.create({
          key: 'fly',
          frames: this.anims.generateFrameNumbers('myplane', { start: 0, end: 3}),
          frameRate: 10,
          repeat: -1
      });
        // 创建飞机爆炸帧动画
        this.anims.create({
            key: 'planeBoom',
            frames: this.anims.generateFrameNumbers('myexplode', {
                start: 0,
                end: 3
            }),
            frameRate: 2,
            repeat: 1
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
      this.bullets = this.add.group({
          classType: BulletClass,
          runChildUpdate: true
      });

      // 创建敌机子弹
      const EnemyBulletsClass = EnemyBulletClass(this.game.config.height);
      this.enemyBullets = this.add.group({
            classType: EnemyBulletsClass,
            runChildUpdate: true
        });

      // 创建敌机
      ['enemy1', 'enemy2', 'enemy3'].forEach(item => {
          const EnemyClass = EnemyFactory(item, this.game.config.height, this.enemyBullets);
          this[item] = this.add.group({
              classType: EnemyClass,
              runChildUpdate: true
          });

          const key = item.replace('enemy', '');
          // 创建敌机爆炸动画
          this.anims.create({
              key: `enemyBoom${key}`,
              frames: this.anims.generateFrameNumbers(`explode${key}`, {
                  start: 0,
                  end: 2
              }),
              frameRate: 5,
              repeat: 0
          });
      });
      
      // 设置子弹默认时间为0
      this.myBulletBeforeTime = 0;
      // 设置敌机子弹默认时间为0
      this.enemyBeforeTime = 0;

      // 敌机与飞机的碰撞检测
        ['enemy1', 'enemy2', 'enemy3'].forEach(item => {
            this.physics.add.overlap(this.bullets, this[item], function(bullet, enemy) {
                bullet.destroy();

                // 
                enemy.life -= 1;
                if (enemy.life <= 0) {
                    enemy.destroy();
                    const key = item.replace('enemy', '');
                    this.score = +key + this.score;
                    this.scoreText.setText(`Score: ${this.score}`, this.score);
                    const enemyFrame = this.add.sprite(enemy.x, enemy.y, `explode${key}`);
                    enemyFrame.anims.play(`enemyBoom${key}`);
                    enemyFrame.once('animationcomplete', function() {
                        enemyFrame.destroy();
                    })
                }
            }, null, this);
        });
        // 我的子弹与敌方子弹 碰撞检测
        this.physics.add.overlap(this.bullets, this.enemyBullets, function (bullet, enemyBullet) {
            bullet.destroy();
            enemyBullet.destroy();
        }, null, this);
        // 敌机子弹与飞机的碰撞检测
        this.physics.add.overlap(this.enemyBullets, this.plane, function (enemyBullet, plane) {
            plane.destroy();
            this.gameOver = true;
            // 展示飞机爆炸效果
            const myPlaneFrame =  this.add.sprite(plane.x, plane.y, 'myexplode');
            myPlaneFrame.anims.play('planeBoom');
            myPlaneFrame.once('animationcomplete', () => {
                myPlaneFrame.destroy();
                this.scene.start('restart', {
                    score: this.score
                });
                this.startAudio.stop();
            });
        }, null, this);
    },
    update() {
        const time = new Date().getTime();
        // 子弹
        if (time - this.myBulletBeforeTime > 200 && !this.gameOver) {
        //   createBulletByLife.call(this);
            const bullet = this.bullets && this.bullets.getFirstDead(true); // 重复利用子弹
            if (bullet) {
                bullet.fire();
                bullet.setPosition(this.plane.x, this.plane.y - this.plane.height / 2);
                this.physics.add.existing(bullet);
                bullet.body.setVelocity(0, -300);
                this.myBulletBeforeTime = time;
            }
        }

        // 引入敌机
        if (time - this.enemyBeforeTime > 1200) {
            const enemyIndex = Phaser.Math.Between(1, 3);
            const enemy = this[`enemy${enemyIndex}`].getFirstDead(true);
            if (enemy) {
                enemy.show();
                enemy.setOrigin(0.5, 0.5);
                enemy.setPosition(Phaser.Math.Between(0 + enemy.width, this.game.config.width - enemy.width), 0);
                this.physics.add.existing(enemy);
                enemy.body.setVelocity(0, 200);
                enemy.body.setVelocity(0, 50 * (4 - enemyIndex)); // 敌机越大，飞速越慢
                this.enemyBeforeTime = time;
            }
        }
      // 背景滚动
      this.bg.tilePositionY -= 1;
    },
}

gameSenceCenter.restart = {
    key: 'restart',
    create(data) {
        const bg = this.add.image(0, 0, 'bg').setOrigin(0);
        // 引入飞机精灵
        const plane = this.add.sprite(this.game.config.width / 2, 100, 'myplane');

        // 创建飞行帧动画
        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('myplane', {
                start: 0,
                end: 3
            }),
            frameRate: 10,
            repeat: -1
        });

        // 飞机调用飞行动画
        plane.anims.play('fly');

        // 添加得分
        const scoreText = this.add.text(this.game.config.width / 2, 160, `Score: ${data.score}`, { color: '#ff0000', fontSize: '30px' });
        scoreText.setOrigin(0.5, 0.5);
        // 添加开始按钮
        const restartButton = this.add.sprite(this.game.config.width / 2, 250, 'replaybutton', 0).setInteractive();
        // 开始按钮事件
        restartButton.on('pointerdown', () => {
            restartButton.setFrame(1);
        });
        restartButton.on('pointerup', () => {
            restartButton.setFrame(0);
            console.log('start game');
            this.scene.start('play');
            startAudio.stop();
        });
        // 添加声音
        const startAudio = this.sound.add('normalback');
            startAudio.play({
            loop: true,
            volume: 0.1,
        });
  },
  update() { },
}

const BulletClass = new Phaser.Class({
    Extends: Phaser.GameObjects.Sprite,
    initialize: function Bullet(scene) {
        Phaser.GameObjects.Sprite.call(this, scene, 0, 0, 'mybullet');
    },
    update: function() {
        if (this.y < -50) {
            this.hide();
        }
    },
    fire: function() {
        this.setActive(true);
        this.setVisible(true);
    },
    hide: function() {
        this.setActive(false);
        this.setVisible(false);
    }
});
function EnemyBulletClass(gameHeight) {
    return new Phaser.Class({
        Extends: Phaser.GameObjects.Sprite,
        initialize: function Bullet(scene) {
            Phaser.GameObjects.Sprite.call(this, scene, 0, 0, 'bullet');
        },
        update: function() {
            if (this.y > gameHeight) {
                this.hide();
            }
        },
        fire: function() {
            this.setActive(true);
            this.setVisible(true);
        },
        hide: function() {
            this.setActive(false);
            this.setVisible(false);
        }
    });
}

// 随机返回敌机
function EnemyFactory(key, gameHeight, enemyBullets) {
    return new Phaser.Class({
        Extends: Phaser.GameObjects.Sprite,
        initialize: function Bullet(scene) {
            Phaser.GameObjects.Sprite.call(this, scene, 0, 0, key);
            this.bulletSpeed = 1000 * (4 - key.replace('enemy', ''));
            this.life = key.replace('enemy', '');
            this.enemyBulletsBeforeTime = 0;
            this.index = key.replace('enemy', '');
        },
        update: function () {
            const time = new Date().getTime();
            if (this.y > gameHeight) {
                this.hide();
            }

            if (time - this.enemyBulletsBeforeTime >= this.bulletSpeed) {
                const bullet = enemyBullets.getFirstDead(true);
                if (bullet) {
                    bullet.fire();
                    bullet.setPosition(this.x, this.y + this.height / 2);
                    this.scene.physics.add.existing(bullet);
                    bullet.body.setVelocity(0, 100 * (4 - key.replace('enemy', '')));
                    this.enemyBulletsBeforeTime = time;
                }
            }
        },
        show: function() {
            this.setActive(true);
            this.setVisible(true);
        },
        hide: function() {
            this.setActive(false);
            this.setVisible(false);
        }
    })
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
    scene: [gameSenceCenter.boot, gameSenceCenter.start, gameSenceCenter.play, gameSenceCenter.restart],
    physics: {
        default: 'arcade'
    }
};

const game = new Phaser.Game(config);
