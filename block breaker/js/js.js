var Board = function(x,y,length,thick){//木板构造函数
	this.x = x;
	this.y = y;
	this.length = length;
	this.thick = thick;
	this.inertia = 0;
}
Board.prototype = {//木板原型
	constructor : Board,
	move : function(dir,screenWidth){//移动函数
		switch (dir){
			case "left" : {
				if (this.x >= 3){
					this.x -= 3;
					this.inertia--
				}
				else {
					this.x = 0
				}
				break
			}
			case "right" : {
				if (this.x <= screenWidth-this.length-3){
					this.x += 3;
					this.inertia++
				}
				else {
					this.x = screenWidth-this.length
				}
				break
			}
			default : {
				return
			}
		}
	},
	stop : function(){
		this.inertia = 0;
	}
}
var Ball = function(x,y,r,speed){//弹球构造函数
	this.x = x;
	this.y = y;
	this.r = r;
	this.angle = Math.PI/4;
	this.speed = speed;//请最快速度每次也不要走超出一个弹球直径的距离
}
Ball.prototype = {//弹球原型
	constructor : Ball,
	move : function(screenHeight){//canvas坐标系不是这样的,所以加入screenHeight
		this.y = screenHeight - this.y;
		if (this.angle >= 0 && this.angle <= Math.PI * 2){
			this.x = this.x + Math.cos(this.angle) * this.speed;
			this.y = this.y + Math.sin(this.angle) * this.speed
		}
		else {
			console.error("this angle out range" + this.angle)
		}
		this.y = screenHeight - this.y;
	}
}
var Block = function(x,y,width,height,HP){
	this.x = x;
	this.y = y;
	this.w = width;
	this.h = height;
	this.HP = HP;
}
Block.prototype = { 
	constructor : Block
}
var isCollisionWithBlock = function(ball,block){//砖块碰撞判定
	var x = ball.x;
	var y = ball.y;
	var r = ball.r;
	var bx = block.x;
	var by = block.y;
	var bh = block.h;
	var bw = block.w;
	if (((x-r >= bx && x-r <= bx+bw) && (y <= by+bh && y >= by)) && x+r >= bx+bw){
		return {
			isCol : true,
			dir : "left"
		}
	}
	else if (((y-r >= by && y-r <= by+bh) && (x >= bx && x <= bx+bw)) && y+r >= by+bh){
		return {
			isCol : true,
			dir : "top"
		}
	}
	else if (((x+r >= bx && x+r <= bx+bw) && (y >= by && y <= by+bh)) && x-r <= bx){
		return {
			isCol : true,
			dir : "right"
		}
	}
	else if (((y+r >= by && y+r <= by+bh) && (x >= bx && x <= bx+bw)) && y-r <= by){
		return {
			isCol : true,
			dir : "bottom"
		}
	}
	else {
		return false
	}
}
var isCollisionWithBorad = function(ball,board){
	if (ball.y+ball.r >= board.y && (ball.x >= board.x && ball.x <= board.x+board.length)){
		return {
			isCol : true,
			dir : "bottom"
		}
	}
	else if ((ball.x+ball.r >= board.x && ball.x-ball.r <= board.x) && (ball.y >= board.y && ball.y <= board.y+board.thick)){
		return {
			isCol : true,
			dir : "left"
		}
	}
	else if ((ball.x-ball.r <= board.x+board.length && ball.x+ball.r > board.x+board.length) && (ball.y >=board.y && ball.y <= board.y+board.thick)){
		return {
			isCol : true,
			dir : "right"
		}
	}
	else {
		return false
	}
}
var isCollisionWithWall = function(ball,screenWidth){
	var x = ball.x;
	var y = ball.y;
	var r = ball.r;
	if (x-r <= 0){
		return {
			isCol : true,
			dir : "left"
		}
	}
	else if (y-r <= 0){
		return {
			isCol : true,
			dir : "top"
		}
	}
	else if (x+r >= screenWidth){
		return {
			isCol : true,
			dir : "right"
		}
	}
	else {
		return false
	}
}
var isDead = function(ball,screenHeight){
	if (ball.y - ball.r >= screenHeight){
		return true
	}
	else {
		return false
	}
}
var ballCrashBoard = function(board,ball,fun){//当木板碰上球
	var isCol = fun(ball,board);
	if (isCol.isCol){
		switch (isCol.dir){
			case "bottom" : {
				if (ball.angle >= Math.PI && ball.angle <= Math.PI * 2){
					ball.angle = Math.PI * 2 - ball.angle
				}
				else {
					console.error("dir is not bottom with board" + ball.angle)
				}
				break
			}
			case "left" : {
				if (ball.angle >= Math.PI/2 * 3 && ball.angle <= Math.PI * 2){
					ball.angle = Math.PI * 3 - ball.angle
				}
				else{
					console.error("dir is not left with board" + ball.angle)
				}
				break
			}
			case "right" : {
				if (ball.angle >= Math.PI && ball.angle <= Math.PI/2 * 3){
					ball.angle = Math.PI * 3 - ball.angle
				}
				else{
					console.error("dir is not right with board" + ball.angle)
				}
				break
			}
		}
		ball.angle - Math.PI/1080 * board.inertia > 0 && ball.angle - Math.PI/1080 * board.inertia < Math.PI ? ball.angle = ball.angle - Math.PI/1080 * board.inertia : ball.angle = ball.angle
		return true
	}
	else {
		return false
	}
}
var ballCrashBlock = function(ball,block,fun){//当球撞上砖块
	var isCol = fun(ball,block);
	if (isCol.isCol){
		switch (isCol.dir){
			case "left" : {
				if (ball.angle > Math.PI && ball.angle < Math.PI/2 * 3){
					ball.angle = Math.PI * 3 - ball.angle
				}
				else if (ball.angle > Math.PI/2 && ball.angle < Math.PI){
					ball.angle = Math.PI - ball.angle
				}
				else {
					console.error("dir is not left" + ball.angle)
				}
				break
			}
			case "right" : {
				if (ball.angle > Math.PI/2 * 3 && ball.angle < Math.PI * 2){
					ball.angle = Math.PI * 3 - ball.angle
				}
				else if (ball.angle > 0 && ball.angle < Math.PI/2){
					ball.angle = Math.PI - ball.angle
				}
				else {
					console.error("dir is not right" + ball.angle)
				}
				break
			}
			case "top" : {
				if (ball.angle > 0 && ball.angle < Math.PI){
					ball.angle = Math.PI * 2 - ball.angle
				}
				else {
					console.error("dir is not top" + ball.angle)
				}
				break
			}
			case "bottom" : {
				if (ball.angle > Math.PI && ball.angle < Math.PI * 2){
					ball.angle = Math.PI * 2 - ball.angle
				}
				else {
					console.error("dir is not bottom" + ball.angle)
				}
				break
			}
		}
		return true
	}
	else {
		return false
	}
}
var ballCrashWall = function(ball,screenWidth,fun){
	var isCol = fun(ball,screenWidth);
	if (isCol.isCol){
		switch (isCol.dir){
			case "left" : {
				if (ball.angle > Math.PI && ball.angle < Math.PI/2 * 3){
					ball.angle = Math.PI * 3 - ball.angle
				}
				else if (ball.angle > Math.PI/2 && ball.angle < Math.PI){
					ball.angle = Math.PI - ball.angle
				}
				else {
					console.error("dir is not left at wall" + ball.angle)
				}
				break
			}
			case "right" : {
				if (ball.angle > Math.PI/2 * 3){
					ball.angle = Math.PI * 3 - ball.angle
				}
				else if (ball.angle < Math.PI/2){
					ball.angle = Math.PI - ball.angle
				}
				else {
					console.error("dir is not right at wall" + ball.angle)
				}
				break
			}
			case "top" : {
				if (ball.angle > 0 && ball.angle < Math.PI){
					ball.angle = Math.PI * 2 - ball.angle
				}
				else {
					console.error("dir is not top at wall" + ball.angle)
				}
				break
			}
		}
	}
	else {
		return
	}
}
var ctx = document.getElementById("c").getContext('2d');
var drawBall = function(ball){//绘制弹球
	ctx.beginPath();
	ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2);
	ctx.fill()
}
var clearBall = function(ball){//清除球
	ctx.clearRect(ball.x-ball.r-1,ball.y-ball.r-1,ball.r*2+3,ball.r*2+3)
}
var drawBoard = function(board){//绘制木板
	ctx.fillRect(board.x,board.y,board.length,board.thick)
}
var clearBoard = function(board){//清除木板
	ctx.clearRect(board.x,board.y,board.length,board.thick)
}
var drawBlock = function(block){//绘制砖块
	ctx.fillRect(block.x,block.y,block.w,block.h)
	ctx.clearRect(block.x+5,block.y+5,block.w-10,block.h-10)
}
var clearBlock = function(block){//清除砖块
	ctx.clearRect(block.x,block.y,block.w,block.h)
}
var gameOver = function(){
	ctx.fillStyle = "#b3b3b3";
	ctx.font = "70px 黑体";
	ctx.fillText("game over",170,330);
}
var blockBreaker = (function(){
	var score = 0;
	document.getElementById("score").textContent = score;
	var screenWidth = 630;
	var screenHeight = 630;
	var board = new Board(265,620,100,10);
	drawBoard(board);
	var ball = new Ball(315,614,5,5);
	drawBall(ball);
	var blockGroup = [];
	var mainNum;
	var boardMoveStaut;
	var mainTime = {
		max : 0,
		min : 99999
	}
	var k = 0;
	for (var i = 1;i <= 9;i++){
		for (var j = 1;j <= 9;j++){
			blockGroup[k] = new Block((i-1)*70,(j-1)*30,70,30,1);
			drawBlock(blockGroup[k]);
			k++
		}
	}
	return {
		getBall : function(){
			console.log(ball)
		},
		getBoard : function(){
			console.log(board)
		},
		getBlock : function(){
			console.log(blockGroup)
		},
		main : function(){
			var aTime,bTime,cTime;
			aTime = Date.now();
			clearBall(ball);
			if (isDead(ball,screenHeight)){
				blockBreaker.dead();
				return
			}
			ballCrashBoard(board,ball,isCollisionWithBorad)
			ballCrashWall(ball,screenWidth,isCollisionWithWall);
			for (var i = 0;i < blockGroup.length;i++){
				if (ballCrashBlock(ball,blockGroup[i],isCollisionWithBlock)){
					clearBlock(blockGroup[i]);
					blockGroup[i] = null;
					blockGroup.splice(i,1);
					score++;
					document.getElementById("score").textContent = score
				}
			}
			if (boardMoveStaut === "left"){
				blockBreaker.boardMove("left")
			}
			if (boardMoveStaut === "right"){
				blockBreaker.boardMove("right")
			}
			blockGroup.forEach(drawBlock);
			ball.move(screenHeight);
			drawBoard(board);
			drawBall(ball);
			bTime = Date.now();
			cTime = bTime - aTime;
			if (cTime > mainTime.max){
				mainTime.max = cTime
			}
			if (cTime < mainTime.min){
				mainTime.min = cTime
			}
		},
		getMainTime : function(){
			console.log(mainTime)
		},
		addMove : function(){
			switch (event.which){
				case 37 : {
					boardMoveStaut = "left";
					break
				}
				case 39 : {
					boardMoveStaut = "right";
					break
				}
				default : {
					return
				}
			}
		},
		begin : function(dir){
			body.removeEventListener('keydown',add);
			body.addEventListener('keydown',blockBreaker.addMove);
			body.addEventListener('keyup',blockBreaker.boardMoveStop);
			if (dir === "left"){
				ball.angle = Math.PI/4 * 3;
				boardMoveStaut = "left";
			}
			else {
				boardMoveStaut = "right";
			}
			mainNum = setInterval(blockBreaker.main,17);
		},
		dead : function(){
			clearInterval(mainNum);
			gameOver();
			body.removeEventListener('keydown',blockBreaker.addMove);
			body.removeEventListener('keydown',blockBreaker.boardMoveStop)
		},
		boardMove : function(dir){
			clearBoard(board);
			board.move(dir,screenWidth);
			drawBoard(board);
		},
		boardMoveStop : function(){
			if (event.which === 37){
				board.stop();
				if (boardMoveStaut === "left"){
					boardMoveStaut = undefined;
				}
			}
			else if (event.which === 39){
				board.stop();
				if (boardMoveStaut === "right"){
					boardMoveStaut = undefined;
				}
			}
			else {
				return
			}
		}
	}
}());
var body = document.getElementsByTagName("body")[0];
var add = function(){
	switch (event.which){
		case 37 : {
			blockBreaker.begin("left")
			break
		}
		case 39 : {
			blockBreaker.begin("right")
			break
		}
		default : {
			return
		}
	}
}
body.addEventListener('keydown',add)