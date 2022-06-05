<template>
<div class="adi-flex" :style="{'height':siHeight}">
    <div class="lc-title">
        <ArtInfoItem iconID=''></ArtInfoItem>
    </div>
    <div class="lc-details"></div>
    <div class="lc-bottom"></div>
    <div class="lc-right">
        <SvgIcons></SvgIcons>
    </div>
</div>

</template>

<script >
/**
 * placeHolder，stHeight：高度，
 */
// import LabelItem from "@/components/basic/LabelItem.vue";
import ArtInfoItem from "./components/ArtInfoItem.vue";

export default {
    components:{
        ArtInfoItem,
    },
    props:{
        //预先输入的参数
        /**ntNum是新通知的数量 ； url是文章的跳转地址*/
        arts:{
            type: Object,
            default:function(){
            return  {bref:'护生文',details:"<p >避苦求乐同</p>",imgUrl:"icon1.png",userName:"刘德华",comment:"133",ntNum:1,id:1,url:"#",};
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
  }
};
</script >

<style scoped>
.adi-flex{
    
}

</style>