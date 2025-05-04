import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs}"],
        plugins: { js },
        extends: ["js/recommended"],
        ignores: ["eslint.config.mjs", "node_modules/", "dist/", "build/"],
        languageOptions: {
            globals: {
                ...globals.node, // Use Node.js globals like process, __dirname, Buffer
                ...globals.browser,
                test: true,
                expect: true,
            },
            sourceType: "commonjs",
        },
        rules: {
            "no-unused-vars": "off",
            "no-undef": "off",
            "no-console": "off",
        },
    },
]);
