const forwardCounterString = require('../src/forwardCounterString');

describe('forwardCounterString', () => {
    describe('Phase 1: Basic Functionality', () => {
        test('empty schema array returns empty string', () => {
            const result = forwardCounterString([]);
            expect(result).toBe('');
        });

        test('single schema entry starting at 1', () => {
            const schema = [{startNumber: 1, endNumber: 9, increment: 2}];
            const result = forwardCounterString(schema);
            expect(result).toBe('*3*5*7*9*');
            expect(result.length).toBe(9);
        });

        test('single schema entry starting at number greater than 1', () => {
            const schema = [{startNumber: 1, endNumber: 7, increment: 2}];
            const result = forwardCounterString(schema);
            expect(result).toBe('*3*5*7*');
            expect(result.length).toBe(7);
        });

        test('multiple schema entries', () => {
            const schema = [
                {startNumber: 1, endNumber: 9, increment: 2},
                {startNumber: 12, endNumber: 18, increment: 3}
            ];
            const result = forwardCounterString(schema);
            expect(result).toBe('*3*5*7*9*12*15*18*');
            expect(result.length).toBe(18);
        });

        test('large counterstring using multiple transitions', () => {
            const schema = [
                {startNumber: 1, endNumber: 9, increment: 2},
                {startNumber: 12, endNumber: 18, increment: 3}
            ];
            const result = forwardCounterString(schema);
            expect(result.length).toBe(18);
        });

        test('verifies character count matches endNumber for multiple schemas', () => {
            const schema = [
                {startNumber: 1, endNumber: 9, increment: 2},
                {startNumber: 12, endNumber: 18, increment: 3}
            ];
            const result = forwardCounterString(schema);
            expect(result.length).toBe(18);
        });

        test('large counterstring using multiple transitions', () => {
            const schema = [
                {startNumber: 1, endNumber: 9, increment: 2},
                {startNumber: 12, endNumber: 21, increment: 3}
            ];
            const result = forwardCounterString(schema);
            expect(result.length).toBe(21);
        });

        test('verifies character count matches endNumber for multiple schemas', () => {
            const schema = [
                {startNumber: 1, endNumber: 9, increment: 2},
                {startNumber: 12, endNumber: 21, increment: 3}
            ];
            const result = forwardCounterString(schema);
            expect(result.length).toBe(21);
        });
    });

    describe('Phase 2: Edge Cases & Validation', () => {
        test('throws error for negative startNumber', () => {
            const schema = [{startNumber: -1, endNumber: 5, increment: 2}];
            expect(() => forwardCounterString(schema)).toThrow('Schema validation error: Negative numbers not allowed');
        });

        test('throws error for negative endNumber', () => {
            const schema = [{startNumber: 1, endNumber: -5, increment: 2}];
            expect(() => forwardCounterString(schema)).toThrow('Schema validation error: Negative numbers not allowed');
        });

        test('throws error for increment of 0', () => {
            const schema = [{startNumber: 1, endNumber: 5, increment: 0}];
            expect(() => forwardCounterString(schema)).toThrow('Schema validation error: Increment must be 2 or greater');
        });

        test('throws error for increment of 1', () => {
            const schema = [{startNumber: 1, endNumber: 5, increment: 1}];
            expect(() => forwardCounterString(schema)).toThrow('Schema validation error: Increment must be 2 or greater');
        });

        test('throws error for startNumber greater than endNumber', () => {
            const schema = [{startNumber: 12, endNumber: 5, increment: 2}];
            expect(() => forwardCounterString(schema)).toThrow('Schema validation error: startNumber must be less than or equal to endNumber');
        });

        test('throws error when first increment is not 2', () => {
            const schema = [{startNumber: 1, endNumber: 5, increment: 3}];
            expect(() => forwardCounterString(schema)).toThrow('Schema validation error: First increment must be 2');
        });

        test('throws error when increments do not increase by 1', () => {
            const schema = [
                {startNumber: 1, endNumber: 9, increment: 2},
                {startNumber: 12, endNumber: 30, increment: 4}
            ];
            expect(() => forwardCounterString(schema)).toThrow('Schema validation error: Increments must increase by 1 (expected 3, got 4)');
        });
    });

    describe('Phase 3: Boundary Conditions', () => {
        test('exactly hits endNumber with valid increment', () => {
            const schema = [{startNumber: 1, endNumber: 9, increment: 2}];
            const result = forwardCounterString(schema);
            expect(result).toBe('*3*5*7*9*');
            expect(result.length).toBe(9);
        });

        test('multi-digit numbers with increment 3', () => {
            const schema = [
                {startNumber: 1, endNumber: 9, increment: 2},
                {startNumber: 12, endNumber: 21, increment: 3}
            ];
            const result = forwardCounterString(schema);
            expect(result).toBe('*3*5*7*9*12*15*18*21*');
            expect(result.length).toBe(21);
        });

        test('two-digit numbers with increment 3', () => {
            const schema = [
                {startNumber: 1, endNumber: 9, increment: 2},
                {startNumber: 12, endNumber: 30, increment: 3}
            ];
            const result = forwardCounterString(schema);
            expect(result).toBe('*3*5*7*9*12*15*18*21*24*27*30*');
            expect(result.length).toBe(30);
        });
    });
});
