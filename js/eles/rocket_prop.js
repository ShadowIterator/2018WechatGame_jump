import {Point, Circle, Segment, Colli} from '../libs/geometry'


import Prop from './prop';

const rocketSrc='images/digivice.png';
const withRocketSrc='images/metal.png';
const oringinSrc='images/hero.png';
const rocketAudio='audio/rocket.mp3';

let cnt = 0;

export default class RocketProp extends Prop {
    constructor(S) {
        super(S);
        this.T = 150;
        this.t = 0;
        this.V = new Point(0, 5);
      this.setImg(rocketSrc);
      this.setAudio(rocketAudio);
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
        scene.hero.increaseEff();
        if(cnt === 0)
            scene._setheroVy(this.V);
        ++cnt;
        scene.pushEffect({timePass: this.bind_timePass, effOver: this.bind_effOver, checkDone: this.bind_checkDone});
        this.t = this.T;
        scene.hero.setImg(withRocketSrc);
        this.audio.play();
        super.toggle();
    }

    effOver(scene) {
        scene.hero.decreaseEff();
        --cnt;
        if(cnt === 0)
        {
          scene._setheroVy(new Point(0, 0));
          scene.hero.setImg(oringinSrc);
        }
        this.audio.pause();
        super.effOver();
    }

}
