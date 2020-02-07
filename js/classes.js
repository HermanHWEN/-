var Cor = {
    new:function(x,y){
        var cor={
            x:x,
            y:y
        }
        return cor;
    }
}

/**
 * 棋子对象
 * *坐标x,y
    最优轨迹链LT
    最优轨迹得分score
    前节点pre
    后节点next
    是否拾起标识picked
    目标区域targetZone
    模拟行走后记录的轨迹矩阵
 * */
var Chess={
    new:function(x,y){
        var chess ={
            x:x,
            y:y,
            LT:null,
            score:null,
            color:red,
            pre:null,
            next:null,
            picked:false,
            zoneFlag:null,
            targetZone:null,
            trackMatrix:[]
        };
        return chess;
    }
}

/**
 *  每一方拥有的棋子的对象
    颜色color
    棋子chesses[],值为chess对象
    目标区域标识targetZone
*/
var ChessesZone={
    new:function(){
        var chessZone={
            color:null,
            chesses:[],
            targetZone:null
        }
        return chessZone;
    }
}

//各方的集合
var zones=[];
