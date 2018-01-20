'use strict';
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.disable('x-powered-by');
// 设置 handlebars 视图引擎
var handlebars = require('express3-handlebars').create({ 
	defaultLayout:'main', 
	helpers: {
		section: function(name, options){
			if(!this._sections) this._sections = {};
			this._sections[name] = options.fn(this);
			return null;
		},
		lookup:function(){
			return 'temp';
		}
	}
});
var dateFormat = require('dateformat');
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
// body-parser中间件: 中间件是在管道中执行的,在express程序中,通过调用app.use向管道中插入中间件.
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// 复合表单处理中间件
var formidable = require('formidable');
// 这里的文件存放凭证, 如cookie密钥
var credentials = require('./libs/credentials.js');
app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')({resave:false,saveUninitialized: true,secret:'liuheng'}));
// 默认情况下,视图缓存会在开发模式下禁用,可以显式地启用视图缓存.
// app.set('view cache', true);
app.set('port', process.env.PORT || 80);

// 你应该把 static 中间件加在所有路由之前:
app.use(express.static(__dirname + '/public'));
app.use(function(req,res,next){
	var date = new Date();
	date.setHours(date.getHours()+8);
	app.locals.date = dateFormat(date,'yyyy-mm-dd');
	res.locals.partials = {};
	res.locals.partials.weather = [{location:'beijing',temp:'20 C'}];
	next();
});
app.use(function(req,res,next){
	// 如果有即显消息， 把它传到上下文中， 然后清除它
	res.locals.flash = req.session.flash;
	if(req.session.loginErrorMsg){
		res.locals.loginErrorMsg = req.session.loginErrorMsg;
	}
	if(req.session.username){
		res.locals.username = req.session.username;
	}
	delete req.session.flash;
	delete req.session.loginErrorMsg;
	next();
});
app.use(function(req,res,next){
	// 如果有即显消息， 把它传到上下文中， 然后清除它
	if(req.session.choujiangLoginErr){
		res.locals.choujiangLoginErr = req.session.choujiangLoginErr;
	}
	delete req.session.choujiangLoginErr;
	next();
});
app.get('/', function(req, res){
	if(!req.cookies.isFirstCome){	//或者使用 req.cookies['isFirstCome']
		res.cookie('isFirstCome','true',{signed:false,maxAge:86400000});
	}else{
		console.info(req.cookies.isFirstCome);
	}
   	res.render('index',{t:'temp'});
});
app.get('/blogs',function(req,res){
	res.render('blogs');
});
app.get('/blogs/blog\\d+',function(req,res){
	res.render(req.path.replace('/',''));
});
app.get('/downloads',function(req,res){
	res.render('downloads');
});
app.get('/contact',function(req,res){
	res.render('contact');
});

var mysql = require('mysql');
var DATABASE = require('./libs/database.js');
app.get('/choujiang',function(req,res){
	var persons = [];
	// 创建连接
	var connection = mysql.createConnection(DATABASE); 
	connection.connect();
	var userGetSql = 'SELECT NAME,PHONE FROM ' + DATABASE.table;
	//查 query
	connection.query(userGetSql,function (err, result) {
		if(err){
			console.log('[SELECT ERROR] - ',err.message);
			return;
		}       
		result.forEach(function(item){
			persons.push({name: item.NAME, phone: item.PHONE});
		});
		res.render('choujiang/index',{layout: null, persons: JSON.stringify(persons)});
	});
	connection.end();
});
app.get('/choujiang/server',function(req,res){
	if(req.session.user === 'yulu'){
		res.render('choujiang/server',{layout: null});
	}else{
		res.redirect(302,'/choujiang/login');
	}
});
app.get('/choujiang/login',function(req,res){
	res.render('choujiang/login',{layout: null});
});
app.post('/choujiang/postLogin', function(req, res){
	if(req.body.user === 'yulu' && req.body.password === '123456'){
		req.session.user = 'yulu';
		res.redirect(302,'/choujiang/server');
	}else{
		req.session.choujiangLoginErr = '用户或账号密码错误';
		res.redirect('/choujiang/login');
	}
});
app.get('/yintai', function(req, res){
	res.render('yintai/index', { layout:'yintai',csrf: 'CSRF token goes here' });
});
app.get('/yintai/login', function(req, res){
	res.render('yintai/login', { layout:'yintai'});
});
app.post('/yintai/postLogin', function(req, res){
	console.info(req.body.inputEmail,req.body.inputPassword1);
	if(req.body.inputEmail=='henglau@163.com' && req.body.inputPassword1=='abcd13410248376'){
		req.session.username = 'liuheng';
		res.redirect(302,'/yintai/plan');
	}else{
		req.session.loginErrorMsg = '用户或账号密码错误';
		res.redirect('/yintai/login');
	}
});
app.get('/yintai/regist', function(req, res){
	res.render('yintai/regist', { layout:'yintai'});
});
app.post('/yintai/postRegist', function(req, res){
	console.info(req.body.inputEmail,req.body.inputPassword1,req.body.inputPassword2);
	res.redirect(302,'/yintai/plan');
});
app.get('/yintai/logout', function(req, res){
	delete req.session.username;
	res.redirect(302,'/yintai');
});
app.get('/yintai/plan', function(req, res){
	if(req.session.username){
		res.render('yintai/plan', { layout:'yintai'});
	}else{
		res.redirect('/yintai/login');
	}
});
app.get('/newsletter', function(req, res){
	res.render('newsletter', { csrf: 'CSRF token goes here' });
});
// 邮件传输模块
var nodemailer = require('nodemailer');
var mailTransport = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: credentials.gmail.user,
		pass: credentials.gmail.password,
	}
});
var VALID_EMAIL_REGEX = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
app.post('/newsletter', function(req, res){
	var name = req.body.name || '', email = req.body.email || '';
	// 利用会话(session)显示即显消息
	// 输入验证
	if(!email.match(VALID_EMAIL_REGEX)) {
		if(req.xhr) return res.json({ error: 'Invalid name email address.' });
		req.session.flash = {
			type: 'danger',
			intro: 'Validation error!',
			message: 'The email address you entered was not valid.',
		};
		return res.redirect(303, '/newsletter/archive');
	}else{
		// 此处的处理过程: 存储到数据库的过程
		if(req.xhr) return res.json({ success: true });
		req.session.flash = {
			type: 'success',
			intro: 'Thank you!',
			message: 'You have now been signed up for the newsletter.',
		};
		// // 需要在google账户中心关联应用和网站, 开启允许不够安全的应用.
		// mailTransport.sendMail({
		// 	from: '"liuheng\'s blog" <henglau1991@gmail.com>',
		// 	to: 'henglau@163.com',
		// 	// 可以将邮件发送给多个接收者
		// 	// to: 'joe@gmail.com, "Jane Customer" <jane@yahoo.com>, ' + 'fred@hotmail.com',
		// 	subject: 'Your Subscribe',
		// 	// Nodemailer 允许你在同一封邮件里发送 HTML 和普通文本两种版本， 让邮件客户端选择显示哪个版本（ 一般是 HTML）
		// 	html: '<h1>liuheng\'s blog</h1>\n' +
		// 			'<b>Thanks for your subscription, we will send you the latest content from time to time.</b>',
		// 	// 纯文字邮件
		// 	// text: 'Thanks for your subscription, we will send you the latest content from time to time.',
		// 	// Nodemailer 会自动将 HTML 翻译成普通文本, 而不需要写text内容
		// 	generateTextFromHtml: true
		// }, function(err){
		// 	if(err) console.error( 'Unable to send email: ' + err );
		// });
		
		// 用视图发送HTML邮件
		res.render('email/subscribe-success',
			{layout: null, name: name}, function(err,html){
				if( err ) console.log('error in email template');
				mailTransport.sendMail({
					from: '"liuheng\'s blog" <henglau1991@gmail.com>',
					to: email,
					subject: 'Your Subscribe',
					html: html,
					generateTextFromHtml: true
				}, function(err){
					if(err) console.error('Unable to send confirmation: ' + err.stack);
				});
			}
		);
		return res.redirect(303, '/newsletter/archive');
	}
});
app.get('/newsletter/archive',function(req,res){
	res.render('newsletter-archive');
});

app.get('/thank-you', function(req, res){
	res.render('thank-you');
});
app.get('/file-upload-success', function(req, res){
	res.render('file-upload-success');
});
app.get('/contest/vacation-photo',function(req,res){
	var now = new Date();
	res.render('contest/vacation-photo',{
		year: now.getFullYear(),month: now.getMonth()+1
	});
});
var fs = require('fs');//文件读写中间件
app.post('/contest/vacation-photo/:year/:month', function(req, res){
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files){
		if(err) return res.redirect(303, '/error');
		console.log('received fields:');
		console.log(fields);
		console.log('received files:');
		console.log(files);
		var tmp_path = files.photo.path;
		var now = new Date();
		var dir = now.getFullYear() + '' + (now.getMonth()+1);
		console.info(tmp_path);
	    // 指定文件上传后的目录 - 示例为"uploads"目录。 
	    var target_path = './public/uploads/' + dir + '/' + files.photo.name;
	    // 移动文件
	    fs.rename(tmp_path, target_path, function(err) {
	    	if (err) throw err;
	      	// 删除临时文件夹文件, 
	      	fs.unlink(tmp_path, function() {
		      	if (err) throw err;
			  	app.locals.fileDesc = 'File uploaded to: ' + target_path + ' - ' + files.photo.size + ' bytes';
				res.redirect(303, '/file-upload-success');
	      	});
	  	});
	});
});
var tourss = {
	currency: {
		name: 'United States dollars',
		abbrev: 'USD'
	},
	tours: [
		{ name: 'Hood River', price: '$99.95' },
		{ name: 'Oregon Coast', price: '$159.95' }
	],
	specialsUrl: '/january-specials',
	currencies: [ 'USD', 'GBP', 'BTC' ]
};
app.get('/testdata', function(req, res){
	// layout 可以是自定义layout,也可以无layout(设置layout属性为null)
   res.render('testdata',{weixin:'<b>13410248376</b>',tourss:tourss});
});
app.get('/api/get',function(req,res){
	res.format({
		'application/json':function(){
			res.json({version:'1.0.0',author:'ooo'});
		}
	});
});
app.post('/api/post',function(req,res){
	if(req.body.name==='liuheng' && req.body.password==='Abcd13410248376!'){
		res.json({status: 'success', name: 'liuheng'});
	}else{
		res.json({status: 'fail', name: 'unkown'});
	}
});
app.post('/process',function(req,res){
	console.log('Form (from querystring): ' + req.query.form);
	console.log('CSRF token (from hidden form field): ' + req.body._csrf);
	console.log('Name (from visible form field): ' + req.body.name);
	console.log('Email (from visible form field): ' + req.body.email);
	res.redirect(303, '/thank-you');
});
app.get('/upload-file',function(req,res){
	res.render('upload-file');
});
// 文件上传handler
var jqupload = require('jquery-file-upload-middleware');
app.use('/upload',function(req,res,next){
	var date = new Date(),
		dateDir = date.getFullYear()+''+(date.getMonth()+1);
	jqupload.fileHandler({
		uploadDir:function(){
			return __dirname + '/public/uploads/'+dateDir;
		},
		uploadUrl:function(){
			return '/uploads/'+dateDir;
		}
	})(req,res,next);
});


//socket.io
io.on('connection', function(socket){
	socket.on('start', function (data) {
		io.emit('start', { action: 'start' });
	});
	socket.on('stop', function (data) {
		io.emit('stop', { action: 'stop' });
	});
	socket.on('select',function(data){
		io.emit('select',{action: 'select',user: data.user, phone: data.phone});
	});
	socket.on('qr', function (data) {
		io.emit('qr', { action: 'qr'});
	});
	socket.on('qx',function(data){
		io.emit('qx', {action: 'qx'});
	});

});

// 定制404页面
app.use(function(req, res){
   res.status(404).render('404');
});
// 定制 500 页面
app.use(function(err, req, res, next){
   console.error(err.stack);
   res.status(500).render('500');
});
http.listen(app.get('port'), function(){
	console.log('Express started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate.');
});
