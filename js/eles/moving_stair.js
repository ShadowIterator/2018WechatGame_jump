import Stair from './stair'

const movingStairSrc='images/movingstair.png';

export default class MovingStair extends Stair {
    constructor(S, Vy) {
        super(S, Vy);
        this.className = 'moving_stair';
        this.maxy = 0;
        this.index = 0;
        this.t = 0;
        this.totT = 0;
        this.routine = [];
        this.minx = 0;
        this.maxx = 0;
        this.setImg(movingStairSrc);
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

    getMinx() {
        return this.minx;
    }

    getMaxx() {
        return this.maxx;
    }

    addroutine(RT) {
        RT.t += this.totT;
        this.routine.push(RT);
        this.totT = RT.t;
    }

    maxHeight(g) {
        return this.Vy.y * this.Vy.y / (2 * g) + this.maxy;
    }

    getHeight() {
        return this.maxy;
    }

}
