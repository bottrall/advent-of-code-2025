import fs from "node:fs";
import path from "node:path";

interface DayModule {
  partOne: (input: string) => unknown;
  partTwo: (input: string) => unknown;
}

interface BenchmarkResult {
  day: string;
  runtime: string;
  partOne: {
    minMs: number;
    p50Ms: number;
    p75Ms: number;
    p99Ms: number;
    maxMs: number;
  };
  partTwo: {
    minMs: number;
    p50Ms: number;
    p75Ms: number;
    p99Ms: number;
    maxMs: number;
  };
}

async function main() {
  const runtime = process.env.RUNTIME || "unknown";
  const results = await runBenchmarks(runtime);

  await saveResults(runtime, results);

  console.log(`\n✅ Benchmark results saved to benchmark-${runtime}.json`);
}

async function runBenchmarks(runtime: string) {
  const results: BenchmarkResult[] = [];

  const filename = `benchmark-${runtime}.json`;
  const existingResults = loadExistingResults(filename);

  const files = fs
    .readdirSync("src")
    .filter((file) => file.startsWith("day-") && file.endsWith(".ts"))
    .toSorted();

  console.log(`\n🏃 Running benchmarks with ${runtime}...`);

  for (const file of files) {
    const dayName = file.replace(".ts", "");

    // Skip if already benchmarked
    if (existingResults.has(dayName)) {
      console.log(`  ⏭️  Skipping ${file} (already benchmarked)`);
      results.push(existingResults.get(dayName)!);
      continue;
    }

    console.log(`  Benchmarking ${file}...`);
    const result = await benchmarkDay(file, runtime, (part, current, total) => {
      process.stdout.write(`\r    ${part}: ${current}/${total} iterations`);
    });
    process.stdout.write("\r");
    results.push(result);

    console.log(
      `    Part 1: ${result.partOne.p50Ms}ms (min: ${result.partOne.minMs}ms, p99: ${result.partOne.p99Ms}ms, max: ${result.partOne.maxMs}ms)`,
    );
    console.log(
      `    Part 2: ${result.partTwo.p50Ms}ms (min: ${result.partTwo.minMs}ms, p99: ${result.partTwo.p99Ms}ms, max: ${result.partTwo.maxMs}ms)`,
    );
  }

  return results;
}

function loadExistingResults(filename: string): Map<string, BenchmarkResult> {
  const map = new Map<string, BenchmarkResult>();

  if (fs.existsSync(filename)) {
    try {
      const data = JSON.parse(fs.readFileSync(filename, "utf8"));
      if (data.results && Array.isArray(data.results)) {
        for (const result of data.results) {
          map.set(result.day, result);
        }
      }
    } catch {
      console.warn(`⚠️  Could not load existing results from ${filename}`);
    }
  }

  return map;
}

const ITERATIONS = 1000;

async function benchmarkDay(
  dayFile: string,
  runtime: string,
  onProgress?: (part: string, current: number, total: number) => void,
) {
  const module: DayModule = await import(`./${dayFile}`);
  const inputFile = dayFile.replace(".ts", ".input.txt");
  const input = fs.readFileSync(path.join("src", inputFile), "utf8");

  const partOneResults = benchmarkFunction(
    () => module.partOne(input),
    ITERATIONS,
    (current, total) => onProgress?.("Part 1", current, total),
  );

  const partTwoResults = benchmarkFunction(
    () => module.partTwo(input),
    ITERATIONS,
    (current, total) => onProgress?.("Part 2", current, total),
  );

  return {
    day: dayFile.replace(".ts", ""),
    runtime,
    partOne: partOneResults,
    partTwo: partTwoResults,
  };
}

function benchmarkFunction(
  function_: () => unknown,
  iterations: number,
  onProgress?: (current: number, total: number) => void,
) {
  const times: number[] = [];

  for (let index = 0; index < iterations; index++) {
    onProgress?.(index + 1, iterations);
    const start = performance.now();
    function_();
    const end = performance.now();
    times.push(end - start);
  }

  times.sort((a, b) => a - b);

  const min = times[0]!;
  const max = times.at(-1)!;
  const p50 = times[Math.floor(times.length * 0.5)]!;
  const p75 = times[Math.floor(times.length * 0.75)]!;
  const p99 = times[Math.floor(times.length * 0.99)]!;

  return {
    minMs: Number(min.toFixed(4)),
    p50Ms: Number(p50.toFixed(4)),
    p75Ms: Number(p75.toFixed(4)),
    p99Ms: Number(p99.toFixed(4)),
    maxMs: Number(max.toFixed(4)),
  };
}

async function saveResults(runtime: string, results: BenchmarkResult[]) {
  const filename = `benchmark-${runtime}.json`;

  const data = {
    runtime,
    lastUpdated: new Date().toISOString(),
    iterations: ITERATIONS,
    results,
  };

  fs.writeFileSync(filename, JSON.stringify(data, undefined, 2));

  console.log(`💾 Results saved to ${filename}`);
}

if (import.meta.url === `file://${process.argv.at(1)}`) {
  await main();
}
