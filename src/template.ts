import fs from "node:fs";

export function partOne(input: string) {
  return input;
}

export function partTwo(input: string) {
  return input;
}

if (import.meta.url === `file://${process.argv.at(1)}`) {
  const input = fs.readFileSync("src/day-x.input.txt", "utf8");

  console.log(partOne(input));
  console.log(partTwo(input));
}
