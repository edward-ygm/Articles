/******************************************************************************
 * 作者：Edward Yang
 * 说明：客户端Javascript
 * 时间：2021-12
 * vue只支持es6导出模式
*******************************************************************************/
// import { nodeName } from "jquery";
import axios from 'axios';

/** 存储localStorage */
 function setLocal(name, content) {
	if (!name) return;
	if (typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.localStorage.setItem(name, content);
}
/** 获取localStorage */
function getLocal(name) {
	if (!name) return;
	return window.localStorage.getItem(name);
}
/** 删除localStorage */
function removeLocal(name) {
	if (!name) return;
	window.localStorage.removeItem(name);
}
/**临时存储 */
/** 存储 临时 sessionStorage */
function setTmp(name, content) {
	if (!name) return;
	if (typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.sessionStorage.setItem(name, content);
}
/** 获取临时 session Storage */
function getTmp(name) {
	if (!name) return;
	return window.sessionStorage.getItem(name);
}
/**时间函数 */
function getTm(){ return new Date().getTime(); }
function getTmSeconds(){return Math.ceil(getTm()/1000);}
/**返回： 20211203 */
function getTmStr(tm){
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
	let milli=Math.ceil((tm/1000)%86400);
	return year + "" + month + "" + date + '' + milli;
}
function getTmStryyyymmdd(tm){
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
	let milli=Math.ceil((tm/1000)%86400);
	return year + "" + month + "" + date;
}
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



/******************************************************************************
 * 字符串处理
 * 
 ******************************************************************************/
/** 正则表达式 */
/** 对89px当作数值做加减运算*/
function sizeRate (len, rate) {
        //如果输入 100% 89em 等参数，用正则表达式
        /** reg.test(str) 用来验证字符串是否符合正则 符合返回true 否则返回false
         * reg.exec() 用来捕获符合规则的字符串
         * str.match(reg) 如果匹配成功，就返回匹配成功的数组，如果匹配不成功，就返回null
         *  当全局匹配时，match方法会一次性把符合匹配条件的字符串全部捕获到数组中
         * str.replace() 正则去匹配字符串，匹配成功的字符去替换成新的字符串
         * var str = 'a111bc222de';var res = str.replace(/\d/g,'Q');// res="aQQQbcQQQde"
         */
        var pattern = 'px|%|em|ex|ch|rem';
        var flag = 'i';
        var reg = new RegExp(pattern, flag);
        var unit = reg.exec(this.siHeight)[0];/**返回 -3是index位置 */

        return (Math.ceil(parseInt(len) * rate)) + unit;
    }
/**获取url中的参数  https://www.baidu.com?a=1&b=2 url.getUrlparm() {a:1,b2} */
function getUrlparm(url){
        var obj = {};
        var reg = /([^?&#+]+)=([^?&#+]+)/g;
        url.replace(reg,function($0,$1,$2){
            obj[$1] = $2;
        })
        return obj;
}

/******************************************************************************
 * 加解密函数封装库 客户端
 * base64,sha-1,sha-128,sha-256,AES128,AES256,RSA,ECC
 ******************************************************************************/
// Converts a JS string to a UTF-8 "byte" array.
// str: 16-bit unicode string(that is a ).
/** Unicode对应一个字符，2个字节。可以直接用Unicode存储，也可以用UTF-8进行存储。UTF-8是一种存储Unicode的方式，也称之为编码格式。而对于加密及解密而言，不需要考虑这串字节到底是什么东西，只是简单看作一个字节流就可以。不管你字符串如何组织，所有的加解密的输入都是字节串，所有的padding等都有调用函数者字节组装，这样能最小程度避免加解密算法无法对接的问题。
 * 比如'大家好'这三个字，如果是unicode16,为6个字节，而utf-8是9个字节。'abc大家好'如果是unicode16为12字节，而utf-8是11字节。
 * 如果用户输入'abc大家好'用于加密，是以unicode16来拆分还是utf-8拆分呢？所以关键是看算法内部如何处理这个字符串，并转成加密的字节数组。所以，请选用字节数组作为输入输出的加解密API。
 */
/**将JS 字符串转为 UTF-8的字符串，UTF-8是可以1-6个字节。而JS字符是Unicode16字符，每个字固定2个字节 */
function unicode16_to_utf8_byte_array(str) {
	var out = [], p = 0;
	for (var i = 0; i < str.length; i++) {
		var c = str.charCodeAt(i);/**这里的c如果超过256就是超过一个字节 */
		if (c < 128) {
			out[p++] = c;
		} else if (c < 2048) { /**2个字节 */
			out[p++] = (c >> 6) | 192;
			out[p++] = (c & 63) | 128;
		} else if (/**4个字节 */
			((c & 0xFC00) == 0xD800) && (i + 1) < str.length &&
			((str.charCodeAt(i + 1) & 0xFC00) == 0xDC00)) {
			// Surrogate Pair
			c = 0x10000 + ((c & 0x03FF) << 10) + (str.charCodeAt(++i) & 0x03FF);
			out[p++] = (c >> 18) | 240;
			out[p++] = ((c >> 12) & 63) | 128;
			out[p++] = ((c >> 6) & 63) | 128;
			out[p++] = (c & 63) | 128;
		} else {/**3个字节 */
			out[p++] = (c >> 12) | 224;
			out[p++] = ((c >> 6) & 63) | 128;
			out[p++] = (c & 63) | 128;
		}
	}
	return out;
}

//Converts a UTF-8 byte array to JavaScript's 16-bit Unicode.
/**将UTF-8字节的数组，转换成为Unicode16的字符串 */
function utf8_bytes_array_to_unicode16(bytes) {
	var out = [], pos = 0, c = 0;
	while (pos < bytes.length) {
		var c1 = bytes[pos++];
		if (c1 < 128) {
			out[c++] = String.fromCharCode(c1);
		} else if (c1 > 191 && c1 < 224) {
			let c2 = bytes[pos++];
			out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
		} else if (c1 > 239 && c1 < 365) {
			// Surrogate Pair
			let c2 = bytes[pos++];
			let c3 = bytes[pos++];
			let c4 = bytes[pos++];
			let u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) -
				0x10000;
			out[c++] = String.fromCharCode(0xD800 + (u >> 10));
			out[c++] = String.fromCharCode(0xDC00 + (u & 1023));
		} else {
			let c2 = bytes[pos++];
			let c3 = bytes[pos++];
			out[c++] =
				String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
		}
	}
	return out.join('');
}



/**将字节数组转换成对应的字符串，这个字符串是有固定格式的，默认只支持UTF8的 */

/** 以 pks7 标准添加尾部数据, 补了多少个，就填几 */
function addPks7(textBytes, block_size) {
	/**如果textBytes.length=0, plen=block_size。 */
	let plen = block_size - (textBytes.length % block_size);
    let text = Array.from(textBytes);
	for (let i = 0; i < plen; i++) {
		text.push(plen);
	}
	return text;
}
/** 以 pks7 标准删除尾部数据 */
function delPks7(textBytes, block_size) {
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
	var base64_map = str_base64;
	var a = [];
	var i;
	for (i = 0; i <= 122; i++) {
		a.push(0);//empty array
	}
	//var base64_map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=";
	// 45 is the Ascii value of '-', the minimal one. so we create a array from 45-122 about 79 elements
	for (i = 0; i <= 127; i++) {
		a[i] = base64_map.indexOf(String.fromCharCode(i));
	}
	console.log(a);
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

/** sha256 return bytes array*/
// var AES = require("crypto-js/aes");
// var SHA256 = require("crypto-js/sha256");
// var Base64 = require('crypto-js/enc-base64');
// var cryptojs=require("crypto-js");

var aesjs = require('./aesjs');

/**这个是cryptojs的函数 */
function wordToByteArray(word){
	let ret=[],p=0;
	let xx = word.toString();//hex
	for(let i=1;i<xx.length;i=i+2)
	{
		ret[p++]=parseInt('0x'+xx[i-1]+xx[i]);
	}
	return ret;
}

function aes256en(data,key){

	let block_size = 32;/**block size =256/8 */
	let kkey = sha256(key);
	kkey = kkey.slice(0,block_size);/**block size =256/8 */
	let iv=kkey.slice(0,16);/**iv的长度固定位16 */

	let text = aesjs.utils.utf8.toBytes(data);/** 数据需要转换位byteArray */
	text = addPks7(text, block_size);/** 长度对齐 */
	let aesCbc = new aesjs.ModeOfOperation.cbc(kkey, iv);/** 采用CBC的模式 */
	let cdata = aesCbc.encrypt(text);

	let decryptedBytes = aesCbc.decrypt(cdata);

	return cdata;

}
/**输入的必须是已经对齐了的，做合法性判断 */
function aes256de(cdata,key){

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

/** RSA 采用 jsEncrypt.js */
import JSEncrypt from 'jsencrypt';
var sha2 = require('./sha2.js');
var jsrsa=new JSEncrypt();

var SHA256 = require("crypto-js/sha256");
function sha256(str){
	/**这个和nodeJS内部的可以相互匹配 */
	let ret = SHA256(str);
	ret = wordToByteArray(ret);
	return ret;
	// let ret = sha2.sha256(str);
	// return ret;
}

function rsa_pub_encrypt(in_str) {
	// this.rsakey.setPublicKey(pub_key);
	var ret = this.rsakey.encrypt_pub(in_str);
	return ret;
}
function rsa_pub_decrypt(in_str) {
	// var jsen = new JSEncrypt();
	// this.rsakey.setPublicKey(pub_key);
	var ret = this.rsakey.decrypt_pub(in_str);
	return ret;
}
function rsa_pri_encrypt(in_str) {
	// var jsen = new JSEncrypt();
	// this.rsakey.setPrivateKey(pri_key);
	var ret = this.rsakey.encrypt_pri(in_str);
	return ret;
}
function rsa_pri_decrypt(in_str) {
	// var jsen = new JSEncrypt();
	// this.rsakey.setPrivateKey(pri_key);
	var ret = this.rsakey.decrypt_pri(in_str);
	return ret;
}
function prsa_load_pub(pub_key)
{
	this.rsakey.setPublicKey(pub_key);
}
function prsa_load_pri(pri_key)
{
	this.rsakey.setPrivateKey(pri_key);
}

function prsa_hash(str)
{
	return this.rsakey.str_sha256(str);
}

// function prsa_random(len,mode)
// {
// 	len = len || 8;
// 	mode = mode || 'all'; // 'all'->256; 'pw':str_password; 'b64':str_url_base64
// 	if(mode=='pw'){
// 		var clen=str_password.length;
// 		var pw = '';
// 		for(i=0;i<len;i++){
// 			pw = pw + str_password.charAt(Math.floor((Math.random()*clen)));
// 		}
// 		return pw;
// 	}else{
// 		var clen=256;
// 		var pw = '';
// 		for(i=0;i<len;i++){
// 			pw = pw + String.fromCharCode(Math.floor((Math.random()*clen)));
// 		}
// 		return pw;
// 	}
// }

var cryptojs=require("crypto-js");
function sha256_cryptojs(str){
	let x = aesjs.utils.utf8.toBytes(str);

	/**'base64' | 'base64url' | 'hex'; */
	let ret = cryptojs.SHA256(str);
	ret = wordToByteArray(ret);
	return ret;
	// hash.toString(CryptoJS.enc.Base64)
	// hash.toString(CryptoJS.enc.Hex)
}

function randomBytes(len){
	//random 的生成不需要统一，这里是直接生成password的
	var salt = cryptojs.lib.WordArray.random(128 / 8);
	var key128Bits = cryptojs.PBKDF2("Secret Passphrase", salt, {keySize: 128 / 32 });
	return key128Bits;
}


/******************************************************************************
 * axios 的处理函数 
 ******************************************************************************/
// import axios from 'axios'
// const axiosIns = axios.create({
//     baseURL: 'http://localhost:8090',
//     timeout: 10000,
//     header: {
//     'Content-Type': 'application/x-www-form-urlencoded'
//     }});

/** formatData对应的函数 */
function fetchGet(fetchUrl,formData,okFunc,failFunc)
{
	if(!failFunc) failFunc=function(err){console.log(err);}

	// axios.get(fetchUrl, formData)
	// .then(okFunc)
	// .catch(failFunc);
}

function fetchPost(fetchUrl,formData,okFunc,failFunc)
{
	// axios.post(fetchUrl, formData, {
	// 	onUploadProgress: ProgressEvent => {
	// 	  let progress =
	// 		Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100)
	// 		+"%";
	// 	  this.progress = progress;
	// 	}
	//   })
	// .then(okFunc)
	// .catch(failFunc);
}
function fetchToken(token,freturn)
{
	
}

/**这个函数需要重新考虑内部的逻辑... 
 * 当前就仅仅做检查是最合适的
*/
function checkUser(loginData,option,freturn)
{
	// if(loginData==undefined) loginData= this.g.uiInfo["loginData"];
	if(loginData==undefined) return false;
	let url = '/login/refreshToken';

	let email=loginData['email'];
	let st = loginData['status'];
	let tm = loginData['tm'];

	// let tmran = base.cfg.url.retoken;
	let tmran = option["tokenExpireTime"];//失效长度
	let ctm = getTmSeconds();
	let data = {};
	//update by retoken; update by token

	if(st=='N'  && ctm < tm+tmran ){
		freturn(true);
	}else{
		freturn(true);
	}
	// else if(st=='N' && ctm > tm+tmran*0.8 && ctm<tm+tmran ){
	// 	/**更新token，只在这个函数里面更新token */
	// 	data["token"]=loginData["token"];
	// 	data["email"]=loginData["email"];
	// 	axios.post(url,data).then(res=>{
	// 		/**更新数据 */
	// 		freturn(true);
	// 	}).catch(err=>{
	// 		freturn(false);
	// 	})
	// }else {
	// 	/**如果有reToken，则通过reToken获取，否则，跳转到登录界面*/
	// 	data["retoken"]=getLocal("retoken");
	// 	data["email"]=loginData["email"];
	// 	axios.post(url,data).then(res=>{
	// 		/**更新数据 */
	// 		freturn(true)
	// 	}).catch(err=>{
	// 		freturn(false)
	// 	})
	// 	return 
	// }
}




/******************************************************************************
 * 下面都是测试用例，也是函数的使用例子，有空可以多多完善。
 * 
*******************************************************************************/

/** 测试的例子 */
function examPrsa(){

	
	var xx = sha256("qwe");
	/** 测试AES */
	var xxx = aes256en("qwe","asas");/**加密 */
	var yyy = aes256de(xxx,"asas");/**解密 */
	var result = utf8_bytes_array_to_unicode16(yyy);/**转换位uint16的格式 */
	/**放在一行进行测试 */
	utf8_bytes_array_to_unicode16(aes256de(aes256en("sidfm;aisngasdf","fsdf"),"fsdf"));
	utf8_bytes_array_to_unicode16(aes256de(aes256en(utf8_bytes_array_to_unicode16(randomBytes(12)),"fsdf"),"fsdf"));


  /** 显示加密函数 */
	let ciphers=crypto.getCiphers();//展示所有的加解密函数
	console.log(ciphers);
	
}

function examTime(){
	/**时间戳 */
	var x=getTm();
	console.log(x+"毫秒;"+getTmStr(x)+";"+getTmSeconds()+'秒');

	var timestamp = Date.now();
	var timetamp5 = Date.now();                   //结果：1477808630404 
	var timestamp3 = new Date().getTime(); // 结果：1477808630404 ，通过原型方法直接获得当前时间的毫秒值，准确
	var timetamp4 = Number(new Date()) ; //结果：1477808630404 ,将时间转化为一个number类型的数值，即时间戳
	var t1 = new Date("2020/10/10 09:11:20");
	t1.getTime();
}

/**应用例子 */
function examples(){
	examPrsa();
	console.log("测试完成");
}
export {
	/**ui端存储函数 */
	setLocal,getLocal,removeLocal,setTmp,getTmp, 
	/** 数组操作函数 */
	unicode16_to_utf8_byte_array,
	utf8_bytes_array_to_unicode16,
	/**时间相关函数 */
	getTm,getTmSeconds,getTmStr,getTmStryyyymmdd,
	/**加密相关的辅助函数 */
	gen_base64_mapping_array,
	addPks7,delPks7,base64,base64decode,ByteArray_to_ByteString,ByteString_to_ByteArray,base64ba,
	/**加解密函数 */
	sha256,aes256en,aes256de,
	/** 业务相关的函数 */
	fetchGet,fetchPost,
	checkUser,/**日常的检查用户的合法性（内部完成token或retoken的更新） */
    examples,/** 默认输出一个test 函数，用于提供基本用法的例子 */
}