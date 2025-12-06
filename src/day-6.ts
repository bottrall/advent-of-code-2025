import fs from "node:fs";

export function partOne(input: string) {
  interface Equation {
    operation: "*" | "+" | null;
    values: number[];
  }

  return input
    .split("\n")
    .reduce<Equation[]>((equations, line) => {
      line
        .split(" ")
        .filter((value) => value.trim() !== "")
        .forEach((value, colIndex) => {
          const equation = equations[colIndex];

          if (!equation) {
            equations.push({ operation: null, values: [Number(value)] });
            return;
          }

          if (value === "+" || value === "*") {
            equation.operation = value;
          } else {
            equation.values.push(Number(value));
          }
        });

      return equations;
    }, [])
    .reduce<number>((sum, equation) => {
      switch (equation.operation) {
        case "+":
          return sum + equation.values.reduce((acc, val) => acc + val, 0);
        case "*":
          return sum + equation.values.reduce((acc, val) => acc * val, 1);
        default:
          throw new Error("Null operation");
      }
    }, 0);
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

  return operationsLine
    .split("")
    .reduce<Equation[]>((equations, char, i) => {
      if (char === "+" || char === "*") {
        equations.push({
          operation: char,
          values: [deriveValueFromIndex(lines, i)],
        });
        return equations;
      }

      const lastEquation = equations[equations.length - 1];

      if (!lastEquation) {
        throw new Error("Invalid equation parsing");
      }

      lastEquation.values.push(deriveValueFromIndex(lines, i));

      return equations;
    }, [])
    .reduce<number>((sum, equation) => {
      switch (equation.operation) {
        case "+":
          return sum + equation.values.reduce((acc, val) => acc + val, 0);
        case "*":
          return (
            sum +
            equation.values
              .filter((val) => val !== 0)
              .reduce((acc, val) => acc * val, 1)
          );
      }
    }, 0);
}

function deriveValueFromIndex(lines: string[], index: number) {
  return Number(lines.map((line) => line.charAt(index)).join(""));
}

if (import.meta.url === `file://${process.argv.at(1)}`) {
  const input = fs.readFileSync("src/day-6.input.txt", "utf-8");

  console.log(partOne(input));
  console.log(partTwo(input));
}
