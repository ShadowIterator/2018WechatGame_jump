import {PI, INF, EPS} from  '../libs/geometry'
import {Point, Circle, Segment, Colli} from '../libs/geometry'
import {DBcmp, add, _add, sub, _sub, mul, _mul, div, _div,
    rotate, _rotate, dot, cross, _reverse,
    mod_2, mod, _normalize, normalize, _relen,
    dist_2, relen, isZero, _toZero, calH,
    pointOnSegment, pointInCircle,
    CircleOnCircle} from '../libs/geometry'

import Hero from '../eles/hero'
import Enemy from '../eles/enemy'
import Stair from '../eles/stair'

const NVy = new Point(0, 1);
const AVE_STAIRS_PER_Y = 0.015;
const AVE_STAIRS_LEN = 40;
const VARIANCE_STAIRS_LEN = 1;
const g = 5;
const Ag = new Point(0, -g);
const DEFAULT_EJECT_VY = 30;
const DEFAULT_EJECT_H = DEFAULT_EJECT_VY * DEFAULT_EJECT_VY / (2 * g);
const AVE_ENEMY_PER_Y = 0.005;
const AVE_ENEMY_V = 2;
const AVE_ENEMY_T = 100;
const ENEMY_DX = 200;
const ENEMY_DY = 100;
const AVE_EMEMY_STP = 3;


function getRandUniform(L, R) {
    return parseInt(L + Math.random() * (R - L));
}

function CirColliCir(C1, V, C2, res) {
    let V1 = sub(C2.O, C1.O);
    let V2 = normalize(V);
    // console.log('V1', V1)
    // console.log('V2', V2);
    let L2 = dot(V1, V2);
    let h_2 = mod_2(V1) - L2 * L2;
    let L3 = C2.R + C1.R;
    if(DBcmp(h_2, L3 * L3) > 0) return false;
    let d = L2 - Math.sqrt(L3 * L3 - h_2);
    if(DBcmp(d, 0) < 0) return false;
    // console.log('L2', L2, 'h_2', h_2, 'L3', L3, 'd', d);
    if(DBcmp(d, V) > 0) return false;
    _mul(V2, d);
    // console.log('V2', V2);
    // console.log('O',this.C.O);
    res.P = add(C1.O, V2);
    res.N = normalize(sub(res.P, C2.O));
    res.d = d;
    // console.log('inside,res.N', res.N);
    // console.log('inside,res.P', res.P);
    // console.log('inside,res', res);
    return true;
}

function CircolliSeg(C, V, S, res) {
    let V1 = normalize(V);
    // console.log(S.P1, S.P2);
    let V2 = normalize(sub(S.P1, S.P2));
    let abs_sinT = Math.abs(cross(V1, V2));
    let P1 = calH(S, C.O);
    // let V3 = sub(this.C.O, S.P1);
    // let dPP = dot(V3, V2);
    // _mul(V2, dPP);
    // let P1 = add(S.P1, V2);
    let V3 = sub(P1, C.O);
    if(DBcmp(dot(V3, V1), 0) <= 0)
        return false;
    let h = mod(V3);
    let d = h / abs_sinT - C.R / abs_sinT;
    // if(DBcmp(d, 0) <= 0)
    //     return false;
    _mul(V1, d);
    res.P = add(C.O, V1);
    let P2 = calH(S, res.P);
    if(!pointOnSegment(P2, S))
        return false;
    res.N = sub(res.P, P2);
    res.d = d;
    return true;
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

function __sortStairByy(A, B) {
    return -DBcmp(A.shape.P1.y, B.shape.P1.y);
}

function __sortEnemyByy(A, B) {
    return -DBcmp(A.maxy, B.maxy);
}

export default class Scene {
    constructor(tW, tH, callback_gameover) {
        this.H = tH;
        this.W = tW;
        this.Wd2 = tW / 2;
        this.Hd2 = tH / 2;
        this.hero = new Hero(new Circle(new Point(this.Wd2, 7), 5), new Point(0,0));
        this.centerP = new Point(this.Wd2, this.Hd2);
        this.ceilliney = this.H / 3;
        this.maxStairH = 0;
        this.underliney = 0;
        this.stairs = [];
        this.enemys = [];
        this.score = 0;
        this.callback_gameover = callback_gameover;
        this.highestY = 0;
        this.gameover = false;

        console.log('start construct stairs');

        // this.stairs.push(new Stair(new Segment(new Point(-100, 0), new Point(this.W + 100, 0)), new Point(0, 25)));
        // this.stairs.push(new Stair(new Segment(new Point(-100, -3), new Point(this.W + 100, -3)), new Point(0, 25)));
        this.stairs.push(this.genStair_exact(this.hero.shape.O.x - getRandUniform(1, AVE_STAIRS_LEN / 2),
            this.hero.shape.O.x + getRandUniform(1, AVE_STAIRS_LEN / 2),
            0));

        this.stairs.push(this.genStair_exact(this.hero.shape.O.x - getRandUniform(1, AVE_STAIRS_LEN / 2),
            this.hero.shape.O.x + getRandUniform(1, AVE_STAIRS_LEN / 2),
            15));

        console.log('exact stairs done');
        this.appendStairs(10, this.H, DEFAULT_EJECT_H, AVE_STAIRS_PER_Y * 2);
        this.appendEnemy(this.H / 2, this.H, AVE_ENEMY_PER_Y);
        console.log('append stairs done');
    }

    _setheroVx(Vx) {
        // let conj = dot(V, NVy);
        //     V = mul(NVy, conj);
        //     _add(V, Vx);
        //     console.log('_setx, V ', V);
        let conj = dot(this.hero.V, NVy);
        this.hero.V = mul(NVy, conj);
        _add(this.hero.V, Vx);
        console.log('_setheroVx ',this.hero.V);
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
            stair_y = getRandUniform(last_y, highest_y - 5) + 1;
            stair = this.genStair(stair_y);
            console.log('gen stair done');
            this.stairs.push(stair);
            last_y = highest_y;
            highest_y = stair.Vy.y * stair.Vy.y / (2 * g) + stair_y;
            // console.log(highest_y);
        }
        this.maxStairH = highest_y;
        for(let k = rho * (H - L - 1); k >= 0; --k) {
            stair_y = getRandUniform(L, H);
            stair = this.genStair(stair_y);
            this.stairs.push(stair);
        }
    }

    genRoutine(X) {
        let t = mod(X) / AVE_ENEMY_V;
        _div(X, t);
        return {V: X, t: t};
    }

    genEnemy(y) {
        let x = getRandUniform(0, this.W);
        let rtn = new Enemy(new Circle(new Point(x, y), 15), new Point(0, 0));
        let stp = getRandGauss(1, 3, AVE_EMEMY_STP, 2);
        let maxy = y;
        let P = new Point(x, y);
        let P0 = new Point(x, y);
        for(; stp > 0; --stp) {
            let dx = getRandUniform(-ENEMY_DX, ENEMY_DX);//getRandGauss(-ENEMY_DX, ENEMY_DX, 0, 30);
            let dy = getRandUniform(-ENEMY_DY, ENEMY_DY);//getRandGauss(-ENEMY_DY, ENEMY_DY, 0, 30);
            let X = new Point(dx, dy);
            _add(P, X);
            maxy = Math.max(maxy, P.y);
            rtn.addroutine(this.genRoutine(X));
        }
        _sub(P0, P);
        rtn.addroutine(this.genRoutine(P0));
        rtn.maxy = maxy;
        return rtn;
    }

    appendEnemy(L, H, rho) {
        for(let i = L; i < H; ++i) {
            if(DBcmp(Math.random(), rho) < 0) {
                this.enemys.push(this.genEnemy(i));
            }
        }
    }

    transPosition(P) {
        // console.log('trans cP ', this.centerP);
        // console.log('trans Hd2 ', this.Hd2);
        // console.log('trans P', P);
        return new Point(P.x, this.centerP.y + this.Hd2 - P.y);
    }

    render(ctx) {
        ctx.fillStyle = '#f00';
        ctx.font = '10px Arial';
        ctx.fillText(`your score is ${this.score}`, 0, 10);
        this.hero.drawToCanvas(ctx, this.transPosition.bind(this));
        for(let i = this.stairs.length - 1; i >= 0; --i) {
            // console.log(this.stairs[i]);
            this.stairs[i].drawToCanvas(ctx, this.transPosition.bind(this));
        }
        for(let i = this.enemys.length - 1; i >= 0; --i) {
            this.enemys[i].drawToCanvas(ctx, this.transPosition.bind(this));
        }

    }

    heroLoop() {
        if(this.hero.shape.O.x < 0) this.hero.shape.O.x += this.W;
        if(this.hero.shape.O.x > this.W) this.hero.shape.O.x -= this.W;
    }

    moveHero(t) {
        if(this.gameover) return ;
        // console.log('t', t);
        // console.log(this.hero);
        if(DBcmp(t, 0) === 0) return ;
        if(isZero(this.hero.V)) return ;

        let res = {
            P: new Point(0, 0),
            d: INF,
            V: new Point(0, 0)
        };
        // res.d = INF;
        let tres = {};
        let res_stair = {};
        tres.P = new Point(0, 0);
        let herov = mod(this.hero.V);

        for(let i = this.enemys.length - 1; i >= 0; --i) {
            if(CirColliCir(this.hero.shape, this.hero.V, this.enemys[i].shape, tres)) {
                if(DBcmp(t, tres.d  / herov) > 0) {
                    this.gameover = true;
                    this.callback_gameover(this.score);
                    return;
                }
            }
            if(CircleOnCircle(this.hero.shape, this.enemys[i].shape)) {
                this.gameover = true;
                this.callback_gameover(this.score);
                return;
            }
        }

        for(let i = this.stairs.length - 1; i >= 0; --i) {
            if(!CircolliSeg(this.hero.shape, this.hero.V, this.stairs[i].shape, tres))
                continue;
            // console.log(this.stairs[i].Vy, tres.N);
            if(DBcmp(res.d, tres.d) > 0 && DBcmp(dot(this.stairs[i].Vy, tres.N), 0) > 0) {
                res = new Colli(tres);
                res_stair = this.stairs[i];
            }
        }
        let rt = res.d / herov;
        // console.log(rt, t);
        if(DBcmp(t, rt) > 0) {
            this.hero.shape.O = Object.create(res.P);
            let VN = res_stair.Vy;
            let VH = rotate(VN, -PI / 2);
            _normalize(VH);
            _mul(VH, dot(VH, this.hero.V));
            this.hero.V = add(VH, VN);
            // _sub(this.hero.V, mul(Ag, rt));
            this.heroLoop();
            this.moveHero(t - rt);
            return ;
        }
        else {
            _add(this.hero.shape.O, this.hero.V);
            // _sub(this.hero.V, mul(Ag, t));
            this.heroLoop();
            // return ;
        }
        return ;
    }

    update() {
        if(this.gameover) return ;
        this.moveHero(1);
        this.score = Math.max(this.hero.shape.O.y, this.score);
        _add(this.hero.V, Ag);
        this.update_screen();
        if(DBcmp(this.hero.shape.O.y, this.underliney) < 0) {
            this.gameover = true;
            this.callback_gameover(this.score);
        }
        for(let i = this.enemys.length -1; i >= 0; --i) {
            this.enemys[i].timePass(1);
            _add(this.enemys[i].shape.O, this.enemys[i].V);
            if(i === 0)
                console.log(this.enemys[i].shape.O);
        }
    }

    update_screen() {
        //move screen
        if(this.gameover) return ;

        if(DBcmp(this.hero.shape.O.y, this.ceilliney) > 0) {
            let nceily = parseInt(this.hero.shape.O.y);
            let delta = nceily - this.ceilliney;
            this.appendStairs(this.H + this.underliney, this.H + this.underliney + delta,
                this.maxStairH, AVE_STAIRS_PER_Y);
            this.appendEnemy(this.H + this.underliney, this.H + this.underliney + delta);
            this.clearStair(this.underliney + delta);
            this.clearEnemy(this.underliney + delta);
            this.underliney += delta;
            this.ceilliney = nceily;
            this.centerP.y += delta;
        }
    }

    clearStair(H) {
        this.stairs.sort(__sortStairByy);
        let k = 0;
        for(k = 0; k < this.stairs.length; ++k)
            if(DBcmp(this.stairs[k].shape.P1.y, H) < 0)
                break;
        this.stairs = this.stairs.slice(0, k);
    }

    clearEnemy(H) {
        this.enemys.sort(__sortEnemyByy);
        let k = 0;
        for(k = 0; k < this.enemys.length; ++k)
            if(DBcmp(this.enemys[k].maxy, H) < 0)
                break;
        this.enemys = this.enemys.slice(0, k);
    }
}