import { LEVEL_UP_POINTS, RESET_LIFE_PER_POINTS } from "./config";

export function getTotalPoints(character) {
  const ResetLife = character["ResetLife"];
  const cLevel = character["cLevel"];

  return cLevel * LEVEL_UP_POINTS + 30 * 4;
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

/**
 * 开通额外仓库所需要的积分
 * @param n 开通额外仓库的数量
 * @return {number}
 */
export function getMoreWarehouseNeedJF(n) {
  return (n - 1) * (n - 1) * 5000;
}

export function parseItem(item) {
  const category = parseInt(item.substr(18, 1), 16);
  const index = parseInt(item.substr(0, 2), 16);
  const socket = item.substring(22, 32);
  const bit34 = item.substr(3, 5);
  return {
    index,
    category,
    socket,
  };
}

export function replaceAt(str, index, replacement) {
  return (
    str.substr(0, index) + replacement + str.substr(index + replacement.length)
  );
}

export function getWarehouseFirstItem(Items, allSupportedItems) {
  const rawItem = Items.substr(0, 32);
  const parsedInfo = parseItem(rawItem);
  const it = allSupportedItems.find(
    (item) =>
      item.category === parsedInfo.category && item.index === parsedInfo.index
  );

  return {
    rawItem,
    info: it,
  };
}
