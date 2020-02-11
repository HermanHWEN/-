/**
 * 初始化矩阵
 */

function init(){
    //旋转5次
    var rotateTimes=6;
    MB=[],MF=[],MC=[],zones=[];
    //旋转60度
    for (var rCount=0;rCount<rotateTimes;rCount++){
        defaultZone[rCount]=[];
        //横坐标
        for(var x=0;x<halfTriangleCount+1;x++){
            //纵坐标
            for(var y=0;y<halfTriangleCount+1;y++){
                var cor=rotate60D(x,y,rCount);//获取在不旋转前的坐标系下的坐标
                //初始化棋盘矩阵
                var oldX=cor.x,oldY=cor.y;
                setValueForMatrix(oldX,oldY,1,MB);
                //标识矩阵模板MF
                setValueForMatrix(oldX,oldY,0,MF);

                //初始化棋子初始位置和目标位置
                if(x+y>halfTriangleCount){
                    var chess = Chess.new(oldX,oldY);
                    chess.zoneFlag=rCount;
                    chess.targetZone=(rCount+3)%6;

                    //初始化
                    var targetChess=deepCopy(chess);
                    defaultZone[rCount].push(targetChess);

                    
                }
            }
        }
        //摆放这个区域的棋子
        // initChessZone(rCount,chessColors[rCount])
    }
    saveImage();
}



/**
 * 判断是否符合第一类路径
 * toX=x+dx
 * toY=y
 * 即y不变
 */
function isInPath1(x,y,toX,toY){
    return y==toY;
}



/**
 * 获取第一类跳跃点
 * @param {起始棋子} fromChess 
 * @returns 跳跃点集合
 */
function jumpPoint1(fromChess){
    var x = fromChess.x,y=fromChess.y;
    var jumpPoints = [];
    var jumpPoint;
    var dx =0;
    do{
        dx++;
        jumpPoint = Chess.new(x+dx,y);
        if(hasChess(jumpPoint.x,jumpPoint.y)){
            jumpPoints.push(jumpPoint);
        }
    }while(inChessBoard(jumpPoint.x,jumpPoint.y))

    dx =0;
    do{
        dx--;
        jumpPoint = Chess.new(x+dx,y);
        if(hasChess(jumpPoint.x,jumpPoint.y)){
            jumpPoints.push(jumpPoint);
        }
    }while(inChessBoard(jumpPoint.x,jumpPoint.y))

    return jumpPoints;
}

/**
 * 判断是否符合第二类路径
 * toX=x
 * toY=y+dy
 * 即x不变
 */
function isInPath2(x,y,toX,toY){
    return x==toX;
}

/**
 * 获取第二类跳跃点
 * @param {起始棋子} fromChess  
 * @returns 跳跃点集合
 */
function jumpPoint2(fromChess){
    var x = fromChess.x,y=fromChess.y;
    var jumpPoints = [];
    var jumpPoint;
    var dy =0;
    do{
        dy++;
        jumpPoint = Chess.new(x,y+dy);
        if(hasChess(jumpPoint.x,jumpPoint.y)){
            jumpPoints.push(jumpPoint);
        }
    }while(inChessBoard(jumpPoint.x,jumpPoint.y))

    dy =0;
    do{
        dy--;
        jumpPoint = Chess.new(x,y+dy);
        if(hasChess(jumpPoint.x,jumpPoint.y)){
            jumpPoints.push(jumpPoint);
        }
    }while(inChessBoard(jumpPoint.x,jumpPoint.y))

    return jumpPoints;
}

/**
 * 判断是否符合第三类路径
 * toX=x+dx
 * toY=y-dy
 * 即dx=-dy
 */
function isInPath3(x,y,toX,toY){
    var dx=toX-x;
    var dy=toY-y;
    return dx==-dy;
}

/**
 * 获取第三类跳跃点
 * @param {起始棋子} fromChess  
 * @returns 跳跃点集合
 */
function jumpPoint3(fromChess){
    var x = fromChess.x,y=fromChess.y;
    var jumpPoints = [];
    var jumpPoint;
    var dx =0;
    do{
        dx++;
        jumpPoint = Chess.new(x+dx,y-dx);
        if(hasChess(jumpPoint.x,jumpPoint.y)){
            jumpPoints.push(jumpPoint);
        }
    }while(inChessBoard(jumpPoint.x,jumpPoint.y))

    dx =0;
    do{
        dx--;
        jumpPoint = Chess.new(x+dx,y-dx);
        if(hasChess(jumpPoint.x,jumpPoint.y)){
            jumpPoints.push(jumpPoint);
        }
    }while(inChessBoard(jumpPoint.x,jumpPoint.y))

    return jumpPoints;
}


/**
 * 判断两个点之间的棋子个数
 * 如果没有dx的绝对值要是1
 * 如果有一个可行
 * 如果有两个以上，非法走法
 */
function allowToJump(chess,toX,toY){
    if(chess==undefined) return false;
    var x=chess.x,y=chess.y;
    
    if(!inChessBoard(toX,toY))  return false;
    if(hasChess(toX,toY))  return false;

    if(!battle) return true;
    if(!isInPath1(x,y,toX,toY) && !isInPath2(x,y,toX,toY) && !isInPath3(x,y,toX,toY)) return false;

    var dx=toX-x;
    var dy=toY-y;
    if(dx==0 && dy==0) return false;

    //如果只前进了一个格子
    if(Math.abs(dx)==1||Math.abs(dy)==1) return true;

    //计算横纵坐标步长
    var stepX=dx/Math.abs(dx),stepY=dy/Math.abs(dy);

    var middleX;
    var middleY;
    var count=0;
    if(dy==0){//第一类路径
        for (moveX=stepX;Math.abs(moveX)<Math.abs(dx);moveX+=stepX){
            middleX=x+moveX;
            middleY=y;
            if(hasChess(middleX,middleY)){
                if(moveX!=dx/2) return false;
                count++;
            }
        }
    }else if(dx==0){
        for (moveY=stepY;Math.abs(moveY)<Math.abs(dy);moveY+=stepY){
            middleY=y+moveY;
            middleX=x;
            if(hasChess(middleX,middleY)){
                if(moveY!=dy/2) return false;
                count++;
            }
        }
    }else{
        for (moveX=stepX;Math.abs(moveX)<Math.abs(dx);moveX+=stepX){
            middleX=x+moveX;
            middleY=y-moveX;
            if(hasChess(middleX,middleY)){
                if(moveX!=dx/2) return false;
                count++;
            }
        }
    }
    return count==1;
}


/**
 * 找到最优路径，将最优得分和最优路径写入chess中
 * @param {当前棋子} chess 
 */
function jump(chess){
    var targetZone=chess.targetZone;
    var jumpPoints=[];
    jumpPoints = jumpPoints.concat(jumpPoint1(chess));
    jumpPoints = jumpPoints.concat(jumpPoint2(chess));
    jumpPoints = jumpPoints.concat(jumpPoint3(chess));


    chess.trackMatrix[chess.x][chess.y]=1;//标识当前棋子已经走过了
    var flagMatrix = copyMatrix(chess.trackMatrix);

    //原距离
    var distance= distance2TargetZone(chess,targetZone);
    

    //遍历所有可能的路径，找出最小的得分
    jumpPoints.forEach(jumpPoint => {
        var toPoint = Chess.new(2*jumpPoint.x-chess.x,2*jumpPoint.y-chess.y);
        toPoint.zoneFlag=zoneFlagOf(toPoint.x,toPoint.y);

        //如果允许跳过去且这个目标点没有跳过
        if(allowToJump(chess,toPoint.x,toPoint.y)){
            if(flagMatrix[toPoint.x][toPoint.y]!=1){
                toPoint.targetZone=targetZone;
                toPoint.trackMatrix=flagMatrix;
                //跳到这个节点的得分
                var distance1 = distance2TargetZone(toPoint,targetZone);
                //继续跳的分数
                var distance2 = jump(toPoint);

                var distanceOfThisJump;
                if(distance1>distance2){
                    distanceOfThisJump=distance2;
                }else{
                    toPoint.next=null;
                    distanceOfThisJump=distance1;
                }

                //比较之前的得分，看是否把这个节点拼接进链条里
                if(distanceOfThisJump<distance){
                    chess.next=toPoint;
                    distance=distanceOfThisJump;
                }
            }
        }
            
    });
    return distance;
}


//移动一步
function moveOneStep(chess){
    var targetZone=chess.targetZone;
    var score= sumScoreOfMyZoneForMove(chess,chess);;

    //第一类
    var toPoint = Chess.new(chess.x+1,chess.y);

    toPoint.targetZone=targetZone;
    score=acceptMoveToPoint(chess,toPoint,score);

    toPoint = Chess.new(chess.x-1,chess.y);
    toPoint.targetZone=targetZone;
    score=acceptMoveToPoint(chess,toPoint,score);

    //第二类点
    toPoint = Chess.new(chess.x,chess.y+1);
    toPoint.targetZone=targetZone;
    score=acceptMoveToPoint(chess,toPoint,score);

    toPoint = Chess.new(chess.x,chess.y-1);
    toPoint.targetZone=targetZone;
    score=acceptMoveToPoint(chess,toPoint,score);

    //第三类点
    toPoint = Chess.new(chess.x+1,chess.y-1);
    toPoint.targetZone=targetZone;
    score=acceptMoveToPoint(chess,toPoint,score);

    toPoint = Chess.new(chess.x-1,chess.y+1);
    toPoint.targetZone=targetZone;
    score=acceptMoveToPoint(chess,toPoint,score);

    return score;
}

function acceptMoveToPoint(chess,toPoint,oldScore){
    //原始距离
    var originalDistance = distance2TargetZone(chess,chess.targetZone);

    if(inChessBoard(toPoint.x,toPoint.y)&&!hasChess(toPoint.x,toPoint.y)){
        var newDistance = distance2TargetZone(toPoint,chess.targetZone);

        var newScore = originalDistance-newDistance+ sumScoreOfMyZoneForMove(chess,toPoint);
        if(newScore>oldScore){
            chess.next=toPoint;
            return newScore;
        }
    }
    return oldScore;
}

//棋子到指定阵营的距离
function distance2TargetZone(chess,targetZone){
    var minDis=10000;
    defaultZone[targetZone].forEach(targetPoint=>{
        minDis = Math.min(minDis,distance(chess.x,chess.y,targetPoint.x,targetPoint.y));
    })
    return minDis;
}


var hasPredictLine=false;
var imgData;
//预测指定阵营到敌营的最佳前进路线
function predict(zone){
    var preBattleMode=battle;
    battle=true;
    if(hasPredictLine){
        restore();
    }else{
        saveImage();
        var chessesZone=zones[zone];
        var bestChess=Chess.new();
        bestChess.score=-1;
        if(chessesZone==undefined) {
            battle=preBattleMode;
            return;
        }
        chessesZone.chesses.forEach(chess=>{
            //清空分数
            chess.score=null;
            chess.next=null;
        });
        chessesZone.chesses.forEach(chess=>{

            if(longestRoute){
                chess.score=scoreOfLongestJumpOfChess(chess);
            }else{
                chess.score=scoreOfZoneForJump(chess);
            }
                
            if(chess.score>bestChess.score){
                bestChess=chess;
            }
        })

        var mostJumpointsOfOtherZone=0;
        chessesZone.chesses.forEach(chess=>{

            //这次跳跃的最终的棋子
            var lastChess=tailChess(chess);
            if(chess.jumpPointCountOfOtherZone>mostJumpointsOfOtherZone){
                mostJumpointsOfOtherZone=chess.jumpPointCountOfOtherZone;
            }
        });

        var count=1;
        chessesZone.chesses.forEach(chess=>{

            //这次跳跃的最终的棋子
            var lastChess=tailChess(chess);

            var drawed=false;

            //每个棋子都画出最长的路线
            if(chess!=lastChess && chess.jumpPointCount>1){
                drawed=true;
                drawTrack(chess,count,"white","blue");
            }

            //最最多棋子
            if(chess.jumpPointCount==mostJumpointsOfOtherZone && chess!=lastChess && mostJumpointsOfOtherZone!==1){
                drawed=true;
                drawTrack(chess,count,"white","yellow");
            }

            //能直接去到敌营的路径
            if(!inTargetZone(chess) && inTargetZone(lastChess) && chess!=lastChess){
                drawed=true;
                drawTrack(chess,count,"white","black");
            }

            //最优路径
            if(chess.score==bestChess.score && chess!=lastChess){
                drawed=true;
                drawTrack(chess,count,"white","red");
            }


            if(drawed) count++;
                
        });
        
        
    }
    battle=preBattleMode;
    hasPredictLine=!hasPredictLine;
}

//判断是否处于目标阵营
function inTargetZone(chess){
    return inZone(chess,chess.targetZone);
}

//判断一个棋子是否处于指定阵营
function inZone(chess,zoneFlag){
    var zone =defaultZone[zoneFlag];
    for (var i=0;i<zone.length;i++){
        var zonePoint=zone[i];
        if(chess.x==zonePoint.x && chess.y==zonePoint.y){
            return true;
        }
    }
    return false;
}

//判断一个点处于那个阵营，没有在阵营里，返回-1
function zoneFlagOf(x,y){
    for(var i=0;i<defaultZone.length;i++){
        var chess = Chess.new(x,y);
        if(inZone(chess,i)){
            return i;
        }
    }
    return -1;
}

/**
 * 评价一个棋子的分数
 *  它走了到最远的位置后
 *  其他棋子能走的所有距离的总和
 */

 function scoreOfLongestJumpOfChess(chess){
    chess.trackMatrix=copyMatrix(MF);
     //原始距离
     var originalDistance = distance2TargetZone(chess,chess.targetZone);

     //先将自己从棋盘中移除
     MC[chess.x][chess.y]=undefined;

     var newDistance=jump(chess);

    chess.score=originalDistance-newDistance;  

     //在放回来
     MC[chess.x][chess.y]=chess;

     return chess.score;
 }


 //这次移动得到整个阵营的分数
 function scoreOfZoneForJump(chess){
    var score = scoreOfLongestJumpOfChess(chess);
    //如果这次评分为0，说明没法跳跃，则移动一步
    if(score==0) {
        chess.next=null;
        score = moveOneStep(chess);
    }else{
        //这次跳跃的最终的棋子
        var lastChess=tailChess(chess);
        if(chess==lastChess) return 0;

        //本阵营的分数
        score+=sumScoreOfMyZoneForMove(chess,lastChess,chess);

        //其他阵营的分数损失
        score+=sumScoreOfOthersZoneForMove(chess,lastChess);
    }
    
    
    return score;
 }
 

 //将一个子移动后整个阵营的得分
function sumScoreOfMyZoneForMove(fromChess,toChess,excludeChess){
    var oldChess=Chess.new(fromChess.x,fromChess.y);
    //将棋子放在最终位子
    if(!samePoint(fromChess,toChess)){
        MC[fromChess.x][fromChess.y]=undefined;
        fromChess.x=toChess.x;
        fromChess.y=toChess.y;
        setValueForMatrix(toChess.x,toChess.y,fromChess,MC);
    }
    

    var zoneFlag=fromChess.zoneFlag;
    var score=0;
    var chessesZone=zones[zoneFlag];
    //汇总本阵营其他棋子的得分
    chessesZone.chesses.forEach(otherChess=>{
        if(otherChess!=excludeChess){
        //保存原来的分数和链条
        var oldScore=otherChess.score;
        var oldNext=otherChess.next;
        score+=scoreOfLongestJumpOfChess(otherChess);
        otherChess.score=oldScore;
        otherChess.next=oldNext; 
        }
    });

    //恢复原位
    if(!samePoint(oldChess,toChess)){
        fromChess.x=oldChess.x;
        fromChess.y=oldChess.y;
        MC[fromChess.x][fromChess.y]=fromChess;
        MC[toChess.x][toChess.y]=undefined;
    }
    return score;
 }


  //将一个子移动后其他阵营的得分损失
function sumScoreOfOthersZoneForMove(fromChess,toChess){

    var preScore=0;
    //汇总移动之前的分数
    zones.forEach(zone=>{
        if(zone!=undefined && zone!=null && zone!=zones[fromChess.zoneFlag]){
            zone.chesses.forEach(otherChess=>{
                //保存原来的分数和链条
                var oldScore=otherChess.score;
                var oldNext=otherChess.next;
                preScore+=scoreOfLongestJumpOfChess(otherChess);
                otherChess.score=oldScore;
                otherChess.next=oldNext; 
            });
        }
    })

    var oldChess=Chess.new(fromChess.x,fromChess.y);
    //将棋子放在最终位子
    if(!samePoint(fromChess,toChess)){
        MC[fromChess.x][fromChess.y]=undefined;
        fromChess.x=toChess.x;
        fromChess.y=toChess.y;
        setValueForMatrix(toChess.x,toChess.y,fromChess,MC);
    }
    

    var zoneFlag=fromChess.zoneFlag;
    var newScore=0;

    zones.forEach(zone=>{
        if(zone!=undefined && zone!=null && zone && zone!=zones[fromChess.zoneFlag]){
            zone.chesses.forEach(otherChess=>{
                //保存原来的分数和链条
                var oldScore=otherChess.score;
                var oldNext=otherChess.next;
                newScore+=scoreOfLongestJumpOfChess(otherChess);
                otherChess.score=oldScore;
                otherChess.next=oldNext; 
            });
        }
    })

    

    //恢复原位
    if(!samePoint(oldChess,toChess)){
        fromChess.x=oldChess.x;
        fromChess.y=oldChess.y;
        MC[fromChess.x][fromChess.y]=fromChess;
        MC[toChess.x][toChess.y]=undefined;
    }
    return preScore-newScore;
  }