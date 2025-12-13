import fs from "node:fs";

type Point = [number, number, number];

export function partOne(input: string) {
  const junctionBoxes = input
    .split("\n")
    .map((line) => line.split(",").map(Number) as Point);

  return junctionBoxes
    .reduce<Point[]>((acc, junctionBoxA, i) => {
      junctionBoxes.slice(i + 1).forEach((junctionBoxB, j) => {
        acc.push([i, i + 1 + j, distance(junctionBoxA, junctionBoxB)]);
      });

      return acc;
    }, [])
    .sort((a, b) => a[2] - b[2])
    .splice(0, 1000)
    .reduce(
      (circuits, [junctionBoxA, junctionBoxB]) => {
        const rootX = findRootJunctionBox(circuits.connections, junctionBoxA);
        const rootY = findRootJunctionBox(circuits.connections, junctionBoxB);

        if (rootX === rootY) {
          return circuits;
        }

        if (circuits.sizes[rootX] < circuits.sizes[rootY]) {
          circuits.connections[rootX] = rootY;
          circuits.sizes[rootY] += circuits.sizes[rootX];
        } else {
          circuits.connections[rootY] = rootX;
          circuits.sizes[rootX] += circuits.sizes[rootY];
        }

        return circuits;
      },
      {
        connections: Array.from(junctionBoxes, (_, i) => i),
        sizes: Array(junctionBoxes.length).fill(1),
      },
    )
    .sizes.sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((prod, s) => prod * s, 1);
}

export function partTwo(input: string) {
  const junctionBoxes = input
    .split("\n")
    .map((line) => line.split(",").map(Number) as Point);

  return junctionBoxes
    .reduce<Point[]>((acc, junctionBoxA, i) => {
      junctionBoxes.slice(i + 1).forEach((junctionBoxB, j) => {
        acc.push([i, i + 1 + j, distance(junctionBoxA, junctionBoxB)]);
      });

      return acc;
    }, [])
    .sort((a, b) => a[2] - b[2])
    .reduce(
      (circuits, [junctionBoxA, junctionBoxB]) => {
        const rootX = findRootJunctionBox(circuits.connections, junctionBoxA);
        const rootY = findRootJunctionBox(circuits.connections, junctionBoxB);

        if (rootX === rootY) {
          return circuits;
        }

        circuits.history.push([junctionBoxA, junctionBoxB]);

        if (circuits.sizes[rootX] < circuits.sizes[rootY]) {
          circuits.connections[rootX] = rootY;
          circuits.sizes[rootY] += circuits.sizes[rootX];
        } else {
          circuits.connections[rootY] = rootX;
          circuits.sizes[rootX] += circuits.sizes[rootY];
        }

        return circuits;
      },
      {
        connections: Array.from(junctionBoxes, (_, i) => i),
        sizes: Array(junctionBoxes.length).fill(1),
        history: [] as Array<[number, number]>,
      },
    )
    .history.pop()!
    .reduce((product, junctionBoxIndex) => {
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
  const input = fs.readFileSync("src/day-8.input.txt", "utf-8");

  console.log(partOne(input));
  console.log(partTwo(input));
}
