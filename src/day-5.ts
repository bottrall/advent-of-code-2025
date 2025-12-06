import fs from "node:fs";

export function partOne(input: string) {
  const [rangesStr, idsStr] = input.split("\n\n");

  if (!rangesStr || !idsStr) {
    throw new Error("Invalid input");
  }

  const ranges = rangesStr
    .split("\n")
    .map((range) => range.split("-").map(Number) as [number, number])
    .sort((a, b) => a[0] - b[0])
    .reduce<[number, number][]>((merged, current) => {
      const last = merged[merged.length - 1];

      if (last && current[0] <= last[1] + 1) {
        last[1] = Math.max(last[1], current[1]);
      } else {
        merged.push(current);
      }

      return merged;
    }, []);

  return idsStr.split("\n").reduce<number>((sum, idStr) => {
    const id = Number(idStr);
    const inRange = ranges.some(([start, end]) => id >= start && id <= end);
    return sum + (inRange ? 1 : 0);
  }, 0);
}

export function partTwo(input: string) {
  const [rangesStr] = input.split("\n\n");

  if (!rangesStr) {
    throw new Error("Invalid input");
  }

  return rangesStr
    .split("\n")
    .map((range) => range.split("-").map(Number) as [number, number])
    .sort((a, b) => a[0] - b[0])
    .reduce<[number, number][]>((merged, current) => {
      const last = merged[merged.length - 1];

      if (last && current[0] <= last[1] + 1) {
        last[1] = Math.max(last[1], current[1]);
      } else {
        merged.push(current);
      }

      return merged;
    }, [])
    .reduce<number>((sum, [start, end]) => {
      return sum + (end - start + 1);
    }, 0);
}

if (import.meta.url === `file://${process.argv.at(1)}`) {
  const input = fs.readFileSync("src/day-5.input.txt", "utf-8");

  console.log(partOne(input));
  console.log(partTwo(input));
}
