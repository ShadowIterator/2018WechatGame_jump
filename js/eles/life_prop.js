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

const lifeSrc='images/life.png';

export default class LifeProp extends Prop {
    constructor(S) {
        super(S);
        this.setImg(lifeSrc);
        // this.V = new Point(0, 15);
        // this.life = 200;
    }

    // drawToCanvas(ctx, transPosition) {
    //     if(!this.toggled) {
    //         let P = transPosition(this.shape.O);
    //         ctx.beginPath();
    //         ctx.arc(P.x, P.y, this.shape.R, 0, 2 * PI, false);
    //         ctx.strokeStyle = '#faf';
    //         ctx.lineWidth = 2;
    //         ctx.stroke();
    //     }
    // }


    toggle(scene) {
        // this.done = true;
        // scene.score += this.score;
        if(this.toggled) return ;
        scene.hero.increaseLife();
        super.toggle();
    }

}
