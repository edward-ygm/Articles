'user strict'
var express=require('express');
var router=express.Router();
var redis = require('redis');
var fs = require('fs');
const { utils } = require('../utils/aesjs');
var fetch = require('../utils/datafetch.js');
var util = require("../utils/adiutil.js");

/** Ok, 文件上传 */
router.post('/upload', (req, res) => {

	console.log("reach admin/upload");
 	if (!req.files) {
		return res.status(500).send({ msg: "file is not found" })
	}
		// accessing the file
	const myFile = req.files.file;

	/**写入文件(下面两个例子都是OK的)
		var x="sf大家好";
		var y=Buffer.from(x);
		fs.writeFile(__dirname+'/test.txt',y,function(err,data){
			console.log(err,data);
		});
		fs.writeFile(__dirname+'/abc.jpg',myFile.data,function(err,data){
			console.log(err,data);
		});
	*/
 
	//  mv() method places the file inside public directory
	/** 做一些修改，自定义文件名字 */
	// myFile.mv(`${__dirname}/public/${myFile.name}`, function (err) {
 //    var fname=`${__dirname}/public/${fname}`;
	var fname=`${__dirname}/../private/${myFile.name}`;
	console.log(`${__dirname}/../public/${fname}`+" ");
	myFile.mv(fname, function (err) {
		if (err) {
			console.log(err)
			return res.status(500).send({ msg: "Error occured" });
		}
		// returing the response with file path and name
		return res.send({name: myFile.name, path: `/${myFile.name}`});
	});
 })

 /** 头像上传 */
router.post('/upload/pic', (req, res) => {

	/**check token */
	// let email = req.body.email;//限于使用图片上传的组建的约束，这里将一些信息放在headers里面
	let email = req.headers['user-email'];
	let token = req.headers["access-token"];/**先放这，其实可以直接放在body.email中 */
	if(!util.checkToken(email,token)){
		return; /** 不做任何操作 或返回错误信息 */
	}
	
	if (!req.files) {
		return res.status(500).send({ msg: "file is not found" })
	}
	// accessing the file
	const myFile = req.files.file;
 
	/**直接写入到数据库 <img src=“data:image/png;base64,iVBORw0...”/>*/
	let imgData=myFile.data.toString('base64');
	let ftype = myFile.name.split('.');
	ftype = ftype[ftype.length-1];
	imgData = "data:image/"+ftype+";base64,"+imgData;

	let cData={'email':email};
	let sqlData={'icons':imgData};
	fetch.updateUserLogin(sqlData,cData,function(err,v){
		if(err==null){
			// returing the response with file path and name
			res.writeHead(200,{'Content-type':'application/json'});
			let  obj={}; obj['email']=email;obj['st']='ok';obj['icons']=v.icons;
			return res.end(JSON.stringify(obj));
		}
	});

	// var fname=`${__dirname}/../private/${myFile.name}`;
	// // console.log(`${__dirname}/../public/${fname}`+" ");
	// // myFile.
	// myFile.mv(fname, function (err) {
	// 	if (err) {
	// 		console.log(err)
	// 		return res.status(500).send({ msg: "Error occured" });
	// 	}
	// 	// returing the response with file path and name
	// 	res.writeHead(200,{'Content-type':'application/json'});
	// 	let  obj={}; obj['name']='name';obj['st']='ok';
	// 	return res.end(JSON.stringify(obj));
	// });
 })
//var buffer = new Buffer([ 0x68, 0x65, 0x6c, 0x6c, 0x6f ]) ;

//var buff=Buffer.allocUnsafe(200);
//var xx = Buffer.allocUnsafe(10);
/**这个可以放在最前面，做预处理 */
router.use('*',function(req,res,next)
{
	// var client = redis.createClient(6379, '127.0.0.1');
	// client.auth(123456);  // 如果没有设置密码 是不需要这一步的
    // res.send("hello admin");
	console.log("欢迎进入到/admin子目录");
	next();
});

router.use('/r1',function(req,res,next)
{
	console.log("匹配到 admin/r1");
    res.send("hello admin/r1");
});

/***这个中间件应该放在最后面，也就是如果前面的都没有匹配到的话，才会匹配到最后这一个 */
router.use('/',function(req,res,next)
{
	// var client = redis.createClient(6379, '127.0.0.1');
	// client.auth(123456);  // 如果没有设置密码 是不需要这一步的
  // res.send("hello admin");
	console.log("匹配到最后的 /");
	res.send("什么都没有匹配到？");
	return;
});
module.exports = router;