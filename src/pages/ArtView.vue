<template>
  <div id="articleReader" class="ArtCompose" >
    <nav class="sticky-top navbar-light bg-light"  style="height:38px" >
      <!-- <nav class="nav nav-pills nav-justified"> -->
      <div class="flex-row">
        <button class="btn btn-light" @click="goback"> back</button>
        <button v-if="isAllowEdit" class="btn btn-primary" @click="allowEdit"> 编辑</button>
      </div>
      <!-- <SearchTitle siHeight="37px" @handleSearch="handleSearch"></SearchTitle> -->
      <!-- </nav> -->
    </nav>
    <!-- wangEditor 的配置-->
    <div id="WE-toolbar" class="toolbar" ></div>
    <div id="WE-text" class="text" style="height:100%;border-color:gray"></div>
  </div>
</template>

<script>
/**单篇文章展示视图 */
// import FileLoad from "../components/FileLoad.vue";
// import QuillVue from "../components/QuillVue.vue";
// import picUpload from "../components/basic/picUpload.vue";
import axios from "axios";
var util = require('../assets/js/adiutil.js');
import SearchTitle from "../components/SearchTitle.vue";
export default {
  name: "HotToday"
  ,props:{
    /** 打开已有的文档，输入articleID,及article。传入参数 */
    iarticleID:{type:String,default:"",},/**如果不输入参数，则认为是新文章 */
  }
  ,components:{
    // SearchTitle,
    // picUpload,
    // FileLoad,
  },
  data(){
    return{
      articleID:'',/**如果是新建，则新生成 */
      articleIDList:[],/**初始化时从本地读出 */
      iemail:'',
      isAllowEdit:false,
      isChanged:false, /**防止用户再没有改动文章的情况下反复上传，浪费带宽 */
      editor:null,/**wangEditor */
      changeTm:-1,
      checkList:[],/** 标题图片选择框 */
      radio:'0',
      content:"<p>hi</p>",
    }
  },
  methods: { 
    handleSearch(data){
          console.log(data);
    },
    goback(){
      this.$router.go(-1);
    },
    allowEdit(){
      if(this.g.uiInfo.loginData.status == "yes" &&
         this.g.uiInfo.loginData.email == this.iemail
      ){
        // 跳转到可编辑界面
        this.$router.push({path:"/AddNewArt",query:{
          "iarticleID":this.articleID,"iarticle":this.content,}})
      }
    }
   },
  computed: {  },
  mounted(){
    /**配置wangEditor。
     * 富媒体编辑器一般是<p><p>这么一直连接下去，不会出现嵌套情况
     */
    this.articleID = this.$route.query.iarticleID;
    const E = window.wangEditor;
    const editor = new E(`#WE-toolbar`,"#WE-text");
    // 设置编辑区域高度为 500px
    editor.config.height = '100%';
    editor.config.menus = [];
    editor.config.menuTooltipPosition = 'down';

    // 配置触发 onchange 的时间频率，默认为 200ms
    // 每次触发onchange 就将数据保存到当前的客户端。按照每10秒保存一次来实现。（异步保存）
    editor.config.onchangeTimeout = 10000; // 修改为 500ms （不生效，自己实现）
    //采用base64保存图片
    editor.config.uploadImgShowBase64 = true;
    //隐藏上传网络图片（没有必要）
    editor.config.showLinkImg = false

    //用户选区操作（鼠标选中文字，ctrl+a 全选等）会自动触发onSelectionChange 函数执行
    //其中回调参数有 3 个是text,html,selection,分别为当前选择文本,当前选中的html,原生selection对象

    // 创建编辑器
    editor.create();
    this.editor = editor

    this.articleID = this.$route.query.iarticleID;
    this.iemail = this.$route.query.iemail;
    if(this.g.uiInfo.loginData.status == "yes" &&
         this.g.uiInfo.loginData.email == this.iemail
      ){
        this.isAllowEdit = true
      }
      else{
        this.editor.disable();/**禁止编辑 */
      }

    // -----------------------------------
    
    /**通过 this.iarticleID，获取文章内容 */
    if(this.articleID !=""){
      let data = {"artID":this.articleID};
      var _this = this;
      // 发送消息以获取文章
      axios.post(this.g.url.article,data).then(res=>{
        /** 保存ArticleID */
        if(res.data.st=='ok'){
          _this.articleID = res.data.artID;
          // 将消息转换为html
          _this.content = util.utf8_bytes_array_to_unicode16(res.data.data.content.data)
          _this.editor.txt.html(_this.content);
        }else{
          alert("获取文件失败");
        }
        /**更新本地的ArticleID 表*/
      }).catch(err=>{
        /**不应该出现error呀，就啥也不做吧。等待上传后再进行分配 */
      })
    /**如果没有，则新建一个，或选择复制并新建一个（新建时不清空内容） */
    }
  }
};
</script>

<style scoped>
.ArtCompose{
  /* relative是为了能用top的绝对定位 */
  position:relative;
  height:100%;
  width:100%;
  min-height: 100px;
}

</style>