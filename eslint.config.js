module.exports = [
    {
        ignores: ['node_modules/**', 'build/**', 'coverage/**', 'releases/*.zip']
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
