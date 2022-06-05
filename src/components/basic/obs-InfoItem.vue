<template>
<el-tooltip placement="top">
    <div placement="top" effect="light" content="Hello" >多行信息<br>第二行</div>

    <div class="InfoItem d-flex flex-row" :style="{'height':siHeight}">
        <p v-if="leftName" :style="{'font-size':getFontSize}">{{leftName}}</p>
        <SvgIcons  v-if="iconID" :iconSize="getIconSize" :iconID="iconID"></SvgIcons>
        <p  v-if="rightName" :style="{'font-size':getFontSize}">{{rightName}}</p>
    </div>
</el-tooltip>

</template>

<script >
import SvgIcons from "../svg/SvgIcons.vue";

export default {
    components:{
        SvgIcons,
    },
    props:{
        //预先输入的参数
        /**ntNum是新通知的数量 ； url是文章的跳转地址*/
        iconID:{
            type:String,
        },
        siHeight:{
            type:String,
            default:"89px",
        },
        leftName:{
            type:String,
        },
        rightName:{
            type:String,default:"置顶",
        },  
        arts:{
            type: Object,
            default:function(){
            return  {bref:'护生文',details:"<p >避苦求乐同</p>",imgUrl:"icon1.png",userName:"刘德华",comment:"133",ntNum:1,id:1,url:"#",};
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
    },
    computed:{
        getIconSize(){
            if(!this.iconID || this.iconID==""){
                return "0px";
            }else{
                var rate = 0.79;
                var pattern = 'px|%|em|ex|ch|rem';
                var flag = 'i';
                var reg = new RegExp(pattern, flag);
                var unit = reg.exec(this.siHeight)[0];/**返回 -3是index位置 */

                return (Math.ceil(parseInt(this.siHeight) * rate)) + unit;
            }
        },
        getFontSize(){
            if(!this.siHeight || this.siHeight==""){
                return "0px";
            }else{
                var rate = 0.79;
                var pattern = 'px|%|em|ex|ch|rem';
                var flag = 'i';
                var reg = new RegExp(pattern, flag);
                var unit = reg.exec(this.siHeight)[0];/**返回 -3是index位置 */

                return (Math.ceil(parseInt(this.siHeight) * rate)) + unit;
            }  
        }
  }
};
</script >

<style scoped>

p{
    margin:0;
    padding: 0;
}
.adi-flex{
    height:19px;
}
.adi-flex:hover{
    color:cadetblue;
    background-color: cornsilk;
}


</style>