// 路由配置
/** 这个是路由配置的独立文件 */
// 文章的主界面
import Home from "./pages/Home.vue";
// 今日热点主界面
import HotToday from "./pages/HotToday.vue";
//供佛主界面
import GongFo from "./pages/GongFo.vue";
import FoLi from "./pages/FoLi.vue";
import Class from "./pages/Class.vue";
import WenZhang from "./pages/WenZhang.vue";
import WenDa from "./pages/WenDa.vue";
import TongZhi from "./pages/TongZhi.vue";
import ZiLiao from "./pages/ZiLiao.vue";
import IconsExample from "./components/basic/IconsExample.vue"

/**其他测试小模块 */
import TestPage from "./pages/testPage/TestPage.vue";
import TestSVG from "./components/svg/SvgBtns.vue";

import LabelItem from "./components/basic/LabelItem.vue";
// import ArtSimple from "./components/ArtSimple.vue";
import ArtDetails from "./components/ArtDetails.vue";
import TopSubFunc from "./components/TopSubFunc.vue";
import LifeSave from "./pages/LifeSave.vue";
import Vegen from "./pages/Vegen.vue";
import Focus from "./pages/Focus.vue";

import TopFunc from "./components/TopFunc.vue";
import ArtCompose from "./pages/ArtCompose.vue";
import Login from "./pages/Login.vue";
import Signup from "./pages/Signup.vue";
import RecovePw from "./pages/RecovePw.vue";
import articleList from "./pages/myDoc/articleList.vue";
import draftList from "./pages/myDoc/draftList.vue";
import myDoc from "./pages/myDoc/myDoc.vue";
import myStatistic from "./pages/myDoc/myStatistic.vue";
import testFunc from "./pages/myDoc/testFunc.vue";
// import ArtView from "./pages/ArtCompose.vue";

export default{
  routes:[
    /**主界面的导览行 */
    {path:'/GongFo',component:GongFo},/** 供佛界面 */
    {path:'/Class',component:Class},/** 学堂 */
    {path:'/AddNewArt',component:ArtCompose},/** 学堂 */
    {path:'/FoLi',component:FoLi},/** 藏历和农历界面*/
    {path:'/WenZhang',component:WenZhang},/** 文章的界面*/
    {path:'/WenDa',component:WenDa},/** 问答界面*/
    {path:'/TongZhi',component:TongZhi},/** 通知消息界面 */
    {path:'/ZiLiao',component:ZiLiao,children:[
          {path:'articleList',component:articleList},
          {path:'draftList',component:draftList},
          {path:'myDoc',component:myDoc},
          {path:'myStatistic',component:myStatistic},
          {path:'newDraft',component:ArtCompose},
          {path:'testFunc',component:testFunc},
          {path:'',component:myDoc},/**这个是缺省的路由，/ZiLiao会直接进入到这个路由 */
        ]},/** 我的资料修改界面 */
    {path:'/IconsExample',component:IconsExample},/** 当前收录的SVG的例子*/
    {path:'/home',component:Home},/**待定--主界面 */
    {path:'/home',component:Home},/** */
    {path:'/home',component:Home},/** */
    /** 文章子目录 */
    {path:'/HotToday',component:HotToday},/** 热榜 */
    {path:'/LifeSave',component:LifeSave},/** 放生 */
    {path:'/Vegen',component:Vegen},/** 素食 */
    {path:'/Focus',component:Focus},/** 素食 */
    /** 其他子路由 */
    {path:'/LabelItem',component:LabelItem},/** */
    // {path:'/ArtSimple',component:ArtSimple},/** */
    {path:'/ArtDetails',component:ArtDetails},/** */
    {path:'/TopFunc',component:TopFunc},/** */
    {path:'/TopSubFunc',component:TopSubFunc},/** */
    {path:'/wz/ArtCompose',component:ArtCompose},/** 文章编辑界面*/
    {path:'/login',component:Login},/** 登录 */
    {path:'/signup',component:Signup},/** 注册 */
    {path:'/RecovePw',component:RecovePw},/** 恢复密码 */
    {path:'/ArtView',component:ArtCompose},/** */
    {path:'/home',component:Home},/** */

    {path:'/TestPage',component:TestPage},/** */
    {path:'/TestSVG',component:TestSVG},/** */

    /** router-view 带名字区分 <router-view name='left'></router-view>会选择left对应的TopSubFunc */
    {path:'/home',component:{
      default:ArtCompose,
      left:TopSubFunc,
    }},/** */

    {path:'*',redirect:'/WenZhang'},/**重定向 */
  ]
}
