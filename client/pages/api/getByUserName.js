import {getByUserName} from "../../lib";

export default async function handler(req, res) {
    const {userName} = req.params;
    const user = await getByUserName(userName);
    res.json(user);
}