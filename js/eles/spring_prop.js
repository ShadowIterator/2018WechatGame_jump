// import Sprite from '../base/sprite'
import {PI, INF, EPS} from  '../libs/geometry'
import {Point, Circle, Segment, Colli} from '../libs/geometry'
import {DBcmp, add, _add, sub, _sub, mul, _mul,
    rotate, _rotate, dot, cross, _reverse,
    mod_2, mod, _normalize, normalize, _relen,
    dist_2, relen, isZero, _toZero, calH,
    pointOnSegment, pointInCircle,
    CircleOnCircle} from '../libs/geometry'

import Prop from './prop';

const springSrc='images/spring.png';
export default class SpringProp extends Prop {
    constructor(S) {
        super(S);
        this.setImg(springSrc);
        this.V = new Point(0, 15);

    }

    // drawToCanvas(ctx, transPosition) {
    //     if(!this.toggled) {
    //         let P = transPosition(this.shape.O);
    //         ctx.beginPath();
    //         ctx.arc(P.x, P.y, this.shape.R, 0, 2 * PI, false);
    //         ctx.strokeStyle = '#0af';
    //         ctx.lineWidth = 2;
    //         ctx.stroke();
    //     }
    // }


    toggle(scene) {
        if(this.toggled) return ;
        if(scene.hero.status === 'normal')
            scene._setheroVy(this.V);
        super.toggle();
    }

}
