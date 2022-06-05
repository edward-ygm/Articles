<template>
<div class="circle-load">
  <svg width="240px" height="240px" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="90" stroke-width="7" stroke="gainsboro" fill="transparent"></circle>
  </svg>
  <div v-html="wave">


    <filter id="f1" x="0" y="0" width="170%" height="170%">
      <feOffset result="offOut" in="SourceGraphic" dx="20" dy="20" />
      <feColorMatrix result = "matrixOut" in = "offOut" type = "matrix" values = "0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.2 0 0 0 0 0 1 0"/>
      <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="10" />
      <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
    </filter>

  </div>

  <svg width="320" height="320" xmlns="http://www.w3.org/2000/svg">
  <g> 
    <text font-family="microsoft yahei" font-size="120" y="160" x="160">马</text>
    <animateTransform attributeName="transform" begin="0s" dur="10s" type="rotate" from="0 160 160" to="360 160 160" repeatCount="indefinite"/>
  </g>
</svg>

</div>
</template>

<script>
export default {
  name: "SvgIcons",
  props: {
    iconID:{
      type:String,
      default:"palms",
    },
  },
  data(){
    // data内记录一些特殊元素的信息
    return {
      /*合掌相关的固定设置*/
      palmHand:"#ffca28", 
      /**其他特殊设置 */
    }
  },
  methods:{
   wave(){
      return (
        <div className="App">
          <svg width="100%" height="100%" viewBox="0 0 100% 100%">
            {[1, 2, 3, 4, 5].map((it, index) => (
              <line
                key={index}
                className={`line-${index + 1}`}
                stroke="#000"
                strokeWidth="2"
                x1={15 + index * 5}
                y1="8"
                x2={15 + index * 5}
                y2="22"
              >
                <animate
                  attributeName="y1"
                  values="8; 15; 8"
                  dur="1s"
                  begin={`${(5 % (index + 1)) * 0.2}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="y2"
                  // to="15"
                  values="22; 15; 22"
                  dur="1s"
                  begin={`${(5 % (index + 1)) * 0.2}s`}
                  repeatCount="indefinite"
                />
              </line>
            ))}
          </svg>
        </div>
      );
    },

  },
  computed: {
  },
};
</script>


<style scoped>
html{
  background: cornflowerblue;
}
svg {
  position: absolute;
  width: 200px;
  height: 200px;
  top: 50%;
  left: 50%;
}
svg circle{
  stroke-dasharray: 570;
  stroke-dashoffset: 0;
  animation: dash 20s linear;
}

@keyframes dash {
  0%{
    stroke-dashoffset: 320;
  }
  100% {
    stroke-dashoffset: 0;
  }
}
</style>