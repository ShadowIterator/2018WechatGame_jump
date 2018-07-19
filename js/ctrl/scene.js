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

const NVy = new Point(0, 1);
const NVx = new Point(1, 0);



const DEFAULT_Pmoving = 0.2;
const DEFAULT_Pchanging = 0.2;
const DEFAULT_Pdead = 0.2;
const AVE_STAIR_STP = 3;
// const AVE_STAIR_V = 0.5;
const STAIR_DX = 200;
const STAIR_DY = 100;
const AVE_STAIR_V = 1;
const DEFAULT_Plife_prop = 0.1;
const DEFAULT_Pscore_prop = 0.3;
const DEFAULT_Procket_prop = 0.2;
const DEFAULT_Pspring_prop = 0.2;
const DEFAULT_Pwhosyourdaddy_prop = 0.1;
const DEFAULT_Preverse_prop = 0.1;




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

export default class Scene {
    constructor(tW, tH, callback_gameover) {
        this.H = tH;
        this.W = tW;
        this.Wd2 = tW / 2;
        this.Hd2 = tH / 2;
        this.callback_gameover = callback_gameover;


        this.heroR = 0;//5 / 320 * this.W;
        this.hero = {};//new Hero(new Circle(new Point(this.Wd2, 7), 5), new Point(0,0));
        // this.hero.whosyourdaddy = true;
        // this.hero.life = 1;
        this.centerP = {};//new Point(this.Wd2, this.Hd2);
        this.ceilliney = 0;//this.Hd2;
        this.maxStairH = 0;
        this.last_x = 0;//this.hero.shape.getPos().x;
        this.underliney = 0;
        this.stairs = [];
        this.enemys = [];
        this.props = [];
        this.score = 0;
        this.highestY = 0;
        this.gameover = false;
        this.controller = {};
        this.effList = [];

        this.background = {};//new Background();

        this.AVE_STAIRS_PER_Y = 0;//0.02;
        this.AVE_STAIRS_LEN = 0;//50 / 320 * this.W;//adj to canvas.width
        this.VARIANCE_STAIRS_LEN = 0;//1;
        this.g = 0;//0.2;
        this.Ag = {};//new Point(0, -this.g);
        this.DEFAULT_EJECT_VY = 0;//5;
        this.DEFAULT_MOVE_X = 0;//(mod(this.controller.Vlx)) * this.DEFAULT_EJECT_VY / this.g;
        this.DEFAULT_EJECT_H = 0;//this.DEFAULT_EJECT_VY * this.DEFAULT_EJECT_VY / (2 * this.g);
        this.AVE_ENEMY_PER_Y = 0;//0;//0.001;
        this.AVE_ENEMY_V = 0;//1;
        this.AVE_ENEMY_T = 0;//100;
        this.ENEMY_DX = 0;//250 / 320 * this.W;
        this.ENEMY_DY = 0;//100 / 568 * this.H;
        this.AVE_EMEMY_STP = 0;//2;
        this.AVE_PROP_PER_Y = 0;// 0.005;

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


        // console.log('start construct stairs');
        //
        // // this.stairs.push(new Stair(new Segment(new Point(-100, 0), new Point(this.W + 100, 0)), new Point(0, 25)));
        // // this.stairs.push(new Stair(new Segment(new Point(-100, -3), new Point(this.W + 100, -3)), new Point(0, 25)));
        // this.stairs.push(this.genStair_exact(this.hero.shape.getPos().x - getRandUniform(1, this.AVE_STAIRS_LEN / 2),
        //     this.hero.shape.getPos().x + getRandUniform(1, this.AVE_STAIRS_LEN / 2),
        //     0));
        //
        //
        //
        // console.log('exact stairs done');
        // this.appendStairs(10, this.H, this.last_x, this.DEFAULT_EJECT_H, this.AVE_STAIRS_PER_Y * 2);
        // this.appendEnemy(this.H / 2, this.H, this.AVE_ENEMY_PER_Y);
        // this.appendProp(10, this.H, this.AVE_PROP_PER_Y);
        // console.log('append stairs done');
    }

    init() {
        // this.H = tH;
        // this.W = tW;
        // this.Wd2 = tW / 2;
        // this.Hd2 = tH / 2;
        this.heroR = 5 / 320 * this.W;
        this.hero = new Hero(new Circle(new Point(this.Wd2, 7), 5), new Point(0,0));
        this.minx = this.hero.shape.getPos().x;
        this.maxx = this.hero.shape.getPos().x;
        this.hero.whosyourdaddy = true;
        // this.hero.life = 1;
        this.centerP = new Point(this.Wd2, this.Hd2);
        this.ceilliney = this.Hd2;
        this.maxStairH = 0;
        this.last_x = this.hero.shape.getPos().x;
        this.underliney = 0;
        this.stairs = [];
        this.enemys = [];
        this.props = [];
        this.score = 0;
        // this.callback_gameover = callback_gameover;
        this.highestY = 0;
        this.gameover = false;
        // this.controller = {};
        this.effList = [];

        this.background=new Background();

        this.AVE_STAIRS_PER_Y = 0;//0.02;
        this.AVE_STAIRS_LEN = 50 / 320 * this.W;//adj to canvas.width
        this.VARIANCE_STAIRS_LEN = 1;
        this.g = 0.2;
        this.Ag = new Point(0, -this.g);
        this.DEFAULT_EJECT_VY = 5;
        this.DEFAULT_MOVE_X = (mod(this.controller.Vlx)) * this.DEFAULT_EJECT_VY / this.g;
        this.DEFAULT_EJECT_H = this.DEFAULT_EJECT_VY * this.DEFAULT_EJECT_VY / (2 * this.g);
        this.AVE_ENEMY_PER_Y = 0.001;
        this.AVE_ENEMY_V = 1;
        this.AVE_ENEMY_T = 100;
        this.ENEMY_DX = 250 / 320 * this.W;
        this.ENEMY_DY = 100 / 568 * this.H;
        this.AVE_EMEMY_STP = 2;
        this.AVE_PROP_PER_Y = 0.002;

        console.log('start construct stairs');

        this.stairs.push(this.genStair_exact(this.hero.shape.getPos().x - getRandUniform(1, this.AVE_STAIRS_LEN / 2),
            this.hero.shape.getPos().x + getRandUniform(1, this.AVE_STAIRS_LEN / 2),
            0));



        console.log('exact stairs done');
        this.appendStairs(10, this.H, this.DEFAULT_EJECT_H, this.minx, this.maxx, this.AVE_STAIRS_PER_Y * 2);
        this.appendEnemy(this.H / 2, this.H, this.AVE_ENEMY_PER_Y);
        this.appendProp(10, this.H, this.AVE_PROP_PER_Y);
        console.log('append stairs done');
    }

    __sortStairByy(A, B) {
        // return -DBcmp(A.shape.P1.y, B.shape.P1.y);
        return -DBcmp(A.maxHeight(this.g), B.maxHeight(this.g));
    }

    __sortEnemyByy(A, B) {
        return -DBcmp(A.maxy, B.maxy);
    }

    __sortPropByy(A, B) {
        return -DBcmp(A.shape.getPos().y, B.shape.getPos().y);
    }

    genRandObjByy(list, x, y) {
        // let sum = 0;
        let num = Math.random();
        for(let i = 0; i < list.length; ++i) {
            if(DBcmp(num, list[i].P) < 0)
                return list[i].generator(x, y);
            num -= list[i].P;
        }
    }

    _setheroVx(Vx) {
        let conj = dot(this.hero.V, NVy);
        this.hero.V = mul(NVy, conj);
        _add(this.hero.V, Vx);
        console.log('_setheroVx ',this.hero.V);
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
        return this.genRandObjByy([{generator: this.bind_genLifeProp, P: DEFAULT_Plife_prop},
            {generator: this.bind_genScoreProp, P: DEFAULT_Pscore_prop},
            {generator: this.bind_genRocketProp, P: DEFAULT_Procket_prop},
            {generator: this.bind_genSpringProp, P: DEFAULT_Pspring_prop},
            {generator: this.bind_genReverseProp, P: DEFAULT_Pspring_prop},
            {generator: this.bind_genWhosyourdaddyProp, P: DEFAULT_Pwhosyourdaddy_prop}], x, y);
    }

    appendProp(L, H, rho) {
        for(let i = L; i < H; ++i) {
            if(DBcmp(Math.random(), rho) < 0)
                this.props.push(this.genProp(getRandUniform(0, this.W), i));
        }
    }

    genNormalStair(x, y) {
        let len = getRandGauss(this.AVE_STAIRS_LEN - this.VARIANCE_STAIRS_LEN * 3,
            this.AVE_STAIRS_LEN + this.VARIANCE_STAIRS_LEN * 3, this.AVE_STAIRS_LEN,
            this.VARIANCE_STAIRS_LEN);
        let lx = x;
        let rtn = new NormalStair(new Segment(new Point(lx, y), new Point(lx + len, y)), new Point(0, this.DEFAULT_EJECT_VY));
        return rtn;
    }

    genMovingStair(tx, y) {
        let len = getRandGauss(this.AVE_STAIRS_LEN - this.VARIANCE_STAIRS_LEN * 3,
            this.AVE_STAIRS_LEN + this.VARIANCE_STAIRS_LEN * 3, this.AVE_STAIRS_LEN,
            this.VARIANCE_STAIRS_LEN);
        let lx = tx;

        let rtn = new MovingStair(new Segment(new Point(lx, y), new Point(lx + len, y)), new Point(0, this.DEFAULT_EJECT_VY));

        let maxy = y;
        rtn.minx = lx;
        rtn.maxx = lx + len;
        let stp = getRandGauss(2, 4, AVE_STAIR_STP, 2);

        let x = lx;
        let P = new Point(x, y);
        let P0 = new Point(x, y);

        for(; stp > 0; --stp) {
            let dx = getRandUniform(-STAIR_DX, STAIR_DX);//getRandGauss(-ENEMY_DX, ENEMY_DX, 0, 30);
            let dy = getRandUniform(-STAIR_DY, STAIR_DY);//getRandGauss(-ENEMY_DY, ENEMY_DY, 0, 30);
            let X = new Point(dx, dy);
            _add(P, X);
            // maxy = Math.max(maxy, P.y);
            if(DBcmp(P.y, maxy) > 0) {
                maxy = P.y;
                rtn.minx = P.x;
                rtn.maxx = P.x + len;
            }
            rtn.addroutine(this.genRoutine(X, AVE_STAIR_V));
        }
        _sub(P0, P);
        rtn.addroutine(this.genRoutine(P0, AVE_STAIR_V));
        rtn.maxy = maxy;

        return rtn;
    }

    genChangingStair(x, y) {
        let len = getRandGauss(this.AVE_STAIRS_LEN - this.VARIANCE_STAIRS_LEN * 3,
            this.AVE_STAIRS_LEN + this.VARIANCE_STAIRS_LEN * 3, this.AVE_STAIRS_LEN,
            this.VARIANCE_STAIRS_LEN);
        let lx = x;
        let rtn = new ChangingStair(new Segment(new Point(lx, y), new Point(lx + len, y)), new Point(0, this.DEFAULT_EJECT_VY));
        rtn.lV = new Point(-0.5, 0);
        rtn.rV = new Point(0.5, 0);
        rtn.lT = 80;
        rtn.rT = 80;
        return rtn;

    }

    genDeadStair(x, y) {
        let len = getRandGauss(this.AVE_STAIRS_LEN - this.VARIANCE_STAIRS_LEN * 3,
            this.AVE_STAIRS_LEN + this.VARIANCE_STAIRS_LEN * 3, this.AVE_STAIRS_LEN,
            this.VARIANCE_STAIRS_LEN);
        let lx = x;
        let rtn = new DeadStair(new Segment(new Point(lx, y), new Point(lx + len, y)), new Point(0, this.DEFAULT_EJECT_VY));
        return rtn;
    }

    // genStair(y, Pmoving, Pchanging, Pdead) {
    //     Pchanging += Pmoving;
    //     Pdead +=Pchanging;
    //     let num = Math.random();
    //     if(DBcmp(num, Pmoving) < 0)
    //         return this.genMovingStair(y);
    //     else if(DBcmp(num, Pchanging) < 0)
    //         return this.genChangingStair(y);
    //     else if(DBcmp(num, Pdead) < 0)
    //         return this.genDeadStair(y);
    //     else
    //         return this.genNormalStair(y);
    // }

    genStair_exact(lx, rx, y) {
        //console.log('genStair_exact ',lx, rx, y);
        let rtn = new Stair(new Segment(new Point(lx, y), new Point(rx, y)), new Point(0, this.DEFAULT_EJECT_VY));
        // console.log('genStair_exact ', rtn);
        return rtn;
    }

    appendStairs(L, H, first_y, minx, maxx, rho) {
        let highest_y = first_y;
        let last_y = L;
        let stair = {};
        let stair_x = 0;
        let stair_y = 0;
        while (highest_y < H) {
            stair_x = getRandUniform(Math.max(minx - this.DEFAULT_MOVE_X, 0), Math.min(maxx + this.DEFAULT_MOVE_X, this.W));
            stair_y = getRandUniform(last_y, highest_y - 5) + 1;
            stair = this.genRandObjByy([{generator: this.bind_genMovingStair, P: DEFAULT_Pmoving},
                    {generator: this.bind_genChangingStair, P: DEFAULT_Pchanging},
                    {generator: this.bind_genNormalStair, P: 1}],
                                        stair_x, stair_y)
            console.log('gen stair done');
            this.stairs.push(stair);
            last_y = highest_y;
            minx = stair.getMinx();
            maxx = stair.getMaxx();
            highest_y = stair.maxHeight(this.g);
        }
        this.maxStairH = highest_y;
        this.minx = minx;
        this.maxx = maxx;

        for(let k = L; k < H; ++k){
            if(DBcmp(Math.random(), rho) < 0) {
                this.stairs.push( this.genRandObjByy([{generator: this.bind_genDeadStair, P: DEFAULT_Pdead},
                        {generator: this.bind_genMovingStair, P: DEFAULT_Pmoving},
                        {generator: this.bind_genChangingStair, P: DEFAULT_Pchanging},
                        {generator: this.bind_genNormalStair, P: 1}],
                    getRandUniform(0, this.W), k));
            }
        }
    }

    genRoutine(X, modV) {
        let t = mod(X) / modV;
        _div(X, t);
        return {V: X, t: t};
    }

    genEnemy(x, y) {
        // let x = getRandUniform(0, this.W);
        let rtn = new Enemy(new Circle(new Point(x, y), 15), new Point(0, 0));
        let stp = getRandGauss(1, 3, this.AVE_EMEMY_STP, 2);
        let maxy = y;
        let P = new Point(x, y);
        let P0 = new Point(x, y);
        for(; stp > 0; --stp) {
            let dx = getRandUniform(-this.ENEMY_DX, this.ENEMY_DX);//getRandGauss(-ENEMY_DX, ENEMY_DX, 0, 30);
            let dy = getRandUniform(-this.ENEMY_DY, this.ENEMY_DY);//getRandGauss(-ENEMY_DY, ENEMY_DY, 0, 30);
            let X = new Point(dx, dy);
            _add(P, X);
            maxy = Math.max(maxy, P.y);
            rtn.addroutine(this.genRoutine(X, this.AVE_ENEMY_V));
        }
        _sub(P0, P);
        rtn.addroutine(this.genRoutine(P0, this.AVE_ENEMY_V));
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
        // console.log('trans cP ', this.centerP);
        // console.log('trans Hd2 ', this.Hd2);
        // console.log('trans P', P);
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
        // if(this.gameover) return ;
        // console.log('t', t);
        // console.log(this.hero);
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
                    // this.gameover = true;
                    // this.hero.life = 0;
                    // this.callback_gameover(this.score);
                    // --this.hero.life;
                    // this.hero.dead = true;
                    this.hero.decreaseLife();
                    this.hero.die();
                    // return;
                }
            }
            if(CircleOnCircle(this.hero.shape, this.enemys[i].shape)) {
                // this.gameover = true;
                // --this.hero.life;
                // this.hero.dead = true;
                this.hero.decreaseLife();
                this.hero.die();
                // this.callback_gameover(this.score);
                // return;
            }
        }

        for(let i = this.props.length - 1; i >= 0; --i) {
            let flag = false;
            if(CirColliCir(this.hero.shape, this.hero.V, this.props[i].shape, tres)) {
                if(DBcmp(t, tres.d  / herov) > 0) {
                    // this.gameover = true;
                    // this.hero.life = 0;
                    // this.callback_gameover(this.score);
                    // --this.hero.life;
                    // this.hero.dead = true;
                    // return;
                    flag = true;
                    this.props[i].toggle(this);
                }
            }
            if(CircleOnCircle(this.hero.shape, this.props[i].shape) && (!flag)) {
                // this.gameover = true;
                // --this.hero.life;
                // this.hero.dead = true;
                // this.callback_gameover(this.score);
                // return;
                this.props[i].toggle(this);
            }
        }

        if(this.hero.status === 'normal') {
            for (let i = this.stairs.length - 1; i >= 0; --i) {
                if (!CircolliSeg(this.hero.shape, this.hero.V, this.stairs[i].shape, tres))
                    continue;
                // console.log(this.stairs[i].Vy, tres.N);
                if (DBcmp(res.d, tres.d) > 0 && DBcmp(dot(this.stairs[i].Vy, tres.N), 0) > 0) {
                    res = new Colli(tres);
                    res_stair = this.stairs[i];
                }
            }
        }
        let rt = res.d / herov;
        if(DBcmp(t, rt) > 0) {
            this.hero.shape.O = Object.create(res.P);
            res_stair.setHero(this.hero);
            this.objectLoop(this.hero.shape);
            this.moveHero(t - rt);
            return ;
        }
        else {
            _add(this.hero.shape.getPos(), this.hero.V);
            this.heroLoop();
        }
        return ;
    }

    revive() {

        this.hero.shape.setPos(new Point(this.Wd2, this.underliney + this.heroR + 2));

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
        // this.hero.dead = false;
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

        // console.log(`stair size: ${this.stairs.length}`);
        // console.log(`enemy size: ${this.enemys.length}`);
        // console.log(`prop size: ${this.props.length}`);

        this.moveHero(1);

        if(this.hero.status === 'normal') {
            _add(this.hero.V, this.Ag);
        }

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
                this.maxStairH, this.minx, this.maxx, this.AVE_STAIRS_PER_Y);
            this.appendEnemy(this.H + this.underliney, this.H + this.underliney + delta,
                this.AVE_ENEMY_PER_Y);
            this.appendProp(this.H + this.underliney, this.H + this.underliney + delta,
                this.AVE_PROP_PER_Y);

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
            if(DBcmp(this.stairs[k].maxHeight(this.g), H) < 0)
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
