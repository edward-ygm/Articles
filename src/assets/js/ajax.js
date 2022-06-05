//封装常用的ajax函数
//封装websocket函数
//常用的js,jquery库
window.onload = function()
{
    var url = '/try/ajax/ajax_info.txt';
    var vm = new Vue({
        el:'#box',
        data:{
            msg:'Hello World!',
        },
        methods:{
            get:function(){
                //发送get请求
                this.$http.get(url).then(function(res){
                    document.write(res.body);
                },function(){
                    console.log('请求失败处理');
                });
            }
        }
    });
}

window.onload = function(){
    var vm = new Vue({
        el:'#box',
        data:{
            msg:'Hello World!',
        },
        methods:{
            post:function(){
                //发送 post 请求
                this.$http.post('/try/ajax/demo_test_post.php',{name:"菜鸟教程",url:"http://www.runoob.com"},{emulateJSON:true}).then(function(res){
                    document.write(res.body);    
                },function(res){
                    console.log(res.status);
                });
            }
        }
    });
}