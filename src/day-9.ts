import fs from "node:fs";

type Coordinate = [number, number];

export function partOne(input: string) {
  return input
    .split("\n")
    .map((line) => line.split(",").map(Number) as Coordinate)
    .reduce((max, tileA, i, tiles) => {
      tiles.slice(i + 1).forEach((tileB) => {
        const area = calculateArea(tileA, tileB);
        max = Math.max(max, area);
      });

      return max;
    }, 0);
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

  const scanlines = redTiles
    .reduce<Coordinate[]>((tiles, tile, i) => {
      const prevTile = redTiles.at(i - 1)!;

      const sameRow = tile[1] === prevTile[1];
      const sameCol = tile[0] === prevTile[0];

      if (!sameRow && !sameCol) {
        throw new Error("Tiles are not adjacent in row or column");
      }

      if (sameRow) {
        const direction = tile[0] > prevTile[0] ? 1 : -1;

        for (let j = 1; j < Math.abs(tile[0] - prevTile[0]); j++) {
          tiles.push([prevTile[0] + j * direction, tile[1]]);
        }
      }

      if (sameCol) {
        const direction = tile[1] > prevTile[1] ? 1 : -1;

        for (let j = 1; j < Math.abs(tile[1] - prevTile[1]); j++) {
          tiles.push([tile[0], prevTile[1] + j * direction]);
        }
      }

      tiles.push(tile);

      return tiles;
    }, [])
    .reduce((acc, curr, i, outline) => {
      const next = outline[(i + 1) % outline.length];

      if (!next) {
        throw new Error("No next point");
      }

      const [x1, y1] = curr;
      const [x2, y2] = next;

      if (x1 !== x2) {
        return acc;
      }

      const yMin = Math.min(y1, y2);
      const yMax = Math.max(y1, y2);

      Array.from({ length: yMax - yMin }, (_, j) => yMin + j).forEach((j) => {
        const list = acc.get(j) ?? [];
        acc.set(j, [...list, x1]);
      });

      return acc;
    }, new Map<number, number[]>());

  const scanlineMap = Array.from(scanlines.entries()).reduce(
    (acc, [y, xVals]) => {
      const sorted = [...xVals].sort((a, b) => a - b);

      const intervals = sorted.reduce<Coordinate[]>((pairs, x, i) => {
        if (i % 2 === 0) {
          return [...pairs, [x, sorted[i + 1]!]];
        }
        return pairs;
      }, []);

      const merged = intervals.reduce<Coordinate[]>((out, curr) => {
        if (out.length === 0) {
          return [curr];
        }

        const last = out[out.length - 1];

        if (!last) {
          throw new Error("Unexpected empty output intervals");
        }

        if (last[1] >= curr[0]) {
          last[1] = Math.max(last[1], curr[1]);
          return out;
        }

        return [...out, curr];
      }, []);

      acc.set(y, merged);

      return acc;
    },
    new Map<number, Coordinate[]>(),
  );

  const pairs = redTiles
    .reduce<{ tileA: Coordinate; tileB: Coordinate; area: number }[]>(
      (acc, tileA, i, tiles) => {
        tiles.slice(i + 1).forEach((tileB) => {
          acc.push({ tileA, tileB, area: calculateArea(tileA, tileB) });
        });

        return acc;
      },
      [],
    )
    .sort((a, b) => b.area - a.area);

  let max = 0;

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i]!;

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
  const input = fs.readFileSync("src/day-9.input.txt", "utf-8");

  console.log(partOne(input));
  console.time("partTwo");
  console.log(partTwo(input));
  console.timeEnd("partTwo");
}
