import fs from "fs";

const logFileName = `./server-log.txt`;

export function logMe(text) {
  const _text = `[${new Date().toISOString()}] ${text}\n`;
  fs.appendFile(logFileName, _text, (err) => {
    if (err) {
      console.log(err);
    }
  });
}
