'use strict'

/** 测试区域 工程内做一些功能验证用的*/
// var verify = require("./utils/verify.js");
// verify();

/** 获取express app 及相关路由设置
 * routes.js 内部定义了基本的路由（controller的路由分流）
*/
var app = require("./routes/routes");


/**添加压缩: 压缩中间件，可以压缩html等信息。 */
const compression = require('compression');
const shouldCompress = (req, res) => {
	/** 出现这个标记，则不进行压缩 */
	if (req.headers['x-no-compression']) {
	  return false;
	}  
	// fallback to standard compression
	return compression.filter(req, res);
  };
  app.use(compression({
	filter: shouldCompress,
	// threshold is the byte threshold for the response body size
	// before compression is considered, the default is 1kb
	threshold: 0
  }));

	var ejs = require('ejs');
	// 配置Express 视图引擎
	 
	app.engine('html', ejs.__express);
	app.set('view engine', 'html');

// var https = require('https');/**提供https服务 */
var http  = require('http');/**nodejs 内部http服务 */
// var fs    = require('fs');
// const fileUpload = require('express-fileupload');
// const cors = require('cors');
var socketIo  = require('socket.io');

//http server
var http_server = http.createServer(app); 

//https server
// var options = {
// 	key  : fs.readFileSync('./cert/5854113_www.adytech.com.key'),
// 	cert : fs.readFileSync('./cert/5854113_www.adytech.com.pem')
// };
// var https_server = https.createServer(options,app);

/**socket IO 可以用来下载图片 */
//socketIo, 
// var io = socketIo(http_server) ;

// io.sockets.on('connection',function (sock) 
// {
// 	var roomid="1222";

// 	console.log('a user connected');
// 	sock.on('disconnect', function(){
// 		console.log('user disconnected');
// 	});
// 	sock.on('chat message', function(msg){
// 		io.emit('chat message', msg);
// 		console.log('message: ' + msg);
// 	});

// 	/**join消息  */
// 	sock.on('join', function(data){
// 		console.log(data);
// 		//用户加入房间
		
// 		sock.join(roomid);
// 		//对房间内的用户发送消息
// 		io.sockets.sockets.in(roomid).emit('system','hello,'+data+'加入了房间');

// 		/** */
// 		sock.emit('some event', { for: 'everyone' });
// 		sock.broadcast.emit('hi');
// 		// socket.join(room); // join one room
// 		// var myroom = io.sockets.adapter.rooms[room];
// 		// var users = Object.keys(myroom.sockets).length;
// 		// socket.emit('joined',room,socket.id);
// 		// socket.to(room).emit('joined',room,socket.id);
// 		// io.in(room).emit('joined',room,socket.id);//all people
// 	    // socket.broadcast.emit('joined',room,socket.id);

// 	});

// 	sock.on('leave',(room)=>{
// 		sock.leave(roomid);
// 		sock.emit('leavehint','you are leave！')
// 	});
// 	/** */
// 	sock.emit('news', { hello: 'world' });

// });

http_server.listen(8090,'0.0.0.0',() => {
	    console.log('server is running at port 8090');
	});

// app.listen(8090, () => {
//     console.log('server is running at port 8090');
// })

// console.log("大家好，程序已经启动了");