module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: "@typescript-eslint/parser",
    requireConfigFile: false,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: [
    "@typescript-eslint",
  ],
  // add your custom rules here
  rules: {
    'comma-dangle': [ 'error', {
      arrays: 'always',
      objects: 'always',
      imports: 'always',
      exports: 'always',
      functions: 'never',
    }, ],
    indent: [ 'error', 2, ],
    'array-bracket-spacing': [ 'error', 'always', ],
    'no-useless-return': 'off',
    curly: 'off',
    semi: [ 2, 'never', ],
    '@typescript-eslint/no-var-requires': 'off',
  },
}
