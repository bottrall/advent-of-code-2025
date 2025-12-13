import fs from "node:fs";

export function partOne(input: string) {
  let invalidSum = 0;

  input.split(",").forEach((range) => {
    const [start, end] = range.split("-").map(Number);

    if (typeof start !== "number" || typeof end !== "number" || start > end) {
      throw new Error(`Invalid range: ${range}`);
    }

    for (let i = start; i <= end; i++) {
      const str = String(i);

      if (str.length % 2 !== 0) {
        continue;
      }

      const mid = str.length / 2;
      const firstSegment = str.slice(0, mid);
      const secondSegment = str.slice(mid);

      if (firstSegment === secondSegment) {
        invalidSum += i;
      }
    }
  });

  return invalidSum;
}

export function partTwo(input: string) {
  let invalidSum = 0;

  input.split(",").forEach((range) => {
    const [start, end] = range.split("-").map(Number);

    if (typeof start !== "number" || typeof end !== "number" || start > end) {
      throw new Error(`Invalid range: ${range}`);
    }

    for (let i = start; i <= end; i++) {
      const str = String(i);

      for (let j = 1; j < str.length; j++) {
        if (str.length % j !== 0) {
          continue;
        }

        const segments = Array.from({ length: str.length / j }, (_, k) =>
          str.slice(k * j, (k + 1) * j),
        );

        const allEqual = segments.every((seg) => seg === segments.at(0));

        if (allEqual) {
          invalidSum += i;
          break;
        }
      }
    }
  });

  return invalidSum;
}

if (import.meta.url === `file://${process.argv.at(1)}`) {
  const input = fs.readFileSync("src/day-2.input.txt", "utf-8");

  console.log(partOne(input));
  console.log(partTwo(input));
}
