<template>
  <div id="readFiles" class="ReadFile">
    <el-upload class="myUpload"
      drag
      action=""
      accept="application/json"
      :before-upload="getFile">
      <div class="el-upload__text">导入JSON文件</div>
    </el-upload>

    <el-upload 
      :action="uploadActionUrl"
      accept="image/jpeg,image/gif,image/png,text/plain,application/json"
      multiple
      :on-change="onUploadChange"
      :data="uploadData"
      :limit="3"
      :on-exceed="handleExceed"
      :before-upload="onBeforeUpload"
      :on-error="uploadError"
      :on-success="uploadSuccess"
      :on-remove="onRemoveTxt"
      :file-list="files">
        <el-button size="small" type="primary"  @click="submitUpload">点击上传</el-button>
        <el-button slot="trigger" size="small" type="primary">选取</el-button>
        <div slot="tip" class="el-upload__tip">请上传图片格式文件</div>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      uploadData: {
          dataType: "0",
          oldFilePath:""
      },
      files:"",
      fileText: null,
      DownloadDom: null
    };
  },
  methods: {
    onUploadChange(file)
    {
      const isIMAGE = (file.raw.type === 'image/jpeg' || file.raw.type === 'image/png'|| file.raw.type === 'image/gif');
      console.log("Filesize is: "+file.size+isIMAGE);

      var reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = function(e){
          console.log(this.result,e)//图片的base64数据
      }
    },
    submitUpload()
    {
      console.log("submit")
    },
    readLocalFile: function(file, callback) {
      let reader = new FileReader();
      //将文件以文本形式读入页面
      reader.readAsText(file);
      reader.onload = function() {  
        typeof callback === "function" && callback(this.result);
      };
    },
    saveFile: function() {
      if (this.DownloadDom) {
        let blobStr = [this.fileText];
        let myBlob = new Blob(blobStr, { type: "application/json" });
        this.DownloadDom.href = window.URL.createObjectURL(myBlob);
        console.log('下载文件已就绪')
      }
    },
    getFile: function(file) {
      this.readLocalFile(file, result => {
        this.fileText = result.replace(/\s/g, "");
        this.saveFile();
      });
      return false;
    }
  },
  mounted: function() {
    this.DownloadDom = document.getElementById("Download");
  }
};
</script>

<style>
html,
body {
  margin: 0;
  height: 100%;
}
.ReadFile{
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0 auto;
}
.myUpload .el-upload {
  display: block;
}
.myUpload .el-upload-dragger {
  width: 100%;
}

</style>