var xinm = new Array();
var phone = new Array();
var jpersons = new Array();

persons.forEach(function(item){
	if(item['jlevel']>0){
		jpersons.push({jlevel: item['jlevel'], name:item['name'], phone: item['phone']});
	}else{
		xinm.push(item['name']);
		phone.push(item['phone']);
	}
});
appendList(jpersons);

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
var zjnum = jpersons.length;
var pdnum = pcount;//参加人数判断是否抽取完

var jinfo = null,
	nextinfo = null;

//连接websocket后端服务器
var socket = io.connect('ws://www.henglau.cn');

socket.on('start', function(){
	runing = true;
	start();
});

socket.on('stop', function(data){
	jinfo = data.jinfo;
	nextinfo = data.jinfo;
	runing = false;
	start();

});

socket.on('qr', function(data){
	qr(JSON.parse(data.jpersons));
});

socket.on('qx', function(){
	qx();
});

socket.on('clear', function(){
	location.reload();
});


//大奖开始停止
function start() {
	if(zjnum == luckyCount){
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
	//打印中奖者名单
	$('.conbox').prepend("<p style='width:80%;font-size:38px;padding:5px 30px 60px;text-align: center;color:#FF2525;'><span class='jlevel'>"+jinfo['jlevel']+"等奖</span>"+jinfo['name']+"   "+jinfo['phone']+"</p>");
	$('.confirmbox').show();
	nametxt.html(nextinfo.name);
	phonetxt.html(nextinfo.phone);
	
	return pcount;
}
//确认中奖
function qr(jpersons){
	//将已中奖者从数组中"删除",防止二次中奖
	xinm.splice($.inArray(jinfo['name'], xinm), 1);
	phone.splice($.inArray(jinfo['phone'], phone), 1);
	// var cp = $('.conbox').find('p').removeAttr('style').clone();
	// $('.zjmd_bt_xy').find('p').eq(0).css({'border-top':'1px solid #FF2525'});
	// $('.zjmd_bt_xy').prepend(cp);
	appendList(jpersons);
	zjnum = jpersons.length;
	$('.conbox').empty();
	$('.confirmbox').hide();
	//中奖名单排序
	// $('.list').find('p').each(function(i){
	// 	$(this).find('span').remove();
	// });
}
function appendList(arr){
	var jname = ['一等奖','二等奖','三等奖','四等奖'];
	$('.zjmd_bt_xy').html(arr.map(function(item){
		return '<p><span class="jlevel">'+jname[item['jlevel']-1]+'</span>'+item['name']+'  '+item['phone'];
	}).join(''));
}
//取消中奖
function qx(){
	$('.conbox').empty();
	$('.confirmbox').hide();
}














