<template>
<div>
    <svg class="svg-icon" preserveAspectRatio="none"  x="0" y="0"
         viewBox="0 0 1024 1024" width="100%" height="100%">
        
        <circle cx="500" cy="500" r="130" 
        :style="{fill:fillcolor,stroke:linecolor,'stroke-width':lineWidth}" />

        <path d="M945.066667 898.133333l-189.866667-189.866666c55.466667-64 87.466667-149.333333 87.466667-241.066667 0-204.8-168.533333-373.333333-373.333334-373.333333S96 264.533333 96 469.333333 264.533333 842.666667 469.333333 842.666667c91.733333 0 174.933333-34.133333 241.066667-87.466667l189.866667 189.866667c6.4 6.4 14.933333 8.533333 23.466666 8.533333s17.066667-2.133333 23.466667-8.533333c8.533333-12.8 8.533333-34.133333-2.133333-46.933334zM469.333333 778.666667C298.666667 778.666667 160 640 160 469.333333S298.666667 160 469.333333 160 778.666667 298.666667 778.666667 469.333333 640 778.666667 469.333333 778.666667z"
        :style="{fill:fillcolor,stroke:linecolor,'stroke-width':lineWidth}"
        
        >
        </path>
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

export default {
    name: 'StatusIcon',
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
        }
    },

    computed: {
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


/* path,circle,rect,line {
    stroke: var(--line-color);
    stroke-width: 1px;
    fill:var(--fill-color);
} */
</style>