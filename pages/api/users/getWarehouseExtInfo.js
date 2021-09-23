import { getWarehouseExtInfo } from "../../../lib";
import {validateUser} from "../../../lib/auth";


export default async function handler(req, res) {
  const { username } = req.query;
  await validateUser(req, res);
  const result = await getWarehouseExtInfo(username);
  res.json(result);
}
