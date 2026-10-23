import {fileURLToPath} from 'node:url';
import test from 'ava';
import {ESLint} from 'eslint';
import {configs} from '../src/index.js';

const cwd = fileURLToPath(new URL('../', import.meta.url));
const {base} = configs;

// Exercise resolver and autofix behavior directly against the shared configuration.
const createESLint = () =>
  new ESLint({
    cwd,
    useEslintrc: false,
    fix: true,
    baseConfig: {
      env: base.env,
      parserOptions: base.parserOptions,
      plugins: ['import', 'unicorn'],
      rules: {
        'import/no-unresolved': base.rules['import/no-unresolved'],
        'import/extensions': base.rules['import/extensions'],
        'import/no-useless-path-segments': base.rules['import/no-useless-path-segments'],
        'unicorn/prefer-object-has-own': base.rules['unicorn/prefer-object-has-own']
      },
      overrides: base.overrides.filter(override => override.settings)
    }
  });

test('AVA conditional exports resolve in test files', async t => {
  for (const filePath of [
    'test/example.js',
    'test/example.test.js',
    'tests/example.cjs',
    'src/example.test.js',
    'src/example.spec.mjs'
  ]) {
    const [result] = await createESLint().lintText("const test = require('ava');\n", {filePath});
    t.deepEqual(result.messages, []);
  }
});

test('explicit ESM file extensions and index imports remain valid', async t => {
  const code = "import fp from 'lodash/fp.js';\nimport {configs} from '../src/index.js';\n";
  const [result] = await createESLint().lintText(code, {filePath: 'test/example.js'});
  t.deepEqual(result.messages, []);
  t.is(result.output, undefined);
});

test('unknown modules are still reported in test files', async t => {
  const [result] = await createESLint().lintText(
    "require('missing-module-for-regression-test');\n",
    {
      filePath: 'test/example.test.js'
    }
  );
  t.is(result.errorCount, 1);
  t.is(result.messages[0].ruleId, 'import/no-unresolved');
});

test('AVA resolution exception stays limited to test files', async t => {
  const config = await createESLint().calculateConfigForFile('src/example.js');
  t.false((config.settings['import/core-modules'] || []).includes('ava'));
});

test('Lodash FP path-first has calls are not autofixed', async t => {
  const code = "const _ = require('lodash/fp');\n_.has('nested.key', {nested: {key: true}});\n";
  const [result] = await createESLint().lintText(code, {filePath: 'src/example.js'});
  t.deepEqual(result.messages, []);
  t.is(result.output, undefined);
});
