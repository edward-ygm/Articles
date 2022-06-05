<template>
  <div class="ArtCompose">
    <div class="sticky-top navbar-light bg-light  d-flex flex-row "  style="height:38px;width:100%" >
      <div  class="" @click="moveBack">
      <SvgIcons iconID="direction" iconSize="35px"></SvgIcons></div>
      <button v-if="isAllowEdit" class="btn btn-default"> 编辑文章 </button>
    </div> 

    <Toolbar
        class="fline"
        style="border-bottom: 1px solid #aaa;height:120px;width:100%"
        :editor="editor"
        :defaultConfig="toolbarConfig"
        :mode="mode"
    />
    <Editor
        class="fline"
        style="height: 500px; overflow-y: hidden; height:370px;width:100%"
        v-model="content"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="onCreated"
        @onChange="onChange"
        @onBlur="onBlur"
    />

    <!-- 底部创建新ID按钮（草稿） -->
    <div  v-if="isAllowEdit" class="d-flex flex-row">
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
      <div v-if="saveStatus">{{statusInfo}}</div>
    </div>
    <div class="d-flex flex-column">
      <!-- <label>展示时可选图片: </label>
      <div :style="{height:'64px'}"> </div>-->
      <button  v-if="isAllowEdit"  class="btn btn-primary mt-1" @click="saveDraft(false)"> 保存草稿</button>
      <button  v-if="isAllowEdit"  class="btn btn-primary mt-1" @click="saveDraft(true)"> 发布</button>
      <div style="height:25px">到达了底部</div>
    </div>

  </div>

</template>

<script>
import Vue from 'vue'
import SvgIcons from "../components/svg/SvgIcons.vue"
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import Button from '../components/element/button.vue'

import axios from "axios";
var util = require('../assets/js/adiutil.js');

export default Vue.extend({
    components: { Editor, Toolbar ,SvgIcons},
    data() {
        return {
            editor: null,
            content: '<p>hello</p>',
            toolbarConfig: { },
            editorConfig: { placeholder: '请输入内容...' },
            mode: 'default', // or 'simple'
            isAllowEdit: true, //控制是编辑状态还是非编辑状态
            articleID:'',
            articleIDList:[],/**初始化时从本地读出 */      isChanged:false, /**防止用户再没有改动文章的情*/
            changeTm:-1,      
            checkList:[],/** 标题图片选择框 */
            radio:'0',
            saveStatus:false,//判断是否有消息
            statusInfo:'',
        }
    },
    methods: {
      onCreated(editor) {
            this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
            this.editor.getMenuConfig('uploadImage').server = this.g.url.artPicLoad
            // this.editor.getMenuConfig('uploadImage').base64LimitSize =  5 * 1024 * 1024 //5M
            this.editor.getMenuConfig('uploadImage').base64LimitSize =  5 * 1024 //小于5k

            // 自定义增加 http  header。带上token 和 email
            this.editor.getMenuConfig('uploadImage').headers =  {token:this.g.uiInfo.token,email:this.g.uiInfo.loginData.email}
            // this.editor.getMenuConfig('insertImage') ={
            //   onInsertedImage: function onInsertedImage(imageNode) {
            //       if (imageNode == null) return
            //       const { src, alt, url, href } = imageNode
            //       console.log('inserted image', src, alt, url, href)
            //   },
            //   checkImage: null, // 也支持 async 函数
            //   parseImageSrc: null, // 也支持 async 函数
            // }
            if(this.g.uiInfo.loginData.status == "yes" && 
              (this.$route.query.iemail ==undefined ||
              (this.g.uiInfo.loginData.email == this.$route.query.iemail)            
              ))
            {
              this.isAllowEdit = true
              if(this.editor.isDisabled()) this.editor.enable();

            }
            else{
              this.isAllowEdit = false
              if(!this.editor.isDisabled())this.editor.disable();/**禁止编辑 */
            }
        },
      moveBack(event,data){
        // 先保存
        this.saveDraft(false);
        this.$router.go(-1);
      },
      onChange(editor){
        /**不管发生了什么变化，判断上一次处理了的时间，如果超过了10秒，才进行处理 */
        this.isChanged = true
        this.saveStatus = false
        this.statusInfo = "有新输入"
        if(this.changeTm==-1){
          this.changeTm = util.getTmSeconds();
          return;
        }
        if(util.getTmSeconds()-this.changeTm > 5){//每隔5秒保存一次草稿
          /** 将html原封不动地保存到本地 （包括图像） */
          /**更新本地的ArticleID 表*/
          this.articleIDList = this.addDraftIDtoLocal(this.articleID);

          util.setLocal("artIDList-"+this.articleID,this.editor.getHtml())
          this.changeTm = util.getTmSeconds();
        }
        // console.log(newHtml,a);
      },
      onBlur(editor){
        this.saveDraft(false)
      },
      /**给文章内IMG编号，并提取出第1张或多张img，return [] */
      findImg(editor){
        if(editor.getElemsByType('image').length>0)
           return [editor.getElemsByType('image')[0].src]
        else
           return [];

        // 下面是将Html转成dom来实现查找img，这个可以作为以后的参考
        // var x = artContent;
        // let domObj;
        // if(x==null||x==""){
        //   domObj = this.editor.getHtml();
        // }else{
        //   domObj = new DOMParser().parseFromString(x,"text/html");
        // }
        // // 转换未domObj结构，才好使用document的函数
        // if(domObj.getElementsByTagName('img').length>0)
        //   return [domObj.getElementsByTagName('img')[0].getAttribute("src")];
        // else return [];
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
      insertText() {
        const editor = this.editor // 获取 editor 实例
        if (editor == null) return

        // 调用 editor 属性和 API
        editor.insertText('一段文字')
        console.log(editor.children)
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
          /**保存到本地 */
          if(!isPublish){//只要愿意就可以保存
            util.setLocal(this.articleID,this.editor.getHtml());
            this.saveStatus = true
            this.statusInfo = "草稿保存成功"
          } else{
            /**保存到本地，并上传到服务器 */
            if(this.isChanged == false)return; //如果没有变化，不需要保存

            let data = {};
            data.artID = this.articleID;
            data.email = this.g.uiInfo.loginData.email;
            data.nickName = this.g.uiInfo.loginData.nickName;
            data.token = this.g.uiInfo.token;

            /**第一行为title，第二行为摘要 */
            data.title = "无标题"
            data.abstract = "无摘要"
            if(this.editor.children.length >= 1 && this.editor.children[0].type == "paragraph"){
              data.title = this.editor.children[0].children[0].text;
            }
            if(this.editor.children.length >= 2  && this.editor.children[1].type == "paragraph"){
              data.abstract = this.editor.children[1].children[0].text;
            }

            data.content = this.editor.getHtml();
            data.text = this.editor.getText();
            data.mtime = util.getTmSeconds();
            /**展示文章时，需要展示图片，这些图片就存在这个imgList里面（就是文章img的一部分-单张图）[img,img] */
            data.imgList=JSON.stringify(this.findImg(this.editor));
            // data.imgList=[];
            data.status = 'no';
            if(isPublish){
              data.status = 'yes';
            }

            /**上传 */
            axios.post(this.g.url.artLoad, data)
              .then(resObj=>{
                    let ret = resObj.data;
                    if(ret.st == 'ok') {
                      this.isChanged = false;
                      this.saveStatus = true
                      this.statusInfo = "草稿保存成功"
                    }
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
      },
      getEditorData() {
          // 通过代码获取编辑器内容
          let data = this.editor.getHtml()
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
            _this.editor.setHtml(""); //清空
            /**更新本地的ArticleID 表*/
            _this.addDraftIDtoLocal(_this.articleID);
            util.setLocal("artIDList-"+_this.articleID,_this.editor.getHtml())
          }).catch(err=>{
            /**不应该出现error呀，就啥也不做吧。等待上传后再进行分配 */
          });
        }else{
          /** 切换artID */
          this.articleID = artID;
          this.editor.setHtml( util.getLocal("artIDList-"+this.articleID) )
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
    mounted() {
        // 模拟 ajax 请求，异步渲染编辑器
        // setTimeout(() => {
        //     this.html = '<p>模拟 Ajax 异步设置内容 HTML</p>'
        // }, 1500)
      // 判断是否有输入（有输入的是来自点击文章，没有的是增加文章）
      
      // 配置wangEditor
      // this.editorConfig = { MENU_CONF: {} } // 初始化 MENU_CONF 属性
      // this.editorConfig.MENU_CONF['uploadImage']={
      //   server:this.g.url.artPicLoad,
      //   // 小于该值就插入 base64 格式（而不上传），默认为 0
      //   base64LimitSize: 5 * 1024 * 1024 // 5Mb
      // }
      // 添加关闭前的处理
      // 判断输入的ID
      /**如果 存在 this.iarticleID，那么就是编辑已有的文章，否则是新建 */
      /**查询本地是否有未发布的草稿，选择最近的一篇展示 */
      var _this = this;
      let tlist = this.getDraftID();
      this.articleIDList = tlist;
      if(this.$route.query.iarticleID==undefined || this.$route.query.iarticleID==""){
        // 本地没有合适的草稿
        // 申请newID
          let data={'email':this.g.uiInfo.loginData.email};
          data.token = this.g.uiInfo.token;
          
          axios.post(this.g.url.newArtId,data).then(res=>{
            /** 保存ArticleID */
            _this.articleID = res.data.artId;
            _this.editor.setHtml("<p>:-)</p>"); //清空
            /**更新本地的ArticleID 表*/
            _this.addDraftIDtoLocal(_this.articleID);
            util.setLocal("artIDList-"+_this.articleID,_this.editor.getHtml())
            // this.content ='';
            // this.editor.txt.html(this.content);
          }).catch(err=>{
            /**不应该出现error呀，就啥也不做吧。等待上传后再进行分配 */
          });
      }else{
        // 来自已有的文章，iarticleID不等于空
        /**通过 this.iarticleID，获取文章内容 */
        this.articleID = this.$route.query.iarticleID
        let data = {"artID":this.articleID};
        // 发送消息以获取文章
        axios.post(this.g.url.article,data).then(res=>{
          /** 保存ArticleID */
          if(res.data.st=='ok'){
            _this.articleID = res.data.artID;
            // 将消息转换为html
            _this.content = util.utf8_bytes_array_to_unicode16(res.data.data.content.data)
            _this.editor.setHtml(_this.content);
          }else{
            alert("获取文件失败");
          }
          /**更新本地的ArticleID 表*/
        }).catch(err=>{
          /**不应该出现error呀，就啥也不做吧。等待上传后再进行分配 */
        })
      /**如果没有，则新建一个，或选择复制并新建一个（新建时不清空内容） */
        }
    },
    beforeDestroy() {
        const editor = this.editor
        if (editor == null) return
        editor.destroy() // 组件销毁时，及时销毁编辑器
    }
})
</script>
<style src="@wangeditor/editor/dist/css/style.css">
.fline{
  box-shadow: 0 0 0 0 0.33px gray;
}
</style>