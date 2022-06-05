<template>
<div>
    <div class="a"> 
        <div class="b">PHP中文网</div> 
        <div class="c"> 
                <ul> <li>HTML在线学习</li>
                <li>PHP在线学习</li>
                <li>python在线学习</li> 
                <li>html5在线学习</li> 
                </ul> 
        </div>
    </div>
</div>
</template>
<script >
import SvgIcons from "./svg/SvgIcons.vue";
export default {
    components:{
    },
    props:{
        siHeight:{
            type:String,
            default:"37px"
         },
    },
    data(){
        return {
            funcList: this.g.uiInfo.searchMap,
        };
    },
    methods:{
      clickOrder(op){
          this.g.uiInfo.searchOp=op
      }
    },
    computed:{

    },
    mounted(){
        console.log("mmm")
    },
};
</script >

<style scoped>

.a{ width: 205px; } 
.b{ width: 200px; 
    height: 50px; 
    background-color: 
    limegreen; 
    text-align: center; 
    line-height: 50px;
     color: #ffffff; } 
.c{ width: 200px;
    height: 300px; 
    background-color: 
    gainsboro; 
    display: none; /*visibility: hidden;*/ } 

ul{ list-style: none; margin-left: -40px; } 
ul li{ line-height: 50px; display: block;width: 200px; text-align: center; } 
.a:hover{ cursor: pointer; } 
.a:hover .c{ display: block; } 
.a:hover .b{ background-color: green; } 
li:hover{ background-color: gray; color: #FFFFFF; } 

</style>