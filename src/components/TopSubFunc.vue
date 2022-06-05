<template>
<!-- <div class="TopSubFunc adi-box" >
  <div class="adi-words" v-for="item in getLinkMap" :key="item.name" >
      <router-link :to="item.url">{{item.pageName}}</router-link>
  </div>
</div> -->

  <nav id="topFunction" class="sticky-top navbar-light bg-light"  style="height:6.5rem" >
    <nav class="nav nav-pills nav-justified">
      <router-link :to="item.url" class="nav-item nav-link "  v-for="item in getLinkMap" :key="item.name">{{item.pageName}} </router-link>
    </nav>
  </nav>

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
      return this.g.uiInfo.wzMap;
    }
  }
}
</script>

<style scoped>

.BottomFunc{
  width:100%;
  height:98px;
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