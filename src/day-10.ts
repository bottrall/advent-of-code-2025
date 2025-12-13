import fs from "node:fs";

export function partOne(input: string) {
  return input.split("\n").reduce((presses, machineSpec) => {
    const spec = machineSpec.split(" ");

    spec.pop();

    const diagram = spec
      .shift()!
      .slice(1, -1)
      .split("")
      .map((x) => (x === "#" ? 1 : 0));

    const buttons = spec.map((btn) => btn.slice(1, -1).split(",").map(Number));

    let minimumPresses = Infinity;
    let hasMore = true;

    const combination = Array(buttons.length).fill(0);
    const lightsState = Array(diagram.length).fill(0);

    while (hasMore) {
      let pressCount = 0;

      for (let i = 0; i < buttons.length; i++) {
        if (combination[i] === 0) {
          continue;
        }

        const button = buttons[i];

        if (!button) {
          throw new Error("Empty button definition");
        }

        pressCount++;

        for (const light of button) {
          lightsState[light] ^= 1;
        }
      }

      if (lightsState.every((state, i) => state === diagram[i])) {
        minimumPresses = Math.min(minimumPresses, pressCount);
      }

      if (!nextLightCombination(combination)) {
        hasMore = false;
      }

      lightsState.fill(0);
    }

    return presses + minimumPresses;
  }, 0);
}

function nextLightCombination(combination: number[]) {
  for (let i = 0; i < combination.length; i++) {
    if (combination[i] === 1) {
      continue;
    }

    combination[i] = 1;

    for (let j = 0; j < i; j++) {
      combination[j] = 0;
    }

    return true;
  }

  return false;
}

export async function partTwo(input: string) {}

if (import.meta.url === `file://${process.argv.at(1)}`) {
  const input = fs.readFileSync("src/day-10.input.txt", "utf-8");

  console.time("partOne");
  console.log(partOne(input));
  console.timeEnd("partOne");

  console.time("partTwo");
  console.log(partTwo(input));
  console.timeEnd("partTwo");
}
