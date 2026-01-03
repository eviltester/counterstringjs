class BinaryChopifier {
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
}

class BinaryChopResults {
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
}

if (typeof window !== 'undefined') {
    window.BinaryChopifier = BinaryChopifier;
    window.BinaryChopResults = BinaryChopResults;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = BinaryChopifier;
}
