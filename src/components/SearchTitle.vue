<template>
<!-- 通过内联模式修改高度  :style="{height:stWidth,} 通过内联函数修改 :style="getStyle" -->
<div id="topSearchTitle" class="SearchTitle" :style="{'height':siHeight,width:'100%'}">
    <div class="lc-box" >
        <div class="lc-left" @click="moveBack"
        :style="{'width':getIconSize,'height':getIconSize}">
            <SvgIcons iconID="direction" :iconSize="getIconSize"></SvgIcons>
        </div>
        <div class="lc-mid">
           <SearchInput @handleSearch="handleSearch" :siHeight="siHeight" >  </SearchInput>
        </div>

        <div class="lc-right" :style="{'width':getIconSize,'height':getIconSize}">
            <button @click="onFlush" class="btn btn-3d" :style="{'width':getIconSize,'height':getIconSize}"> 刷新 </button>
            <!-- <DropdownIcon :siHeight="getIconSize"></DropdownIcon> -->
        </div>
    </div>
</div>

</template>

<script>
/**
 * placeHolder，stHeight：高度，
 */
import SvgIcons from "./svg/SvgIcons.vue";
import SearchInput from "./SearchInput.vue";
import DropdownIcon from "./DropdownIcon.vue"
import MyDropDown from "./MyDropDown.vue"
export default {
    components:{
        SvgIcons,
        SearchInput,
        // DropdownIcon,
        // MyDropDown,
    },
    props:{
        //预先输入的参数
        placeHolder:{
            type:String,
            default:"输入文字框", 
        },
        //组件的高度,宽度为100%,
        siHeight:{
            type:String,
            default:"37px",
        },
    },
    data(){
        return{
            searchValue:"得到",
        };
    },
    methods:{
      handleSearch(inputVal,){
          console.log("searchTitle 处理消息"+inputVal);
          if (inputVal) {
            this.$emit("handleSearch",inputVal);
          }
      },
      onFlush(){
          this.$emit("onFlush");
      },
      moveBack(event,data){
          this.$router.go(-1);
      }
    },
    computed:{
        getIconSize(){
            /**像素加减法(备选方法) */
            var ret = this.sizeRate(this.siHeight,0.85);
            return ret;
        },
    },
    mounted(){
        // this.getIconSize();
    }
};
</script >

<style scoped>
*{
  /**基本的清空设置 */
  margin:0px;
  padding: 0px;
  border:0px;
  outline-style: none;
  background-color:none;
  box-sizing: border-box;
}
.lc-box{
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 100%;
    width: 100%;
}
.lc-left
{
    flex:0 0 auto;
    height:100%;
    width:37px;/** */
    margin-left: 15px;
    margin-right: 3px;
    order:1;
}
.lc-right{
    flex-grow:0 0 auto;
    width:37px;/** */
    margin-right: 20px;
    height:100%;
    order:3;
}
.lc-mid{
    flex-grow: 1 1 auto;
    height:100%;
    width:100%;
    margin-left:10px;
    margin-right:10px;
    order:2;
}
</style>