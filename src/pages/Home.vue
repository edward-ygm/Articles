<template>
<div>
  <nav class="sticky-top navbar-light bg-light"  style="height:6.5rem" >
    <nav class="nav nav-pills nav-justified">
      <a class="nav-item nav-link active" href="#">Active</a>
      <a class="nav-item nav-link" href="#">Link</a>
      <a class="nav-item nav-link" href="#">Link</a>
      <a class="nav-item nav-link disabled" href="#">Disabled</a>
    </nav>
  </nav>


  <div style="margin-top: 6.5rem; padding-bottom: 6.5rem;">
    <div class="btn-toolbar justify-content-between" role="toolbar" aria-label="Toolbar with button groups">
      <div class="btn-group" role="group" aria-label="First group">
        <button type="button" class="btn btn-secondary">123rqwet</button>
        <button type="button" class="btn btn-secondary">2wer</button>
        <button type="button" class="btn btn-secondary">3wer</button>
        <button type="button" class="btn btn-secondary">4wer</button>
      </div>
    </div>




    <button type="button" class="btn btn-light">---------</button>

    <div v-for="item in articles" :key="item" >
        <ArtresultItemA siHeight="120px">{{ item }}</ArtresultItemA>
    </div>

    <button type="button" class="btn btn-light">000000000000000</button>

  </div>
</div>
</template>

<script>
// import ArtresultTitles from "./components/ArtresultTitles.vue";
// import SearchTitle from "../components/SearchTitle.vue";
// import ArtresultItemA from "./components/ArtresultItemA.vue";
// import SearchTitle from "./components/SearchTitle.vue";
// import FuncTitle from "../components/notUsed.vue";
import ArtresultItemA from "../components/ArtresultItemA.vue";
// import Svgs from "./components/svg/Svgs.vue";
// import SvgIcons from "./components/svg/SvgIcons.vue";
// import SearchInput from "./components/SearchInput.vue";
export default {
  name: "app",
  components: {
    // SearchTitle,
    // FuncTitle,
    // elbutton,
    ArtresultItemA,  
  },

  data() {
    return {
      footerHeight: "98px",
      msg: "大家好",
      curActive: "abc",
      articles: [1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13,14,15,16,17,18,19,20],
      // articles: [1, 2, 3, 4, 5, 6, 7,],
    };
  },
  methods: {
    handleSearch() {
      // 处理搜索相关的业务流程
      console.log("appTest 接收到了搜索的信息");
    },
  },
};

/**
 使用说明
 <SearchInput siHeight="37px"></SearchInput>
 <IconsExamples siHeight="65px"></IconsExamples>
 */
</script>

<style>
/** 全局style,引用都可以在这里完成 */

.adi-container{
  position:relative;
  height:auto;
  min-height: 100%;
  border: 1px solid red;
}
.adi-top{
  position:sticky;  
  width:100%;
  left:0px;
  top:0px;
  text-align: center;
  box-sizing: border-box;
}

.adi-mid{
  box-sizing: border-box;
  /* margin-top:80px; */
  padding-bottom: 98px;
}
.adi-footer {
  position: fixed;
  bottom: 0px;
  left: 0px;
  right: 0px;
  height:98px;
  z-index: 100;
  background-color: var(--bg-footer-color);
}
</style>
<style scoped>
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  font-family: "Noto Sans SC";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 2px;
  width: 100%;
  height: 100%;
}
</style>