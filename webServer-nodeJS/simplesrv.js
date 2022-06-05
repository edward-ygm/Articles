'use strict'


var express = require('express');
var app = express();

app.use(express.static('./dist'))

app.get('/', function (req, res) {
	console.log("/")
  res.send('Hello World!');
});
app.get('/admin', function (req, res) {
	console.log("admin")
  res.send('Hello World! admin');
});
app.get('*', function (req, res) {
	console.log("*-ca")
  console.log(req.params)
  res.send('Hello World! *');
});
var server = app.listen(8090, "0.0.0.0", function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});


// var express=require('express');
// var router=express.Router();
// var app = express();

// // app.use(express.static('../dist'));//缺省的静态页面的目录

// router.use('/',function(req,res,next)
// {
//   res.send("hello all");
// });

// var http  = require('http');/**nodejs 内部http服务 */

// //http server
// var http_server = http.createServer(app); 


// http_server.listen(8090,'0.0.0.0',() => {
// 	    console.log('server is running at port 8090');
// });
