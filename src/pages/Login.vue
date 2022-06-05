<template>
<div id="login" class=" container-fluid login-body">
<div class="login-box p-3">
    <div class="input-group mt-3 ml-1 ">
        <input type="text" class="form-control" placeholder="请输入用户(Email)" v-model="email">
    </div>
    <div class="input-group mt-3 ml-1">
        <input type="password" class="form-control" placeholder="请输入密码" v-model="password">
    </div>
    <div class="input-group mt-3 ml-1">
        <button v-on:click="clkLogin" class="btn btn-info w-100">登录</button>
    </div>
    <div class="input-group mt-3 ml-1">
        <label><input type="checkbox" v-model="rpw" value="yes">记住密码</label>
        <!-- <label><input type="checkbox" v-model="rpw" value="no">不记住密码</label> -->
        <span ><router-link to="/RecovePw" class="label label-primary float-right ml-5" style="color:black">重置密码</router-link></span>
        <span ><router-link to="/Signup"  class="label label-primary float-right ml-5" style="color:black">用户注册</router-link></span>
        <!-- <span class="label label-primary">主要标签</span>
        <input type="checkbox" :value='m' v-model="gender" label="m">男
        <input type="checkbox" class="form-check-input" value="f">Option 1
		<input type="checkbox" class="form-check-input" value="">Option 55
        <button v-on:click="clkLogin" class="btn btn-info w-100">登录</button> -->
    </div>
    <div class="input-group mt-3 ml-1">
        <span  v-show="disInfo" style="color:red;font-size:13px">{{info}}</span>
    </div>
</div> 
</div>
</template>

<script>
var util = require('../assets/js/adiutil.js');
import axios from "axios";
// axios.defaults.baseURL='http://localhost:8090/';
export default {
    data() { // 页面的初始数据
        return {
            rpw:[], /**记住密码 */
            info:"大家好",
            disInfo:false,
            /**界面双向绑定的参数 */
            email:'adiyun_tech@aliyun.com',
            password:'dddd', 
            isDirectJump:false, //是否允许直接调过登录页面（已经登录的情况）
        };
    },
    methods: {
        /**点击登录 */
        clkLogin() {
            //获取用户名和密码,构造用户名和密码的hash sha128
            if(this.email==="" || this.password===""){
                alert("请输入用户名和密码");
                return;
            }
            var data={};

            data.tm = util.getTmSeconds();
            data.email=this.email;

            /** 构建登录验证包 */
            let fhash=util.sha256(this.email+this.password);
            let shash=util.sha256(util.ByteArray_to_ByteString(fhash)+data.tm);/**当前为字节数组 */
            data.pw = util.base64(util.ByteArray_to_ByteString(shash));

            // this.$router.push('/WenZhang',function(err){},function(rr){})
            // let ldata = JSON.stringify(data);
            //axios发送消息            
            //登录成功后，获取用户信息，然后跳转到首页。
            var _this = this;
            axios.post(_this.g.servInfo.baseUrl+"/login/login",data,).then((resObj)=>{
                /**res 是json结构，1、存储token；2、更新用户名；3、更新图标 4、跳转到主页*/
                let data = resObj.data;
                if('token' in data) {
                    console.log(_this.g.uiInfo.token);
                    _this.g.uiInfo.token = data.token;
                    _this.g.uiInfo.reToken = data.reToken;

                    /**将reToken写入到local data */
                    util.setLocal('retoken',{'token':_this.g.uiInfo.reToken,'data':data.data});
                }
                if('data' in data) {
                    _this.g.uiInfo.loginData = data.data;/**记录当前的登录信息 */
                    _this.g.uiInfo.loginData.status = "yes"
                }

                /** 未来实现。
                 * 这个地方应该有一个用户推荐列表之类的变化（直接读取数据库） */
                if(this.rpw.length>0 && this.rpw[0]=='yes'){
                    //记录密码
                    util.setLocal("uname",this.email)
                    util.setLocal("upass",this.password)
                }

                /** 回到刚才页面 */
                // _this.$router.push('/ZiLiao/MyDoc');
                _this.$router.go(-1);
                console.log(data);
            }).catch((err)=>{
                /**什么也不做，可以提示登录失败--info */
                _this.disInfo=true;
                _this.info="用户名或密码错误";
            });
            console.log("TEST");
        },
    },
    mounted(){
        if(this.g.uiInfo.loginData.status=="yes")
        {
            // this.$router.push("/ZhiLiao/MyDoc")
            this.$router.go(-1)
        }else{
            if(util.getLocal("uname")!=null && util.getLocal("upass")!=null){
                this.email = util.getLocal("uname")
                this.password = util.getLocal("upass")
                if(this.$route.query.isDirectJump){
                    this.clkLogin() //直接登录
                }
            }
        }
    }
};
</script>

<style scoped>
.login-body{
    width:100%;
    height:500px;
    display:flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background:url(../assets/images/loginbg3.png) no-repeat center center;

}
.login-box{
    width:67%;
    background: rgba(185, 196, 243, 0.53);
    box-shadow: 0 0 0 2px 3px #333;
    border-radius: 10px;
}
</style>