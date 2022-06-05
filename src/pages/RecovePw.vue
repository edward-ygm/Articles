<template>
<div id= "recoverpassword" class="login-body">
<div class="login-box p-3">
    <div class="input-group mt-3 ml-1 ">
        <input type="text" class="form-control" placeholder="请输入用户(Email)" v-model="email">
    </div>
    <div class="input-group mt-3 ml-1 ">
        <input type="password" class="form-control" placeholder="请输入新密码" v-model="password">
    </div>
    <div class="input-group mt-3 ml-1 ">
        <input type="password" class="form-control" placeholder="请再次输入新密码" v-model="confirmPw">
    </div>

    <div class="input-group mt-3 ml-1">
        <button v-on:click="clkRecovePw" class="btn btn-info w-100">提交修改</button>
    </div>

    <div class="input-group mt-3 ml-1">
        <span ><router-link to="/Login" class="label label-primary ml-5" style="color:black">用户登录</router-link></span>
        <span ><router-link to="/Signup"  class="label label-primary float-right ml-5" style="color:black">用户注册</router-link></span>
    </div>

</div> 
</div>
</template>

<script>
var util = require('../assets/js/adiutil.js');
import axios from "axios";

export default {
    data() { // 页面的初始数据
        return {
            guid:'123',
            password:'123大家好'
        };
    },
    methods: {
        clkLogin() {
            //获取用户名和密码,构造用户名和密码的hash sha128
            if(this.guid==="" || this.password===""){
                alert("请输入用户名和密码");
                return;
            }

            var data={};
            data.guid=this.guid;
            data.tm = util.getTmSeconds();
            /** 构建登录验证包*/
            let fhash=util.sha256(this.guid+this.password);
            let shash=util.sha256(fhash+data.tm);/**当前为字节数组 */
            data.pw = util.base64(util.ByteArray_to_ByteString(shash));
            let ldata = JSON.stringify(data);
            //axios发送消息


            //登录成功后，获取用户信息，然后跳转到首页。
            axios.post("/data",ldata,).then(res=>{

            }).catch(err=>{

            });
            this.axios.post('url', { ...this.ruleForm }).then(res => { // post请求，携带参数为展开运算符=user: '', passwd: '',
                if (res.code != 0) return false; // 后台根据前端传来的数据返回对应的状态码，0为成功，继续往下执行，非0即失败（-1为用户名或者密码错误，1为空）停止往下执行
                this.$message({ // 提示成功信息
                type: 'success',
                message: '登录成功'
                })
                this.$router.push('/home/index') //成功跳转到首页
            })
        },
        clkSignUp(){
            
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