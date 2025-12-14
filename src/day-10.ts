import fs from "node:fs";

export function partOne(input: string) {
  const lines = input.split("\n");

  let totalPresses = 0;

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

    totalPresses += minimumPresses;
  }

  return totalPresses;
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

export function partTwo(input: string) {
  const lines = input.split("\n");

  let totalPresses = 0;

  for (const machineSpec of lines) {
    if (!machineSpec) {
      continue;
    }

    const spec = machineSpec.split(" ");

    spec.shift();

    const joltageString = spec.pop()!.slice(1, -1);
    const joltageRequirements = joltageString.split(",").map(Number);

    const buttons = spec.map((button) =>
      button.slice(1, -1).split(",").map(Number),
    );

    const pre = precomputeMachine(buttons, joltageRequirements);
    const minPresses = solve(pre, joltageRequirements);

    totalPresses += minPresses;
  }

  return totalPresses;
}

interface MachinePrecompute {
  numberButtons: number;
  numberCounters: number;
  limit: number;
  pressCountByMask: number[];
  parityMaskByMask: number[];
  countByMaskAndCounter: number[];
}

function precomputeMachine(buttons: number[][], targets: number[]) {
  const numberCounters = targets.length;
  const numberButtons = buttons.length;
  const limit = 1 << numberButtons;

  const buttonParityMask = Array.from({ length: numberButtons }, () => 0);
  const buttonCountByCounter = Array.from(
    { length: numberButtons * numberCounters },
    () => 0,
  );

  for (const [buttonIndex, button] of buttons.entries()) {
    let mask = 0;

    for (const counter of button) {
      if (counter < 0 || counter >= numberCounters) {
        continue;
      }
      mask ^= 1 << counter;
      buttonCountByCounter[buttonIndex * numberCounters + counter] = 1;
    }

    buttonParityMask[buttonIndex] = mask;
  }

  const pressCountByMask = Array.from({ length: limit }, () => 0);
  const parityMaskByMask = Array.from({ length: limit }, () => 0);
  const countByMaskAndCounter = Array.from(
    { length: limit * numberCounters },
    () => 0,
  );

  for (let mask = 1; mask < limit; mask++) {
    const previous = mask & (mask - 1);
    const lsb = mask ^ previous;
    const buttonIndex = 31 - Math.clz32(lsb);

    pressCountByMask[mask] = pressCountByMask[previous]! + 1;
    parityMaskByMask[mask] =
      parityMaskByMask[previous]! ^ buttonParityMask[buttonIndex]!;

    const base = mask * numberCounters;
    const previousBase = previous * numberCounters;
    const buttonBase = buttonIndex * numberCounters;

    for (let c = 0; c < numberCounters; c++) {
      countByMaskAndCounter[base + c] =
        countByMaskAndCounter[previousBase + c]! +
        buttonCountByCounter[buttonBase + c]!;
    }
  }

  return {
    numberButtons,
    numberCounters,
    limit,
    pressCountByMask,
    parityMaskByMask,
    countByMaskAndCounter,
  };
}

function solve(
  pre: MachinePrecompute,
  targets: number[],
  cache = new Map<string, number>(),
) {
  if (targets.every((t) => t === 0)) {
    return 0;
  }

  const key = targets.join(",");
  const cached = cache.get(key);

  if (cached !== undefined) {
    return cached;
  }

  const {
    numberCounters,
    limit,
    pressCountByMask,
    parityMaskByMask,
    countByMaskAndCounter,
  } = pre;

  let targetParityMask = 0;

  for (let c = 0; c < numberCounters; c++) {
    if ((targets[c]! & 1) !== 0) {
      targetParityMask |= 1 << c;
    }
  }

  let minPresses = Infinity;

  for (let mask = 0; mask < limit; mask++) {
    if (parityMaskByMask[mask] !== targetParityMask) {
      continue;
    }

    const pressCount = pressCountByMask[mask]!;
    if (pressCount >= minPresses) {
      continue;
    }

    const base = mask * numberCounters;
    const halved = Array.from({ length: numberCounters }, () => 0);

    let valid = true;

    for (let c = 0; c < numberCounters; c++) {
      const remaining = targets[c]! - countByMaskAndCounter[base + c]!;

      if (remaining < 0 || (remaining & 1) !== 0) {
        valid = false;
        break;
      }

      halved[c] = remaining >> 1;
    }

    if (!valid) {
      continue;
    }

    const subResult = solve(pre, halved, cache);
    const total = pressCount + 2 * subResult;

    if (total < minPresses) {
      minPresses = total;
    }
  }

  cache.set(key, minPresses);

  return minPresses;
}

if (import.meta.url === `file://${process.argv.at(1)}`) {
  const input = fs.readFileSync("src/day-10.input.txt", "utf8");

  console.time("partOne");
  console.log(partOne(input));
  console.timeEnd("partOne");

  console.time("partTwo");
  console.log(partTwo(input));
  console.timeEnd("partTwo");
}
