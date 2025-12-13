import fs from "node:fs";

export function partOne(input: string) {
  const lines = input.split("\n");

  const beamIndices = new Set<number>();

  let splitCount = 0;

  for (const [lineIndex, line] of lines.entries()) {
    if (lineIndex === 0) {
      beamIndices.add(line.indexOf("S"));
    }

    for (const index of beamIndices) {
      if (line[index] === "^") {
        splitCount += 1;
        beamIndices.delete(index);
        beamIndices.add(index - 1);
        beamIndices.add(index + 1);
      }
    }
  }

  return splitCount;
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
  cache = new Map<string, number>(),
) {
  const cacheKey = `${beamIndex}-${lines.length}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  let sum = 1;

  for (const [index, line] of lines.entries()) {
    if (line[beamIndex] === "^") {
      sum += timeline(lines.slice(index + 1), beamIndex + 1, cache);
      beamIndex -= 1;
    }
  }

  cache.set(cacheKey, sum);

  return sum;
}

if (import.meta.url === `file://${process.argv.at(1)}`) {
  const input = fs.readFileSync("src/day-7.input.txt", "utf8");

  console.log(partOne(input));
  console.log(partTwo(input));
}
