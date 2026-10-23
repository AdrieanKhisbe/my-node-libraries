// ESLint's legacy configuration loader requires a synchronous CommonJS entry.
const fs = require('node:fs');
const path = require('node:path');
const {default: stripComments} = require('strip-json-comments');

const config = JSON.parse(
  stripComments(fs.readFileSync(path.join(__dirname, '.eslintrc.json'), 'utf8'))
);

module.exports = {configs: {base: config}};
