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
    opsPerSecond: number;
  };
  partTwo: {
    opsPerSecond: number;
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
    const result = await benchmarkDay(file, runtime, (part, elapsed, ops) => {
      process.stdout.write(`\r    ${part}: ${elapsed}s elapsed, ${ops} ops`);
    });
    process.stdout.write("\r");
    results.push(result);

    console.log(`    Part 1: ${result.partOne.opsPerSecond} ops/s`);
    console.log(`    Part 2: ${result.partTwo.opsPerSecond} ops/s`);
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

const DURATION_SECONDS = 60;

async function benchmarkDay(
  dayFile: string,
  runtime: string,
  onProgress?: (part: string, elapsed: number, ops: number) => void,
) {
  const module: DayModule = await import(`./${dayFile}`);
  const inputFile = dayFile.replace(".ts", ".input.txt");
  const input = fs.readFileSync(path.join("src", inputFile), "utf8");

  const partOneResults = benchmarkFunction(
    () => module.partOne(input),
    DURATION_SECONDS,
    (elapsed, ops) => onProgress?.("Part 1", elapsed, ops),
  );

  const partTwoResults = benchmarkFunction(
    () => module.partTwo(input),
    DURATION_SECONDS,
    (elapsed, ops) => onProgress?.("Part 2", elapsed, ops),
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
  durationSeconds: number,
  onProgress?: (elapsedSeconds: number, operations: number) => void,
) {
  const startTime = performance.now();
  const endTime = startTime + durationSeconds * 1000;
  let operations = 0;
  let lastProgressUpdate = startTime;

  while (performance.now() < endTime) {
    function_();
    operations++;

    const now = performance.now();
    if (now - lastProgressUpdate >= 1000) {
      const elapsed = Math.floor((now - startTime) / 1000);
      onProgress?.(elapsed, operations);
      lastProgressUpdate = now;
    }
  }

  const actualDuration = (performance.now() - startTime) / 1000;
  const opsPerSecond = operations / actualDuration;

  return {
    opsPerSecond: Number(opsPerSecond.toFixed(2)),
  };
}

async function saveResults(runtime: string, results: BenchmarkResult[]) {
  const filename = `benchmark-${runtime}.json`;

  const data = {
    runtime,
    lastUpdated: new Date().toISOString(),
    durationSeconds: DURATION_SECONDS,
    results,
  };

  fs.writeFileSync(filename, JSON.stringify(data, undefined, 2));

  console.log(`💾 Results saved to ${filename}`);
}

if (import.meta.url === `file://${process.argv.at(1)}`) {
  await main();
}
