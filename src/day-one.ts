import fs from "node:fs";

export function partOne(input: string) {
  let zeroCount = 0;
  let position = 50;

  input.split("\n").forEach((line) => {
    const direction = line.charAt(0);
    const amount = Number(line.slice(1));

    const partialRotation = amount % 100;

    switch (direction) {
      case "R":
        position = (position + partialRotation) % 100;
        break;
      case "L":
        position = (position - partialRotation + 100) % 100;
        break;
      default:
        throw new Error(`Unknown direction: ${direction}`);
    }

    if (position === 0) {
      zeroCount++;
    }
  });

  return zeroCount;
}

export function partTwo(input: string) {
  let zeroCount = 0;
  let position = 50;

  input.split("\n").forEach((line) => {
    const direction = line.charAt(0);
    const amount = Number(line.slice(1));

    const distanceToFirstZero = direction === "R" ? 100 - position : position;

    // Check if the rotation will pass through zero
    if (amount >= distanceToFirstZero && distanceToFirstZero > 0) {
      // If we rotate enough to reach zero, count that crossing
      const remaining = amount - distanceToFirstZero;
      // Plus any additional full rotations (100 units = 1 full circle)
      zeroCount += 1 + Math.floor(remaining / 100);
    } else if (distanceToFirstZero === 0) {
      // Already at zero, so only count full rotations
      zeroCount += Math.floor(amount / 100);
    }

    const partialRotation = amount % 100;

    switch (direction) {
      case "R":
        position = (position + partialRotation) % 100;
        break;
      case "L":
        position = (position - partialRotation + 100) % 100;
        break;
      default:
        throw new Error(`Unknown direction: ${direction}`);
    }
  });

  return zeroCount;
}

if (import.meta.url === `file://${process.argv.at(1)}`) {
  const input = fs.readFileSync("src/day-one.input.txt", "utf-8");

  console.log(partOne(input));
  console.log(partTwo(input));
}
