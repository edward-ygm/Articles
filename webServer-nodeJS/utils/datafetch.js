'user strict'
/**
 * 作者：Edward Yang
 * 2021-12-28
 */
/** 数据获取文件，看看能否都切换为es6格式 
 *  本文所有函数都不允许对业务逻辑处理，只负责数据获取和存储
*/
var g=require('./base.js');
var redis = require('redis');
var mysql = require('mysql');
const { utils } = require('./aesjs');
const util = require('./adiutil');
const { param } = require('../routes/admin.js');


/**防止SQL注入等安全处理
 * 
 */
 var checkStr=function(str){
    return true;
}
/**当返回不需要处理的时候，用这个函数作为redis的回调函数 */
var callbackPrint=function(err,value){
    if(err)console.log(err);
    else console.log(value);
}
/******************************************************************************
 * 
 */
/**获取当前最新的guid。如何生成guid是个复杂又头痛的问题
 * mysql的方法
 * select max(id) from tablename
 * SELECT LAST_INSERT_ID()
 * SHOW TABLE STATUS;得出的结果里边对应表名记录中有个Auto_increment字段，里边有下一个自增ID的数值就是当前该表的最大自增ID.
 * 
 * 当前不优化这个函数。将来guid允许手动设置，但设置必须是没有冲突的值。当前的表就用email作为primary key。删除guid作为key值
 * 
 * 新guid的分配方法：1、定期选定一大本guid备选数值。确定每一个都在mysql数据库中不存在。然后，挨个分配guid值就可以。也可以通过email转换为hash来生成guid。也可以是身份证号，手机号等。
*/
var getGuid=function(initGuid){
    var guid=initGuid?innitGuid:0;
    return function(email){
        guid+=1;
        return guid;
    };
}
// 生成redis的client
const client = redis.createClient(g.redisOptions)
var redisRemoveKey = (key)=>{
  client.expire(key,1);
}
// 存储值
const redisSetValue = (key, value,exTime) => {
    if(!exTime){exTime=30000;}/**设置过期时间 */
    client.expire(key,exTime);/**设置过期时间 */
    
    if (typeof value === 'string') {
      client.set(key, value)
    } else if (typeof value === 'object') {
      for (let item in value) {
        client.hmset(key, item, value[item],redis.print)
      }
    }
  }
   
// 获取string
const redisGetValue = (key) => {
    return new Promise((resolve, reject) => {
      client.get(key, (err, res) => {
        if (err) {
          reject(err)
        }else{
          resolve(res)
        }
      })
    })
  }
   
// 获取hash
const redisGetHValue = (key) => {
    return new Promise((resolve, reject) => {
      client.hgetall(key, function (err, value) {
        if (err) {
          reject(err)
        } else {
          resolve(value)
        }
      })
    })
  }
var exampleRedis=function(){
    redisSetValue('student', {
        name: 'xiaoming',
        age: 18,
        sex: 1
      });
       
      redisSetValue('book', 'yuwen');
       
      redisGetValue('book').then(res => {
        console.log(res)
      }).catch(err => {
        throw new Error(err)
      });
       
      redisGetHValue('student').then(res => {
        console.log(res)
      }).catch(err => {
        throw new Error(err)
      });
}
/******************************************************************************
 *  Mysql
 *  */
/** 写一个通用的接口 */
function mysqlData(objHost,sql,val,callback){
    let mysql = require('mysql');
    var connection = mysql.createConnection(objHost);
    connection.connect();
    //增删改查
    console.log("query :",sql);
    console.log(val);
    connection.query(sql,val,callback);
    connection.end(); 
}
/** select 获取数据 （没有join）select data from tableName where constraintKey
 * callback == function (err, value)
 *  option: 直接文字附加即可
 *  ORDERBY `artid` asc , ctime DESC 
 *  limit 0 5 ; 检索到最后 limit 0 -1;
 * data=["email","rName"]
 * constraintKey同updateMysql
 */
function selectMysql(callBack,tableName,data,constraintKey,option){
  if(!option)option='';
  if(!constraintKey)constraintKey={};
  let sql = "select " ;
  let param = [];
  for(key in data){
    sql += key + ',';
  }
  sql = sql.substr(0, sql.length-1); //删除多余的 ','
  sql+= "  from " + tableName;
  let wsql="";
  for(k in constraintKey){
    param.push(constraintKey[k]);
    wsql += k + ' =? and';
  } 
  if(wsql != ""){
    wsql = wsql.substr(0,wsql.length-3);//去除最后的 and
    sql+=" where "+wsql;
  }


  sql += option;
  
  try{
    mysqlData(g.mysqlHost,sql,param,callBack);
  }catch(err){
    console.log("---写日志--");
    return false;
  }

}
/** update 更新数据 （没有join） update tableName set (data) where constraintKey
 * callback == function (err, value)
 * constrainsKey like {"email":"abc@a.com"} 
 * data like {"rName":"sidg"}
*/
function updateMysql(tablename,data,constraintKey,callBack){
  if(data.length==0)return false;
  let sql = "update " + tablename + " set ";
  let param = [];
  for(key in data){
    if(!(key in constraintKey) ){
      param.push(data[key]);
      sql += key + '=? ,';
    }
  }
  sql=sql.substr(0,sql.length-1);
  let wsql="";
  for(k in constraintKey){
    param.push(constraintKey[k]);
    wsql += k + ' =? and'; 
  }
  if(wsql!=""){
    wsql=wsql.substr(0,wsql.length-3);
    sql+= " where " + wsql;
  }
  try{
    mysqlData(g.mysqlHost,sql,param,callBack);
  }catch(err){
    console.log("---写日志--");
    return false;
  }
}
/** replace into tableName(data) values(?,?) where constraintKey  （没有join）
 * callback == function (err, value)
*/
function replaceMysql(tableName,data,constraintKey,callBack){
  let sql = "replace into " + tableName + "( ";
  let param = [];
  let val="";
  for(key in data){
    param.push(data[key]);
    sql += key + ',';
    val += "?,"
  }
  sql = sql.substr(0,sql.length-1);//删除多余的 ','
  val = val.substr(0,val.length-1);//删除多余的 ','
  sql+= " ) values("+val+") ";
  let wsql="";
  for(k in constraintKey){
    param.push(constraintKey[k]);
    wsql += k + ' =? ';
  }
  if(wsql != ""){sql+=" where "+wsql;}
  
  try{
    mysqlData(g.mysqlHost,sql,param,callBack);
  }catch(err){
    console.log("---写日志--");
    return false;
  }
}

/** insert into tableName(data) values(?,?) 
 * callback == function (err, value)
*/
function insertMysql(tableName,data,callBack){
  let sql = "insert into " + tableName + "( ";
  let param = [];
  let val="";
  for(key in data){
    param.push(data[key]);
    sql += key + ',';
    val += "?,"
  }
  sql = sql.substr(0,sql.length-1);//删除多余的 ','
  val = val.substr(0,val.length-1);//删除多余的 ','
  sql+= " ) values("+val+") ";
  
  try{
    mysqlData(g.mysqlHost,sql,param,callBack);
  }catch(err){
    console.log("---写日志--");
    return false;
  }
}


function exampleMysql()
{
  	let host = {
      host     : '127.0.0.1',
      user     : 'root',
      password : '123',
      database : 'artpool'
      };

      let mysql = require('mysql');
      var connection = mysql.createConnection(host);
      var sql = 'replace into test(a,b) values(?,?)';
      let data=['大家好', '大家'];
      connection.connect();
        //增删改查
      connection.query(sql,data,function(err,vall){
        console.log("ddd",vall);
      });

      sql = 'select * from test';
      data=[];
      connection.query(sql,data,function(err,vall){
        console.log("ddd",vall);
      });

      connection.end();
      console.log(data);

      /**输入采用对象 */
      var osql = 'insert into userlogin set ? ';
      var odata = {email:'testemail',guid:'testguid',createtm:123455};
      var connection = mysql.createConnection(host);
      connection.connect();
      connection.query(osql,odata,function(err,results){
        console.log("ddd");
        if(results){
        }
      });
      connection.end(); 
      /** */

    // mysqlData(host,
    //         'insert into userlogin(guid,email,nickName,status,createtm,rBirth,gender) values(?,?,?,?,?,?,?)',data,
    //         function(err,resData)
    //         {
    //             if(err){
    //                 throw err;
    //             }
    //             if(resData){
    //                 console.log(resData);
    //             }
    //         });

	// mysqlData(host,
	// 	'select * from userlogin',
	// 	function(err,resData)
	// 	{
	// 		if(err){
	// 			throw err;
	// 		}
	// 		if(resData){
  //       /** resData[0].guid ，resData是一个数组，resData.length是长度。每个数组是一个对象 */
	// 			console.log(resData);
	// 			console.log(JSON.stringify(resData));/**字符化 */
	// 			console.log(JSON.parse(JSON.stringify(resData)));/**z转换为[{},{}]的格式对象 */
	// 		}
	// 	});
  //   let data=['admin@adi.com']
  //   mysqlData(host,
  //           'select * from userlogin where email=?',
  //           function(err,resData)
  //           {
  //               if(err){
  //                   throw err;
  //               }
  //               if(resData){
  //                   console.log(resData);
  //               }
  //           },data);
      
}

function examples(){
    exampleMysql();
    /**测试redis */
    /**Redis */
    genArtId(res=>{});
    var func=function(err,data){
      console.log(err,data);
    }
    //  client.hset('sect','k1',13);
    //  client.hset('sect','k2',23);
    //  client.hset('sect','k3',33);
    //  client.hget('sect','k1',func);
    //  client.hget('sect','k',func);
    //  client.hgetall('sect',func);
    //  client.hmset('sect',{'k5':5,'k6':6},func);
     var xdata = {'k7':5,'k8':6};
     client.hmset('1userLoginadiyun_tech@aliyun.com',xdata,func);

}

/******************************************************************************
 * 业务相关的函数
 */
/**获取登录信息
 * data {guid,pw,tm}
 * redis: userlogin:{email:[guid,email,gname,pw,tm,status],}
 * success
 */
var fetchUserlogin = function(email,success,fail) {
	if (!checkStr(email)) return {};
    let key = g.rk.userlogin+email;
    client.hgetall( key, function (err, valObj) {
      try{/**正常处理流程 */
        if(valObj==null){
          throw("not catch in redis")
          // res.writeHead(200,{'Content-type':'application/json'});
          // res.end('{Info:"用户或密码错误"}');
          //  return;
        }else{
          success(valObj);/**获取到数据后的处理函数*/
        }
      }catch(error){
        /**异常处理流程 */
           mysqlData(g.mysqlHost,
            "select email,nickName,status,icons,rankVal,followed,dislike,favorate,rBirth,rName,gender,phoneNumber,pw from userlogin where email = ?",
            [email],
            function(err,resData){
              try{/**不做异常处理，出现异常就回到error */
                let mvalObj=JSON.parse(JSON.stringify(resData[0]));/**获取对象数据 */
                mvalObj.icons=util.utf8_bytes_array_to_string(mvalObj.icons.data);
                /**只有一部分需要设置到Redis */
                let allowedKey=[`rName`,`phoneNumber`,`nickName`,`status`,`icons`,`rankVal`,`followed`,`dislike`,`favorate`,'rBirth','gender',`email`]
                for(let i=0;i<allowedKey.length;i++){
                  client.hmset(key,allowedKey[i],mvalObj[allowedKey[i]]);
                }
                client.expire(key,86400);//这里expire的时间大概是一天
                success(mvalObj);/**获取到数据后的处理函数 */
              }catch(error){
                fail(error);/**登录失败后的处理函数 */
              }
            });
        }
      });
}
/**signup 存入新数据
 * data {guid,pw,tm}
 * redis: userlogin:{email:[email,gname,pw,tm,status],}
 * gname 由管理员或大数据程序进行维护
 * 资料由用户在其他页面补充完整，这里只记录email和pw
 */
var signupData = function(data,signup,emailExist) {
    let email=data.email;
    if (!checkStr(email)){ return;}
    /**对于signup，也是先查询Redis，然后查询数据库 */
    let key = g.rk.userlogin + email;
    // key = 'userLoginadiyun_tech@aliyun.com';
    client.hgetall(key, function (err, value) 
    {
        /**如果没有查到，直接搜索数据库 */
        if (err || value===null) {
            mysqlData(g.mysqlHost,
                "select email,nickName,status,icons,rankVal,followed,dislike,favorate,rBirth,rName,gender,phoneNumber,pw from userlogin where email = ?",
                [email],function(err,resData)
            {
                    if(err || resData.length==0)
                    {
                        /**如果数据库中没有，可以注册,进入注册流程。 */
                        // 初始化data
                        data.nickName=""
                        data.status="ok"
                        data.rankVal=0;
                        data.followed=""
                        data.rName = ""
                        data.gender =""
                        data.phoneNumber = ""
                        data.rBirth=""
                        signup(data);
                    }else{
                        /**返回Mysql数据 [[],[]]2维列表，可以直接写入到Redis*/
                        resData.tm = data.tm;
                        // let mval=JSON.stringify(resData);
                        /**email已经被注册、对方很可能马上会登录，所以直接写入到Redis */
                        // client.hmset(g.rk.userlogin + email,resData);
                        delete resData.pw
                        client.hmset('userLoginadiyun_tech@aliyun.com',JSON.stringify(resData));
                        emailExist(resData);
                    }
            });
        }else{
            value.tm = data.tm;
            emailExist(value);
        }
    });
    return;
}
/**存入新数据到数据库
 * redis: userlogin:{email:[email,gname,pw,tm,status],}
 * gname 由管理员或大数据程序进行维护
 * 资料由用户在其他页面补充完整，这里只记录email和pw
 */
 var writeUserLogin = function(data) {
    /**写入数据库 */
    mysqlData(g.mysqlHost,
             "replace into userlogin(guid,email,nickName,status,createtm,rBirth,gender,pw) values(?,?,?,?,?,?,?,?)",
             [data.email,data.email,data.nickName,data.status,data.tm,data.birthyear,data.gender,data.pw],function (err, value) {
                            console.log(err);/**写入log，记录执行情况 */
                        });
    /**更新redis */
    // var value = [data.email,"ordin",data.pw,data.tm,'N'];
    client.hmset(g.rk.userlogin + data.email,data,callbackPrint);
    return;
}


/**更新userLogin（icon及其他） */
var updateUserLogin = function(data,cdata,success){
  /**update Mysql , update redis */
  /**update userlogin set icons="7sdfingsddddd" where email="test@a.txt" */
  updateMysql("userLogin",data,cdata,function(err,resVal){
    if(!err){
      /**更新Redis */
      for(key in data){
        client.hset(g.rk.userlogin+cdata.email,key,data[key]);
      }
      success(null,data);
    }else{
      success('mysql error',data);
      console.log("no email exist");
    }
  });
}

var writeUserInfo = function(data){
  mysqlData(g.mysqlHost,'replace into userInfo')
}
/** */

/** 设置Email 注册表 */
var setEmailLink = function(loginLink,data){
    client.hmset(g.rk.emailLink+loginLink,data);
    client.expire(g.rk.emailLink+loginLink,60000);/**正常情况下用60s */
}
/**获取Email注册表 */
var getEmailLink = function(loginLink,callBack){
  client.hgetall(g.rk.emailLink+loginLink,callBack);
}

/** 设置Token表。Token只存储在Redis，过期时间为30分钟。 */
var setreToken = function(reToken,token,data,callback){
  /**token可能会有冲突(一般不会出现),返回没有冲突的token值 */
  let rekey = g.rk.reToken+reToken;
  client.exists(rekey,function(err,isExist){
    if(isExist==true){
      reToken=reToken + utf8_bytes_array_to_string(util.randomBytes(3));
      token=token + utf8_bytes_array_to_string(randomBytes(3));
    }

    rekey = g.rk.reToken+reToken;
    client.hmset(rekey,data);
    client.expire(rekey,g.rk.reTokenExpireTime);/**正常情况下用30分钟 */

    let key = g.rk.token+token;
    client.hmset(key,data);
    client.expire(key,g.rk.tokenExpireTime);/**正常情况下用30分钟 */

    callback(reToken,token);
  });

}

/** 设置Token表。Token只存储在Redis，过期时间为30分钟。 */
var setToken = function(token,data,callback){
  /**token可能会有冲突(一般不会出现),返回没有冲突的token值 */
  let key = g.rk.token+token;
  client.exists(key,function(err,isExist){
    if(isExist==true){
      token=token + utf8_bytes_array_to_string(util.randomBytes(3));
    }

    let key = g.rk.token+token;
    client.hmset(key,data);
    client.expire(key,g.rk.tokenExpireTime);/**正常情况下用30分钟 */
    callback(token);
  });
}
/**获取Token表 */
var getToken = function(token,callBack){
    client.hgetall(g.rk.token+token,callBack);
}
/**获取reToken表 */
var getReToken = function(retoken,callBack){
  client.hgetall(g.rk.reToken+retoken,callBack);
}

/**设置key的expire时间 */
var setrkExpire=function(key,extime){
  client.expire(key,extime);
}

/**判断当前是否存在*/
var isExistInMysql=function(tableName,constraintKey,funcback)
{
  let param=[];
  let wsql="";
  let sql = "select count(*) as num from " + tableName ;
  for(k in constraintKey){
    param.push(constraintKey[k]);
    wsql += k + ' =? ';
  }
  if(wsql!=""){
    sql += " where " + wsql ;
  }
  try{
    mysqlData(g.mysqlHost,sql,param,funcback);
  }catch(err){
    console.log("---写日志--");
    return false;
  }


}

/**保存当前的文章（第一次保存） */
var saveArticle=function(data,funcback){
  /**存入/更新 Redis */
  let tableName = "arts";
  /** artID，field(email,title,abstract,content,text,up,down,ctime,mtime,status) */
  let keys = ['artID','email','nickName','title','abstract','content','text','imgList','ctime','mtime','status'];/**只需要这些 */
  let jdata={}; 
  data.mtime = util.getTmSeconds();
  for(let i=0;i<keys.length;i++)
  {
    if(keys[i] in data && data[keys[i]]!=''){
      jdata[keys[i]] = (keys[i] in data)?data[keys[i]]:"";
    }
  }

  client.hset(g.rk.artkey+data.artID,jdata,function(err,value){
    /**如果成功 异步写入数据库*/
    /**先判断是否存在 */
    let cdata={artID:data.artID};
    isExistInMysql(tableName,cdata,function(err,val){
      if(err==null && val[0].num>0){/** 找到了，用UPdate */
        /**ctime不需要被更新 */
        delete jdata.ctime;
        updateMysql(tableName,jdata,cdata,function(err,val){
          if(err){
            console.log("写数据库不成功",jdata);
            funcback(false);
          }else{
            funcback(true);
          }
        });
      }else{
        /**新加入 */
        replaceMysql(tableName,jdata,null,function(err,val){
          if(err){
            console.log("写数据库不成功",jdata);
            funcback(false);
          }else{
            funcback(true);
          }
        });
      }
    })

  });
}

// 修改用户信息
var modUserInfo = function(){

  let tablename = ""
  updateMysql(tablename,data,constraintKey,callBack)

}


/******************************************************************************
 *  文章相关
 *  */
/** 文章ID，思路是：直接插入一个artID表，然后查询到该表对应的maxID值 ，
 * 这个在一个用户在多点同时登录，同时插入的情况。
 * 注意：应用存储过程来实现。
*/
var genArtId = function(email,suc,fail)
{
  // 这个还是用mysql来实现更合适一些。
  if(fail==undefined)fail=function(err){}
  // 插入一个arts表项
  let data={}
  data["email"]=email;
  insertMysql("arts",data,function(err,resData){
    if(err==null || err == undefined){
      suc(resData.insertId)
    }
  })
  

  // /**
  //  * 在redis内存储一个自增的计数，每次获取最新的计数
  //  */
  // let v = Math.floor((Math.random()*9)+1);
  // client.hincrby(g.rk.artkey,'artId',v,function(err,res){
  //   if(err){
  //     /** */
  //     fail(err);
  //   }else{
  //     /** 获取了res 然后返回 */
  //     let artid =g.rk.artStart + res;
  //     suc(artid);
  //   }
  // });
}

/**读取文章列表（不包括文章的主体） Redis First 
 * 永久保留，定时更新（由python程序来更新，只取redis内的）。当前版本直接搜索...呵呵
 * artListNewFirst : 根据发布时间排序
 * artListWeightFirst：根据文章本身的质量排序（作者、文章重复度、文章受吸引度来排名）
 * artListUserFirst：根据作者本身的profile来排序文章。
 * */
var getArtList=function(funcBack,curPos,tnum,options){
  if(!curPos) curPos=0;
  if(!tnum)tnum=25;
  if(!options)options='newFirst';
  /**观察redis里面有没有，如果有，就直接返回.... */
  let op = "  order by mtime desc " + " limit " + curPos + " , "+tnum ;
  if(options=='newFirst'){
    op = " order by mtime desc " + " limit " + curPos + " , "+tnum ;
  }else if(options=="thumbUpFirst"){
    op = " order by up desc " + " limit " + curPos + " , "+tnum ;
  }else if(options=="createFirst"){
    op = " order by ctime desc " + " limit " + curPos + " , "+tnum ;
  }
  let con = " where content is not null "
  op = con + op;

  /**根据options 分别查询不同的表 */
  jdata = {'artID':'','title':'','abstract':'','content':'','imgList':'','email':'','nickName':'','up':'','down':'','ctime':'','mtime':'','status':''};
  cdata = {};
  
  selectMysql(function(err,resData){
    try{/**不做异常处理，出现异常就回到error */
      let mvalObj=JSON.parse(JSON.stringify(resData));/**获取对象数据 */
      funcBack(mvalObj);
    }catch(error){
      funcBack([]);
    }
  },'arts',jdata,cdata,op);
}


/**读取单个文章的详细信息，包括文章的主体  Redis First 
 * 根据容量，保留7*24小时，定时更新。这个容量等由python程序来维护。当前版本直接收索...哈哈，哈
 * 这里只从Redis中获取
 * */
var getArticle=function(artID,funcBack){
  /**根据options 分别查询不同的表 */
  let jdata = {'artID':'','title':'','abstract':'','content':'','imgList':'','email':'','nickName':'',up:'','down':'','ctime':'','mtime':'','status':''};
  let cdata = {'artID':artID};
  let op='';  
  
  selectMysql(function(err,resData){
    try{/**不做异常处理，出现异常就回到error */
      let mvalObj=JSON.parse(JSON.stringify(resData));/**获取对象数据 */
      funcBack(mvalObj);
    }catch(error){
      funcBack([]);
    }
  },'arts',jdata,cdata,op);
}


/**写日志 对于增写改操作需要记录到数据库，其他的都记录到文件即可*/
var writeOpLogs=function(logInfo,level,callBack){
   if(!level) level = 3;
   if(!callBack)callBack=function(){};
   console.log(logInfo);/** 预留接口写数据库*/
}

var response=function(res,ret,number){
  if(number==null)number=200
  res.writeHead(number,{'Content-type':'application/json'});
  res.end(JSON.stringify(ret));
}
/** 所有的数据接口 */
module.exports  = {
    /**redis 相关的函数 */
    redisSetValue,redisGetValue,redisGetHValue,setrkExpire,redisRemoveKey,
    setreToken,setToken,getToken,getReToken,
    /** Mysql 的封装函数 类似OAM,根据实际需要再扩充*/
    mysqlData,selectMysql,updateMysql,replaceMysql,isExistInMysql,insertMysql,
    getArtList,getArticle,
    /** redis + mysql同时fetch的函数（业务功能函数的封装） */
    fetchUserlogin,signupData,writeUserLogin,updateUserLogin,
    saveArticle,/** 将文章存储到数据库 */
    /**email */
    checkStr,setEmailLink,getEmailLink,
    /**工具函数 */
    callbackPrint,genArtId,
    /**http函数 */
    response,
    /** 默认输出一个基本用法的例子。有时候函数需要告诉使用者如何使用，这些都是例子，也可以用来验证修改情况 */
    examples,
};