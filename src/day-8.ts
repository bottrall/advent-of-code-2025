import fs from "node:fs";

type Point = [number, number, number];

export function partOne(input: string) {
  const junctionBoxes = input
    .split("\n")
    .map((line) => line.split(",").map(Number) as Point);

  const pairs = junctionBoxes
    .flatMap((junctionBoxA, indexA) => {
      return junctionBoxes.slice(indexA + 1).map((junctionBoxB, indexB) => {
        return [
          indexA,
          indexA + 1 + indexB,
          distance(junctionBoxA, junctionBoxB),
        ] as const;
      });
    })
    .toSorted((a, b) => a[2] - b[2])
    .splice(0, 1000);

  const connections = Array.from(junctionBoxes, (_, index) => index);
  const sizes = Array.from(junctionBoxes, () => 1);

  for (const [junctionBoxA, junctionBoxB] of pairs) {
    const rootX = findRootJunctionBox(connections, junctionBoxA);
    const rootY = findRootJunctionBox(connections, junctionBoxB);

    if (rootX === rootY) {
      continue;
    }

    if (sizes[rootX]! < sizes[rootY]!) {
      connections[rootX] = rootY;
      sizes[rootY]! += sizes[rootX]!;
    } else {
      connections[rootY] = rootX;
      sizes[rootX]! += sizes[rootY]!;
    }
  }

  return sizes
    .toSorted((a, b) => b - a)
    .slice(0, 3)
    .reduce((production, s) => production * s, 1);
}

export function partTwo(input: string) {
  const junctionBoxes = input
    .split("\n")
    .map((line) => line.split(",").map(Number) as Point);

  const pairs = junctionBoxes
    .flatMap((junctionBoxA, indexA) => {
      return junctionBoxes.slice(indexA + 1).map((junctionBoxB, indexB) => {
        return [
          indexA,
          indexA + 1 + indexB,
          distance(junctionBoxA, junctionBoxB),
        ] as const;
      });
    })
    .toSorted((a, b) => a[2] - b[2]);

  const connections = Array.from(junctionBoxes, (_, index) => index);
  const sizes = Array.from(junctionBoxes, () => 1);
  const history: Array<[number, number]> = [];

  for (const [junctionBoxA, junctionBoxB] of pairs) {
    const rootX = findRootJunctionBox(connections, junctionBoxA);
    const rootY = findRootJunctionBox(connections, junctionBoxB);

    if (rootX === rootY) {
      continue;
    }

    history.push([junctionBoxA, junctionBoxB]);

    if (sizes[rootX]! < sizes[rootY]!) {
      connections[rootX] = rootY;
      sizes[rootY]! += sizes[rootX]!;
    } else {
      connections[rootY] = rootX;
      sizes[rootX]! += sizes[rootY]!;
    }
  }

  return history.pop()!.reduce((product, junctionBoxIndex) => {
    return junctionBoxes[junctionBoxIndex]![0] * product;
  }, 1);
}

function distance(a: Point, b: Point) {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];

  return dx * dx + dy * dy + dz * dz;
}

function findRootJunctionBox(connections: number[], index: number): number {
  if (connections[index] === index) {
    return connections[index];
  }

  connections[index] = findRootJunctionBox(connections, connections[index]!);

  return connections[index];
}

if (import.meta.url === `file://${process.argv.at(1)}`) {
  const input = fs.readFileSync("src/day-8.input.txt", "utf8");

  console.log(partOne(input));
  console.log(partTwo(input));
}
