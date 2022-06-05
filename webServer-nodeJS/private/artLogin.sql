
DROP DATABASE  IF EXISTS `artpool`;
CREATE DATABASE  IF NOT EXISTS `artpool`;
USE `artpool`;

-- --------------------------------------------------------
-- -Install basic information of the userInfo
-- --------------------------------------------------------
drop table if exists `userLogin`;
CREATE TABLE userLogin
(
  `guid` VARCHAR(64) , -- the unique overall ID
  email VARCHAR(64) not null unique,-- Email is the login Name
  nickName VARCHAR(64), -- this is the display nicle name
  `status` VARCHAR(5) default "yes" , -- 'D'：deleted； 'N':normal
  icons MediumBlob , -- 存储用户的头像，如果用户没有上传头像，缺省采用svg图像。
  -- 权限及显示
  gName VARCHAR(32) default "", -- group  Name, 用id肯定会快一些，但直接用goup名字可以少查一张表。
  rankVal VARCHAR(3) default "" , -- 认证的级别，文章只看好坏，不看积分。
  followed INT default 0, -- 追随， 的数量
  dislike INT default 0, -- 厌恶，的数量
  favorate INT default 0, -- 好感，的数量
  rBirth INT default 0, -- 生日，数据库内所有时间都是int型
  gender VARCHAR(1), -- 'm': 男 'f': 女
  -- 登录时使用
   -- 用户名密码的方式登录。 界面js对用户名和密码做sha-128 hash
  -- 这里只记录128位（16字节）salt 及哈希的结果
  salt VARCHAR(64) default "",-- 随机生成
  pw  VARCHAR(128), --  (salt+password)<sha-256><base64> 的结果。
  createtm INT, -- 创建的时间
  -- 附加信息
  rName VARCHAR(64), -- 真实名字
  mailAddr VARCHAR(256), -- 邮寄地址
  interest VARCHAR(32), -- 兴趣
  export VARCHAR(32), -- 专项技能
  job VARCHAR(32), -- 工作单位
  jobRole VARCHAR(32), -- 职位
  citizenId VARCHAR(32),
  driveLicense VARCHAR(32),
  phoneNumber VARCHAR(16),
  primary key(`email`),
  unique key (`email`),
  index(`guid`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------
-- 登录信息，登录方式有多种，所以单独列出一张表 basic information of the userInfo
-- 只要下表有信息，都默认允许登录
-- --------------------------------------------------------

-- insert into userLogin(guid,email,pw) values(0,'1904400439@qq.com','ddd');
-- insert into userLogin(guid,email,pw) values(1,'admin','ddd');

-- --------------------------------------------------------------------
-- 登录及操作记录表（现在只记录登录情况）
-- --------------------------------------------------------
drop table if exists `userHist`;
CREATE TABLE `userHist`
(
  guid VARCHAR(64) , -- the unique overall ID  允许 guid登录
  email VARCHAR(64),-- Email is the login Name  也允许 email登录

  logs VARCHAR(256), -- log的信息，什么信息都可以填，由调用者自己定义
  tm INT, -- 发生的时间 time stamp


  primary key(`guid`),
  unique key (`guid`),
  index(`email`),
  index(`tm`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- --------------------------------------------------------------------
-- 用户组及权限，
-- admin组默认位超级用户组，没有任何限制
-- 普通组，默认分两个组：管理组及非管理组,管理组以-admin结尾，可以增删改用户。非管理组则只可以增删改自己的文章和信息
-- right控制该组的界面等，可以自定义。
-- admin right="{all:RW}"
-- common right="{all:Y,GongFo:N}"
-- group1 right="{all:N,GongFo:R}" --只允许供佛
-- 
-- --------------------------------------------------------
drop table if exists `gRight`;
CREATE TABLE `gRight`
(
  gName VARCHAR(32), -- 用户组名
   -- UI界面及后端的权限定义。 "R"表示可读,W可写,all表示所有权限
  `right` VARCHAR(128) DEFAULT "{all:RW,home:R,GongFo:RW}",

  primary key(`gName`),
  unique key (`gName`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------------------
-- 用户组及权限，
-- 
-- --------------------------------------------------------
drop table if exists `groups`;
CREATE TABLE `groups`
(
  guid VARCHAR(64) not null, -- the unique overall ID
  email VARCHAR(64),-- Email is the login Name
  gName VARCHAR(32), -- 用户组名
  

  primary key(`guid`),
  unique key (`guid`),
  index(`email`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
-- --------------------------------------------------------
-- --------------------------------------------------------
-- --------------------------------------------------------
-- --------------------------------------------------------


-- --------------------------------------------------------
-- -articles' Database --
-- --------------------------------------------------------
drop table if exists `arts`;
CREATE TABLE `arts`
(
  `artID` BIGINT not null AUTO_INCREMENT, -- 文章的唯一标识(tmSeconds+'#'+random(3))
  `guid` VARCHAR(64) , -- 文章作者的Guid，the unique overall ID 
  `email` VARCHAR(64) not null, -- 文章作者的Guid，the unique overall ID 
  `nickName` VARCHAR(64), -- 文章作者的昵称
  `title` VARCHAR(128),  -- 文章的标题 -- 用于后续的分类
  `abstract` VARCHAR(256), -- 文章的摘要 -- 用于后续分类
  `content`  LONGBLOB,  -- 长长的blog类型，最大4G
  `text`  LONGBLOB,  -- 文章的文字信息 16M足够了，都改成最大
  `imgList` LONGBLOB, -- 页面展示时的文章的图片（详细信息）
  `name` VARCHAR(128), -- 文章的名字( 不包括默认的后缀，.art --可以不需要 )
  `up` INT default 0, -- 点赞， thumbUP的数量
  `down` INT default 0, -- 不赞同， thumbDown的数量
  `ctime` INT default 0, -- 创建日期
  `mtime` INT default 0, -- 最新更新日期
  `status` VARCHAR(3), -- 'N'正常文章 'D' 草稿 'P' 发布（publish)

  primary key(`artID`),
  unique key (`artID`),
  index(`guid`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- insert into userInfo(guid,email,nickName,status) values(1,'user1@adi.com','user1','N');
-- insert into userInfo(guid,email,nickName,status) values(2,'user2@adi.com','user2','N');
-- insert into userInfo(guid,email,nickName,status) values(3,'user3@adi.com','user3','N');

-- --------------------------------------
-- 

drop table if exists `test`;
CREATE TABLE `test`
(
  `a` VARCHAR(256), -- 文章的摘要 -- 用于后续分类
  `b`  LONGBLOB  -- 长长的blog类型，最大4G
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- --------------------------------------------------------------------
-- prsa的数据结构
-- --------------------------------------------------------

drop table if exists rsapool;
CREATE TABLE rsapool
(
  `keyHash` BIGINT, -- 
  `length` INT, -- - bit length
  `guid` BIGINT,
  `subkey` INT,
  `privateKey` MEDIUMBLOB,
  `pubKey` MEDIUMBLOB, -- - directly get the Public-key
  index (`keyHash`,`length`),
  index (`guid`,`subkey`),
  PRIMARY KEY (`keyHash`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP DATABASE  IF EXISTS `pkc`;
CREATE DATABASE  IF NOT EXISTS `pkc`;
USE `pkc`;
-- --------------------------------------------------------
-- -Install basic information of the GUID
-- --------------------------------------------------------
DROP TABLE IF EXISTS `GUID`;
CREATE TABLE `GUID`
(
  `guid` BIGINT NOT NULL,
  `internetCredit` VARCHAR(10),
  `userType` TINYINT,
  `userStatus` VARCHAR(3),
  PRIMARY KEY (`guid`),
  unique key (`guid`),
  index(`userStatus`),
  index(`internetCredit`),
  index(`guid`,`userStatus`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------
-- Typically, people want the public key together with basic information.
-- --------------------------------------------------------
drop table if exists GUIDPub;
CREATE TABLE `GUIDPub`
(
  `guid` BIGINT not null,
  `extendId` SMALLINT, -- One can have many key pairs.
  `internetCredit` VARCHAR(10),  -- CREDIT. AAA,AAA+++++,A,B,C,C--
  `userType` TINYINT,  -- COMPANY OR USERS
  `userStatus` VARCHAR(3), -- the status of this user
  `keystatus` VARCHAR(3), -- the status of this public key
  `officialDomainName` VARCHAR(64), -- personal user: short ID; company user: officialDomainName
  `pubKey` MEDIUMBLOB,  -- directly get the Public-key
  `N`  MEDIUMBLOB, -- directly get the Public-key
  `keyHash` BIGINT, -- 
  PRIMARY KEY (`guid`,`extendId`),-- index by. guid + extendId and N and index by pubKeyHash.
  unique key (`guid`),
  index (`keyHash`)
  -- UNIQUE(`guid`,`extendId`) 
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------
-- - private key. This will be deleted from the database, and using the guid+extendId ad a file name
-- - this key will be not be seen after it is deleted. 
-- --------------------------------------------------------
drop table if exists GUIDprivate;
CREATE TABLE GUIDprivate
(
  guid BIGINT not null,
  extendId SMALLINT,
  privateKey MEDIUMBLOB,
  pubKey MEDIUMBLOB, -- - directly get the Public-key
  n MEDIUMBLOB, -- -
  p MEDIUMBLOB,
  q MEDIUMBLOB,
  length INT, -- - bit length
  decodePwd VARCHAR(16), -- - this key use to decode the public and private key file.
  `keyHash` BIGINT, -- 
  PRIMARY KEY (`guid`,`extendId`),-- index by. guid + extendId and N and index by pubKeyHash.
  unique key (`guid`),
  index (`keyHash`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- expanded database for the GUID
drop table if exists `loginInformation`;
CREATE TABLE `loginInformation`
(
  guid BIGINT not null,
  email VARCHAR(64),
  nicleName VARCHAR(64),
  birthday INT,
  primary key(`guid`),
  unique key (`guid`),
  index(`email`),
  index(`nicleName`),
  index(`email`,`nicleName`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

drop table if exists `personalInformation`;
CREATE TABLE personalInformation
(
  guid BIGINT not null,
  realName VARCHAR(64),
  realBirthday INT,
  marriage SMALLINT,
  gender SMALLINT,
  matherLand VARCHAR(64),
  interestField VARCHAR(32),
  exportField VARCHAR(32),
  jobType VARCHAR(32),
  currentTile VARCHAR(32),
  primary key(`guid`),
  unique key (`guid`),
  index(`realName`),
  index(`interestField`),
  index(`exportField`),
  index(`interestField`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

drop table if exists `financeInformaion`;
CREATE TABLE financeInformaion
(
  guid BIGINT not null,
  bankAccount VARCHAR(64),
  bankName VARCHAR(64),
  bankType VARCHAR(4),
  bankCredit int, 
  location VARCHAR(120),
  citizenId VARCHAR(32),
  driveLicense VARCHAR(32),
  phoneNumber VARCHAR(16),
  
  primary key(`guid`),
  unique key (`guid`),
  index(`citizenId`),
  index(`driveLicense`),
  index(`phoneNumber`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------
-- GUID purchase records
-- --------------------------------------------------------
drop table if exists `purchaseHistory`;
CREATE TABLE purchaseHistory
(
  email VARCHAR(64) not null,
  ptime int,
  memo VARCHAR(128),
  price float,
  type varchar(4), -- 'guid','ext','svc','tc'(tao chan)
  val BIGINT not null,
  
  primary key(`email`),
  index(`email`,`ptime`),
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*
CREATE TABLE pub.companyInformation
(
  guid BIGINT not null,
  email VARCHAR(64),
  headquater VARCHAR(64),
  industry VARCHAR(32),
  regNumber VARCHAR(64),
  business  VARCHAR(256),
  --- TO BE DEFINE ---
  regitsterName VARCHAR(32),
  registerDate DATETIME2,
  registerCountry VARCHAR(3)
  registerVolume FLOAT,
  reputation VARCHAR(12),
  historyEventId INT,
  ---
);
----------------------------------------------------------
--- this will be defined by finding the deviced
----------------------------------------------------------
CREATE TABLE pub.deviceId
(
  guid BIGINT not null,
  extendId INT not null,
  deviceId BIGINT not null,  --hash value for this device 
  deviceStatus INT,
  cpuSeries VARCHAR(20),
  venderSeries VARCHAR(20)
  chaseGuid BIGINT,
  chaseExtendId INT,
);

----------------------------------------------------------
--- For online wallet, online payment
----------------------------------------------------------
CREATE TABLE pay.holdings
(
  guid BIGINT not null,
  currency  VARCHAR(3),
  total FLOAT,
  pending FLOAT,
);
CREATE TABLE pay.permission
(
  guid BIGINT not null,
  extendId INT not null,
  permission VARCHAR(3), --- RCV(RECEIVE ONLY) FUL(FULL PERMISSION)
);
CREATE TABLE pay.transactions
(
  guid BIGINT not null,
  extendId INT not null,
  transactionId BIGINT not null, --- 
  versionId INT default (1) , ---  record any modification of the transactions.
  
  date datetime2 not null,
  operator VARCHAR(3), -- 'RCV': RECEIVE, 'SND': SEND TO
  targetGuid BIGINT not null, --- if it is refilled from check, the targetGuid will be payment companys guid.
  volume FLOAT,
  currency VARCHAR(3),
  bankAccount VARCHAR(64),
  userRemarks VARCHAR(120),
  activityType VARCHAR(32), --- What kind of activities, loan payment? user share? perchase? utilities? rent? and so on.
);

----------------------------------------------------------
--- database for the generate and create the private-key
--- which is stored in different database
----------------------------------------------------------
CREATE TABLE pri.PubPrivateKey
(
  keyIndex BIGINT, --- this is a hash (hard coded method of hash) of N 
  keyLength INT, --- bit length
  N BLOB, ---
  privateKey BLOB
  pubKey BLOB, --- directly get the Public-key
  --- index by keyIndex and keyLength
);
*/
