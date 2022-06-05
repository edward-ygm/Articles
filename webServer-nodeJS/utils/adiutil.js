/******************************************************************************
 * 作者：Edward Yang
 * 说明：服务端Javascript
 * 时间：2021-12
*******************************************************************************/
/** 存储localStorage */
 var setLocal = (name, content) => {
	if (!name) return;
	if (typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.localStorage.setItem(name, content);
}
/** 获取localStorage */
var getLocal = function(name) {
	if (!name) return;
	return window.localStorage.getItem(name);
}
/** 删除localStorage */
var removeLocal = function(name) {
	if (!name) return;
	window.localStorage.removeItem(name);
}
/**临时存储 */
/** 存储 临时 sessionStorage */
var setTmp = (name, content) => {
	if (!name) return;
	if (typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.sessionStorage.setItem(name, content);
}
/** 获取临时 session Storage */
var getTmp = function(name) {
	if (!name) return;
	return window.sessionStorage.getItem(name);
}

/**时间函数 */
var getTm=function(){ return new Date().getTime(); }
var getTmSeconds=function(){return Math.ceil(getTm()/1000);}
/**转换2010-03,2010/03,2010,03\ 为标准的时间（int） */
var getBirthInt=function(yyyymm){
	let n=yyyymm.replace('-','/').replace(',','/');
	let day=new Date(Date.parse(n)); 
	return Math.ceil(day.getTime()/1000);
}
/**标准时间转换为 2010-10的格式 */
var getBirthStr=function(tm){
	 let day=new Date(tm);
     let year= day.getFullYear(); 
     let month=day.getMonth();
     month = month < 10 ?  "0" + month : month ;
     return year+"/"+month;
}
/**获取年月日+当天的秒数。 这个主要作为文章的ID来使用*/
var getTmStr=function(tm){
	let datetime=new Date(tm);
	let year = datetime.getFullYear();
	let month = datetime.getMonth()+1;//js从0开始取 
	let date = datetime.getDate(); 
	// let hour = datetime.getHours(); 
	// let m = datetime.getMinutes();
	// let s = datetime.getSeconds();
	// let mm = datetime.getMilliseconds();
	month = month < 10 ?  "0" + month : month ;
	date  = date<10 ?  "0" + date : date;
	// hour  = hour <10 ? "0" + hour : hour;
	let seconds=Math.ceil((tm/1000)%86400);
	return year + "" + month + "" + date + '' + seconds;
}

/******************************************************************************
 * 加解密函数封装库
 * base64,sha-1,sha-128,sha-256,AES128,AES256,RSA,ECC
 ******************************************************************************/
// Converts a JS string to a UTF-8 "byte" array.
// str: 16-bit unicode string.
function string_to_utf8_byte_array(str) {
	var out = [], p = 0;
	for (var i = 0; i < str.length; i++) {
		var c = str.charCodeAt(i);
		if (c < 128) {
			out[p++] = c;
		} else if (c < 2048) {
			out[p++] = (c >> 6) | 192;
			out[p++] = (c & 63) | 128;
		} else if (
			((c & 0xFC00) == 0xD800) && (i + 1) < str.length &&
			((str.charCodeAt(i + 1) & 0xFC00) == 0xDC00)) {
			// Surrogate Pair
			c = 0x10000 + ((c & 0x03FF) << 10) + (str.charCodeAt(++i) & 0x03FF);
			out[p++] = (c >> 18) | 240;
			out[p++] = ((c >> 12) & 63) | 128;
			out[p++] = ((c >> 6) & 63) | 128;
			out[p++] = (c & 63) | 128;
		} else {
			out[p++] = (c >> 12) | 224;
			out[p++] = ((c >> 6) & 63) | 128;
			out[p++] = (c & 63) | 128;
		}
	}
	return out;
};

//Converts a UTF-8 byte array to JavaScript's 16-bit Unicode.
function utf8_bytes_array_to_string(bytes) {
	var out = [], pos = 0, c = 0;
	while (pos < bytes.length) {
		var c1 = bytes[pos++];
		if (c1 < 128) {
			out[c++] = String.fromCharCode(c1);
		} else if (c1 > 191 && c1 < 224) {
			var c2 = bytes[pos++];
			out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
		} else if (c1 > 239 && c1 < 365) {
			// Surrogate Pair
			var c2 = bytes[pos++];
			var c3 = bytes[pos++];
			var c4 = bytes[pos++];
			var u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) -
				0x10000;
			out[c++] = String.fromCharCode(0xD800 + (u >> 10));
			out[c++] = String.fromCharCode(0xDC00 + (u & 1023));
		} else {
			var c2 = bytes[pos++];
			var c3 = bytes[pos++];
			out[c++] =
				String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
		}
	}
	return out.join('');
};
/** 以 pks7 标准添加尾部数据, 补了多少个，就填几 */
var addPks7 = function (textBytes, block_size) {
	/**如果textBytes.length=0, plen=block_size。 */
	let plen = block_size - (textBytes.length % block_size);
    let text = Array.from(textBytes);
	for (let i = 0; i < plen; i++) {
		text.push(plen);
	}
	return text;
}

/** 以 pks7 标准删除尾部数据 */
var delPks7 = function (textBytes, block_size) {
	var plen = textBytes[textBytes.length - 1];
	let text = Array.from(textBytes);
	for (var i = 0; i < plen; i++) {
		text.pop();
	}
	return text;
}

/**base64 自定义 */
/**本加解密所用的base64字符串 去除/的原因是/是路径符号 
 * + / = % ? # &
*/
var str_base64 ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$@.";//$ 36,%37
var url_base64_map = [62, -1, -1, -1, -1, -1, -1, -1, -1, -1, 64, -1, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, 63, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51];
/**标准的base64字符串 */
var str_base64_std ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";//$ 36,%37
var url_base64_map_std = [-1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, 64, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51];

/** base64(in_str) 则采用url可用字符串，否则采用'std'模式
 * 根据下面的代码，这里的in_str指的是单字节的str，不是unicode16编码的单字节string
 * 
 * String.fromCharCode()方法的返回值为String类型，其返回值为Unicode数值所表示的字符串。
 */
function base64(in_str,str_map) {
	var base64_map;
	if(str_map && str_map=='std') {
		base64_map = str_base64_std;
	}else{
		/**默认格式，同时这个格式不添加后面的 = */
		base64_map = str_base64;
	}
	//get away utf8, stay away from ++ or -- .
	var o = "";
	let c1, c2, c3, e1, e2, e3, e4,i;

	for ( i = 2; i < in_str.length; i += 3) {
		c1 = in_str.charCodeAt(i - 2);
		c2 = in_str.charCodeAt(i - 1);
		c3 = in_str.charCodeAt(i);
		e1 = c1 >> 2; //first  6 bits
		e2 = (c1 & 3) << 4 | c2 >> 4; // second 6 bits
		e3 = (c2 & 15) << 2 | c3 >> 6; // third 6 bits
		e4 = c3 & 63;//forth 6 bits
		// if (isNaN(c2)) {
		// 	e3 = e4 = 64;
		// } //what is a NaN.??? forgot about those strange things.
		// else if (isNaN(c3)) {
		// 	e4 = 64;
		// }
		// is + efficient? it is ok just use + to concat them.
		o += base64_map.charAt(e1) + base64_map.charAt(e2) + base64_map.charAt(e3) + base64_map.charAt(e4);
	}
	console.log(i);
	if(in_str.length % 3 == 1){
		/**多出一个字节 8=6+2*/
		c1 = in_str.charCodeAt(in_str.length - 1 );
		// c2 = in_str.charCodeAt(i + 2);
		e1 = c1 >> 2; //first  6 bits
		e2 = (c1 & 3) << 4; // second 6 bits 2bit+0000
		o += base64_map.charAt(e1) + base64_map.charAt(e2);
		// console.log(c1,e1,e2,o);
	}else if(in_str.length % 3 == 2){
		/**多出2个字节 16=6+6+4 */
		c1 = in_str.charCodeAt(in_str.length - 2 );
		c2 = in_str.charCodeAt(in_str.length - 1);
		e1 = c1 >> 2; //first  6 bits
		e2 = (c1 & 3) << 4 | c2 >> 4; // second 6 bits
		e3 = (c2 & 15) << 2; // third 6 bits
		o += base64_map.charAt(e1) + base64_map.charAt(e2) + base64_map.charAt(e3);
		// console.log(c1,c2,e1,e2,e3,o);
	}
	// if (o.length > 0) {
	// 	if (String.fromCharCode(o[o.length - 1]) == 0) {
	// 		o[o.length - 1] = '=';
	// 	}
	// 	if (String.fromCharCode(o[o.length - 2]) == 0) {
	// 		o[o.length - 2] = '=';
	// 	}
	// }
	return o;
}

function base64decode(in_str,array_map) {
	var base64_map_array;
	if(array_map && array_map=='std') {
		base64_map_array = url_base64_map_std;
	}else{
		base64_map_array = url_base64_map;
	}

	var start_pos=36;
	var o = "";
	var c1, c2, c3;
	var e1, e2, e3, e4;

	// what this re? don't do that inefficient things. Open source is free but only free.
	//    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
	for (var i = 3; i < in_str.length; i += 4) {
		e1 = base64_map_array[in_str.charCodeAt(i - 3) - start_pos];//get the position in base64_map= "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
		e2 = base64_map_array[in_str.charCodeAt(i - 2) - start_pos];
		e3 = base64_map_array[in_str.charCodeAt(i - 1) - start_pos];
		e4 = base64_map_array[in_str.charCodeAt(i - 0) - start_pos];

		c1 = 0xff & ((e1 << 2) | (e2 >> 4));
		c2 = 0xff & ((e2 << 4) | e3 >> 2);
		c3 = 0xff & ((e3 & 3) << 6 | e4);
		o += String.fromCharCode(c1);
		o += String.fromCharCode(c2);
		o += String.fromCharCode(c3);
	}
	if(in_str.length % 4 == 3){
		/** 多出两个字符 */
		e1 = base64_map_array[in_str.charCodeAt(in_str.length - 3) - start_pos];//get the position in base64_map= "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
		e2 = base64_map_array[in_str.charCodeAt(in_str.length - 2) - start_pos];
		e3 = base64_map_array[in_str.charCodeAt(in_str.length - 1) - start_pos];

		c1 = 0xff & ((e1 << 2) | (e2 >> 4));
		c2 = 0xff & ((e2 << 4) | e3 >> 2);
		o += String.fromCharCode(c1);
		o += String.fromCharCode(c2);

	}else if(in_str.length % 4 == 2){
		/**多出一个字符 */
		e1 = base64_map_array[in_str.charCodeAt(in_str.length - 2) - start_pos];//get the position in base64_map= "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
		e2 = base64_map_array[in_str.charCodeAt(in_str.length - 1) - start_pos];

		c1 = 0xff & ((e1 << 2) | (e2 >> 4));
		o += String.fromCharCode(c1);
	}else{
		/**出错了 */
	}
	return o;
}

/**一般解密后都是byteArray，所以支持一个ba为输入的base64 */
var base64ba=function(ba){
	return base64(ByteArray_to_ByteString(ba));
}

// this is the help function, to generate base64_map_array by the base64_map.
function gen_base64_mapping_array() {
	var base64_map = url_base64_map;
	var a = [];
	var i;
	for (i = 36; i <= 122; i++) {
		a.push(0);//empty array
	}
	//var base64_map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=";
	// 45 is the Ascii value of '-', the minimal one. so we create a array from 45-122 about 79 elements
	for (i = 36; i <= 122; i++) {
		a[i - 36] = base64_map.indexOf(String.fromCharCode(i));
	}
	console.log(a);
}

/** sha256 return bytes array*/
var crypto=require("crypto");
/** crypto的sha256是可以和其他的互通 */
var sha256=function(str){
	const hash = crypto.createHash('sha256');
	hash.update(str);
	/**'base64' | 'base64url' | 'hex'; */
	return hash.digest();
}
var randomBytes=function(len){
	if(!len)len=32;
	return crypto.randomBytes(len);
}

/** Bytes Array 转换为 byte string，也即string都是由0-255值组成的。
 *  这个就当作例子了吧
 */
 function ByteArray_to_ByteString(ba)
 {
	 var str="";
	 for(var i=0;i<ba.length;i++)
	 {
		 str+=String.fromCharCode(ba[i]);
	 }
	 return str;
 }
 /**如下的输入只能是字节字符串，不是可读的unicode16 */
 function ByteString_to_ByteArray(str)
 {
	 /** 这里需要说明一下，下面两个函数是无法达到类似的效果
	  * str.split(""); 或 Array.from(str);这两个语句只是将数值转换成字符串，比如231转换为['2','1','3'] */
	 var ret=[];
	 for(var i=0;i<str.length;i++){
		 ret[i]=(str.charCodeAt(i))&255; 
	 }
	 return ret;
 }

var aesjs = require('./aesjs');
var aes256en=function(data,key){
	let block_size = 32;/**block size =256/8 */
	let kkey = sha256(key);
	kkey = kkey.slice(0,block_size);/**block size =256/8 */
	let iv=kkey.slice(0,16);/**iv的长度固定位16 */

	let text = aesjs.utils.utf8.toBytes(data);/** 数据需要转换位byteArray */
	text = addPks7(text, block_size);/** 长度对齐 */
	let aesCbc = new aesjs.ModeOfOperation.cbc(kkey, iv);/** 采用CBC的模式 */
	let cdata = aesCbc.encrypt(text);
	//let decryptedBytes = aesCbc.decrypt(cdata);/**只是用于测试 */

	return cdata;
}
var aes256de=function(cdata,key){
	let block_size = 32;/**block size =256/8 */
	if(cdata.length%block_size !=0 ) return [];

	let kkey = sha256(key);
	kkey = kkey.slice(0,block_size);/**block size =256/8 */
	let iv=kkey.slice(0,16);/**iv的长度固定位16 */

	let aesCbc = new aesjs.ModeOfOperation.cbc(kkey, iv);/** 采用CBC的模式 */
	let data = aesCbc.decrypt(cdata);
	data = delPks7(data, block_size);/** 长度对齐 */

	return data;
}
/** nodejs自带：aes加密：所有都是字节数值
 * key必须是加密算法的长度128是16，256是32。iv的长度固定是16字节 */
var aes256en_nj=function(data,key){
	/**key的长度必须是256/8=32字节 */
	let block_size = 32;
	let kkey = sha256(key);
	kkey = kkey.slice(0,block_size);
	const algorithm = 'aes-256-cbc';
	// const iv = crypto.randomBytes(32);//随机的东西不太好
	let iv=kkey.slice(0,16);

	const cipher = crypto.createCipheriv(algorithm, kkey, iv);
	var x = cipher.update(data);
	var ret = cipher.final();
	// const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
	// return ret.toString('hex');
	return ret;
}
/**解密。同加密函数 Nodejs 自带的*/
var aes256de_nj=function(cdata,key){
	/**key的长度必须是256/8=32字节 */
	let block_size = 32;
	let kkey = sha256(key);
	kkey = kkey.slice(0,block_size);
	const algorithm = 'aes-256-cbc';
	// const iv = crypto.randomBytes(16);//iv一直都是16位
	let iv=kkey.slice(0,16);

	const decipher = crypto.createDecipheriv(algorithm, kkey, iv);
	var x = decipher.update(cdata);
	var ret = decipher.final();
	// const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
	// return ret.toString('hex');
	return ret;
}

/******************************************************************************
 * Redis
 * 
*******************************************************************************/
// var example_redis=function(){
// 	var redis = require("redis");

// 	var obj={xx:'ss',pw:'ss'}

// 	var client = redis.createClient(6379, '127.0.0.1');
// 	client.auth(123456);  // 如果没有设置密码 是不需要这一步的
	
// 	client.on('connect', function () {
// 		console.log("hello");
// 	})

// 		// set 语法(键值对)
// 		client.set('name', 'long', function (err, data) {
// 			console.log(data)
// 		})

// 	    // get 语法
// 		client.get('name', function (err, data) {
// 			console.log(data)
// 		})

// 		/**Redis链表类似JS数组，lpush向链表中添加值，
// 		 * lrange获取参数start和end范围内的链表元素, 参数end为-1，表明到链表中最后一个元素。
// 		 *  */
// 		client.lpush('class',1,function (err,data) {
// 			console.log(data)
// 		})
// 		client.lrange('class',0,-1,function (err,data) {
// 			console.log(data)
// 		})

// 		/**哈希表有点类 */
// 		client.hmset('kitty', {
// 			'age': '2-year-old',
// 			'sex': 'male'
// 		  }, redis.print);
		
// 		client.hset("dd",'long', function (err, data) {
// 			console.log(data)
// 		})
// 		client.hget('kitty', 'age', function(err, value) {
// 			if (err) throw err;
// 			console.log('kitty is ' + value);
// 		  });
// 		client.hkeys('kitty', function(err, keys) {
// 			if (err) throw err;
// 			keys.forEach(function(key, i) {
// 			  console.log(key, i);
// 			});
// 			client.quit();
// 		  });

// 		  /**Redis超越了数据存储的传统职责，它还提供了信道，信道是数据传递机制，提供了发布/预定功能。 */
// 		var clientA = redis.createClient(6379, '127.0.0.1')
// 		var clientB = redis.createClient(6379, '127.0.0.1')
// 		clientA.on('message', function(channel, message) {
// 			console.log('Client A got message from channel %s: %s', channel, message);
// 		});
// 		clientA.on('subscribe', function(channel, count) {
// 			clientB.publish('main_chat_room', 'Hello world!');
// 		});
// 		clientA.subscribe('main_chat_room');
// }

/******************************************************************************
 * Mysql
 * 
*******************************************************************************/
// function mysqlData(objHost,sql,callback,add=null){
//     let mysql = require('mysql');
//     var connection = mysql.createConnection(objHost);
//       connection.connect();
//       //增删改查
//       if(add != null){
//         connection.query(sql,add,callback);
//       }else{
//         connection.query(sql,callback);
//       }
//       connection.end(); 
// }
/**let host = {
    host     : '192.168.199.154',
    user     : 'root',
    password : 'c123321',
    database : 'forums'
  };
  
 　let express=require('express');
let data = require('./modules/data');
let host = {
    host     : '192.168.199.154',
    user     : 'root',
    password : 'c123321',
    database : 'forums'
  };
//写个接口
app.get('/',function(req,res){
    data(host,'SELECT * FROM BBStopic',function(err, results) { 
        if (err) { 
          throw err; 
        } 
        if(results){
            res.status(200);
            res.json(results);
        }          
      }) 
});
 */

/******************************************************************************
 * 发送邮件
 ******************************************************************************/
 const nodemailer = require('nodemailer'); //引入模块
 let transporter = nodemailer.createTransport({
	 //node_modules/nodemailer/lib/well-known/services.json  查看相关的配置，如果使用qq邮箱，就查看qq邮箱的相关配置
	 service: 'qq', //类型qq邮箱
	 port: 465,
	 secure: true, // true for 465, false for other ports
	 auth: {
		 user: 'ygm_edward@qq.com', // 发送方的邮箱
		 pass: 'jpyztpnqbuoxdahg' // smtp 的授权码
	 }
 });
 //pass 不是邮箱账户的密码而是stmp的授权码（必须是相应邮箱的stmp授权码）
 //邮箱---设置--账户--POP3/SMTP服务---开启---获取stmp授权码
 
 function sendMail(mail, mailSubject, mailHtml) {
	 if(!mailSubject)mailSubject="您好";
	 // 发送的配置项
	 let mailOptions = {
		 from: '"Adiyun tech" <ygm_edward@qq.com>', // 发送方
		 to: mail, //接收者邮箱，多个邮箱用逗号间隔
		 subject: mailSubject, // '欢迎来到"Express-demo"', // 标题
		 text: 'Hello world?', // 文本内容
		 html: mailHtml, //'<p>这里是"Express-demo"详情请点击:</p><a href="https://www.jianshu.com/u/5cdc0352bf01">点击跳转</a>', //页面内容
		//  attachments: [{//发送文件
		//       filename: 'a.txt', //文件名字
		//       path: 'D:\\', //文件路径
		//   },
		//   {
		//       filename: 'sendEmail.js', //文件名字
		//       content: 'dfasdgasdfasdgadf' //文件路径
		//   }
		//  ]
	 };
 
	 //发送函数
	 transporter.sendMail(mailOptions, (error, info) => {
		 if (error) {
			 console.log(error);
		 } else {
			console.log(info); //因为是异步 所有需要回调函数通知成功结果
		 }
	 });
 }

 /**tokenCheck */
 var checkToken=function(email,token){
	 return true;
 }
 var exampleEmail=function(){
	 /** Test OK */
	sendMail("adiyun_tech@aliyun.com","comm hello","<p>Hi <p>");
 }

/******************************************************************************
 * Json
 * 
*******************************************************************************/
var exampleJson=function(){
   /**Json to object */
   var json=`{key:value,jian:jxx}`;
   var obj = JSON.parse(json);
   var str = JSON.stringify(obj);
   /**对象遍历 */
   var obj1={a:'x',b:'y'};
   for(var val in obj1){
	   console.log(val);
	   console.log(obj1[val]);
   }
   /** 数组 */
   let packJson=['af',12,34];
   for (var p in packJson) {//遍历json数组时，这么写p为索引，0,1
	 console.log(p);
   }
   for (let i=0;i<packJson.length;i++) {//遍历json数组时，这么写p为索引，0,1
	console.log(packJson[i]);
  }
}
/******************************************************************************
 * 下面都是测试用例，也是函数的使用例子，有空可以多多完善。
 * 
*******************************************************************************/

/** 采用Nodejs自带的模块 */
var examPrsa=function(){

	/** 测试AES */
	console.log(sha256("qwe"));
	var xxx = aes256en("qwe","asas");/**加密 */
	var yyy = aes256de(xxx,"asas");/**解密 */
	var result = utf8_bytes_array_to_string(yyy);/**转换位uint16的格式 */
	/**放在一行进行测试 */
	utf8_bytes_array_to_string(aes256de(aes256en("sidfm;aisngasdf","fsdf"),"fsdf"));
	utf8_bytes_array_to_string(aes256de(aes256en(utf8_bytes_array_to_string(randomBytes(12)),"fsdf"),"fsdf"));


  /** 显示加密函数 */
	let ciphers=crypto.getCiphers();//展示所有的加解密函数
	console.log(ciphers);

}

var examTime=function(){
	/**时间戳 */
	var x=getTm();
	console.log(x+"毫秒;"+getTmStr(x)+";"+getTmSeconds()+'秒');

	var timestamp = Date.now();
	var timetamp5 = Date.now();                   //结果：1477808630404 
	var timestamp3 = new Date().getTime(); // 结果：1477808630404 ，通过原型方法直接获得当前时间的毫秒值，准确
	var timetamp4 = Number(new Date()) ; //结果：1477808630404 ,将时间转化为一个number类型的数值，即时间戳
	var t1 = new Date("2020/10/10 09:11:20");
	t1.getTime();
	/** */
  	//new Date("month dd,yyyy hh:mm:ss");
	// var box = new Date(Date.parse('6/13/2011'));//Mon Jun 13 2011  00:00:00  GMT+0800 
    // var box = new Date('6/13/2011'); //直接传入，Date.parse()后台被调用
}

/**应用例子 */
function examples(){
	// examPrsa();
	//example_redis();
	exampleEmail();
	console.log("测试完成");
}

module.exports = {
	/**ui端存储函数 */
	setLocal,getLocal,removeLocal,setTmp,getTmp, 
	 /** 时间函数 */
	getTm,getTmSeconds,getTmStr,getBirthInt,getBirthStr,
	/** 数组操作函数 */
	utf8_bytes_array_to_string,string_to_utf8_byte_array,ByteArray_to_ByteString,ByteString_to_ByteArray,
	/**加密相关的辅助函数 */
	addPks7,delPks7,base64,base64decode,randomBytes,base64ba,
	/**加解密函数 */
	sha256,aes256en,aes256de,
	/**发送Email */
	sendMail,
	/**检查函数 */
	checkToken,
	/**例子函数 */
    examples: examples,/** 默认输出一个test 函数，用于提供基本用法的例子 */
};
