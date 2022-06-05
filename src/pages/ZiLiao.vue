<template>
     <div id="ziliao" class="ArtAuthorCard shadow card-style d-flex flex-column content mt-3 ml-3 mr-3">
       <div class="d-flex flex-row ml-3 ">
            <img :src="getImgData" class="img-fluid img-circle p-1"  :style="getImgStyle"
             @click="clickImg">
            <!-- left side of profile -->
            <div class="flex-grow-1 d-flex flex-column ml-3 w-100" >
                <p class="font-700" ><span :style="{'font-size':getTitleFontSize}" >{{nickName}}</span>
                <span :style="{'font-size':getInfoFontSize}" class="bg-info">{{rankVal}}</span></p>
                <!-- <p class="d-flex flex-row w-50">
                    <LabelItem :siHeight="getInfoFontSize" :rightLabel="followed" leftLabel="个粉丝" ></LabelItem>
                </p> -->
                <p class="d-flex flex-row w-50 float-end">
                    <!-- 喜欢  +  加粉 -->
                    <LabelItem :siHeight="getInfoFontSize" iconID="thumbUp" rightLabel="喜欢博主" @click="addFavorate" ></LabelItem>
                    <!-- <LabelItem :siHeight="getInfoFontSize" iconID="heart" rightLabel="成为博主粉丝" @click="addFollowed" ></LabelItem> -->
                </p>
            </div>
       </div>
       <!-- 导航 -->
        <ul class="nav mt-3">
            <li class="nav-item"><router-link to="/ZiLiao/myDoc" class="btn btn-light">修改资料 <i class="fa fa-angle-down"></i></router-link> </li>
            <!-- <li class="nav-item"><router-link to="/ZiLiao/draftList" class="btn btn-light">草稿列表 <i class="fa fa-angle-down"></i></router-link> </li> -->
            <li class="nav-item"><router-link to="/ZiLiao/articleList" class="btn btn-light">文章列表 <i class="fa fa-angle-down"></i></router-link> </li>
            <!-- <li class="nav-item"><router-link to="/ZiLiao/myStatistic" class="btn btn-light">我的统计 <i class="fa fa-angle-down"></i></router-link> </li>
            <li class="nav-item"><router-link to="/ZiLiao/testFunc" class="btn btn-light">测试界面<i class="fa fa-angle-down"></i></router-link> </li> -->
        </ul>

        <router-view></router-view>

</div>

</template>

<script>
// import ArtAuthorCard from "../components/ArtAuthorCard.vue";
var util = require('../assets/js/adiutil.js');
import LabelItem from "../components/basic/LabelItem.vue";
export default {
    components:{
        LabelItem,
    },
    props:{
    //    authorPage:{type:String,default:"/home"},/**作者主界面*/
    //    selfIntroduction:{type:String,default:"未知",},
    //    imgUrl:{type:String}, /**需要进行判断 */
    //    imgData:{type:String},/**需要进行判断 */
    //    nickName:{ type:String,default:"未认证用户", },//用户的昵称
    //    rankVal:{ type:String,default:"普通", },//用户的级别
    //    followed:{type:String,default:"0", }, //粉丝的数量
    //    siHeight:{type:String,default:"100px", },
    //    arts:{
    //        type: Object,
    //    },
    },
    data(){
        return {
            searchValue: "得到",
            authorPage:"/home",/**作者主界面*/
            selfIntroduction:"未知",
            imgUrl:{type:String}, /**需要进行判断 */
            imgData:{type:String},/**需要进行判断 */
            nickName:"未认证用户",//用户的昵称
            rankVal:"普通",//用户的级别
            followed:"0", //粉丝的数量
            siHeight:"100px",
        };
    },
    methods:{
        /**点击头像时的处理函数 */
        clickImg(){
            /**this.$router.push("/userMainPage",param) */
            console.log("到个人主页");
        },
        handleFuncTitleClick(data){
            this.curActive = data;
            this.$emit("handleFuncTitleClick",data);
        },
        addFavorate(){
            /**加喜欢: 换一下颜色 */
        },
        addFollowed(){
            /**加追随: 换一下颜色 */
        },
    },
    computed:{
        /** 常规图像可以传入Url，也可以传入本地文件路径，也可以传入base64的图片
         * 优先选用base64的图片，其次选用url,暂时不支持本地文件
        */
        getImgData(){/**来自登录后的数据 */
            // 如果没有登录，则直接返回登录界面(checkLogin)
            return this.g.uiInfo.loginData.icons;
        },
        getImgStyle(){
            /**"{'height':siHeight,'width':siHeight,'border-radius':getBorderRadus,'flex':'0 0 '+siHeight}" */
            var tstyle={};
            tstyle["height"]=this.siHeight;
            tstyle["width"]=this.siHeight;
            tstyle["margin-left"]='1px';
            tstyle["border-radius"]=this.sizeRate(this.siHeight,0.5);
            // tstyle["flex"]= '0 0 ';

            return tstyle;
        },
        getIconSize(){
            /**像素加减法(备选方法)
            /**用百分比 */
            var ret = (Math.ceil(parseInt(this.siHeight) * 0.8)) + "px";
            return ret;
        },
        getTitleFontSize(){/**根据整个的高度来确定内部title字体的高度。title 最多能是高度的17% */
            var ret = this.sizeRate(this.siHeight,0.27);
            return ret;            
        },        
        getInfoFontSize(){/**根据整个的高度来确定内部信息字体的高度。信息 最多能是高度的7% */
            var ret = this.sizeRate(this.siHeight,0.15);
            return ret;  
        },
  },
  mounted(){
      /** 检查login状态，如果不处于login状态，直接跳转到登录界面 */
      try{
          if(this.g.uiInfo.loginData.status !='yes')throw("not login");
          if(this.g.uiInfo.loginData.email=="")throw("invalid user");
          if(util.getTmSeconds()-this.g.uiInfo.loginData.tm > 1500){
              /**更新token，如果更新失败则跳转到登录界面 */
              util.checkUser(this.g.uiInfo.loginData,{'tokenExpireTime':this.g.cfg.tokenExpireTime},function(res){
                  if(res==false)throw("need login");
              })
          }
          /**更新当前的状态信息 */
          this.nickName = this.g.uiInfo.loginData.nickName;
          this.rankVal = this.g.uiInfo.loginData.rankVal==undefined?'普通':this.g.uiInfo.loginData.rankVal;
          this.followed = this.g.uiInfo.loginData.followed==undefined?'0':this.g.uiInfo.loginData.followed;

      }catch(err){
          /**跳转到登录界面 (已经登录，直接跳过登录界面)*/
          this.$router.push({path:"/login",query:{"isDirectJump":true}});
         console.log(err)
      }

  }
}
</script>

<style scoped>
.list-custom-small route-link i:last-child{
    float:right;
}
route-link{
    text-align: left;
}

</style>