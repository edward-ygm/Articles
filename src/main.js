import Vue from 'vue'
/**引入主模块 */
// import App from './App.vue'
import App from './App.vue'

//引用全局变量
import global_ from './globaljs.js';
//挂载到Vue实例上面
Vue.prototype.g = global_;

/**引入路由配置 */
import VueRouter from 'vue-router';
import routerCfg from './routerCfg';/**vue路由配置 */
import util from './util.js';/**常用的函数 */
import "babel-polyfill";/**不知道干啥的模块，避免出现无法使用await函数的情况 */

var echarts=require("echarts") //引入eCharts 文件
Vue.prototype.$echarts = echarts ;

/** 引入Jquery */
window.$ = window.jQuery = require('jquery');

/**引入模块 */

/**使用路由 */
Vue.use(VueRouter);
// Vue.use(axios);

/**引入其他样式 */
// Vue.use(ElementUI);/**采用ElementUI 样式 */
// Vue.use(bootstrap);/**bootStrap 和 ElementUI会有全局变量的冲突。采用bootstrap 样式 */
// Vue.use(bootstrapjs);/**采用bootstrap 样式 */
// Vue.use(adiStyle);/**自定义 -- 最好不用了，会出问题。。。 */
// Vue.use($);
// Vue.use(echarts);
/**使用基础函数 */
Vue.use(util);
/** */


/**生成路由实例 */ 
var router = new VueRouter(routerCfg);

// Vue.prototype.changeData = function ()
// {//changeData是函数名
//   alert('执行成功');
// }

//挂载到vue对象
new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
