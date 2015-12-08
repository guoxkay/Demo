var main=(function(){
	var l = localStorage;
	var score = 0;
	var hscore = l.getItem("hscore") || 0;
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
		//同步最高分
		setHscore : function(){
			if (score > hscore){
				hscore = score;
				l.setItem("hscore",hscore);
				main.printHscore()
			}
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
	var l = localStorage;
	var score = 0;
	var canvas = document.getElementById("snake");
	var ctx = canvas.getContext("2d");
	var peng = new Image();
	peng.src = "image/peng.png";
	var cell = 15;//蛇头和蛇身宽度，以52*30定位
	var snakeBodyPos = [];//记录蛇身位置
	var snakeHeadPos = [];//记录蛇头位置
	var snakePos = [];
	var fruitPos = [];//记录当前果实位置
	var dir;//记录方向
	var speed = l.getItem("speed") || 6;//速度
	var isPause = true;
	var m;//移动定时
	return {
		//得到分数
		getScore : function(){
			return score
		},
		//设置速度
		setSpeed : function(){
			$(".speed span").text(speed)
		},
		//减速
		reduceSpeed : function(){
			if (speed > 1){
				speed = +speed - 1;
				snake.moving();
				snake.moving();
				l.setItem("speed",speed);
				snake.setSpeed()
			}
		},
		//加速
		addSpeed : function(){
			if (speed < 9){
				speed = +speed + 1;
				snake.moving();
				snake.moving();
				l.setItem("speed",speed);
				snake.setSpeed()
			}
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
		//碰撞&&死亡
		pengpeng : function(x,y){
			switch (dir){
				case "up" : {
					ctx.drawImage(peng,(x-1)*15,y*15);
					break
				}
				case "down" : {
					ctx.drawImage(peng,(x-1)*15,(y-2)*15);
					break
				}
				case "left" : {
					ctx.drawImage(peng,x*15,y*15-7);
					break
				}
				case "right" : {
					ctx.drawImage(peng,(x-2)*15,y*15-7);
					break
				}
			}
			$(".pane>div:last-child").css("display","block");
			$(".died").css("display","block");
			$("body").unbind("keydown");
			$(".pause").unbind("click");
			$("body").keydown(function(event){
				if (event.which === 32){
					main.reload()
				}
			})
		},
		//死亡判定
		isDead : function(x,y){
			if ((x < 0 || y < 0) || (x > 51) || (y > 29)){
				snake.pengpeng(x,y);
				return true
			}
			for (var i = 0;i < snakeBodyPos.length;i++){
				if (x === snakeBodyPos[i][0] && y === snakeBodyPos[i][1]){
					snake.pengpeng(x,y)
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
				fruitPos = [x,y]
			}
		},
		//吃果实判定
		eatFruit : function(x,y){
			if (x === fruitPos[0] && y === fruitPos[1]){
				snake.clearSnake(fruitPos[0],fruitPos[1]);
				fruitPos = [];
				score = score + +speed;
				main.setScore();
				main.printScore();
				main.setHscore();
				snake.createFruit();
				return true
			}
		},
		//改变方向
		changeDir : function(direction){
			if ((dir === "up" && direction === "down") || (dir === "down" && direction === "up") || (dir === "left" && direction === "right") || (dir === "right") && direction === "left"){
				return
			}
			dir = direction;
			$("body").unbind("keydown");
			setTimeout(function(){
				$("body").keydown(function(event){
					switch (event.which){
						case 32 : {
							snake.moving(true);
							break
						}
						case 38 : {
							snake.changeDir("up");
							break
						}
						case 40 : {
							snake.changeDir("down");
							break
						}
						case 37 : {
							snake.changeDir("left");
							break
						}
						case 39 : {
							snake.changeDir("right");
							break
						}
					}
				})
			},1/speed*300);
			snake.moving();
			snake.moving();
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
		},
		//游戏进行时
		moving : function(a){
			if (isPause){
				m = setInterval(snake.move,1/speed*300);
				if (a){
					$(".begin").css("display","none");
					$("#begin").css("display","none");
					$("#pause").css("display","inline-block");
				}
				isPause = false
			}
			else {
				clearInterval(m);
				if (a){
					$(".begin").css("display","block");
					$("#begin").css("display","inline-block");
					$("#pause").css("display","none");
				}
				isPause = true
			}
		}
	}
}())
main.printScore();
main.printHscore();
snake.setSpeed();
snake.beginSnake(5,15,6);
snake.createFruit();
$("body").keydown(function(event){
	switch (event.which){
		case 32 : {
			snake.moving(true);
			break
		}
		case 38 : {
			snake.changeDir("up");
			break
		}
		case 40 : {
			snake.changeDir("down");
			break
		}
		case 37 : {
			snake.changeDir("left");
			break
		}
		case 39 : {
			snake.changeDir("right");
			break
		}
	}
})
$(".begin").click(snake.moving);
$(".speed>div:first-child").click(snake.reduceSpeed);
$(".speed>div:last-child").click(snake.addSpeed);
$(".reload").click(main.reload);
$(".music").click(main.music);
$(".pause").click(snake.moving)