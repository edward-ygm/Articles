<template>
  <div id="wenzhang" class="adi-hottoday" @touchstart="touchStart" @touchend="touchEnd" @touchmove="touchMove">
    <nav class="sticky-top navbar-light bg-light"  style="height:38px" >
      <!-- <nav class="nav nav-pills nav-justified"> -->
      <SearchTitle siHeight="37px" @handleSearch="handleSearch"
      @onFlush="onFlush"></SearchTitle>
      <!-- </nav> -->
    </nav>
    <!-- 如下是文章的主题，是否需要添加一个新的title -->
    <div class="d-flex flex-column  w-100 " >
      <div class=" wzCard d-flex flex-row w-100 m-1"  ref="titlelist"
       v-for="art in articleList" :key="art.artID" :style="getRowStyle"
       >
          <div class=" " :style="getRightStyle" @click="clickForArticle(art.artID)">

            <img v-if="hasIcon(art)" class="img-thumbnail img-responsive wr-5"   :style="getImgStyle" 
            :src="art.imgList[0]"  alt="can't find">
            <SvgIcons v-else iconID="doctorHat" class="img-thumbnail img-responsive wr-5" :iconSize="getIconSize"></SvgIcons>
          </div>
          <div class="flex-grow-1 d-flex flex-column ml-1 w-100">
             <div class="w-100 wl-5" @click="clickForArticle(art.artID,art.email)">
               <LabelItem  siHeight="17px" :leftLabel="art.title" ></LabelItem>
               <LabelItem  siHeight="10px" :leftLabel="art.abstract" ></LabelItem>
             </div>
             <div class="d-flex flex-row justify-content-start " style="">
                <LabelItem  siHeight="10px" iconID="doctorHat" :rightLabel="art.nickName" 
                 @click="clickForAuthor(art.id)"></LabelItem>
                <LabelItem siHeight="10px" rightLabel='点赞' iconID="thumbUp"
                @click="clickForthumbUp(art.id)"></LabelItem>
                <LabelItem siHeight="10px" :rightLabel="getStringTime(art.mtime)+'更新'" ></LabelItem>
                <!-- <LabelItem siHeight="17px" :rightLabel="getStringTime(art.ctime)+'创建'" ></LabelItem> -->
              </div> 
          </div>

          <br><br><br>
      </div>
    </div>
    <div v-if='loadingshow'> <p>加载中...</p> </div>
    <!-- <div class="btn btn-primary" :click="handleSearch">hello</div> -->
  </div>
</template>

<script>
// import ArtDetails from "../components/ArtDetails.vue";
import SearchTitle from "../components/SearchTitle.vue";
import LabelItem from "../components/basic/LabelItem.vue";
import SvgIcons from "../components/svg/SvgIcons.vue";

import axios from "axios";
var util = require('../assets/js/adiutil.js');

// var AA = require('../assets/js/testex.js');
// import AA from '../assets/js/testex.js';
import * as AA from '../assets/js/testex.js';

export default {
  name: "HotToday",
  components:{
    // ArtDetails,
    SvgIcons,
    LabelItem,
    SearchTitle,
  },
  props:{},
  data(){
    return {
      articleList:[],
      siHeight:'100px',
      top:0,
      startY:0,
      touching:false,
      pageY:0,
      // 每次刷新时刷新的数量
      tnum:10, 
      // 是否显示加载
      loadingshow:false,
      // 最近的一次加载新文章
      artflushTm:0,
      // 没有其他文章了
      noArts:false,
      iconOk:false,
    };
  },
  methods: {
    clickForArticle(artID,email){
      /** 获取文章 */
      /**打开文章界面所提供的参数 
       * articleID就可以。
      */
      // let param={"artID":artID};
      this.$router.push({path:"/ArtView",query:{'iarticleID':artID,
                                                'iemail':email}});/**router跳转带参数 */
    },
    clickForAuthor(artID){
      // 点击作者，转到对应作者简介

    },
    clickForThumbUp(artID){
      // 点击点赞，给对应文章点赞。这里涉及到一个多次点赞的问题，只有登录用户才可以点赞

    },
    // 实现下拉刷新
    // 移动端下拉刷新、上拉加载主要基于H5的三个事件完成，分别是 touchstart、touchmove、touchend。三者绑定在任意元素上。
    // touchstart：顾名思义，就是手指第一次触摸到所绑定的元素时所触发的事件。
    // touchmove：顾名思义，就是手指在绑定的元素中滑动时触发的事件。
    // touchend：顾名思义，急速手指松开时触发的事件。
    // 基于上述三者，我们就可以获取某一元素的触摸、滑动、松开的事件，但是只是获取到事件是没法让元素滑动的，那么问题来了，如何让元素滑动？
    // 让元素滑动主要是基于css3中的transform：translateY;属性，它可以让一个元素基于原始位置向X、Y轴移动一定的像素距离。例如transform：translateY(50px);
    // 这样就可以利用 touchstart、touchmove、touchend 和 transform来实现下拉刷新、上拉加载的功能了。
    // touchstart(手指按下)，touchmove（手指移动），touchend（手指离开）
    touchStart(e){
      // e代表该事件对象，e.targetTouches[0].pageY可以拿到手指按下的 y轴点
      this.startY = e.targetTouches[0].pageY
      this.pageY = e.targetTouches[0].pageY
　　　// 开启下拉刷新状态
　　　 this.touching = true
     },
    touchMove(e){ 
      //这个 touchMove，只要页面在动都会发生的，所以 touching就起作用了
　　　// 如果 touching为false，说明这个正在移动的页面不是我们想要的下拉刷新，有可能是用户随意拉了一下页面而已，或者其他
      if(!this.touching) return
      // 获取移动的距离
      let diff = e.targetTouches[0].pageY - this.pageY;
      //判断是向上拉还是向下拉
      // style.transform = `translateY(0px)`;

    },
    touchEnd(e){
      // 
      this.touching = false
      let endY = e.changedTouches[0].pageY;

     },
     onFlush(){
       let _this = this;

           _this.loadingshow = true

          let info={}
          info["url"]=_this.g.url.artList
          let mydata = {}
              mydata.option = 'newFirst';
              mydata.curPos = _this.articleList.length;
              mydata.tnum = _this.tnum;
          info["data"]=mydata
          _this.fetchNewData(info,(retdata)=>{
            // 数据处理
            /** ret.data 既是 [{文章内容},] */
           /**['artID','email','title','abstract','content','text','imgList','ctime','mtime','status'] */
            for(let i=0;i<retdata.data.length;i++){
              if(null == _this.articleList[i].content ||
               null == _this.articleList[i].imgList) {
                 i--;
                 delete _this.articleList[i]
                 continue;
              }
              retdata.data[i].imgList = JSON.parse(util.utf8_bytes_array_to_unicode16(retdata.data[i].imgList.data));
              retdata.data[i].content = util.utf8_bytes_array_to_unicode16(retdata.data[i].content.data);
              _this.articleList.push(retdata.data[i])
              _this.noArts = false
            }
            _this.loadingshow = false
          },(err)=>{
               _this.loadingshow = false            
               // 错误处理
               if(null==err){
                 _this.noArts = true
                 console.log("没有其他文章了")
               }
          })
     },
    handleSearch(inputVal) {
      // 处理搜索相关的业务流程
      console.log(inputVal);
      // 主要是更新_this.articleList
      var _this = this
      let data ={}
      data["val"] = inputVal
      axios.post(this.g.url.searchArt,data)
       .then(resObj=>{
         _this.articleList = []
        for(let i=0;i<resObj.data.data.length;i++){
            if(null == resObj.data.data[i].content || null == resObj.data.data[i].imgList) { continue;}

            resObj.data.data[i].imgList = JSON.parse(util.utf8_bytes_array_to_unicode16(resObj.data.data[i].imgList.data));
            resObj.data.data[i].content = util.utf8_bytes_array_to_unicode16(resObj.data.data[i].content.data);
            _this.articleList.push(resObj.data.data[i])
            _this.noArts = false
          }
        //  _this.articleList.concat(resObj.data);
        //  console.log(resObj)
       }).catch(err=>{
         console.log("fail,所以啥也不做",err)
       });
    },
    getStringTime(tm){
            return util.getTmStryyyymmdd(tm*1000);
    },
    hasIcon(art){
      if(art!=null &&
        art.imgList != null && art.imgList != undefined &&
        art.imgList.length>0 && art.imgList[0]!=null && art.imgList[0].length > 19
      ){
        return true;
      }else{
        return false;
      }
    },
    // 可以是通用函数
    fetchNewData(info,dataHand,errHand)
    {
          axios.post(info.url, info.data)
          .then(resObj=>{
              let ret = resObj.data;
              if(ret.st == 'ok') {
                dataHand(ret)
              }else{
                //不知道出了什么问题
                errHand(null)
              }
          }).catch(err=>{
            errHand(err)
          });
    },

  },
  computed:{
    getImgStyle(){
            /**"{'height':siHeight,'width':siHeight,'border-radius':getBorderRadus,'flex':'0 0 '+siHeight}" */
            var tstyle={};
            tstyle["height"]=this.sizeRate(this.siHeight,0.7);
            tstyle["width"]=this.sizeRate(this.siHeight,0.7);
            tstyle["min-height"]='50px';
            tstyle["min-width"]='50px';
            tstyle["margin-left"]='1px';
            tstyle["border-radius"]=this.sizeRate(this.siHeight,0.15);
            // tstyle["flex"]= '0 0 ';
            return tstyle;
    },
    getIconSize(){
      return this.sizeRate(this.siHeight,0.7);
    },
    getRightStyle(){
            /**"{'height':siHeight,'width':siHeight,'border-radius':getBorderRadus,'flex':'0 0 '+siHeight}" */
            var tstyle={};
            tstyle["height"]=this.siHeight;
            tstyle["width"]=this.siHeight;
            tstyle["margin-left"]='1px';
            tstyle["border-radius"]=this.sizeRate(this.siHeight,0.5);
            // tstyle["flex"]= '0 0 ';
            return tstyle;
    },
    getRowStyle(){
            /**"{'height':siHeight,'width':siHeight,'border-radius':getBorderRadus,'flex':'0 0 '+siHeight}" */
            var tstyle={};
            tstyle["height"]=this.siHeight;
            tstyle["width"]='100%';
            tstyle["margin-left"]='1px';

            return tstyle;
    },
  },
  mounted(){
    var _this = this;
    window.onscroll = function(){
      //变量scrollTop是滚动条滚动时，距离顶部的距离
      var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
      //变量windowHeight是可视区的高度
      var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
      //变量scrollHeight是滚动条的总高度
      var scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;
      console.log(scrollTop+windowHeight-scrollHeight)
      //滚动条到底部的条件
      if(scrollTop+windowHeight - scrollHeight > -20){
        //到了这个就可以进行业务逻辑加载后台数据了
          // _this.isBottom = true;
          console.log("到了底部");
          // 这个到了底部，很有可能会持续放置在底部，（没有其他数据了）不能频繁刷屏
          let ctm = util.getTmSeconds()
          if(ctm - _this.artflushTm < 3 || _this.noArts){
            return
          }

           _this.loadingshow = true

          let info={}
          info["url"]=_this.g.url.artList
          let mydata = {}
              mydata.option = 'newFirst';
              mydata.curPos = _this.articleList.length;
              mydata.tnum = _this.tnum;
          info["data"]=mydata
          _this.fetchNewData(info,(retdata)=>{
            // 数据处理
            /** ret.data 既是 [{文章内容},] */
           /**['artID','email','title','abstract','content','text','imgList','ctime','mtime','status'] */
            for(let i=0;i<retdata.data.length;i++){
              if(null == _this.articleList[i].content ||
               null == _this.articleList[i].imgList) {
                 i--;
                 delete _this.articleList[i]
                 continue;
              }
              retdata.data[i].imgList = JSON.parse(util.utf8_bytes_array_to_unicode16(retdata.data[i].imgList.data));
              retdata.data[i].content = util.utf8_bytes_array_to_unicode16(retdata.data[i].content.data);
              _this.articleList.push(retdata.data[i])
              _this.noArts = false
            }
            _this.loadingshow = false

          },(err)=>{
               _this.loadingshow = false            
               // 错误处理
               if(null==err){
                 _this.noArts = true
                 console.log("没有其他文章了")
               }
          })
        }else{
          _this.loadingshow = false
          // _this.isBottom = false;
          // 没有到底，什么也不做
        } 
    }
    /**获取文章列表 --加上数量，并记录  */
    let data = {};
    data.option = 'newFirst';
    data.option = this.g.uiInfo.searchOp;

    data.curPos = _this.articleList.length;
    data.tnum = _this.tnum;
    // try{
    //   data.email = this.g.uiInfo.loginData.email;
    //   data.token = this.g.uiInfo.loginData.token;
    // }catch{err=>console.log("not Login")}

    axios.post(this.g.url.artList, data)
    .then(resObj=>{
         let ret = resObj.data;
         if(ret.st == 'ok') {
           _this.isChanged = false;
           /** ret.data 既是 [{文章内容},] */
           /**['artID','email','title','abstract','content','text','imgList','ctime','mtime','status'] */
           _this.articleList = ret.data;
           for(let i=0;i<_this.articleList.length;i++){
             if(null == _this.articleList[i].content ||
               null == _this.articleList[i].imgList) {
                 i--;
                 delete _this.articleList[i]
                 continue;
               }

            _this.articleList[i].imgList = JSON.parse(util.utf8_bytes_array_to_unicode16(_this.articleList[i].imgList.data));

            _this.articleList[i].content = util.utf8_bytes_array_to_unicode16(_this.articleList[i].content.data);
           }
         }else{
           //不知道出了什么问题
         }
    }).catch(err=>{
      console.log("fail",err);
    });
    /** 更新文章列表  */
  }
};
</script>

<style scoped>
.LabelItem{
  margin-left:2px;
}
.wzCard{
  /* border:1px solid red; */
  box-shadow: 0 0 0 0 3.3px greenyellow;
}
</style>