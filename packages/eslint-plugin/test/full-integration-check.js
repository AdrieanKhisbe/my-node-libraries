const {exec} = require('child_process');
const test = require('ava');
const {sumBy, size, isNil} = require('lodash/fp');

const lint = file =>
  new Promise(resolve => {
    exec(
      `npm run -s _lint -- --no-ignore ${__dirname}/sample/${file}.js`,
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
