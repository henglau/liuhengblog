var DATABASE = require('./database.js');
var mysql = require('mysql');

module.exports = function(sql, callback) {
	// 创建连接
	var connection = mysql.createConnection(DATABASE); 
	connection.connect();
	var execsql = sql;
	//查 query
	connection.query(execsql,function (err, result) {
		if(err){
			console.log('[SELECT ERROR] - ',err.message);
			return;
		}       
		if(callback) callback(result);
	});
	connection.end();
}