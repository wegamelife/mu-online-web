import { getCharacters } from "../../../lib";

export default async function handler(req, res) {
  const users = await getCharacters();
  res.json(users);
}
