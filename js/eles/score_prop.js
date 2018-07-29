import {PI, INF, EPS} from  '../libs/geometry'
import Prop from './prop';

export default class ScoreProp extends Prop {
    constructor(S) {
        super(S);
        this.score = 200;
    }

    drawToCanvas(ctx, transPosition) {
        if(!this.toggled) {
            let P = transPosition(this.shape.O);
            ctx.beginPath();
            ctx.arc(P.x, P.y, this.shape.R, 0, 2 * PI, false);
            ctx.strokeStyle = '#f50';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    toggle(scene) {
        if(this.toggled) return ;
        scene.score += this.score;
        super.toggle();
    }

}