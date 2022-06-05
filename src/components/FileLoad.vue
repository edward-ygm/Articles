<template>
  <div class="file-upload">
    <el-button @click="clickUpload()">添加</el-button>
    <input type="file" @change="onFileChange" ref="chooseFile" style="display:none" />
    <div v-if="progress" class="progess-bar" :style="{'width': progress}">
       {{progress}}
    </div>
    <div>
    <el-button @click="onUploadFile">上传</el-button>
    </div>
  </div>
</template>

<script>
/** 文件上传组件，在这个基础上，需要添加根据 articleID来组装新的文件名字
 * 这个是在https://reactgo.com/vue-file-upload/ 教程的基础上，进行的修改
 */
import axios from 'axios';
// import SvgIcons from './svg/SvgIcons.vue'

export default {
  components:{
    // SvgIcons,
  },
  props:{
    loadUrl:{ type:String,default:"", }
  },
  data() {
    return {
      selectedFile: "",
      progress:0,
    };
  },
  methods: {
    clickUpload(){return this.$refs.chooseFile.click();}, //直接调用input type='file'的控件的函数
    onFileChange(e) {
      const selectedFile = e.target.files[0]; // accessing file
      this.selectedFile = selectedFile;
    },
    onUploadFile() {

      const formData = new FormData();
      formData.append("file", this.selectedFile);  // appending file
      formData.append("email","my@email.com");

     // sending file to the backend; loadUrl 类似 "http://localhost:8090/admin/upload"
      // this.loadUrl="http://localhost:8090/admin/upload";
      axios
        .post(this.loadUrl, formData, {
            onUploadProgress: ProgressEvent => {
              let progress =
                Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100)
                +"%";
              this.progress = progress;
            }
          })
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    }

      // $.ajax(
      //   {type:"POST",
      //   url:"/data/picUpload/title",
      //   data : {name:"xx"},
      //   datatype: "json",//"xml", "html", "script", "json", "jsonp", "text".
      //   beforeSend:function(){console.log("dddd beforeSend");
      //   },
      //   success:function(data){
      //      console.log("dddd success"+data);            
      //   },
      //   complete: function(XMLHttpRequest, textStatus){
      //          alert(XMLHttpRequest.responseText);
      //          alert(textStatus);
      //           //HideLoading();
      //           console.log("dddd complete");
      //   },
      //   //调用出错执行的函数
      //   error: function(){
      //           //请求出错处理
      //           console.log("dddd error");
      //       }         
      //   });


  }
};
</script>

<style scoped>
.file-upload {
  box-shadow: 2px 2px 9px 2px #ccc;
  border-radius: 1rem;
  padding: 2rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 1rem;
  margin: 0 auto;
}

input {
  font-size: 0.9rem;
}
input,
div,
button {
  margin-top: 2rem;
}

.upload-button,
.inputButton {
  width: 7rem;
  padding: 0.5rem;
  background-color: #278be9;
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 1rem;
}

.upload-button:disabled {
  background-color: #b3bcc4;
  cursor: no-drop;
}
</style>