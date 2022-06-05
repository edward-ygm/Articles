'user strict'
/**
 * 作者：Edward Yang
 * 2021-12-28
 */
var express = require('express');
const { utils } = require('../utils/aesjs.js');
var router=express.Router();

var fs = require("fs")

var fetch = require("../utils/datafetch.js");
var util = require("../utils/adiutil.js");
var g=require('../utils/base.js');

router.use('*',function(req,res,next)
{
	// var client = redis.createClient(6379, '127.0.0.1');
	// client.auth(123456);  // 如果没有设置密码 是不需要这一步的
    // res.send("hello admin");
	console.log("欢迎进入到/data子目录");
	next();
});

/**获取一个新的artID （创建一个新文章） */
router.post('/newArtId',function(req,res,next)
{
	let data = req.body;
	let email = data.email;
	let token = data.token;
	/** 生成ID的算法 */
	fetch.genArtId(email,function(articleId){
		let ret = {'artId':articleId};
		/** 添加其他参数 ？*/
		res.end(JSON.stringify(ret));
		return;
	});

});

router.post('/artLoad',function(req,res,next)
{

	let data = req.body;
	let email = data.email;
	let artID = data.artID;
	/**先判断是否这个文章ID是否已经存在 */

	fetch.saveArticle(data,function(rdata){
		/**返回成功 */
		if(rdata) res.end('{"st":"ok"}');
		else res.end('{"st":"nok"}');
	});
	/**更新文章Redis */

	/** 写入数据库 */
	/**更新Redis */
	console.log("欢迎进入到//data/picUpload/title");
});

router.post('/artPicLoad',function(req,res,next)
{
	let f = req.files;
	let tm = util.getTmSeconds()
  //这里应该要check token
	let email = req.headers.email

	let ff = f["wangeditor-uploaded-image"]
	// let fexpend = ff.mimetype.split("/")
	// fexpend = "." + fexpend[fexpend.length-1]

	let dir = './dist/upload/'+email+'/'
	if (!fs.existsSync(dir)){
			fs.mkdirSync(dir, { recursive: true });
	}
	// fs.writeFile('../dist/upload/'+ff.name,ff.data,(err)=>{
	fs.writeFile(dir + tm +'-'+ff.name,ff.data,(err)=>{
		console.log("errno",err)
	  let path = g.baseUrl + '/upload/' + email + '/' + tm+'-'+ff.name
		let resData = {
			"errno": 0, // 注意：值是数字，不能是字符串
			"data": {
					"url": path, // 图片 src ，必须
					"alt": "dd", // 图片描述文字，非必须
					"href": "dd" // 图片的链接，非必须
			}
	  }
		res.send(resData)
	})
	

});

/**获取当前的文章的列表 
 * 常规情况是允许所有人访问 */
router.post('/artList',function(req,res,next)
{
	let data = req.body;
	let curPos= (undefined == data.curPos) ? 0:data.curPos;
	let tnum= (undefined == data.tnum) ? 25:data.tnum;
	let option= (undefined == data.option) ? 'newFirst':data.option;

	let email = data.email;
	let token = data.token;

	let artID = data.artID;
	
	if(option=="userFirst"){
		//check the validation of the user.
		util.checkToken(email,token);
	}

	fetch.getArtList(function(rdata){
		/**返回成功 */
		let data = {'st':'ok'};
		if(rdata.length ==0 ){
			data['st']='nok';
		}
		data.data = rdata;
		res.writeHead(200,{'Content-type':'application/json'});
        res.end(JSON.stringify(data));
	},curPos,tnum,option);
});

/**查询所有的文章() req.data.val
 * 按照如下顺序进行排序 1、作者名字；2、文章标题；3、文章title；4、文章内容
 * 常规情况是允许所有人访问 
 * */
 router.post('/searchArt',function(req,res,next)
 {
	 let inputVal = req.body.val;
	 if(inputVal==null||inputVal==undefined||inputVal.trim()=="") return;
   
	 var artlist = {};
	/**  select * from arts where
	 * nickName like '%行是标题%' or 
	 * title like '%行是标题%' or 
	 * 'abstract' like '%行是标题%' or 
	 * text like '%行是标题%' 
	 * order by mtime desc ;*/
	 let data = {'artID':'','title':'','abstract':'','content':'','imgList':'','email':'','nickName':'','up':'','down':'','ctime':'','mtime':'','status':''};
	 let cons={}
	 let op=" where nickName like '%"+inputVal+"%' "
	        + " or email like '%"+inputVal+"%' "
	        + " or title like '%"+inputVal+"%' "
	        + " or abstract like '%"+inputVal+"%' "
	        + " or text like '%"+inputVal+"%' "
					+ " order by mtime desc "

	fetch.selectMysql(function(err,resData){
		var tdata =  {'st':'ok'};
		if(err == null || err==undefine){
			var mvalObj=JSON.parse(JSON.stringify(resData));/**获取对象数据 */
			if(mvalObj.length ==0 ){
				tdata['st']='nok';
			}
			tdata.data = mvalObj;
		}else{
			tdata['st']='nok';
		}
		res.writeHead(200,{'Content-type':'application/json'});
		res.end(JSON.stringify(tdata));
	},"arts",data,cons,op);

 });

/**获取整个文章的内容 */
router.post('/article',function(req,res,next)
{
	let data = req.body;
	let email = data.email;
	let artID = data.artID;
	/**先判断 这个没有搜索Redis---先实现 */
	fetch.getArticle(artID,function(redata){
		if (redata.length>0){
			let rdata = {"st":"ok"};
			rdata['artID']=artID;
			rdata['data']=redata[0];
			res.end(JSON.stringify(rdata));
		}else{
			res.end('{"st":"nok"}');
		}
	});
	/**更新Redis */
	console.log("欢迎进入到//data/article");
});

router.post('/picUpload/title',function(req,res,next){
	console.log("欢迎进入到//data/picUpload/title");

	// console.log(__dirname);

	return res.send({'hi':'dd'});
});

router.get('/picUpload/title',function(req,res,next){
	console.log("欢迎进入到 get //data/picUpload/title");

	// console.log(__dirname);

	return res.send({'hi':'dd'});
});

// 获取用户信息
router.post('/getInfo',function(req,res,next)
{
	// userLogin
	//首先判断登录者是谁，普通用户可以看到基本信息，自己可以看到全部信息
	let constraintKey={},data={}
	if(req.body.email==null||req.body.email==undefined){
		fetch.response(res,{Info:"nok",st:"nok"})
		return
	}
	constraintKey["email"] = req.body.email;
	data={'email':'','nickName':'','status':'','icons':'','rankVal':'','followed':'','dislike':'','favorate':'','rBirth':'','rName':'','gender':'','phoneNumber':''}
	fetch.selectMysql(function(err,resData){
		if(err==null){
			let mvalObj=JSON.parse(JSON.stringify(resData[0]));/**获取对象数据 */
      mvalObj.icons=util.utf8_bytes_array_to_string(mvalObj.icons.data);
			fetch.response(res,{Info:"ok",st:"ok",data:mvalObj})
		}else{
			fetch.response(res,{Info:"nok",st:"nok"})
		}
	},"userLogin",data,constraintKey,"")

});
// 上传，修改用户信息
router.post('/setInfo',function(req,res,next)
{
	if(req.body.email==null) return
	// 设置
	let data = {}
	for(key in req.body){
		if(req.body[key]!="" && req.body[key]!="email")
		   data[key] = req.body[key];
	}
	let constraintKey = {}
	constraintKey["email"] = req.body.email;
  fetch.updateMysql("userLogin",data,constraintKey,function(err,resdata){
		if(err==null){
			// 这里是需要更新Redis的（比较直接的办法就是删除Redis表）
			let key = g.rk.userlogin+req.body.email;
			fetch.redisRemoveKey(key);
			fetch.response(res,{Info:"ok",st:"ok"})
		}else{
			fetch.response(res,{Info:"ok",st:"ok"},200);
		}
	})
});

// router.get('/picUpload/title',function(req,res,next){
// 	console.log("enter /data/picUpload/title");
// 	// console.log(__dirname);

// 	return res.send({'hi':'dd'});
	
// 	// res.send("hello /picUpload/title");
// 	if (!req.files) {
// 		console.log("-----1xx");
//         return res.status(500).send({ msg: "file is not found" })
//     }
// 	const myFile = req.files.file;

// 	console.log(`${__dirname}/public/${myFile.name}`);
// 	//  mv() method places the file inside public directory
// 	myFile.mv(`${__dirname}/public/${myFile.name}`, function (err) {
// 		if (err) {
// 			console.log(err)
// 			return res.status(500).send({ msg: "Error occured" });
// 		}
// 		// returing the response with file path and name
// 		return res.send({name: myFile.name, path: `/${myFile.name}`});
// 	});


// 	return;

// 	var newName = req.files[0].path+pathLib.parse(req.files[0].originalname).ext;

// 	var multer  = require('multer');
	
// 	// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
// 	var storage = multer.diskStorage({
// 		destination: function (req, file, cb) {
// 			// 接收到文件后输出的保存路径（若不存在则需要创建）
// 			cb(null, './upload/');   
// 		},
// 		filename: function (req, file, cb) {
// 			// 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
// 			cb(null, Date.now() + "-" + file.originalname); 
// 		}
// 	});
	
// 	// 创建文件夹  使用此代码就是为了让我们查找磁盘中是否有该文件夹，如果没有，可以自动创建，而不是我们提前手动创建好。如果不使用此代码，则我们再使用该文件夹之前，需要手动创建好当前问价夹
// 	var createFolder = function(folder){
// 		try{
// 			// 测试 path 指定的文件或目录的用户权限,我们用来检测文件是否存在
// 			// 如果文件路径不存在将会抛出错误"no such file or directory"
// 			fs.accessSync(folder);
// 		}catch(e){
// 			// 文件夹不存在，以同步的方式创建文件目录。
// 			fs.mkdirSync(folder);
// 		} 
// 	};
	
// 	var uploadFolder = './upload/';
// 	createFolder(uploadFolder);

// 	return;
	
// 	// 创建 multer 对象
// 	var upload = multer({ storage: storage });
	
// 	/* POST upload listing. */
// 	router.post('/', upload.single('file'), function(req, res, next) {
// 		var file = req.file;
// 		console.log('文件类型：%s', file.mimetype);
// 		console.log('原始文件名：%s', file.originalname);
// 		console.log('文件大小：%s', file.size);
// 		console.log('文件保存路径：%s', file.path);
// 		// 接收文件成功后返回数据给前端
// 		res.json({res_code: '0'});
// 	});

// 	res.send("hello /picUpload/title");
// });

router.post('/',function(req,res,next)
{
	// var client = redis.createClient(6379, '127.0.0.1');
	// client.auth(123456);  // 如果没有设置密码 是不需要这一步的
    // res.send("hello admin");
	console.log("匹配到最后的 /");
	res.send("匹配到/data/目录？");
	return;
});
module.exports = router;