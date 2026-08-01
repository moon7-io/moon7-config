import { defineConfig } from "eslint/config";
import eslint from "@eslint/js";
import tslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import prettierConfig from "eslint-config-prettier";
import vuePlugin from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import globals from "globals";
import path from "node:path";
import type { ConfigObject } from "@eslint/core";

export default defineConfig(
    // global ignore //
    {
        ignores: [
            // formatting
            "dist/**",
            "public/**",
            "node_modules/**",
            "*.*",
            "*.*.*",
        ],
    },

    // main config
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.es2023,
                ...globals.node,
            },
            parser: vueParser,
            parserOptions: {
                parser: tslint.parser,
                ecmaVersion: 2023,
                sourceType: "module",
                extraFileExtensions: [".vue"],
                // project: true,
                // tsconfigRootDir: import.meta.dirname,
                project: "./tsconfig.json",
                // tsconfigRootDir: path.resolve(),
            },
        },
        plugins: {
            "vue": vuePlugin,
            "@typescript-eslint": tslint.plugin,
            "import": importPlugin,
        },
        settings: {
            "import/resolver": {
                node: {
                    extensions: [".js", ".jsx", ".ts", ".tsx"],
                },
            },
        },
    },

    // base rules
    eslint.configs.recommended,
    tslint.configs.recommended,
    ...vuePlugin.configs["flat/essential"],
    prettierConfig,

    // js rules
    {
        rules: {
            "indent": "off",
            "linebreak-style": "off",
            "quotes": ["error", "double", { avoidEscape: true }],
            "semi": ["error", "always"],
            "no-unused-vars": "off", //["warn", { vars: "all", args: "after-used" }],
            "prefer-const": ["error", { destructuring: "all", ignoreReadBeforeAssign: true }],
            "no-empty": ["error", { allowEmptyCatch: true }],
            "no-restricted-imports": [
                "error",
                {
                    patterns: [
                        {
                            group: ["../"],
                            message: "No relative parent import. Use ~/ or #/ instead.",
                        },
                    ],
                },
            ],
        },
    },

    // ts rules
    {
        rules: {
            // "@typescript-eslint/indent": [
            //     "error",
            //     4,
            //     {
            //         SwitchCase: 1,
            //         flatTernaryExpressions: true,
            //         offsetTernaryExpressions: false,
            //         ignoredNodes: ["ConditionalExpression"],
            //     },
            // ],
            // "@typescript-eslint/no-unused-vars": [
            //     "warn",
            //     {
            //         vars: "all",
            //         args: "after-used",
            //         varsIgnorePattern: "^_",
            //         argsIgnorePattern: "^_",
            //         destructuredArrayIgnorePattern: "^_",
            //         caughtErrorsIgnorePattern: "^_",
            //     },
            // ],
            "@typescript-eslint/no-namespace": "off",
            // "@typescript-eslint/no-explicit-any": "off",
            // "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/ban-ts-comment": "off",
            "@typescript-eslint/no-empty-object-type": "off",
            "@typescript-eslint/no-this-alias": "off", // TODO: refactor code and turn this back on
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    args: "after-used",
                    argsIgnorePattern: "^_",
                    caughtErrors: "all",
                    caughtErrorsIgnorePattern: "^_",
                    destructuredArrayIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    ignoreRestSiblings: true,
                },
            ],
            "@typescript-eslint/no-non-null-assertion": "warn",
            // "@typescript-eslint/ban-types": [
            //     "error",
            //     {
            //         extendDefaults: false,
            //         types: {
            //             String: {
            //                 message: "Use string instead",
            //                 fixWith: "string",
            //             },
            //             Boolean: {
            //                 message: "Use boolean instead",
            //                 fixWith: "boolean",
            //             },
            //             Number: {
            //                 message: "Use number instead",
            //                 fixWith: "number",
            //             },
            //             Symbol: {
            //                 message: "Use symbol instead",
            //                 fixWith: "symbol",
            //             },
            //         },
            //     },
            // ],
        },
    },

    // import rules
    {
        rules: {
            // Import rules
            "import/order": [
                "warn",
                {
                    pathGroups: [
                        { pattern: "@*/**", group: "external", position: "after" },
                        { pattern: "~/**", group: "internal", position: "before" },
                    ],
                    pathGroupsExcludedImportTypes: ["builtin"],
                    groups: [
                        // formatting
                        "builtin",
                        "external",
                        "internal",
                        "parent",
                        "sibling",
                        "index",
                        "object",
                        "type",
                    ],
                    // "newlines-between": "never",
                    alphabetize: { order: "asc", caseInsensitive: true },
                },
            ],
            "import/no-unresolved": "off", // TypeScript handles this

            // Add these rules to disallow relative imports
            "import/no-relative-parent-imports": "error", // Disallow imports like '../foo'
            "import/no-relative-packages": "error", // Disallow relative imports from packages
            "import/enforce-node-protocol-usage": ["error", "always"], // Enforce using 'node:' protocol
            // "import/no-cycle": [
            //     "error",
            //     { maxDepth: 1, ignoreExternal: true, allowUnsafeDynamicCyclicDependency: true },
            // ], // Disallow circular dependencies
        },
    },

    // vue rules
    {
        rules: {
            "vue/no-unused-components": ["warn"],
            "vue/block-order": ["warn", { order: ["docs", "template", "script", "style"] }],
            "vue/no-mutating-props": ["error"],
            "vue/script-indent": "off", // conflict with prettier
            "vue/no-multiple-template-root": "off",
            "vue/one-component-per-file": "off",
            "vue/multi-word-component-names": "off",
            "vue/attribute-hyphenation": "off",
        },
    },

    // overrides for .vue files
    {
        files: ["**/*.vue"],
        rules: {
            "indent": "off",
            "@typescript-eslint/indent": "off",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                {
                    vars: "all",
                    args: "after-used",
                    varsIgnorePattern: "^_|^props$",
                    argsIgnorePattern: "^_",
                    destructuredArrayIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                },
            ],
        },
    }
) as ConfigObject[];
