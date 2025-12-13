import fs from "node:fs";

type Coordinate = [number, number];

export function partOne(input: string) {
  const coords = input
    .split("\n")
    .map((line) => line.split(",").map(Number) as Coordinate);

  let max = 0;

  for (const tileA of coords) {
    for (const tileB of coords) {
      const area = calculateArea(tileA, tileB);
      max = Math.max(max, area);
    }
  }

  return max;
}

function calculateArea(tileA: Coordinate, tileB: Coordinate) {
  const height = 1 + Math.abs(tileA[0] - tileB[0]);
  const width = 1 + Math.abs(tileA[1] - tileB[1]);
  return height * width;
}

export function partTwo(input: string) {
  const redTiles = input
    .split("\n")
    .map((line) => line.split(",").map(Number) as Coordinate);

  const outline: Coordinate[] = [];

  for (const [index, tile] of redTiles.entries()) {
    const previousTile = redTiles.at(index - 1)!;

    const sameRow = tile[1] === previousTile[1];
    const sameCol = tile[0] === previousTile[0];

    if (!sameRow && !sameCol) {
      throw new Error("Tiles are not adjacent in row or column");
    }

    if (sameRow) {
      const direction = tile[0] > previousTile[0] ? 1 : -1;

      for (
        let index = 1;
        index < Math.abs(tile[0] - previousTile[0]);
        index++
      ) {
        outline.push([previousTile[0] + index * direction, tile[1]]);
      }
    }

    if (sameCol) {
      const direction = tile[1] > previousTile[1] ? 1 : -1;

      for (
        let index = 1;
        index < Math.abs(tile[1] - previousTile[1]);
        index++
      ) {
        outline.push([tile[0], previousTile[1] + index * direction]);
      }
    }

    outline.push(tile);
  }

  const scanlines = new Map<number, number[]>();

  for (const [index, current] of outline.entries()) {
    const next = outline[(index + 1) % outline.length];

    if (!next) {
      throw new Error("No next point");
    }

    const [x1, y1] = current;
    const [x2, y2] = next;

    if (x1 !== x2) {
      continue;
    }

    const yMin = Math.min(y1, y2);
    const yMax = Math.max(y1, y2);

    for (const index of Array.from(
      { length: yMax - yMin },
      (_, index_) => yMin + index_,
    )) {
      const list = scanlines.get(index) ?? [];
      scanlines.set(index, [...list, x1]);
    }
  }

  const scanlineMap = new Map<number, Coordinate[]>();

  for (const [y, xVals] of scanlines.entries()) {
    const sorted = xVals.toSorted((a, b) => a - b);

    const intervals = sorted.flatMap((value, index) => {
      if (index % 2 === 0) {
        return [[value, sorted[index + 1]!] as Coordinate];
      }
      return [];
    });

    const merged: Coordinate[] = [];

    for (const [intervalIndex, interval] of intervals.entries()) {
      if (intervalIndex === 0) {
        merged.push(interval);
        continue;
      }

      const last = merged.at(-1);

      if (!last) {
        throw new Error("Unexpected empty output intervals");
      }

      if (last[1] >= interval[0]) {
        last[1] = Math.max(last[1], interval[1]);
        continue;
      }

      merged.push(interval);
    }

    scanlineMap.set(y, merged);
  }

  const pairs = redTiles
    .flatMap((tileA, indexA) => {
      return redTiles.slice(indexA + 1).map((tileB) => {
        return { tileA, tileB, area: calculateArea(tileA, tileB) };
      });
    })
    .toSorted((a, b) => b.area - a.area);

  let max = 0;

  for (const pair_ of pairs) {
    const pair = pair_!;

    if (isContained(scanlineMap, pair.tileA, pair.tileB)) {
      max = pair.area;
      break;
    }
  }

  return max;
}

function isContained(
  scanlineMap: Map<number, Coordinate[]>,
  tileA: Coordinate,
  tileB: Coordinate,
) {
  const minX = Math.min(tileA[0], tileB[0]);
  const maxX = Math.max(tileA[0], tileB[0]);
  const minY = Math.min(tileA[1], tileB[1]);
  const maxY = Math.max(tileA[1], tileB[1]);

  for (let y = minY; y <= maxY; y++) {
    const intervals = scanlineMap.get(y);

    if (!intervals || intervals.length === 0) {
      return false;
    }

    const interval = intervals.find(([startX]) => startX <= minX);

    if (!interval || interval[1] < maxX) {
      return false;
    }
  }

  return true;
}

if (import.meta.url === `file://${process.argv.at(1)}`) {
  const input = fs.readFileSync("src/day-9.input.txt", "utf8");

  console.log(partOne(input));
  console.time("partTwo");
  console.log(partTwo(input));
  console.timeEnd("partTwo");
}
