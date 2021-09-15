import { removeTokenCookie } from "../../../lib/auth";

export default async function handle(req, res) {
  removeTokenCookie(res);
  res.end();
}
