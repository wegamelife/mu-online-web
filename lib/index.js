import sql from "msnodesqlv8";

const connectionString =
    "Driver={SQL Server};Server=BUUUG7-PC-WIN7;Database=MuOnline;Trusted_Connection=Yes";


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
                reject(err)
            } else {
                resolve(results)
            }
        })
    })
}

export async function getByUserName(userName) {
    const query1 = `select *
                    from MuOnline.dbo.MEMB_INFO
                    where memb___id = ?`;
    const conn = await getConnection();
    return new Promise((resolve, reject) => {
        conn.query(query1, [userName], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results.length ? results[0] : null);
            }
        });
    });
}

export async function createUser(username, password) {
    const query1 = `insert into MuOnline.dbo.MEMB_INFO (memb___id, memb__pwd, memb_name, sno__numb, appl_days,
                                                        modi_days, out__days, true_days, mail_chek, bloc_code,
                                                        ctl1_code, jf, partation, servercode, usedtime)
                    values (?, ?, 'name', '1111111111111', GETDATE(), GETDATE(), GETDATE(), GETDATE(), 0, 0, 0, 0, 0, 0,
                            0)`;

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
