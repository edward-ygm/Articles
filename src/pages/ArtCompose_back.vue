<template>
  <div id="articleCompose" class="ArtCompose" >
    <div class="sticky-top navbar-light bg-light"  style="height:38px;width:100%" >
      <div class="lc-box">
        <div class="lc-left" @click="moveBack" :style="{'width':'36px','height':'36px'}">
              <SvgIcons iconID="direction" iconSize="32px"></SvgIcons>
        </div>
        <div class="lc-right"><span>创建文章</span></div>
      </div>
    </div>  
    
    <!-- wangEditor 的配置-->
    <!-- <div id="WE-toolbar" class="toolbar"  style="height:100px;z-index:1;overflow:scroll" ></div>
    <div id="WE-text" class="text" :style="getTextStyle" @blur="saveDraft(false) "></div> -->
    <div style="border: 1px solid #ccc;">
            <Toolbar
                style="border-bottom: 1px solid #ccc"
                :editor="editor"
                :defaultConfig="toolbarConfig"
                :mode="mode"
            />
            <Editor
                style="height: 500px; overflow-y: hidden;"
                v-model="html"
                :defaultConfig="editorConfig"
                :mode="mode"
                @onCreated="onCreated"
                @onBlur="onBlur"
            />
    </div>


       <!--  其他配置 -->
    <div class="btn-group">
        <button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          文章ID号：{{articleID}}
        </button>
        <div class="dropdown-menu">
          <div class="dropdown-item " @click="changeArtID()">新文章ID</div>
          <div class="dropdown-divider " ></div>
          <div class="dropdown-item d-flex flex-row justify-content-between mb-3"
               v-for="ak in articleIDList" :key="ak" >
               <span  @click="changeArtID(ak[0])">{{ak[0]}}</span> <i class="fa fa-close text-right" @click="removeID(ak[0])"></i>
          </div>
        </div>
    </div>
    <div class="d-flex flex-column">
      <!-- <label>展示时可选图片: </label>
      <div :style="{height:'64px'}"> </div>-->
      <button class="btn btn-primary mt-1" @click="saveDraft(false)"> 保存草稿</button>
      <button class="btn btn-primary mt-1" @click="saveDraft(true)"> 发布</button>
      <button class="btn btn-primary mt-1" v-show="false"> 发布</button>
      <button class="btn btn-primary mt-1" v-show="false"> 发布</button>
    </div>
  </div>
</template>

<script>
/**文章编辑界面，里面采用了富媒体 */
// 界面要求：WE-toolbar 为top不变动
//          WE-text 动。 btn-group和保存草稿在一行，草稿，发布，及底部浏览在最下面不能动。
// import FileLoad from "../components/FileLoad.vue";
// import QuillVue from "../components/QuillVue.vue";
// import picUpload from "../components/basic/picUpload.vue";
import axios from "axios";
// import '@wangeditor/editor/dist/css/style.css'
import { createEditor, createToolbar, IEditorConfig, IDomEditor } from '@wangeditor/editor'
import SvgIcons from "../components/svg/SvgIcons.vue";
var util = require('../assets/js/adiutil.js');
export default {
  name: "artcompose"
  ,props:{
    /** 打开已有的文档，输入articleID,及article。传入参数 */
    iarticleID:{type:String,default:"",},/**如果不输入参数，则认为是新文章 */
    iarticle:{type:String},/**输入的文章内容 */
  }
  ,components:{
    SvgIcons,
    // QuillVue,
    // picUpload,
    // FileLoad,
  },
  data(){
    return{
      articleID:'',/**如果是新建，则新生成 */
      articleIDList:[],/**初始化时从本地读出 */
      isChanged:false, /**防止用户再没有改动文章的情况下反复上传，浪费带宽 */
      editor:null,/**wangEditor */
      html:'<p>hello</p>',
      toolbarConfig:{},
      editorConfig:{placeholder:"please input"},
      mode:'default',
      changeTm:-1,
      checkList:[],/** 标题图片选择框 */
      radio:'0',
      content:"",
    }
  },
  methods: {
    onCreated(editor) {
        this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    moveBack(event,data){
      // 先保存
      this.saveDraft(false);
       this.$router.go(-1);
      },
    /**html发生了变化 */
    onhtmlChanged(newHtml,a,b,c)
    {
      /**不管发生了什么变化，判断上一次处理了的时间，如果超过了10秒，才进行处理 */
      this.isChanged = true;
      if(this.changeTm==-1){
        this.changeTm = util.getTmSeconds();
        return;
      }
      if(util.getTmSeconds()-this.changeTm > 1){//每隔1秒保存一次草稿
        /** 将html原封不动地保存到本地 （包括图像） */
        /**更新本地的ArticleID 表*/
        this.articleIDList = this.addDraftIDtoLocal(this.articleID);

        util.setLocal("artIDList-"+this.articleID,this.editor.$textElem.elems[0].innerHTML)
        this.changeTm = util.getTmSeconds();
      }
      // console.log(newHtml,a);
    },
    /**部分区域被选择,这个可以用来为选择了的文本做额外的设置。还是算了吧 */
    onSelectionChange(newSelect){
      /**{text:'当前文本',html:'选中的html',selection:原生select对象} */
      /**这个选择是动态的，每次都记录下时间， */
      console.log(newSelect)
    },
    /**给文章内IMG编号，并提取出第1张或多张img，return [] */
    findImg(artContent){
      var x = artContent;
      let domObj;
      if(x==null||x==""){
        domObj = this.editor.$textElem.elems[0];
      }else{
        domObj = new DOMParser().parseFromString(x,"text/html");
      }
      if(domObj.getElementsByTagName('img').length>0)
        return [domObj.getElementsByTagName('img')[0].getAttribute("src")];
      else return [];
    },
    /**获取本地草稿列表，并插入当前文章id。详细请看设计文档 */
    addDraftIDtoLocal(artID,maxCount){
      if(!maxCount)maxCount=5;
      let al = [];
      if(null !=util.getLocal("artIDList")){
        al = JSON.parse(util.getLocal("artIDList"));
      }
      let flag = false;
      for(let i=0;i<al.length;i++)
      {
        if(al[i][0]==artID){
          al[i][1]=util.getTmSeconds();
          flag=true;
        }
      }
      if(flag==false)al.push([artID,util.getTmSeconds()])
      al.sort(function(a,b){return b[1]-a[1];});
      while(al.length>=maxCount)al.pop();
      /**写入 */
      util.setLocal("artIDList",JSON.stringify(al));
      return al;
    },
    /**获取articleID列表，从最新被更改的开始 */
    getDraftID(){
      let al = [];
      if(null !=util.getLocal("artIDList")){
        al = JSON.parse(util.getLocal("artIDList"));
      }
      return al;
    },
    /** 为文章的每个元素添加ID,或class的名字，以实现特殊的样式
     * this.editor.$textElem.elems[0] */
    addID(editorElement){
      let ret = 11;
      let maxId=-1;
      var tE = editorElement;
      if(tE==null){
        tE = this.editor.$textElem.elems[0];
      }
      let e = tE.firstElementChild;
      this.editor.$textElem.elems[0].firstElementChild.getAttribute('id');
      /**找到最大的ID */
      while(e!=null){
        let idVal = e.getAttribute('id');
        if(null != idVal && parseInt(idVal)>maxId)
        {
          maxId = idVal;
        }
      }
      /** 为所有的元素编排id */
      while(e!=null)
      {
        let idVal = e.getAttribute('id');
        if(null == idVal){
           if(parseInt(idVal)>maxId){
             maxId = idVal;
           }
           maxId = maxId+1;
           e.setAttribute(maxId);
        }
      }
      return;
    },

    /** 手动触发保存为草稿的按钮.isPublish=true则发布 
     * 上传了就不需要再在本地保存了
    */
    saveDraft(isPublish){
      /**保存到本地，并上传到服务器 */
      if(this.isChanged == false)return;
        /**保存到本地 */
        //util.setLocal(this.articleID,this.editor.$textElem.elems[0].innerHTML);
        /**上传到服务器 (上传到哪里呢？数据库)*/
        let data = {};
        data.artID = this.articleID;
        data.email = this.g.uiInfo.loginData.email;/**对端没有 */
        data.nickName = this.g.uiInfo.loginData.nickName;
        data.token = this.g.uiInfo.token;/**对端没有 */

        /**第一行为title，第二行为摘要 */
        data.title = this.editor.$textElem.elems[0].firstElementChild ==null ? "":this.editor.$textElem.elems[0].firstElementChild.innerHTML;

        data.abstract = this.editor.$textElem.elems[0].firstElementChild.nextSibling == null ? "":this.editor.$textElem.elems[0].firstElementChild.nextSibling.innerHTML;

        data.content = this.editor.$textElem.elems[0].innerHTML;
        data.text = this.editor.txt.text();
        data.mtime = util.getTmSeconds();
        /**展示文章时，需要展示图片，这些图片就存在这个imgList里面（就是文章img的一部分-单张图）[img,img] */
        data.imgList=JSON.stringify(this.findImg(data.content));
        data.status = 'no';
        if(isPublish){
          data.status = 'yes';
        }

        /**上传 */
        axios.post(this.g.url.artLoad, data)
           .then(resObj=>{
                let ret = resObj.data;
                if(ret.st == 'ok') this.isChanged = false;
                else{
                  alert("保存异常");
                }
           }).catch(err=>{
             console.log("fail",err);
           });
      
      this.changeTm = util.getTmSeconds();

      /** 草稿保存在只能由自己打开的私人目录，上传到草稿接口 */
      //获取content，并取出文本
      //上传到服务器
    }
    ,publishHtml(){
      /** publish只是一个形式，和保存为draft只是一个状态位的变化 */
      console.log("按钮");
      /** 已经公布的区域是否可以允许外界自由访问？将其上传到公布的接口 */
      // var data = this.$refs.draft-article.content;
      // axios.post(loadUrl,data)
      //   .then(res => { //正确发送
      //     console.log(res);
      //   })
      //   .catch(err => { //已经出现
      //     console.log(err);
      //   });
    },
    getEditorData() {
        // 通过代码获取编辑器内容
        let data = this.editor.txt.html()
        alert(data)
      },
    beforeDestroy() {
      // 调用销毁 API 对当前编辑器实例进行销毁
      this.editor.destroy()
      this.editor = null
    },
    newArtId(){
    },
    changeArtID(artID){
      if(artID==undefined || artID==null){
        /**new -- 应写成函数 */
        let data={'email':this.g.uiInfo.loginData.email};
        data.token = this.g.uiInfo.token;
        var _this = this;
        axios.post(this.g.url.newArtId,data).then(res=>{
          /** 保存ArticleID */
          _this.articleID = res.data.artId;
          _this.editor.txt.html = ""; //清空
          /**更新本地的ArticleID 表*/
          _this.addDraftIDtoLocal(_this.articleID);
          util.setLocal("artIDList-"+_this.articleID,_this.editor.$textElem.elems[0].innerHTML)
        }).catch(err=>{
          /**不应该出现error呀，就啥也不做吧。等待上传后再进行分配 */
        });
      }else{
        /** 切换artID */
        this.articleID = artID;
        this.editor.$textElem.elems[0].innerHTML  = util.getLocal("artIDList-"+this.articleID);
      }
    },
    /**不允许删除当前的ID */
    removeID(artID){
      /**remove current ID */
      let al = [];
      if(artID==undefined || artID==null){
        /** remove all */
        
        if(null !=util.getLocal("artIDList")){
          al = JSON.parse(util.getLocal("artIDList"));
        }
        while(al.length>0){
          let aid = al.pop();
          util.removeLocal("artIDList-"+aid[0]);
        }
        util.setLocal("artIDList",JSON.stringify([]));//清空列表
        this.articleIDList=[];
        this.articleID='';
      }else{
        /**删除 */
        if(this.articleID==artID)return;//不允许删除当前的ID
        if(null !=util.getLocal("artIDList")){
          al = JSON.parse(util.getLocal("artIDList"));
        }
        for(let i=0;i<al.length;i++){
          if(al[i][0]==artID){
            al.splice(i,1);
            break;
          }
        }
        this.articleIDList=al;
        util.setLocal("artIDList",JSON.stringify(al));
        util.removeLocal("artIDList-"+artID);
      }
      return al;
    },
    beforeWinClose(e)
    {
      console.log("hello")
    }
  },
  computed: {
    getTextStyle(){
      let s={}
      let windowHeight = document.documentElement.clientHeight;
      let mid = windowHeight - 4*38 - 100;

      s['height'] = mid+"px";
      s["border-color"] = 'gray';
      return s
    },
  },
  mounted(){

    // 首先需要登录
    if(this.g.uiInfo.loginData.status == "" ||
    this.g.uiInfo.loginData.status == "no" ||
    this.g.uiInfo.loginData.email == ""){
      this.$router.push("/login")
      return
    }
    // 添加关闭前的处理
    // 判断输入的ID
    this.articleID = this.$route.query.iarticleID
    this.content = this.$route.query.iarticle

    /**配置wangEditor。
     * 富媒体编辑器一般是<p><p>这么一直连接下去，不会出现嵌套情况
     */
    this.html = `</p>hellows  </p>`
    //old version
    // const E = window.wangEditor;
    // this.editor = new E(`#WE-toolbar`,"#WE-text");
    // 设置编辑区域高度为 500px
    // editor.config.height = '500px';
    // this.editor.config.height = '100%';
    // this.editor.config.placeholder = '首行为标题，次行为摘要，之后为文章主体';
    // this.editor.config.menus = [
    // 'head','bold', 'fontSize','fontName','italic','underline','strikeThrough',
    // 'indent','lineHeight','foreColor','backColor','link','list','todo','justify',
    // 'quote','emoticon','image','table','code','splitLine','undo','redo',
    // ];
    // 配置颜色（文字颜色、背景色）
    // editor.config.colors = [
    //     '#000000',
    //     '#eeece0',
    //     '#1c487f',
    //     '#4d80bf'
    // ];
    // this.editor.config.menuTooltipPosition = 'down';
    // 配置 onchange 回调函数，将数据同步到 vue 中
    // this.editor.config.onchange = this.onhtmlChanged;
    // this.editor.config.onSelectionChange = this.onSelectionChange;

    // 配置触发 onchange 的时间频率，默认为 200ms
    // 每次触发onchange 就将数据保存到当前的客户端。按照每10秒保存一次来实现。（异步保存）
    // this.editor.config.onchangeTimeout = 10000; // 修改为 500ms （不生效，自己实现）
    //采用base64保存图片
    // this.editor.config.uploadImgShowBase64 = true;//采用base64保存
    //隐藏上传网络图片（没有必要）
    // this.editor.config.showLinkImg = false

    //用户选区操作（鼠标选中文字，ctrl+a 全选等）会自动触发onSelectionChange 函数执行
    //其中回调参数有 3 个是text,html,selection,分别为当前选择文本,当前选中的html,原生selection对象

    // this.editor.config.uploadImgServer = this.g.url.artUpload //'/upload'; //上传的接口
    // this.editor.config.uploadFileName = "fname";
    // this.editor.config.uploadImgHeaders = {
    //   "Access-Control-Allow-Origin":"origin"
    // }
    // this.editor.config.uploadImgHooks = {
    //   before: function (xhr,editor,files){
    //     console.log("before")
    //   },
    //   success: function(xhr,editor,result){
    //     console.log("success")
    //   },
    //   fail: function(xhr,editor,result){
    //     console.log("failed")},
    //   timeout: function(xhr,editor,result){
    //     console.log("timeout")},
    //   error: function(xhr,editor,result){
    //     console.log("error")},
    // }

    // 创建编辑器
    // this.editor.create()
    
    /**如果 存在 this.iarticleID，那么就是编辑已有的文章，否则是新建 */
    /**查询本地是否有未发布的草稿，选择最近的一篇展示 */
    let tlist = this.getDraftID();
    this.articleIDList = tlist;
    if(this.articleID==undefined || this.articleID==""){
      // 本地没有合适的草稿
      // 申请newID
        let data={'email':this.g.uiInfo.loginData.email};
        data.token = this.g.uiInfo.token;
        var _this = this;
        axios.post(this.g.url.newArtId,data).then(res=>{
          /** 保存ArticleID */
          _this.articleID = res.data.artId;
          _this.editor.txt.html = ""; //清空
          /**更新本地的ArticleID 表*/
          _this.addDraftIDtoLocal(_this.articleID);
          util.setLocal("artIDList-"+_this.articleID,_this.editor.$textElem.elems[0].innerHTML)
          // this.content ='';
          // this.editor.txt.html(this.content);
        }).catch(err=>{
          /**不应该出现error呀，就啥也不做吧。等待上传后再进行分配 */
        });
      
    }
    // this.editor.txt.html(this.content);
    /**如果没有，则新建一个，或选择复制并新建一个（新建时不清空内容） */
  },
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  }
};
</script>

<style  src="@wangeditor/editor/dist/css/style.css" scoped>
.ArtCompose{
  /* relative是为了能用top的绝对定位 */
  position:relative;
  height:100%;
  width:100%;
  min-height: 100px;
}

img{
/**居中 */
text-align: center
}


.toolbar {
    border:1px solid #ccc;
    margin-top:3px;
}
.text {
    border:1px solid #ccc;
    min-height: 150px;
}

.ql-editor{
  display:block;
  width:100%;
  height:500px;
}

.adi-box{
  height:37px;
}
.adi-mid{
  flex:1 0 auto;
}
.img-circle{
  border-radius: 50%;
  border:5px rgba(112,112,112,50%) solid;
}

.dropdown{
  margin-left:300px;
  z-index: 10100;
}
.dropdown-menu{
z-index: 10100;
}

#chart {
        width: 300px;
        height: 300px;
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
    width:38px;/** */
    margin-left: 15px;
    margin-right: 3px;
    order:1;
}
.lc-right{
    flex-grow:1 1 auto;
    margin-right: 20px;
    height:100%;
    order:3;
}

</style>