import {PI, INF, EPS} from  '../libs/geometry'
import {Point, Circle, Segment, Colli} from '../libs/geometry'
import {DBcmp, add, _add, sub, _sub, mul, _mul, div, _div,
    rotate, _rotate, dot, cross, _reverse,
    mod_2, mod, _normalize, normalize, _relen,
    dist_2, relen, isZero, _toZero, calH,
    pointOnSegment, pointInCircle,
    CircleOnCircle} from '../libs/geometry'

import Stair from './stair'

export default class ChangingStairs extends Stair{
    constructor(S, Vy) {
        super(S, Vy);
        this.lV = new Point(0, 0);
        this.rV = new Point(0, 0);
        this.lT = 1;
        this.rT = 1;
        this.lS = 0;
        this.rS = 0;
        this.lt = 0;
        this.rt = 0;
    }

    setHero(hero) {
        hero.life = 0;
        // this.prototype.setHero.apply(this, hero);
        super.setHero(hero);
    }


    drawToCanvas(ctx, transPosition) {
        let P1 = transPosition(this.shape.P1);
        let P2 = transPosition(this.shape.P2);
        ctx.beginPath();
        ctx.moveTo(P1.x, P1.y);
        ctx.lineTo(P2.x, P2.y);
        ctx.strokeStyle = '#f00';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}