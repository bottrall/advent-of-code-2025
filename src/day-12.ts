import fs from "node:fs";

type Cell = [number, number];

interface Variant {
  cells: Cell[];
  width: number;
  height: number;
}

export function partOne(input: string) {
  const blocks = input.split("\n\n");

  const regions = blocks
    .pop()!
    .split("\n")
    .map((line) => generateRegion(line));

  const shapes = blocks.map((block) =>
    block
      .split("\n")
      .flatMap((row, rowIndex) =>
        [...row].flatMap<Cell>((cell, colIndex) =>
          cell === "#" ? [[rowIndex, colIndex]] : [],
        ),
      ),
  );

  const variants = shapes.map((shape) => generateVariants(shape));

  let count = 0;

  for (const region of regions) {
    const pieces = region.quantities.flatMap((quantity, index) => {
      return Array.from<number>({ length: quantity }).fill(index);
    });

    const totalArea = pieces.reduce(
      (sum, index) => sum + (variants.at(index)?.at(0)?.cells.length ?? 0),
      0,
    );

    if (totalArea > region.width * region.height) {
      continue;
    }

    pieces.sort(
      (a, b) =>
        variants.at(b)!.at(0)!.cells.length -
        variants.at(a)!.at(0)!.cells.length,
    );

    const board = new Board(region.width, region.height);

    if (canFitAll(board, pieces, variants)) {
      count++;
    }
  }

  return count;
}

function generateRegion(regionString: string) {
  const [areaString, ...quantitieStrings] = regionString.split(" ");

  const [height, width] = areaString!.replace(":", "").split("x").map(Number);

  if (!height || !width) {
    throw new Error("Invalid region dimensions");
  }

  const quantities = quantitieStrings.map(Number);

  return { height, width, quantities };
}

function generateVariants(baseCells: Cell[]) {
  const seen = new Set<string>();
  const variants: Variant[] = [];

  let cells = baseCells;

  for (let index = 0; index < 4; index++) {
    addCell(cells, seen, variants);
    addCell(flipHorizontal(cells), seen, variants);
    cells = rotate90(cells);
  }

  return variants;
}

function rotate90(cells: Cell[]) {
  return cells.map<Cell>(([x, y]) => [-y, x]);
}

function flipHorizontal(cells: Cell[]) {
  return cells.map<Cell>(([x, y]) => [-x, y]);
}

function addCell(cells: Cell[], seen: Set<string>, variants: Variant[]) {
  let minX = Infinity;
  let minY = Infinity;

  for (const [x, y] of cells) {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
  }

  const norm = cells.map<Cell>(([x, y]) => [x - minX, y - minY]);

  let maxX = 0;
  let maxY = 0;

  for (const [x, y] of norm) {
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  const variant = {
    cells: norm,
    width: maxX + 1,
    height: maxY + 1,
  };

  const key = variant.cells
    .toSorted(([a, b], [c, d]) => a - c || b - d)
    .map(([x, y]) => `${x},${y}`)
    .join("|");

  if (!seen.has(key)) {
    seen.add(key);
    variants.push(variant);
  }
}

class Board {
  width: number;
  height: number;

  occupied: boolean[];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.occupied = Array.from<boolean>({ length: width * height }).fill(false);
  }

  canPlace(variant: Variant, ox: number, oy: number) {
    for (const [dx, dy] of variant.cells) {
      if (this.occupied[this.index(ox + dx, oy + dy)]) {
        return false;
      }
    }
    return true;
  }

  place(variant: Variant, ox: number, oy: number) {
    for (const [dx, dy] of variant.cells) {
      this.occupied[this.index(ox + dx, oy + dy)] = true;
    }
  }

  unplace(variant: Variant, ox: number, oy: number) {
    for (const [dx, dy] of variant.cells) {
      this.occupied[this.index(ox + dx, oy + dy)] = false;
    }
  }

  private index(x: number, y: number) {
    return y * this.width + x;
  }
}

function canFitAll(
  board: Board,
  pieces: number[],
  variants: Variant[][],
  index = 0,
) {
  if (index === pieces.length) {
    return true;
  }

  const shapeId = pieces[index];

  if (typeof shapeId !== "number") {
    throw new TypeError("Invalid shape ID");
  }

  const shapeVariants = variants[shapeId];

  if (!shapeVariants) {
    throw new Error(`No variants for shape ID ${shapeId}`);
  }

  for (const variant of shapeVariants) {
    for (
      let heightIndex = 0;
      heightIndex <= board.height - variant.height;
      heightIndex++
    ) {
      for (
        let widthIndex = 0;
        widthIndex <= board.width - variant.width;
        widthIndex++
      ) {
        if (!board.canPlace(variant, widthIndex, heightIndex)) {
          continue;
        }

        board.place(variant, widthIndex, heightIndex);

        if (canFitAll(board, pieces, variants, index + 1)) {
          return true;
        }

        board.unplace(variant, widthIndex, heightIndex);
      }
    }
  }

  return false;
}

export function partTwo(input: string) {
  return input.length;
}

if (import.meta.url === `file://${process.argv.at(1)}`) {
  const input = fs.readFileSync("src/day-12.input.txt", "utf8");

  console.log(partOne(input));
  console.log(partTwo(input));
}
