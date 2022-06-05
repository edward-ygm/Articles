<template>
<form id="artPicUpload" method="post" class="picUpload">
  <div class="card picUpload text-center col-auto">
    <div class="card-body " :style="{'height':siHeight,'width':siHeight}"
    @click="changeTrigger">
      
      <div class="card-img-overlay">
        <button 
          type="button"
          class="btn btn-primary btn-sm"
        >
          请选择图片
        </button>
      </div>
      <SvgIcons iconID="uploader" :iconSize="siHeight"></SvgIcons>
    </div>
      <h5 class="card-title mb-0">{{ nickname }}</h5>
      <div class=" text-muted">{{ message }}</div>
      <AvatarCropper
        @uploading="handleUploading"
        @uploaded="handleUploaded"
        @completed="handleCompleted"
        @error="handlerError"
        v-model="trigger"
        :upload-url="loadUrl"
        :request-options="setReqHeader"
        :labels="{submit:'上传',cancel:'取消'}"
      />
    
  </div>
</form>
</template>

<script>
/** 头像上传 */
import AvatarCropper from "vue-avatar-cropper";
import SvgIcons from '../svg/SvgIcons.vue';

export default {
  components: { 
    AvatarCropper,
    SvgIcons,
  },
  data() {
    return {
      trigger: false,
      finishPos:0,
      message: "ready",
    };
  },
  props:{
    siHeight:{type:String,default:'100px'},
    loadUrl:{ type:String,default:'http://www.dzpslt.com:8090/admin/upload/pic'},
    nickname:{type:String,default:'昵称'},
    email:{type:String,default:"a@qq.com"},
  },
  computed:{
    /** 这里需要设置token等参数 (如何自动配置axios携带这个头信息？) */
    setReqHeader(){
      let h={ method: 'POST' };
      h.headers = {'access-token':this.g.userInfo.token};/**携带token信息 */
      h.headers = {'access-token':'this.g.userInfo.token'};/**测试 */
      h.headers = {'user-email':this.email};/**测试 */
      return h;
    },
    setNewName(){/**test only */
      /**这里通过设置新的文件的地址，通知服务器email等信息。 upload-form-data 这个选项不生效 */
      let ret = "abc.jpg";
      return ret;
    },
    setData(){/**test only */
      var ret = new FormData();
      ret.append("email","a.qq");
      ret.append("sf","a.qq");
      console.log(ret.get("sf"));/**ret.get("email"),ret.getAll("emaill")->[email,],ret.has("email") */
      ret.append('email',this.email);
      ret.append('token',this.g.userInfo.token);
      return ret;
    }
  },
  methods: {
    changeTrigger() {
      this.trigger = true;
    },
    handleUploading(form, xhr) {
      this.message = "上传中...";
    },
    handleUploaded(response) {
      if (response.status === "success") {
        this.user.avatar = response.url;
        // Maybe you need call vuex action to
        // update user avatar, for example:
        // this.$dispatch('updateUser', {avatar: response.url})
        this.message = " status updated.";
      }
    },
    handleCompleted(response, form, xhr) {
      this.message = "上传完成";
      this.$emit("finishUpload",response);
    },
    handlerError(message, type, xhr) {
      this.message = "上传失败...";
    },
  },
};
</script>

<style>
.picUpload {
  max-width: 18em;
  margin: 0 auto;
}
.avatar {
  width: 160px;
  border-radius: 6px;
  display: block;
  margin: 20px auto;
}
.card-img-overlay {
  display: none;
  transition: all 0.5s;

}
.card-img-overlay button {
  margin: auto;
  /* align-self: center; */
}
.card:hover .card-img-overlay {
  display: block;
}
</style>
