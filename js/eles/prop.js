import Sprite from '../base/sprite'

export default class Prop extends Sprite{
    constructor(S) {
        super(S);
        this.toggled = false;
        this.done = true;
        this.bind_timePass = this.timePass.bind(this);
        this.bind_effOver = this.effOver.bind(this);
        this.bind_checkDone = this.checkDone.bind(this);
    }

    drawToCanvas(ctx, transPosition) {
        let P = transPosition(this.shape.O);
      if(!this.toggled) {
        let P = transPosition(this.shape.O);
        ctx.drawImage(this.img, P.x-this.shape.R, P.y-this.shape.R, this.shape.getWidth(), this.shape.getHeight());
      }
    }

    checkDone() {
        return this.done;
    }

    timePass(t, scene) {

    }

    toggle(scene) {
        this.toggled = true;
    }

    effOver(scene) {
        this.toggled = false;
    }

}
