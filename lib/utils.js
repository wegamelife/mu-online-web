import { LEVEL_UP_POINTS, RESET_LIFE_PER_POINTS } from "./config";

export function getTotalPoints(character) {
  const ResetLife = character["ResetLife"];
  const cLevel = character["cLevel"];

  return cLevel * LEVEL_UP_POINTS + 20 * 4;
}

export function isChinese(str) {
  const re = /[^\u4e00-\u9fa5]/;
  return !re.test(str);
}

export const invalidNameArr = [
  "net user",
  ";",
  "xp_cmdshell",
  "add",
  "exec%20master.dbo.xp_cmdshell",
  "net localgroup administrators",
  "select",
  "count",
  "Asc(",
  "char(",
  "mid(",
  "'",
  ":",
  '""',
  "insert",
  "delete from",
  "drop table",
  "update",
  "truncate",
  "from(",
];

export function checkName(name) {
  let isInvalidName = false;
  for (const str of invalidNameArr) {
    if (name.indexOf(str) !== -1) {
      isInvalidName = true;
      break;
    }
  }

  return !isInvalidName;
}

export function checkNameLength(name) {
  let count = 0;

  name.split("").forEach((item) => {
    isChinese(item) ? (count += 2) : (count += 1);
  });

  return count <= 10;
}
