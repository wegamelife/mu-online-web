const express = require("express");
const App = express();

const sql = require("msnodesqlv8");
const connectionString =
    "Driver={SQL Server};Server=BUUUG7-PC-WIN7;Database=MuOnline;Trusted_Connection=Yes";

App.use(express.json());

let conn;

async function getConnection() {
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

App.options("/*", (req, res, next) => {
    res.status(200);
    res.header("Content-Type", "0");
    res.end();
});

// get all users
App.get("/users", async (req, res) => {
    const query = "SELECT * FROM MuOnline.dbo.MEMB_INFO";
    const conn = await getConnection();

    conn.query(query, (err, rows) => {
        if (err) {
            console.log(err);
        }
        console.log(rows);
        res.json(rows);
    });
});

async function getUsers() {
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

async function getByUserName(userName) {
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

async function createUser(username, password) {
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

// get single user
App.get("/users/:userName", async (req, res) => {
    const {userName} = req.params;
    const user = await getByUserName(userName);
    res.json(user);
});

// create user
App.post("/users/auth/register", async (req, res) => {
    const body = req.body;
    console.log(body);
    const {username, password} = body;
    const user = await getByUserName(username);

    if (user) {
        res.status(500).send({
            message: "user already exists",
        });
    } else {
        const rs = await createUser(username, password);
        res.json(rs);
    }
});

App.listen(3000, (err) => {
    console.log(`Server listen on http://localhost:3000 port`);
});
