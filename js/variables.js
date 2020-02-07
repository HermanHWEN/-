var canvas = document.getElementById("chessboard");
//var canvas = document.querySelector(".an");
var context = canvas.getContext("2d");
var ctx = canvas.getContext("2d");
var width = canvas.width,height = canvas.height;
// 原点坐标
var originX = width / 2,originY = height / 2,
pointRadius;

var maxTriangleLen=Math.min(width,height)/1.25;
//有8个三角形
var halfTriangleCount = 4;

//最小的三角形单位长度为3，长度按单位长度为3递增
var unitLen = maxTriangleLen/(3+3*(halfTriangleCount-1));
var lenStep = unitLen*3;
var minTriangleLen = unitLen*3;
pointRadius = unitLen/3*1.1;
var chessRadius = pointRadius*0.8

//颜色定义
var yellow="#d7c866";
var red = "#ab203c";
var cyan ="#21a838";

var chessBoardColors=[];
chessBoardColors[0]=yellow;
chessBoardColors[1]=red;
chessBoardColors[2]=cyan;
chessBoardColors[3]=yellow;
chessBoardColors[4]=red;
chessBoardColors[5]=cyan;

var pointColor = "#a9aa96";
var chessYellow="#819902";
var chessBlue="#2f7777";
var chessRed="#82371d";
var chessBlack="#11170f";
var chessWhite="#edf1ec";
var chessCyn="#6cd652";

var chessColors=[];
chessColors[0]=chessWhite;
chessColors[1]=chessBlue;
chessColors[2]=chessRed;
chessColors[3]=chessCyn;
chessColors[4]=chessBlack;
chessColors[5]=chessYellow;


//棋盘矩阵MB，允许落子为1，否则为0
var MB=[];
//棋子矩阵MC，没有棋子为null，有棋子为对应的棋子对象
var MC=[];
//标识矩阵模板MF，走过为1，否则为0。每个棋子都
var MF=[];
//结果矩阵MR，记录到目标区域的结果
var MR=[];




/**棋子的初始位置
 * 初始区域defaultZone[t][n]
 * t是区域标识,n是拥有的点的个数
    n=10
    值为初始坐标
 */
var defaultZone=[];
var hasChessZone=[0,1,1,0,1,1];

var pickedChess;

var timer;

var battle=false;

//缓存的画布
var imgData;

var selectedColor=null;

const MAX_SCORE=1000;

var longestRoute=false;

var stepCount=[];