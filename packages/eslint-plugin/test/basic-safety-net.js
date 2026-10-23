import test from 'ava';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import fp from 'lodash/fp.js';
import * as plugin from '../src/index.js';

const {has, isEmpty, isPlainObject} = fp;
const {configs} = plugin;
const require = createRequire(import.meta.url);

test('I can load the plugin', t => {
  t.true(isPlainObject(plugin.default));
});

test('Plugin has expected structure', t => {
  t.true(has('configs', plugin));
  t.true(isPlainObject(configs));
  t.false(isEmpty(configs));
});

test('Plugin provide a configuration named base', t => {
  t.true(has('base', configs));
  const expectedKeys = ['env', 'extends', 'plugins', 'rules', 'parserOptions'];
  for (const key of expectedKeys) t.true(has(key, configs.base));
});

test('ESM and CommonJS consumers receive the same configuration', t => {
  t.is(plugin.default.configs, configs);
  t.is(require('../src/index.cjs'), plugin.default);
});

test('package exports support import and require by name', t => {
  t.notThrows(() =>
    execFileSync(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        `import assert from 'node:assert/strict';
         import {createRequire} from 'node:module';
         import plugin, {configs} from '@-k/eslint-plugin';
         const require = createRequire(import.meta.url);
         assert.equal(plugin.configs, configs);
         assert.equal(require('@-k/eslint-plugin'), plugin);
         assert.equal(require(process.cwd()), plugin);`
      ],
      {cwd: fileURLToPath(new URL('../', import.meta.url))}
    )
  );
});
