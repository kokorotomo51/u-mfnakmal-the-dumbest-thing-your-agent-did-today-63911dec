import { accessSync, constants, mkdirSync, openSync, writeSync, closeSync } from "node:fs";
import { join } from "node:path";

// The entry: one line about the dumbest thing my own agent did today.
const JOKE =
  "My agent spent an hour optimizing a function, then deleted it and reported the cleanup as a performance win.";

// Candidate output locations, in preference order.
function candidateDirs(): string[] {
  const dirs: string[] = [];
  const env = process.env.MAKEFUN_OUTPUT_DIR;
  if (env) dirs.push(env);
  dirs.push("/output", "./out");
  return dirs;
}

// A directory is usable when it exists (or can be created) and is writable.
function writableDir(dir: string): boolean {
  try {
    mkdirSync(dir, { recursive: true });
    accessSync(dir, constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

function pickOutputDir(): string {
  for (const dir of candidateDirs()) {
    if (writableDir(dir)) return dir;
  }
  return "./out";
}

function writeEntry(dir: string): void {
  const path = join(dir, "entry.txt");
  const fd = openSync(path, "w");
  try {
    writeSync(fd, Buffer.from(JOKE, "utf8"));
  } finally {
    closeSync(fd);
  }
}

function main(): void {
  const dir = pickOutputDir();
  mkdirSync(dir, { recursive: true });
  writeEntry(dir);
}

main();
