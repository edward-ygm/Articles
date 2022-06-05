<template>
<div>
<svg class="svg-icon" viewBox="0 0 24 24" preserveAspectRatio="none" >
   <defs>
     <path id="smiley" d="M50,10 A40,40,1,1,1,50,90 A40,40,1,1,1,50,10 M30,40 Q36,35,42,40 M58,40 Q64,35,70,40 M30,60 Q50,75,70,60 Q50,75,30,60" />
   </defs>
   <circle  cx="12" cy="12" r="10"  />
  <svg viewBox="0 0 100 100" width="10" height="25"  x="10" y="0">
   <use href="#smiley" />
   <use href="#smiley" />
  </svg>
</svg> 
  <!-- <svg v-if="iconBackgroundColor" width="100%" height="100%"
     viewBox="0 0 58 58" 
     style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"
     >
       <rect width="100%" height="100%" fill="red" />
       <text x="150" y="125" font-size="60" text-anchor="middle" fill="white">SVG</text>

        <circle :style="{ fill: iconBackgroundColor }" cx="28.546" cy="28.546" r="25.546" />
        <path v-if="status === 'success'" d="M16.243,28.579l8.18,8.181l16.427,-16.427" />
        <g v-if="status === 'error'">
            <path d="M20.333,37.747l16.427,-16.427" />
            <path d="M20.333,21.32l16.427,16.427" />
        </g>
  </svg> -->
  </div>
</template>

<script>
const colors = {
    success: '#641212',
    error: '#e4002b',
}

export default {
    name: 'StatusIcon',

    props: {
        status: {
            type: String,
            default: '',
            validator(status) {
              return colors[status] || status === ''
            }
        }
    },

    computed: {
        iconBackgroundColor() {
            return colors[this.status]
        }
    }
}
</script>

<style scoped>
div {
    border: 1px solid;
}

.svg-icon {
    width:100%;
    height:100%;
}

path,
circle {
    stroke: #641212;
    stroke-width: 3px;
    fill: yellow;
}
</style>


// var embed = document.querySelector('#jimjim');
// var d = embed.getSVGDocument();
// var svg = d.querySelector('svg');
// svg.setAttribute("viewBox","0 0 660 342");