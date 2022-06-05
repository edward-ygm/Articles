<template>
  <div class="labelItem " :class="{active:isActive}" v-on:click="handleClick"> 
      <!-- 有名字的插槽 -->
      <slot name="title"></slot>
      <slot name="label"></slot>
  </div>

</template>

<script>
export default {
    props:{ 
        isActive:{
            default:false,
        }
    },
    methods:{
        handleClick(){
            //
            this.$emit("active",123);
        }
    },
}
</script>

<style scoped>

.active {
    background: red;
}
.labelItem{
    cursor:pointer;
    transition: 0.2s;
}
.labelItem{
    font:89px;
    width:100%;
    height: 65px;
}
.labelItem:hover{
    background: #f4f4f4;
}
</style>