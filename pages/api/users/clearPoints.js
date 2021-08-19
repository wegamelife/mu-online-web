import { clearPoints } from "../../../lib";

export default async function handler(req, res) {
    const { username, characterName } = req.query;
    let result;

    try {
        result = await clearPoints(username, characterName);
        if (!result) {
            res.status(500).send({
                message: "Unknow error",
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
