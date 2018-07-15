// import Player from './player/index'
// import Enemy from './npc/enemy'
// import BackGround from './runtime/background'
// import GameInfo from './runtime/gameinfo'
// import Music from './runtime/music'
// import DataBus from './databus'

// import Stone from './stone/stone'

import Scene from  './ctrl/scene'

let ctx = canvas.getContext('2d')
// let databus = new DataBus()

/**
 * 游戏主函数
 */
let CL = [];
let LL = [];
export default class Main {
    constructor() {
        // 维护当前requestAnimationFrame的id
        this.aniId = 0;
        console.log('start construct scene');
        this.scene = new Scene(canvas.width, canvas.height);
        console.log('construct scene done');
        this.restart();
    }

    restart() {
        canvas.removeEventListener(
            'touchstart',
            this.touchHandler
        );

        this.bindLoop = this.loop.bind(this);

        window.cancelAnimationFrame(this.aniId);

        this.aniId = window.requestAnimationFrame(
            this.bindLoop,
            canvas
        );
    }

    render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.scene.render(ctx);
    }
    // // 实现游戏帧循环
    loop() {
        // databus.frame++
        this.frame++;
        this.render();
        this.aniId = window.requestAnimationFrame(
            this.bindLoop,
            canvas
        )
    }
}
