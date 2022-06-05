var baseUrl="http://www.dzpslt.com:8090";
var rk={
    userlogin : 'userLogin',/**用户登录前缀 */
    emailLink : 'emaillink',/**email验证前缀 */
    artkey:'art',/** 文章相关参数art artID = hash object*/
    artStart:100001,
    token:'ltoken',/**临时token前缀 */
    tokenExpireTime:3600, //单位为秒
    reToken:'retoken',/**refresh token，长期的token */
    reTokenExpireTime:31536000, //单位为秒,一年的时间
}
// var defaultGroup='N'; /**表示为常规的组，只允许修改自己的信息和查看公开的信息 */
var tokenExpireTime=500; //单位为秒
var mysqlHost = {
    host     : '127.0.0.1',
    user     : 'root',
    password : '',
    database : 'artpool'
};

/**设置Redis Option */
const redisOptions = {
    host: "127.0.0.1",
    port: 6379,
    // password: 123,
    detect_buffers: true, // 传入buffer 返回也是buffer 否则会转换成String
    retry_strategy: function (options) {
      // 重连机制
      if (options.error && options.error.code === "ECONNREFUSED") {
        // End reconnecting on a specific error and flush all commands with
        // a individual error
        return new Error("The server refused the connection");
      }
      if (options.total_retry_time > 1000 * 60 * 60) {
        // End reconnecting after a specific timeout and flush all commands
        // with a individual error
        return new Error("Retry time exhausted");
      }
      if (options.attempt > 10) {
        // End reconnecting with built in error
        return undefined;
      }
      // reconnect after
      return Math.min(options.attempt * 100, 3000);
    }
}

module.exports ={
    /**项目基本配置参数 */
    baseUrl,
    /*redis 及 mysql*/
    rk,mysqlHost,redisOptions,
    /**常用参数 */
    tokenExpireTime,
    
}