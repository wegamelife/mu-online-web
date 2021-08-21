import { zhuanZhi3 } from "../../../lib";

export default async function handler(req, res) {
    const { username, characterName } = req.query;
    let result;

    try {
        result = await zhuanZhi3(username, characterName);
        if (!result) {
            res.status(500).send({
                message: "Unknown error",
            });
        } else {
            res.json(result);
        }
    } catch (err) {
        console.log(`err:::`, err);
        res.status(500).send({
            message: err,
        });
    }
}
