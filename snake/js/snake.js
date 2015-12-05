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
	var fruitPos = [];//记录当前果实位置
	var dir;//记录方向
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
			for (i = 0;i < snakeBodyPos.length;i++){
				if (x === snakeBodyPos[i][0] && y === snakeBodyPos[i][1]){
					return true
				}
			}
		},
		//随机生成果实
		createFruit : function(){

		},
		//吃果实判定
		eatFruit : function(x,y){
			if (x === fruitPos[0] && y === fruitPos[1]){
				return true
			}
		},
		//改变方向
		changeDir : function(direction){
			dir = direction
		}
	}


}())
main.printScore();
main.printHscore();
$(".reload").click(main.reload);
$(".music").click(main.music);