<template>
  <div class="adi-hottoday">
    <el-container direction="vertical" style="height:100%,margin-top:0px">
      <el-header style="height: 80px">
        <TopSubFunc siHeight="80px"></TopSubFunc>
      </el-header>
       <el-main>
         <div v-for="item in artList" :key="item">
            <ArtDetails siHeight="120px" :arts="artList[0]"></ArtDetails>
         </div>
       </el-main>
    </el-container>
  </div>
</template>

<script>
import ArtDetails from "../components/ArtDetails.vue";
import TopSubFunc from "../components/TopSubFunc.vue";

export default {
  name: "HotToday",
  components:{
    TopSubFunc,
    ArtDetails,
  },
  props:{
    artList:{
      type: Array,
      default:function(){
      return [
                {bref:'护生文2',details:"<p >避苦求乐同,很多时候我们会忽略动物的生存权利，认为他们就是食物呀什么的。比如从小就灌输错误的想法，比如小鸡养来就是吃的。其实所有动物都是给吃的就高兴，惩罚就躲避，这些方面和人没有任何区别。</p>",imgList:["icon2.png","icon3.png","icon4.png"],userName:"刘德华",userIcon:"ldh001.png",wholeArt:"整篇文档",comment:"133",ntNum:1,id:2,url:"#",},
                {bref:'护生文2',details:"<p >避苦求乐同,很多时候我们会忽略动物的生存权利，认为他们就是食物呀什么的。比如从小就灌输错误的想法，比如小鸡养来就是吃的。其实所有动物都是给吃的就高兴，惩罚就躲避，这些方面和人没有任何区别。</p>",imgList:["icon2.png","icon3.png","icon4.png"],userName:"刘德华",userIcon:"ldh001.png",wholeArt:"整篇文档",comment:"133",ntNum:1,id:2,url:"#",},
                {bref:'护生文2',details:"<p >避苦求乐同,很多时候我们会忽略动物的生存权利，认为他们就是食物呀什么的。比如从小就灌输错误的想法，比如小鸡养来就是吃的。其实所有动物都是给吃的就高兴，惩罚就躲避，这些方面和人没有任何区别。</p>",imgList:["icon2.png","icon3.png","icon4.png"],userName:"刘德华",userIcon:"ldh001.png",wholeArt:"整篇文档",comment:"133",ntNum:1,id:2,url:"#",},
                
                {bref:'护生文3',details:"<p >避苦求乐同</p>",imgList:["icon2.png","icon3.png","icon4.png"],userName:"刘德华",comment:"133",ntNum:1,id:3,url:"#",},
              ];
        }
      },
  },

  data(){
    return {

    };
  },
  methods: {
    handleClick() {
      // 处理搜索相关的业务流程
      console.log("按钮");
    },
  }

};
</script>

<style scoped>

</style>