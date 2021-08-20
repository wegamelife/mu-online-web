import { getByUserName } from "../../../lib";

export default async function handler(req, res) {
  const { username } = req.query;
  const user = await getByUserName(username);
  delete user["memb__pwd"];
  res.json(user);
}
