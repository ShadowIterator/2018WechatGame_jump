// import Player from './player/index'
// import Enemy from './npc/enemy'
// import BackGround from './runtime/background'
// import GameInfo from './runtime/gameinfo'
// import Music from './runtime/music'
// import DataBus from './databus'

// import Stone from './stone/stone'

//TODO:
//BUG when get a spring prop (_setheroVy)
//ranklist: sort, blur(pixelratio), refractor index.js && render in main.js, add a button to show ranklist
//refractor scene.js

import Scene from  './ctrl/scene'
import Control from './ctrl/control'
import {Point, Circle, PI} from './libs/geometry'
import {pointInCircle} from './libs/geometry'
import Button from './ctrl/button'
// import drawRanklistToSharedCanvas from 'openDataContext/index'

const ratio = wx.getSystemInfoSync().pixelRatio;


let ranklist_flag = false;
let ctx = canvas.getContext('2d');
// let shctx = sharedCanvas.getContext('2d');
let screenWidth=canvas.width;
let screenHeight=canvas.height;
let buttonRadius=30 / 360 * screenWidth;
let buttonY=screenHeight-3*buttonRadius;

// let databus = new DataBus()
let openDataContext = wx.getOpenDataContext();


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
        this.status = 'over';//'onConstruction';
        this.btn=[];

        sharedCanvas.width=screenWidth*ratio;
        sharedCanvas.height=screenHeight*ratio;
        console.log('start construct scene');

        // wx.setUserCloudStorage({
        //     KVDataList: [{
        //         key: 'curScore',
        //         value: '2'
        //     }],
        //     success: (res => {
        //         console.log('1 setData, sucess');
        //     })
        // });

        openDataContext.postMessage({
            op: 'init',
        });

        // openDataContext.postMessage({
        //     op: 'updateScore',
        //     score: '12300'
        // });

        // openDataContext.postMessage({
        //     op: 'updateScore',
        //     score: '1234'
        // });




        wx.setKeepScreenOn({keepScreenOn: true});
        this.restart();
        //this.gameover();
        this.gameInit();
    }

    gameInit()
    {

      this.status = 'init';

      this.btn.push(new Button(new Circle(new Point(screenWidth/2, buttonY), buttonRadius), 'startBtn'));
      this.bind_touchstart_hdr = this.touchstart_hdr.bind(this);
      canvas.addEventListener('touchstart', this.bind_touchstart_hdr);
      this.control.removeEvent();
    }

    gameover(score) {
        while (this.btn.length!==0)
          this.btn.pop();
        canvas.removeEventListener(
          'touchstart',
          this.bind_touchstart_hdr
        );

        this.score = score;
        this.status = 'over';
        openDataContext.postMessage({
          op: 'updateScore',
          score: String(Math.floor(this.score))
        });
        this.btn.push(new Button(new Circle(new Point(screenWidth/3, buttonY), buttonRadius), 'ranklist'));
        this.btn.push(new Button(new Circle(new Point(screenWidth*2/3, buttonY), buttonRadius), 'playagain'));
        this.bind_touchstart_hdr = this.touchstart_hdr.bind(this);
        canvas.addEventListener('touchstart', this.bind_touchstart_hdr);
        this.control.removeEvent();
    }

    gameRanklist()
    {
      while (this.btn.length!==0)
        this.btn.pop();
      canvas.removeEventListener(
        'touchstart',
        this.bind_touchstart_hdr
      );
      openDataContext.postMessage({
        op: 'rend'
      });
      this.status='ranklist';
      this.btn.push(new Button(new Circle(new Point(screenWidth/3, buttonY), buttonRadius), 'lastpage'));
      this.btn.push(new Button(new Circle(new Point(screenWidth*2/3, buttonY), buttonRadius), 'nextpage'));
      this.btn.push(new Button(new Circle(new Point(screenWidth/2, buttonY), buttonRadius), 'close'));
      this.bind_touchstart_hdr=this.touchstart_hdr.bind(this);
      canvas.addEventListener('touchstart', this.bind_touchstart_hdr);

    }


    touchstart_hdr(e) {

        console.log('touchEventHandler');
        e.preventDefault();
        let P = new Point(0, 0);
        P.x = e.changedTouches[0].clientX;
        P.y = e.changedTouches[0].clientY;
        if(this.status==='init')
        {
          if( pointInCircle(P, this.btn[0].C))
          {
            this.restart();
          }
        }
        else if(this.status==='over')
        {
          e.preventDefault();
          for(let i=0; i<this.btn.length; i++)
          {
            if(pointInCircle(P, this.btn[i].C))
            {
              if(this.btn[i].desc==='playagain')
              {
                this.restart();
              }
              else if(this.btn[i].desc==='ranklist')
              {
                this.gameRanklist();
              }
            }
          }
          //this.restart();
        }
        else if(this.status==='ranklist')
        {
          e.preventDefault();
          for(let i=0; i<this.btn.length; i++)
          {
            if(pointInCircle(P, this.btn[i].C))
            {
              if(this.btn[i].desc==='lastpage')
              {
                openDataContext.postMessage({
                  op: 'lastpage',
                });
              }
              else if(this.btn[i].desc==='nextpage')
              {
                openDataContext.postMessage({
                  op: 'nextpage',
                });
              }
              else if(this.btn[i].desc==='close')
              {
                this.gameover(this.score);
              }
            }
          }

        }
        // e.preventDefault()
        //
        // this.restart()

    }

    touchstart_hdr_nothing(e) {
        e.preventDefault();
    }

    restart() {

        let dpr = wx.getSystemInfoSync().pixelRatio;
        // canvas.width *= dpr;
        // canvas.height *= dpr;
        this.score = 0;
        this.frame = 0;
        this.scene = new Scene(canvas.width, canvas.height, this.gameover.bind(this));
        this.control = new Control(canvas.width, canvas.height, this.scene);

        // this.control.shutDownGravity();
        // this.control.initButton();

        this.scene.controller = this.control;
        this.scene.init();

        while (this.btn.length!==0)
          this.btn.pop();

        this.status = 'gaming';
        console.log('construct scene done');

        canvas.removeEventListener(
            'touchstart',
            this.bind_touchstart_hdr
        );

        canvas.addEventListener(
            'touchstart',
            this.touchstart_hdr_nothing.bind(this)
        );

        this.bindLoop = this.loop.bind(this);

        window.cancelAnimationFrame(this.aniId);

        this.aniId = window.requestAnimationFrame(
            this.bindLoop,
            canvas
        );
    }

    render_ranklist() {
        // drawRanklistToSharedCanvas();

        // openDataContext.postMessage({
        //     op: 'rend',
        // });


        ctx.drawImage(sharedCanvas, 0, 0, screenWidth, screenHeight);

      for(let i=0; i<this.btn.length; i++)
      {
        let btnImage=new Image();
        let C=this.btn[i].C;
        if(this.btn[i].desc==='lastpage')
        {
          btnImage.src='images/lastpage.png';
        }
        else if(this.btn[i].desc==='nextpage')
        {
          btnImage.src='images/nextpage.png';
        }
        else if(this.btn[i].desc==='close')
        {
          btnImage.src='images/close.png';
        }
        ctx.drawImage(btnImage,C.O.x-C.R, C.O.y-C.R, 2*C.R, 2*C.R);
      }

      // let C = this.btn[0].C;
      // let startBtnImage=new Image();
      // startBtnImage.src='images/startbtn.png';
      // ctx.drawImage(startBtnImage,C.O.x-C.R, C.O.y-C.R, 2*C.R, 2*C.R);


    }

    render_gaming() {
        this.scene.render(ctx);
        this.control.render(ctx);
    }

    render_over() {

        ctx.fillStyle = '#0ff';
        ctx.font = '20px Arial';
        ctx.textAlign='center';
        ctx.fillText(`game over, touch screen to restart`, screenWidth/2, canvas.height / 2);
        ctx.fillText(`your score is ${parseInt(this.score)}`, screenWidth/2, 20 + canvas.height / 2);

        for(let i=0; i<this.btn.length; i++)
        {
          let btnImage=new Image();
          let C=this.btn[i].C;
          if(this.btn[i].desc==='ranklist')
          {
            btnImage.src='images/ranklist.png';
          }
          else if(this.btn[i].desc==='playagain')
          {
            btnImage.src='images/playagain.png';
          }

          ctx.drawImage(btnImage,C.O.x-C.R, C.O.y-C.R, 2*C.R, 2*C.R);
        }
    }

    render_init()
    {
      ctx.fillStyle = '#0ff';
      ctx.font = '20px Arial';
      ctx.textAlign='center';
      ctx.fillText(`Doodle jump`, screenWidth/2, canvas.height / 2);

      let C = this.btn[0].C;
      let startBtnImage=new Image();
      startBtnImage.src='images/startbtn.png';
      ctx.drawImage(startBtnImage,C.O.x-C.R, C.O.y-C.R, 2*C.R, 2*C.R);
    }

    render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if(this.status === 'gaming') this.render_gaming();
        else if(this.status === 'over') this.render_over();
        else if(this.status === 'init') this.render_init();
        else if(this.status === 'ranklist') this.render_ranklist();
    }
    // // 实现游戏帧循环
    loop() {
        // databus.frame++
        this.frame++;
        this.render();
        // if(this.status === 'gaming' && (this.frame) % 3 === 0) {
        if(this.status === 'gaming')    this.scene.update();
        // }
        this.aniId = window.requestAnimationFrame(
            this.bindLoop,
            canvas
        )
    }
}
