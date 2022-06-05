<template>
<!-- 文章显示摘要，一般小于3句话。 -->
<div class="ArtresultItemBref adi-flex">
    <!-- 左边的一张图 （写成模块，图+X按钮）如果既不=imgLeft，也不等于imgRight，那么就不显示这个图片，就成为另外一种ArtBref的样式 -->
   <img v-if="imgType='imgLeft'" class="sc-left"  :style="getImgStyle"  :src="require('../../public/images/'+arts.imgUrl)"  alt="图片显示位置">

    <div class="adi-right">
        <!-- 右边上部分的title -->
        <div class="titles">
            <h1>这是什么情况，我的内心很焦虑。内心不够强大，在业风吹的情况下，很多事情都无法承办，不管是世间还是出世间的事情。心情很焦虑，很焦虑。</h1>
        </div>
        <!-- 右边下面一行的文章具体情况 -->
        <div class="adi-flex">
            <InfoItem siHeight="17px" rightName="某博主" iconID="search"></InfoItem>
            <InfoItem siHeight="17px" rightName="55评论" iconID="search"></InfoItem>
            <InfoItem siHeight="17px" rightName="2小时前" iconID="search"></InfoItem>
        </div>
    </div>

    <!-- 如果imgRight，那么就显示这个 -->
   <img v-if="imgType='imgRight'" class="sc-left"  :style="getImgStyle"  :src="require('../../public/images/'+arts.imgUrl)"  alt="图片显示位置">

</div>

</template>

<script >
import InfoItem from "./basic/obs-InfoItem.vue";

export default {
    components:{
        InfoItem,
    },
    props:{
        imgType:{type:String,default:"imgLef",},
        siHeight:{ type:String,default:"53px", },
        arts:{
            type: Object,
            default:function(){
            return  {bref:'护生文',details:"<p >避苦求乐同</p>",imgPath:"../../public/images/",imgUrl:"icon1.png",userName:"刘德华",comment:"133",ntNum:1,id:1,url:"#",};
            }
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
        getImgStyle(){
            var tstyle={};
            tstyle['height']=this.siHeight;
            tstyle['width']=this.siHeight;
            tstyle['border-radius']=this.sizeRate(this.siHeight,0.3);
            tstyle['order'] = this.imgType=="imgLeft"?10:1;
            return tstyle;
            
        },
  }
};
</script >

<style scoped>
.adi-flex{
    justify-content: left;
}
.ArtInfoItem{
    margin-right: 10px;
    margin-left:10px;
}

</style>