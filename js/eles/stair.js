
import Sprite from '../base/sprite'
import {PI, INF, EPS} from  '../libs/geometry'
import {Point, Circle, Segment, Colli} from '../libs/geometry'
import {DBcmp, add, _add, sub, _sub, mul, _mul,
    rotate, _rotate, dot, cross, _reverse,
    mod_2, mod, _normalize, normalize, _relen,
    dist_2, relen, isZero, _toZero, calH,
    pointOnSegment, pointInCircle,
    CircleOnCircle} from '../libs/geometry'


const IMGSRC = '';
const stairAudio='audio/stair.mp3';


export default class Stair extends Sprite{
    constructor (S, Vy, visibal = true) {
        super(S, IMGSRC, S.getWidth(), S.getHeight());
        this.Vy = Vy;
        this.V = new Point(0, 0);
        this.className = 'stair';
        this.setAudio(stairAudio);
        this.visible = visibal;
    }

    maxHeight(g) {
        return this.Vy.y * this.Vy.y / (2 * g) + this.shape.P1.y;
    }

    getHeight() {
        return this.shape.getPos().y;
    }


    toggle(scene) {
        if(scene.hero.status !== 'normal')
            return ;
        let VN = this.Vy;
        let VH = rotate(VN, -PI / 2);
        _normalize(VH);
        _mul(VH, dot(VH, scene.hero.V));
        scene.hero.V = add(VH, VN);
        scene.hero.V.y += 1;
        this.audio.play();
    }

    getMinx() {
        return this.shape.P1.x;
    }

    getMaxx(){
        return this.shape.P2.x;
    }

    timePass(t) {

    }

    drawToCanvas(ctx, transPosition) {
        if(!this.visible) return ;
        let P1 = transPosition(this.shape.P1);
        ctx.drawImage(this.img, P1.x, P1.y, this.shape.getWidth(), this.shape.getHeight());
    }

}
