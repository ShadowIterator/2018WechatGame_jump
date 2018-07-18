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

export default class RocketProp extends Prop {
    constructor(S) {
        super(S);
        this.T = 150;
        this.t = 0;
        this.V = new Point(0, 5);
        // this.bind_timePass = this.timePass.bind(this);
    }

    drawToCanvas(ctx, transPosition) {
        if(!this.toggled) {
            let P = transPosition(this.shape.O);
            ctx.beginPath();
            ctx.arc(P.x, P.y, this.shape.R, 0, 2 * PI, false);
            ctx.strokeStyle = '#ff0';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
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
        this.toggled = true;
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
    }

    effOver(scene) {
        scene.hero.decreaseEff();
        --cnt;
        if(cnt === 0)
            scene._setheroVy(new Point(0, 0));
        // else
        //     _sub(scene.hero.V, this.V);

    }





}