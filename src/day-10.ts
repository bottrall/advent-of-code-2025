import fs from "node:fs";

export function partOne(input: string) {
  const lines = input.split("\n");

  let presses = 0;

  for (const machineSpec of lines) {
    const spec = machineSpec.split(" ");

    spec.pop();

    const diagramString = spec.shift()!.slice(1, -1);
    const diagram = [...diagramString].map((x) => (x === "#" ? 1 : 0));

    const buttons = spec.map((button) =>
      button.slice(1, -1).split(",").map(Number),
    );

    let minimumPresses = Infinity;
    let hasMore = true;

    const combination = Array.from({ length: buttons.length }, () => 0);
    const lightsState = Array.from({ length: diagram.length }, () => 0);

    while (hasMore) {
      let pressCount = 0;

      for (const [index, button] of buttons.entries()) {
        if (combination[index] === 0) {
          continue;
        }

        if (!button) {
          throw new Error("Empty button definition");
        }

        pressCount++;

        for (const light of button) {
          lightsState[light]! ^= 1;
        }
      }

      if (lightsState.every((state, index) => state === diagram[index])) {
        minimumPresses = Math.min(minimumPresses, pressCount);
      }

      if (!nextLightCombination(combination)) {
        hasMore = false;
      }

      lightsState.fill(0);
    }

    presses += minimumPresses;
  }

  return presses;
}

function nextLightCombination(combination: number[]) {
  for (let index = 0; index < combination.length; index++) {
    if (combination[index] === 1) {
      continue;
    }

    combination[index] = 1;

    for (let index_ = 0; index_ < index; index_++) {
      combination[index_] = 0;
    }

    return true;
  }

  return false;
}

export function partTwo(input: string) {}

if (import.meta.url === `file://${process.argv.at(1)}`) {
  const input = fs.readFileSync("src/day-10.input.txt", "utf8");

  console.time("partOne");
  console.log(partOne(input));
  console.timeEnd("partOne");

  console.time("partTwo");
  console.log(partTwo(input));
  console.timeEnd("partTwo");
}
