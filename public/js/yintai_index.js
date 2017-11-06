$(function(){
	$('#topNav>li').mouseover(function(){
		$(this).children('ul').show();
	}).mouseout(function(event) {
		$(this).children('ul').hide();
	});
})