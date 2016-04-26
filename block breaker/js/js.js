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
					this.x -= 5
				}
				else {
					this.x = 0
				}
				break
			}
			case "right" : {
				if (this.x <= screenWidth-this.length-5){
					this.x += 5
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
	this.speed = speed;
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