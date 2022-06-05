<template>
<!-- 带有多张图的，突出展示的文章（最多显示4张图片）所有的都应该具有统一的大小
     首先应该是一张卡片的样式: title第一行，图片并列第二行，第三行是文章的基本信息
     这类文章展示以图片和主题为主，所以不展示详细的文章摘要
     ['artID','email','title','abstract','content','text','imgList','ctime','mtime','status']
      -->
<div class="ArtDetails adi-box-col img-thumbnail">
    <!-- titles -->

    <!-- 中间多张图 （写成模块，图+X按钮）-->
    <div class="d-flex flex-row w-100">
        <div>
            <img class="img-thumbnail img-responsive wr-5" :style="getImgStyle" 
                :src="require('../../public/images/'+art.imgList[0])"  alt="can't find">
        </div>
        <!-- 右边下面一行的文章具体情况 -->
        <div class="flex-grow-1 d-flex flex-column w-100 wl-5">
            <div class="d-flex flex-row">
                <img class="wl-5 wr-5" :style="{height:'17px',width:'17px'}" src="../../public/images/header.svg" @onerror="this.src='../../public/images/header.svg'"/>
                <LabelItem  siHeight="23px" :rightLabel="art.email" ></LabelItem>
            </div>
            
            <div class="w-100 wl-5">
                <h3> 文章标题</h3>
                <!-- {{arts.header}} -->
                <p>文章摘要</p>
            </div>
 <!--  {'artID':'','title':'','abstract':'','content':'','imgList':'','up':'','down':'','ctime':'','mtime':'','status':''}; -->
            <div class="d-flex flex-row justify-content-between">
                <LabelItem siHeight="17px" :rightLabel="art.up+'点赞'" iconID="search"></LabelItem>
                <LabelItem siHeight="17px" :rightLabel="getStringTime(art.mtime)+'更新'" iconID="search"></LabelItem>
                <LabelItem siHeight="17px" :rightLabel="getStringTime(art.ctime)+'创建'" iconID="search"></LabelItem>
            </div>
        </div>
    </div>
</div>

</template>

<script >
import LabelItem from "./basic/LabelItem.vue";
var util = require('../assets/js/adiutil.js');

export default {
    components:{
        LabelItem,
    },
    props:{
        siHeight:{ type:String,default:"53px", },
        art:{
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
        getImgStyle(){
            /**"{'height':siHeight,'width':siHeight,'border-radius':getBorderRadus,'flex':'0 0 '+siHeight}" */
            var tstyle={};
            tstyle["height"]=this.siHeight;
            var a=this.art.imgList.length;
            tstyle["width"]=100/a + "%";
            tstyle["margin-left"]='1px';
            tstyle["border-radius"]=this.sizeRate(this.siHeight,0.1);
            // tstyle["flex"]= '0 0 ';

            return tstyle;
        },
        getStringTime(tm){
            return util.getTmStryyyymmdd(tm*1000);
        },
        getIconSize(){
            /**像素加减法(备选方法)
            /**用百分比 */
            var ret = (Math.ceil(parseInt(this.siHeight) * 0.8)) + "px";
            return ret;
        },
        getFontSize(){
            var ret = (Math.ceil(parseInt(this.siHeight) * 0.8)) + "px";
            return ret;            
        },
  },
  mounted(){
      console.log("dd");
      
  }
};
</script >

<style scoped>

.adi-box-col{
    margin-right: 0px;
    margin-left:0px;
    align-items: left;
}
.adi-img{
    width:100%;
    display: flex;
    align-items: center;
    overflow:hidden;
}
.adi-bottomInfo{
    justify-content: left;

}

</style>