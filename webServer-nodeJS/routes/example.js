'user strict'
var express=require('express');
var router=express.Router();
var redis = require('redis');

//var buffer = new Buffer([ 0x68, 0x65, 0x6c, 0x6c, 0x6f ]) ;

//var buff=Buffer.allocUnsafe(200);
//var xx = Buffer.allocUnsafe(10);

//Test Redis 的基本界面接口
router.use('/redis',function(req,res,next)
{
	//国内帖子一大抄，翻出10个，都一样...
	//https://kb.objectrocket.com/redis/nodejs-and-redis-example-1149
	var client = redis.createClient(6379, '127.0.0.1');
	//client.auth(123);  // 如果没有设置密码 是不需要这一步的
	client.on('connect', function () {
		//常用的
	    client.set('name', 'long', function (err, data) {
	        // console.log(data);
	        // console.log("set name");
	    });
	   // get 语法
	    client.get('name', function (err, data) {
	    	// console.log("get name");
	        // console.log(data)
	    });

	    client.lpush('class',1,function (err,data) {
	    	// console.log("lpush class");
	        // console.log(data)
	    });

	    client.lrange('class',0,-1,function (err,data) {
	    	// console.log("lrange");
	        // console.log(data)
	    });

	    console.log("=====test hash====");

	    var obj = {
		     name:'sss',
		     age:33,
		 };
		 //说明：这个obj是在内部扩展为 field+value。对于多级的obj，可以用JSON.stringfy(obj)输入参数
		 client.hmset("hiiz",obj);
		 client.hset("hiiz",'obj','hi---');
		 client.hset("hiiz",'obj12','hi---');
		 client.hset("hiiz",'obj2','hi---');
		 client.hgetall('hiiz',function(err,obj){
		 	console.log(err,obj);
		 })

		 client.hmset("xxx", { HR: "Anthony", MIS: " Clint", Accounting: "Mark" });

		 client.hgetall('xxx',function(err,obj){
		 	console.log(err,obj);
		 })


   //   	 client.hset("test",obj, function(err, obj) {
		 //     client.hgetall('test', function(err, obj) {
		 //         console.log(`hgetall:${JSON.stringify(obj)}`);
		 //         console.log(err,obj);
		 //         //console.log(obj.age);
		 //     });
		 //     client.hget('test','name', function(err, name) {
		 //         console.log('hget test name');
		 //         console.log(name);
		 //     });
		 // });

		 // client.hgetall('test', function(err, obj) {
		 //         console.log(`hgetall:${JSON.stringify(obj)}`);
		 //         console.log(err,obj);
		 //         //console.log(obj.age);
		 //     });

         //queue
		// rpush 将给定值推入列表的右端 当前列表长度 rpush('key', 'value1' [,'value2']) (支持数组赋值)
		// lrange 获取列表在给定范围上的所有值 array lrange('key', 0, -1) (返回所有值)
		// lindex 获取列表在给定位置上的单个元素 lindex('key', 1)
		// lpop 从列表左端弹出一个值，并返回被弹出的值 lpop('key')
		// rpop 从列表右端弹出一个值，并返回被弹出的值 rpop('key')
		// ltrim 将列表按指定的index范围裁减 ltrim('key', 'start', 'end')
		console.log("--test queue-");
		console.log("rpush");
         client.rpush('que1','agc','abc1');
         client.rpush(["vegetable", "carrot", "celery"], function(err, reply) {
			  console.log('hi vegetable',reply);
			});
         client.lrange("vegetable", 0, -1, function(err, reply) {
			  console.log(reply);
			});
         console.log("---",client.lpop('vegetable'));
         var xx = client.lpop("vegetable",function(err,reply){console.log("replys--",reply);});

         console.log(xx);
         client.lrange('que1',0,-1);
   res.send("hello admin");
});
});


// Test mysql interfaces.
router.use('/mysql',function(req,res,next){
   console.log('++++++++++++++++test mysql');
    //引入数据库
	var mysql      = require('mysql');
	console.log("----------------------------------------------");
	var connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'root',
	  password : 'root',
	  database : 'ai_db'
	});
	 
	connection.connect();

	//添加
	let td = {
        nodeID: 1,
        ipAddr: 'Hello',
        port: 20,
        username: 'abc',
        password: 'deom'
    };
    // insert into testDev set (nodeID=1 );
    let query = connection.query("INSERT INTO testDev set ? ", td, function (error, results, fields) {
        if (error) throw error;
    })
    console.log(query.sql); //INSERT INTO posts 'id'=1, 'title'='Hello MySQL'

    //修改

    connection.query('UPDATE testDev SET username=? where nodeID=?', ['update', 1], function (error, results, fields) {
        if (error) throw error;
        console.log('changed:' + results.changeRows + 'rows');
    });

    //删除
    connection.query('DELETE FROM testDev where id=?', [ 1], function (error, results, fields) {
            if (error) throw error;
            console.log('deleted:' + results.affectedRows + 'rows');
        });
        console.log('connected as id ' + connection.threadId);


	//查
	connection.query('SELECT * FROM testDev',function (err, result) {
	        if(err){
	          console.log('[SELECT ERROR] - ',err.message);
	          return;
	        }
	       console.log(result);
	});


	//添加
	var  addSql = 'INSERT INTO testDev(nodeID,ipAddr,port,username,password) VALUES(2,?,?,?,?)';
	var  addSqlParams = ['sdfegefg',23453, 'CN','dddd'];
	//增
	connection.query(addSql,addSqlParams,function (err, result) {
	        if(err){
	         console.log('[INSERT ERROR] - ',err.message);
	         return;
	        }        
	 
	       console.log('INSERT ID:',result);  
	});

	connection.end();
	return;

});
module.exports = router;