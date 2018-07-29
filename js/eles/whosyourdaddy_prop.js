import Prop from './prop';

let cnt = 0;
const dadySrc='images/shield.png';

export default class WhosyourdaddyProp extends Prop {
    constructor(S) {
        super(S);
        this.T = 150;
        this.t = 0;
        this.setImg(dadySrc);
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
            scene.hero.whosyourdaddy = true;
        }
        ++cnt;
        scene.pushEffect({timePass: this.bind_timePass, effOver: this.bind_effOver, checkDone: this.bind_checkDone});
        this.t = this.T;
        super.toggle();
    }

    effOver(scene) {
        --cnt;
        if(cnt === 0) {
            scene.hero.whosyourdaddy = false;
        }
    }

}
