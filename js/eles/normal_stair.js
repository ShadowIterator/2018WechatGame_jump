import Stair from './stair'

const normalStairSrc='images/normalstair.png';

export default class NormalStair extends Stair {
    constructor(S, Vy) {
        super(S, Vy);
        this.setImg(normalStairSrc);
    }

}
