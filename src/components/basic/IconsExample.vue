<template>
  <div class="sc-iconsExample">
      <p>所有的图标都支持修改填充、线，旋转。所有的都可以不设置，缺省值下的图标都可以通过全局样式进行更改。如下图标的框是用于测试用，可以直接删除的。</p>
      <div v-for="(val,k) in iconMap" :key="k" class="sc-iconsList">
        <SvgIcons :iconID="k" iconSize="53px" ></SvgIcons>
        <p>{{k}}</p>
      </div>
  </div>
</template>


<script>
/**这个是用来显示当前SVGIcons支持了那些icon或SVG图片 */
import SvgIcons from "../svg/SvgIcons.vue";
// iconMap需要拷贝自Svg.vue
export default{
  components:{
    SvgIcons,
  },
  data(){
    return {
      curActive:"abc",
      iconMap:{

   palms:"i504palms",
  smile:"502smile",
  star:"501star",
  heart:"505heart",
  thumbUp :"506thumbUp",
  thumbDown :"506thumbDown",
  search :"507search",
  direction:"508direction",
  moreFunc:"509moreFunc",
  home:"510home",
  refresh:"511refresh",
  attachment:"512attachment",
  fullscreen:"513fullscreen",
  forward:"515forward",
  comment:"516comment",
  upToTop:"517upToTop",
  footPrint:"518footPrint",
  header:"519header",
  suitcase:"520suitcase",
  goodscar:"521goodscar",
  uploader:"522uploader",
  cross:"523cross",
  doctorHat:'525doctorHat',

        },
    }
  },
  methods:{
    handleSearch(){
      // 处理搜索相关的业务流程
      console.log("接收到了搜索的信息");
    },
  },
}
</script>

<style scoped>
.sc-iconsExample{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  flex-wrap: wrap;

  height: 100%;
  width: 100%;

}
.sc-iconsList{
  flex:0 0 auto;
  height:75px;
  width: 63px;
  margin:10px 10px 10px 10px;
  
}
.sc-iconsList div{
  border:1px solid #777;
}

</style>
