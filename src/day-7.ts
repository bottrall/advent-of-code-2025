import fs from "node:fs";

export function partOne(input: string) {
  const initialState = {
    splitCount: 0,
    beamIndices: new Set<number>(),
  };

  return input.split("\n").reduce<typeof initialState>((acc, line, i) => {
    if (i === 0) {
      acc.beamIndices.add(line.indexOf("S"));
    }

    acc.beamIndices.forEach((index) => {
      if (line[index] === "^") {
        acc.splitCount += 1;
        acc.beamIndices.delete(index);
        acc.beamIndices.add(index - 1);
        acc.beamIndices.add(index + 1);
      }
    });

    return acc;
  }, initialState).splitCount;
}

export function partTwo(input: string) {
  const [startLine, ...lines] = input.split("\n");

  if (!startLine) {
    throw new Error("Invalid input");
  }

  return timeline(lines, startLine.indexOf("S"));
}

function timeline(
  lines: string[],
  beamIndex: number,
  cache = new Map<string, number>()
) {
  const cacheKey = `${beamIndex}-${lines.length}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  let sum = 1;

  lines.forEach((line, i) => {
    if (line[beamIndex] === "^") {
      sum += timeline(lines.slice(i + 1), beamIndex + 1, cache);
      beamIndex -= 1;
    }
  });

  cache.set(cacheKey, sum);

  return sum;
}

if (import.meta.url === `file://${process.argv.at(1)}`) {
  const input = fs.readFileSync("src/day-7.input.txt", "utf-8");

  console.log(partOne(input));
  console.log(partTwo(input));
}
