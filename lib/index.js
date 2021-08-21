import sql from "msnodesqlv8";

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

export async function getCharacters() {
  const query =
    "SELECT * FROM MuOnline.dbo.Character order by ResetLife DESC, cLevel DESC";
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
      err ? reject(err) : resolve(results[0]["ConnectStat"]);
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
  const conn = await getConnection();
  const query1 = `
        UPDATE Muonline.dbo.Character
        SET cLevel=('10'),
            experience=('0'),
            ResetLife = ResetLife + 1,
            RestTime = GETDATE(),
            LevelUpPoint = (ResetLife + 1) * 600 + 1000 + 10 * 50,
            Strength = 30,
            Dexterity = 30,
            Vitality = 30,
            Energy = 30
        WHERE cLevel > 399
          and ResetLife < 99
          and AccountID = ?
          and Name = ?`;

  const userConnectStat = await getUserStatus(username);

  return new Promise((resolve, reject) => {
    if (userConnectStat !== 0) {
      reject("请下线在操作");
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

/**
 * 自动加点
 * @param username
 * @param characterName
 * @returns {Promise<unknown>}
 */
export async function addPoints(
  username,
  characterName,
  Strength,
  Dexterity,
  Vitality,
  Energy,
  LevelUpPoint
) {
  const conn = await getConnection();

  // const character = await getCharacter(username, characterName);

  const query1 = `update Muonline.dbo.Character
                    set Strength     = ${Strength},
                        Dexterity    = ${Dexterity},
                        Vitality     = ${Vitality},
                        Energy       = ${Energy},
                        LevelUpPoint = ${LevelUpPoint}
                    where AccountID = ?
                      and Name = ?`;

  const userConnectStat = await getUserStatus(username);

  return new Promise((resolve, reject) => {
    if (userConnectStat !== 0) {
      reject("请下线在操作");
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
                    set Strength     = 30,
                        Dexterity    = 30,
                        Vitality     = 30,
                        Energy       = 30,
                        LevelUpPoint = (1000 + ResetLife * 600 + cLevel * 50)
                    where AccountID = ?
                      and Name = ?`;

  const userConnectStat = await getUserStatus(username);

  return new Promise((resolve, reject) => {
    if (userConnectStat !== 0) {
      reject("请下线在操作");
      return;
    }

    conn.query(query1, [username, characterName], (err, results) => {
      err ? reject(err) : resolve(results);
    });
  });
}
