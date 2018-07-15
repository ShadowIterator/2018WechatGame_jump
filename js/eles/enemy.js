
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
const ENEMY_WIDTH = 10;
const ENEMY_HEIGHT = 10;

export default class Hero extends Sprite {
    constructor (S, V) {
        super(IMGSRC, ENEMY_WIDTH, ENEMY_HEIGHT);
        this.shape = S;
        this.V = V;
        this.className = 'enemy';
    }

}