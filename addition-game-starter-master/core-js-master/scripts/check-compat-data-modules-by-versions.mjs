import semver from 'semver';

const { version } = await fs.readJson('package.json');
const { major, minor, patch } = semver.coerce(version);
let ok = true;

if (minor || patch) { // ignore for pre-releases
  const zero = `${ major }.0`;
  const modulesByVersions = await fs.readJson('packages/core-js-compat/modules-by-versions.json');
  const response = await fetch(`https://unpkg.com/core-js-compat@${ major }/modules-by-versions.json`);
  const zeroVersionData = await response.json();
  const set = new Set(zeroVersionData[zero]);
  for (const mod of modulesByVersions[zero]) {
    if (!set.has(mod)) {
      ok = false;
      console.log(chalk.red(`${ chalk.cyan(mod) } should be added to modules-by-versions`));
    }
  }
}

if (!ok) throw console.log(chalk.red('\nmodules-by-versions should be updated'));
console.log(chalk.green('modules-by-versions checked'));
