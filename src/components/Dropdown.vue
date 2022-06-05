<template>
    <div id="dropdowncomponent" class="btn-group" :style="getDropStyle">
        <button type="button" class="btn btn-light dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"  :style="getButtonStyle">
          <SvgIcons iconID="moreFunc"  :iconSize="siHeight"></SvgIcons>
        </button>
        <div class="dropdown-menu" :style="getdropdownStyle">
            <li>
                <div class="dropdown-item" v-for="item in funcList" :key="item.url" :style="getitemStyle">
                    <a :href="item.url" :style="getAStyle"> {{item.pageName}}</a>
                </div>
            </li>
        </div>
      </div>
</template>
<script >
/** 还没有想好为什么需要这个东西 
 * 这个是常规的下拉菜单，文字格式，可以设置下拉菜单的方向 */
import SvgIcons from "./svg/SvgIcons.vue";
export default {
    components:{
        SvgIcons,
    },
    props:{
        siHeight:{ type:String, default:"37px" },
        siName:{type:String,default:"Button"},
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
            tstyle["width"]=this.siHeight;
            tstyle["height"]=this.siHeight;
            return tstyle;
        },
        getButtonStyle(){
            var tstyle={};
            tstyle["width"]=this.sizeRate(this.siHeight,0.85);
            tstyle["height"]=this.sizeRate(this.siHeight,0.85);
            tstyle["width"]=this.siHeight;
            tstyle["height"]=this.siHeight;
            return tstyle; 
        },
        getdropdownStyle(){
            var tstyle={};
            tstyle["min-width"]='100px';
            tstyle["width"]='100px';
            tstyle["top"]='115%';
            tstyle["left"]=this.sizeAdd(this.siHeight,'-'+ tstyle["width"]);
            tstyle["background-color"]='#343a40';
            tstyle["border-radius"]=this.sizeRate(this.siHeight,0.35);
            return tstyle;
        },
        getAStyle(){
            var tstyle={};
            tstyle["color"]='#0d6efd';
            tstyle["font-size"]=this.sizeRate(this.siHeight,0.57);
            var ret = this.sizeRate(this.siHeight,0.85);
            return ret;
        },
        getitemStyle(){
            var tstyle={};
            tstyle["display"]='block';
            tstyle["text-align"]='right';
            return tstyle;
        }
    },
};
</script >

<style scoped>
 .btn-group,
 .btn{
      padding: 0;
      margin: 0;
  }
.btn,
.btn:hover
{
    background-color:transparent;
    border:none;
}
.dropdown-item:hover{
    background-color:beige;
}
.dropdown-menu li a{
    font-size:23px;
    display:block;
    text-align: right;
}
 .btn-group {
    vertical-align: top;
    margin:0px;
    border:0px;
    width:35px;
    height:65px;
  }

</style>