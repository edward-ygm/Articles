<template>
  <div id="searchInput" class="SearchInput"  @submit.prevent="handleSearch">
      <div class="adi-box">
          <input type="text" class="form-control" aria-label="Text input with dropdown button" 
          :style="getStyle"
          :placeholder="placeHolder"
          v-model="searchValue">
      </div>
      <div class="adi-abs-icon" :style="getIconStyle" @click="handleSearch">
            <SvgIcons iconID="search" :iconSize="getIconSize"></SvgIcons>
      </div>
  </div>

</template>

<script>
/**
 * placeHolder，stHeight：高度，
 * 通过内联模式修改高度  :style="{height:stWidth,} 通过内联函数修改 :style="getStyle"
 */
import SvgIcons from "./svg/SvgIcons.vue";
export default {
    components:{
        SvgIcons,
    },
    props:{
        //预先输入的参数
        placeHolder:{
            type:String,
            default:"输入信息", 
        },
        //组件的高度,宽度为100%,
        siHeight:{
            type:String,
            default:"100px",
        },
    },
    data(){
        return{
            searchValue:"",
        };
    },
    methods:{
      handleSearch(){
          if (this.searchValue) {
            this.$emit("handleSearch",this.searchValue);
          }
      },
    },
    computed:{
        // :style="{'height':getHeight,'font-size':getFontSize,'padding-right':getPaddingRight,'border-radius':getRadius,'padding-left':getRadius,}

        getStyle(){
            var tstyle={};
            tstyle["height"]=this.sizeRate(this.siHeight,0.87);
            tstyle["font-size"]=this.sizeRate(this.siHeight,0.4);
            tstyle["z-index"]=1;
            tstyle["padding-right"]=this.sizeAdd(this.siHeight,'2px');
            tstyle["border-radius"]=this.sizeRate(this.siHeight,0.23);
            tstyle["padding-left"]=this.sizeRate(this.siHeight,'3px');
            return tstyle;
        },
        getIconStyle(){
            var tstyle={};
            tstyle["width"]=this.sizeRate(this.siHeight,0.73);
            tstyle["height"]=this.sizeRate(this.siHeight,0.73);
            tstyle["right"]=this.sizeRate(this.siHeight,0.1);
            tstyle["top"]=this.sizeRate(this.siHeight,0.13);
            return tstyle;  
        },
        getIconSize(){
            /**用百分比 */
            var ret = this.sizeRate(this.siHeight,0.63);
            return ret;
        },
        getFontSize(){
            var ret = this.sizeRate(this.siHeight,0.4);
            return ret;
        },
        getPaddingRight(){
            /**用于预留搜索Icon的大小 */
            var ret = this.sizeRate(this.siHeight,1.1);
            return ret;
        },
        getRadius(){
            /**倒圆角应根据高度来自定义 */
            // var ret = (Math.ceil(parseInt(this.siHeight) * 0.2)) + "px";
            var ret = this.sizeRate(this.siHeight,0.23);
            return ret;
        },
        getHeight(){
            var ret = this.sizeAdd(this.siHeight,-10);
            return ret;
        },
        putCenter(){
            var ret = 10/2;
            return ret;
        },
  }
};
</script >

<style scoped>
.SearchInput{
    /* search 控件的外边框*/
    width:100%;
    height:100%;
    /*取消外框*/
    position:relative;
    margin:0;
    padding: 0;

}
.adi-box{
    width:100%;
    height:100%;
    display:flex;
    align-items: center;
}
.adi-input{
    width:100%;
    height:85%;
}

.adi-abs-icon{
    position: absolute;
    height: 100%;
    right: 2px;
    top: 0;
    z-index:2;

    display: flex;
    align-items: center;
    justify-content: center;
}
.adi-abs-icon:hover{
    cursor: pointer;
    /* box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6);*/
}

</style>