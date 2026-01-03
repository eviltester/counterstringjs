module.exports = [
    {
        ignores: ['node_modules/**', 'build/**', 'coverage/**', 'releases/*.zip', 'extension/js/generateSchema.js', 'extension/js/incrementalForwardCounterString.js', 'extension/js/dialog.js', 'extension/js/repeat-dialog.js', 'extension/js/repeat-init.js', 'extension/js/binary-chop-dialog.js', 'extension/js/binary-chop-init.js', 'extension/js/range-dialog.js', 'extension/js/range-init.js', 'extension/js/typeRange.js', 'extension/js/random-dialog.js', 'extension/js/random-init.js', 'extension/js/typeRandom.js', 'extension/js/sample-regexes.js', 'extension/js/external/randexp.min.js']
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
