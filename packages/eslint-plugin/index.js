const fs = require('fs');
const path = require('path');
const stripComments = require('strip-json-comments');

const CONFIG_FILE = path.join(__dirname, '.eslintrc')

const eslintConfig = JSON.parse(stripComments(fs.readFileSync(CONFIG_FILE).toString()))

module.exports = {
    configs: {base: eslintConfig}
};
