import {PI, INF, EPS} from  '../libs/geometry'
import {Point, Circle, Segment, Colli} from '../libs/geometry'
import {DBcmp, add, _add, sub, _sub, mul, _mul, div, _div,
    rotate, _rotate, dot, cross, _reverse,
    mod_2, mod, _normalize, normalize, _relen,
    dist_2, relen, isZero, _toZero, calH,
    pointOnSegment, pointInCircle,
    CircleOnCircle} from '../libs/geometry'

import Stair from './stair'
const changingStairSrc='images/normalstair.png';

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
        this.setImg(changingStairSrc);
    }

    getMinx() {
        return this.shape.P1.x + this.lT * this.lV.x;
    }

    getMaxx() {
        return this.shape.P2.x + this.rT * this.rV.x;
    }

    changeL(t) {
        let rt = t;
        if(DBcmp(t + this.lt, this.lT) > 0)
            rt = this.lT - this.lt;
        if(this.lS === 0) {
            _add(this.shape.P1, mul(this.lV, rt));
            this.lt += rt;
            if(DBcmp(this.lt, this.lT) >= 0) {
                this.lS = 1;
                this.lt = 0;
            }
        }
        else {
            _sub(this.shape.P1, mul(this.lV, rt));
            this.lt += rt;
            if(DBcmp(this.lt, this.lT) >= 0) {
                this.lS = 0;
                this.lt = 0;
            }
        }
        if(DBcmp(t, rt) > 0)
            this.changeL(t - rt);
    }

    changeR(t) {
        let rt = t;
        if(DBcmp(t + this.rt, this.rT) > 0)
            rt = this.rT - this.rt;
        if(this.rS === 0) {
            _add(this.shape.P2, mul(this.rV, rt));
            this.rt += rt;
            if(DBcmp(this.rt, this.rT) >= 0) {
                this.rS = 1;
                this.rt = 0;
            }
        }
        else {
            _sub(this.shape.P2, mul(this.rV, rt));
            this.rt += rt;
            if(DBcmp(this.rt, this.rT) >= 0) {
                this.rS = 0;
                this.rt = 0;
            }
        }
        if(DBcmp(t, rt) > 0)
            this.changeR(t - rt);

    }

    timePass(t) {
       this.changeL(t);
       this.changeR(t);
    }


}
