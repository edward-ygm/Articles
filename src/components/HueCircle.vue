<template>
<div>
   这里用于选择色彩。Maroon
   <table>
     <tr><td>main</td> <td>shine</td> <td>important-left</td> <td>important-right</td> 
     <td>soft-left</td> <td>soft-right</td> <td>nobody-left</td> <td>nobody-right</td></tr>
     <tr >
    <td > <div class="rectBox1"></div></td> 
    <td > <div class="rectBox2"></div></td> 
    <td > <div class="rectBox3"></div></td> 
    <td > <div class="rectBox4"></div></td> 
    <td > <div class="rectBox5"></div></td> 
    <td > <div class="rectBox6"></div></td> 
    <td > <div class="rectBox7"></div></td> 
    <td > <div class="rectBox8"></div></td> 
     </tr>
   </table>
</div>

</template>

<script>
/**
 * placeHolder，stHeight：高度，
 */
export default {
    components:{
        // IconEmoji,
    },
    props:{
        //预先输入的参数
        placeHolder:{
            type:String,
            default:"输入文字框", 
        },
    },
    data(){
        return{
            mylist: [1,2,3,4,5,6,7,8]
        };
    },
    methods:{

    },
    computed:{
        getInputPadding(){
            // return "37px";
            var x="2px";
            return x;
        },

  }
};
</script >

<style lang="scss">
@import "../styles/common.scss";

$thelist:$main-hue $shine-hue $important-left-hue $important-right-hue  $soft-left-hue $soft-right-hue $nobody-left-hue $nobody-right-hue ;
$mywidth:97px;
$myheight:67px;
$sat:80%;
$bri:25%;
.rectBox1 {width:$mywidth; height:$myheight; box-sizing: border-box; background-color:hsl($main-hue,$sat,$bri);};
.rectBox2 {width:$mywidth; height:$myheight; box-sizing: border-box; background-color:hsl($shine-hue,$sat,$bri);};
.rectBox3 {width:$mywidth; height:$myheight; box-sizing: border-box; background-color:hsl($important-left-hue,$sat,$bri);};
.rectBox4 {width:$mywidth; height:$myheight; box-sizing: border-box; background-color:hsl($important-right-hue,$sat,$bri);};
.rectBox5 {width:$mywidth; height:$myheight; box-sizing: border-box; background-color:hsl($soft-left-hue,$sat,$bri);};
.rectBox6 {width:$mywidth; height:$myheight; box-sizing: border-box; background-color:hsl($soft-right-hue,$sat,$bri);};
.rectBox7 {width:$mywidth; height:$myheight; box-sizing: border-box; background-color:hsl($nobody-left-hue,$sat,$bri);};
.rectBox8 {width:$mywidth; height:$myheight; box-sizing: border-box; background-color:hsl($nobody-right-hue,$sat,$bri);};

</style>