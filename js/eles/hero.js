
import Sprite from '../base/sprite'
import {PI, INF, EPS} from  '../libs/geometry'

const IMGSRC = 'images/hero.png';

export default class Hero extends Sprite{
    constructor (S, V) {
        super(S, IMGSRC, S.getWidth(), S.getHeight());
        this.V = V;
        this.life = 3;
        this.dead = false;
        this.effCount = 0;
        this.status = 'normal';
        this.whosyourdaddy = false;
        this.className = 'hero';
    }

    increaseLife() {
        ++this.life;
    }

    decreaseLife() {
        if(!this.whosyourdaddy && !this.dead)
            --this.life;
    }

    die(force = false) {
        if(force) {
            this.dead = true;
        }
        else {
            if (!this.whosyourdaddy)
                this.dead = true;
        }
    }

    revive() {
        this.status = 'normal';
        this.whosyourdaddy = false;
        this.dead = false;
    }

    increaseEff() {
        if(this.status === 'normal')
            this.status = 'super';
        ++this.effCount;
    }

    decreaseEff() {
        --this.effCount;
        if(this.effCount === 0)
            this.status = 'normal';
    }

    drawToCanvas(ctx, transPosition) {
        let P = transPosition(this.shape.O);

        if(this.whosyourdaddy===true)
        {
          ctx.globalAlpha=0.3;
          ctx.beginPath();
          ctx.arc(P.x, P.y, this.shape.R+5, 0, 2 * PI, false);
          ctx.fillStyle = '#90ee00';
          ctx.fill();
        }
        ctx.globalAlpha=1;
        ctx.drawImage(this.img, P.x-this.shape.R, P.y-this.shape.R, this.width, this.height);
    }
}
