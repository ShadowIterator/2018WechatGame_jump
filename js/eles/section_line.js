import {PI, INF, EPS} from  '../libs/geometry'
import {Point, Circle, Segment, Colli} from '../libs/geometry'
import {DBcmp, add, _add, sub, _sub, mul, _mul, div, _div,
    rotate, _rotate, dot, cross, _reverse,
    mod_2, mod, _normalize, normalize, _relen,
    dist_2, relen, isZero, _toZero, calH,
    pointOnSegment, pointInCircle,
    CircleOnCircle} from '../libs/geometry'

import Stair from './stair'

export default class SectionLine extends Stair{
    constructor(S, sceneParam) {
        super(S, new Point(0, -1));
        this.sceneParam = sceneParam;
    }

    toggle(scene) {
        // scene.hero.decreaseLife();
        // this.hero.die();
        // hero.dead = true;
        // this.prototype.setHero.apply(this, hero);
        // super.toggle(scene);
        scene._setParams(this.sceneParam);
        this.shape.setPos(new Point(0, -1));
    }


    // drawToCanvas(ctx, transPosition) {
    //     let P1 = transPosition(this.shape.P1);
    //     let P2 = transPosition(this.shape.P2);
    //     ctx.beginPath();
    //     ctx.moveTo(P1.x, P1.y);
    //     ctx.lineTo(P2.x, P2.y);
    //     ctx.strokeStyle = '#f00';
    //     ctx.lineWidth = 2;
    //     ctx.stroke();
    // }
}