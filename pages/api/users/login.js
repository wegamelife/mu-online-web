import { createUser, getByUsernameAndPassword } from "../../../lib";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(500).json({
      message: "Bad method",
    });
  }

  const { username, password } = req.body;
  console.log(username, password);

  const user = await getByUsernameAndPassword(username, password);
  console.log(user);

  if (!user) {
    res.status(500).send({
      message: "user not exists",
    });
  } else {
    res.json(user);
  }
}
