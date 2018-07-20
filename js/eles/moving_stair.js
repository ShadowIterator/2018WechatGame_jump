import {PI, INF, EPS} from  '../libs/geometry'
import {Point, Circle, Segment, Colli} from '../libs/geometry'
import {DBcmp, add, _add, sub, _sub, mul, _mul, div, _div,
    rotate, _rotate, dot, cross, _reverse,
    mod_2, mod, _normalize, normalize, _relen,
    dist_2, relen, isZero, _toZero, calH,
    pointOnSegment, pointInCircle,
    CircleOnCircle} from '../libs/geometry'

import Stair from './stair'

const movingStairSrc='images/movingstair.png';

export default class MovingStair extends Stair {
    constructor(S, Vy) {
        super(S, Vy);
        this.className = 'moving_stair';
        this.maxy = 0;
        this.index = 0;
        this.t = 0;
        this.totT = 0;
        this.routine = [];
        this.minx = 0;
        this.maxx = 0;
        this.setImg(movingStairSrc);
    }

    timePass(t) {
        this.t += t;
        this.t %= this.totT;
        for(this.index = 0; this.index < this.routine.length; ++this.index) {
            if(this.routine[this.index].t >= this.t) {
                break;
            }
        }
        this.V = this.routine[this.index].V;

    }

    getMinx() {
        return this.minx;
    }

    getMaxx() {
        return this.maxx;
    }

    addroutine(RT) {
        RT.t += this.totT;
        this.routine.push(RT);
        this.totT = RT.t;
    }

    maxHeight(g) {
        // return this.Vy.y * this.Vy.y / (2 * g) + this.shape.P1.y;
        return this.Vy.y * this.Vy.y / (2 * g) + this.maxy;
    }

<<<<<<< HEAD

=======
    getHeight() {
        return this.maxy;
    }
>>>>>>> 67626e77c67183186fa26f2844ecf8efcdf758ec
}
