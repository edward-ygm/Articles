<template>
  <div>
    <!-- <form name="demoForm" id="demoForm" method="post" enctype="multipart/form-data"  action="javascript: uploadAndSubmit();">  -->
    <!-- 样式太难看了，所以透明化input -->
    <button class="btn-primary" @click="clp()">添加文件</button>
    <input ref="chooseFile" style="display:none" id="MyFile"  type="file" name="file" :change="onChange"/>

    <button class="btn-primary" @click="uploadAndSubmit()">上传文件</button>

    <br>
  </div>
</template>

<script>
import axios from "axios";
export default {
    props:{
        artID:{type:String,default:'0'},
        picID:{type:String,default:'0'},
    },
    data(){
        return{
            upUrl:"/data/picUpload/title",
        }
    },
    methods:{
        clp(){
            //return document.getElementById("#MyFile").click();
            return this.$refs.chooseFile.click();
        },
        uploadAndSubmit(){
            /**读取文件 */
            var forms = new FormData();
            var configs={headers:{'Content-Type':'multipart/form-data'}};
            forms.append('file',this.$refs.chooseFile.files[0]);//获取上传图片信息
            forms.append('type','img');
            forms.append('name',this.artID + this.picID + ".jpg");
            axios.post(this.upUrl,forms,configs,).then(function(res){
                console.log("完成数据上传"+res);
                 var result = res.data;
                 if (result.code == 0) {
                     console.log("hello");
                 }
            });

            // var file = this.$refs.chooseFile.files[0];
            // var name = file.name;
            // var size = file.size;
            // console.log("name"+name + size);

            // var reader = new FileReader();//这个是读取操作
            // reader.readAsText(file);//不需要路径？

            // reader.onload = function(){
            //     //文件内容已经存储在了这个this.result的地方
            //     console.log(this.result);
            // }
            // //
            // var req = new XMLHttpRequest();
            // console.log(file);
            // req.open("post", 'URL', true);
            // //req.send(form);
            // reader.onload = function() { 
            //     // 这个事件在读取文件成功结束后触发
            //     console.log("load complete"); 
            // }
        },
        
    }
}
</script>

<style>

</style>