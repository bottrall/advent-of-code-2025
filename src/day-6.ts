import fs from "node:fs";

export function partOne(input: string) {
  interface Equation {
    operation?: "*" | "+";
    values: number[];
  }

  const lines = input.split("\n");

  const equations: Equation[] = [];

  for (const line of lines) {
    const values = line.split(" ").filter((value) => value.trim() !== "");

    for (const [colIndex, value] of values.entries()) {
      const equation = equations[colIndex];

      if (!equation) {
        equations.push({ values: [Number(value)] });
        continue;
      }

      if (value === "+" || value === "*") {
        equation.operation = value;
      } else {
        equation.values.push(Number(value));
      }
    }
  }

  let sum = 0;

  for (const equation of equations) {
    switch (equation.operation) {
      case "+": {
        sum += equation.values.reduce(
          (accumulator, value) => accumulator + value,
          0,
        );
        break;
      }
      case "*": {
        sum += equation.values.reduce(
          (accumulator, value) => accumulator * value,
          1,
        );
        break;
      }
      default: {
        throw new Error("undefined operation");
      }
    }
  }

  return sum;
}

export function partTwo(input: string) {
  interface Equation {
    operation: "*" | "+";
    values: number[];
  }

  const lines = input.split("\n");
  const operationsLine = lines.pop();

  if (!operationsLine) {
    throw new Error("Invalid input");
  }

  const equations: Equation[] = [];

  for (const [index, char] of [...operationsLine].entries()) {
    if (char === "+" || char === "*") {
      equations.push({
        operation: char,
        values: [deriveValueFromIndex(lines, index)],
      });

      continue;
    }

    const lastEquation = equations.at(-1);

    if (!lastEquation) {
      throw new Error("Invalid equation parsing");
    }

    lastEquation.values.push(deriveValueFromIndex(lines, index));
  }

  let sum = 0;

  for (const equation of equations) {
    switch (equation.operation) {
      case "+": {
        sum += equation.values.reduce(
          (accumulator, value) => accumulator + value,
          0,
        );
        break;
      }
      case "*": {
        sum += equation.values
          .filter((value) => value !== 0)
          .reduce((accumulator, value) => accumulator * value, 1);
        break;
      }
      default: {
        throw new Error("undefined operation");
      }
    }
  }

  return sum;
}

function deriveValueFromIndex(lines: string[], index: number) {
  return Number(lines.map((line) => line.charAt(index)).join(""));
}

if (import.meta.url === `file://${process.argv.at(1)}`) {
  const input = fs.readFileSync("src/day-6.input.txt", "utf8");

  console.log(partOne(input));
  console.log(partTwo(input));
}
