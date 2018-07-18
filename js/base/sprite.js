/**
 * 游戏基础的精灵类
 */
export default class Sprite {
  constructor(shape = {}, imgSrc = '', width=  0, height = 0) {
    this.img     = new Image();
    this.img.src = imgSrc;

    this.width  = width;
    this.height = height;

    this.shape = shape;

    this.visible = true
  }

  drawToCanvas(ctx) {
    if ( !this.visible )
      return;

    ctx.drawImage(
      this.img,
      this.x,
      this.y,
      this.width,
      this.height
    )
  }

}
