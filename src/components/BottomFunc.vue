<template>
<div >
  <!-- <el-radio-group class="adi-words" v-for="item in getLinkMap" :key="item.pageName" >
      <el-radio-button><router-link :to="item.url">{{item.pageName}}</router-link></el-radio-button>
  </el-radio-group> -->

  <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card" tab-position="bottom" style="height: 39px;">
    <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
    <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
    <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
    <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
  </el-tabs>

</div>

</template>

<script>
export default {
  data(){
    return{
      linkMap:"",
    }
  },
  computed:{
    getLinkMap(){
      /**this.g.funcMap就是全局的变量 */
      return this.g.uiInfo.partMap;
    }
  }
}
</script>

<style scoped>

.BottomFunc{
  width:100%;
  height:87px;
}
.adi-box{
  justify-content: space-between;
  background-color: #ccc;
}
.adi-words{
  height:98px;
  font-size:34px;
  border:1px;

  color:blue;
  background-color: transparent;
  margin:1px;
}
.adi-words a:hover{
  color:red;
}

.el-col {
    border-radius: 15px;
  }
  .adi-flex div{
    font-size: 29px;
  }
  .adi-flex,
  .adi-flex div{
    padding: 5px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

</style>