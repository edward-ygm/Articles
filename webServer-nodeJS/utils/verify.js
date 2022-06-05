/**这个文件是专门用于验证 ， 或者说测试用例集合*/
var compress=require("./compress.js");
// var datapath="D:/03-Git/artRepo/artRepo/01-artHtml/01-nodejs/webserver/utils/data/";
var datapath="D:/03-Git/artRepo/artRepo/01-artHtml/01-nodejs/webserver/utils";

var test=require("./adiutil.js");
// var test=require("./datafetch.js")

var examp=function(){
    console.log("启动测试，测试内容可以自定义");

    // console.log("1、启动zip测试");
    // test.examples();

    // console.log("1、启动data测试");
    test.examples();
}

module.exports = examp ;