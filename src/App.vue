<template>
  <div>
    <div><router-view></router-view></div>
    <!-- 底部导览区域 -->
    <nav class="navbar fixed-bottom navbar-light bg-light" style="height:25px" >
      <div v-for="item in getLinkMap" :key="item.pageName" style="font-size:1.5rem">
        <router-link :to="item.url">{{item.pageName}}</router-link>
      </div>
    </nav>
  </div>

</template>

<script>
var util = require('./assets/js/adiutil.js');
var bu = require('./assets/js/baseFunc.js')
import axios from "axios";

// import Dropdown from "./components/Dropdown.vue";
// import BottomFunc from "./components/BottomFunc.vue";
// import ArtInfoItem from "./components/ArtInfoItem.vue";
// import ArtresultTitles from "./components/ArtresultTitles.vue";
// import SearchTitle from "./components/SearchTitle.vue";
// import ArtresultItemA from "./components/ArtresultItemA.vue";
// import SearchTitle from "./components/SearchTitle.vue";
// import FuncTitle from "./components/FuncTitle.vue";
// import ArtresultItemA from "./components/ArtresultItemA.vue";
// import Svgs from "./components/svg/Svgs.vue";
// import SvgIcons from "./components/svg/SvgIcons.vue";
// import SearchInput from "./components/SearchInput.vue";

export default {
  name: "app",
  components: {
    // Dropdown,
    // BottomFunc,
    // SearchTitle,
    // ArtInfoItem,
    // FuncTitle,
    // elbutton,
    // ArtresultItemA,  
  },
  data() {
    return {
      // footerHeight: "98px",
    };
  },
  computed:{
      getLinkMap(){
      /**this.g.funcMap就是全局的变量 */
      return this.g.uiInfo.partMap;
    }
  },
  methods: {
    handleSearch() {
      // 处理搜索相关的业务流程
      console.log("appTest 接收到了搜索的信息");
    },
    getToken(){
      /**{'token':this.g.uiInfo.reToken,'data':resObj.data} */
      let retoken = util.getLocal('retoken');
      if(retoken==null){
        /** 没有登录信息 */
        this.g.uiInfo.loginData.status = "no";
        return;
      }
      // 这个时候属于正常清空，需要更新data
      let token=JSON.parse(retoken);

      this.g.uiInfo.loginData = token.data;/**记录当前的登录信息 */
      this.g.uiInfo.loginData.status = "yes";/**处于登录状态 */
      let _this = this

      axios.post(this.g.servInfo.baseUrl+"/login/refreshToken",token)
           .then(resObj=>{
                let data = resObj.data;
                if('token' in data) {
                    _this.g.uiInfo.token = data.token;
                }else if('data' in data) {
                  _this.g.uiInfo.loginData = data.data;/**记录当前的登录信息 */
                  _this.g.uiInfo.loginData.status = "yes";/**处于登录状态 */
                }else{
                  /** 设置为非登录状态 */
                  _this.g.uiInfo.loginData.status = "no";/**非登录状态 */
                  // _this.$router.push('/login')
                }
           }).catch(err=>{
            //  不能刷新token，表示登录出现了问题
            //  _this.$router.push('/login')
             console.log("fail",err);
           });
    }
  },
  mounted(){
    /**程序启动时，需要执行 */
    /** 获取local的refresh token，获取access Token */
    this.getToken();
    /***测试程序 */
    // bu.examples();

  }
};

/**
 使用说明
 <SearchInput siHeight="37px"></SearchInput>
 <IconsExamples siHeight="65px"></IconsExamples>
 */
</script>

<style>
/** 全局style,引用都可以在这里完成 */
</style>
<style scoped>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  background-color: bisque;
  /* font-family: "Noto Sans SC"; */
  /* -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50; */
  margin-top: 1px;
  width: 100%;
  height: 100%;
}

</style>

