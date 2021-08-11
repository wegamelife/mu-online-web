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

## 去除奇迹默认加密

```sql
-- 转换加密
DROP INDEX MEMB_INFO.pk_membpwd_index;
alter table MEMB_INFO drop column memb__pwd;
alter table MEMB_INFO add memb__pwd varchar(10) NOT NULL DEFAULT (0);

-- 然后修改 JoinServer/KGConfig.ini 中 UseMD5 = 0
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
select ConnectStat from MEMB_STAT where memb___id = 'buuug7';
```
