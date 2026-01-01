function forwardCounterString(schema) {
    if (!schema || schema.length === 0) {
        return '';
    }

    validateSchema(schema);

    let counterString = '';
    let charCount = 0;

    for (let i = 0; i < schema.length; i++) {
        const entry = schema[i];

        let position = i === 0 ? entry.startNumber : schema[i-1].endNumber + entry.increment;

        while (position <= entry.endNumber) {
            if (position === 1) {
                counterString += '*';
                charCount += 1;
            } else {
                const positionStr = position.toString();
                counterString += positionStr + '*';
                charCount += positionStr.length + 1;
            }

            position += entry.increment;
        }
    }

    const lastEntry = schema[schema.length - 1];
    if (charCount !== lastEntry.endNumber) {
        throw new Error(`Character count mismatch: Generated ${charCount} characters, but expected ${lastEntry.endNumber}`);
    }

    return counterString;
}

function validateSchema(schema) {
    for (let i = 0; i < schema.length; i++) {
        const entry = schema[i];

        if (entry.startNumber < 0 || entry.endNumber < 0) {
            throw new Error('Schema validation error: Negative numbers not allowed');
        }

        if (entry.increment < 2) {
            throw new Error('Schema validation error: Increment must be 2 or greater');
        }

        if (entry.startNumber > entry.endNumber) {
            throw new Error('Schema validation error: startNumber must be less than or equal to endNumber');
        }

        if (i === 0 && entry.increment !== 2) {
            throw new Error('Schema validation error: First increment must be 2');
        }

        if (i > 0) {
            const expectedIncrement = schema[i - 1].increment + 1;
            if (entry.increment !== expectedIncrement) {
                throw new Error(`Schema validation error: Increments must increase by 1 (expected ${expectedIncrement}, got ${entry.increment})`);
            }

            const expectedStart = schema[i - 1].endNumber + entry.increment;
            if (entry.startNumber !== expectedStart) {
                throw new Error(`Schema validation error: startNumber must be ${expectedStart}, but got ${entry.startNumber}`);
            }
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = forwardCounterString;
}
