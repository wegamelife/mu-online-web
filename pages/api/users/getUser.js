import { getByUserName } from "../../../lib";
import { validateUser } from "../../../lib/auth";

export default async function handler(req, res) {
  const { username } = req.query;

  await validateUser(req, res);

  const user = await getByUserName(username);
  delete user["memb__pwd"];
  res.json(user);
}
