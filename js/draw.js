/**
 * 填充区域颜色
 */
function fillColor(){
    context.translate(originX, originY);

    for(var count=0;count<6;count++){
        fillOneTerritory(chessBoardColors[count],count+1);
        context.rotate(Math.PI/3);
    }

    context.translate(-originX, -originY);
}

//填充棋盘颜色
function fillOneTerritory(color,mark){
    context.beginPath();
    var l = maxTriangleLen/3+chessRadius*1.8;
    context.moveTo(0,0);
    context.lineTo(l,0);
    context.lineTo(l/2+l,-l*Math.sqrt(3)/2);
    context.lineTo(l/2,-l*Math.sqrt(3)/2);
    context.lineTo(0,0);
    context.lineWidth=0;
    context.fillStyle=color;
    context.fill();
    context.closePath();
    
    if(mark!=undefined){
        context.beginPath();
        //区域标识
        ctx.font = "25px sans-serif"
        context.fillStyle="black"
        ctx.fillText(mark, (l/2+l)*0.8,(-l*Math.sqrt(3)/2)*1.05);
        context.closePath();   
    }
    
}

//绘制棋盘
function drawChessBoard() {
        context.lineWidth = 1;
        // 把原点移动到圆心，旋转之后才不会变形
        context.translate(originX, originY)
        
        for (var triangleCount=0;triangleCount<halfTriangleCount;triangleCount++){
            var triangleLen=minTriangleLen+lenStep*(triangleCount);
            drawTriangle(triangleLen);
            //旋转60度
            context.rotate(Math.PI /3);
            drawTriangle(triangleLen);
            context.rotate(-Math.PI /3);
        }
        drawOnePoint(0,0);
        context.translate(-originX, -originY)
}

//画正三角形
function drawTriangle(Len){
    var startX=0;
    var startY=-Len/Math.sqrt(3);
    var endX=Len/2;
    var endY=Math.sqrt(3)*Len/6;;
    for(var i=0;i<3;i++){
        context.moveTo(0, startY);
        context.lineTo(endX, endY);
        context.lineWidth=3;
        // context.stroke();
        drawPoint(startX,startY,endX,endY,Len/unitLen+1);
        //旋转120度
        context.rotate(Math.PI * 2 / 3);
    }
}

//画所有的空格点
function drawPoint(startX,startY,endX,endY,pointNum){
    var stepLenX = (endX-startX)/(pointNum-1);
    var stepLenY = (endY-startY)/(pointNum-1);
    
    for(var i=0;i<pointNum;i++){
        var x = startX+i*stepLenX;
        var y = startY+i*stepLenY;
        drawOnePoint(x,y);
    };
}

//画一个空格点
function drawOnePoint(x,y){
    context.lineWidth=0;
    context.beginPath();
    context.arc(x,y,pointRadius,0,Math.PI*2,false);
    context.closePath();
    // context.stroke();    
    context.fillStyle = pointColor;
    context.fill();

}

//清除棋盘
function cleanChessBoard() {
    context.fillStyle = "#8f7a66";
    context.fillRect(0, 0, canvas.width, canvas.height);
}

//绘制棋子
function drawChess(x,y,color) {
    context.beginPath();
    context.arc(x,y,chessRadius,0,Math.PI*2,false);
    context.closePath();
    context.fillStyle = color;
    context.fill();
}

//画行进轨迹
function drawTrack(chess,mark,startColor,endColor){
    context.save();
    var next=chess.next;
    var color = randomColor();
    var cor = skew2Rect(chess.x,chess.y);
    //作开始标识
    drawMarkPoint(cor.x,cor.y,startColor,mark);

    while(next!=null){
        var startCor = skew2Rect(chess.x,chess.y);
        var nextCor = skew2Rect(next.x,next.y);
        if(next.next==null){
            //作结束标识
            cor = skew2Rect(next.x,next.y);
            drawMarkPoint(cor.x,cor.y,endColor,mark);
        }
        drawArrow(context,startCor.x,startCor.y,nextCor.x,nextCor.y,50,10,5,color)
        chess=next;
        next=chess.next;
    }
    
    context.restore(); 
}

//画箭头
function drawArrow(ctx, fromX, fromY, toX, toY,theta,headlen,width,color) {
 
    theta = typeof(theta) != 'undefined' ? theta : 30;
    headlen = typeof(theta) != 'undefined' ? headlen : 10;
    width = typeof(width) != 'undefined' ? width : 1;
    color = typeof(color) != 'color' ? color : '#000';
 
    // 计算各角度和对应的P2,P3坐标
    var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
        angle1 = (angle + theta) * Math.PI / 180,
        angle2 = (angle - theta) * Math.PI / 180,
        topX = headlen * Math.cos(angle1),
        topY = headlen * Math.sin(angle1),
        botX = headlen * Math.cos(angle2),
        botY = headlen * Math.sin(angle2);
 
    ctx.save();
    ctx.beginPath();
 
    var arrowX = fromX - topX,
        arrowY = fromY - topY;
 
    ctx.moveTo(arrowX, arrowY);
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    arrowX = toX + topX;
    arrowY = toY + topY;
    ctx.moveTo(arrowX, arrowY);
    ctx.lineTo(toX, toY);
    arrowX = toX + botX;
    arrowY = toY + botY;
    ctx.lineTo(arrowX, arrowY);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.restore();
}

//绘制标识点
function drawMarkPoint(x,y,color,mark){
    context.beginPath();
    context.lineWidth=3;
    context.arc(x,y,pointRadius*0.4,0,Math.PI*2,false);
    context.closePath();
    context.stroke();    
    context.fillStyle = color;
    context.fill();

    context.beginPath();
    //区域标识
    if(mark!=undefined){
        ctx.font = "23px sans-serif"
        context.fillStyle="black"
        ctx.fillText(mark, x+pointRadius,y);
        context.closePath();  
    }
}

//初始化某个区域的棋子
function initChessZone(zoneFlag,color){
    if(zoneFlag==-1||zoneFlag==undefined||zoneFlag==null) return;

    var hasChess=zones[zoneFlag]!=undefined;
    if(hasChess){
        //如果有棋子了，只更换颜色
        zones[zoneFlag].chesses.forEach(chess=>{
            chess.color=color;
            releaseChess(chess);
        });
        zones[zoneFlag].color=color;
    }else{
        stepCount[zoneFlag]=0;
        defaultZone[zoneFlag].forEach(chess=>{
            chess=deepCopy(chess);
            //初始化棋子
            chess.color=color;
            setValueForMatrix(chess.x,chess.y,chess,MC);
            releaseChess(chess);
    
            var chessesZone
            if(zones[zoneFlag]==undefined){
                chessesZone=ChessesZone.new();
                zones[zoneFlag]=chessesZone;
            }else{
                chessesZone=zones[zoneFlag];
            }
            chessesZone.color=chess.color;
            chessesZone.targetZone=chess.targetZone;
            chessesZone.chesses.push(chess);
        })
    }
    selectedColor=null;
}