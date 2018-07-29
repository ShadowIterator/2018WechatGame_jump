import {Point, Circle, Segment, Colli} from '../libs/geometry'
import Prop from './prop';

let cnt = 0;
const reverseSrc='images/reverse.png';

export default class ReverseProp extends Prop {
    constructor(S) {
        super(S);
        this.T = 500;
        this.t = 0;
        this.V = new Point(0, 5);
      this.setImg(reverseSrc);
    }

    timePass(t, scene) {
        --this.t;
        if(this.t === 0)
            this.done = true;
    }

    toggle(scene) {
        if(this.toggled)
            return ;
        this.done = false;
        if(cnt === 0) {
            scene.controller.reverseLR();
        }
        ++cnt;
        scene.pushEffect({timePass: this.bind_timePass, effOver: this.bind_effOver, checkDone: this.bind_checkDone});
        this.t = this.T;
        super.toggle();
    }

    effOver(scene) {
        --cnt;
        if(cnt === 0) {
            scene.controller.reverseLR();
        }
    }

}
