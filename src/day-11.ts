import fs from "node:fs";

export function partOne(input: string) {
  const lines = input.split("\n");

  const graph = new Map<string, string[]>();

  for (const line of lines) {
    const [label, ...outputs] = line.replace(":", "").split(" ");

    if (!label) {
      continue;
    }

    graph.set(label, outputs);
  }

  return countsPaths("you", graph);
}

function countsPaths(
  label: string,
  graph: Map<string, string[]>,
  cache = new Map<string, number>(),
): number {
  const cached = cache.get(label);

  if (cached !== undefined) {
    return cached;
  }

  const outputs = graph.get(label);

  if (!outputs) {
    throw new Error(`No outputs for label: ${label}`);
  }

  if (outputs.length === 1 && outputs.at(0) === "out") {
    return 1;
  }

  const pathCount = outputs.reduce(
    (sum, output) => countsPaths(output, graph, cache) + sum,
    0,
  );

  cache.set(label, pathCount);

  return pathCount;
}

export function partTwo(input: string) {
  const lines = input.split("\n");

  const graph = new Map<string, string[]>();

  for (const line of lines) {
    const [label, ...outputs] = line.replace(":", "").split(" ");

    if (!label) {
      continue;
    }

    graph.set(label, outputs);
  }

  return countsPathsV2("svr", graph);
}

function countsPathsV2(
  label: string,
  graph: Map<string, string[]>,
  cache = new Map<string, [number, boolean, boolean]>(),
  dac = false,
  fft = false,
): number {
  const cached = cache.get(label);

  if (cached !== undefined) {
    const [pathCount, cachedDac, cachedFft] = cached;

    if (dac === cachedDac && fft === cachedFft) {
      return pathCount;
    }
  }

  const outputs = graph.get(label);

  if (!outputs) {
    throw new Error(`No outputs for label: ${label}`);
  }

  const isOut = outputs.length === 1 && outputs.at(0) === "out";

  if (isOut && dac && fft) {
    return 1;
  } else if (isOut) {
    return 0;
  }

  const pathCount = outputs.reduce(
    (sum, output) =>
      countsPathsV2(
        output,
        graph,
        cache,
        dac || output === "dac",
        fft || output === "fft",
      ) + sum,
    0,
  );

  cache.set(label, [pathCount, dac, fft]);

  return pathCount;
}

if (import.meta.url === `file://${process.argv.at(1)}`) {
  const input = fs.readFileSync("src/day-11.input.txt", "utf8");

  console.log(partOne(input));
  console.log(partTwo(input));
}
