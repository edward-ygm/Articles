<template>
<div class="lc-box">
        <div class="lc-left">
            <SvgIcons></SvgIcons>
            <span>{{arts.rank}}</span>
        </div>
        <div class="lc-mid" v-htmls="arts.details">
            {{arts.details}}
        </div>
        <div class="lc-right">
            <img src="" alt="">
        </div>
</div>

</template>

<script >
/**
 * placeHolder，stHeight：高度，
 */
// import LabelItem from "@/components/basic/LabelItem.vue";
import SvgIcons from "./svg/SvgIcons.vue";

export default {
    components:{
        SvgIcons,
    },
    props:{
        //预先输入的参数
        /**ntNum是新通知的数量 ； url是文章的跳转地址*/
        arts:{
            type: Object,
            default:function(){
            return  {bref:'护生文',details:"<p >避苦求乐同</p>",imgUrl:"icon1.png",userName:"刘德华",comment:"133",ntNum:1,id:1,url:"#",rank:1};
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
*{
    /*border:1px solid red;*/
}
.lc-box{
    display:flex;
    justify-content: left;
    align-items: center;

    outline: 1px dotted red;
}
.lc-left{
    flex:1;

    display:flex;
    flex-direction: column;
}
.lc-right{
    flex:0 0 100px;
}

</style>