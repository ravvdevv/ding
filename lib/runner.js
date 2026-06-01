import { spawn } from 'child_process';
import os from 'os';
import { sendNotification } from './notify.js';

const HOSTNAME = os.hostname();

/**
 * Formats elapsed milliseconds into a human-readable duration string.
 * @param {number} ms
 * @returns {string}
 */
function fmtDuration(ms) {
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(1)}s`;
  const m = Math.floor(s / 60);
  const rem = (s % 60).toFixed(0).padStart(2, '0');
  return `${m}m ${rem}s`;
}

/**
 * Executes a shell command with inherited stdio, then sends a Discord
 * notification on completion (success or failure).
 *
 * @param {string} cmd  Shell command to run
 * @param {{ webhook: string }} config
 * @returns {Promise<number>} Resolves with the command's exit code
 */
export async function runCommand(cmd, config) {
  const start = Date.now();

  return new Promise((resolve) => {
    const child = spawn(cmd, { shell: true, stdio: 'inherit' });

    // Spawn-level errors (e.g. shell not found)
    child.on('error', async (err) => {
      const duration = fmtDuration(Date.now() - start);
      const message = [
        '❌ Command failed',
        `Command: ${cmd}`,
        `Error: ${err.message}`,
        `Duration: ${duration}`,
        `Host: ${HOSTNAME}`,
      ].join('\n');

      await sendNotification(message, config, { silent: true });
      resolve(1);
    });

    child.on('close', async (code) => {
      const duration = fmtDuration(Date.now() - start);
      const exitCode = code ?? 1;
      const success = exitCode === 0;

      const message = success
        ? [
            '✅ Command finished',
            `Command: ${cmd}`,
            `Duration: ${duration}`,
            `Host: ${HOSTNAME}`,
          ].join('\n')
        : [
            '❌ Command failed',
            `Command: ${cmd}`,
            `Exit code: ${exitCode}`,
            `Duration: ${duration}`,
            `Host: ${HOSTNAME}`,
          ].join('\n');

      await sendNotification(message, config, { silent: true });
      resolve(exitCode);
    });
  });
}
