import cookie, { serialize } from "cookie";
import crypto from "crypto";
import { getByUserName } from "./index";
export const MAX_AGE = 60 * 60 * 360; // 720 hours, 15days

export function setCookie(res, key, value) {
  const cookie = serialize(key, value, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    httpOnly: true,
    secure: false,
    path: "/",
    sameSite: "lax",
  });

  res.setHeader("Set-Cookie", cookie);
}

export function removeTokenCookie(res) {
  const cookie = serialize("token", "", {
    maxAge: -1,
    path: "/",
  });

  res.setHeader("Set-Cookie", cookie);
}

export function getCookie(req, key) {
  const cookies = cookie.parse(req.headers.cookie || "");
  return cookies[key];
}

export function md5(str) {
  return crypto.createHash("md5").update(str).digest("hex");
}

export async function validateUser(req, res) {
  const invalidMessage = `token失效, 请重新登录`;
  const token = getCookie(req, "token");
  const username = req.query.username || req.body.username;

  if (!username) {
    return res.status(401).json({
      message: invalidMessage,
    });
  }

  const user = await getByUserName(username);

  if (!user) {
    return res.status(401).json({
      message: invalidMessage,
    });
  }

  const isValidUser = md5(`${username}:${user.memb__pwd}`) === token;

  if (!isValidUser) {
    return res.status(401).json({
      message: invalidMessage,
    });
  }
}
