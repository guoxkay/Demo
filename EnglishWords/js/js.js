var inWords = function(words,word){
	for(var i = 0;i < words.length;i++){
		if (words[i].w === word){
			words[i].n += 1;
			return
		}
	}
	words.push({
		w : word,
		n : 1
	})
}

var statistic = function(article,words){
	var word = '';
	for (var i = 0;i < article.length+1;i++){
		if (article[i] === undefined){
			if (word !== ''){
				word.toLowerCase();
				inWords(words,word);
				word = '';
			}
			break
		}
		if (article[i].match(/[a-zA-Z]/)){
			word += article[i]
		}
		else if (article[i] === '-'){
			continue
		}
		else {
			if (article[i-1] === undefined){
				continue
			}
			if (article[i-1].match(/[a-zA-Z]/)){
				word.toLowerCase();
				inWords(words,word);
				word = ''
			}
			continue
		}
	}
}

var sortWords = function(words){
	var temp;
	var r = true;
	while(r){
		r = false;
		for (var i = 0;i < words.length-1;i++){
			if (words[i].n < words[i+1].n){
				temp = words[i];
				words[i] = words[i+1];
				words[i+1] = temp;
				r = true
			}
		}
	}
}

var displyWords = function(words){
	var wordsPanel = $('#words');
	if (words.length === 0){
		wordsPanel.css('display','none')
		$('#inputAlert').css('display','block');
		return
	}
	while(wordsPanel.children().length > 1){
		wordsPanel.children().last().remove()
	}
	$('#inputAlert').css('display','none');
	wordsPanel.css('display','block')
	for (var i = 0;i < words.length;i++){
		wordsPanel.append('<tr>');
		for (var k = 0;k < 3 && i < words.length;k++,i++){
			wordsPanel.children().last().append('<td>');
			wordsPanel.children().last().children().last().text(words[i].w);
			wordsPanel.children().last().append('<td>');
			wordsPanel.children().last().children().last().text(words[i].n)
		}
	}
}

function aa(article,words){
	statistic(article,words);
	sortWords(words);
	displyWords(words)
}

$('#aa').click(function(){
	var article = $('#article').val();
	var words = [];
	aa(article,words)
})

$('#article').focusin(function(){
	var article = $('#article').val();
	if (article === '请将文章输入此处'){
		$('#article').val('')
	}
})