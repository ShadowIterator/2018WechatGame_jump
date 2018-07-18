import Sprite from '../base/sprite'
import {PI, INF, EPS} from  '../libs/geometry'
import {Point, Circle, Segment, Colli} from '../libs/geometry'
import {DBcmp, add, _add, sub, _sub, mul, _mul,
    rotate, _rotate, dot, cross, _reverse,
    mod_2, mod, _normalize, normalize, _relen,
    dist_2, relen, isZero, _toZero, calH,
    pointOnSegment, pointInCircle,
    CircleOnCircle} from '../libs/geometry'

export default class Prop extends Sprite{
    constructor(S) {
        super(S);
        this.toggled = false;
        this.done = true;
        this.bind_timePass = this.timePass.bind(this);
        this.bind_effOver = this.effOver.bind(this);
        this.bind_checkDone = this.checkDone.bind(this);
    }

    drawToCanvas(ctx, transPosition) {
        let P = transPosition(this.shape.O);
        ctx.beginPath();
        ctx.arc(P.x, P.y, this.shape.R, 0, 2 * PI, false);
        ctx.strokeStyle = '#ff0';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    checkDone() {
        return this.done;
    }

    timePass(t, scene) {

    }

    toggle(scene) {

    }

    effOver(scene) {

    }

}