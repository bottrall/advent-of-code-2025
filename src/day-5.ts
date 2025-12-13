import fs from "node:fs";

export function partOne(input: string) {
  const [rangesString, idsString] = input.split("\n\n");

  if (!rangesString || !idsString) {
    throw new Error("Invalid input");
  }

  const ranges = rangesString
    .split("\n")
    .map((range) => range.split("-").map(Number) as [number, number])
    .toSorted((a, b) => a[0] - b[0]);

  const mergedRanges: [number, number][] = [];

  for (const current of ranges) {
    const last = mergedRanges.at(-1);

    if (last && current[0] <= last[1] + 1) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      mergedRanges.push(current);
    }
  }

  let sum = 0;

  for (const idString of idsString.split("\n")) {
    const id = Number(idString);
    const inRange = mergedRanges.some(
      ([start, end]) => id >= start && id <= end,
    );

    if (inRange) {
      sum++;
    }
  }

  return sum;
}

export function partTwo(input: string) {
  const [rangesString] = input.split("\n\n");

  if (!rangesString) {
    throw new Error("Invalid input");
  }

  const ranges = rangesString
    .split("\n")
    .map((range) => range.split("-").map(Number) as [number, number])
    .toSorted((a, b) => a[0] - b[0]);

  const mergedRanges: [number, number][] = [];

  for (const current of ranges) {
    const last = mergedRanges.at(-1);

    if (last && current[0] <= last[1] + 1) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      mergedRanges.push(current);
    }
  }

  return mergedRanges.reduce<number>((sum, [start, end]) => {
    return sum + (end - start + 1);
  }, 0);
}

if (import.meta.url === `file://${process.argv.at(1)}`) {
  const input = fs.readFileSync("src/day-5.input.txt", "utf8");

  console.log(partOne(input));
  console.log(partTwo(input));
}
