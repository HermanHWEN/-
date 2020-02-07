/**
 * 单击行为
 */
//下棋落子(canvas点击响应函数)或者摆放棋子
canvas.addEventListener("click",function(e){

    saveImageWithoutPredict();
    clearTimeout(timer);
    timer=setTimeout(function(){//初始化一个延时

        var cor=rect2Skew(e.offsetX,e.offsetY);
        var x=cor.x,y=cor.y;
        console.log("click at x:" + x+",y:"+y);

        var zoneFlag=zoneFlagOf(x,y);
        if(selectedColor!=null){
            initChessZone(zoneFlag,selectedColor);
        }else{
            releasePickeChess(x,y);
        }
    },200); 
       
});

/**
 * 双击行为
 */
//选中棋子，并改变颜色
canvas.addEventListener("dblclick",function(e){
    saveImageWithoutPredict();
    clearTimeout(timer);
    var cor=rect2Skew(e.offsetX,e.offsetY);
    var x=cor.x,y=cor.y;
    pickeChess(x,y);
});

/**
 * 拾起一个棋子
 * @param {极坐标的横坐标} x 
 * @param {极坐标的纵坐标} y 
 */
function pickeChess(x,y){
    if(!hasChess(x,y)){
        return;
    }
    var chess= MC[x][y];
    var cor=skew2Rect(x,y);
    if(chess.picked){
        //第二次选中同一个棋子，则反选自己
        pickedChess = null;
        unhighlightChess(cor.x,cor.y,chess.color);
    }else{
        if(pickedChess!=null){//反选上次选中的棋子
            var corOfLastPicked=skew2Rect(pickedChess.x,pickedChess.y);
            pickedChess.picked=false;
            unhighlightChess(corOfLastPicked.x,corOfLastPicked.y,pickedChess.color);
        }
        //选中新的棋子
        pickedChess = chess;
        highlightChess(cor.x,cor.y);
    }
    chess.picked=!chess.picked;
}

//检查是否有棋子被选中了
function checkIfHasPickedChess(){
    return pickedChess!=null;
}

//清除棋子
function removeChess(x,y){
    if(MC[x]==undefined){
        MC[x]=[];
    }
    MC[x][y]=null;
    var cor=skew2Rect(x,y);
    drawOnePoint(cor.x,cor.y);
}

//放置棋子
function releaseChess(chess){
    chess.picked=false;
    var cor=skew2Rect(chess.x,chess.y);
    drawChess(cor.x,cor.y,chess.color);
}

//将选中的棋子释放到位置(x,y)，并将选中的棋子标识为不选中
//改变棋子矩阵MC的两个位置的值
function releasePickeChess(x,y){
    //如果目标位置有棋子，不允许放置
    if(!allow(x,y)){
        return;
    }

    var tt = jumpPoint2({x:0,y:0});
    if(!allowToJump(pickedChess,x,y)){
        return;
    }
    if(pickedChess!=null && pickedChess!=undefined){
        var oldX=pickedChess.x;
        var oldY=pickedChess.y;
        //清除棋子
        removeChess(oldX,oldY);
    }else{
        pickedChess=Chess.new();
        pickedChess.color=chessColors[step%6];
        step++;
    }

    if(!pickedChess.picked){
        return;
    }
    //将棋子放到新的位置
    pickedChess.x=x;
    pickedChess.y=y;

    if(MC[x]==undefined){
        MC[x]=[];
    }
    MC[x][y]=pickedChess;
    stepCount[pickedChess.zoneFlag]++;
    releaseChess(pickedChess);
    console.log("zone["+pickedChess.zoneFlag+"] 第"+stepCount[pickedChess.zoneFlag]+"步");
    pickedChess=null;
}