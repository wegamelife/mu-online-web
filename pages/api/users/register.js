import { createUser, getByUserName } from "../../../lib";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(500).json({
      message: "Bad method",
    });
  }

  const { username, password } = req.body;
  console.log(username, password);

  const user = await getByUserName(username);

  if (user) {
    res.status(500).send({
      message: "user already exists",
    });
  } else {
    const rs = await createUser(username, password);
    res.json(rs);
  }
}
