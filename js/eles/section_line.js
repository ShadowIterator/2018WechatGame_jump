import {PI, INF, EPS} from  '../libs/geometry'
import {Point, Circle, Segment, Colli} from '../libs/geometry'
import {DBcmp, add, _add, sub, _sub, mul, _mul, div, _div,
    rotate, _rotate, dot, cross, _reverse,
    mod_2, mod, _normalize, normalize, _relen,
    dist_2, relen, isZero, _toZero, calH,
    pointOnSegment, pointInCircle,
    CircleOnCircle} from '../libs/geometry'

import Stair from './stair'
import NormalStair from './normal_stair';

export default class SectionLine extends Stair{
    constructor(y, sceneParam, op_funcs = null) {
        super(new Segment(new Point(-INF, y), new Point(INF, y)), new Point(0, -1));
        this.sceneParam = sceneParam;
        this.y = y;
        this.op_funcs = op_funcs;
        this.className = 'sectionline';
    }

    toggle(scene) {
        // scene.hero.decreaseLife();
        // this.hero.die();
        // hero.dead = true;
        // this.prototype.setHero.apply(this, hero);
        // super.toggle(scene);
        scene._setParams(this.sceneParam);
        if(this.op_funcs !== null) {
            for(let i = 0; i < this.op_funcs.length; ++i) {
                this.op_funcs[i]();
            }
        }
        // for(let i = scene.stairs.length - 1; i >= 0; --i) {
        //     scene.stairs[i].Vy.y = -scene.stairs[i].Vy.y;
        // }
        // scene.stairs.push(new NormalStair(new Point(-INF, this.y - scene.heroR * 3), new Point(-INF, this.y - scene.heroR * 3), new Point(0, Math.abs(scene.params.CURRENT_EJECT_VY))));
        this.shape.setPos(new Point(0, -1));
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