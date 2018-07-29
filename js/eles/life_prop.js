import Prop from './prop';

const lifeSrc='images/life.png';

export default class LifeProp extends Prop {
    constructor(S) {
        super(S);
        this.setImg(lifeSrc);
    }

    toggle(scene) {
        if(this.toggled) return ;
        scene.hero.increaseLife();
        super.toggle();
    }

}
