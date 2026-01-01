const { getCounterString } = require('../src/counterstring');
const { validateCounterString } = require('../src/validateCounterString');
const generateSchemaForCounterString = require('../src/generateSchema');
const forwardCounterString = require('../src/forwardCounterString');

const STRESS_TEST_MAX_LENGTH = 100;
const STRESS_TEST_STEP = 3;

describe('counterstring stress test', () => {
    test(`validates ${STRESS_TEST_MAX_LENGTH} generated counterstrings from length 1 to ${STRESS_TEST_MAX_LENGTH}`, () => {
        const failures = [];

        for (let length = 1; length <= STRESS_TEST_MAX_LENGTH; length+=STRESS_TEST_STEP) {
            try {
                const counterstring = getCounterString(length);
                validateCounterString(counterstring);
            } catch (error) {
                failures.push({ length, error: error.message });
            }
        }

        if (failures.length > 0) {
            console.error(`\nFailed counterstrings:`);
            failures.forEach(({ length, error }) => {
                console.error(`  Length ${length}: ${error}`);
            });
            throw new Error(`${failures.length} counterstring(s) failed validation`);
        }
    });

    test('verifies all generated counterstrings have correct lengths', () => {
        const failures = [];

        for (let length = 1; length <= STRESS_TEST_MAX_LENGTH; length+=STRESS_TEST_STEP) {
            const counterstring = getCounterString(length);
            if (counterstring.length !== length) {
                failures.push({ length, actualLength: counterstring.length });
            }
        }

        if (failures.length > 0) {
            console.error(`\nCounterstrings with incorrect lengths:`);
            failures.forEach(({ length, actualLength }) => {
                console.error(`  Expected length ${length}, got ${actualLength}`);
            });
            throw new Error(`${failures.length} counterstring(s) have incorrect lengths`);
        }
    });

    test(`validates ${STRESS_TEST_MAX_LENGTH} forward-generated counterstrings using schema`, () => {
        const failures = [];

        for (let length = 1; length <= STRESS_TEST_MAX_LENGTH; length+=STRESS_TEST_STEP) {
            try {
                const schema = generateSchemaForCounterString(length);
                const counterstring = forwardCounterString(schema);
                validateCounterString(counterstring);

                if (counterstring.length !== length) {
                    failures.push({ length, actualLength: counterstring.length, error: 'Length mismatch' });
                }
            } catch (error) {
                failures.push({ length, error: error.message });
            }
        }

        if (failures.length > 0) {
            console.error(`\nFailed forward-generated counterstrings:`);
            failures.forEach(({ length, error, actualLength }) => {
                console.error(`  Length ${length}${actualLength !== undefined ? ` (got ${actualLength})` : ''}: ${error}`);
            });
            throw new Error(`${failures.length} forward-generated counterstring(s) failed validation`);
        }
    });

    test(`compares reverse and forward counterstring generation for ${STRESS_TEST_MAX_LENGTH} lengths`, () => {
        const mismatches = [];

        for (let length = 1; length <= STRESS_TEST_MAX_LENGTH; length+=STRESS_TEST_STEP) {
            const reverseCounterstring = getCounterString(length);
            const schema = generateSchemaForCounterString(length);
            const forwardCounterstring = forwardCounterString(schema);

            if (reverseCounterstring !== forwardCounterstring) {
                mismatches.push({ length });
            }
        }

        if (mismatches.length > 0) {
            console.error(`\nMismatches between reverse and forward generation:`);
            mismatches.forEach(({ length }) => {
                console.error(`  Length ${length}`);
            });
            throw new Error(`${mismatches.length} counterstring(s) differ between reverse and forward generation`);
        }
    });
});