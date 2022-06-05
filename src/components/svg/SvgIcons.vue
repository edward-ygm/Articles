<template>
   <!-- @mouseover注册鼠标移动时的函数 完成moveover的行为 -->
    <div id="SVGicons" class="SvgIcons"  @mouseover="fn_mmover" @mouseleave="fn_mleave" :style="{width:iconSize,height:iconSize}">
      <Svgs 
      :iconID="iconID"
      :linecolor="curLineColor"
      :lineWidth="lineWidth"
      :fillcolor="curFillColor"
      :rotateAngle="rotateAngle"
      :iconWidth="geticonSize"
      :iconHeight="geticonSize"
      :shadowFn='shadowFn'
      ></Svgs>
    </div>
</template>

<script>
/**
 * placeHolder，stHeight：高度，
 */
import Svgs from "./Svgs.vue";
export default {
    components:{
        Svgs,
    },
    props:{
        //预先输入的参数
        //这个ID确定了图标的形状
        iconID:{ type:String, default:"palms", },
        //图标线的颜色
        linecolor: { type: String, default: "red", },
        //图标线的宽度
        lineWidth: { type: String, default: "1px", },
        //图标内部的填充颜色
        fillcolor: { type: String, default: "#999", },
        //可以旋转
        rotateAngle:{ type: Number, default: 0, },
        iconSize:{type: String, default:"100%", },
    },
    data(){
        return{
            curLineColor:this.linecolor,
            curFillColor:this.fillcolor,
            shadowFn:"",
            searchValue:"得到",
            // 如下对象可以作为内联style的输入： stStyle:{
            //     width:"49px",
            //     border:"1 solid green",
            // }
        };
    },
    methods:{
      handleSearch(){
          if (this.searchValue) {
            this.$emit("handleSearch",this.searchValue);
          }
      },
      fn_mmover(){
        //   this.curLineColor="#222";
          this.curFillColor="green";
          /**这个是 svg内部定义的filter ，名字叫f1, 用url(#f1)来启动，用来添加阴影*/
          this.shadowFn="url(#f1)";
      },
      fn_mleave(){
        //   this.curLineColor="#222";
          this.curFillColor=this.fillcolor;
          this.shadowFn="";
      }
    },
    computed:{
        geticonSize(){
            //可以修改包含的div内比iconsize放大多少
            var ret = this.sizeRate(this.iconSize,0.95);
            return ret;
        },
        getInputPadding(){
            var x="2px";
            return x;
        },

        // getStyle(){
        //     this.stStyle.width= this.stHeight;
        //     return this.stStyle;
        // },
  }
};
</script >

<style scoped>
.SvgIcons{
    box-sizing: border-box;
}
.SvgIcons:hover{
    cursor: pointer;
    /**box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6);*/
}
</style>