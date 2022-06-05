<template>
<div class="bigger-margin" :style="{'height':siHeight}">
    <div class="sc-box" :style="{'height':siHeight}">
        <!-- isActive保留active的属性，这个方法是比较好的实现方式 -->
        <div :class="{'sc-title':true,'isActive': func.id === curActive,}" v-for="(func,i) in funcList" :key="func.id"
        :style="{'font-size':getFontSize}" 
         @click="handleFuncTitleClick(func.id)">
            <a :href="func.url" >{{i}}{{func.name}}</a>
        </div>
    </div>
</div>

</template>

<script >
/**
 * placeHolder，stHeight：高度，
 */
// import SvgIcons from "./svg/SvgIcons.vue";
export default {
    components:{
        // SvgIcons,
    },
    props:{
        //预先输入的参数
        funcList:{
            type: Array,
            default:function(){
            return [
                {name:'关注',clicked:0,ntNum:12,id:1,url:"#"},
                {name:"今日热榜",clicked:1,ntNum:12,id:2,url:"#"},
                {name:"法音",clicked:0,ntNum:12,id:3,url:"#"},
                {name:"法会",clicked:0,ntNum:12,id:4,url:"#"},
                {name:"放生",clicked:0,ntNum:12,id:5,url:"#"},
                {name:"素食",clicked:0,ntNum:12,id:6,url:"#"}
            ];
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
      }
    },
    computed:{
        getInputPadding(){
            // return "37px";
            var x="2px";
            return x;
        },
        getIconSize(){
            /**像素加减法(备选方法)
            /**用百分比 */
            var ret = (Math.ceil(parseInt(this.siHeight) * 0.8)) + "px";
            return ret;
        },
        getFontSize(){
            var ret = (Math.ceil(parseInt(this.siHeight) * 0.3)) + "px";
            return ret;            
        }
  }
};
</script >

<style scoped>

.bigger-margin
{
    /** 水平 垂直 模糊距离 阴影尺寸 颜色 */
    box-shadow: -20px -10px 100px 30px var(--gap-color);
    border-radius: 10px;
}
.sc-box{
    display: flex;
    flex-direction: row;

    height: 87px;
    width: 100%;
}

.sc-title{

    height: 100%;
    /**需width:75px;控制 */
    box-shadow: 0px 0px 0px 0.3px var(--line-color);
    flex:1 1 65px;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;

}
.sc-title:first-child{
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
}
.sc-title:last-child{
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
}
.sc-title:hover{
    background-color: rosybrown;
}
.sc-title:visited{
    background-color: var(--fill-color);
}

.sc-title *{
    /**font-size:19px;需要控制 */
}
</style>