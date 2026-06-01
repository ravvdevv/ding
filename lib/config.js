import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import process from 'process';

const GLOBAL_CONFIG_DIR = path.join(os.homedir(), '.ding');
const GLOBAL_CONFIG_PATH = path.join(GLOBAL_CONFIG_DIR, 'config.json');
const LOCAL_CONFIG_PATH = path.join(process.cwd(), '.ding', 'config.json');

/**
 * Returns the active config.
 * Prefers a project-local .ding/config.json over ~/.ding/config.json.
 * Returns null if no valid config is found.
 */
export async function getConfig() {
  // Project-local override
  try {
    const local = await fs.readJson(LOCAL_CONFIG_PATH);
    if (local?.webhook) return local;
  } catch {}

  // Global fallback
  try {
    const global = await fs.readJson(GLOBAL_CONFIG_PATH);
    if (global?.webhook) return global;
  } catch {}

  return null;
}

/**
 * Persists config to ~/.ding/config.json.
 * @param {{ webhook: string }} config
 */
export async function saveConfig(config) {
  await fs.ensureDir(GLOBAL_CONFIG_DIR);
  await fs.writeJson(GLOBAL_CONFIG_PATH, config, { spaces: 2 });
}
