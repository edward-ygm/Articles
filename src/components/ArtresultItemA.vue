<template>
<div class="sc-box" :style="{'height':siHeight}">

   <img class="sc-left"  :style="{'height':siHeight,'width':siHeight,'border-radius':getBorderRadus,'flex':'0 0 '+siHeight}" 
   :src="require('../../public/images/'+arts.imgUrl)"  alt="图片显示位置">
   <div class="sc-right" >
       <div class="sc-title" :style="{height:getTitleHeight}">
           <div class="sc-title-left" :style="{'font-size':getTitleFontSize}">
               <p>{{arts.bref}}</p>
           </div>
           <div class="sc-title-right" :style="{'font-size':getTitleFontSize,'height':getTitleHeight,width:getTitleHeight,'border-radius':getTitleFontSize}">
               {{arts.ntNum}}
            </div>
       </div>
       <!-- vhtml 允许显示为html格式的文本 -->
       <div class="sc-detail" v-html="arts.details">
           {{arts.details}}
       </div>
       <div class="sc-info">
            <div class="sc-info-items" >
                <SvgIcons iconID="upToTop" :iconSize="getIconSize_s"></SvgIcons>
                <span :style="{'font-size':getFontSize_s}">置顶</span>
            </div>
            <div class="sc-info-items">
                <!-- 需要修改为实际的头像 -->
                <SvgIcons iconID="header" :iconSize="getIconSize_s"></SvgIcons>
                <span :style="{'font-size':getFontSize_s}">{{arts.userName}}</span>
            </div>
            <div class="sc-info-items">
                <SvgIcons iconID="comments" :iconSize="getIconSize_s"></SvgIcons>
                <section  :style="{'font-size':getFontSize_s}">{{arts.comment}}</section>
                <section  :style="{'font-size':getFontSize_s}">评论</section>
            </div>
       </div>
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
                 return  {bref:'护生文',details:"<p >避苦求乐同</p>",imgPath:"../../public/images/",imgUrl:"icon1.png",userName:"刘德华",comment:"133",ntNum:1,id:1,url:"#",};
            }
        },
        //组件
        funcActive:{
            type:Number,
            default:1,
        },
        //组件的高度,宽度为100%,
        siHeight:{
            type:String,
            default:"75px",
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
      getHeight(rate){
          var ret = (Math.ceil(parseInt(this.siHeight) * rate * 0.8));
          return ret+"px";
      },

    },
    computed:{
        getBorderRadus(){
            return this.siHeight/2;
        },
        getTitleHeight(){
            var ret = (Math.ceil(parseInt(this.siHeight) * 0.3)) + "px";
            return ret;
        },
        getIconSize(){
            /**像素加减法(备选方法)
            /**用百分比 */
            var ret = (Math.ceil(parseInt(this.siHeight) * 0.8)) + "px";
            return ret; 
        },
        getTitleFontSize(){
            var ret = (Math.ceil(parseInt(this.siHeight) * 0.15)) + "px";
            return ret;            
        },
        getIconSize_s(){
            /**像素加减法(备选方法)
            /**用百分比 */
            var ret = (Math.ceil(parseInt(this.siHeight) *0.3 * 0.8)) + "px";
            return ret;
        },
        getFontSize_s(){
            var ret = (Math.ceil(parseInt(this.siHeight) *0.3 * 0.5)) + "px";
            return ret;            
        }
  }
};
</script >

<style scoped>
.sc-box{
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
}
.sc-left{
    /**需width:75px;控制 */
    box-shadow: 0px 0px 0px 0.3px var(--line-color);
}

.sc-right{
    flex:1 0 auto;/** 占据所有右侧的空间 */
    height:100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
}

.sc-title{
    flex:1 0 auto;
    display:flex;

    height:40%;
    width:100%;

    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex-wrap:nowrap;
}
.sc-title-left{
    flex:1 0;
    height:100%;
    
    display:flex;
    align-items: center;
}
.sc-title-right{
    flex:0 0 auto;
    height:100%;
    background-color: red;
    color:black;

    text-align: center;
}
.sc-detail{
    height:35%;
    width:100%;
    word-wrap:break-word;
}
.sc-info{
    width:100%;
    height:25%;

    display:flex;
    
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex-wrap:nowrap;

}
.sc-info-items{
    flex:1 0 auto;
    height: 100%;
    border:1px solid blue;

    display:flex;
    justify-content: center; 
    transform:scale(1);/** 在字体需要更小的时候，可以采用这个参数。或者，都采用这个参数 */
}
.sc-box:hover{
    background-color: rosybrown;
}
.sc-box:visited{
    background-color: var(--fill-color);
}
</style>