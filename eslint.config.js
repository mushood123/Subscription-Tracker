/* eslint-disable*/
import globals from "globals";
import pluginJs from "@eslint/js";
/* eslint-enable*/



/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: { globals: globals.node },
    rules: {
      'no-console': 'error',
      'semi': ['error', 'always'],
      'no-var': 'error',
      'quotes': ['error', 'single'],
      'indent': ['error', 2],
      'camelcase': ['error', { 'properties': 'always' }]

    },
  },
  pluginJs.configs.recommended,
];