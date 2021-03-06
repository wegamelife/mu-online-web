import { createUser, getByUserName } from "../../../lib";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(500).json({
      message: "Bad method",
    });
  }

  const { username, password } = req.body;
  const user = await getByUserName(username);

  if (user) {
    res.status(500).send({
      message: "user already exists",
    });
  } else {
    try {
      const rs = await createUser(username, password);
      res.json(rs);
    } catch (err) {
      res.status(500).send({
        message: "something went wrong",
      });
    }
  }
}
