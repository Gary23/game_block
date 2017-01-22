/**
 * Created by ypj on 2017/1/22.
 */
// 初始化变量
var box = document.getElementById('box');
var canvas = document.getElementById('canvas');
var score = document.getElementById('score');
var start = box.getElementsByTagName('button')[0];
var end = box.getElementsByTagName('button')[1];

// 创建画布
var gc = canvas.getContext('2d');

// 初始化游戏
var Russia = new Russia({
    gc:gc,
    width:canvas.width,
    height:canvas.height,
    SquareX:40,
    SquareY:20,
    bgColor:'#272822',
    scoreID:score,
    line:1
})

// 点击开始按钮开始游戏
start.onclick = function(){
    Russia.play();
}

// 点击结束按钮结束游戏
end.onclick = function(){
    Russia.gameOver();
}
