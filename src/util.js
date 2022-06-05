// 输出一个install 函数
//调用：this.text1();

// import axios from "axios";
// axios.defaults.headers.post['Content-Type'] = 'application/json';

/** 输出的函数列表 */
exports.install = function(Vue) {
    /**函数列表 */
    /** 正则表达式 这个len可以是10px,100%等，返回7px,70%*/
    Vue.prototype.sizeRate = function(llen,rrate) {
            //如果输入 100% 89em 等参数，用正则表达式
            /** reg.test(str) 用来验证字符串是否符合正则 符合返回true 否则返回false
             * reg.exec() 用来捕获符合规则的字符串
             * str.match(reg) 如果匹配成功，就返回匹配成功的数组，如果匹配不成功，就返回null
             *  当全局匹配时，match方法会一次性把符合匹配条件的字符串全部捕获到数组中
             * str.replace() 正则去匹配字符串，匹配成功的字符去替换成新的字符串
             * var str = 'a111bc222de';var res = str.replace(/\d/g,'Q');// res="aQQQbcQQQde"
             */
            /**像素加减法(备选方法)
            var ret=this.siHeight;
            ret = ret.replace("px","");
            ret=Number(ret) - 5;
            ret=ret+"px";
            var ret0 = (parseInt(this.siHeight) - 8)+"px";
             */
            var pattern = 'px|%|em|ex|ch|rem';
            var flag = 'i';/**不区分大小写 */
            var reg = new RegExp(pattern, flag);
            var unit = reg.exec(llen)[0];/**返回 -3是index位置 */

            return (Math.ceil(parseInt(llen) * rrate)) + unit;
    }
    /**还需要可以支持加减 offset为数值，
     * 但对offset的单位不进行运算，只取整数 
     * 如果用减法，可以 '-'+'33px' = '-33px'做为offset的输入*/
    Vue.prototype.sizeAdd = function(llen,offset) 
    {

        var pattern = 'px|%|em|ex|ch|rem';
        var flag = 'i';/**不区分大小写 */
        var reg = new RegExp(pattern, flag);
        var unit = reg.exec(llen)[0];/**返回 -3是index位置 */

        var offsetNum = parseInt(offset);

        // if(typeof(offset)=='string'){}
        return (Math.ceil(parseInt(llen)+offsetNum)) + unit;
    }

    /** axios封装 */
    // Vue.$axios.defaults.timeout=10000;
    // Vue.$axios.defaults.baseUrl='http://localhost:8090/';
    /**axios默认是发送json的数据格式。 Content-Type 变成了 application/json;charset=utf-8 
     *  'Content-Type': 'application/x-www-form-urlencoded' 
     * Content-Type: application/json ： 请求体中的数据会以json字符串的形式发送到后端
Content-Type: application/x-www-form-urlencoded：请求体中的数据会以普通表单形式（键值对）发送到后端
Content-Type: multipart/form-data： 它会将请求体的数据处理为一条消息，以标签为单元，用分隔符分开。既可以上传键值对，也可以上传文件。
    */

    Vue.prototype.axios_xxx=function(){
        /**
         * import axios from "axios";
         *   mounted () {
                axios
                .post('https://www.runoob.com/try/ajax/demo_axios_post.php')
                .then(response => (this.info = response))
                .catch(function (error) { // 请求失败处理
                    console.log(error);
                });
            }
            or
            axios.post('/user', {
                    firstName: 'Fred',        // 参数 firstName
                    lastName: 'Flintstone'    // 参数 lastName
                })
                .then(function (response) {
                    console.log(response.data);
                })
                .catch(function (error) {
                    console.log(error);
                });
         */
    }
    /**获取url中的参数  https://www.baidu.com?a=1&b=2 url.getUrlparm() {a:1,b2} */
    Vue.prototype.getUrlparm = function (url){
            var obj = {};
            var reg = /([^?&#+]+)=([^?&#+]+)/g;
            url.replace(reg,function($0,$1,$2){
                obj[$1] = $2;
            })
            return obj;
    }
    Vue.prototype.checkLogin = function (loginData){
        /**uiInfo["loginData"] */
        try{
           if(loginData.status=="yes")
             return true;
        }catch(err){
             return false;
        }
    }

    Vue.prototype.text1 = function (){//全局函数2
     alert('执行成功2');
     };
 };