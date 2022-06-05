<template>
  <div id="TestPage">
    <!-- 作为测试，这里还是做成一个功能按钮列表吧 -->
    <picUpload style="display:none" />
    <ArtCompose style="display:block" />
    <!-- <FileLoad loadUrl="http://localhost:8090/admin/upload" ></FileLoad> -->
  </div>
</template>

<script>
// import FileLoad from "../components/FileLoad.vue";
// import Test from "../components/basic/LabelItem.vue";
// import Avatar from "vue-avatar";
import picUpload from '../../components/basic/picUpload.vue'
import ArtCompose from '../ArtCompose.vue'
/**测试 */
var adiutil = require("../../assets/js/adiutil.js");
export default {
    components:{
        picUpload,
        ArtCompose,
        // FileLoad
    },
  data () {
    return {
      // 上传成功后的URL
      userAvatar:undefined,
      trigger:true,
    }
  },
  methods: {
    getData(){
      let r = new FormData(); 
      r.append("email","a@email.com");
      return r;
    }

  },
}
</script>

<style >
</style>