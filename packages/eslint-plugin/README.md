# @a-k/eslint-plugin

> Personal configuration for eslint

Requires Node.js 20.19 or newer.

[![npm](https://img.shields.io/npm/v/@-k/eslint-plugin.svg)](https://www.npmjs.com/package/@-k/eslint-plugin)

- Install it with `npm install --save-dev @-k/eslint-plugin` :inbox_tray:

- Set up minimal configuration: :wrench:
    ```json
    {
        "extends": "plugin:@-k/base",
        "plugins": ["@-k"]
    }
    ```
- You're good to go! :wink:

The package supports ESM imports (`import plugin, {configs} from '@-k/eslint-plugin'`)
and CommonJS (`require('@-k/eslint-plugin')`). The configuration above uses the
CommonJS entry for ESLint's legacy configuration loader.

:open_book: For more details, you can check the [set of rules](./src/.eslintrc.json)
