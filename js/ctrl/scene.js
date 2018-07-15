import {PI, INF, EPS} from  '../libs/geometry'
import {Point, Circle, Segment, Colli} from '../libs/geometry'
import {DBcmp, add, _add, sub, _sub, mul, _mul,
    rotate, _rotate, dot, cross, _reverse,
    mod_2, mod, _normalize, normalize, _relen,
    dist_2, relen, isZero, _toZero, calH,
    pointOnSegment, pointInCircle,
    CircleOnCircle} from '../libs/geometry'

import Hero from '../eles/hero'
import Enemy from '../eles/enemy'
import Stair from '../eles/stair'

const AVE_STAIRS_PER_Y = 0.01;
const AVE_STAIRS_LEN = 40;
const VARIANCE_STAIRS_LEN = 1;
const g = 5;
const DEFAULT_EJECT_VY = 25;
const DEFAULT_EJECT_H = DEFAULT_EJECT_VY * DEFAULT_EJECT_VY / (2 * g);

function getRandUniform(L, R) {
    return parseInt(L + Math.random() * (R - L));
}

function getRandGauss(L, R, mu, sigma) {
    let rtn = 0;
    do {
        let u = Math.random();
        let v = Math.random();
        let y = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * PI * v);
        rtn = y * sigma + mu;
    }while(rtn < L || R < rtn);
    return rtn;
}

export default class Scene {
    constructor(tW, tH) {
        this.H = tH;
        this.W = tW;
        this.Wd2 = tW / 2;
        this.Hd2 = tH / 2;
        this.hero = new Hero(new Circle(new Point(this.Wd2, 7), 5));
        this.centerP = new Point(this.Wd2, this.Hd2);
        this.stairs = [];
        this.enemys = [];

        console.log('start construct stairs');
        this.stairs.push(this.genStair_exact(this.hero.shape.O.x - getRandUniform(1, AVE_STAIRS_LEN / 2),
            this.hero.shape.O.x + getRandUniform(1, AVE_STAIRS_LEN / 2),
            0));
        console.log('exact stairs done');
        this.appendStairs(10, this.H, DEFAULT_EJECT_H, AVE_STAIRS_PER_Y);
        console.log('append stairs done');
    }

    genStair(y) {
        let len = getRandGauss(AVE_STAIRS_LEN - VARIANCE_STAIRS_LEN * 3,
                    AVE_STAIRS_LEN + VARIANCE_STAIRS_LEN * 3, AVE_STAIRS_LEN,
                    VARIANCE_STAIRS_LEN);
        // console.log('genStair: len',len);
        let lx = getRandUniform(0, this.W - len);
        let rtn = new Stair(new Segment(new Point(lx, y), new Point(lx + len, y)), new Point(0, DEFAULT_EJECT_VY));
        return rtn;
    }

    genStair_exact(lx, rx, y) {
        console.log('genStair_exact ',lx, rx, y);
        let rtn = new Stair(new Segment(new Point(lx, y), new Point(rx, y)), new Point(0, DEFAULT_EJECT_VY));
        // console.log('genStair_exact ', rtn);
        return rtn;
    }

    appendStairs(L, H, first_y, rho) {
        console.log(H);
        let highest_y = first_y;
        let last_y = L;
        let stair = {};
        let stair_y = 0;
        // let gen_ys = [];
        while (highest_y < H) {
            console.log(last_y);
            console.log(highest_y);
            stair_y = getRandUniform(last_y, highest_y) + 1;
            stair = this.genStair(stair_y);
            console.log('gen stair done');
            this.stairs.push(stair);
            last_y = highest_y;
            highest_y = stair.Vy.y * stair.Vy.y / (2 * g) + stair_y;
            // console.log(highest_y);
        }
        for(let k = rho * (H - L - 1); k >= 0; --k) {
            stair_y = getRandUniform(L, H);
            stair = this.genStair(stair_y);
            this.stairs.push(stair);
        }
    }

    transPosition(P) {
        // console.log('trans cP ', this.centerP);
        // console.log('trans Hd2 ', this.Hd2);
        // console.log('trans P', P);
        return new Point(P.x, this.centerP.y + this.Hd2 - P.y);
    }

    render(ctx) {
        this.hero.drawToCanvas(ctx, this.transPosition.bind(this));
        for(let i = this.stairs.length - 1; i >= 0; --i) {
            // console.log(this.stairs[i]);
            this.stairs[i].drawToCanvas(ctx, this.transPosition.bind(this));
        }
    }
}