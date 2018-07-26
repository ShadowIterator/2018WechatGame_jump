
let sharedCanvas = wx.getSharedCanvas();

let shctx = sharedCanvas.getContext('2d');

let W = sharedCanvas.width;
let H = sharedCanvas.height;

// let scales = W / 750;

const screenWidth = wx.getSystemInfoSync().screenWidth;
const screenHeight = wx.getSystemInfoSync().screenHeight;
const ratio = wx.getSystemInfoSync().pixelRatio;

const eachPageSize=5;
let currentPage=0;

function getData_success(res) {
    // shctx.fillStyle = '#0ff';
    // shctx.font = '20px Arial';
    // shctx.textAlign='center';
    // shctx.fillText(`game over, touch screen to restart`, W / 2, 220);
    // console.log('sucess');

    // console.log(res);
    let y = 20;

    for(let i = 0; i < res.data.length; ++i) {
        let userImage=wx.createImage();
        userImage.src=res.data[i].avatarUrl;
        shctx.drawImage(userImage, sharedCanvas.width/(8*ratio), y-20, 30, 30);
        shctx.fillStyle = '#0ff';
        shctx.font = '20px Arial';
        shctx.textAlign='center';
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

        if(res.data[i].KVDataList.length !== 0)
            shctx.fillText(`${res.data[i].nickname}   ${res.data[i].KVDataList[0].value}`, sharedCanvas.width/(2*ratio), y);

        y += 50;
    }
}

function singlePageRankList(res)
{
  if(currentPage<0)
    currentPage=0;
  if((currentPage-1)*eachPageSize>=res.data.length)
    currentPage--;
  let y=20;
  let sortedList=dataSort(res.data);
  let userSeq;
  for(let i=0; i<eachPageSize; i++)
  {
    let userImage=wx.createImage();
    userSeq=currentPage*eachPageSize+i;
    userImage.src=sortedList[userSeq].avatarUrl;
    shctx.drawImage(userImage, sharedCanvas.width/(8*ratio), y-20, 30, 30);
    shctx.fillStyle = '#0ff';
    shctx.font = '20px Arial';
    for(let j = 0; j < rsortedList[userSeq].KVDataList.length; ++j) {
      if (sortedList[userSeq].KVDataList[j].key === 'maxScore') {
        shctx.textAlign = 'center';
        shctx.fillText(`${sortedList[userSeq].nickname}   ${sortedList[userSeq].KVDataList[j].value}`, sharedCanvas.width / (2 * ratio), y);
      }
      y += 50;
    }
  }

}

wx.onMessage(data => {
    // console.log(data.op);
    if(data.op === 'init') {

        //console.log(sharedCanvas.width);
        shctx.scale(ratio, ratio);
        //console.log(sharedCanvas.width);

        return ;
    }
    else if(data.op === 'rend') {
        wx.getFriendCloudStorage({
            keyList: ['maxScore'],
            //success: getData_success
            success: singlePageRankList
        });
    }
    else if(data.op === 'updateScore') {
        console.log(data.op, data.score);
        updateScore(data.score);
    }
    else if(data.op==='nextpage')
    {
      currentPage++;
      wx.getFriendCloudStorage(
          {
            keyList: ['maxScore'],
            success:  singlePageRankList
          });
    }
    else if(data.op==='lastpage')
    {
      currentPage--;
      wx.getFriendCloudStorage(
        {
          keyList: ['maxScore'],
          success:  singlePageRankList
        });
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

function dataSort(gameData) {
  return gameData.sort((a,b) => {
    let scoreA=0;
    let scoreB=0;
    for(let i=0; i<a.KVDataList.length; i++)
    {
      if(a.KVDataList[i].key==='maxScore')
      {
        scoreA=parseInt(a.KVDataList[i].value || 0);
      }
    }
    for(let i=0; i<b.KVDataList.length; i++)
    {
      if(b.KVDataList[i].key==='maxScore')
      {
        scoreB=parseInt(b.KVDataList[i].value || 0);
      }
    }
    return scoreA > scoreB ? -1 : scoreA < scoreB ? 1 : 0;
  });
}


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

