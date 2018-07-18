
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

export default class Stair{
    constructor (S, Vy) {
        // super(IMGSRC);
        this.shape = S;
        this.Vy = Vy;
        this.V = new Point(0, 0);
        this.className = 'stair'
    }

    maxHeight(g) {
        return this.Vy.y * this.Vy.y / (2 * g) + this.shape.P1.y;
    }


    setHero(hero) {
        let VN = this.Vy;
        let VH = rotate(VN, -PI / 2);
        _normalize(VH);
        _mul(VH, dot(VH, hero.V));
        hero.V = add(VH, VN);
    }

    timePass(t) {

    }

    drawToCanvas(ctx, transPosition) {
        let P1 = transPosition(this.shape.P1);
        let P2 = transPosition(this.shape.P2);
        ctx.beginPath();
        ctx.moveTo(P1.x, P1.y);
        ctx.lineTo(P2.x, P2.y);
        ctx.strokeStyle = '#0ff';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

}