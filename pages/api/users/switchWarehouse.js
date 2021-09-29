import { switchWarehouse } from "../../../lib";
import { validateUser } from "../../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(500).json({
      message: "Bad method",
    });
  }

  const { username, targetUsedSlot } = req.body;
  let result;

  await validateUser(req, res);

  try {
    result = await switchWarehouse(username, targetUsedSlot);
    res.json(result);
  } catch (err) {
    console.log(`err:::`, err);
    res.status(500).send({
      message: err,
    });
  }
}
