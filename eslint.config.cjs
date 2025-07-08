const {
  defineConfig,
  globalIgnores,
} = require("eslint/config");

const globals = require("globals");
const js = require("@eslint/js");

const {
  FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

module.exports = defineConfig([{
  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.browser,
    },

    ecmaVersion: "latest",
    sourceType: "module",
    parserOptions: {},
  },

  extends: compat.extends("eslint:recommended"),

  rules: {
    "no-unused-vars": "warn",
    "no-undef": "error",
  },
}, globalIgnores(["**/node_modules/", "priy/node_modules/", "**/dist/"]), {
  files: ["priy/React/**"],

  languageOptions: {
    globals: {
      ...globals.browser,
    },
  },
}, {
  files: [
    "priy/compiler/**",
    "priy/plugin.js",
    "priy/pri-plugin/**",
    "priy/utils/**",
    "**/vite.config.js",
  ],

  languageOptions: {
    globals: {
      ...globals.node,
    },
  },
}]);