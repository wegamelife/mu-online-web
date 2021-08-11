

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