'user strict'
// '/'根目录下的子路由
var express=require('express');
var router=express.Router();
var redis = require('redis');

//var buffer = new Buffer([ 0x68, 0x65, 0x6c, 0x6c, 0x6f ]) ;

//var buff=Buffer.allocUnsafe(200);
//var xx = Buffer.allocUnsafe(10);
router.use('/',function(req,res,next)
{
	var client = redis.createClient(6379, '127.0.0.1');
	//client.auth(123);  // 设置了密码，打开这行代码；没设置密码，关闭
  res.send("hello admin");
});

module.exports = router;