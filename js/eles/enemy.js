
import Sprite from '../base/sprite'
import {PI, INF, EPS} from  '../libs/geometry'
import {Point, Circle, Segment, Colli} from '../libs/geometry'

const enemySrc='images/enemy.png';

export default class Enemy extends Sprite{
    constructor (S) {
        super(S);
        this.V = new Point(0, 0);
        this.index = 0;
        this.t = 0;
        this.totT = 0;
        this.routine = [];
        this.maxy = this.shape.O.y;
        this.className = 'enemy';

        this.setImg(enemySrc);
    }

    updateV() {

    }

    timePass(t) {
        this.t += t;
        this.t %= this.totT;
        for(this.index = 0; this.index < this.routine.length; ++this.index) {
            if(this.routine[this.index].t >= this.t) {
                break;
            }
        }
        this.V = this.routine[this.index].V;

    }

    addroutine(RT) {
        RT.t += this.totT;
        this.routine.push(RT);
        this.totT = RT.t;
    }

    drawToCanvas(ctx, transPosition) {
        let P = transPosition(this.shape.O);
        ctx.beginPath();
        ctx.arc(P.x, P.y, this.shape.R, 0, 2 * PI, false);
        ctx.strokeStyle = '#f00';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.drawImage(this.img, P.x-this.shape.R, P.y-this.shape.R, this.shape.getWidth(), this.shape.getHeight());
    }


}
