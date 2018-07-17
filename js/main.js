// import Player from './player/index'
// import Enemy from './npc/enemy'
// import BackGround from './runtime/background'
// import GameInfo from './runtime/gameinfo'
// import Music from './runtime/music'
// import DataBus from './databus'

// import Stone from './stone/stone'

import Scene from  './ctrl/scene'
import Control from './ctrl/control'

let ctx = canvas.getContext('2d')
// let databus = new DataBus()

/**
 * 游戏主函数
 */

export default class Main {
    constructor() {
        // 维护当前requestAnimationFrame的id
        this.aniId = 0;
        this.frame = 0;
        this.score = 0;
        this.scene = {};
        this.control = {};
        this.status = 'onConstruction';
        console.log('start construct scene');

         this.restart();
         this.gameover();
    }

    gameover(score) {
        this.score = score;
        this.status = 'over';
        this.bind_touchstart_hdr = this.touchstart_hdr.bind(this)
        canvas.addEventListener('touchstart', this.bind_touchstart_hdr);
        this.control.removeEvent();
    }

    touchstart_hdr(e) {

        console.log('touchEventHandler');

        e.preventDefault()

        this.restart()

    }

    restart() {

        this.score = 0;
        this.frame = 0;
        this.scene = new Scene(canvas.width, canvas.height, this.gameover.bind(this));
        this.control = new Control(canvas.width, canvas.height, this.scene);
        this.status = 'gaming';
        console.log('construct scene done');

        canvas.removeEventListener(
            'touchstart',
            this.bind_touchstart_hdr
        );

        this.bindLoop = this.loop.bind(this);

        window.cancelAnimationFrame(this.aniId);

        this.aniId = window.requestAnimationFrame(
            this.bindLoop,
            canvas
        );
    }

    render_gaming() {
        this.scene.render(ctx);
        this.control.render(ctx);
    }

    render_over() {
        // context.strokeStyle = Obj.sS;
        // context.font = Obj.font;
        // context.beginPath();
        // context.fillText(`${Obj.text.toFixed(0)}%`, Obj.px, Obj.py);
        // context.stroke();
        // // context.closePath();
        // context.restore();
        // ctx.save();
        ctx.fillStyle = '#0ff';
        ctx.font = '20px Arial';
        // ctx.beginPath();
        ctx.fillText(`game over, touch screen to restart`, 10, canvas.height / 2);
        ctx.fillText(`your score is ${parseInt(this.score)}`, 10, 20 + canvas.height / 2)
        // ctx.stroke();
        // ctx.closePath();
        // ctx.restore();

        // ctx.beginPath();
        // ctx.arc(canvas.width / 2, canvas.height / 2, 30, 0, 6.28, false);
        // ctx.strokeStyle = '#0ff';
        // ctx.lineWidth = 2;
        // ctx.stroke();
    }

    render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if(this.status === 'gaming') this.render_gaming();
        else if(this.status === 'over') this.render_over();
    }
    // // 实现游戏帧循环
    loop() {
        // databus.frame++
        this.frame++;
        this.render();
        // if(this.status === 'gaming' && (this.frame) % 3 === 0) {
            this.scene.update();
        // }
        this.aniId = window.requestAnimationFrame(
            this.bindLoop,
            canvas
        )
    }
}
