import eslint from "@eslint/js"
import tseslint from "typescript-eslint"
import globals from "globals"
import { defineConfig } from "eslint/config"

export default defineConfig([
    // Ignores
    {
        ignores: ["dist/**", "node_modules/**", "coverage/**"],
    },

    // Base config
    eslint.configs.recommended,

    // TypeScript strict configs
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,

    // TypeScript files config
    {
        files: ["**/*.ts", "**/*.mts"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                ...globals.node,
                ...globals.es2022,
            },
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            // TypeScript strict rules
            "@typescript-eslint/explicit-function-return-type": "error",
            "@typescript-eslint/explicit-module-boundary-types": "error",
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
            "@typescript-eslint/no-floating-promises": "error",
            "@typescript-eslint/await-thenable": "error",
            "@typescript-eslint/no-misused-promises": "error",
            "@typescript-eslint/require-await": "error",
            "@typescript-eslint/prefer-nullish-coalescing": "error",
            "@typescript-eslint/prefer-optional-chain": "error",
            "@typescript-eslint/strict-boolean-expressions": "warn",
            "@typescript-eslint/consistent-type-imports": [
                "error",
                { prefer: "type-imports" },
            ],
            "@typescript-eslint/consistent-type-exports": "error",

            // General code quality
            "no-console": "warn",
            "no-debugger": "error",
            "no-duplicate-imports": "error",
            "no-unused-expressions": "error",
            "prefer-const": "error",
            "no-var": "error",
            eqeqeq: ["error", "always"],
            curly: ["error", "all"],

            // Formatting
            indent: ["error", 4, { SwitchCase: 1 }],
            "linebreak-style": ["error", "unix"],
            quotes: ["error", "double"],
            semi: "off",
            "eol-last": ["error", "always"],
        },
    },

    // Config files (less strict)
    {
        files: ["*.config.ts", "*.config.mts", "jest.config.ts"],
        rules: {
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-deprecated": "off",
            "no-console": "off",
        },
    },

    // Test files (relaxed rules)
    {
        files: ["tests/**/*.ts"],
        rules: {
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "no-console": "off",
        },
    },
])
