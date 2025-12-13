import fs from "node:fs";

export function partOne(input: string) {
  let invalidSum = 0;

  for (const range of input.split(",")) {
    const [start, end] = range.split("-").map(Number);

    if (typeof start !== "number" || typeof end !== "number" || start > end) {
      throw new Error(`Invalid range: ${range}`);
    }

    for (let index = start; index <= end; index++) {
      const string_ = String(index);

      if (string_.length % 2 !== 0) {
        continue;
      }

      const mid = string_.length / 2;
      const firstSegment = string_.slice(0, mid);
      const secondSegment = string_.slice(mid);

      if (firstSegment === secondSegment) {
        invalidSum += index;
      }
    }
  }

  return invalidSum;
}

export function partTwo(input: string) {
  let invalidSum = 0;

  for (const range of input.split(",")) {
    const [start, end] = range.split("-").map(Number);

    if (typeof start !== "number" || typeof end !== "number" || start > end) {
      throw new Error(`Invalid range: ${range}`);
    }

    for (let index = start; index <= end; index++) {
      const string_ = String(index);

      for (let indexB = 1; indexB < string_.length; indexB++) {
        if (string_.length % indexB !== 0) {
          continue;
        }

        const segments = Array.from(
          { length: string_.length / indexB },
          (_, k) => string_.slice(k * indexB, (k + 1) * indexB),
        );

        const allEqual = segments.every((seg) => seg === segments.at(0));

        if (allEqual) {
          invalidSum += index;
          break;
        }
      }
    }
  }

  return invalidSum;
}

if (import.meta.url === `file://${process.argv.at(1)}`) {
  const input = fs.readFileSync("src/day-2.input.txt", "utf8");

  console.log(partOne(input));
  console.log(partTwo(input));
}
