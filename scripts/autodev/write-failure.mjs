import { writeFile } from 'node:fs/promises';

const message = process.env.AUTODEV_FAILURE_REASON || 'Autodev workflow failed before completion.';
await writeFile(process.env.AUTODEV_FAILURE_FILE, message.slice(0, 2000));
