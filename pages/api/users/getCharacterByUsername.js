import { getCharactersByAccount } from "../../../lib";
import { validateUser } from "../../../lib/auth";

export default async function handler(req, res) {
  const { username } = req.query;
  const user = await getCharactersByAccount(username);

  await validateUser(req, res);

  if (!user) {
    res.status(500).send({
      message: "user not exists",
    });
  } else {
    res.json(user);
  }
}
