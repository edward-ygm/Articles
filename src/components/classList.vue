<template>
<div>
  <button v-for="class in classList" @click="returnClss(class.id)">{{class.name}}</button>
</div>
</template>

<script>
export default {
  props:{classList}
}
data(){
  return {
        //接收一个课程对象，对象包含每集id和每集名称
        classList:this.classList   
  },
  methods:{
    returnClss(classId){
	  //回传课程单集id
      this.$emit('classId',classId);
    }
  }
}
</script>

<style scoped>
button{
  font-family: inherit;
  line-height: 1;
  background: #fff;
  border: 1px solid #dcdfe6;
  font-size: 12px;
  padding: 6px 6px;
  margin: 0 10px 10px 0;		
}
</style>