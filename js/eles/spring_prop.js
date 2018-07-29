import {Point, Circle, Segment, Colli} from '../libs/geometry'
import Prop from './prop';

const springSrc='images/spring.png';
const springAudio='audio/spring.mp3';

export default class SpringProp extends Prop {
    constructor(S) {
        super(S);
        this.setImg(springSrc);
        this.V = new Point(0, 15);
        this.setAudio(springAudio);
    }

    toggle(scene) {
        if(this.toggled) return ;
        if(scene.hero.status === 'normal')
            scene._setheroVy(this.V);
        this.audio.play();
        super.toggle();
    }

}
