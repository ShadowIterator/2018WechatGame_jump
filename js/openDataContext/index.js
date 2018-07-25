
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

    // console.log(res);
    let y = 20;

    for(let i = 0; i < res.data.length; ++i) {
        // shctx.drawImage(res.data[i].avatarUrl, 0, y, 40, 40);
        shctx.fillStyle = '#0ff';
        shctx.font = '20px Arial';
        //shctx.fillText(res.data[i].nickname, 100, y);
        //console.log(res.data[i].nickname);
        // shctx.fill(`${res[i].KVData.curScore}`, 200, y);
        // for(let j = 0; j < res.data[i].KVDataList.length; ++j) {
        //     if(res.data[i].KVDataList[j].key === 'maxScore') {
        //         shctx.textAlign='center';
        //         shctx.fillText(`${res.data[i].nickname}   ${res.data[i].KVDataList[j].value}`, sharedCanvas.width/(2*ratio), y);
        //         // console.log(res.data[i].KVDataList[j].value);
        //     }
        // shctx.textAlign='center';
        // shctx.fillText(`${res.data[i].nickname}   ${res.data[i].KVDataList[0].value}`, sharedCanvas.width/(2*ratio), y);
        // }
        shctx.textAlign='center';
        if(res.data[i].KVDataList.length !== 0)
            shctx.fillText(`${res.data[i].nickname}   ${res.data[i].KVDataList[0].value}`, sharedCanvas.width/(2*ratio), y);

        y += 50;
    }
}

wx.onMessage(data => {
    // console.log(data.op);
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
    else if(data.op === 'rend') {
        wx.getFriendCloudStorage({
            keyList: ['maxScore'],
            success: getData_success
        })
    }
    else if(data.op === 'updateScore') {
        console.log(data.op, data.score);
        updateScore(data.score);
    }
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

function updateScore (score) {
    // console.log(':updataScore');
    wx.setUserCloudStorage({
        KVDataList: [{
           key: 'curScore',
           value: score
        }],
        success: (res => {
            console.log('set curScore, sucess', res);
        })
    });
    // wx.setUserCloudStorage({
    //     KVDataList: [{
    //         key: 'curScore',
    //         value: score
    //     }],
    //     success: (res => {
    //         console.log('save cur success');
    //         // console.log('save max success', res);
    //     }),
    //     fail: (res => {
    //         console.log('save max failed', res);
    //     })
    // });

    wx.getUserCloudStorage({
        keyList: ['curScore', 'maxScore'],
        success: res => {
            console.log('getUserCloudStorage, success');
            let data = res;
            let curScore = data.KVDataList[0].value;
            console.log(data);
            console.log(curScore);
            // if (!data.KVDataList[1]){
            //     saveMaxScore(lastScore);
            //     myScore = lastScore;
            // } else if (lastScore > data.KVDataList[1].value) {
            //     saveMaxScore(lastScore);
            //     myScore = lastScore;
            // } else {
            //     myScore = data.KVDataList[1].value;
            // }
            if(!data.KVDataList[1] || (Number(curScore) > Number(data.KVDataList[1].value))) {
                saveMaxScore(curScore);
            }
        }
    });
}

function saveMaxScore(maxScore) {
    console.log('saveMax ', maxScore);
    wx.setUserCloudStorage({
        KVDataList: [{
            key: 'maxScore',
            value: maxScore
        }],
        success: res => {
            console.log('save max success', res);
        },
        fail: res => {
            console.log('save max failed', res);
        }
    });
}