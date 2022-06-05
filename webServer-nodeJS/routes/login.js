'user strict'
var express=require('express');
var router=express.Router();
var fetch = require('../utils/datafetch.js');
var util = require("../utils/adiutil.js");
var base = require("../utils/base.js");
const { randomBytes } = require('../utils/adiutil.js');

/** login as users */
router.post('/login', (req, res) => {
    /**获取参数并根据tm判断当前是否可以响应该login请求（允许在1分钟内的请求）
     * 可以用的基本上也只有 req.body, req.ip 两个有意义。
     */
    let data = req.body;
    let tm = util.getTmSeconds();
    /** 5分钟以外的登录消息不处理 */
    if(tm - data.tm > 300){return;}
    let guid = data.guid;
    let email = data.email;
    let datatm = data.tm;
    let pw = data.pw;
    /** 找到guid 前首先要检查guid 是否有攻击性字符*/
    if(fetch.checkStr(email) && fetch.checkStr(data.pw)){
        fetch.fetchUserlogin(email,function(resObj){ //这个就是success函数
            /**找到了对应的参数，设置登录状态为已经登录 
             * 生成token，并将token发送给客户端。客户端必须保存token，每次涉及到需要用户的
             * 时候都需要携带该token。token放在redis内，限定更新时间为10分钟。
             * token内存放：用户基本信息，用户组，用户权限(userInfo)
            */
           if(resObj.status != 'N'){
               res.writeHead(200,{'Content-type':'application/json'});
               res.end({Info:"无法找到用户"});
               return;
           }

            // 客户端的加密
            // let fhash=util.sha256(this.email+this.password);
            // let shash=util.sha256(fhash+data.tm);/**当前为字节数组 */
            // data.pw = util.base64(util.ByteArray_to_ByteString(shash));
            // 服务端在signup时的password
            // let fhash=util.sha256(this.email+this.password);
            // data.pw = util.base64(util.ByteArray_to_ByteString(fhash));
            // 本端的验证
           let serverPw=util.base64decode(resObj.pw)
           let strPw = serverPw + data.tm;
           let serverPwSec = util.base64(util.ByteArray_to_ByteString(util.sha256(strPw)))


           if(serverPwSec == data.pw){
            //    登录 成功，啥也不做，你们继续
           }else{
                //    登录 失败
                res.writeHead(200,{'Content-type':'application/json'});
                res.end('{Info:"用户或密码错误"}');
                return;
           }
           
           /**生成access token */
           let token=util.base64ba(util.randomBytes(5))
                    +util.base64ba(util.sha256(tm+data.email+data.pw));
           /**生成refresh Token */
           let reToken=util.base64ba(util.randomBytes(7))
                    +util.base64ba(util.sha256(tm+data.email+data.pw));
            /**token可能会冲突，冲突后，会生成一个新的，如果新的也冲突，让客户重新登录一下。 */
            try{
                fetch.setreToken(reToken,token,data,function(nretoken,ntoken)
                {
                    /**将refresh token及临时token写入到返回给前端 */
                    delete resObj.pw;
                    let ret = {'Info':"欢迎您"+resObj.nickName,'data':resObj,'token':ntoken,'reToken':nretoken,'st':'ok'};
                    res.writeHead(200,{'Content-type':'application/json'});

                    res.end(JSON.stringify(ret));
                    /**write into History */
                    return;
                });
            }catch(erra){
                res.writeHead(200,{'Content-type':'application/json'});
                res.end('{Info:"安全考虑，请您重新试一下"}');
                console.log("token is conflicted");
                return;
            }
        },function(err)
        {
            /**  没有找到数据或异常，什么也不做？ */
            res.writeHead(200,{'Content-type':'application/json'});
            res.end('{Info:"用户或密码错误"}');
            console.log(err);
            return;
        });
    }

    console.log("enter /login/login");

    /**取出数据库中的信息（先redis，再mysql） */

    /**返回Json数据 （由客户端的vue跳转到home界面）*/

});
/**sign up */
router.post('/signup', (req, res) => {
    /**获取参数并根据tm判断当前是否可以响应该login请求（允许在1分钟内的请求）
     * 可以用的基本上也只有 req.body, req.ip 两个有意义。
     */
         let data = req.body;
         let tm = util.getTmSeconds();
         /** 5分钟以外的登录消息不处理 */
         if(tm - data.tm > 300){return;}
         let nickName = data.nickName;
         let email = data.email;
         data.birthyear = util.getBirthInt(data.birthyear);

         /** 找到guid 前首先要检查guid 是否有攻击性字符*/
         if(fetch.checkStr(nickName) &&fetch.checkStr(email)&& fetch.checkStr(data.pw)){
             /** 采用fetch模块获取数据 */
            fetch.signupData(data
                ,function(resSign){
                /**如果没有找到Email ,
                 *生成Email的注册连接，限制时间为30分钟。
                */
                var loginLink = util.base64ba(util.randomBytes(7))
                               +util.base64ba(util.sha256(data.email+data.tm+data.pw));
                
                //将数据类型做调整
                // data.birthyear = util.getBirthInt(data.birthyear);
                fetch.setEmailLink(loginLink,data);
                /**发送消息到当前的新Email，然后退出 */
                let mails=`<p>请点击如下连接以激活注册（30分钟后连接失效）</p><a href="`+base.baseUrl+"/login/emailcode/"+loginLink+`">激活账号</a>`;
                util.sendMail(data.email,"邮箱验证",mails );

                /**回给客户端界面一个成功的消息，及跳转信息(跳转信息最好由界面来实现) */
                /**如果采用 application/json , 客户端的res.data已经是一个对象了，不需要parse */
                res.writeHead(200,{'Content-type':'application/json'});
                res.end('{"info":"Email-code was sent to your email."}');
                console.log("hi");
             }
            ,function(resSign){
                /**Email 已经存在，界面跳转到login*/
                // res.end(JSON.stringify(data));
                console.log("Email exists")
                res.writeHead(200,{'Content-type':'application/json'});
                res.end(`{email:'`+data.email+`',alert:' `+data.email ` already been registed.' `);
            });
         }
});

/**refresh token
 * 用户登录后，生成一个reToken以及一个真正的token(access)。
 * reToken用来获取新的token,拥有更长的过期时间，超过了这个时间，则需要用密码
 */
router.post('/refreshToken', (req, res) => {
    let reToken = req.body.reToken;
    fetch.getReToken(reToken,function(err,data){
        try{
            //假装val 有值
            if(data.email!=''){
                let ltoken = util.base64ba(util.randomBytes(5))
                             + util.base64ba(util.sha256(tm+data.email+data.pw));
                
                fetch.setToken(ltoken,data,function(newToken){
                    let ret={token:newToken,st:"ok"};
                    res.writeHead(200,{'Content-type':'application/json'});
                    res.end(JSON.stringify(ret));
                });
                /**表示这个还是活动的refreshtime，所以重新更新过期时间 */
                fetch.setrkExpire(reToken,base.rk.reTokenExpireTime);
             }
        }catch(error){
            let ret={Info:"需要重新登录",st:"fail"};
            res.writeHead(200,{'Content-type':'application/json'});
            res.end(JSON.stringify(ret));
        }
    });
});
/** 根据Emailcode激活邮箱 */
router.get('/emailcode/:index', (req, res) => {
    /**获取参数并根据tm判断当前是否可以响应该login请求（允许在1分钟内的请求）
     * 可以用的基本上也只有 req.body, req.ip 两个有意义。
     */
    let loginLink = req.params.index;
    if(fetch.checkStr(loginLink)){
        fetch.getEmailLink(loginLink,function(err,data)
        {
            //data就是返回的参数，如果异常则返回 [] 或none
            err? err:'err not selected';
            data? data:'data not';

            if(err || (data&&data.length==0)){
                res.writeHead(200,{'Content-type':'application/json'});
                res.end("{'info':'Emailcode可能已经过期或不存在'}");
            }
            else if(data){
                
                // let obj = JSON.parse(data);
                /**将注册的信息设置到userLogin数据库中()，
                 * 这个时候需要将该用户的状态设置为'N'，并将组也设置为'N'（缺省组）
                 */
                data.status = 'N';
                fetch.writeUserLogin(data);
                /** 这里应只是返回一个注册成功，不能把data信息送回。password应在注册时记录，这个时候不能返回password，即使是hash值也不行。 */

                /**返回一个状态，由客户端来实现页面 */
                let htmlstr='<p>您激活了邮箱<p>'+data.email+"<br><p>您的用户名为："+data.guid+"<br>详细情况请登录"+"<a href='www.aditech.com'>文章首页</a>"+"获取更详细的信息";

                htmlstr=`<!DOCTYPE html>
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                    <title>文章</title>
                    <body>
                        邮件成功激活
                    </body>
                </html>`;
                // htmlstr=JSON.stringify({st:'ok',email:data.email});/**这个需要调整 */
                // res.writeHead(200,{'Content-type':'application/json'});
                res.end(htmlstr);/**输入data为测试 */
            }
        });
    }

});

router.use('/',function(req,res,next)
{
	// var client = redis.createClient(6379, '127.0.0.1');
	// client.auth(123456);  // 如果没有设置密码 是不需要这一步的
    console.log("常规是不会到这个处理函数的");
    res.send("hello admin");
});

module.exports = router;