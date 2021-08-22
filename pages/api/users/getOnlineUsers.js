import { getOnlineUsers } from "../../../lib";

export default async function handler(req, res) {
  const users = await getOnlineUsers();
  res.json(users);
}
