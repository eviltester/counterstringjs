module.exports = [
    {
        ignores: ['node_modules/**', 'build/**', 'coverage/**', 'releases/*.zip', 'extension/js/generateSchema.js', 'extension/js/incrementalForwardCounterString.js', 'extension/js/dialog.js', 'extension/js/repeat-dialog.js', 'extension/js/repeat-init.js']
    },
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                browser: true,
                console: 'readonly',
                window: 'readonly',
                document: 'readonly',
                chrome: 'readonly'
            }
        },
        rules: {
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'no-console': 'off'
        }
    }
];
