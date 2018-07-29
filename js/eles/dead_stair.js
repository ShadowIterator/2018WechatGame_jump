import Stair from './stair'

const deadStairSrc='images/deadstair.png';

export default class DeadStairs extends Stair{
    constructor(S, Vy) {
        super(S, Vy);

        this.setImg(deadStairSrc);

    }

    toggle(scene) {
        scene.hero.decreaseLife();
        super.toggle(scene);
    }

}
