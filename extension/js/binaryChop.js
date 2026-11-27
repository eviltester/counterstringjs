// Prevent redeclaration when script is injected multiple times
if (typeof BinaryChopifier === 'undefined') {
    BinaryChopifier = class {
        chop(start, end) {
            if (!Number.isInteger(start) || !Number.isInteger(end)) {
                throw new Error('start and end must be integers');
            }

            if (start < 0 || end < 0) {
                throw new Error('start and end must be non-negative integers');
            }

            if (start > end) {
                throw new Error('start must be less than or equal to end');
            }

            const chopPoints = [];
            let diff = end - start;

            do {
                diff = Math.trunc(diff / 2);
                chopPoints.push({ value: end - diff, diff: diff });
            } while (diff > 0);

            return new BinaryChopResults(start, end, chopPoints);
        }

        chopLower(start, end) {
            if (!Number.isInteger(start) || !Number.isInteger(end)) {
                throw new Error('start and end must be integers');
            }

            if (start < 0 || end < 0) {
                throw new Error('start and end must be non-negative integers');
            }

            if (start > end) {
                throw new Error('start must be less than or equal to end');
            }

            const chopPoints = [];
            let diff = end - start;

            do {
                diff = Math.trunc(diff / 2);
                chopPoints.push({ value: start + diff, diff: diff });
            } while (diff > 0);

            return new BinaryChopResults(start, end, chopPoints);
        }
    };
}

if (typeof BinaryChopResults === 'undefined') {
    BinaryChopResults = class {
        constructor(start, end, chopPoints) {
            this._start = start;
            this._end = end;
            this._chopPoints = chopPoints;
        }

        getStart() {
            return this._start;
        }

        getEnd() {
            return this._end;
        }

        countChopPoints() {
            return this._chopPoints.length;
        }

        getChopPoint(index) {
            return this._chopPoints[index - 1].value;
        }

        getChopPointDiff(index) {
            return this._chopPoints[index - 1].diff;
        }
    };
}

/* exported getBinaryChopReport */
function getBinaryChopReport(start, end, bound) {
    const chopper = new BinaryChopifier();
    const result = bound === 'lower' ? chopper.chopLower(start, end) : chopper.chop(start, end);
    const rows = [];
    let text = `start: ${start} end: ${end}\nresult\n\nchop: value (inc)\n${'-'.repeat(20)}\n`;

    for (let i = 1; i <= result.countChopPoints(); i++) {
        const value = result.getChopPoint(i);
        const diff = result.getChopPointDiff(i);
        rows.push({ '#': i, value, inc: diff });
        text += `${String(i).padStart(2, '0')}: ${String(value).padEnd(5)} (${diff})\n`;
    }
    return { text, rows };
}

if (typeof window !== 'undefined') {
    // Only assign to window if not already defined (prevents issues with multiple script injections)
    window.BinaryChopifier = window.BinaryChopifier || BinaryChopifier;
    window.BinaryChopResults = window.BinaryChopResults || BinaryChopResults;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = BinaryChopifier;
}
