const incrementalForwardCounterString = require('../extension/js/incrementalForwardCounterString');
const forwardCounterString = require('../extension/js/forwardCounterString');

describe('incrementalForwardCounterString', () => {
    describe('Phase 1: Basic Functionality', () => {
        test('empty schema returns 0, callback never called', () => {
            const callback = jest.fn().mockReturnValue(true);
            const result = incrementalForwardCounterString([], callback, new AbortController().signal);
            expect(result).toBe(0);
            expect(callback).not.toHaveBeenCalled();
        });

        test('single schema entry starting at 1', () => {
            const callback = jest.fn().mockReturnValue(true);
            const schema = [{startNumber: 1, endNumber: 9, increment: 2}];
            const result = incrementalForwardCounterString(schema, callback, new AbortController().signal);
            expect(result).toBe(9);
            expect(callback).toHaveBeenCalledTimes(5);
            expect(callback).toHaveBeenCalledWith('*', 1, expect.any(Object));
            expect(callback).toHaveBeenCalledWith('3*', 3, expect.any(Object));
            expect(callback).toHaveBeenCalledWith('5*', 5, expect.any(Object));
            expect(callback).toHaveBeenCalledWith('7*', 7, expect.any(Object));
            expect(callback).toHaveBeenCalledWith('9*', 9, expect.any(Object));
        });

        test('single schema entry starting at number greater than 1', () => {
            const callback = jest.fn().mockReturnValue(true);
            const schema = [{startNumber: 1, endNumber: 7, increment: 2}];
            const result = incrementalForwardCounterString(schema, callback, new AbortController().signal);
            expect(result).toBe(7);
            expect(callback).toHaveBeenCalledTimes(4);
            expect(callback).toHaveBeenCalledWith('*', 1, expect.any(Object));
            expect(callback).toHaveBeenCalledWith('3*', 3, expect.any(Object));
            expect(callback).toHaveBeenCalledWith('5*', 5, expect.any(Object));
            expect(callback).toHaveBeenCalledWith('7*', 7, expect.any(Object));
        });

        test('multiple schema entries', () => {
            const callback = jest.fn().mockReturnValue(true);
            const schema = [
                {startNumber: 1, endNumber: 9, increment: 2},
                {startNumber: 12, endNumber: 18, increment: 3}
            ];
            const result = incrementalForwardCounterString(schema, callback, new AbortController().signal);
            expect(result).toBe(18);
            expect(callback).toHaveBeenCalledTimes(8);
        });

        test('verifies character count matches endNumber for multiple schemas', () => {
            const callback = jest.fn().mockReturnValue(true);
            const schema = [
                {startNumber: 1, endNumber: 9, increment: 2},
                {startNumber: 12, endNumber: 21, increment: 3}
            ];
            const result = incrementalForwardCounterString(schema, callback, new AbortController().signal);
            expect(result).toBe(21);
        });
    });

    describe('Phase 2: Abort Functionality', () => {
        test('abort stops processing immediately', () => {
            const callback = jest.fn().mockReturnValue(true);
            const abortController = new AbortController();
            const schema = [{startNumber: 1, endNumber: 9, increment: 2}];

            callback.mockImplementationOnce(() => {
                abortController.abort();
                return true;
            });

            const result = incrementalForwardCounterString(schema, callback, abortController.signal);
            expect(callback).toHaveBeenCalledTimes(1);
            expect(result).toBe(1);
        });

        test('abort on second callback', () => {
            const callback = jest.fn().mockReturnValue(true);
            const abortController = new AbortController();
            const schema = [{startNumber: 1, endNumber: 9, increment: 2}];
            let callCount = 0;

            callback.mockImplementation(() => {
                callCount++;
                if (callCount === 2) {
                    abortController.abort();
                }
                return true;
            });

            const result = incrementalForwardCounterString(schema, callback, abortController.signal);
            expect(callback).toHaveBeenCalledTimes(2);
            expect(result).toBe(3);
        });

        test('callback returning false stops processing', () => {
            const callback = jest.fn().mockReturnValue(true);
            const schema = [{startNumber: 1, endNumber: 9, increment: 2}];

            callback.mockImplementationOnce(() => {
                return false;
            });

            const result = incrementalForwardCounterString(schema, callback, new AbortController().signal);
            expect(callback).toHaveBeenCalledTimes(1);
            expect(result).toBe(1);
        });
    });

    describe('Phase 3: Edge Cases & Validation', () => {
        test('throws error for negative startNumber', () => {
            const callback = jest.fn();
            const schema = [{startNumber: -1, endNumber: 5, increment: 2}];
            expect(() => incrementalForwardCounterString(schema, callback, new AbortController().signal))
                .toThrow('Schema validation error: Negative numbers not allowed');
        });

        test('throws error for negative endNumber', () => {
            const callback = jest.fn();
            const schema = [{startNumber: 1, endNumber: -5, increment: 2}];
            expect(() => incrementalForwardCounterString(schema, callback, new AbortController().signal))
                .toThrow('Schema validation error: Negative numbers not allowed');
        });

        test('throws error for increment of 0', () => {
            const callback = jest.fn();
            const schema = [{startNumber: 1, endNumber: 5, increment: 0}];
            expect(() => incrementalForwardCounterString(schema, callback, new AbortController().signal))
                .toThrow('Schema validation error: Increment must be 2 or greater');
        });

        test('throws error for increment of 1', () => {
            const callback = jest.fn();
            const schema = [{startNumber: 1, endNumber: 5, increment: 1}];
            expect(() => incrementalForwardCounterString(schema, callback, new AbortController().signal))
                .toThrow('Schema validation error: Increment must be 2 or greater');
        });

        test('throws error for startNumber greater than endNumber', () => {
            const callback = jest.fn();
            const schema = [{startNumber: 12, endNumber: 5, increment: 2}];
            expect(() => incrementalForwardCounterString(schema, callback, new AbortController().signal))
                .toThrow('Schema validation error: startNumber must be less than or equal to endNumber');
        });

        test('throws error when first increment is not 2', () => {
            const callback = jest.fn();
            const schema = [{startNumber: 1, endNumber: 5, increment: 3}];
            expect(() => incrementalForwardCounterString(schema, callback, new AbortController().signal))
                .toThrow('Schema validation error: First increment must be 2');
        });

        test('throws error when increments do not increase by 1', () => {
            const callback = jest.fn();
            const schema = [
                {startNumber: 1, endNumber: 9, increment: 2},
                {startNumber: 12, endNumber: 30, increment: 4}
            ];
            expect(() => incrementalForwardCounterString(schema, callback, new AbortController().signal))
                .toThrow('Schema validation error: Increments must increase by 1 (expected 3, got 4)');
        });
    });

    describe('Phase 4: Consistency with forwardCounterString', () => {
        test('produces same total character count as forwardCounterString', () => {
            const callback = jest.fn().mockReturnValue(true);
            const schema = [{startNumber: 1, endNumber: 9, increment: 2}];
            
            const incrementalResult = incrementalForwardCounterString(schema, callback, new AbortController().signal);
            const forwardResult = forwardCounterString(schema);
            
            expect(incrementalResult).toBe(forwardResult.length);
        });

        test('produces same total character count for complex schema', () => {
            const callback = jest.fn().mockReturnValue(true);
            const schema = [
                {startNumber: 1, endNumber: 9, increment: 2},
                {startNumber: 12, endNumber: 21, increment: 3}
            ];
            
            const incrementalResult = incrementalForwardCounterString(schema, callback, new AbortController().signal);
            const forwardResult = forwardCounterString(schema);
            
            expect(incrementalResult).toBe(forwardResult.length);
        });

        test('callback segments match forwardCounterString result when concatenated', () => {
            const segments = [];
            const callback = jest.fn().mockImplementation((segment) => {
                segments.push(segment);
                return true;
            });
            const schema = [{startNumber: 1, endNumber: 9, increment: 2}];
            
            incrementalForwardCounterString(schema, callback, new AbortController().signal);
            const forwardResult = forwardCounterString(schema);
            
            const concatenated = segments.join('');
            expect(concatenated).toBe(forwardResult);
        });
    });

    describe('Phase 5: Boundary Conditions', () => {
        test('exactly hits endNumber with valid increment', () => {
            const callback = jest.fn().mockReturnValue(true);
            const schema = [{startNumber: 1, endNumber: 9, increment: 2}];
            const result = incrementalForwardCounterString(schema, callback, new AbortController().signal);
            expect(result).toBe(9);
        });

        test('multi-digit numbers with increment 3', () => {
            const callback = jest.fn().mockReturnValue(true);
            const schema = [
                {startNumber: 1, endNumber: 9, increment: 2},
                {startNumber: 12, endNumber: 21, increment: 3}
            ];
            const result = incrementalForwardCounterString(schema, callback, new AbortController().signal);
            expect(result).toBe(21);
        });

        test('two-digit numbers with increment 3', () => {
            const callback = jest.fn().mockReturnValue(true);
            const schema = [
                {startNumber: 1, endNumber: 9, increment: 2},
                {startNumber: 12, endNumber: 30, increment: 3}
            ];
            const result = incrementalForwardCounterString(schema, callback, new AbortController().signal);
            expect(result).toBe(30);
        });
    });
});
