#######################################################
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
############################################################
#部署
############################################################
1、解压缩zip文件
2、到article目录，运行
npm install
#即使出现一些小问题，也没有关系
3、生成vue
npm run build
4、拷贝dist到webServer 目录
cp -R dist /path/to/webServer/
5、运行 webServer
cd /path/to/webServer/
node server_srv.js &
6、正常退出登录界面。（异常退出可能会删除node程序)
exit


echo "# Articles" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/edward-ygm/Articles.git
git push -u origin main