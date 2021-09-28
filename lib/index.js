import sql from "msnodesqlv8";
import {
  CAN_RESET_LIFE,
  LEVEL_UP_POINTS,
  RESET_LIFE_PER_POINTS,
  RESET_LIFT_MAX_COUNT,
  RESET_LIFT_REQUIRE_LEVEL,
  SOCKET_NEED_JF,
} from "./config";
import { getTotalPoints } from "./utils";

const connectionString =
  "Driver={SQL Server};Server=127.0.0.1,1433;Database=MuOnline;Trusted_Connection=Yes";

let conn;

export async function getConnection() {
  if (conn) {
    return conn;
  }

  return new Promise((resolve, reject) => {
    sql.open(connectionString, (err, _conn) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        conn = _conn;
        resolve(conn);
      }
    });
  });
}

async function executeSql(sql, ...arr) {
  const conn = await getConnection();

  return new Promise((resolve, reject) => {
    conn.query(sql, arr, (err, results) => {
      err ? reject(err) : resolve(results);
    });
  });
}

export async function getUsers() {
  const query = "SELECT * FROM MuOnline.dbo.MEMB_INFO";
  const conn = await getConnection();

  return new Promise((resolve, reject) => {
    conn.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

/**
 * 获取所有角色信息
 * @returns {Promise<unknown>}
 */
export async function getCharacters() {
  const query = `SELECT *
                   FROM MuOnline.dbo.Character as c
                            left join Muonline.dbo.T_MasterLevelSystem as m
                                      on c.Name = m.CHAR_NAME collate Chinese_PRC_CI_AI_WS
                   order by cLevel DESC, MASTER_LEVEL DESC, m.ML_EXP DESC, c.PkCount DESC`;
  const conn = await getConnection();

  return new Promise((resolve, reject) => {
    conn.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        const rs = results.map((item) => {
          const _item = item;
          delete _item["Inventory"];
          delete _item["MagicList"];
          delete _item["Quest"];
          return _item;
        });

        resolve(rs);
      }
    });
  });
}

export async function getByUsernameAndPassword(username, password) {
  const query1 = `select *
                    from MuOnline.dbo.MEMB_INFO
                    where memb___id = ?
                      and memb__pwd = ?`;
  const conn = await getConnection();
  return new Promise((resolve, reject) => {
    conn.query(query1, [username, password], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length ? results[0] : null);
      }
    });
  });
}

export async function getByUserName(username) {
  const query1 = `select *
                    from MuOnline.dbo.MEMB_INFO
                    where memb___id = ?`;
  const conn = await getConnection();
  return new Promise((resolve, reject) => {
    conn.query(query1, [username], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length ? results[0] : null);
      }
    });
  });
}

export async function createUser(username, password) {
  const conn = await getConnection();
  const query1 = `insert into MuOnline.dbo.MEMB_INFO
                    (memb___id, memb__pwd, memb_name, sno__numb, appl_days, modi_days, out__days, true_days, ctl1_code,
                     bloc_code, jf)
                    values (?, ?, 'name', '1111111111111', GETDATE(), GETDATE(), GETDATE(), GETDATE(), 0, 0, 0)`;

  return new Promise((resolve, reject) => {
    conn.query(query1, [username, password], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

/**
 * 获取用户账号下的人物
 * @param username
 * @returns {Promise<unknown>}
 */
export async function getCharactersByAccount(username) {
  const conn = await getConnection();
  const query1 = `select *
                    from Muonline.dbo.Character
                    where AccountID = ?`;

  return new Promise((resolve, reject) => {
    conn.query(query1, [username], (err, results) => {
      err ? reject(err) : resolve(results);
    });
  });
}

/**
 * 获取用户是否在线, 0 不在线, 1 在线
 * @param username
 * @returns {Promise<unknown>}
 */
export async function getUserStatus(username) {
  const conn = await getConnection();
  const query1 = `
        select ConnectStat
        from MEMB_STAT
        where memb___id = ?`;
  return new Promise((resolve, reject) => {
    conn.query(query1, [username], (err, results) => {
      err ? reject(err) : resolve(results[0] ? results[0]["ConnectStat"] : 1);
    });
  });
}

/**
 * 在线用户数量
 * @returns {Promise<unknown>}
 */
export async function getUserOnlineStatus() {
  const conn = await getConnection();
  const query1 = `
        select *
        from MEMB_STAT`;
  return new Promise((resolve, reject) => {
    conn.query(query1, (err, results) => {
      err ? reject(err) : resolve(results);
    });
  });
}

/**
 * 在线转生
 * @param username
 * @param characterName
 * @returns {Promise<unknown>}
 */
export async function resetLife(username, characterName) {
  if (!CAN_RESET_LIFE) {
    return "不支持转生";
  }
  const conn = await getConnection();
  const query1 = `
        UPDATE Muonline.dbo.Character
        SET cLevel=('10'),
            experience=('0'),
            ResetLife = ResetLife + 1,
            RestTime = GETDATE(),
            LevelUpPoint = (ResetLife + 1) * ${RESET_LIFE_PER_POINTS} + 10 * ${LEVEL_UP_POINTS},
            Strength = 30,
            Dexterity = 30,
            Vitality = 30,
            Energy = 30
        WHERE cLevel >= ${RESET_LIFT_REQUIRE_LEVEL}
          and ResetLife < ${RESET_LIFT_MAX_COUNT}
          and AccountID = ?
          and Name = ?`;

  const userConnectStat = await getUserStatus(username);

  return new Promise((resolve, reject) => {
    if (userConnectStat !== 0) {
      reject("请下线在操作或者未创建角色");
      return;
    }

    conn.query(query1, [username, characterName], (err, results) => {
      err ? reject(err) : resolve(results);
    });
  });
}

/**
 * 获取角色信息
 * @param username
 * @param characterName
 * @returns {Promise<unknown>}
 */
export async function getCharacter(username, characterName) {
  const query1 = `select *
                    from MuOnline.dbo.Character
                    where AccountID = ?
                      and Name = ?`;
  const conn = await getConnection();
  return new Promise((resolve, reject) => {
    conn.query(query1, [username, characterName], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length ? results[0] : null);
      }
    });
  });
}

export async function getCharacterByName(characterName) {
  const query1 = `select *
                    from Muonline.dbo.Character
                    where Name = ?`;

  const conn = await getConnection();
  return new Promise((resolve, reject) => {
    conn.query(query1, [characterName], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length ? results : null);
      }
    });
  });
}

/**
 * 加点
 * @param username
 * @param characterName
 * @param Strength
 * @param Dexterity
 * @param Vitality
 * @param Energy
 * @returns {Promise<unknown>}
 */
export async function addPoints(
  username,
  characterName,
  Strength,
  Dexterity,
  Vitality,
  Energy
) {
  const conn = await getConnection();

  const character = await getCharacter(username, characterName);
  const totalPoints = getTotalPoints(character);

  const _Strength = Strength > 32767 ? 32767 : Strength;
  const _Dexterity = Dexterity > 32767 ? 32767 : Dexterity;
  const _Vitality = Vitality > 32767 ? 32767 : Vitality;
  const _Energy = Energy > 32767 ? 32767 : Energy;

  let LevelUpPoint = totalPoints - _Strength - _Dexterity - _Vitality - _Energy;

  if (LevelUpPoint < 0) {
    LevelUpPoint = 0;
  }

  const query1 = `update Muonline.dbo.Character
                    set Strength     = ${_Strength},
                        Dexterity    = ${_Dexterity},
                        Vitality     = ${_Vitality},
                        Energy       = ${_Energy},
                        LevelUpPoint = ${LevelUpPoint}
                    where AccountID = ?
                      and Name = ?`;

  const userConnectStat = await getUserStatus(username);

  return new Promise((resolve, reject) => {
    if (userConnectStat !== 0) {
      reject("请下线在操作或者未创建角色");
      return;
    }

    conn.query(query1, [username, characterName], (err, results) => {
      err ? reject(err) : resolve(results);
    });
  });
}

/**
 * 洗点
 * @param username
 * @param characterName
 * @returns {Promise<unknown>}
 */
export async function clearPoints(username, characterName) {
  const conn = await getConnection();
  const query1 = `update Muonline.dbo.Character
                    set Strength     = 0,
                        Dexterity    = 0,
                        Vitality     = 0,
                        Energy       = 0,
                        LevelUpPoint = (cLevel * ${LEVEL_UP_POINTS}) + 30 * 4
                    where AccountID = ?
                      and Name = ?`;

  const userConnectStat = await getUserStatus(username);

  return new Promise((resolve, reject) => {
    if (userConnectStat !== 0) {
      reject("请下线在操作或者未创建角色");
      return;
    }

    conn.query(query1, [username, characterName], (err, results) => {
      err ? reject(err) : resolve(results);
    });
  });
}

/**
 * 三转
 * @param username
 * @param characterName
 * @returns {Promise<unknown>}
 */
export async function zhuanZhi3(username, characterName) {
  const conn = await getConnection();
  const query1 = `update Muonline.dbo.Character
                    set Class = Class + 2
                    where AccountID = ?
                      and Name = ?`;

  const query2 = `update Muonline.dbo.T_MasterLevelSystem
                    set ML_POINT = MASTER_LEVEL
                    where CHAR_NAME = ?`;

  const userConnectStat = await getUserStatus(username);

  return new Promise((resolve, reject) => {
    if (userConnectStat !== 0) {
      reject("请下线在操作或者未创建角色");
      return;
    }

    conn.query(query1, [username, characterName], (err, results) => {
      conn.query(query2, [characterName], (err2, results2) => {
        err ? reject(err) : resolve(results);
      });
    });
  });
}

/**
 * 恢复到 二转
 * @param username
 * @param characterName
 * @returns {Promise<unknown>}
 */
export async function backTo2Zhuan(username, characterName) {
  const conn = await getConnection();
  const query1 = `update Muonline.dbo.Character
                    set Class = Class - 2
                    where AccountID = ?
                      and Name = ?`;

  const userConnectStat = await getUserStatus(username);

  return new Promise((resolve, reject) => {
    if (userConnectStat !== 0) {
      reject("请下线在操作或者未创建角色");
      return;
    }

    conn.query(query1, [username, characterName], (err, results) => {
      err ? reject(err) : resolve(results);
    });
  });
}

export async function unBlockAccount(username) {
  const conn = await getConnection();
  const query1 = `update Muonline.dbo.MEMB_INFO
                    set bloc_code = 0
                    where memb___id = ?`;

  const userConnectStat = await getUserStatus(username);

  return new Promise((resolve, reject) => {
    if (userConnectStat !== 0) {
      reject("请下线在操作或者未创建角色");
      return;
    }

    conn.query(query1, [username], (err, results) => {
      err ? reject(err) : resolve(results);
    });
  });
}

export async function changeCharacterName(username, characterName, newName) {
  const query1 = `update Muonline.dbo.Character
                    set name= ?
                    where AccountID = ?
                      and Name = ?`;
  const query2 = `update Muonline.dbo.T_MasterLevelSystem
                    set Char_Name= ?
                    where Char_Name = ?`;
  const query3 = `update Muonline.dbo.AccountCharacter
                    set GameIDC= ?
                    where Id = ?
                      and GameIDC = ?`;
  const query4 = `update Muonline.dbo.AccountCharacter
                    set GameID1= ?
                    where Id = ?
                      and GameID1 = ?`;
  const query5 = `update Muonline.dbo.AccountCharacter
                    set GameID2= ?
                    where Id = ?
                      and GameID2 = ?`;
  const query6 = `update Muonline.dbo.AccountCharacter
                    set GameID3= ?
                    where Id = ?
                      and GameID3 = ?`;
  const query7 = `update Muonline.dbo.AccountCharacter
                    set GameID4= ?
                    where Id = ?
                      and GameID4 = ?`;
  const query8 = `update Muonline.dbo.AccountCharacter
                    set GameID5= ?
                    where Id = ?
                      and GameID5 = ?`;

  const userConnectStat = await getUserStatus(username);
  const existsCharName = await getCharacterByName(newName);

  return new Promise(async (resolve, reject) => {
    if (userConnectStat !== 0) {
      reject("请下线在操作或者未创建角色");
      return;
    }

    if (existsCharName) {
      reject("用户名已存在");
      return;
    }

    try {
      await executeSql(query1, newName, username, characterName);
      await executeSql(query2, newName, characterName);
      await executeSql(query3, newName, username, characterName);
      await executeSql(query4, newName, username, characterName);
      await executeSql(query5, newName, username, characterName);
      await executeSql(query6, newName, username, characterName);
      await executeSql(query7, newName, username, characterName);
      await executeSql(query8, newName, username, characterName);
      resolve("ok");
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * 获取仓库信息
 * @param username
 * @return {Promise<unknown>}
 */
export async function getWarehouseInfo(username) {
  const query1 = `select *
                    from warehouse
                    where AccountID = ?`;
  const rs = await executeSql(query1, username);
  const data = rs[0];
  return {
    ...data,
    Items: Buffer.from(data.Items).toString("hex"),
  };
}

/**
 * 获取扩展仓库信息
 * @param username
 * @return {Promise<unknown>}
 */
export async function getWarehouseExtInfo(username) {
  const conn = await getConnection();
  const query1 = `select *
                    from warehouseExt
                    where AccountID = ?`;
  return new Promise((resolve, reject) => {
    conn.query(query1, [username], (err, results) => {
      err ? reject(err) : resolve(results);
    });
  });
}

/**
 * 初始化扩展仓库
 * @param username
 * @return {Promise<unknown>}
 */
export async function initWarehouseExt(username) {
  const query1 = `insert into warehouseExt (AccountID, Items, UsedSlot)
                    select AccountID, Items, 1
                    from warehouse
                    where AccountID = ?`;

  const query2 = `update warehouse
                    set UsedSlot = 1
                    where AccountID = ?`;

  const userConnectStat = await getUserStatus(username);

  return new Promise(async (resolve, reject) => {
    if (userConnectStat !== 0) {
      reject("请下线在操作或者未创建角色");
      return;
    }

    await executeSql(query1, username);
    await executeSql(query2, username);
    resolve("ok");
  });
}

/**
 * 开通额外的扩展仓库
 * @param username
 * @param needJF
 * @return {Promise<unknown>}
 */
export async function addNewWarehouseExt(username, needJF) {
  const conn = await getConnection();
  const query1 = `insert into warehouseExt (AccountID, Items, UsedSlot)
                    values (?, null, ?)`;

  const userConnectStat = await getUserStatus(username);

  return new Promise(async (resolve, reject) => {
    if (userConnectStat !== 0) {
      reject("请下线在操作或者未创建角色");
      return;
    }

    const warehouseExt = await getWarehouseExtInfo(username);
    await updateUserJF(username, needJF, "subtract");

    conn.query(query1, [username, warehouseExt.length + 1], (err, results) => {
      err ? reject(err) : resolve(results);
    });
  });
}

/**
 * 切换仓库
 * @param username
 * @param targetUsedSlot
 * @return {Promise<unknown>}
 */
export async function switchWarehouse(username, targetUsedSlot) {
  // 同步当前仓库得信息到扩展仓库
  const query1 = `update warehouseExt
                    set Items = (select Items from warehouse where warehouse.AccountID = ?)
                    where AccountID = ?
                      and warehouseExt.UsedSlot =
                          (select warehouse.UsedSlot from warehouse where warehouse.AccountID = ?) `;

  // 将指定扩展仓库的信息同步到主仓库
  const query2 = `update warehouse
                    set Items    = (select Items
                                    from warehouseExt
                                    where warehouseExt.AccountID = ?
                                      and warehouseExt.UsedSlot = ?),
                        UsedSlot = ?
                    where AccountID = ?`;

  const userConnectStat = await getUserStatus(username);

  return new Promise(async (resolve, reject) => {
    if (userConnectStat !== 0) {
      reject("请下线在操作或者未创建角色");
      return;
    }

    await executeSql(query1, username, username, username);
    await executeSql(
      query2,
      username,
      targetUsedSlot,
      targetUsedSlot,
      username
    );
    resolve("ok");
  });
}

/**
 * 更新积分
 * @param username
 * @param amount
 * @param op
 * @return {Promise<unknown>}
 */
export async function updateUserJF(username, amount, op = "subtract") {
  const addQuery = `update MEMB_INFO
                    set JF = JF + ?
                    where memb___id = ?`;

  const subtractQuery = `update MEMB_INFO
                    set JF = JF - ?
                    where memb___id = ?`;

  const query1 = op === "add" ? addQuery : subtractQuery;

  const userConnectStat = await getUserStatus(username);

  return new Promise(async (resolve, reject) => {
    if (userConnectStat !== 0) {
      reject("请下线在操作或者未创建角色");
      return;
    }
    await executeSql(query1, amount, username);
    resolve("ok");
  });
}

export async function updateItemsSockets(username, items) {
  const query1 = `update warehouse set Items = Muonline.dbo.fn_hexstrtovarbin('${items}') where AccountID = ?`;
  const userConnectStat = await getUserStatus(username);

  if (userConnectStat !== 0) {
    return Promise.reject("请下线在操作或者未创建角色");
  }

  await updateUserJF(username, SOCKET_NEED_JF, "subtract");
  return await executeSql(query1, username);
}
