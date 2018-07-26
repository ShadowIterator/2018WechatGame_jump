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

import NormalStair from '../eles/normal_stair'
import MovingStair from '../eles/moving_stair'
import ChangingStair from '../eles/changing_stairs'
import DeadStair from '../eles/dead_stair'

import Background from '../base/background'

import Prop from '../eles/prop'
import RocketProp from '../eles/rocket_prop'
import SpringProp from '../eles/spring_prop'
import LifeProp from  '../eles/life_prop'
import ScoreProp from '../eles/score_prop'
import ReverseProp from '../eles/reverse_prop'
import WhosyourdaddyProp from  '../eles/whosyourdaddy_prop'
import SectionLine from '../eles/section_line'

const NVy = new Point(0, 1);
const NVx = new Point(1, 0);

const glb_DEFAULT_g = 0.2;
const glb_DEFAULT_EJECT_VY = 5;

function getRandUniform(L, R) {
    return parseInt(L + Math.random() * (R - L));
}

function CirColliCir(C1, V, C2, res) {
    let V1 = sub(C2.O, C1.O);
    let V2 = normalize(V);
    let L2 = dot(V1, V2);
    let h_2 = mod_2(V1) - L2 * L2;
    let L3 = C2.R + C1.R;
    if(DBcmp(h_2, L3 * L3) > 0) return false;
    let d = L2 - Math.sqrt(L3 * L3 - h_2);
    if(DBcmp(d, 0) < 0) return false;
    if(DBcmp(d, V) > 0) return false;
    _mul(V2, d);
    res.P = add(C1.O, V2);
    res.N = normalize(sub(res.P, C2.O));
    res.d = d;
    return true;
}

function CircolliSeg(C, V, S, res) {
    let V1 = normalize(V);
    let V2 = normalize(sub(S.P1, S.P2));
    let abs_sinT = Math.abs(cross(V1, V2));
    let P1 = calH(S, C.O);
    let V3 = sub(P1, C.O);
    if(DBcmp(dot(V3, V1), 0) <= 0)
        return false;
    let h = mod(V3);
    let d = h / abs_sinT - C.R / abs_sinT;
    if(DBcmp(d, 0) < 0) return false;
    _mul(V1, d);
    res.P = add(C.O, V1);
    let P2 = calH(S, res.P);
    if(!pointOnSegment(P2, S))
        return false;
    res.N = sub(res.P, P2);
    res.d = Math.max(d, 0);
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

function genFunctionWithoutParam(f, recv, ...args) {
    return function () {
        f.apply(recv, args);
    }
}

export default class Scene {
    constructor(tW, tH, callback_gameover) {
        this.H = tH;
        this.W = tW;
        this.Wd2 = tW / 2;
        this.Hd2 = tH / 2;
        this.callback_gameover = callback_gameover;

        this.heroR = 0;//5 / 320 * this.W;
        this.hero = {};//new Hero(new Circle(new Point(this.Wd2, 7), 5), new Point(0,0));
        this.centerP = {};//new Point(this.Wd2, this.Hd2);
        this.ceilliney = 0;//this.Hd2;
        this.maxStairH = 0;
        this.underliney = 0;
        this.pause = false;
        this.stairs = [];
        this.enemys = [];
        this.props = [];
        this.score = 0;
        this.gameover = false;
        this.controller = {};
        this.effList = [];
        this.params = {};
        this.heroVx = new Point(0, 0);

        this.background = {};

        this.bind_genMovingStair = this.genMovingStair.bind(this);
        this.bind_genChangingStair = this.genChangingStair.bind(this);
        this.bind_genDeadStair = this.genDeadStair.bind(this);
        this.bind_genNormalStair = this.genNormalStair.bind(this);

        this.bind_genLifeProp = this.genLifeProp.bind(this);
        this.bind_genSpringProp = this.genSpringProp.bind(this);
        this.bind_genScoreProp = this.genScoreProp.bind(this);
        this.bind_genRocketProp = this.genRocketProp.bind(this);
        this.bind_genReverseProp = this.genReverseProp.bind(this);
        this.bind_genWhosyourdaddyProp = this.genWhosyourdaddyProp.bind(this);

        this.__bind_sortStairByy = this.__sortStairByy.bind(this);
        this.__bind_sortEnemyByy = this.__sortEnemyByy.bind(this);
        this.__bind_sortPropByy = this.__sortPropByy.bind(this);

    }

    init() {
        this.heroR = 15; //15 / 320 * this.W;
        this.hero = new Hero(new Circle(new Point(this.Wd2, 17), this.heroR), new Point(0,0));
        this.hero_nextV = new Point(this.hero.V.x, this.hero.V.y);
        this.minx = this.hero.shape.getPos().x;
        this.maxx = this.hero.shape.getPos().x;
        this.hero.whosyourdaddy = false;
        this.centerP = new Point(this.Wd2, this.Hd2);
        this.ceilliney = this.Hd2;
        this.maxStairH = 0;
        this.underliney = 0;
        this.stairs = [];
        this.enemys = [];
        this.props = [];
        this.score = 0;

        this.hero.whosyourdaddy = false;

        this.gameover = false;

        this.effList = [];

        this.background=new Background();

        this.params = {

            movingStair_random_default: 0.2,
            changingStair_random_default: 0.2,
            deadStair_random_default: 0.2,
            normalStair_random_default: 0.4,
            movingStair_key_default: 0.2,
            changingStair_key_default: 0.2,
            deadStair_key_default: 0.2,
            normalStair_key_default: 0.4,

            movingStair_random_current: 0.2,
            changingStair_random_current: 0.2,
            deadStair_random_current: 0.2,
            normalStair_random_current: 0.4,
            movingStair_key_current: 0.2,
            changingStair_key_current: 0.2,
            // deadStair_key_current: 0.2,
            normalStair_key_current: 0.6,


            DEFAULT_AVE_PROP_PER_Y: 0.002,
            lifeProp_default: 0.15,
            scoreProp_default: 0,
            rocketProp_default: 0.3,
            springProp_default: 0.3,
            whosyourdaddyProp_default: 0.15,
            reverseProp_default: 0.1,

            CURRENT_AVE_PROP_PER_Y: 0.02,//0.002,
            lifeProp_current: 0.15,
            scoreProp_current: 0,
            rocketProp_current: 0.3,
            springProp_current: 0.3,
            whosyourdaddyProp_current: 0.15,
            reverseProp_current: 0.1,

            AVE_STAIR_STP: 2,
            STAIR_DX: this.__normalizex(200),
            STAIR_DY: this.__normalizey(100),
            AVE_STAIR_V: this.__normalizex(1),

            g: glb_DEFAULT_g,
            Ag: new Point(0, -glb_DEFAULT_g),
            DEFAULT_MOVE_X: (mod(this.controller.Vlx)) * glb_DEFAULT_EJECT_VY / glb_DEFAULT_g,
            DEFAULT_EJECT_H: glb_DEFAULT_EJECT_VY * glb_DEFAULT_EJECT_VY / (2 * glb_DEFAULT_g),

            DEFAULT_AVE_STAIRS_PER_Y: this.__normalizey(0.02),
            DEFAULT_AVE_STAIRS_LEN: this.__normalizex(50),
            DEFAULT_VARIANCE_STAIRS_LEN:  1,
            DEFAULT_EJECT_VY: 5,
            DEFAULT_AVE_ENEMY_PER_Y: this.__normalizey(0.001),
            DEFAULT_AVE_ENEMY_V: this.__normalizex(1),
            DEFAULT_AVE_ENEMY_T: 100,
            DEFAULT_ENEMY_DX: this.__normalizex(250),
            DEFAULT_ENEMY_DY: this.__normalizey(100),
            DEFAULT_AVE_ENEMY_STP: 2,


            CURRENT_AVE_STAIRS_PER_Y: this.__normalizey(0.05),
            CURRENT_AVE_STAIRS_LEN: this.__normalizex(50),
            CURRENT_VARIANCE_STAIRS_LEN:  1,
            CURRENT_EJECT_VY: 5,
            CURRENT_MOVE_X: (mod(this.controller.Vlx)) * glb_DEFAULT_EJECT_VY / glb_DEFAULT_g,
            CURRENT_EJECT_H: glb_DEFAULT_EJECT_VY * glb_DEFAULT_EJECT_VY / (2 * glb_DEFAULT_g),
            CURRENT_AVE_ENEMY_PER_Y: this.__normalizey(0),//0.001,
            CURRENT_AVE_ENEMY_V: this.__normalizex(1),
            CURRENT_AVE_ENEMY_T: 100,
            CURRENT_ENEMY_DX: this.__normalizex(250),
            CURRENT_ENEMY_DY: this.__normalizey(100),
            CURRENT_AVE_ENEMY_STP: 2,


        };
        console.log('start construct stairs');

        this.stairs.push(this.genStair_exact(this.hero.shape.getPos().x - getRandUniform(1, this.params.CURRENT_AVE_STAIRS_LEN / 2),
            this.hero.shape.getPos().x + getRandUniform(1, this.params.CURRENT_AVE_STAIRS_LEN / 2),
            0));

        console.log('exact stairs done');

        // this._setParams(
        //     {
        //         g: 0.1,
        //         Ag: new Point(0, -0.1),
        //         CURRENT_EJECT_VY: 5
        //     });

        this.setSections();


        this.appendStairs(10, this.H, this.params.CURRENT_EJECT_H, this.minx, this.maxx, this.params.CURRENT_AVE_STAIRS_PER_Y * 2);
        // let fx = genFunctionWithoutParam(this.appendStairs, this, 10, this.H, this.params.CURRENT_EJECT_H, this.minx, this.maxx, this.params.CURRENT_AVE_STAIRS_PER_Y * 2);
        // fx();
        this.appendEnemy(this.H / 2, this.H, this.params.CURRENT_AVE_ENEMY_PER_Y);
        this.appendProp(10, this.H, this.params.CURRENT_AVE_PROP_PER_Y);
        console.log('append stairs done');


    }

    setSections() {
        // this.stairs.push(new SectionLine(500,
        //     {
        //         g: -this.params.g
        //         ,Ag: new Point(0, this.params.g)
        //         ,CURRENT_MOVE_X: (mod(this.controller.Vlx)) * this.params.CURRENT_EJECT_VY / Math.abs(-this.params.g)
        //         ,CURRENT_EJECT_VY: -this.params.CURRENT_EJECT_VY
        //         ,CURRENT_EJECT_H: this.params.CURRENT_EJECT_VY * this.params.CURRENT_EJECT_VY / (2 * (-this.params.g))
        //         ,CURRENT_AVE_STAIRS_PER_Y: 0.01
        //         // ,CURRENT_AVE_ENEMY_PER_Y: 0.02
        //     }
        //     ,[
        //         this.clearAllStairs.bind(this)
        //         ,genFunctionWithoutParam(this.appendStairs, this, 520, this.centerP.y + this.Hd2, 0, 0, 0, this.params.CURRENT_AVE_STAIRS_PER_Y * 2)
        //     ]
        // ));
        //
        // this.stairs.push(new SectionLine(2500,
        //     {
        //         g: this.params.g
        //         ,Ag: new Point(0, -this.params.g)
        //         ,CURRENT_AVE_STAIRS_PER_Y: 0.05
        //         ,CURRENT_MOVE_X: (mod(this.controller.Vlx)) * this.params.CURRENT_EJECT_VY / Math.abs(this.params.g)
        //         ,CURRENT_EJECT_VY: this.params.CURRENT_EJECT_VY
        //         ,CURRENT_EJECT_H: this.params.CURRENT_EJECT_VY * this.params.CURRENT_EJECT_VY / (2 * (this.params.g))
        //     }
        //     ,[
        //         this.clearAllStairs.bind(this)
        //         ,genFunctionWithoutParam(this.appendStairs, this, this.underliney, this.centerP.y + this.Hd2, this.underliney + 10, 0, this.W, this.params.CURRENT_AVE_STAIRS_PER_Y * 2)
        //     ]));
        //
        // this.stairs.push(new SectionLine(7500,
        //     {
        //         g: 0.1
        //         ,Ag: new Point(0, -0.1)
        //         ,CURRENT_AVE_STAIRS_PER_Y: 0
        //         ,CURRENT_EJECT_VY: 5
        //     }
        //     ,[
        //         this.clearAllStairs.bind(this)
        //         ,genFunctionWithoutParam(this.appendStairs, this, this.underliney, this.centerP.y + this.Hd2, this.underliney + 10, 0, this.W, this.params.CURRENT_AVE_STAIRS_PER_Y * 2)
        //     ]));

        this.stairs.push(new SectionLine(500,
            {}
            ,[
                this._reversex.bind(this)
            ]
            ));

        this.stairs.push(new SectionLine(5000,
            {}
            ,[
                this._reversex.bind(this)
            ]
            ));
    }

    _reversex() {
        this.controller.Vlx.x = -this.controller.Vlx.x;
        this.controller.Vrx.x = -this.controller.Vrx.x;
    }

    __normalizex(a) {
        return a / 320 * this.W;
    }

    __normalizey(a) {
        return a / 568 * this.W;
    }

    clearAllStairs() {
        // this.stairs = [];
        let nstairs = [];
        for(let i = 0; i < this.stairs.length; ++i)
            if(this.stairs[i].className === 'sectionline')
                nstairs.push(this.stairs[i]);
        this.stairs = nstairs;
    }

    reverseAllStairs() {
        for(let i = this.stairs.length - 1; i >= 0; --i) {
            this.stairs[i].Vy.y = -this.stairs[i].Vy.y;
        }
    }

    _setParams(Obj) {
        // for(const [key, value] of Object.entries(Obj)) {
        //     this.params[key] = value;
        // }
        for(const key in Obj) {
            this.params[key] = Obj[key];
        }

    }

    __sortStairByy(A, B) {
        return -DBcmp(A.getHeight(), B.getHeight());
    }

    __sortEnemyByy(A, B) {
        return -DBcmp(A.maxy, B.maxy);
    }

    __sortPropByy(A, B) {
        return -DBcmp(A.shape.getPos().y, B.shape.getPos().y);
    }

    genRandObjByy(list, x, y) {
        let num = Math.random();
        for(let i = 0; i < list.length; ++i) {
            if(DBcmp(num, list[i].P) < 0)
                return list[i].generator(x, y);
            num -= list[i].P;
        }
    }

    __setheroVx(Vx) {
        // let conj = dot(this.hero.V, NVy);
        // this.hero.V = mul(NVy, conj);
        // _add(this.hero.V, Vx);
    }

    _setheroVx(Vx) {
        // let conj = dot(this.hero.V, NVy);
        // this.hero.V = mul(NVy, conj);
        // this.hero_nextV = mul(NVy, conj);
        // _add(this.hero.V, Vx);
        // _add(this.hero_nextV, Vx);
        // console.log('_setheroVx ',this.hero.V);
        //this.heroVx = Vx;
        let conj = dot(this.hero.V, NVy);
        this.hero.V = mul(NVy, conj);
        _add(this.hero.V, Vx);
    }

    _setheroVy(Vy) {
        let conj = dot(this.hero.V, NVx);
        this.hero.V = mul(NVx, conj);
        _add(this.hero.V, Vy);
    }



    genRocketProp(x, y) {
        // let x = getRandUniform(0, this.W);
        let rtn = new RocketProp(new Circle(new Point(x, y), 15));
        return rtn;
    }

    genSpringProp(x, y) {
        // let x = getRandUniform(0, this.W);
        let rtn = new SpringProp(new Circle(new Point(x, y), 10));
        return rtn;
    }

    genLifeProp(x, y) {
        let rtn = new LifeProp(new Circle(new Point(x, y), 10));
        return rtn;
    }

    genScoreProp(x, y) {
        let rtn = new ScoreProp(new Circle(new Point(x, y), 10));
        return rtn;
    }

    genReverseProp(x, y) {
        let rtn = new ReverseProp(new Circle(new Point(x, y), 10));
        return rtn;
    }

    genWhosyourdaddyProp(x, y) {
        let rtn = new WhosyourdaddyProp(new Circle(new Point(x, y), 10));
        return rtn;
    }

    genProp(x, y) {

        return this.genRandObjByy([{generator: this.bind_genLifeProp, P: this.params.lifeProp_current},
            {generator: this.bind_genScoreProp, P: this.params.scoreProp_current},
            {generator: this.bind_genRocketProp, P: this.params.rocketProp_current},
            {generator: this.bind_genSpringProp, P: this.params.springProp_current},
            {generator: this.bind_genReverseProp, P: this.params.reverseProp_current},
            {generator: this.bind_genWhosyourdaddyProp, P: this.params.whosyourdaddyProp_current}], x, y);
        //return this.bind_genSpringProp(x, y);
    }

    appendProp(L, H, rho) {
        for(let i = L; i < H; ++i) {
            if(DBcmp(Math.random(), rho) < 0)
                this.props.push(this.genProp(getRandUniform(0, this.W), i));
        }
    }

    genNormalStair(x, y) {
        let len = getRandGauss(this.params.CURRENT_AVE_STAIRS_LEN - this.params.CURRENT_VARIANCE_STAIRS_LEN * 3,
            this.params.CURRENT_AVE_STAIRS_LEN + this.params.CURRENT_VARIANCE_STAIRS_LEN * 3, this.params.CURRENT_AVE_STAIRS_LEN,
            this.params.CURRENT_VARIANCE_STAIRS_LEN);
        let lx = x;
        let rtn = new NormalStair(new Segment(new Point(lx, y), new Point(lx + len, y)), new Point(0, this.params.CURRENT_EJECT_VY));
        return rtn;
    }

    genMovingStair(tx, y) {
        let len = getRandGauss(this.params.CURRENT_AVE_STAIRS_LEN - this.params.CURRENT_VARIANCE_STAIRS_LEN * 3,
            this.params.CURRENT_AVE_STAIRS_LEN + this.params.CURRENT_VARIANCE_STAIRS_LEN * 3, this.params.CURRENT_AVE_STAIRS_LEN,
            this.params.CURRENT_VARIANCE_STAIRS_LEN);
        let lx = tx;

        let rtn = new MovingStair(new Segment(new Point(lx, y), new Point(lx + len, y)), new Point(0, this.params.CURRENT_EJECT_VY));

        let maxy = y;
        rtn.minx = lx;
        rtn.maxx = lx + len;
        let stp = getRandGauss(1, 3, this.params.AVE_STAIR_STP, 2);

        let x = lx;
        let P = new Point(x, y);
        let P0 = new Point(x, y);

        for(; stp > 0; --stp) {
            let dx = getRandUniform(-this.params.STAIR_DX, this.params.STAIR_DX);//getRandGauss(-ENEMY_DX, ENEMY_DX, 0, 30);
            let dy = getRandUniform(-this.params.STAIR_DY, this.params.STAIR_DY);//getRandGauss(-ENEMY_DY, ENEMY_DY, 0, 30);
            let X = new Point(dx, dy);
            _add(P, X);
            // maxy = Math.max(maxy, P.y);
            if(DBcmp(P.y, maxy) > 0) {
                maxy = P.y;
                rtn.minx = P.x;
                rtn.maxx = P.x + len;
            }
            rtn.addroutine(this.genRoutine(X, this.params.AVE_STAIR_V));
        }
        _sub(P0, P);
        rtn.addroutine(this.genRoutine(P0, this.params.AVE_STAIR_V));
        rtn.maxy = maxy;

        return rtn;
    }

    genChangingStair(x, y) {
        let len = getRandGauss(this.params.CURRENT_AVE_STAIRS_LEN - this.params.CURRENT_VARIANCE_STAIRS_LEN * 3,
            this.params.CURRENT_AVE_STAIRS_LEN + this.params.CURRENT_VARIANCE_STAIRS_LEN * 3, this.params.CURRENT_AVE_STAIRS_LEN,
            this.params.CURRENT_VARIANCE_STAIRS_LEN);
        let lx = x;
        let rtn = new ChangingStair(new Segment(new Point(lx, y), new Point(lx + len, y)), new Point(0, this.params.CURRENT_EJECT_VY));
        rtn.lV = new Point(-0.3, 0);
        rtn.rV = new Point(0.3, 0);
        rtn.lT = 80;
        rtn.rT = 80;
        return rtn;

    }

    genDeadStair(x, y) {
        let len = getRandGauss(this.params.CURRENT_AVE_STAIRS_LEN - this.params.CURRENT_VARIANCE_STAIRS_LEN * 3,
            this.params.CURRENT_AVE_STAIRS_LEN + this.params.CURRENT_VARIANCE_STAIRS_LEN * 3, this.params.CURRENT_AVE_STAIRS_LEN,
            this.params.CURRENT_VARIANCE_STAIRS_LEN);
        let lx = x;
        let rtn = new DeadStair(new Segment(new Point(lx, y), new Point(lx + len, y)), new Point(0, this.params.CURRENT_EJECT_VY));
        return rtn;
    }

    genStair_exact(lx, rx, y) {
        //console.log('genStair_exact ',lx, rx, y);
        let rtn = new Stair(new Segment(new Point(lx, y), new Point(rx, y)), new Point(0, this.params.CURRENT_EJECT_VY));
        // console.log('genStair_exact ', rtn);
        return rtn;
    }

    randamAppendStairs(L, H, rho) {
        for(let k = L; k < H; ++k){
            if(DBcmp(Math.random(), rho) < 0) {
                let stair = this.genRandObjByy([{generator: this.bind_genDeadStair, P: this.params.deadStair_random_current},
                        {generator: this.bind_genMovingStair, P: this.params.movingStair_random_current},
                        {generator: this.bind_genChangingStair, P: this.params.changingStair_random_current},
                        {generator: this.bind_genNormalStair, P: this.params.normalStair_random_current}],
                    getRandUniform(0, this.W), k);
                this.stairs.push(stair);
                // let stair_y = stair.maxHeight(this.params.g);
                // if(DBcmp(this.maxStairH, stair_y) < 0) {
                //     this.maxStairH = stair_y;
                //     this.minx = stair.getMinx();
                //     this.maxx = stair.getMaxx();
                // }
            }
        }
    }

    appendStairs(L, H, first_y, minx, maxx, rho) {
        if(DBcmp(this.params.g, 0) > 0) {
            let highest_y = first_y;
            let last_y = L;
            let stair = {};
            let stair_x = 0;
            let stair_y = 0;
            while (highest_y < H) {
                stair_x = getRandUniform(Math.max(minx - this.params.CURRENT_MOVE_X, 0), Math.min(maxx + this.params.CURRENT_MOVE_X, this.W));
                stair_y = getRandUniform(last_y, highest_y - 5) + 1;

                stair = this.genRandObjByy([
                        {generator: this.bind_genMovingStair, P: this.params.movingStair_key_current},
                        {generator: this.bind_genChangingStair, P: this.params.changingStair_key_current},
                        {generator: this.bind_genNormalStair, P: this.params.normalStair_key_current}],
                    stair_x, stair_y);

                console.log('gen stair done');
                this.stairs.push(stair);
                last_y = highest_y;
                minx = stair.getMinx();
                maxx = stair.getMaxx();
                highest_y = stair.maxHeight(this.params.g);
            }
            this.maxStairH = highest_y;
            this.minx = minx;
            this.maxx = maxx;
        }

        this.randamAppendStairs(L, H , rho);
    }

    genRoutine(X, modV) {
        let t = mod(X) / modV;
        _div(X, t);
        return {V: X, t: t};
    }

    genEnemy(x, y) {
        // let x = getRandUniform(0, this.W);
        let rtn = new Enemy(new Circle(new Point(x, y), 15), new Point(0, 0));
        let stp = getRandGauss(1, 3, this.params.CURRENT_AVE_ENEMY_STP, 2);
        let maxy = y;
        let P = new Point(x, y);
        let P0 = new Point(x, y);
        for(; stp > 0; --stp) {
            let dx = getRandUniform(-this.params.CURRENT_ENEMY_DX, this.params.CURRENT_ENEMY_DX);//getRandGauss(-ENEMY_DX, ENEMY_DX, 0, 30);
            let dy = getRandUniform(-this.params.CURRENT_ENEMY_DY, this.params.CURRENT_ENEMY_DY);//getRandGauss(-ENEMY_DY, ENEMY_DY, 0, 30);
            let X = new Point(dx, dy);
            _add(P, X);
            maxy = Math.max(maxy, P.y);
            rtn.addroutine(this.genRoutine(X, this.params.CURRENT_AVE_ENEMY_V));
        }
        _sub(P0, P);
        rtn.addroutine(this.genRoutine(P0, this.params.CURRENT_AVE_ENEMY_V));
        rtn.maxy = maxy;
        return rtn;
    }

    appendEnemy(L, H, rho) {
        for(let i = L; i < H; ++i) {
            if(DBcmp(Math.random(), rho) < 0) {
                this.enemys.push(this.genEnemy(getRandUniform(0, this.W), i));
            }
        }
    }

    transPosition(P) {
        return new Point(P.x, this.centerP.y + this.Hd2 - P.y);
    }

    render(ctx) {
        this.background.drawToCanvas(ctx);
        ctx.fillStyle = '#f00';
        ctx.font = '10px Arial';
        ctx.fillText(`your score is ${parseInt(this.score)}`, 0, 10);
        ctx.fillText(`you life is ${this.hero.life}`, this.W - 70, 10);
        this.hero.drawToCanvas(ctx, this.transPosition.bind(this));
        for(let i = this.stairs.length - 1; i >= 0; --i) {
            // console.log(this.stairs[i]);
            this.stairs[i].drawToCanvas(ctx, this.transPosition.bind(this));
        }
        for(let i = this.enemys.length - 1; i >= 0; --i) {
            this.enemys[i].drawToCanvas(ctx, this.transPosition.bind(this));
        }
        for(let i = this.props.length - 1; i >= 0; --i) {
            this.props[i].drawToCanvas(ctx, this.transPosition.bind(this));
        }

    }

    objectLoop(shape) {
        let P = shape.getPos();
        if(DBcmp(P.x, 0) < 0)
            shape.setPos(new Point(P.x + this.W, P.y));
        if(DBcmp(P.x, this.W) > 0)
            shape.setPos(new Point(P.x - this.W, P.y));
    }

    heroLoop() {
        if(this.hero.shape.getPos().x < 0) this.hero.shape.getPos().x += this.W;
        if(this.hero.shape.getPos().x > this.W) this.hero.shape.getPos().x -= this.W;
    }

    moveHero(t) {
        if(this.gameover || this.hero.dead)
            return ;
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
                    this.hero.decreaseLife();
                    this.hero.die();
                }
            }
            if(CircleOnCircle(this.hero.shape, this.enemys[i].shape)) {
                this.hero.decreaseLife();
                this.hero.die();
            }
        }

        for(let i = this.props.length - 1; i >= 0; --i) {
            let flag = false;
            if(CirColliCir(this.hero.shape, this.hero.V, this.props[i].shape, tres)) {
                if(DBcmp(t, tres.d  / herov) > 0) {
                    flag = true;
                    this.props[i].toggle(this);
                }
            }
            if(CircleOnCircle(this.hero.shape, this.props[i].shape) && (!flag)) {
                this.props[i].toggle(this);
            }
        }


        for (let i = this.stairs.length - 1; i >= 0; --i) {
            if(this.hero.status !== 'normal' && this.stairs[i].className !== 'sectionline') continue;
            if (!CircolliSeg(this.hero.shape, this.hero.V, this.stairs[i].shape, tres))
                continue;
            if (DBcmp(res.d, tres.d) > 0 && DBcmp(dot(this.stairs[i].Vy, tres.N), 0) > 0) {
                res = new Colli(tres);
                res_stair = this.stairs[i];
                //this.stairs[i].audio.play();
            }
        }

        let rt = res.d / herov;
        if(DBcmp(t, rt) > 0) {
            this.hero.shape.O = Object.create(res.P);
            res_stair.toggle(this);
            this.objectLoop(this.hero.shape);
            this.moveHero(t - rt);
            return ;
        }
        else {
            _add(this.hero.shape.getPos(), mul(this.hero.V, t));
            this.heroLoop();
        }
        return ;
    }

    revive() {

        if(DBcmp(this.params.g, 0) > 0)
            this.hero.shape.setPos(new Point(this.Wd2, this.underliney + this.heroR + 2));
        else
            this.hero.shape.setPos(new Point(this.Wd2, this.underliney + this.H / 3));

        this.effList = [];
        ReverseProp.init_all();
        RocketProp.init_all();
        SpringProp.init_all();
        ScoreProp.init_all();
        LifeProp.init_all();
        this.controller.init_all();
        this.stairs.push(this.genStair_exact(50,
            this.W - 50,
            this.underliney));

        this.hero.revive();
    }

    pushEffect(eff) {
        this.effList.push(eff);
    }

    update_effList() {
        let neffList = [];
        for(let i = 0; i < this.effList.length; ++i) {
            if(!this.effList[i].checkDone()) {
                neffList.push(this.effList[i]);
            }
            else
                this.effList[i].effOver(this);
        }
        this.effList = neffList;
    }

    update() {
        if(this.pause) return ;
        if(this.gameover) return ;
        if(this.hero.dead && this.hero.life > 0) {
            this.revive();
            return ;
        }

        if(this.hero.life === 0) {
            this.gameover = true;
            this.callback_gameover(this.score);
            return ;
        }

        this.moveHero(1);

        if(this.hero.status === 'normal') {
            _add(this.hero.V, this.params.Ag);
            // _add(this.hero_nextV, this.params.Ag);
        }

        // this.hero.V.x = this.hero_nextV.x;
        // this.hero.V.y = this.hero_nextV.y;
        // _add(this.hero.V, this.heroVx);
        // this.__setheroVx(this.heroVx);

        for(let i = 0; i < this.effList.length; ++i) {
            this.effList[i].timePass(1, this);
        }
        this.update_effList();

        this.score = Math.max(this.hero.shape.getPos().y, this.score);

        this.update_screen();
        if(DBcmp(this.hero.shape.getPos().y, this.underliney) < 0) {
            this.hero.decreaseLife();
            this.hero.die(true);
        }

        for(let i = this.enemys.length -1; i >= 0; --i) {
            this.enemys[i].timePass(1);
            _add(this.enemys[i].shape.getPos(), this.enemys[i].V);
            this.objectLoop(this.enemys[i].shape);
        }

        for(let i = this.stairs.length - 1; i >= 0; --i) {
            this.stairs[i].timePass(1);
            _add(this.stairs[i].shape.P1, this.stairs[i].V);
            _add(this.stairs[i].shape.P2, this.stairs[i].V);
            this.objectLoop(this.stairs[i].shape);
        }
    }

    update_screen() {
        //move screen
        if(this.gameover || this.hero.dead) return ;
        if(DBcmp(this.hero.shape.getPos().y, this.ceilliney) > 0) {
            let nceily = parseInt(this.hero.shape.getPos().y);
            let delta = nceily - this.ceilliney;
            this.appendStairs(this.H + this.underliney, this.H + this.underliney + delta,
                this.maxStairH, this.minx, this.maxx, this.params.CURRENT_AVE_STAIRS_PER_Y);
            this.appendEnemy(this.H + this.underliney, this.H + this.underliney + delta,
                this.params.CURRENT_AVE_ENEMY_PER_Y);
            this.appendProp(this.H + this.underliney, this.H + this.underliney + delta,
                this.params.CURRENT_AVE_PROP_PER_Y);

            this.clearStair(this.underliney + delta);
            this.clearEnemy(this.underliney + delta);
            this.clearProp(this.underliney + delta);

            this.underliney += delta;
            this.ceilliney = nceily;
            this.centerP.y += delta;

            this.background.moveWith(delta);
        }
    }

    clearStair(H) {
        this.stairs.sort(this.__bind_sortStairByy);
        let k = 0;
        for(k = 0; k < this.stairs.length; ++k)
            if(DBcmp(this.stairs[k].getHeight(), H) < 0)
                break;
        this.stairs = this.stairs.slice(0, k);
    }

    clearEnemy(H) {
        this.enemys.sort(this.__bind_sortEnemyByy);
        let k = 0;
        for(k = 0; k < this.enemys.length; ++k)
            if(DBcmp(this.enemys[k].maxy, H) < 0)
                break;
        this.enemys = this.enemys.slice(0, k);
    }

    clearProp(H) {
        this.props.sort(this.__bind_sortPropByy);
        let k = 0;
        for(k = 0; k < this.props.length; ++k)
            if(DBcmp(this.props[k].shape.getPos().y, H) < 0)
                break;
        this.props = this.props.slice(0, k);
    }
}
