//深度复制对象
function deepCopy(oldObject){
    var newObject = JSON.parse(JSON.stringify(oldObject));
    return newObject;
}

//判断特定位置是否有棋子
function hasChess(x,y){
    return MC[x]!=undefined && MC[x][y]!=undefined;
}

/**
 * 检查是否在棋盘内
 */
function inChessBoard(x,y){
    try{
        var v=MB[x][y];
        return v;
    }catch(e){
        return false;
    }
}

/**
 * 允许下子
 */
function allow(toX,toY){
    if(!inChessBoard(toX,toY)){
        return false;
    }
    if(hasChess(toX,toY)){
        return false;
    }
    return true;
}


//canvas坐标转换成原点在canvas中间的斜坐标系坐标(x正方向向右，y正方向向上与x轴夹角为60度)
function rect2Skew(offsetX,offsetY){
    //转换为原点为canvas中间的直角坐标系(x正方向向右，y正方向向上)
    var oX=offsetX-originX,oY=-(offsetY-originY);
    //转换为原点也在canvas中间的斜坐标系坐标(x正方向向右，y正方向向上与x轴夹角为60度)
    var degree = Math.PI/3;
    var x=(oX - oY*Math.cos(degree)/Math.sin(degree))/unitLen;
    var y=(oY/Math.sin(degree))/unitLen;
    //四舍五入
    x=Math.round(x),y=Math.round(y);
    var cor=Cor.new();
    cor.x=Math.abs(x)==0?0:x;
    cor.y=Math.abs(y)==0?0:y;
    return cor;
}

//原点在canvas中间的斜坐标系坐标转换成canvas坐标
function skew2Rect(x,y){
    //转换为原点为canvas中间的直角坐标系(x正方向向右，y正方向向上)
    var degree = Math.PI/3;
    var oX=x*unitLen+Math.cos(degree)*y*unitLen,oY=Math.sin(degree)*y*unitLen;
    //转换成canvas坐标
    var cor=Cor.new();
    cor.x=oX+originX,cor.y=originY-oY;
    return cor;
}

//点亮棋子
function highlightChess(x,y){
    context.beginPath();
    context.arc(x,y,chessRadius,0,Math.PI*2,false);
    context.closePath();
    context.lineWidth=3;
    context.lineCol = "yellow";
    context.stroke();
}

//反点亮棋子
function unhighlightChess(x,y,oldColor){
    drawOnePoint(x,y);
    drawChess(x,y,oldColor);
}


//计算两点的距离
function distance(startX,startY,endX,endY){
    return Math.sqrt(Math.pow((endX-startX),2)+Math.pow((endY-startY),2))
}

/**斜坐标轴T1向右旋转60度，产生的新坐标T2
 *  点p在T1的坐标为(oldX,oldY),在T2的坐标为(newX,newY)
 * 转换为
 */
function rotate60D(newX,newY,rotateTimes){
    
    if(rotateTimes==0){
        var cor=Cor.new(newX,newY);
        return cor;
    }else{
        var oldX=newX+newY;
        var oldY=-newX;
        rotateTimes--
        return rotate60D(oldX,oldY,rotateTimes);
    }
}

function setValueForMatrix(x,y,value,matrix){
    if(matrix[x]==undefined||matrix[x]==null){
        matrix[x]=[];
    }
    matrix[x][y]=value;
}

function has2InitChess(){

}

/**
 * 将一个棋子放在棋子链条后端
 * @param {要放入棋子链条的棋子} chess 
 * @param {棋子链条} appendToChess 
 */
function append2ChessLink(chess,appendToChess){

    var tempChess=appendToChess.next;

    while(tempChess!=null){
        tempChess=tempChess.next;
    }
    
    tempChess.next=chess;
}

function copyMatrix(from){
    var to=[];
    for(var i=-from.length+1;i<from.length;i++){
        to[i]=[];
        for(var j=-from.length+1;j<from.length;j++){
            if(from[i][j]!=undefined){
                to[i][j]=from[i][j];
            }
        }
    }
    return to;
}


function saveImage(){
    imgData = context.getImageData(0, 0, canvas.width, canvas.height);
}

function restore(){
    context.putImageData(imgData, 0, 0);
}

function saveImageWithoutPredict(){
    
    if(hasPredictLine){
        restore();hasPredictLine=false;
    }
}

function randomColor(){
    this.r = Math.floor(Math.random()*180);
     this.g = Math.floor(Math.random()*180);
     this.b = Math.floor(Math.random()*180);
     return 'rgba('+ this.r +','+ this.g +','+ this.b +',0.8)';
}

//最终的棋子
function tailChess(chess){
    var lastChess=chess;
    var count=0;
    while(lastChess.next!=null){
        lastChess=lastChess.next;
        count++;
    }
    lastChess.zoneFlag=chess.zoneFlag;
    chess.jumpPointCount=count;
    return lastChess;
}

function samePoint(chess1,chess2){
    return chess1.x==chess2.x && chess1.y==chess2.y;
}