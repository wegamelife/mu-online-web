import { addPoints } from "../../../lib";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(500).json({
      message: "Bad method",
    });
  }

  const {
    username,
    characterName,
    Strength,
    Dexterity,
    Vitality,
    Energy,
    LevelUpPoint,
  } = req.body;

  let result;

  try {
    result = await addPoints(
      username,
      characterName,
      Strength,
      Dexterity,
      Vitality,
      Energy,
      LevelUpPoint
    );
    if (!result) {
      res.status(500).send({
        message: "Unknow error",
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
