import {PI, INF, EPS} from  '../libs/geometry'
import {Point, Circle, Segment, Colli} from '../libs/geometry'
import {DBcmp, add, _add, sub, _sub, mul, _mul, div, _div,
    rotate, _rotate, dot, cross, _reverse,
    mod_2, mod, _normalize, normalize, _relen,
    dist_2, relen, isZero, _toZero, calH,
    pointOnSegment, pointInCircle,
    CircleOnCircle} from '../libs/geometry'

import Stair from './stair'

const deadStairSrc='images/deadstair.png';

export default class DeadStairs extends Stair{
    constructor(S, Vy) {
        super(S, Vy);

        this.setImg(deadStairSrc);

    }

    toggle(scene) {
        scene.hero.decreaseLife();
        // this.hero.die();
        // hero.dead = true;
        // this.prototype.setHero.apply(this, hero);
        super.toggle(scene);
    }



}
