import {PI, INF, EPS} from  '../libs/geometry'
import {Point, Circle, Segment, Colli} from '../libs/geometry'
import Stair from './stair'

const cloudSrc='images/cloudline.png';

export default class SectionLine extends Stair{
    constructor(y, sceneParam, visibal = true, op_funcs = null) {
        super(new Segment(new Point(-INF, y), new Point(INF, y)), new Point(0, -1), visibal);
        this.sceneParam = sceneParam;
        this.y = y;
        this.op_funcs = op_funcs;
        this.className = 'sectionline';
        this.setImg(cloudSrc);
    }

    toggle(scene) {
        scene._setParams(this.sceneParam);
        if(this.op_funcs !== null) {
            for(let i = 0; i < this.op_funcs.length; ++i) {
                this.op_funcs[i]();
            }
        }
        this.shape.setPos(new Point(0, -1));
    }


    drawToCanvas(ctx, transPosition) {
        if(!this.visible) return ;
        let P1 = transPosition(this.shape.P1);
        ctx.drawImage(this.img, -10, P1.y, window.innerWidth+10, 30);
    }
}
