d:
cd D:\03-Git\artRepo\Article_v1.0\01-vue\article
npm run serve

cd /home/edward/03-git/edward-arti

npm run serve 

例子：
http://www.yeslass.com/index.asp

sass 和 less的安装
npm install -g sass
npm install -g less
建议采用sass 然后将sass转换成css。vue会直接转成css

node-nass 4.14.1 + sass-loader 10.1.1 can work

windows 下安装：
需要安装python2.7 , 设置好path之后，在path下面复制一个python.exe 改名字位 python2.exe
>npm install --global sass-loader node-sass 

#assets目录下存放第三方库

quill用于富文本输入


font-size 最小是12px，小于12px则需要采用transform:scale(0.3)实现

古往今来眼里只有钱的商人是没有长久的
商人第一位是信用
品牌

我们的命运没有把握在自己的手上，所以才会受人制约、任人宰割。
我们的命运在哪里？

没规矩的人，越聪明越危险。

#搭建
sudo apt install nodejs
sudo apt install npm

#vue 
#编译
npm run build
将编译好build下的文件拷贝到nodejs下的public即可
npm run serve


#nodejs Server
sudo apt-get install mysql-server
#初始密码为空
设置一个登录
update mysql.user set authentication_string=password('123456') where user='root' and Host ='localhost';

#安装数据库
mysql
> 拷贝 artlogin.sql 内容，贴上去即可。
#测试一下数据库是否争取
>use artpool
>show tables
  #这里有 arts 和 userLogin 两个表就正常

#Redis
sudo apt-get install redis-server
#初始不需要密码
#测试是否成功
redis-cli
set test test
#返回OK
  ##设置密码（如果设置的话，需要修改代码）
  #requirepass 123456
  ##重启
  #sudo service redis restart




# artpro
## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```
### Compiles and minifies for production
```
npm run build
```
### Lints and fixes files
```
npm run lint
```
### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

例子：http://www.yeslass.com/index.asp
