create table dbo.warehouseExt
(
    AccountID varchar(10) not null,
    Items     varbinary(1920),
    UsedSlot  int default (1),
    primary key (AccountID, UsedSlot)
);