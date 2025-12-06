import fs from "node:fs";

export function partOne(input: string) {}

export function partTwo(input: string) {}

if (import.meta.url === `file://${process.argv.at(1)}`) {
  const input = fs.readFileSync("src/day-x.input.txt", "utf-8");

  console.log(partOne(input));
  console.log(partTwo(input));
}
