<template>
<!-- 通过内联模式修改高度  :style="{height:stWidth,} 通过内联函数修改 :style="getStyle" -->
<div id="artLabelItem" class="LabelItem d-flex flex-row justify-content-start d-inline-flex">
    <div><span :style="{'font-size':getFontSize,'margin-right':'1px','overflow':'hidden','text-overflow':'clip'}" v-if="leftExist" class="label label-default">{{leftLabel}}</span></div>
        <SvgIcons  v-if="iconIDExist" :iconSize="getIconSize" :iconID="iconID"></SvgIcons>
    <div><span :style="{'font-size':getFontSize,'margin-left':'1px','overflow':'hidden','text-overflow':'clip'}" v-if="rightExist" class="label label-default" >{{rightLabel}}</span></div>
</div>
</template>

<script>
/**模块描述  一个图标+label文字（根据siHeight来规划）
 * 作者：EdwardYang
 * 
 */
import SvgIcons from "../svg/SvgIcons.vue";
export default {
    components:{
        SvgIcons,
    },
    props:{
        /**高度，宽度默认100% */
        siHeight:{type:String,default:"23px",},
        //label名称
        leftLabel:{type:String,default:"",},//左边字符，‘’表示没有
        rightLabel:{type:String,default:"",},//右边字符，‘’表示没有
        //组件的高度及宽度都可以定义,宽度可定义,
        siWidth:{type:String,default:"85px",},
        iconID:{type:String,default:"",},//Icon的ID,如果为空则没有图标
    },
    data(){
        return{
            searchValue:"得到",
        };
    },
    methods:{
      clicked(){//点击后的处理函数
            this.$emit("clicked",this.searchValue);
      },
    },
    computed:{
        leftExist(){
           return this.leftLabel==''? false: true;
        },
        rightExist(){return this.rightLabel==''? false: true;},
        iconIDExist(){return this.iconID==''? false: true;},
        getIconSize(){
            return this.sizeRate(this.siHeight,0.85);
        },
        getFontSize(){
            return this.sizeRate(this.siHeight,0.55);
        }
    },
    mounted(){
        // this.iconID ='search';//这个只是测试一下。
    }
};
</script >

<style scoped>
.LabelItem{
    width:100%;
}
.LabelItem:hover{
    background-color: gray;/**可以自己在组件外围定义 */
}
</style>