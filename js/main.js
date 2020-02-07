var btn = document.getElementById("btn");

var chessMapArr = [];//记录棋盘落子情况
var chessColor = ["black", "white"];//棋子颜色
var step = 0;//记录当前步数
var flag = false;//判断游戏是否结束
//输赢检查方向模式
var checkMode = [
    [1,0],//水平
    [0,1],//竖直
    [1,1],//左斜线
    [1,-1],//右斜线
];


//新游戏按钮响应函数
btn.addEventListener("click",function(){
    startGame();
})

//推荐按钮1
document.getElementById("btnRecommend1").addEventListener("click",function(){
    predict(0);
})

//推荐按钮2
document.getElementById("btnRecommend2").addEventListener("click",function(){
    predict(1);
})

//推荐按钮3
document.getElementById("btnRecommend3").addEventListener("click",function(){
    predict(2);
})

//推荐按钮4
document.getElementById("btnRecommend4").addEventListener("click",function(){
    predict(3);
})

//推荐按钮5
document.getElementById("btnRecommend5").addEventListener("click",function(){
    predict(4);
})

//推荐按钮6
document.getElementById("btnRecommend6").addEventListener("click",function(){
    predict(5);
})

//
var btnchessWhite = document.getElementById("btnchessWhite");
btnchessWhite.style.backgroundColor = chessWhite;
btnchessWhite.style.color="black";
btnchessWhite.addEventListener("click",function(){
    selectedColor=chessWhite;
})

var btnChessBlue = document.getElementById("btnChessBlue");
btnChessBlue.style.backgroundColor = chessBlue;
btnChessBlue.addEventListener("click",function(){
    selectedColor=chessBlue;
})

var btnChessRed = document.getElementById("btnChessRed");
btnChessRed.style.backgroundColor = chessRed;
btnChessRed.addEventListener("click",function(){
    selectedColor=chessRed;
})

var btnChessCyn = document.getElementById("btnChessCyn");
btnChessCyn.style.backgroundColor = chessCyn;
btnChessCyn.addEventListener("click",function(){
    selectedColor=chessCyn;
})

var btnchessYellow = document.getElementById("btnchessYellow");
btnchessYellow.style.backgroundColor = chessYellow;
btnchessYellow.addEventListener("click",function(){
    selectedColor=chessYellow;
})

var btnchessBlack = document.getElementById("btnchessBlack");
btnchessBlack.style.backgroundColor = chessBlack;
btnchessBlack.addEventListener("click",function(){
    selectedColor=chessBlack;
})


function startGame() {
    //初始化棋盘数组
    for(var i=0; i<14; i++){
       chessMapArr[i] = [];
       for(var j=0; j<14; j++){
          chessMapArr[i][j] = 0;
        }    
    }
    ctx.globalCompositeOperation=
    //清空棋盘
    cleanChessBoard();
    fillColor();
    //绘制棋盘
    drawChessBoard();
    init();
    //重置游戏是否结束标志
    over = false;
}



//胜负判断函数
function checkWin(x,y,color,mode)
{
    var count = 1;//记录分数
    for(var i=1;i<5;i++){
        if(chessMapArr[x + i * mode[0]]){
            if(chessMapArr[x + i * mode[0]][y + i * mode[1]] == color){
                count++;
            }else{
                break;
            }
        }
    }
    
    for(var j=1;j<5;j++){
        if(chessMapArr[x - j * mode[0]]){
            if(chessMapArr[x - j * mode[0]][y - j * mode[1]] == color){
                count++;
            }else{
                break;
            }
        }
    }
    if(mode == checkMode[0])
    { console.log("水平方向有： " + count + "个" + color);}
    if(mode == checkMode[1])
    { console.log("竖直方向有： " + count + "个" + color);}
    if(mode == checkMode[2])
    { console.log("左斜方向有： " + count + "个" + color);}
    if(mode == checkMode[3])
    { console.log("右斜方向有： " + count + "个" + color);}
   
    if(count >= 5){
        alert(color + " you habe win!" + "帅~");
        // 游戏结束
        flag = true;
    }
}