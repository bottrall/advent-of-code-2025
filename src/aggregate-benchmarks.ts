import fs from "node:fs";
import { format } from "prettier";

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

interface BenchmarkFile {
  runtime: string;
  lastUpdated: string;
  durationSeconds: number;
  results: BenchmarkResult[];
}

async function main() {
  const benchmarkFiles = fs
    .readdirSync(".")
    .filter((file) => file.startsWith("benchmark-") && file.endsWith(".json"));

  if (benchmarkFiles.length === 0) {
    console.log("⚠️  No benchmark files found");
    return;
  }

  console.log(`📊 Found ${benchmarkFiles.length} benchmark file(s)`);

  const allData: BenchmarkFile[] = [];

  for (const file of benchmarkFiles) {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    allData.push(data);
    console.log(`  ✓ Loaded ${file}`);
  }

  if (allData.length === 0) {
    console.log("⚠️  No valid benchmark data found");
    return;
  }

  const resultsByDay = new Map<string, BenchmarkResult[]>();

  let durationSeconds = 0;

  for (const data of allData) {
    durationSeconds = data.durationSeconds;

    for (const result of data.results) {
      if (!resultsByDay.has(result.day)) {
        resultsByDay.set(result.day, []);
      }
      resultsByDay.get(result.day)!.push(result);
    }
  }

  await generateReport(resultsByDay, durationSeconds);

  console.log("\n✅ Aggregated benchmark results saved to BENCHMARKS.md");
}

async function generateReport(
  resultsByDay: Map<string, BenchmarkResult[]>,
  durationSeconds: number,
) {
  let markdown = `# Advent of Code 2025 - Benchmark Results\n\n`;
  markdown += `Last updated: ${new Date().toLocaleString()}\n`;
  markdown += `Duration per test: ${durationSeconds} seconds\n\n`;

  // Sort days
  const sortedDays = [...resultsByDay.keys()].toSorted();

  for (const day of sortedDays) {
    const results = resultsByDay.get(day)!;
    const dayName = day.replace("day-", "Day ");

    markdown += `## ${dayName.charAt(0).toUpperCase() + dayName.slice(1)}\n\n`;

    // Sort results by runtime
    results.sort((a, b) => a.runtime.localeCompare(b.runtime));

    // Part 1 table
    markdown += `### Part 1\n\n`;
    markdown += `| Runtime | Ops/Second |\n`;
    markdown += `| ------- | ---------- |\n`;

    for (const result of results) {
      const runtimeName =
        result.runtime.charAt(0).toUpperCase() + result.runtime.slice(1);
      markdown += `| ${runtimeName} | ${result.partOne.opsPerSecond} |\n`;
    }

    // Part 2 table
    markdown += `\n### Part 2\n\n`;
    markdown += `| Runtime | Ops/Second |\n`;
    markdown += `| ------- | ---------- |\n`;

    for (const result of results) {
      const runtimeName =
        result.runtime.charAt(0).toUpperCase() + result.runtime.slice(1);
      markdown += `| ${runtimeName} | ${result.partTwo.opsPerSecond} |\n`;
    }

    markdown += `\n`;
  }

  const prettierMarkdown = await format(markdown, { parser: "markdown" });

  fs.writeFileSync("BENCHMARKS.md", prettierMarkdown);
  console.log(`📄 Markdown report generated: BENCHMARKS.md`);
}

if (import.meta.url === `file://${process.argv.at(1)}`) {
  await main();
}
