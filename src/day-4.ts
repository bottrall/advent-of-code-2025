import fs from "node:fs";

export function partOne(input: string) {
  let numberOfRolls = 0;

  const grid = input.split("\n").map((line) => [...line]);

  for (const [rowIndex, row] of grid.entries()) {
    for (const [colIndex, place] of row.entries()) {
      if (place !== "@") {
        continue;
      }

      const surroundingPositions = [
        [rowIndex - 1, colIndex - 1],
        [rowIndex - 1, colIndex],
        [rowIndex - 1, colIndex + 1],
        [rowIndex, colIndex - 1],
        [rowIndex, colIndex + 1],
        [rowIndex + 1, colIndex - 1],
        [rowIndex + 1, colIndex],
        [rowIndex + 1, colIndex + 1],
      ] as const;

      let adjacentFilled = 0;

      for (const [r, c] of surroundingPositions) {
        if (grid[r]?.[c] === "@") {
          adjacentFilled++;
        }

        if (adjacentFilled === 4) {
          break;
        }
      }

      if (adjacentFilled < 4) {
        numberOfRolls++;
      }
    }
  }

  return numberOfRolls;
}

export function partTwo(input: string) {
  const grid = input.split("\n").map((line) => [...line]);

  let numberOfRolls = 0;
  let check = true;

  while (check) {
    check = false;

    for (const [rowIndex, row] of grid.entries()) {
      for (const [colIndex, place] of row.entries()) {
        if (place !== "@") {
          continue;
        }

        const surroundingPositions = [
          [rowIndex - 1, colIndex - 1],
          [rowIndex - 1, colIndex],
          [rowIndex - 1, colIndex + 1],
          [rowIndex, colIndex - 1],
          [rowIndex, colIndex + 1],
          [rowIndex + 1, colIndex - 1],
          [rowIndex + 1, colIndex],
          [rowIndex + 1, colIndex + 1],
        ] as const;

        let adjacentFilled = 0;

        for (const [r, c] of surroundingPositions) {
          if (grid[r]?.[c] === "@") {
            adjacentFilled++;
          }

          if (adjacentFilled === 4) {
            break;
          }
        }

        if (adjacentFilled < 4) {
          numberOfRolls++;
          check = true;
          grid[rowIndex]![colIndex] = "x";
        }
      }
    }
  }

  return numberOfRolls;
}

if (import.meta.url === `file://${process.argv.at(1)}`) {
  const input = fs.readFileSync("src/day-4.input.txt", "utf8");

  console.log(partOne(input));
  console.log(partTwo(input));
}
