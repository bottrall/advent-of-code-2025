import fs from "node:fs";

export function partOne(input: string) {
  const numOfRequiredBatteries = 2;

  let totalJoltage = 0;

  input.split("\n").forEach((bank, n) => {
    const batteries = bank.split("").map(Number);

    let searchFromIndex = 0;
    let joltage = "";

    for (let i = numOfRequiredBatteries; i > 0; i--) {
      const end = batteries.length + 1 - i;
      const battery = Math.max(...batteries.slice(searchFromIndex, end));

      joltage += String(battery);

      searchFromIndex = batteries.indexOf(battery, searchFromIndex) + 1;
    }

    totalJoltage += Number(joltage);
  });

  return totalJoltage;
}

export function partTwo(input: string) {
  const numOfRequiredBatteries = 12;

  let totalJoltage = 0;

  input.split("\n").forEach((bank, n) => {
    const batteries = bank.split("").map(Number);

    let searchFromIndex = 0;
    let joltage = "";

    for (let i = numOfRequiredBatteries; i > 0; i--) {
      const end = batteries.length + 1 - i;
      const battery = Math.max(...batteries.slice(searchFromIndex, end));

      joltage += String(battery);

      searchFromIndex = batteries.indexOf(battery, searchFromIndex) + 1;
    }

    totalJoltage += Number(joltage);
  });

  return totalJoltage;
}

if (import.meta.url === `file://${process.argv.at(1)}`) {
  const input = fs.readFileSync("src/day-3.input.txt", "utf-8");

  console.log(partOne(input));
  console.log(partTwo(input));
}
