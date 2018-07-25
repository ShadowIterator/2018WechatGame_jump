
let sharedCanvas = wx.getSharedCanvas();

let shctx = sharedCanvas.getContext('2d');

let W = sharedCanvas.width;
let H = sharedCanvas.height;

// let scales = W / 750;

const screenWidth = wx.getSystemInfoSync().screenWidth;
const screenHeight = wx.getSystemInfoSync().screenHeight;
const ratio = wx.getSystemInfoSync().pixelRatio;

function getData_success(res) {
    // shctx.fillStyle = '#0ff';
    // shctx.font = '20px Arial';
    // shctx.textAlign='center';
    // shctx.fillText(`game over, touch screen to restart`, W / 2, 220);
    // console.log('sucess');

    //console.log(res);
    let y = 20;

    for(let i = 0; i < res.data.length; ++i) {
        let userImage=wx.createImage();
        userImage.src=res.data[i].avatarUrl;
        shctx.drawImage(userImage, sharedCanvas.width/(8*ratio), y-20, 30, 30);
        shctx.fillStyle = '#0ff';
        shctx.font = '20px Arial';
        //shctx.fillText(res.data[i].nickname, 100, y);
        //console.log(res.data[i].nickname);
        // shctx.fill(`${res[i].KVData.siscore}`, 200, y);
        for(let j = 0; j < res.data[i].KVDataList.length; ++j) {
            if(res.data[i].KVDataList[j].key === 'siscore') {
                shctx.textAlign='center';
                shctx.fillText(`${res.data[i].nickname}   ${res.data[i].KVDataList[j].value}`, sharedCanvas.width/(2*ratio), y);
                // console.log(res.data[i].KVDataList[j].value);
            }
        }
        y += 50;
    }
}

wx.onMessage(data => {
    if(data.op === 'init') {
        // sharedCanvas.width = screenWidth * ratio;
        // sharedCanvas.height = screenHeight * ratio;
        console.log(sharedCanvas.width);
        shctx.scale(ratio, ratio);
        console.log(sharedCanvas.width);
        // let scales = screenWidth /750;
        // shctx.scale(scales, scales);
        // console.log(sharedCanvas.width, sharedCanvas.height);
        return ;
    }

    wx.getFriendCloudStorage({
        keyList: ['siscore'],
        success: getData_success
    })

    // shctx.fillStyle = '#0ff';
    // shctx.font = '20px Arial';
    // shctx.textAlign='center';
    // shctx.fillText(`game over, touch screen to restart`, 750/2, 220);
    // console.log(data)
    /* {
      text: 'hello',
      year: 2018
    } */
});
// context.scale(ratio, ratio);// 因为sharedCanvas在主域放大了ratio倍
// //为了便于计算尺寸，在将context 缩放到750宽的设计稿尺寸，
// let scales = screenWidth / 750;
// context.scale(scales, scales);
// // 接下来你每绘制的一个元素的尺寸，都应该按钮750宽的设计稿/
// // 比如
// // 画标题
// context.fillStyle = '#fff';
// context.font = '50px Arial';
// context.textAlign = 'center';
// context.fillText('好友排行榜', 750 / 2, 220); // 750的尺寸
