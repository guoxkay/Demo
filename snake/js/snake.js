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
	return {
		//得到分数
		getScore : function(){
			return score
		},
	}


}())
main.printScore();
main.printHscore();
$(".reload").click(main.reload);
$(".music").click(main.music);