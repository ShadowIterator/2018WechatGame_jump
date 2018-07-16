
import Button from './button'
import {PI, INF, EPS} from  '../libs/geometry'
import {Point, Circle, Segment, Colli} from '../libs/geometry'
import {DBcmp, add, _add, sub, _sub, mul, _mul,
    rotate, _rotate, dot, cross, _reverse,
    mod_2, mod, _normalize, normalize, _relen,
    dist_2, relen, isZero, _toZero, calH,
    pointOnSegment, pointInCircle,
    CircleOnCircle} from '../libs/geometry'

import Scene from './scene'

const NVy = new Point(0, 1);
const Vlx = new Point(-8, 0);
const Vrx = new Point(8, 0);
const Vzero = new Point(0, 0);

const DEFAULT_BTN_R = 40;

function _setx(V, Vx) {
    // console.log(V, Vx);
    let conj = dot(V, NVy);
    V = mul(NVy, conj);
    _add(V, Vx);
    console.log('_setx, V ', V);
}

export default class Control {
    constructor(tW, tH, scene) {
        this.btn = [];
        this.btn.push(new Button(new Circle(new Point(0 + DEFAULT_BTN_R, tH - DEFAULT_BTN_R), DEFAULT_BTN_R), 'jleft'));
        this.btn.push(new Button(new Circle(new Point(tW - DEFAULT_BTN_R, tH - DEFAULT_BTN_R), DEFAULT_BTN_R), 'jright'));
        this.target = scene;

        this.initEvent();
    }


    initEvent() {
        canvas.addEventListener('touchstart', this.touchstart_hdr.bind(this));

        canvas.addEventListener('touchmove', this.touchmove_hdr.bind(this));

        canvas.addEventListener('touchend', this.touchend_hdr.bind(this));
    }

    removeEvent() {
        canvas.removeEventListener('touchstart', this.touchstart_hdr.bind(this));

        canvas.removeEventListener('touchmove', this.touchmove_hdr.bind(this));

        canvas.removeEventListener('touchend', this.touchend_hdr.bind(this));
    }

    touchstart_hdr(e) {
        e.preventDefault();
        console.log('touchstart');
        let P = new Point(0, 0);
        for(let i = 0; i < e.touches.length; ++i) {
            P.x = e.touches[i].clientX;
            P.y = e.touches[i].clientY;
            for(let j = 0; j < this.btn.length; ++j) {
                if( pointInCircle(P, this.btn[j].C)) {
                    if(this.btn[j].desc === 'jleft') {
                        // _add(this.target.hero.V, )
                        // console.log(this.target.hero.V);
                        // _setx(this.target.hero.V, Vlx);
                        // console.log('out ',this.target.hero.V);
                        this.target._setheroVx(Vlx);
                    }
                    else {
                        this.target._setheroVx(Vrx);
                        // _setx(this.target.hero.V, Vrx);
                    }
                }
            }
        }
    }

    touchmove_hdr(e) {
        e.preventDefault();
    }

    touchend_hdr(e) {
        e.preventDefault();
        console.log('touchend');
        let P = new Point(0, 0);
        for(let i = 0; i < e.touches.length; ++i) {
            P.x = e.touches[i].clientX;
            P.y = e.touches[i].clientY;
            for(let j = 0; j < this.btn.length; ++j) {
                if( pointInCircle(P, this.btn[j].C)) {
                    if(this.btn[j].desc === 'jleft') {
                        // _add(this.target.hero.V, )
                        // _setx(this.target.hero.V, Vzero);
                        this.target._setheroVx(Vzero);

                    }
                    else {
                        // _setx(this.target.hero.V, Vzero);
                        this.target._setheroVx(Vzero);
                    }
                }
            }
        }
    }


    render(ctx) {
        for(let i = this.btn.length - 1; i >= 0; --i) {
            ctx.beginPath();
            let C = this.btn[i].C;
            ctx.arc(C.O.x, C.O.y, C.R, 0, 2 * PI, false);
            ctx.strokeStyle = '#0f0';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }


}