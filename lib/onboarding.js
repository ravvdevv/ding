import inquirer from 'inquirer';
import { saveConfig } from './config.js';

const WEBHOOK_PREFIX = 'https://discord.com/api/webhooks/';

/**
 * Runs first-time setup: prompts for webhook, validates, saves, returns config.
 * @returns {{ webhook: string }}
 */
export async function runOnboarding() {
  console.log('\n  Welcome to ding!\n');

  const { webhook } = await inquirer.prompt([
    {
      type: 'input',
      name: 'webhook',
      message: 'Discord Webhook URL:',
      validate(input) {
        const trimmed = input.trim();
        if (!trimmed.startsWith(WEBHOOK_PREFIX)) {
          return `Must start with: ${WEBHOOK_PREFIX}`;
        }
        return true;
      },
      filter: (input) => input.trim(),
    },
  ]);

  const config = { webhook };
  await saveConfig(config);

  console.log("\n  Setup complete. You're ready.\n");
  return config;
}
