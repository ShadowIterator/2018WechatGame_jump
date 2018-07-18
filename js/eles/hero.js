
import Sprite from '../base/sprite'
import {PI, INF, EPS} from  '../libs/geometry'
import {Point, Circle, Segment, Colli} from '../libs/geometry'
import {DBcmp, add, _add, sub, _sub, mul, _mul,
    rotate, _rotate, dot, cross, _reverse,
    mod_2, mod, _normalize, normalize, _relen,
    dist_2, relen, isZero, _toZero, calH,
    pointOnSegment, pointInCircle,
    CircleOnCircle} from '../libs/geometry'


const IMGSRC = '';
const HERO_WIDTH = 10;
const HERO_HEIGHT = 10;

export default class Hero{
    constructor (S, V) {
        // super(IMGSRC, HERO_WIDTH, HERO_HEIGHT);
        this.shape = S;
        this.V = V;
        this.life = 1;
        this.className = 'hero';
    }

    drawToCanvas(ctx, transPosition) {
        let P = transPosition(this.shape.O);
        ctx.beginPath();
        ctx.arc(P.x, P.y, this.shape.R, 0, 2 * PI, false);
        ctx.strokeStyle = '#00f';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}