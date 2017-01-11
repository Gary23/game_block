/**
 * Created by ypj on 2017/1/11.
 */

function Russia(obj) {
    if (!obj) {
        return false;
    }
    this.gc = obj.gc;
    this.width = obj.width;
    this.height = obj.height;
    this.scoreID = obj.scoreID;
    this.bgColor = obj.bgColor || '#272822';
    //this.fgColor = obj.fgColor || 'white';
    this.line = obj.line || 0;
    this.SquareX = obj.SquareX || 40;
    this.SquareY = obj.SquareY || 20;
    this.point = 0;
    this.speed = 400;

    // 鲁玫脢录禄炉
    this.arr = [ // 路陆驴茅脣霉脫脨碌脛脨脦脳麓
        [[1, 1, 1, 1]],
        [[2, 2], [2, 2]],
        [[3, 3, 0], [0, 3, 3]],
        [[0, 4, 4], [4, 4, 0]],
        [[0, 5, 0], [5, 5, 5]],
        [[6, 0, 0], [6, 6, 6]],
        [[0, 0, 7], [7, 7, 7]]
    ];
    this.x = this.SquareY / 2 - 2;
    this.y = 0;
    this.timer = null;
    this.flag = false;
    this.arrNew = [];
    for (var i = 0; i < this.SquareY; i++) {
        this.arrNew.push(0);
    }
    ;
    //this.matrix = this.mold();
    this.matrix = null;
    this.data = this.map(this.SquareX, this.SquareY);

    this.render(this.data, this.gc, this.bgColor);

}


Russia.prototype = {
    constructor: Russia,


    // 确定一个随机的方块
    mold: function () {
        var num = Math.floor(Math.random() * 7);
        return this.arr[num];
    },


    // 游戏地图尺寸函数,参数行r和列c
    map: function (SquareX, SquareY) {
        var data = [];
        // 创建二维数组
        // 数组中0代表地图上的方块,1代表移动的那些方块。
        for (var i = 0; i < SquareX; i++) {
            data.push([]);
            for (var j = 0; j < SquareY; j++) {
                data[i].push(0);
            }
        }
        return data;
    },

    // 地图绘制方格
    render: function (data, gc, bgColor) {
        var l = this.line
        var w = this.width / this.SquareY - l;  // 每个方格的宽和高,间隔10
        var h = this.height / this.SquareX - l;

        var rLen = data.length;
        var cLen = data[0].length;
        for (var i = 0; i < rLen; i++) {
            for (var j = 0; j < cLen; j++) {
                // 创建方块
                switch (data[i][j]) {
                    case 0:
                        gc.fillStyle = bgColor;
                        break;
                    case 1:
                        gc.fillStyle = '#f72671';
                        break;
                    case 2:
                        gc.fillStyle = '#51d8ee';
                        break;
                    case 3:
                        gc.fillStyle = '#a5e128';
                        break;
                    case 4:
                        gc.fillStyle = '#ffe792';
                        break;
                    case 5:
                        gc.fillStyle = '#AfAfAf';
                        break;
                    case 6:
                        gc.fillStyle = '#bf9bf8';
                        break;
                    case 7:
                        gc.fillStyle = '#6bc989';
                        break;
                }
                //gc.fillStyle = data[i][j] == 0 ? bgColor : fgColor;
                gc.fillRect(j * (w + l) + l, i * (h + l) + l, w, h)
            }
        }
    },

    // 在实际地图中生成随机的形状
    // 传入mold方法更改的arr的形状,然后赋值给data数组,最后调用render方法重新绘制地图
    create: function (arr) {
        if(arr == null){
            return;
        }
        var x = this.x;
        var y = this.y;
        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < arr[i].length; j++) {
                if (!this.data[i + y][j + x]) {    // 如果这个位置是0就将新方块的数组赋值,是1就不赋值,因为肯定已经有方块了,继续保持已有数组的值
                    this.data[i + y][j + x] = arr[i][j];
                }
            }
        }
        this.render(this.data, this.gc, this.bgColor);
    },

    // 数组翻转
    rotate: function () {
        var arr = [];
        var x = this.matrix[0].length;   // 3
        var y = this.matrix.length;  // 2
        //把arr变成二维数组
        for (var i = 0; i < x; i++) {
            arr.push([]);   // 把matrix的x变为y,实现反转90度的效果,假设matrix是2行3列,现在arr就需要3行2列,所以x和y是颠倒的
        }
        for (var i = 0; i < y; i++) {   // 确定了旋转后的行数,要写入每行中列的数值
            for (var j = 0; j < x; j++) {
                // y是取得length值,转为索引就要-1
                arr[j][y - i - 1] = this.matrix[i][j];  // 公式: arr[0][1] = matrix[0][0];  arr[0][0] = matrix[1][0]
            }                                           //      arr[1][1] = matrix[0][1];  arr[1][0] = matrix[1][1]
        }                                               //      arr[2][1] = matrix[0][2];  arr[2][0] = matrix[1][2]

        // 变形时碰到下边界就不让变形了
        if (this.collideTest(arr)) {
            return;
        }
        // 检测变形的时候是否碰到了右边边界
        // 如果碰到了就弹回出界的部分.
        if (this.collideTestLR(1, arr)) {
            this.x -= Math.abs(this.data[0].length - this.x - arr[0].length);
            this.create(arr);
        }
        this.matrix = arr;
    },

    // 清除落下的痕迹。
    // 实际使用中,也就是将matrix中所有为1的位置清除为0。接下来再写一个create方法就会在新的位置上重新绘制一个。看起来就像是下落了
    clearPrev: function (arr) {
        if(arr == null){
            return;
        }
        var x = this.x;
        var y = this.y;
        for (var i = 0; i < arr.length; i++) {      // 一次遍历matrix的所有位置看看哪些需要删除
            for (var j = 0; j < arr[i].length; j++) {
                if (arr[i][j]) {     // 如果matrix是1才清除下落痕迹,0的话没有必要做重复赋值0的操作。
                    this.data[i + y][j + x] = 0;
                }
            }
        }
        this.render(this.data, this.gc, this.bgColor);
    },

    // 检测碰撞,如果碰撞了就返回true;
    // 分两种情况,1是碰撞边界,2是碰撞别的方块
    collideTest: function (matrix1) {
        var x = this.x;
        var y = this.y;
        var len = matrix1.length
        // 判断方块是否到了底部,到了底部就重新随机生成一个新方块
        if (y + len - 1 >= this.data.length - 1) {   // y是移动过去的行数,len是方块占的行数,加起来如果>=总行数就是到底了,因为得到索引所以length-1,
            return true;
        }
        // 判断是否碰撞别的方块
        var arr = matrix1[len - 1];      // 判断的列数
        var n;     // 判断的行数
        for (var i = 0; i < arr.length; i++) {   // 现在i=0,也就是第一列。等下面把第1列判断完了之后,i=1,开始判断第2列。
            n = len - 1;
            while (!matrix1[n][i]) {   // 判断matrix在n的行数的第一列是不是1,如果是1就判断不是1就继续找上一行。
                n--;
            }
            if (this.data[y + 1 + n][i + x]) {   // 到这里matrix的这个位置肯定就是1了。也就是方块占得位置。判断matrix这个位置的下面是不是1,是1就说明碰撞了返回true。
                return true;        // y是matrix的最上面一行的位置,+n也就是matrix的行数 + 1 也就是matrix为1的位置的下一行。
            }
        }

        /*
         // 判断方块下方有没有别的方块要检测的是最后一行,而方块有的2行有的1行,所以就根据matrix数组的长度确定行数
         for (var i = len - 1; i < len; i++) {
         for (var j = 0; j < matrix[i].length; j++) {
         // 判断这个方块的下一格是不是1,是1说明已经有方块了。空白的都是0
         // 如果matrix[i][j]是0的话就不参与判断,因为0是空白不是方块。
         if (matrix[i][j] && data[i + y + 1][j + x] == 1) {
         return true;
         }
         }
         }
         */
        return false;
    },

    // 检测左右碰撞
    // 左右移动过程中,碰撞边缘或者别的方块就返回true;
    collideTestLR: function (n, matrix1) {   // n=-1就是向左,n=1就是向右
        var x = this.x;
        var y = this.y;
        var maxX = this.data[0].length - matrix1[0].length;   // 整个地图的长度 - 方块的长度
        // 碰到左右边界的判断
        if (x + n < 0 || x + n > maxX) {
            //console.log('碰到边界了')
            return true;
        }

        if (n < 0) {      // n<0是从右向左
            for (var i = 0; i < matrix1.length; i++) {
                var index = 0;
                while (!matrix1[i][index]) {
                    index++;
                }
                if (!this.data[i + y] || this.data[i + y][x + index - 1]) {
                    return true;
                }
            }
        } else {      // 从右向左
            for (var i = 0; i < matrix1.length; i++) {
                var index = matrix1[0].length;
                while (!matrix1[i][index]) {
                    index--;
                }
                if (!this.data[i + y] || this.data[i + y][x + index + 1]) {
                    return true;
                }
            }
        }
    },


    score: function (s) {
        this.scoreID.innerHTML = s;
        if (s > 500) {
            this.speed = 350;
        }
        if (s > 1500) {
            this.speed = 300;
        }
        if (s > 3000) {
            this.speed = 200;
        }
        if (s > 5000) {
            this.speed = 150;
        }
        if (s > 7000) {
            this.speed = 100;
        }
        if (s > 10000) {
            this.speed = 50;
        }

    },

    // 满一行清除
    clearLine: function () {
        var y = this.data.length;
        var x = this.data[0].length;
        var flag;
        for (var i = 0; i < y; i++) {
            flag = true;
            for (var j = 0; j < x; j++) {   // 这次循环得出哪行是满的,从第一行的第一列开始判断
                if (!this.data[i][j]) {      // 判断如果有哪个位置有0存在就不能消除整行
                    flag = false;
                }
            }
            if (flag) {     // 如果这一行一个0都没有那就是可以消除整行了
                this.data.splice(i, 1);
                this.data.unshift([].concat(this.arrNew));
                this.point += 100;
            }
        }
        this.score(this.point);
    },


    // 方块下落
    fall: function () {
        if (this.collideTest(this.matrix)) {
            this.clearLine()
            this.y = 0;      // 新方块位置的初始化
            this.x = this.SquareY / 2 - 2;
            this.matrix = this.mold();
        }
        if (this.y <= 1 && this.collideTest(this.matrix)) {
            this.gameOver();
        }
        this.clearPrev(this.matrix);
        this.y++;
        this.create(this.matrix);
    },


    // 方块下落的定时器
    auto: function (time) {
        var _this = this;
        //console.log(time);

        _this.timer = setInterval(function () {
            //console.log(this.fall);

            _this.fall();
        }, time)
    },


    // 开始游戏
    play: function () {

        // 游戏初始化
        //this.matrix = this.mold();
        this.matrix = this.mold();
        this.create(this.matrix);
        this.auto(this.speed);
        var _this = this;

            document.onkeydown = function (e) {

                var e = e || window.event;
                // 键盘操作方块


                switch (e.keyCode) {
                    case 37:    //向左
                        //alert(_this)

                        _this.clearPrev(_this.matrix);
//                    if (x <= 0) {
//                        x = 0;
//                    }
                        if (!_this.collideTestLR(-1, _this.matrix)) {
                            _this.x--;
                        }
                        _this.create(_this.matrix);
                        break;
                    case 39:    //向右
                        _this.clearPrev(_this.matrix);
//                    if (x + matrix[0].length >= data[0].length - 1) {
//                        x = data.length - matrix[0].length;
//                    }
                        if (!_this.collideTestLR(1, _this.matrix)) {
                            _this.x++;
                            //console.log(_this.x);
                        }
                        _this.create(_this.matrix);
                        break;
                    case 38:    //方块变形
                        //alert(1);
                        _this.clearPrev(_this.matrix);
                        _this.rotate();
                        _this.create(_this.matrix);
                        break;
                    case 40:    //加速
                        if (_this.flag) return;
                        _this.flag = true;
                        clearInterval(_this.timer);
                        _this.auto(17);
                        break;
                }
            }
            // 松开加速的时候恢复元素
            document.onkeyup = function (e) {
                var e = e || window.event;
                if (e.keyCode == 40) {
                    clearInterval(_this.timer);
                    _this.auto(_this.speed);
                    _this.flag = false;
                }
            }
    },


    gameOver: function () {
        alert('GAME OVER');
        clearInterval(this.timer);
        this.matrix = null;
        this.x = this.SquareY / 2 - 2;
        this.y = 0;
        this.data = this.map(this.SquareX, this.SquareY);
        this.render(this.data, this.gc, this.bgColor);

        document.onkeydown = function (e) {
            var e = e || window.event;
            switch (e.keyCode) {
                case 37:    //向左
                    return;
                    break;
                case 39:    //向右
                    return;
                    break;
                case 38:    //方块变形
                    return;
                    break;
                case 40:    //加速
                    return;
                    break;
            }
        }
        document.onkeyup = function (e) {
            var e = e || window.event;
            if (e.keyCode == 40) {
                return;
            }
        }




    }



}
