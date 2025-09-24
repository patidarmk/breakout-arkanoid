/**
 * cleanup-esbuild.js
 *
 * Attempt to locate and unlink esbuild.exe under node_modules/@esbuild.
 * This is a helper script to remove stale or incorrectly-permissioned esbuild binaries.
 *
 * Note: If a process (node/vite/antivirus) has the file open this will fail with EPERM.
 * In that case stop the process or reboot and try again.
 */
const fs = require('fs');
const path = require('path');

async function findEsbuild() {
  const root = process.cwd();
  const esbuildDir = path.join(root, 'node_modules', '@esbuild');
  const results = [];

  try {
    const stat = await fs.promises.stat(esbuildDir);
    if (!stat.isDirectory()) return results;
  } catch (err) {
    return results;
  }

  const entries = await fs.promises.readdir(esbuildDir, { withFileTypes: true });
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    // look for esbuild.exe inside each platform-specific directory
    const candidate = path.join(esbuildDir, e.name, 'esbuild.exe');
    try {
      await fs.promises.access(candidate, fs.constants.F_OK);
      results.push(candidate);
    } catch {
      // not present
    }
  }
  return results;
}

async function tryUnlink(file) {
  try {
    // try to make writable first
    await fs.promises.chmod(file, 0o666).catch(() => {});
    await fs.promises.unlink(file);
    console.log(`[OK] Deleted: ${file}`);
    return true;
  } catch (err) {
    console.error(`[ERR] Could not delete: ${file}`);
    console.error(`       ${err && err.code ? `${err.code}: ` : ''}${err && err.message ? err.message : err}`);
    if (err && err.code === 'EPERM') {
      console.error('       EPERM: The file is likely locked by a running process or protected by antivirus.');
      console.error('       - Stop any running dev server (vite/node) and try again.');
      console.error('       - Check Task Manager for node.exe or esbuild.exe and end the process.');
      console.error('       - Temporarily disable antivirus or add this folder to exclusions.');
      console.error('       - If all else fails, reboot Windows and retry.');
    }
    return false;
  }
}

(async function main() {
  console.log('Searching for esbuild.exe in node_modules/@esbuild ...');
  const found = await findEsbuild();
  if (found.length === 0) {
    console.log('No esbuild.exe binaries found under node_modules/@esbuild.');
    console.log('If you still see EPERM on restart/rebuild, try stopping node/vite or rebooting the machine.');
    process.exit(0);
  }

  let success = false;
  for (const f of found) {
    console.log(`Found: ${f}`);
    const ok = await tryUnlink(f);
    success = success || ok;
  }

  if (!success) {
    console.error('Failed to delete any esbuild.exe binaries. Follow the guidance above to release file locks.');
    process.exit(1);
  } else {
    console.log('One or more binaries were removed. Now run your usual install/rebuild (Rebuild action in the UI).');
    process.exit(0);
  }
})();