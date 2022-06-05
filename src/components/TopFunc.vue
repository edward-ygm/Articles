<template>
    <el-dropdown :style="getDropStyle">
        <el-button type="primary" :style="getButtonStyle">
            <SvgIcons iconID="moreFunc"  :iconSize="getIconSize"></SvgIcons>
        </el-button>

        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item in funcList" :key="item.url">
               <a :href="item.url"> {{item.pageName}}</a>
            </el-dropdown-item>
            <el-dropdown-item divided>符号</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>

</template>

<script >
import SvgIcons from "./svg/SvgIcons.vue";
export default {
    components:{
        SvgIcons,
    },
    props:{
        siHeight:{
            type:String,
            default:"37px"
         },
    },
    data(){
        return {
            funcList: this.g.uiInfo.partMap,
        };
    },
    methods:{
      handleFuncTitleClick(data){
          this.curActive = data;
          this.$emit("handleFuncTitleClick",data);
      }
    },
    computed:{
        getDropStyle(){
            var tstyle={};
            tstyle["width"]=this.sizeRate(this.siHeight,0.85);
            tstyle["height"]=this.sizeRate(this.siHeight,0.85);
            return tstyle;
        },
        getButtonStyle(){
            var tstyle={};
            tstyle["width"]=this.siHeight;
            tstyle["height"]=this.siHeight;
            return tstyle; 
        },
        getIconSize(){
            console.log(this.siHeight);
            var ret = this.sizeRate(this.siHeight,0.85);
            return ret;
        },
    },
};
</script >

<style scoped>
 .el-dropdown,
 .el-button{
      padding: 0;
      margin: 0;
  }
.el-button--primary,
.el-button--primary:hover
{
    background-color:transparent;
    border:none;
}
.el-dropdown-menu li a{
    font-size:23px;
    display:block;
    text-align: right;
}

  .el-dropdown {
    vertical-align: top;
    margin:0px;
    border:0px;
    width:89px;
    height:65px;
  }
  .el-dropdown + .el-dropdown {
    margin-left: 15px;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>