## 相关网站

- http://www.745w.com/

## 奇迹 muonline 数据库基础库分析

一、表的组成：

1. AccountCharacter 用来存放帐号的角色。

2. Character 用来存放每个角色的详细数据。

3. MEMB_INFO 帐号信息

4. MEMB_STAT 帐号状态

5. warehouse 仓库

6. VI_CURR_INFO 帐号费用

7. WEB_ZS PL 网站的转生数据

## 黑龙波攻速问题

法师最高能连放黑龙的速度是2854
不过要骑驴(角兽)或鸟(彩云兽)就可以了..
在不骑驴和鸟的情况下最高速是2854

## 套装值

```
5 普通套装 
9 体力+10的 普通套装
6 强化套装 
10 体力 +10的 强化套装
```

## 去除奇迹默认加密

```sql
-- 转换加密
DROP INDEX MEMB_INFO.pk_membpwd_index;
alter table MEMB_INFO
    drop column memb__pwd;
alter table MEMB_INFO
    add memb__pwd varchar(10) NOT NULL DEFAULT (0);

-- 然后修改 JoinServer/EGConfig.ini 中 UseMD5 = 0
```

## 用户注册

```sql
-- user register
insert into MEMB_INFO (memb___id, memb__pwd, memb_name, sno__numb, appl_days, modi_days, out__days, true_days,
                       mail_chek,
                       bloc_code,
                       ctl1_code, jf, partation, servercode, usedtime)
values ('test1', '123', 'name', '1111111111111', GETDATE(), GETDATE(), GETDATE(), GETDATE(), 0, 0, 0, 0, 0, 0, 0);
```

## 查看用户在线状态

```sql
-- 查看用户在线状态
-- 在线1, 下线 0
select ConnectStat
from MEMB_STAT
where memb___id = 'buuug7';
```

## 查询已存在的触发器

如果想查看触发器跟存储过程, 把 where 条件中的 `type = 'TR'` 去掉

```sql
select so.name, text
from sysobjects so,
     syscomments sc
where type = 'TR'
  and so.id = sc.id
  and text like '%TableName%'
```


## 支持积分SQL

运行如下存储过程

```sql

CREATE PROCEDURE UP_MEMB_INFO_Update_JF
    @memb___id varchar(10),
    @jf int
AS
UPDATE [MEMB_INFO] SET [jf] = @jf + [jf]
WHERE memb___id=@memb___id
GO


CREATE PROCEDURE DOWN_MEMB_INFO_Update_JF
    @memb___id varchar(10),
    @jf int
AS
UPDATE [MEMB_INFO] SET [jf] = [jf] - @jf
WHERE memb___id=@memb___id
GO
```

## 军衔任务SQL语句:执行如下数据库语句

```sql
use MuOnline
go
if not exists (select 1 from syscolumns where name = 'JxDw' and id = object_id('Character'))
	alter table Character
	add JxDw int DEFAULT (0)
go
if not exists (select 1 from syscolumns where name = 'JxPoint' and id = object_id('Character'))
	alter table Character
	add JxPoint int DEFAULT (0)
go
if not exists (select 1 from syscolumns where name = 'CquestMonsterCount1' and id = object_id('Character'))
	alter table Character
	add CquestMonsterCount1 int DEFAULT (0)
go
if not exists (select 1 from syscolumns where name = 'CquestMonsterCount2' and id = object_id('Character'))
	alter table Character
	add CquestMonsterCount2 int DEFAULT (0)
go
if not exists (select 1 from syscolumns where name = 'CquestMonsterCount3' and id = object_id('Character'))
	alter table Character
	add CquestMonsterCount3 int DEFAULT (0)
go
if not exists (select 1 from syscolumns where name = 'CquestPkCount' and id = object_id('Character'))
	alter table Character
	add CquestPkCount int DEFAULT (0)
go
if not exists (select 1 from syscolumns where name = 'CquestST' and id = object_id('Character'))
	alter table Character
	add CquestST int DEFAULT (0)
go


Update Character set JxPoint=0 where JxPoint is null
Update Character set JxDw=0 where JxDw is null
Update Character set CquestPkCount=0 where CquestPkCount is null
Update Character set CquestST=0 where CquestST is null
Update Character set CquestMonsterCount1=0 where CquestMonsterCount1 is null
Update Character set CquestMonsterCount2=0 where CquestMonsterCount2 is null
Update Character set CquestMonsterCount3=0 where CquestMonsterCount3 is null
```

## 修改 sqlserver 密码

```sql
exec sp_password null, '123456', 'sa'
```

## 1.03H 


```奇迹1.03H-荧光宝石属性、编号介绍（附NPC商店代码）
//大编号  小编号  物品等级  数量  技能  幸运  追加
12 102 0 255 0 0 0 //[荧光宝石(冰)]  +0*255 无幸运 追0【杀怪增加生命值+256】
12 102 1 255 0 0 0 //[荧光宝石(冰)]  +1*255 无幸运 追0【杀怪增加魔法值+680】
12 102 2 255 0 0 0 //[荧光宝石(冰)]  +2*255 无幸运 追0【技能攻击力+37】
12 102 3 255 0 0 0 //[荧光宝石(冰)]  +3*255 无幸运 追0【攻击成功率提升+25】
12 102 4 255 0 0 0 //[荧光宝石(冰)]  +4*255 无幸运 追0【物品耐久强化+30%】
12 103 0 255 0 0 0 //[荧光宝石(风)]  +0*255 无幸运 追0【生命值自动恢复+8】
12 103 1 255 0 0 0 //[荧光宝石(风)]  +1*255 无幸运 追0【最大生命值提升+4%】
12 103 2 255 0 0 0 //[荧光宝石(风)]  +2*255 无幸运 追0【最大魔法值提高+4%】
12 103 3 255 0 0 0 //[荧光宝石(风)]  +3*255 无幸运 追0【魔法值自动恢复+7】
12 103 4 255 0 0 0 //[荧光宝石(风)]  +4*255 无幸运 追0【最大AG提升+25】
12 103 5 255 0 0 0 //[荧光宝石(风)]  +5*255 无幸运 追0【AG值提升+3】
12 100 0 255 1 0 0 //[荧光宝石(火)]  +0*255 无幸运 追0【（每等级）攻击力/魔法攻击力提升+12】
12 100 1 255 1 0 0 //[荧光宝石(火)]  +1*255 无幸运 追0【攻击速度提升+7】
12 100 2 255 1 0 0 //[荧光宝石(火)]  +2*255 无幸运 追0【最大攻击力/魔法攻击力提升+30】
12 100 3 255 1 0 0 //[荧光宝石(火)]  +3*255 无幸运 追0【最小攻击力/魔法攻击力提升+20】
12 100 4 255 1 0 0 //[荧光宝石(火)]  +4*255 无幸运 追0【攻击力/魔法攻击力提升+20】
12 100 5 255 1 0 0 //[荧光宝石(火)]  +5*255 无幸运 追0【AG消耗量减少+40%】
12 104 0 255 1 0 0 //[荧光宝石(雷)]  +0*255 无幸运 追0【卓越一击攻击力提升+15】
12 104 1 255 1 0 0 //[荧光宝石(雷)]  +1*255 无幸运 追0【卓越一击概率提升+10%】
12 104 2 255 1 0 0 //[荧光宝石(雷)]  +2*255 无幸运 追0【幸运一击攻击力提升+30】
12 104 3 255 1 0 0 //[荧光宝石(雷)]  +3*255 无幸运 追0【幸运一击概率提升+8%】
12 101 0 255 1 0 0 //[荧光宝石(水)]  +0*255 无幸运 追0【防御成功率提升+10%】
12 101 1 255 1 0 0 //[荧光宝石(水)]  +1*255 无幸运 追0【防御率提升+30】
12 101 2 255 1 0 0 //[荧光宝石(水)]  +2*255 无幸运 追0【盾牌防御率提升+7%】
12 101 3 255 1 0 0 //[荧光宝石(水)]  +3*255 无幸运 追0【伤害减少+4%】
12 101 4 255 1 0 0 //[荧光宝石(水)]  +4*255 无幸运 追0【伤害反射+5%】
12 105 2 255 1 0 0 //[荧光宝石(土)]  +2*255 无幸运 追0【体力提升+30】
end
```

## 登录器 

```
还是从新编辑一下说明比较好 发现好多朋友都在问好多问题
1、登录器适合各种版本的奇迹客户端，只要客户端里的main.exe存在。
2、登录器原本就为局域网单机玩家和GM在测试服务器而设计。至于对“反外挂”这里
的说明是服务端开了反外挂无效。
3、登录器原理是借助main.exe和参数而制作的main.exe connect /u192.168.1.1 /p44405所以
天然绿色，玩过单击的应该都知道这项参数。

4、本人技术有限纯属做出来练习练习编程，同时也提供一些方便给其他人。
```