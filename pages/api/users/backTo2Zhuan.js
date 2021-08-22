import { backTo2Zhuan } from "../../../lib";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(500).json({
      message: "Bad method",
    });
  }

  const { username, characterName } = req.body;
  let result;

  try {
    result = await backTo2Zhuan(username, characterName);
    if (!result) {
      res.status(500).send({
        message: "Unknown error",
      });
    } else {
      res.json(result);
    }
  } catch (err) {
    console.log(`err:::`, err);
    res.status(500).send({
      message: err,
    });
  }
}
