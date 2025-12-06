import fs from "node:fs";

export function partOne(input: string) {
  let numOfRolls = 0;

  const grid = input.split("\n").map((line) => line.split(""));

  grid.forEach((row, rowIndex) => {
    row.forEach((place, colIndex) => {
      if (place !== "@") {
        return;
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
        numOfRolls++;
      }
    });
  });

  return numOfRolls;
}

export function partTwo(input: string) {
  const grid = input.split("\n").map((line) => line.split(""));

  let numOfRolls = 0;
  let check = true;

  while (check) {
    check = false;

    grid.forEach((row, rowIndex) => {
      row.forEach((place, colIndex) => {
        if (place !== "@") {
          return;
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
          numOfRolls++;
          check = true;
          grid[rowIndex]![colIndex] = "x";
        }
      });
    });
  }

  return numOfRolls;
}

if (import.meta.url === `file://${process.argv.at(1)}`) {
  const input = fs.readFileSync("src/day-4.input.txt", "utf-8");

  console.log(partOne(input));
  console.log(partTwo(input));
}
