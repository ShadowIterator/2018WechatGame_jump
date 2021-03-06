/**
 * 游戏基础的精灵类
 */
export default class Sprite {
  constructor(shape = {}, imgSrc = '', width=  0, height = 0) {
    this.img     = new Image();
    this.img.src = imgSrc;

    this.audio=new Audio();
    this.audio.src='';

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
      this.shape.getPos().x,
      this.shape.getPos().y,
      this.width,
      this.height
    )
  }

  setImg(src='')  {
    this.img.src = src;
  }

  setAudio(src='')  {
    this.audio.src=src;
  }

}
