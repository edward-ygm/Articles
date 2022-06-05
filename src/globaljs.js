/**作者：杨工明 Edward
 * 创建时间：2021-11-16
 * 版权：杨工明
 */
// var serverSrc='www.baidu.com';
// var token='12345678';
// var hasEnter=false;
// var userSite="中国钓鱼岛";

// var baseUrl="http://localhost:8090";
// var baseUrl="http://brft.dzpslt.com";
var baseUrl="http://www.dzpslt.com:8090";

var cfg={};/**和服务器设置一致 */
cfg['tokenExpireTime']=3600; 
cfg['reTokenExpireTime']=31536000;

var url = {
  'reToken':baseUrl+"/login/refreshToken",
  'uploadIcon':baseUrl+"/admin/upload/pic",
  'newArtId':baseUrl+"/data/newArtId",
  'artLoad':baseUrl+"/data/artLoad",/**上传文章 */
  'artList':baseUrl+"/data/artList",/**获取文章列表[{},{}] */
  'article':baseUrl+"/data/article",/**获取文章详细内容，可以是一组文章，返回格式[{},{}] */
  'getInfo':baseUrl+"/data/getInfo",/**获取用户信息 */
  'setInfo':baseUrl+"/data/setInfo",/**上传用户信息 */
  'artPicLoad':baseUrl+"/data/artPicLoad",/**上传用户图片 */
  // search
  'searchArt':baseUrl+"/data/searchArt",/**上传用户信息 */
};

/** 底部导航，功能按钮 BottomFunc组件及FuncTitle组件用到了*/
var partMap=[
        {'url':"/WenZhang",pageName:"文章"},
        {'url':"/AddNewArt",pageName:"新增文章"},
        {'url':"/FoLi",pageName:"日历"},
        {'url':"/ZiLiao",pageName:"我的"},
        // {'url':"/IconsExample",pageName:"例子svg"},
        // {'url':"/TestPage",pageName:"测试界面"},
      ];
var searchMap=[
  {'op':"newFirst",pageName:"修改时间降序"},
  {'op':"thumbUpFirst",pageName:"点赞降序"},
]
/** 文章 的子目录 关注（所关注的人产生的信息）、热榜、放生 素食 */
var wzMap=[
      {'url':"/",pageName:'关注',clicked:0,ntNum:12,id:1,},
      {'url':"/HotToday",pageName:"热榜",clicked:1,ntNum:12,id:2,},
      {'url':"/",pageName:"放生",clicked:0,ntNum:12,id:5,},
      {'url':"/",pageName:"素食",clicked:0,ntNum:12,id:6,},
      {'url':"/wz/ArtCompose",pageName:"编辑",clicked:0,ntNum:12,id:6,}
];

//用户的界面信息(用于构建用户独特的界面)
var uiInfo={};
uiInfo['wzMap'] = wzMap;
uiInfo["partMap"] = partMap;
uiInfo["searchMap"] = searchMap;
uiInfo["searchOp"] = "newFirst";
uiInfo["gcolor"] = gcolor;
uiInfo["loginName"]='';
uiInfo["loginData"] ={};/**确定是否login,如果没有userName，token+username+email+其他相关的信息 */
  uiInfo["loginData"]["status"] = "";/** L已经登录，N没有登录 */
  uiInfo["loginData"]["email"] = "";
  uiInfo["loginData"]["nickName"] = "";
  uiInfo["loginData"]["token"] = "";/**用户认证信息，普通用户不需要这个信息 */
  uiInfo["loginData"]["icon"] = "";/**用户的头像 */
  uiInfo["loginData"]["tm"] = "";/**更新token的时间 */


var servInfo={};
servInfo["url"]=['http://www.adi_tech.com'];
// servInfo["baseUrl"]='http://localhost:8090';
servInfo["baseUrl"]='http://www.dzpslt.com:8090';
servInfo["tokenPeriod"]=1800;/**token过期时间 */


var userInfo = {};

/**数据信息：主要数据来自axios获取*/
/*
{
title:'护生文2',
abstract:"<p >避苦求乐同,很多时候我们会忽略动物的生存权利，认为他们就是食物呀什么的。比如从小就灌输错误的想法，比如小鸡养来就是吃的。其实所有动物都是给吃的就高兴，惩罚就躲避，这些方面和人没有任何区别。</p>",
imgList:["icon2.png","icon3.png","icon4.png"],
userName:"刘德华",
userIcon:"ldh001.png",
userUrl:"/user/userName/mainpage", //用户的主页地址
artUrl:"/art/artID",//本片文章的地址,后台需要根据artID来寻找文章
comment:"133",//评论数量
ntNum:1,//通知数量（只有该用户才可以看见）
id:2,//这个等于artID
url:"#",
},
*/
var uData = {};
uData["artList"]=[
  {
    title:'护生文2',
    abstract:"<p >避苦求乐同,很多时候我们会忽略动物的生存权利，认为他们就是食物呀什么的。比如从小就灌输错误的想法，比如小鸡养来就是吃的。其实所有动物都是给吃的就高兴，惩罚就躲避，这些方面和人没有任何区别。</p>",
    imgList:["icon2.png","icon3.png","icon4.png"],
    userName:"刘德华",
    userIcon:"ldh001.png",
    userUrl:"/user/userName/mainpage", //用户的主页地址
    artUrl:"/art/artID",//本片文章的地址,后台需要根据artID来寻找文章
    comment:"133",//评论数量
    ntNum:1,//通知数量（只有该用户才可以看见）
    id:2,//这个等于artID
    url:"#",
    },
  ]


/**bootstrap的颜色定义 */
var gcolor={
  line:" #343a40",
  fill:" #6c757d",
  bg:"#eee",
  bs_blue:"#0d6efd",
  bs_indigo:" #6610f2",
  bs_purple:" #6f42c1",
  bs_pink:" #d63384",
  bs_red:" #dc3545",
  bs_orange:" #fd7e14",
  bs_yellow:" #ffc107",
  bs_green:" #198754",
  bs_teal:" #20c997",
  bs_cyan:" #0dcaf0",
  bs_white:" #fff",
  bs_gray:" #6c757d",
  bs_gray_dark:" #343a40",
  bs_gray_100:" #f8f9fa",
  bs_gray_200:" #e9ecef",
  bs_gray_300:" #dee2e6",
  bs_gray_400:" #ced4da",
  bs_gray_500:" #adb5bd",
  bs_gray_600:" #6c757d",
  bs_gray_700:" #495057",
  bs_gray_800:" #343a40",
  bs_gray_900:" #212529",
  bs_primary:" #0d6efd",
  bs_secondary:" #6c757d",
  bs_success:" #198754",
  bs_info:" #0dcaf0",
  bs_warning:" #ffc107",
  bs_danger:" #dc3545",
  bs_light:" #f8f9fa",
  bs_dark:" #212529",
  bs_body_font_family:" var(__bs_font_sans_serif)",
  bs_body_font_size:" 1rem",
  bs_body_font_weight:" 400",
  bs_body_line_height:" 1.5",
  bs_body_color:" #212529",
  bs_body_bg:"#fff",
}

/**这里需要存储---页面所有的数据（直接来自于后台）通过axios，渐次获取
 * 1、没有登录的用户，获取通用数据，常规的如服务器地址等信息
 * 2、已经登录的用户，获取通用数据，个人数据，及个人资料
 * 3、数据不允许实时更新，都需要某些条件下才允许触发信息更新
 * 4、所有的数据都可以备份到本地，用户可以选择只采用本地的数据。
 * 5、比较有用的本地的数据：日历数据，自己已经发表了的文章，课堂，笔记等等
 */

export default
{
    cfg,url,
    userInfo,//用户设置、用户的登录状态，用户的个人资料，用户的加密及安全
    servInfo,//服务器上的基本信息。用户地址，用户token，服务器地址等
    uiInfo,//用户的界面信息(用于构建用户独特的界面)
    uData,//用户所获取的网站数据信息
}