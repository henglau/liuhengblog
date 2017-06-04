var _hmt = _hmt || [];
(function() {
	// 百度统计代码
	var hm = document.createElement("script");
	hm.src = "https://hm.baidu.com/hm.js?96b0a147acd182a1ef4dbfed495bc698";
	var s = document.getElementsByTagName("script")[0]; 
	s.parentNode.insertBefore(hm, s);
	// 网站代码
	var $nav = $('nav');
	$('#navBtn').on('click', function(e){
		e.preventDefault();
		$nav.toggle();
	});
	$('img.lazy').lazyload({
		placeholder : '/imgs/loading.gif',
		effect: 'fadeIn',
		threshold :100
	});
})();