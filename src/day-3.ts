import fs from "node:fs";

export function partOne(input: string) {
  const numberOfRequiredBatteries = 2;

  let totalJoltage = 0;

  for (const bank of input.split("\n")) {
    const batteries = [...bank].map(Number);

    let searchFromIndex = 0;
    let joltage = "";

    for (let index = numberOfRequiredBatteries; index > 0; index--) {
      const end = batteries.length + 1 - index;
      const battery = Math.max(...batteries.slice(searchFromIndex, end));

      joltage += String(battery);

      searchFromIndex = batteries.indexOf(battery, searchFromIndex) + 1;
    }

    totalJoltage += Number(joltage);
  }

  return totalJoltage;
}

export function partTwo(input: string) {
  const numberOfRequiredBatteries = 12;

  let totalJoltage = 0;

  for (const bank of input.split("\n")) {
    const batteries = [...bank].map(Number);

    let searchFromIndex = 0;
    let joltage = "";

    for (let index = numberOfRequiredBatteries; index > 0; index--) {
      const end = batteries.length + 1 - index;
      const battery = Math.max(...batteries.slice(searchFromIndex, end));

      joltage += String(battery);

      searchFromIndex = batteries.indexOf(battery, searchFromIndex) + 1;
    }

    totalJoltage += Number(joltage);
  }

  return totalJoltage;
}

if (import.meta.url === `file://${process.argv.at(1)}`) {
  const input = fs.readFileSync("src/day-3.input.txt", "utf8");

  console.log(partOne(input));
  console.log(partTwo(input));
}
