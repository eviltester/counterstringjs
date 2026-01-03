const { getRangeString } = require('../extension/js/range');

describe('getRangeString', () => {
    test('generates range from 13 to 32', () => {
        const result = getRangeString(13, 32);
        expect(result.length).toBe(20);
        expect(result.charCodeAt(0)).toBe(13);
        expect(result.charCodeAt(19)).toBe(32);
    });

    test('generates range from 65 to 90 (A-Z)', () => {
        const result = getRangeString(65, 90);
        expect(result.length).toBe(26);
        expect(result).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    });

    test('generates range from 97 to 122 (a-z)', () => {
        const result = getRangeString(97, 122);
        expect(result.length).toBe(26);
        expect(result).toBe('abcdefghijklmnopqrstuvwxyz');
    });

    test('generates single character range', () => {
        const result = getRangeString(32, 32);
        expect(result.length).toBe(1);
        expect(result).toBe(' ');
    });

    test('generates range from 0 to 10', () => {
        const result = getRangeString(0, 10);
        expect(result.length).toBe(11);
        expect(result.charCodeAt(0)).toBe(0);
        expect(result.charCodeAt(10)).toBe(10);
    });

    test('throws error for start > end', () => {
        expect(() => getRangeString(32, 13)).toThrow('Invalid range: start and end must be integers between 0 and 65535, with start <= end');
    });

    test('throws error for negative start', () => {
        expect(() => getRangeString(-1, 32)).toThrow('Invalid range: start and end must be integers between 0 and 65535, with start <= end');
    });

    test('throws error for end > 65535', () => {
        expect(() => getRangeString(0, 65536)).toThrow('Invalid range: start and end must be integers between 0 and 65535, with start <= end');
    });

    test('throws error for non-integer start', () => {
        expect(() => getRangeString(13.5, 32)).toThrow('Invalid range: start and end must be integers between 0 and 65535, with start <= end');
    });

    test('throws error for non-number start', () => {
        expect(() => getRangeString('13', 32)).toThrow('Invalid range: start and end must be integers between 0 and 65535, with start <= end');
    });
});