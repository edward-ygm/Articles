<template>
<div>
    <svg class="svg-icon fineLine" preserveAspectRatio="none"  x="0" y="0"
         viewBox="0 0 1024 1024" width="100%" height="100%">
        
        <path d="M874.666667 480H224L514.133333 170.666667c12.8-12.8 10.666667-34.133333-2.133333-44.8s-32-10.666667-44.8 2.133333l-341.333333 362.666667c-2.133333 2.133333-4.266667 6.4-6.4 8.533333-2.133333 4.266667-2.133333 6.4-2.133334 10.666667s0 8.533333 2.133334 10.666666c2.133333 4.266667 4.266667 6.4 6.4 8.533334l341.333333 362.666666c6.4 6.4 14.933333 10.666667 23.466667 10.666667 8.533333 0 14.933333-2.133333 21.333333-8.533333 12.8-12.8 12.8-32 2.133333-44.8L224 544H874.666667c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32z"
        :style="{fill:fillcolor,stroke:linecolor,'stroke-width':lineWidth}"
        :transform="getAngle"
         ></path>

    </svg>
  </div>
</template>

<script>

export default {
    name: 'DirectionsIcon',
    props: {
        linecolor: {
            type: String,
            default: "#777",
        },
        lineWidth:{
            type: String,
            default:"3px",

        },
        fillcolor:{
            type: String,
            default: "#eee",
        },
        rotateAngle:{
            type: Number,
            default: 0,
        },
    },
    computed: {
        getAngle(){
            var x = "rotate(" + this.rotateAngle + ", 512, 512)";
            return x;
        },
        iconBackgroundColor() {
            return 1;
            // return colors[this.status]
        }
    }
}
</script>

<style scoped>
div {
    box-shadow: 0 0 0 0.3px;
}
</style>