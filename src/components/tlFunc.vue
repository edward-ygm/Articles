<template>
<p>
  <ul class="ul">
    <li><a :href="option0">{{op0Name}}</a></li>
  </ul>
  <ul>
  <li><a :href="option1">{{op1Name}}</a></li>
  <li><a :href="option2">{{op2Name}}</a></li>
  <li><a :href="option3">{{op3Name}}</a></li>
  <li><a :href="option4">{{op4Name}}</a></li>
  <li><a :href="option5">{{op5Name}}</a></li>
</ul>
</p>

</template>

<script>
export default {
  props:['option0',
         'op0Name',
         'option1',
         'op1Name',
		 'option2',
		 'op2Name',
		 'option3',
		 'op3Name',
		 'option4',
		 'op4Name',
		 'option5',
		 'op5Name'
		 ]
}
data(){
  return {
    option0:this.option0,
	op0Name:this.op0Name,
    option1:this.option1,
	op1Name:this.op1Name,
	option2:this.option2,
	op2Name:this.op2Name,
	option3:this.option3,
	op3Name:this.op3Name,
	option4:this.option4,
	op4Name:this.op4Name,
	option5:this.option5,
	op5Name:this.op5Name
  }
}
</script>

<style scoped>
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  width: 100%;
  border: 1px solid #555;
}
li a {
  display: block;
  color: #000;
  padding: 8px 16px;
  text-decoration: none;
}
li {
  text-align: center;
  border-bottom: 1px solid #555;
}
li:last-child {
  border-bottom: none;
}
.ul {
  margin:0 90%;
  border: 1px solid #555;
  width: 10%;
}
</style>