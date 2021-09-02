-- 1.删除ExtWareHouse扩展仓库表执行如下新仓库表
CREATE TABLE [ExtWareHouse]
(
    [AccountID]  [varchar](10) COLLATE Chinese_PRC_CI_AS NOT NULL,
    [Number]     [int]                                   NOT NULL,
    [Items]      [varbinary](1920)                       NULL,
    [Money]      [int]                                   NOT NULL,
    [EndUseDate] [smalldatetime]                         NULL,
    [DbVersion]  [tinyint]                               NULL,
    [pw]         [smallint]                              NULL
) ON [PRIMARY]
GO


-- 2.删除warehouse仓库表执行如下新仓库表
CREATE TABLE [warehouse]
(
    [AccountID]  [varchar](10) COLLATE Chinese_PRC_CI_AS NOT NULL,
    [Items]      [varbinary](1920)                       NULL,
    [Money]      [int]                                   NULL,
    [EndUseDate] [smalldatetime]                         NULL,
    [DbVersion]  [tinyint]                               NULL,
    [pw]         [smallint]                              NULL
        CONSTRAINT [DF_warehouse_pw] DEFAULT (0),
    [lastpw]     [smallint]                              NOT NULL
        CONSTRAINT [DF_warehouse_lastpw] DEFAULT (0),
    [ExtCKNum]   [int]                                   NOT NULL
        CONSTRAINT [DF_warehouse_ExtCKNum] DEFAULT (0),
    [NeedExtCK]  [int]                                   NOT NULL
        CONSTRAINT [DF_warehouse_NeedExtCK] DEFAULT (0),
    CONSTRAINT [PK_warehouse] PRIMARY KEY CLUSTERED
        (
         [AccountID]
            ) ON [PRIMARY]
) ON [PRIMARY]
GO



CREATE proc WHS_INSERT @Accountid varchar(10)
as
    set nocount on

INSERT INTO warehouse (AccountID, Items, Money, EndUseDate, DbVersion)
VALUES ( @accountid, cast(REPLICATE(char(0xff), 1920) as varbinary(1920))
       , 0, getdate(), 3)
    set nocount off

GO



CREATE proc WHS_SELECT @op int,
                       @Accountid varchar(10)
as
    set nocount on
declare
    @aid     varchar(10)
    , @cknum int
    if @op = 1
        begin
            --读取ID,检查仓库是否存在
            SELECT @aid = AccountID, @cknum = NeedExtCK FROM warehouse WHERE AccountID = @accountid
            if @cknum is null
                begin
                    --打开主仓库
                    INSERT INTO warehouse (AccountID, Items, Money, EndUseDate, DbVersion)
                    VALUES ( @accountid, cast(REPLICATE(char(0xff), 1920) as varbinary(1920))
                           , 0, getdate(), 3)
                    Select @accountid AS AccountID
                end
            else
                begin
                    Update warehouse Set ExtCKNum=NeedExtCK WHERE AccountID = @accountid
                    if @cknum = 0
                        Select @aid AS AccountID
                    else
                        begin
                            if not EXISTS(select AccountID
                                          FROM ExtWareHouse
                                          WHERE AccountID = @accountid and Number = @cknum)
                                begin
                                    INSERT INTO ExtWarehouse (AccountID, Number, Items, Money, EndUseDate, DbVersion)
                                    VALUES ( @accountid, @cknum, cast(REPLICATE(char(0xff), 1920) as varbinary(1920))
                                           , 0, getdate(), 3)
                                end
                            Select @accountid AS AccountID
                        end
                end
        end
    else
        if @op = 2
            begin
                SELECT @cknum = ExtCKNum FROM warehouse WHERE AccountID = @accountid
                if @cknum = 0
                    SELECT Items from warehouse where AccountID = @accountid
                else
                    SELECT Items from ExtWareHouse WHERE AccountID = @Accountid AND Number = @cknum
            end
        else
            begin
                SELECT @cknum = ExtCKNum FROM warehouse WHERE AccountID = @accountid
                if @cknum = 0
                    SELECT Money, DbVersion, pw from warehouse where AccountID = @accountid
                else
                    SELECT Money, DbVersion, pw from ExtWareHouse where AccountID = @accountid AND Number = @cknum
            end
    set nocount off
GO


CREATE proc WHS_UPD_Items @items varchar(3840),
                          @Accountid varchar(10)
as
    set nocount on
declare @cknum int
SELECT @cknum = ExtCKNum
FROM warehouse
WHERE AccountID = @accountid
    if @cknum = 0 --主仓库
        UPDATE warehouse
        set Items=cast(@items as varbinary(1920))
        where AccountID = @accountid
    else
        UPDATE ExtWareHouse
        set Items=cast(@items as varbinary(1920))
        where AccountID = @accountid
          AND Number = @cknum
--waitfor delay '00:00:10'
    set nocount off
GO



CREATE proc WHS_UPD_MnyPwDbv @mny int,
                             @pw int,
                             @dbv int,
                             @Accountid varchar(10)
as
    set nocount on
declare @cknum int
SELECT @cknum = ExtCKNum
FROM warehouse
WHERE AccountID = @accountid
    if @cknum = 0
        begin
            --主仓库
            if @pw = 0
                UPDATE warehouse
                set Money=@mny,
                    pw=@pw,
                    DbVersion=@dbv
                where AccountID = @accountid
            else
                UPDATE warehouse
                set Money=@mny,
                    pw=@pw,
                    lastpw=@pw,
                    DbVersion=@dbv
                where AccountID = @accountid
            UPDATE ExtWareHouse set pw=@pw where AccountID = @accountid
        end
    else
        begin
            UPDATE ExtWareHouse
            set Money=@mny,
                pw=@pw,
                DbVersion=@dbv
            where AccountID = @accountid
              AND Number = @cknum
            UPDATE ExtWareHouse set pw=@pw where AccountID = @accountid
            if @pw = 0
                UPDATE WareHouse set pw=@pw where AccountID = @accountid
            else
                UPDATE WareHouse set pw=@pw, lastpw=@pw where AccountID = @accountid
        end
--waitfor delay '00:00:10'
    set nocount off

GO



CREATE proc WHS_UPD_Money @mny int,
                          @Accountid varchar(10)
as
    set nocount on
declare @cknum int
SELECT @cknum = ExtCKNum
FROM warehouse
WHERE AccountID = @accountid
    if @cknum = 0 --主仓库
        UPDATE warehouse
        set Money=@mny
        where AccountID = @accountid
    else
        UPDATE ExtWareHouse
        set Money=@mny
        where AccountID = @accountid
          AND Number = @cknum
--waitfor delay '00:00:10'
    set nocount off

GO
