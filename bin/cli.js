#!/usr/bin/env node

import process from 'process';
import { getConfig } from '../lib/config.js';
import { runOnboarding } from '../lib/onboarding.js';
import { sendNotification } from '../lib/notify.js';
import { runCommand } from '../lib/runner.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Reads all of stdin. Returns null if stdin is a TTY (not piped) or empty.
 * @returns {Promise<string|null>}
 */
async function readStdin() {
  if (process.stdin.isTTY) return null;
  return new Promise((resolve) => {
    let buf = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => (buf += chunk));
    process.stdin.on('end', () => resolve(buf.trim() || null));
  });
}

function printHelp() {
  console.log(`
  ding — Discord notifications from your terminal

  Usage:
    ding -m "message"         Send a notification
    ding run "<command>"      Run a command and notify on completion
    echo "msg" | ding         Send piped input as a notification

  Config stored at: ~/.ding/config.json
  Override per-project with: .ding/config.json
`);
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);

// Short-circuit: help flags never need config
if (args[0] === '--help' || args[0] === '-h') {
  printHelp();
  process.exit(0);
}

// First-run: trigger onboarding if no config exists.
// Requires an interactive TTY — can't prompt in a piped context.
let config = await getConfig();
if (!config) {
  if (!process.stdout.isTTY) {
    console.error('Error: No config found. Run `ding` in an interactive terminal to set up.');
    process.exit(1);
  }
  config = await runOnboarding();
}

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------

if (args[0] === 'run') {
  // ding run "<command>"  OR  ding run npm run test
  const cmd = args.slice(1).join(' ').trim();
  if (!cmd) {
    console.error('Usage: ding run "<command>"');
    process.exit(1);
  }
  const code = await runCommand(cmd, config);
  process.exit(code);

} else if (args[0] === '-m') {
  // ding -m "message"          → args[1] is the message
  // echo "msg" | ding -m       → args[1] absent, read stdin
  // ding -m ""                 → args[1] present but empty, error
  let message;
  if (args.length >= 2) {
    // Explicit argument given (may be empty string — that's an error)
    message = args[1].trim() || null;
  } else {
    // No argument: check piped stdin
    message = await readStdin();
  }

  if (!message) {
    console.error('Error: No message provided.\nUsage: ding -m "your message"');
    process.exit(1);
  }
  await sendNotification(message, config);

} else if (args.length === 0) {
  // echo "done" | ding
  const message = await readStdin();
  if (message) {
    await sendNotification(message, config);
  } else {
    printHelp();
  }

} else {
  console.error(`Unknown command: ${args[0]}`);
  console.error('Run `ding --help` for usage.');
  process.exit(1);
}
