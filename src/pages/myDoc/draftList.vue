<template>
  <div>草稿列表
    <router-link to="/ZiLiao/newDraft" @click="getArticleID">新建草稿</router-link>
  </div>
</template>

<script>
import axios from 'axios';
export default {
   methods:{
     getArticleID(){
       let data={};
       axios.post("",data).then(res=>{
         /** 保存ArticleID */
         this.$router.push({name:"",params:{artID:res.artID}});
       }).catch(err=>{
         // nothing need to be done?
       })
       
     }
   }
}
</script>

<style>

</style>