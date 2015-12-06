var main=(function(){
	var l = localStorage;
	var score = 0;
	var hscore = l.getItem("hscore") || 0;
	var isBegin = false;
	return {
		//同步分数
		setScore : function(){
			score = snake.getScore();
		},
		//显示分数
		printScore : function(){
			$(".score>span:first-child>span").text(score);
		},
		//显示最高分
		printHscore : function(){
			$(".score>span:last-child>span").text(hscore);
		},
		//刷新页面
		reload : function(){
			location.reload();
		},
		//开关音乐
		music : function(){
			var mus = document.getElementsByTagName("audio")[0];
			if (mus.paused){
				mus.play();
				$("#nomusic").css("display","none");
				$("#music").css("display","block");
			}
			else {
				mus.pause();
				$("#music").css("display","none");
				$("#nomusic").css("display","block");
			}
		}
	}
}())
var snake = (function(){
	var score;
	var canvas = document.getElementById("snake");
	var ctx = canvas.getContext("2d");
	var cell = 15;//蛇头和蛇身宽度，以52*30定位
	var snakeBodyPos = [];//记录蛇身位置
	var snakeHeadPos = [];//记录蛇头位置
	var snakePos = [];
	var fruitPos = [];//记录当前果实位置
	var dir;//记录方向
	var speed = 1;//速度
	return {
		//得到分数
		getScore : function(){
			return score
		},
		//绘制蛇头
		snakeHead : function(x,y){
			ctx.fillRect(x*cell,y*cell,15,15);
			ctx.clearRect(x*cell+6,y*cell+6,3,3)
		},
		// 绘制蛇身
		snakeBody : function(x,y){
			ctx.fillRect(x*cell+1,y*cell+1,13,13)
		},
		//死亡判定
		isDead : function(x,y){
			if ((x < 0 || y < 0) || (x > 51) || (y > 29)){
				return true
			}
			for (var i = 0;i < snakeBodyPos.length;i++){
				if (x === snakeBodyPos[i][0] && y === snakeBodyPos[i][1]){
					return true
				}
			}
		},
		//绘制果实
		fruit : function(x,y){
			ctx.beginPath();
			ctx.arc(x*cell+7,y*cell+7,7,0,Math.PI*2);
			ctx.fill()
		},
		//随机生成果实
		createFruit : function(){
			if (fruitPos[0] === undefined && fruitPos[1] === undefined){
				var x = Math.floor(Math.random()*52);
				var y = Math.floor(Math.random()*30);
				for (var i = 0;i < snakePos.length;i++){
					if (x === snakePos[i][0] && y === snakePos[i][1]){
						snake.createFruit();
						return
					}
				}
				snake.fruit(x,y);
				fruitPos.push(x);
				fruitPos.push(y)
			}
		},
		//吃果实判定
		eatFruit : function(x,y){
			if (x === fruitPos[0] && y === fruitPos[1]){
				snake.clearSnake(fruitPos[0],fruitPos[1]);
				fruitPos = [];
				score += speed;
				return true
			}
		},
		//改变方向
		changeDir : function(direction){
			dir = direction
		},
		//绘制初始蛇
		beginSnake : function(x,y,len){
			snake.snakeHead(x,y);
			snakeHeadPos = [x,y];
			for (var i = 1;i < len;i++){
				snake.snakeBody(x-i,y);
				snakeBodyPos.push([x-i,y])
			}
			dir = "right";
			for (var i = 0;i < snakeBodyPos.length;i++){
				snakePos[i] = snakeBodyPos[i]
			}
			snakePos.unshift(snakeHeadPos);
		},
		//擦除
		clearSnake : function(x,y){
			ctx.clearRect(x*cell,y*cell,cell,cell)
		},
		getSnake : function(aaa){
			if (aaa === "snake"){
				return snakePos
			}
			if (aaa === "body"){
				return snakeBodyPos
			}
			if (aaa === "head"){
				return snakeHeadPos
			}
		},
		//移动
		move : function(){
			var x = snakeHeadPos[0];
			var y = snakeHeadPos[1];
			var a = snakeBodyPos[snakeBodyPos.length-1][0];
			var b = snakeBodyPos[snakeBodyPos.length-1][1];
			switch (dir){
				case "up" : {
					if (snake.isDead(x,y-1)){
						return
					}
					if (!snake.eatFruit(x,y-1)){
						snake.clearSnake(a,b);
						snakeBodyPos.pop();
						snakePos.pop();
					}
					snake.clearSnake(x,y);
					snake.snakeBody(x,y);
					snake.snakeHead(x,y-1);
					snakeHeadPos = [x,y-1];
					break
				}
				case "down" : {
					if (snake.isDead(x,y+1)){
						return
					}
					if (!snake.eatFruit(x,y+1)){
						snake.clearSnake(a,b);
						snakeBodyPos.pop();
						snakePos.pop();
					}
					snake.clearSnake(x,y);
					snake.snakeBody(x,y);
					snake.snakeHead(x,y+1);
					snakeHeadPos = [x,y+1];
					break
				}
				case "left" : {
					if (snake.isDead(x-1,y)){
						return
					}
					if (!snake.eatFruit(x-1,y)){
						snake.clearSnake(a,b);
						snakeBodyPos.pop();
						snakePos.pop();
					}
					snake.clearSnake(x,y);
					snake.snakeBody(x,y);
					snake.snakeHead(x-1,y);
					snakeHeadPos = [x-1,y];
					break
				}
				case "right" : {
					if (snake.isDead(x+1,y)){
						return
					}
					if (!snake.eatFruit(x+1,y)){
						snake.clearSnake(a,b);
						snakeBodyPos.pop();
						snakePos.pop();
					}
					snake.clearSnake(x,y);
					snake.snakeBody(x,y);
					snake.snakeHead(x+1,y);
					snakeHeadPos = [x+1,y];
					break
				}
			}
			snakeBodyPos.unshift([x,y]);
			snakePos.unshift(snakeHeadPos);
		}
	}


}())
main.printScore();
main.printHscore();
$(".reload").click(main.reload);
$(".music").click(main.music);