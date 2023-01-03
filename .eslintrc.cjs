module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'eslint:recommended',
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  globals: {
    jsPsych: 'readonly',
  },
  rules: {
    'no-unused-vars': 'warn',
  },
};
