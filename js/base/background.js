import Sprite from '../base/sprite'

const screenWidth  = window.innerWidth;
const screenHeight = window.innerHeight;

const BG_IMG_SRC   = 'images/skybg.png';
const BG_WIDTH     = 512;
const BG_HEIGHT    = 512;

export default class Background extends Sprite {
  constructor() {
    super({},BG_IMG_SRC, BG_WIDTH, BG_HEIGHT);

    //this.render(ctx);

    this.top = 0;
  }

  moveWith(delta)
  {
    // let standard=screenHeight/6;
    // if(doodle.shape.O.y>standard/6)
    // {
    //   this.top=(this.top+doodle.shape.O.y-standard/6)%screenHeight;
    // }
    this.top=(this.top+delta)%screenHeight;
  }

  drawToCanvas(ctx) {
    ctx.drawImage(
      this.img,
      0,
      0,
      this.width,
      this.height,
      0,
      -screenHeight + this.top,
      screenWidth,
      screenHeight
    );

    ctx.drawImage(
      this.img,
      0,
      0,
      this.width,
      this.height,
      0,
      this.top,
      screenWidth,
      screenHeight
    );
  }
}
