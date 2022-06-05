<template>
  <div class="ArtCompose" >
    <!-- 标题+quil+底部图片选项（用于展示） -->
    <QuillVue ref="draft-article"></QuillVue>
    <div>
        <!-- 这里可以加载图片作为文章title的显示，-->
    </div>
    <div class="d-flex flex-row">
        <button class="btn btn-primary" :click="saveDraft"> 保存草稿</button>
        <button class="btn btn-primary" :click="publishHtml"> 发布</button>
    </div>
  </div>
</template>

<script>
/**文章编辑界面，里面采用了富媒体 */
// import FileLoad from "../components/FileLoad.vue";
import QuillVue from "../components/QuillVue.vue";
// import picUpload from "../components/basic/picUpload.vue";
// import axios from "axios";
export default {
  name: "HotToday"
  ,props:{
    /** 打开已有的文档，输入articleID,及article */
    iarticleID:{type:String,default:"",}
    ,iartcontent:{type:String}
    ,ipic:{type:Array,default:function(){return [];}},
  }
  ,components:{
    QuillVue,
    // picUpload,
    // FileLoad,
  },
  data(){
    return{
      checkList:[],/** 标题图片选择框 */
      pics:this.ipic,
      radio:'0',
      content:"<p>hi</p>",
      articleID:"",
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
  methods: {
    saveDraft(){
      console.log("按钮");
      /** 草稿保存在只能由自己打开的私人目录，上传到草稿接口 */
      //获取content，并取出文本
      //上传到服务器
    }
    ,publishHtml(){
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
    }
    ,myopen() {
      console.log("按钮");
      // var files=document.getElementById("file");
      // var file=files.files;//每一个file对象对应一个文件。

      // var reader=new FileReader();
      // reader.readAsDataURL("d:/tmp/a.txt");
      // reader.onload = function(){
      //   console.log(this.result);
      // };
      
      // reader.readAsDataURL("d:/tmp/a.txt");
      // reader.onload = function(){
      //   console.log(this.result);
      // };
      
    },

    handleClick() {
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
    ,saveHtml(){

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
    // this.drawLine();
    //获取数据
    if(!this.artcontent)
      this.content = "<p>第一行为标题</p>";
    else
      this.content=this.iartcontent;
    this.articleID=this.iarticleID?this.iarticleID:"";
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
.QuillVue{

}
.ql-editor{
  display:block;
  width:100%;
  height:500px;
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