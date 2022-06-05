<template>

  <div class="QuillVue" >
    <!-- 标题+quil+底部图片选项（用于展示）quill-editor = quillEditor 
    content和内容双向绑定。 blur是指失去焦点的时候
    this.$refs.myQuillEditor.quill.history 获取历史记录-->
    <quill-editor  :style="getEditorStyle"
        v-model="content" 
        ref="myQuillEditor" 
        v-quill:myQuillEditor="editorOption" 
        @change="onEditorChange($event)"
        @focus="onEditorFocus($event)"
        @blur="onEditorBlur($event)"
        @text-change="onTextChange($event)"
      ></quill-editor>

    <div class="adi-box-relative"> 
    </div>
  </div>
</template>

<script>
/**文章编辑界面 */

// import TopFunc from "../components/TopFunc.vue";
  import { quillEditor } from 'vue-quill-editor' //调用编辑器
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'

export default {
  name: "HotToday",
  components:{
    quillEditor,
    // TopFunc,
  },
  data(){
    return{
      content:"<H1>输入标题</H1>",
      editorOption:{
        placeholder: "请在这里输入",
        modules:{
          imageDrop:true,
          imageResize: {},
          toolbar:[
                  ['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
                  ['blockquote', 'code-block'],     //引用，代码块
                  [{ 'header': 1 }, { 'header': 2 }],        // 标题，键值对的形式；1、2表示字体大小
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],     //列表
                  [{ 'script': 'sub'}, { 'script': 'super' }],   // 上下标
                  [{ 'indent': '-1'}, { 'indent': '+1' }],     // 缩进
                  [{ 'direction': 'rtl' }],             // 文本方向
                  [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
                  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],     //几级标题
                  [{ 'color': [] }, { 'background': [] }],     // 字体颜色，字体背景颜色
                  [{ 'font': [] }],     //字体
                  [{ 'align': [] }],    //对齐方式
                  ['clean'],    //清除字体样式
                  ['image','video']    //上传图片、上传视频
                ]
        }
      },
    }
  },
  props:{
    // 屏幕设置最小高度
    iEditorSize:{type:String,default:"100%", },
    /** 传入参数 articleID, */
    articleID:{type:String,default:"new", },
    userEmail:{type:String,default:"new", }, /**用户，确定登录的状态 */
  },
  methods: {
    onEditorReady(quill,a,b,c) {
      console.log(quill.html);
        // 准备编辑器
        // return quill;
      },
    onEditorBlur(quill,a,b,c) {
      /**只要一失去焦点，进行存储（存储到本地 覆盖前面的。）
       * 如果失去焦点后，距离未保存的修改超过了24个小时，则上传服务器。
       * 否则只能是手动上传到服务器。
       */
      // console.log(quill);
      console.log(this.content);
      }, // 失去焦点事件
    onEditorFocus(quill,a,b,c) {
      console.log(quill.html);
      // console.log(quill);
      }, // 获得焦点事件
    onEditorChange(quill,a,b,c) {
      /**quill.html 就是内容， quill.quill.getText()就是文字
       * quill.quill.history.lastRecorded 历史记录最后的时刻
       * quill.quill.getContents() 是delta的列表，（不会包含delete）
       * quill.history.redo() quill.history.undo() 撤销或恢复上一次操作
       * this.content是html的内容
       * setContents(inputDelta);通过delta数据获得新内容
       * quill.quill.editor.insertText(6,"sdfg")
       * 
       * function quillGetHTML(inputDelta) {
       *     var tempCont = document.createElement("div");
       *     (new Quill(tempCont)).setContents(inputDelta);
       *     return tempCont.getElementsByClassName("ql-editor")[0].innerHTML;
}
       * 
       */
      /**自动上传到服务器，或本地保存。 如果history.redo.length + history.redo.length >10 或者 length>0并且 history.lastRecorded 超过了设定的自动保存时间，则存为本地local数据流（存储delta）*/
      
      this.content=quill.html;
      this.$emit("onEditorChange",this.content);
      this.content='<h1>输入标题</h1><div id="id11">常规的输入情况</div> <div>设置<br></div>';
      console.log(quill.html);
    }, // 内容改变事件

    handleClick() {
        // 处理搜索相关的业务流程
        console.log("按钮");
      },
    saveHtml(){
      return this.$refs.quillEditor.quill;
    },
    drawLine(){
      var c=this.$echarts.init(document.getElementById("mychart"));
      c.setOption({
        title: {text:"hello"},
        tooltip:{},
        xAxis:{data:[1,2,3,4,5]},
        yAxis:{},
        series:[{name:'ddd',type:'bar',data:[23,234,234,23,44]}]
      });
    },
  },
  computed: {
    getEditorStyle(){
      // 设置编辑窗口的固定大小，默认为100%
      var ts={};
      ts.height = this.iEditorSize;
      return ts;
    },
    editor(){
      return this.$refs.myQuillEditor.quill ;
    },
    getTopStyle(){
      var tstyle={};
      tstyle.width='100%';
      tstyle.height='37px';//根据输入的高度来设定，当前自己确定一下就可以。
      return tstyle;
    },
    getTitleImg(){
      return require('../../public/images/pic002.jpg')
    },
  },
  mounted(){
    /**读取本地对应Article的内容（只有草稿类型才记录） */
     console.log('this is current quill instance object', this.editor);
  },
}

</script>

<style scoped>
.ArtCompose{
  /* relative是为了能用top的绝对定位 */
  position:relative;
  height:100%;
  width:100%;
}

.ArtCompose-box{

}
.p{
  border:blue 1px solid;
}
#id11{
  background-color:green;
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
}

#chart {
        width: 300px;
        height: 300px;
    }
</style>