const { getRandomString } = require('../extension/js/random');

// Mock RandExp globally
global.RandExp = jest.fn().mockImplementation((_pattern, _flags) => ({
    gen: jest.fn(() => 'mockedRandomString')
}));

describe('getRandomString', () => {
    test('generates string with valid pattern', () => {
        const result = getRandomString('[a-z]{5}', '');
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
    });

    test('throws error for empty pattern', () => {
        expect(() => getRandomString('', '')).toThrow('Pattern must be a non-empty string');
    });

    test('throws error for whitespace-only pattern', () => {
        expect(() => getRandomString('   ', '')).toThrow('Pattern must be a non-empty string');
    });

    test('throws error for invalid flags', () => {
        expect(() => getRandomString('[a-z]', 'g')).toThrow('Flags must contain only \'i\' and/or \'m\'');
    });

    test('accepts valid flags', () => {
        const result = getRandomString('[a-z]', 'i');
        expect(typeof result).toBe('string');
    });

    test('accepts combined valid flags', () => {
        const result = getRandomString('[a-z]', 'im');
        expect(typeof result).toBe('string');
    });

    test('handles flags as undefined', () => {
        const result = getRandomString('[a-z]');
        expect(typeof result).toBe('string');
    });

    test('limits string to 1000 characters', () => {
        // Mock a long string
        global.RandExp.mockImplementationOnce(() => ({
            gen: jest.fn(() => 'a'.repeat(1500))
        }));

        const result = getRandomString('[a-z]*', '');
        expect(result.length).toBe(1000);
    });

    test('throws error for invalid regex pattern', () => {
        // Mock RandExp to throw
        global.RandExp.mockImplementationOnce(() => {
            throw new Error('Invalid regex');
        });

        expect(() => getRandomString('[a-z', '')).toThrow('Error generating random string: Invalid regex');
    });
});