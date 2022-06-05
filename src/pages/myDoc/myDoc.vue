<template>
<div class="myDoc card card-style shadow d-flex mt-5 mr-1 ml-1">
    <div class="card-body">
        <div class="input-group-prepend">
            <span  @blur="changenn" class="input-group-text" >昵称</span> 
            <input type="text" class="form-control" placeholder="昵称" v-model="nickName" >
        </div>
        <div class="input-group-prepend">
            <span class="input-group-text"  @blur="changern">真名</span> 
            <input type="text" class="form-control" placeholder="真实姓名"  v-model="rName">
        </div>        
        <div class="input-group-prepend">
            <span class="input-group-text"  @blur="changeph" >手机</span> 
            <input type="text" class="form-control" placeholder="电话号码" v-model="phone">
        </div>
        <div class="input-group-prepend">
            <span class="input-group-text"  @blur="changepw"  >密码</span> 
            <input type="password" class="form-control" placeholder="新密码" v-model="newPassword">
        </div>
        <div class="input-group mt-3 ml-1" >
            <button v-on:click="changeUserInfo(myEmail)" class="btn btn-info w-100">修改资料</button>
        </div>
        <div v-show="infoSaved">已保存</div>
        <div v-show="infoNotSaved" :style="{'color':'red'}">保存异常</div>
        <div class="input-group-prepend d-flex flex-row justify-content-between">
            <span class="input-group-text">头像</span> 
            <pic-upload :loadUrl="uploadUrl" :email="myEmail" :nickname="nickName" @finishUpload="finishUpload" :siHeight="siHeight"></pic-upload>
            <div class="card">
                <img :src="getIcon" :style="getImgStyle"/>
            </div>
        </div>
    </div>
</div>
  
</template>

<script>
import axios from "axios";
import PicUpload from '../../components/basic/picUpload.vue';
var util = require('../../assets/js/adiutil.js');
export default {
    components:{
        PicUpload,
    },
    data(){
        return {
            nickName:"",
            myEmail:"",
            rName:"",
            phone:"",
            newPassword:"",
            uploadUrl:"",
            icon:"",
            siHeight:"100px",
            infoSaved:false,
            infoNotSaved:false,
        }
    },
    computed:{
        getIcon(){
            return this.g.uiInfo.loginData.icons;
        },
        getImgStyle(){
            let sty={};
            sty["height"]=this.siHeight;
            sty["width"]=this.siHeight;
            sty["float"]='left';
            return sty;
        }
    },
    methods:{
        getIconUrl(){
            this.uploadUrl = this.g.servInfo["baseUrl"] + "/admin/upload/pic";
            this.nickName = this.g.uiInfo.loginData.nickName;
            this.myEmail = this.g.uiInfo.loginData.email;
            this.rName = this.g.uiInfo.loginData.rName;
            this.phone = this.g.uiInfo.loginData.phoneNumber;
        },
        getEmail(){
            return this.g.uiInfo.loginData.email;
        },
        getNickname(){
            return this.g.uiInfo.loginData.nickName;
        },
        checkUser(ld){

        },
        // 不分开修改，统一修改
        changeUserInfo(myEmail){
            var _this = this
            let data = {}
            data["email"] = myEmail
            let changed = false
            if(this.nickName.trim()!="") {
                data["nickName"] =  this.nickName.trim()
                changed = true
            }
            if(this.rName.trim()!="") {
                data["rName"] = this.rName.trim()
                changed = true
            }
            if(this.phone.trim()!="") {
                data["phoneNumber"] = this.phone.trim()
                changed = true
            }
            if(this.newPassword!="") {
                let pww = this.newPassword.trim()
                let fhash = util.sha256(this.email+pww)
                data["password"]=
                    util.base64(util.ByteArray_to_ByteString(fhash))
                changed = true
            }
            if(changed){
                axios.post(_this.g.url.setInfo,data,)
                .then((resObj)=>{
                    // 正常
                    let data = resObj.data;
                    this.infoSaved = true;
                }).catch((err)=>{
                    // 异常
                    this.infoNotSaved=true
                });
            }
        },
        /**改变昵称 */
        changenn(){
            var _this = this;
            let data = {};
            data["nickName"]=this.nickName

        },
        /**改变真名 */
        changern(){
            this.infoSaved = this.infoNotSaved= false;
        },
        /**改变手机 */
        changeph(){
            this.infoSaved = this.infoNotSaved=false;
        },
        /**改变m密码 */
        changepw(){
            this.infoSaved = this.infoNotSaved=false;
        },
        finishUpload(response){
            /**上传成功了，获取头像 */
            console.log(response);

        },
    },
    mounted(){
        // 这个是ziliao页面的主界面
        this.getIconUrl();
        // 更新用户基本信息？
        if(this.g.uiInfo.loginData==null || this.g.uiInfo.loginData==undefined || this.g.uiInfo.loginData.status=="no"){
            this.$router.push("/login")
        }
        // if(this.g.uiInfo.loginData.status!="yes"){
        //     let data={"email":this.g.uiInfo.loginData.email}
        //     axios.post(this.g.url.getInfo,data,)
        //     .then((resObj)=>{
        //         this.g.uiInfo.loginData=resObj;
        //         this.nickName=resObj.data.data.nickName;
        //         this.rName = resObj.data.data.rName;
        //         this.phone = resObj.data.data.phoneNumber;
        //     }).catch((err)=>{
        //         // 啥也不做好了
        //         console.log(err)
        //     });
        // }
    }

}
</script>

<style>

</style>