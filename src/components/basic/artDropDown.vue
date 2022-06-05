<template>
  <div id="artDropDown" class="btn-group">
     <button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        {{dditle}}
     </button>
     <div class="dropdown-menu">
       <div class="dropdown-item " @click="changeArtID()">新文章ID</div>
       <div class="dropdown-divider " ></div>
       <div class="dropdown-item d-flex flex-row justify-content-between mb-3"
            v-for="ak in articleIDList" :key="ak" >
            <span  @click="changeArtID(ak)">{{ak}}</span> <i class="fa fa-close text-right" @click="removeID(ak)"></i>
       </div>
     </div>
 </div>
</template>

<script>
/**dropdown会有数据变化，写成组件后可以实现动态变化 */
export default {

}
</script>

<style>

</style>