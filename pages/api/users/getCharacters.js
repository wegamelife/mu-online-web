import {createUser, getCharactersByAccount} from "../../../lib";

export default async function handler(req, res) {
    const { username } = req.query;
    const user = await getCharactersByAccount(username);

    if (!user) {
        res.status(500).send({
            message: "user not exists",
        });
    } else {
        res.json(user);
    }
}
