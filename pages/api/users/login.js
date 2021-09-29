import { getByUsernameAndPassword } from "../../../lib";
import { md5, setCookie } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(500).json({
      message: "Bad method",
    });
  }

  const { username, password } = req.body;

  const user = await getByUsernameAndPassword(username, password);
  console.log(user);

  if (!user) {
    res.status(500).send({
      message: "user not exists",
    });
  } else {
    // setCookie(res, "user", username);
    setCookie(res, "token", md5(`${username}:${password}`));
    res.json(user);
  }
}
