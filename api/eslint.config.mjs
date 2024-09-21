import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      "no-unused-vars": "off", // Kullanılmayan değişkenleri kontrol etme
      "no-undef": "off", // Tanımsız değişkenleri kontrol etme
    },
  },
  pluginJs.configs.recommended,
];
