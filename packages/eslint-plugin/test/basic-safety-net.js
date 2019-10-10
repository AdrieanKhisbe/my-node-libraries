const test = require('ava');
const {has, isEmpty, isPlainObject} = require('lodash/fp');

test('I can load the plugin', t => {
    require('../src');
    t.pass();
});

test('Plugin has expected structure', t => {
    const pluginConfiguration = require('../src');
    t.true(has('configs', pluginConfiguration));
    const {configs} = pluginConfiguration;
    t.true(isPlainObject(configs));
    t.false(isEmpty(configs));
});

test('Plugin provide a configuration named base', t => {
    const pluginConfiguration = require('../src');
    const {configs} = pluginConfiguration;
    t.true(has('base', configs));
    const expectedKeys = ['env', 'extends', 'plugins', 'rules', 'parserOptions'];
    expectedKeys.forEach(key => t.true(has(key, configs.base)))
});
