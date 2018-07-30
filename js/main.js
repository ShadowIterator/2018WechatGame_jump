import Scene from  './ctrl/scene'
import Control from './ctrl/control'
import {Point, Circle, PI} from './libs/geometry'
import {pointInCircle} from './libs/geometry'
import Button from './ctrl/button'

const ratio = wx.getSystemInfoSync().pixelRatio;


let ctx = canvas.getContext('2d');
let screenWidth=canvas.width;
let screenHeight=canvas.height;
let buttonRadius=30 / 360 * screenWidth;
let buttonY=screenHeight-3*buttonRadius;

let openDataContext = wx.getOpenDataContext();

export default class Main {
    constructor() {
        this.aniId = 0;
        this.frame = 0;
        this.score = 0;
        this.scene = {};
        this.control = {};
        this.status = 'over';
        this.btn=[];

        sharedCanvas.width=screenWidth*ratio;
        sharedCanvas.height=screenHeight*ratio;

        openDataContext.postMessage({
            op: 'init',
        });

        this.bind_touchstart_hdr = this.touchstart_hdr.bind(this);
        canvas.addEventListener('touchstart', this.bind_touchstart_hdr);

        wx.setKeepScreenOn({keepScreenOn: true});
        this.restart();
        this.gameInit();

    }

    gameInit()
    {
      this.status = 'init';
      this.btn = [];
      this.btn.push(new Button(new Circle(new Point(screenWidth/2, buttonY), buttonRadius), 'startBtn'));
      this.control.removeEvent();
    }

    gameover(score) {
        while (this.btn.length!==0)
          this.btn.pop();

        this.score = score;
        this.status = 'over';
        openDataContext.postMessage({
          op: 'updateScore',
          score: String(Math.floor(this.score))
        });
        this.btn.push(new Button(new Circle(new Point(screenWidth/3, buttonY), buttonRadius), 'ranklist'));
        this.btn.push(new Button(new Circle(new Point(screenWidth*2/3, buttonY), buttonRadius), 'playagain'));
        this.control.removeEvent();
    }

    gamePause()
    {
      this.status = 'pause';
      while (this.btn.length!==0)
        this.btn.pop();
      this.btn.push(new Button(new Circle(new Point(screenWidth/3, buttonY), buttonRadius), 'mainmenu'));
      this.btn.push(new Button(new Circle(new Point(screenWidth*2/3, buttonY), buttonRadius), 'restart'));
      this.btn.push(new Button(new Circle(new Point(buttonRadius,buttonRadius),buttonRadius), 'backtogame'));
    }

    gameRanklist()
    {
      while (this.btn.length!==0)
        this.btn.pop();

      openDataContext.postMessage({
        op: 'rend'
      });
      this.status='ranklist';
      this.btn.push(new Button(new Circle(new Point(screenWidth/3, buttonY), buttonRadius), 'lastpage'));
      this.btn.push(new Button(new Circle(new Point(screenWidth*2/3, buttonY), buttonRadius), 'nextpage'));
      this.btn.push(new Button(new Circle(new Point(screenWidth/2, buttonY), buttonRadius), 'close'));
    }


    touchstart_hdr(e) {
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
        else if(this.status === 'pause') {
            e.preventDefault();
            for(let i=0; i<this.btn.length; i++)
            {
                if(pointInCircle(P, this.btn[i].C))
                {
                    if(this.btn[i].desc==='mainmenu')
                    {
                        this.gameInit();
                    }
                    else if(this.btn[i].desc==='restart')
                    {
                        this.restart();
                    }
                    else if(this.btn[i].desc==='backtogame')
                    {
                        this.gaming();
                    }
                }
            }
        }
        else if(this.status === 'gaming') {
            e.preventDefault();
            for(let i=0; i<this.btn.length; i++)
            {
                if(pointInCircle(P, this.btn[i].C))
                {
                    if(this.btn[i].desc==='pauseGame')
                    {
                        // this.status = 'init';
                        this.gamePause();
                    }
                }
            }
        }
    }

    restart() {
        this.score = 0;
        this.frame = 0;
        this.scene = new Scene(canvas.width, canvas.height, this.gameover.bind(this));
        this.control = new Control(canvas.width, canvas.height, this.scene);

        this.scene.controller = this.control;
        this.scene.init();

        this.gaming();

        this.bindLoop = this.loop.bind(this);

        window.cancelAnimationFrame(this.aniId);

        this.aniId = window.requestAnimationFrame(
            this.bindLoop,
            canvas
        );
    }

    render_ranklist() {

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
    }

    gaming() {
        this.status = 'gaming';
        this.btn = [];
        this.btn.push(new Button(new Circle(new Point(buttonRadius / 2, buttonRadius / 2), buttonRadius / 2), 'pauseGame'));
    }

    render_gaming() {
        this.scene.render(ctx);
        this.control.render(ctx);
        for(let i=0; i<this.btn.length; i++)
        {
            let btnImage=new Image();
            let C=this.btn[i].C;
            if(this.btn[i].desc==='pauseGame')
            {
                btnImage.src='images/pause.png';
            }
            ctx.drawImage(btnImage,C.O.x-C.R, C.O.y-C.R, 2*C.R, 2*C.R);
        }
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
      ctx.fillText(`Jump`, screenWidth/2, canvas.height / 2);

      let C = this.btn[0].C;
      let startBtnImage=new Image();
      startBtnImage.src='images/startbtn.png';
      ctx.drawImage(startBtnImage,C.O.x-C.R, C.O.y-C.R, 2*C.R, 2*C.R);
    }

    render_pause() {
      ctx.fillStyle = '#0ff';
      ctx.font = '20px Arial';
      ctx.textAlign='center';
      ctx.fillText(`What do you wanna do ?`, screenWidth/2, canvas.height / 2);

      for(let i=0; i<this.btn.length; i++)
      {
        let btnImage=new Image();
        let C=this.btn[i].C;
        if(this.btn[i].desc==='backtogame')
        {
          btnImage.src='images/backtogame.png';
        }
        else if(this.btn[i].desc==='restart')
        {
          btnImage.src='images/restart.png';
        }
        else if(this.btn[i].desc==='mainmenu')
        {
          btnImage.src='images/mainmenu.png';
        }

        ctx.drawImage(btnImage,C.O.x-C.R, C.O.y-C.R, 2*C.R, 2*C.R);
      }
    }

    render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if(this.status === 'gaming') this.render_gaming();
        else if(this.status === 'over') this.render_over();
        else if(this.status === 'init') this.render_init();
        else if(this.status === 'ranklist') this.render_ranklist();
        else if(this.status === 'pause') this.render_pause();
    }

    loop() {
        this.frame++;
        this.render();
        if(this.status === 'gaming') this.scene.update();
        this.aniId = window.requestAnimationFrame(
            this.bindLoop,
            canvas
        )
    }
}
