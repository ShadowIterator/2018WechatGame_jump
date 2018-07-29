
import Button from './button'
import {PI, INF, EPS} from  '../libs/geometry'
import {Point, Circle, Segment, Colli} from '../libs/geometry'
import {DBcmp, add, _add, sub, _sub, mul, _mul,
    rotate, _rotate, dot, cross, _reverse,
    mod_2, mod, _normalize, normalize, _relen,
    dist_2, relen, isZero, _toZero, calH,
    pointOnSegment, pointInCircle,
    CircleOnCircle} from '../libs/geometry'

import Scene from './scene'

const NVy = new Point(0, 1);
const Vzero = new Point(0, 0);
const defaultV = 1.7;

function gravityScale(x) {
  {
    return 3.33*x*x+4.67*Math.abs(x);
  }
}

function _setx(V, Vx) {
    let conj = dot(V, NVy);
    V = mul(NVy, conj);
    _add(V, Vx);
}

export default class Control {
    constructor(tW, tH, scene) {

        this.W = tW;
        this.H = tH;

        this.Vlx = new Point(-defaultV / 320 * tW, 0);
        this.Vrx = new Point(defaultV / 320 * tW, 0);
        this.DEFAULT_BTN_R = 30 / 320 * tW;

        this.btn = [];
        this.btn.push(new Button(new Circle(new Point(0 + this.DEFAULT_BTN_R, tH - this.DEFAULT_BTN_R), this.DEFAULT_BTN_R), 'jleft'));
        this.btn.push(new Button(new Circle(new Point(tW - this.DEFAULT_BTN_R, tH - this.DEFAULT_BTN_R), this.DEFAULT_BTN_R), 'jright'));
        this.target = scene;
        
        this.touchLeft=new Set();
        this.touchRight=new Set();

        this.initEvent();
    }

    reverseLR() {
        let temp = this.Vlx.x;
        this.Vlx.x = this.Vrx.x;
        this.Vrx.x = temp;
    }

    setVlx_len(x) {
        this.Vlx.x = x * this.Vlx.x / Math.abs(this.Vlx.x);
    }

    setVrx_len(x) {
        this.Vrx.x = x * this.Vrx.x / Math.abs(this.Vrx.x);
    }

    initGravity()
    {
     this.render = this.render_gravity.bind(this);

      wx.startAccelerometer({
        interval: 'game'
      });

      wx.onAccelerometerChange(this.gravity_change.bind(this));
    }
    
    shutDownGravity()
    {
      wx.stopAccelerometer();
    }
    
    initButton()
    {
      this.render = this.render_button.bind(this);

      canvas.addEventListener('touchstart', this.touchstart_hdr.bind(this));
      
      canvas.addEventListener('touchmove', this.touchmove_hdr.bind(this));
      
      canvas.addEventListener('touchend', this.touchend_hdr.bind(this));
      
      this.touchLeft.clear();
      this.touchRight.clear();
    }
    
    shutDownButton()
    {
      canvas.removeEventListener('touchstart', this.touchstart_hdr.bind(this));

      canvas.removeEventListener('touchmove', this.touchmove_hdr.bind(this));

      canvas.removeEventListener('touchend', this.touchend_hdr.bind(this));
    }
    
    
    initEvent() {
        this.initGravity()
    }

  gravity_change(e)
  {
    if(e.x>0)
    {
      this.target._setheroVx(mul(this.Vrx, gravityScale(e.x)));
    }
    else if(e.x<0)
    {
      this.target._setheroVx(mul(this.Vlx, gravityScale(e.x)));
    }
    else
    {
      this.target._setheroVx(Vzero);
    }
  }

    removeEvent() {
        
        this.shutDownButton();

        this.shutDownGravity();

    }

    touchstart_hdr(e) {
        e.preventDefault();
        let P = new Point(0, 0);

      for(let i=0; i<e.changedTouches.length; ++i)
      {
          P.x = e.changedTouches[i].clientX;
          P.y = e.changedTouches[i].clientY;
          for(let j = 0; j < this.btn.length; ++j) {
            if( pointInCircle(P, this.btn[j].C)) {
              if(this.btn[j].desc === 'jleft') {
  
                this.target._setheroVx(this.Vlx);
                this.touchLeft.add(e.changedTouches[i].identifier);
              
              }
              else {
                this.target._setheroVx(this.Vrx);
                this.touchRight.add(e.changedTouches[i].identifier);
              }
            }
          }
      }
    }

    touchmove_hdr(e) {
        e.preventDefault();
    }

    touchend_hdr(e) {
        e.preventDefault();
        for(let i=0; i<e.changedTouches.length; ++i)
        {
          if(this.touchLeft.has(e.changedTouches[i].identifier))
          {
            this.touchLeft.delete(e.changedTouches[i].identifier);
          }
          else if(this.touchRight.has(e.changedTouches[i].identifier))
          {
            this.touchRight.delete(e.changedTouches[i].identifier);
          }
        }
        if(this.touchLeft.size===0 && this.touchRight.size!==0)
        {
          this.target._setheroVx(this.Vrx);
        }
        else if(this.touchRight.size===0 && this.touchLeft.size!==0)
        {
          this.target._setheroVx(this.Vlx);
        }
        else if(this.touchLeft.size===0 && this.touchRight.size===0)
        {
          this.target._setheroVx(Vzero);
        }
    }




    render_button(ctx) {
        for(let i = this.btn.length - 1; i >= 0; --i) {
            ctx.beginPath();
            let C = this.btn[i].C;
            ctx.arc(C.O.x, C.O.y, C.R, 0, 2 * PI, false);
            ctx.strokeStyle = '#0f0';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    render_gravity(ctx) {

    }

}
