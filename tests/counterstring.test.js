const { reverseString, getCounterString } = require('../src/counterstring');

describe('reverseString', () => {
    test('reverses a basic string', () => {
        expect(reverseString('hello')).toBe('olleh');
    });

    test('reverses empty string', () => {
        expect(reverseString('')).toBe('');
    });

    test('reverses single character', () => {
        expect(reverseString('a')).toBe('a');
    });

    test('reverses numbers as string', () => {
        expect(reverseString('12345')).toBe('54321');
    });

    test('reverses string with special characters', () => {
        expect(reverseString('abc*123')).toBe('321*cba');
    });

    test('reverses string with spaces', () => {
        expect(reverseString('hello world')).toBe('dlrow olleh');
    });
});

describe('getCounterString', () => {
    test('generates counterstring of length 5', () => {
        const result = getCounterString(5);
        expect(result.length).toBe(5);
        expect(result).toBe('*3*5*');
    });

    test('generates counterstring of length 10', () => {
        const result = getCounterString(10);
        expect(result.length).toBe(10);
        expect(result).toBe('*3*5*7*10*');
    });

    test('generates counterstring of length 15', () => {
        const result = getCounterString(15);
        expect(result.length).toBe(15);
        expect(result).toBe('*3*5*7*9*12*15*');
    });

    test('generates counterstring of length 100', () => {
        const result = getCounterString(100);
        expect(result.length).toBe(100);
    });

    test('handles length 1', () => {
        const result = getCounterString(1);
        expect(result.length).toBe(1);
        expect(result).toBe('*');
    });

    test('handles length 2', () => {
        const result = getCounterString(2);
        expect(result.length).toBe(2);
        expect(result).toBe('2*');
    });

    test('handles length 3', () => {
        const result = getCounterString(3);
        expect(result.length).toBe(3);
        expect(result).toBe('*3*');
    });

    test('handles length 4', () => {
        const result = getCounterString(4);
        expect(result.length).toBe(4);
        expect(result).toBe('2*4*');
    });

    test('last character is always asterisk for length > 1', () => {
        const result = getCounterString(10);
        expect(result.charAt(result.length - 1)).toBe('*');
    });

    test('generates counterstring of length 20', () => {
        const result = getCounterString(20);
        expect(result.length).toBe(20);
        expect(result).toBe('2*4*6*8*11*14*17*20*');
    });

    test('generates counterstring of length 50', () => {
        const result = getCounterString(50);
        expect(result.length).toBe(50);
    });

    test('generates counterstring of length 1000', () => {
        const result = getCounterString(1000);
        expect(result.length).toBe(1000);
    });

    test('verifies asterisk positions in result', () => {
        const result = getCounterString(15);
        const asteriskPositions = [];
        for (let i = 0; i < result.length; i++) {
            if (result[i] === '*') {
                asteriskPositions.push(i + 1);
            }
        }
        expect(asteriskPositions).toEqual([1, 3, 5, 7, 9, 12, 15]);
        expect(result).toBe('*3*5*7*9*12*15*');
    });
});
