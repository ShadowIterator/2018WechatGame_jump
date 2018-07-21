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

let cnt = 0;
const dadySrc='images/shield.png';

export default class WhosyourdaddyProp extends Prop {
    constructor(S) {
        super(S);
        this.T = 150;
        this.t = 0;
        this.setImg(dadySrc);
    }

    // drawToCanvas(ctx, transPosition) {
    //     if(!this.toggled) {
    //         let P = transPosition(this.shape.O);
    //         ctx.beginPath();
    //         ctx.arc(P.x, P.y, this.shape.R, 0, 2 * PI, false);
    //         ctx.strokeStyle = '#448';
    //         ctx.lineWidth = 2;
    //         ctx.stroke();
    //     }
    // }

    timePass(t, scene) {
        --this.t;

        if(this.t === 0)
            this.done = true;
    }

    static init_all() {
        cnt = 0;
    }

    toggle(scene) {
        if(this.toggled)
            return ;
        this.done = false;
        if(cnt === 0) {
            scene.hero.whosyourdaddy = true;
        }
        //     _add(scene.hero.V, this.V);
        ++cnt;
        scene.pushEffect({timePass: this.bind_timePass, effOver: this.bind_effOver, checkDone: this.bind_checkDone});
        this.t = this.T;
        super.toggle();
    }

    effOver(scene) {
        --cnt;
        if(cnt === 0) {
            scene.hero.whosyourdaddy = false;
        }
        // super.effOver();
        // else
        //     _sub(scene.hero.V, this.V);

    }





}
