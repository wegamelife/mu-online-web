import { recycle } from "../../../lib";
import { validateUser } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(500).json({
      message: "Bad method",
    });
  }

  const { username, items, itemInfo } = req.body;
  let result;

  await validateUser(req, res);

  try {
    result = await recycle(username, items, itemInfo);
    res.json(result);
  } catch (err) {
    console.log(`err:::`, err);
    res.status(500).send({
      message: err,
    });
  }
}
