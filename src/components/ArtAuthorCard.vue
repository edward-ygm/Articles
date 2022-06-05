<template>
    <div id="artAuthorCard" class="ArtAuthorCard card shadow card-style d-flex content mt-3 ">
        <div class="d-flex content ">
           <router-link :to='authorPage'>
                <img v-if="imgUrl" 
                :src="require('@/assets/images/'+getImg)"  
                class="img-fluid img-circle p-1" 
                :style="getImgStyle">
                <img v-if="imgData" :src="getImgData" class="img-fluid img-circle p-1"  :style="getImgStyle">
           </router-link>
            <!-- left side of profile -->
            <div class="flex-grow-1">
                <p class="font-700" ><span :style="{'font-size':getTitleFontSize}" >{{nickName}}</span>
                <span :style="{'font-size':getInfoFontSize}" class="bg-info">{{uLevel}}</span></p>
                <p class="font-10 mb-2">
                    <LabelItem :siHeight="getInfoFontSize" rightLabel="1.2万" leftLabel="粉丝" ></LabelItem>
                    <LabelItem :siHeight="getInfoFontSize" rightLabel="1.2万" leftLabel="点赞" ></LabelItem>
                </p>

                <p class="mb-2">
                    <!-- 自我描述  -->
                    <LabelItem :siHeight="getInfoFontSize" :rightLabel="selfIntroduction" ></LabelItem>
                </p>
                        
            </div>
        </div>
    </div>
  
</template>

<script >
/** 文章的笔者的简介，头像，级别等的卡片 ，  */
import LabelItem from "./basic/LabelItem.vue";

export default {
    components:{
        LabelItem,
    },
    props:{
        authorPage:{type:String,default:"/home"},/**作者主界面*/
        selfIntroduction:{type:String,default:"未知",},
        imgUrl:{type:String}, /**需要进行判断 */
        imgData:{type:String},/**需要进行判断 */
        nickName:{ type:String,default:"未认证用户", },//用户的昵称
        uLevel:{ type:String,default:"普通", },//用户的级别
        siHeight:{ type:String,default:"100px", },
        arts:{
            type: Object,
        },
    },
    data(){
        return {
            searchValue: "得到",
            curActive: this.funcActive,
        };
    },
    methods:{
      handleFuncTitleClick(data){
          this.curActive = data;
          this.$emit("handleFuncTitleClick",data);
      },

    },
    computed:{
        /** 常规图像可以传入Url，也可以传入本地文件路径，也可以传入base64的图片
         * 优先选用base64的图片，其次选用url,暂时不支持本地文件
        */
        getImg(){
            let ret="";
            if(this.imgUrl && this.imgUrl!=""){
                ret = this.imgUrl;/**这个不能传入地址...可以试一下传入静态目录下的地址 */
                // ret = require('@/assets/images/404.png');
            }
            return ret;
        },
        getImgData(){return this.imgData;},
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
            var ret = this.sizeRate(this.siHeight,0.17);
            return ret;            
        },        
        getInfoFontSize(){/**根据整个的高度来确定内部信息字体的高度。信息 最多能是高度的7% */
            var ret = this.sizeRate(this.siHeight,0.07);
            return ret;  
        },
  }
};
</script >

<style scoped>

.ArtAuthorCard{
/**设置卡片的外围相关，比如阴影等 */
}

</style>