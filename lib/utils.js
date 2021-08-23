import {LEVEL_UP_POINTS, RESET_LIFE_PER_POINTS} from "./config";

export function getTotalPoints(character) {
  const ResetLife = character["ResetLife"];
  const cLevel = character["cLevel"];

  return ResetLife * RESET_LIFE_PER_POINTS +
      1000 +
      cLevel * LEVEL_UP_POINTS +
      30 * 4;
}
