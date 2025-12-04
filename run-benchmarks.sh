#!/bin/bash

echo "🎄 Advent of Code 2025 - Benchmark Suite"
echo "========================================"

# Run with Node.js
if command -v node &> /dev/null; then
  echo ""
  echo "📦 Node.js version: $(node --version)"
  RUNTIME="node" node src/benchmark.ts
else
  echo "⚠️  Node.js not found, skipping..."
fi

# Run with Bun
if command -v bun &> /dev/null; then
  echo ""
  echo "🍞 Bun version: $(bun --version)"
  RUNTIME="bun" bun src/benchmark.ts
else
  echo "⚠️  Bun not found, skipping..."
fi

# Run with Deno
if command -v deno &> /dev/null; then
  echo ""
  echo "🦕 Deno version: $(deno --version | head -n 1)"
  RUNTIME="deno" deno run --allow-read --allow-write --allow-env --allow-sys src/benchmark.ts
else
  echo "⚠️  Deno not found, skipping..."
fi

# Aggregate all benchmark results
echo ""
echo "📊 Aggregating benchmark results..."
if command -v node &> /dev/null; then
  node src/aggregate-benchmarks.ts
elif command -v bun &> /dev/null; then
  bun src/aggregate-benchmarks.ts
elif command -v deno &> /dev/null; then
  deno run --allow-read --allow-write src/aggregate-benchmarks.ts
else
  echo "⚠️  No runtime available to aggregate results"
fi

echo ""
echo "========================================"
echo "✨ All benchmarks complete!"
echo "📊 Results saved to BENCHMARKS.md"
