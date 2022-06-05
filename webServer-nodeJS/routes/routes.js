'use strict'
/**本文件主要是设置路由信息
   静态页面在./public
   文件服务器在./public/ftp。这个目录下的就是一个文件服务器
*/
const path = require('path');
const fs = require('fs');

const express = require('express');
var app = express();

// 往往一个配置出问题，就会出很大的问题
//这里应该是 "./dist"而不是"../dist"
app.use(express.static('./dist'));//缺省的静态页面的目录


// var serveIndex = require('serve-index');/**serve-index的功能是将文件夹中文件列表显示到浏览器中。可以不需要 */

/**允许读取formData数据 */
const bodyParser = require('body-parser');
app.use(bodyParser.json({limit:'1000000kb'}));//数据JSON类型
app.use(bodyParser.urlencoded({ limit:'1000000kb', extended: true }));//解析post请求数据

/**文件上传 */
const fileUpload = require('express-fileupload');
const cors = require('cors')
//指定public 可以作为文件服务器，显示文件列表

//指定静态页面位置
app.use(cors()); // it enables all cors requests 使用跨域模块
app.use(fileUpload()); //使用文件上传模块

app.use(express.json());    
app.use(express.urlencoded({ extended: false }));


/*设置子路由，这部分是路由中很重要的一个步骤*/
var admin = require('./admin');
var seccomm = require('./seccomm');
var data = require('./data');
var examp = require('./example');
var login = require('./login');
// var root = require('./root');

app.use('/admin', admin);
app.use('/data', data);
app.use('/seccomm', seccomm);
app.use('/examp', examp);
app.use('/login', login);


/** 使用html模板 (感觉使用了vue后，就不需要这个视图引擎了) */
// 处理文件路径的模块
// const path = require("path");
// console.log("basepath="+path);

// view处理
// app.set("views", path.join(__dirname, "../views")); //
// app.set("view engine", "ejs");//这个是使用ejs引擎
// var ejs=require('ejs');
// app.engine('html', ejs.__express);
// app.set('view engine', 'html');//设置视图引擎

// 定义一个存放静态资源的目录 //这个还不清楚和public这个static之间的关系。
// app.use(express.static("src"));

// app.use(express.static('./public/ftp'));//ftp用的
// app.use(serveIndex('./public/ftp'));


/**设置超级路由，所有的路由都先通过该路由处理
 * 首先解决跨域问题
*/
// app.all("*", function(req, res, next) {
//    console.log("-----10");
//    // response.writeHead(200, { "Content-Type": "text/plain" });
//    res.header("Access-Control-Allow-Credentials","true");
//    res.header("Access-Control-Allow-Origin","*");
//    res.header("Access-Control-Allow-Methods","PUT, GET, POST, DELETE, OPTIONS");
//    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
//    // console.log(path.join(__dirname, "views"));
//    next();
//  });
//设置一级路由




app.post('/upload', (req, res) => {

   console.log("reach /upload");

   if (!req.files) {
       return res.status(500).send({ msg: "file is not found" })
   }
       // accessing the file
   const myFile = req.files.file;

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

/** 这里面是基本的测试函数 */
app.get("/test", function(req, res,next) {
   
      /**重定向到route */
      var vv="/admin/yyr1d";
      console.log("启动匹配"+vv);
      res.redirect(vv);
      return;
   /**发送文字等信息 */
   res.send("hello---");
   return;
   /**重定向到public下的html */
   res.redirect("a.html");

   
   // console.log(req.body);
   // console.log(req.cookies);
   // console.log(req.params);
   // res.render("login.html",{});
});

// 放在最后面，可以匹配到所有没有匹配到的结果
app.get("*",function(req,res,next)
{
    console.log(" 进入到 /* 目录")
    res.render(path.resolve(__dirname, '../dist/index.html'), { title: '--' });
    // const html = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8')
    // res.send(html)

    // res.render('mplat/index.html', { title: 'DisCloudDisk' });

// 	// 输出 JSON 格式
//    console.log(" 访问 /index.html");
//    var response = {
//        "first_name":req.query.first_name,
//        "last_name":req.query.last_name
//    };
//    console.log(response);
   
//    res.send(JSON.stringify(response));
});

//指定二级路由
// app.use('/',root);//根目录下跳转子路由，建议不设置任何路由
// app.use('/admin',admin);
//安全的命令执行（用于执行服务器端的一些常用调试命令，这里需要有严格的授权）
// app.use('/seccomm',seccomm);
//数据服务，主要用户各类数据接口及控制接口
// app.use('/data',data);
//例子
// app.use('/examples',examp);

module.exports = app;