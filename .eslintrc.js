module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['prettier', 'eslint:recommended', 'plugin:import/typescript', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/triple-slash-reference': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
};
