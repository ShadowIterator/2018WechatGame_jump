// import Sprite from '../base/sprite'
import {PI, INF, EPS} from  '../libs/geometry'
import {Point, Circle, Segment, Colli} from '../libs/geometry'
import {DBcmp, add, _add, sub, _sub, mul, _mul,
    rotate, _rotate, dot, cross, _reverse,
    mod_2, mod, _normalize, normalize, _relen,
    dist_2, relen, isZero, _toZero, calH,
    pointOnSegment, pointInCircle,
    CircleOnCircle} from '../libs/geometry'

import Prop from './prop';

const rocketSrc='images/digivice.png';
const withRocketSrc='images/metal.png';
const oringinSrc='images/hero.png';

let cnt = 0;

export default class RocketProp extends Prop {
    constructor(S) {
        super(S);
        this.T = 150;
        this.t = 0;
        this.V = new Point(0, 5);
        // this.bind_timePass = this.timePass.bind(this);
      this.setImg(rocketSrc);
    }

    // drawToCanvas(ctx, transPosition) {
    //     if(!this.toggled) {
    //         let P = transPosition(this.shape.O);
    //         ctx.drawImage(this.img, P.x-this.shape.R, P.y-this.shape.R, this.shape.getWidth(), this.shape.getHeight());
    //
    //     }
    // }

    static init_all() {
        cnt = 0;
    }

    timePass(t, scene) {
        --this.t;
        if(this.t === 0)
            this.done = true;
        // scene._setheroVy(this.V);
    }

    toggle(scene) {
        if(this.toggled)
            return ;
        // this.toggled = true;
        this.done = false;
        scene.hero.increaseEff();
        // scene.hero.V = this.V;
        // scene._setheroVy(this.V);
        if(cnt === 0)
            scene._setheroVy(this.V);
        //     _add(scene.hero.V, this.V);
        ++cnt;
        scene.pushEffect({timePass: this.bind_timePass, effOver: this.bind_effOver, checkDone: this.bind_checkDone});
        this.t = this.T;
        scene.hero.setImg(withRocketSrc);

        super.toggle();
    }

    effOver(scene) {
        scene.hero.decreaseEff();
        --cnt;
        if(cnt === 0)
        {
          scene._setheroVy(new Point(0, 0));
          scene.hero.setImg(oringinSrc);
        }

        super.effOver();
        // else
        //     _sub(scene.hero.V, this.V);

    }





}
