//连接websocket后端服务器
var socket = io.connect('ws://www.henglau.cn');

socket.on('start', function(){
	start();
});

socket.on('stop', function(){
	start();
});

socket.on('qr', function(){
	qr();
});

socket.on('qx', function(){
	qx();
});

var xinm = new Array();
var phone = new Array();

xinm[0]="白金香"
xinm[1]="白应梅"
xinm[2]="柏仁燕"
xinm[3]="包颜琳"
xinm[4]="鲍学梅"
xinm[5]="鲍颖"
xinm[6]="蔡玲芳"
xinm[7]="蔡 艳"
xinm[8]="蔡 玉"
xinm[9]="曹发敏"
xinm[10]="曹 菊"
xinm[11]="陈代业"
xinm[12]="陈济辉"
xinm[13]="陈丽莎"
xinm[14]="陈 桥"
xinm[15]="陈秋燕"
xinm[16]="陈世花"
xinm[17]="陈桃花"
xinm[18]="陈小凤"
xinm[19]="陈迎莉"
xinm[20]="戴思思"
xinm[21]="邓文志"
xinm[22]="狄良菊"
xinm[23]="丁 莉"
xinm[24]="丁钟琴"
xinm[25]="东妹廷"
xinm[26]="董翠远"
xinm[27]="段飞云"
xinm[28]="段玉洁"
xinm[29]="范 云"
xinm[30]="冯鑫华"
xinm[31]="奉中梅"
xinm[32]="高老菜"
xinm[33]="葛凤兰"
xinm[34]="顾光丽"
xinm[35]="顾娟娟"
xinm[36]="顾娜先"
xinm[37]="顾艳业"
xinm[38]="顾芝业"
xinm[39]="关 静"
xinm[40]="广家领"
xinm[41]="郭静玲"
xinm[42]="郭南肖"
xinm[43]="何东娥"
xinm[44]="何建花"
xinm[45]="何丽丽"
xinm[46]="何 敏"
xinm[47]="洪 梅"
xinm[48]="胡琴芬"
xinm[49]="胡文梅"
xinm[50]="胡幺仙"
xinm[51]="胡永清"
xinm[52]="黄青"
xinm[53]="黄思丽"
xinm[54]="黄兴菊"
xinm[55]="黄玉洁"
xinm[56]="黄云青"
xinm[57]="姜安美"
xinm[58]="姜三妹"
xinm[59]="姜淑一"
xinm[60]="姜玉花"
xinm[61]="姜志芳"
xinm[62]="蒋丽"
xinm[63]="蒋珮"
xinm[64]="蒋琴琴"
xinm[65]="蒋榕"
xinm[66]="蒋晓洁"
xinm[67]="金晶"
xinm[68]="金秀共"
xinm[69]="兰海燕"
xinm[70]="兰明慧"
xinm[71]="黎 梅"
xinm[72]="黎顺桥"
xinm[73]="李芬芳"
xinm[74]="李佳陶"
xinm[75]="李金梅"
xinm[76]="李金芝"
xinm[77]="李敏"
xinm[78]="李明燕"
xinm[79]="李琴"
xinm[80]="李秋霖"
xinm[81]="李盛媛"
xinm[82]="李思思"
xinm[83]="李文慧"
xinm[84]="李小姐"
xinm[85]="李小丽"
xinm[86]="李小英"
xinm[87]="李雪娜"
xinm[88]="李艳"
xinm[89]="李艳"
xinm[90]="李阳"
xinm[91]="李英翠"
xinm[92]="李应丽"
xinm[93]="李珍"
xinm[94]="李振雪"
xinm[95]="梁梅桃"
xinm[96]="梁引琼"
xinm[97]="梁玉"
xinm[98]="廖建英"
xinm[99]="刘冰洁"
xinm[100]="刘丹敏"

phone[0]="151****3625"
phone[1]="180****3582"
phone[2]="158****3031"
phone[3]="135****0255"
phone[4]="182****2223"
phone[5]="180****5557"
phone[6]="186****7582"
phone[7]="159****8592"
phone[8]="158****7213"
phone[9]="137****2881"
phone[10]="158****6610"
phone[11]="150****6765"
phone[12]="137****9530"
phone[13]="180****9967"
phone[14]="152****5766"
phone[15]="189****2598"
phone[16]="185****2210"
phone[17]="151****8996"
phone[18]="180****4966"
phone[19]="189****7356"
phone[20]="182****3505"
phone[21]="183****1085"
phone[22]="133****1227"
phone[23]="182****7170"
phone[24]="151****1918"
phone[25]="182****2343"
phone[26]="135****3388"
phone[27]="186****8366"
phone[28]="151****0449"
phone[29]="180****0000"
phone[30]="150****5680"
phone[31]="151****3850"
phone[32]="187****7833"
phone[33]="151****0891"
phone[34]="182****6470"
phone[35]="137****3396"
phone[36]="150****6700"
phone[37]="136****8856"
phone[38]="189****7762"
phone[39]="185****2289"
phone[40]="185****5696"
phone[41]="136****2324"
phone[42]="180****9088"
phone[43]="186****0450"
phone[44]="187****5637"
phone[45]="187****8178"
phone[46]="187****8842"
phone[47]="137****2026"
phone[48]="182****0228"
phone[49]="138****8881"
phone[50]="151****9976"
phone[51]="185****2099"
phone[52]="182****6662"
phone[53]="182****5101"
phone[54]="180****1995"
phone[55]="152****4892"
phone[56]="152****3480"
phone[57]="152****5005"
phone[58]="151****5762"
phone[59]="131****5485"
phone[60]="182****0988"
phone[61]="150****0086"
phone[62]="187****8254"
phone[63]="135****3787"
phone[64]="186****3035"
phone[65]="187****9858"
phone[66]="181****0688"
phone[67]="185****8673"
phone[68]="135****2253"
phone[69]="138****6672"
phone[70]="180****8048"
phone[71]="182****8510"
phone[72]="189****5003"
phone[73]="136****7106"
phone[74]="150****3399"
phone[75]="152****3356"
phone[76]="180****9199"
phone[77]="186****3042"
phone[78]="151****9036"
phone[79]="183****8396"
phone[80]="186****0087"
phone[81]="151****2687"
phone[82]="155****7913"
phone[83]="188****6960"
phone[84]="152****5256"
phone[85]="156****2356"
phone[86]="187****1793"
phone[87]="136****8660"
phone[88]="187****5051"
phone[89]="151****5858"
phone[90]="182****2600"
phone[91]="183****6010"
phone[92]="183****0980"
phone[93]="139****8745"
phone[94]="180****0089"
phone[95]="185****5731"
phone[96]="139****1300"
phone[97]="133****3636"
phone[98]="158****1234"
phone[99]="182****6969"
phone[100]="182****3933"

var nametxt = $('.name');
var phonetxt = $('.phone');
var pcount = xinm.length;//参加人数
var runing = true;  
var num = 0; //随机数存储
var to = 0;//从0开始
var numr = 10;//每次抽取幸运奖人数
var t;//循环调用
var lucknum = 0;

var pdnum = pcount;//参加人数判断是否抽取完


//大奖开始停止
function start() {
	var zjnum = $('.list').find('p');
	if(zjnum.length == pdnum){
		alert('无法抽奖');
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
	var zjnum = $('.list').find('p');
	//打印中奖者名单
	$('.conbox').prepend("<p style='width:80%;font-size:38px;padding:30px;text-align: center;color:#FF2525;'>"+xinm[num]+"   "+phone[num]+"</p>");
	$('.confirmbox').show();
	socket.emit('select', {user: xinm[num],phone: phone[num]});
	
	return pcount;
}

//确认中奖
function qr(){
	//将已中奖者从数组中"删除",防止二次中奖
	xinm.splice($.inArray(xinm[num], xinm), 1);
	phone.splice($.inArray(phone[num], phone), 1);
	var cp = $('.conbox').find('p').removeAttr('style').clone();
	$('.zjmd_bt_xy').find('p').eq(0).css({'margin-top':'10px','border-top':'1px solid #FF2525'});
	$('.zjmd_bt_xy').prepend(cp);
	$('.conbox').empty();
	$('.confirmbox').hide();
	//中奖名单排序
	$('.list').find('p').each(function(i){
		$(this).find('span').remove();
	});
}

//取消中奖
function qx(){
	$('.conbox').empty();
	$('.confirmbox').hide();
}














