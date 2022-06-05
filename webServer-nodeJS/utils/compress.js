/** 压缩，zip。是对JSzip的封装 */
var fs=require('fs');
var JSzip = require('jszip');

/** path是当前 目录； hfile是对文件的处理函数，hfolder是对目录的处理函数，zipObj是全局变量，比如zip */
function readDir(path,zipObj,handleF,handleDir){

    let fdir = fs.statSync(path);
    let tname= path.split("/");
    tname = tname[tname.length-1];

    if(fdir.isDirectory()){
        
        /** 当前目录的总处理 */
        // let nObj=zipObj.folder(tname);
        let nObj = handleDir(zipObj,tname);

        let subf = fs.readdirSync(path);
        /**对目录下的项目进一步处理 */
        subf.forEach(function(fname,index){
            let ff = path + '/' + fname;
            let file = fs.statSync(ff);
            if (file.isDirectory()) {
                /**进入下层循环 */
                readDir(ff,nObj,handleF,handleDir);
            }else{
                readDir(ff,nObj,handleF,handleDir);/**由下层处理文件 */
            }
        });
    }else{/**如果是文件，则直接执行hfile处理 */
        // zipObj.file(tname,fs.readFileSync(path));
        handleF(zipObj,path,tname);
    }
}
/** */

/**压缩 zpath 可以是目录 */
var zip = function(zpath,zname){
    var zipObj = new JSzip();
    /**将所有的子目录读取到zipObj中
     * 文件：zipObj.file("fname",fs.readFileSync(zpath));
     * 目录：zipObj.folder("fold1").file("xx1","xding").file("sfing",'xi');
     */
    var f=function(tobj,path,tname){
        return tobj.file(tname,fs.readFileSync(path));
    };
    var d=function(tobj,tname){
        return tobj.folder(tname);
    };
    readDir(zpath,zipObj,f,d );

    /**将整个文件读写成为一个zip文件 */
    zipObj.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 9,
      },
    })
    .then(function (content) {
      fs.writeFileSync(zname, content);
      console.log("压缩结果为："+zname);
    });
}

 /**解压缩 zname 是zip文件名，uzname是目标名 */
 var uzip=function(zname,uzname){
    JSzip.loadAsync(fs.readFileSync(zname))
    .then(function(zip){ /**zip就是 JSzip的返回值files */
        let files = zip.files;
        saveZipFiles(uzname,files);
        console.log('解压缩到：'+zname);
    },function(e){
        e.message;
    })
 }
 function saveZipFiles(savePath,files) {
    try {
      for (const filename of Object.keys(files)) {
        const dest =savePath + "/" + filename ;
        // 如果该文件为目录需先创建文件夹
        if (files[filename].dir ){
            fs.mkdirSync(dest, {recursive: true });
        } else {
          // 把每个文件buffer写到硬盘中 
          files[filename].async('nodebuffer') /**现在我还不知道这个nodebuffer是什么，不过这个works */
            .then(content => fs.writeFileSync(dest, content));
        }
      }
    } catch (error) {
      console.error('save zip files encountered error!', error.message);
      return error;
    }
  }

 var examples=(dataPath)=>{
     /** */
     zip(dataPath,dataPath+'/axx.zip');
     /** 这个需要选用一个已经生成的zip文件 */
     uzip(dataPath+'/axx.zip',dataPath+'/res');
     console.log("测试zip");
 }

 module.exports = {
    zip: zip,
    uzip: uzip,
    examples: examples,/** 默认输出一个test 函数，用于提供基本用法的例子 */
};