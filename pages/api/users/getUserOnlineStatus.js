import { getUserOnlineStatus } from "../../../lib";

export default async function handler(req, res) {
  const users = await getUserOnlineStatus();
  res.json(users);
}
