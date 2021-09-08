
-- 旧的存储过程备份
-- 用来给新建用户设置初始属性等
-- auto-generated definition
CREATE Procedure dbo.WZ_CreateCharacter
    @AccountID varchar(10),
    @Name varchar(10),
    @Class tinyint
AS
Begin

    SET NOCOUNT ON
    SET XACT_ABORT ON
    DECLARE @Result tinyint
    DECLARE @FASHI int
    DECLARE @ZHANSHI int
    DECLARE @JINGLING int
    DECLARE @MOJIAN int
    DECLARE @SHENGDAO int
    DECLARE @ZHAOHUAN int
    DECLARE @BORNMONEY int
    DECLARE @SHENGDAOTS int

    SET @Result = 0x00
    SET @FASHI= 0 -- 法师出生点数
    SET @ZHANSHI= 0 -- 战士出生点数
    SET @JINGLING= 0 -- 精灵出生点数
    SET @MOJIAN= 0 -- 魔剑出生点数
    SET @SHENGDAO= 0 -- 圣导出生点数
    SET @ZHAOHUAN= 0 -- 召唤出生点数
    SET @BORNMONEY= 100000000 -- 出生送的钱
    SET @SHENGDAOTS = 9999 --圣导出生统率

    If EXISTS ( SELECT Name FROM Character WHERE Name = @Name )
        begin
            SET @Result = 0x01
            GOTO ProcEnd
        end

    BEGIN TRAN

        If NOT EXISTS ( SELECT Id FROM AccountCharacter WHERE Id = @AccountID )
            begin
                INSERT INTO dbo.AccountCharacter(Id, GameID1, GameID2, GameID3, GameID4, GameID5, GameIDC)
                VALUES(@AccountID, @Name, NULL, NULL, NULL, NULL, NULL)


                SET @Result = @@Error
            end
        else
            begin
                Declare @g1 varchar(10), @g2 varchar(10), @g3 varchar(10), @g4 varchar(10), @g5 varchar(10)
                SELECT @g1=GameID1, @g2=GameID2, @g3=GameID3, @g4=GameID4, @g5=GameID5 FROM dbo.AccountCharacter Where Id = @AccountID
                if( ( @g1 Is NULL) OR (Len(@g1) = 0))

                    begin
                        UPDATE AccountCharacter SET GameID1 = @Name
                        WHERE Id = @AccountID

                        SET @Result = @@Error
                    end
                else if( @g2 Is NULL OR Len(@g2) = 0)
                    begin
                        UPDATE AccountCharacter SET GameID2 = @Name
                        WHERE Id = @AccountID

                        SET @Result = @@Error
                    end
                else if( @g3 Is NULL OR Len(@g3) = 0)
                    begin
                        UPDATE AccountCharacter SET GameID3 = @Name
                        WHERE Id = @AccountID

                        SET @Result = @@Error
                    end
                else if( @g4 Is NULL OR Len(@g4) = 0)
                    begin
                        UPDATE AccountCharacter SET GameID4 = @Name
                        WHERE Id = @AccountID

                        SET @Result = @@Error
                    end
                else if( @g5 Is NULL OR Len(@g5) = 0)
                    begin
                        UPDATE AccountCharacter SET GameID5 = @Name
                        WHERE Id = @AccountID

                        SET @Result = @@Error
                    end
                else
                    begin
                        SET @Result = 0x03
                        GOTO TranProcEnd
                    end
            end

        if( @Result <> 0 )
            begin
                GOTO TranProcEnd
            end
        else
            begin
                DECLARE @UPPOINT int
                if(@Class=0)
                    begin
                        SET @UPPOINT = @FASHI
                    end
                else if(@Class=16)
                    begin
                        SET @UPPOINT = @ZHANSHI
                    end
                else if(@Class=32)
                    begin
                        SET @UPPOINT = @JINGLING
                    end
                else if(@Class=48)
                    begin
                        SET @UPPOINT = @MOJIAN
                    end
                else if(@Class=64)
                    begin
                        SET @UPPOINT = @SHENGDAO
                    end
                else
                    begin
                        SET @UPPOINT = @ZHAOHUAN
                    end

                INSERT INTO dbo.Character(AccountID, Name, cLevel, LevelUpPoint, Class, Strength, Dexterity, Vitality, Energy, Inventory,MagicList, Life, MaxLife, Mana, MaxMana, MapNumber, MapPosX, MapPosY, MDate, LDate, Quest, DbVersion, Leadership,money )
                SELECT @AccountID As AccountID, @Name As Name, Level,@UPPOINT AS LevelUpPoint,@Class As Class,
                       Strength, Dexterity, Vitality, Energy, Inventory,MagicList, Life, MaxLife, Mana, MaxMana, MapNumber, MapPosX, MapPosY,
                       getdate() As MDate, getdate() As LDate, Quest, DbVersion, @SHENGDAOTS As Leadership,@BORNMONEY As money
                FROM DefaultClassType WHERE Class = @Class

                SET @Result = @@Error
            end

        TranProcEnd:
        IF ( @Result <> 0 )
            ROLLBACK TRAN
        ELSE
            COMMIT TRAN

        ProcEnd:
        SET NOCOUNT OFF
        SET XACT_ABORT OFF


        SELECT
            CASE @Result
                WHEN 0x00 THEN 0x01
                WHEN 0x01 THEN 0x00
                WHEN 0x03 THEN 0x03
                ELSE 0x02
                END AS Result
End