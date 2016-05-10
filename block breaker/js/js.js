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
				if (this.x >= 5){
					this.x -= 5;
					this.inertia--
				}
				else {
					this.x = 0
				}
				break
			}
			case "right" : {
				if (this.x <= screenWidth-this.length-5){
					this.x += 5;
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
	move : function(){
		if (this.angle <= Math.Pi/4 && this.angle > Math.PI/4 * 7){
			this.x = this.x + speed;
			this.y = Math.tan(this.angle) * this.x
		}
		if else ((this.angle > Math.PI/4 && this.angle <= Math.PI/4 *3) && this.angle !== Math.PI/2){
			this.y = this.y + speed;
			this.x = this.y/Math.tan(this.angle)
		}
		if else ((this.angle > Math.PI/4 * 3 && this.angle <= Math.PI/4 * 5) && this.angle !== Math.PI){
			this.x = this.x - speed;
			this.y = Math.tan(this.angle) * this.x
		}
		if else ((this.angle > Math.PI/4 * 5 && this.angle <= Math.PI/4 * 7) && this.angle !== Math.PI/2 * 3){
			this.y = this.y - speed;
			this.x = this.y/Math.tan(this.angle)
		}
		if else (this.angle === Math.PI/2){
			this.y = this.y + speed
		}
		if else (this.angle === Math.PI/2 * 3){
			this.y = this.y - speed
		}
		if else (this.angle === Math.PI){
			this.x = x - speed
		}
		else {
			console.error("this angle out range")
		}
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
	if else (((y-r >= by && y-r <= by+bh) && (x >= bx && x <= bx+bw)) && y+r >= by+bh){
		return {
			isCol : true,
			dir : "top"
		}
	}
	if else (((x+r >= bx && x+r <= bx+bw) && (y >= by && y <= by+bh)) && x-r <= bx){
		return {
			isCol : true,
			dir : "right"
		}
	}
	if else (((y+r >= by && y+r <= by+bh) && (x >= bx && x <= bx+bw)) && y-r <= by){
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
		return true
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
	if else (y-r <= 0){
		return {
			isCol : true,
			dir : "top"
		}
	}
	if else (x+r >= screenWidth){
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
	if (fun()){
		if (ball.angle >= Math.PI && ball.angle <= Math.PI/2 * 3){
			ball.angle = ball.angle - Math.PI
		}
		else if (ball.angle >= Math.PI/2 * 3 && ball.angle <= Math.PI * 2){
			ball.angle = Math.PI * 2 - ball.angle
		}
		else {
			console.error("wrong angle")
		}
		ball.angle = ball.angle - Math.PI/360 * board.inertia
	}
	else {
		return
	}
}
var ballCrashBlock = function(block,ball,fun){//当球撞上砖块
	var iscol = fun();
	if (isCol.isCol){
		switch (isCol.dir){
			case "left" : {
				if (ball.angle > Math.PI && ball.angle < Math.PI/2 * 3){
					ball.angle = Math.PI * 3 - ball.angle
				}
				else if (ball.angle > Math.PI/2 && ball.angle < Math.PI){
					ball.angle = Math.PI * Math.PI - ball.angle
				}
				else {
					console.error("dir is not left")
				}
			}
			case "right" : {
				if (ball.angle > Math.PI/2 && ball.angle < Math.PI){
					ball.angle = Math.PI * 3 - ball.angle
				}
				else if (ball.angle > 0 && ball.angle < Math.PI/2){
					ball.angle = Math.PI - ball.angle
				}
				else {
					console.error("dir is not right")
				}
			}
			case "top" : {
				if (ball.angle > Math.PI/2 *3 && ball.angle < Math.PI/2){
					ball.angle = Math.PI * 2 - ball.angle
				}
				else {
					console.error("dir is not top")
				}
			}
			case "bottom" : {
				if (ball.angle > Math.PI/2 && ball.angle < Math.PI/2 *3){
					ball.angle = Math.PI * 2 - ball.angle
				}
				else {
					console.error("dir is not bottom")
				}
			}
		}
		//清除砖块
		//删除砖块
		//删除数组砖块
	}
	else {
		return
	}
}
var blockGroup = [];
var ctx = $("#c").getContext('2d');
var drawBall = function(ball){//绘制弹球
	ctx.beginPath();
	ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2);
	ctx.full()
}
var clearBall = function(ball){//清除球
	ctx.clearRect(ball.x-ball.r,ball.y-ball.r,r*2+1,r*2+1)
}
var drawBoard = function(board){//绘制木板
	ctx.fillRect(board.x,board.y,board.length,board.thick)
}
var clearBoard = function(board){//清除木板
	ctx.clearRect(board.x,board.y,board.length,board.thick)
}
var drawBlock = function(block){//绘制砖块
	ctx.fillRect(block.x,block.y,block.w,block.h)
}
var clearBlock = function(block){//清除砖块
	clearRect(block.x,block.y,block.w,block.h)
}