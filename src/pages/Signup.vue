<template>
<div id="signup" class="login-body">
<div class="login-box p-3">
    <div class="input-group  mt-3 ml-1">
        <input type="text" class="form-control" placeholder="对外显示的昵称" v-model="nickName">
    </div>
    <div class="input-group  mt-3 ml-1">
        <input type="text" class="form-control" v-model="email" placeholder="Email地址,登录用户名、接收注册码">
    </div>
    <div class="input-group  mt-3 ml-1">
        <input type="password" class="form-control" v-model="password" placeholder="请输入密码">
    </div>
    <div class="input-group  mt-3 ml-1">
        <input type="text" class="form-control" v-model="birthyear" placeholder="出生年月 yyyy-mm 例如：2010-03">
    </div>

    <div class="input-group mt-3 ml-1 ">
        <label for=""><input type="radio" v-model="gender" value='m'>男</label>
        <label for=""><input type="radio" v-model="gender" value='f'>女</label>
    </div>
    <div class="input-group mt-3 ml-1">
        <button v-on:click="clkSignup" class="btn btn-info w-100">注册</button>
    </div>
    <div class="input-group  mt-3 ml-1">
        <span><router-link to="/Login"  class="label label-primary float-right ml-5" style="color:black">用户登录</router-link></span>
    </div>

    <div class="input-group mt-3 ml-1">
        <span  v-show="disInfo" style="color:red;font-size:13px">{{info}}</span>
    </div>

</div>
</div>
</template>

<script>
import axios from "axios";
var util = require('../assets/js/adiutil.js');

export default {
    data() { // 页面的初始数据
        return {
            nickName:'admin',
            email:'adiyun_tech@aliyun.com',
            password:'dddd',
            confirmPw:'dddd',
            gender:"m",
            birthyear:"1998-06",
            info:'',
            disInfo:false,
        };
    },
    methods: {
        clkSignup() {
            //获取用户名和密码,构造用户名和密码的hash sha128
            if(this.nickName==="" || this.password==="" || this.email===""){
                alert("缺少用户名或password或密码重输");
                return;
            }
            this.info = "";
            var data={};
            data.email=this.email;
            data.tm = util.getTmSeconds();
            data.gender = this.gender;
            data.birthyear = this.birthyear;
            data.nickName = this.nickName;

            /** 构建登录验证包*/
            let fhash=util.sha256(this.email+this.password);
            console.log(fhash)
            data.pw = util.base64(util.ByteArray_to_ByteString(fhash));
            console.log(data.pw)

            // 测试服务端
            let serverPw=util.base64decode('RH8J6o0dCJ03NZcZW$lqn7kQdqmR2V9PQP9FwV4E@PE')
            console.log(serverPw)
            
            let serverPwSec = util.base64(util.ByteArray_to_ByteString(util.sha256(serverPw+data.tm)))
            console.log(serverPwSec)
            // let ldata = JSON.stringify(data);
            //axios发送消息
            //登录成功后，获取用户信息，然后跳转到首页。
            var $this = this;
            axios.post(this.g.servInfo.baseUrl+"/login/signup",data,).then(res=>{
                /**这里需要设置一个常规的界面操作方法*/
                let rdata = res.data;
                 $this.info = res.data.info;
                 $this.disInfo = true;
                /**根据收回的消息做配置。 */
                if('alert' in rdata){
                    alert(rdata.alert);
                }
            }).catch(err=>{
                // this.info=err;
                console.log(err);
                 $this.info='用户名或邮箱已经存在';
                 $this.disInfo=true;
            });
            // console.log("dddd");
        },
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