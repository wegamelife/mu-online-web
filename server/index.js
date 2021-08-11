const sql = require("msnodesqlv8");
const connectionString = "Driver={SQL Server};Server=BUUUG7-PC-WIN7;Database=MuOnline;Trusted_Connection=Yes";
const query = "SELECT Name, cLevel, levelUpPoint FROM MuOnline.dbo.Character";

sql.query(connectionString, query, (err, rows) => {
    console.log(err)
    console.log(rows);
});

