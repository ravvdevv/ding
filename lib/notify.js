import axios from 'axios';
import process from 'process';

/**
 * Sends a message to Discord via webhook.
 *
 * @param {string} message
 * @param {{ webhook: string }} config
 * @param {{ silent?: boolean }} options  silent=true suppresses the "✓ Sent" line (used by runner)
 */
export async function sendNotification(message, config, { silent = false } = {}) {
  if (!config?.webhook) {
    console.error(
      'Error: No webhook configured. Delete ~/.ding/config.json and re-run ding to reconfigure.'
    );
    process.exit(1);
  }

  try {
    await axios.post(
      config.webhook,
      { content: message },
      {
        timeout: 8000,
        headers: { 'Content-Type': 'application/json' },
      }
    );
    if (!silent) console.log('✓ Sent');
  } catch (err) {
    const status = err.response?.status;

    if (status === 400) {
      console.error('Error: Discord rejected the message. It may be too long or malformed.');
    } else if (status === 401 || status === 403) {
      console.error('Error: Webhook unauthorized. Verify your webhook URL.');
    } else if (status === 404) {
      console.error('Error: Webhook not found. It may have been deleted from Discord.');
    } else if (status) {
      console.error(`Error: Discord returned HTTP ${status}.`);
    } else if (err.code === 'ECONNABORTED') {
      console.error('Error: Request timed out. Check your connection.');
    } else {
      console.error('Error: Network failure. Check your connection.');
    }

    process.exit(1);
  }
}
