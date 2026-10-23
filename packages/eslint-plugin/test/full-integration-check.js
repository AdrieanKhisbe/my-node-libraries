import {execFile} from 'node:child_process';
import {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import test from 'ava';
import fp from 'lodash/fp.js';

const {sumBy, size, isNil} = fp;
const lint = (file, cli = false) =>
  new Promise(resolve => {
    execFile(
      cli ? 'bash' : process.execPath,
      [
        fileURLToPath(
          new URL(cli ? '../bin/eslint+' : '../node_modules/eslint/bin/eslint.js', import.meta.url)
        ),
        '--no-ignore',
        fileURLToPath(new URL(`./sample/${file}.js`, import.meta.url))
      ],
      {
        cwd: fileURLToPath(new URL('../', import.meta.url)),
        env: {
          ...process.env,
          FORCE_COLOR: undefined,
          NO_COLOR: '1',
          PATH: `${dirname(process.execPath)}:${process.env.PATH}`
        }
      },
      (err, stdout, stderr) => {
        resolve({err, stdout, stderr});
      }
    );
  });

test('Some perfectly working file', async t => {
  const lintResult = await lint('ok');
  t.is(lintResult.err, null);
});

test('Some messy broken file', async t => {
  const lintResult = await lint('ko');
  t.false(isNil(lintResult.err));
  t.true(lintResult.err.message.startsWith('Command failed'));
  const lintOutput = lintResult.stdout.split('\n');
  const countOccurences = pattern =>
    sumBy(line => size(line.match(new RegExp(pattern, 'g'))), lintOutput);

  t.is(countOccurences(':\\d+\\s+error'), 3);
  t.is(countOccurences('prettier/prettier'), 2);
  t.is(countOccurences('prefer-const'), 1);
});

test('eslint+ loads the pretty formatter', async t => {
  const result = await lint('ok', true);
  t.is(result.err, null);
  t.is(result.stderr, '');
});

test('eslint+ reports lint failures and preserves the exit code', async t => {
  const result = await lint('ko', true);
  t.is(result.err.code, 1);
  t.is(result.stderr, '');
  t.regex(result.stdout, /prettier\/prettier/);
  t.regex(result.stdout, /prefer-const/);
});
