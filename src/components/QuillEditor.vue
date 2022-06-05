<template>

  <div> class="ArtCompose" 
    <!-- 标题+quil+底部图片选项（用于展示） -->
  <div class="quillEdit"></div>

    <quill-editor 
        v-model="content" 
        ref="myQuillEditor" 
        :options="editorOption" 
        @blur="onEditorBlur($event)"
        @focus="onEditorFocus($event)"
        @change="onEditorChange($event)"
      ></quill-editor>
    
    <button :click="saveHtml"> 保存</button>
    <button :click="saveHtml"> 提交</button>

    <div class="adi-box-relative"> </div>
  </div>
</template>

<script>
/**文章编辑界面 */

import Quill from 'quill'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  name: "HotToday",
  components:{
    Quill,
    // TopFunc,
  },
  data(){
    return{
      quill: null,
      content:"<p>hi</p>",
      editorOption:{
        theme:'snow',
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
    artList:{
      type: Array,
      default:function(){
      return [ {bref:'护生文2',details:"<p >避苦求乐同,很多时候我们会忽略动物的生存权利，认为他们就是食物呀什么的。比如从小就灌输错误的想法，比如小鸡养来就是吃的。其实所有动物都是给吃的就高兴，惩罚就躲避，这些方面和人没有任何区别。</p>",imgList:["icon2.png","icon3.png","icon4.png"],userName:"刘德华",userIcon:"ldh001.png",wholeArt:"整篇文档",comment:"133",ntNum:1,id:2,url:"#",},
              ];
        }},
  },
  methods: {
    onEditorReady(editor) {
        // 准备编辑器
        return editor;
      },
    onEditorBlur(indata) {
      console.log(indata)
    }, // 失去焦点事件
    onEditorFocus(indata) {console.log(indata);}, // 获得焦点事件
    onEditorChange(indata) {console.log(indata);}, // 内容改变事件
    handleClick() {
        // 处理搜索相关的业务流程
        return this.$refs.quillEditor.quill;
        console.log("按钮");
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
    }
  },
  computed: {
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
    this.drawLine();
    this.quill = new Quill(document.getElementsByClassName('quillEdit'),this.editorOption);

  }

};
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