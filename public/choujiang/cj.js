var xinm = new Array();
var phone = new Array();

persons.forEach(function(item){
	xinm.push(item['name']);
	phone.push(item['phone']);
});

var nametxt = $('.name');
var phonetxt = $('.phone');
var pcount = xinm.length;//参加人数
var runing = true;  
var num = 0; //随机数存储
var to = 0;//从0开始
var numr = 10;//每次抽取幸运奖人数
var t = 0;//循环调用
var lucknum = 0;
var luckyCount = 10;

var pdnum = pcount;//参加人数判断是否抽取完

//连接websocket后端服务器
var socket = io.connect('ws://www.henglau.cn');

socket.on('start', function(){
	runing = true;
	start();
});

socket.on('stop', function(){
	runing = false;
	start();
});

socket.on('qr', function(){
	qr();
});

socket.on('qx', function(){
	qx();
});

//大奖开始停止
function start() {
	var zjnum = $('.list').find('p');
	if(zjnum.length == luckyCount){
		alert('已抽出全部奖项');
	}else{
		if (runing) {
			runing = false;
			$('#btntxt').removeClass('start').addClass('stop');
			$('#btntxt').html('停止');
			startNum();
		} else {
			runing = true;
			$('#btntxt').removeClass('stop').addClass('start');
			$('#btntxt').html('抽奖');
			stop();
	        bzd();//中奖函数
	        $('#btnqx').css('display','block');
	        $('.lucknum').css('display','none');
	    }
	}
}

//循环参加名单
function startNum() {
	clearInterval(t);
	pcount = xinm.length;
	num = Math.floor(Math.random() * pcount);
	nametxt.html(xinm[num]);
	phonetxt.html(phone[num]);
	t = setTimeout(startNum, 0);
}
//停止跳动
function stop() {
	clearInterval(t);
	t = 0;
	return pcount;
}
//打印中奖名单
function bzd() {
	pcount = xinm.length;
	//获取中奖人数
	var zjnum = $('.list').find('p').length;
	//打印中奖者名单
	$('.conbox').prepend("<p style='width:80%;font-size:38px;padding:5px 30px 60px;text-align: center;color:#FF2525;'><span class='jlevel'>"+getJlevel(zjnum)+"等奖</span>"+xinm[num]+"   "+phone[num]+"</p>");
	$('.confirmbox').show();
	socket.emit('select', {user: xinm[num],phone: phone[num]});
	
	return pcount;
}
function getJlevel(num) {
	if(num >= 9){
		return '一';
	}else if(num >= 7){
		return '二';
	}else if(num >= 4){
		return '三';
	}else {
		return '四';
	}
}
//确认中奖
function qr(){
	//将已中奖者从数组中"删除",防止二次中奖
	xinm.splice($.inArray(xinm[num], xinm), 1);
	phone.splice($.inArray(phone[num], phone), 1);
	var cp = $('.conbox').find('p').removeAttr('style').clone();
	$('.zjmd_bt_xy').find('p').eq(0).css({'border-top':'1px solid #FF2525'});
	$('.zjmd_bt_xy').prepend(cp);
	$('.conbox').empty();
	$('.confirmbox').hide();
	//中奖名单排序
	// $('.list').find('p').each(function(i){
	// 	$(this).find('span').remove();
	// });
}

//取消中奖
function qx(){
	$('.conbox').empty();
	$('.confirmbox').hide();
}














