function getRangePresets() {
    return {
        'ASCII Digits': [48, 57],
        'Printable ASCII': [32, 126],
        'Latin-1 Supplement': [128, 255]
    };
}

function getRangeString(start, end) {
    if (typeof start !== 'number' || typeof end !== 'number' || !Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end < 0 || start > 65535 || end > 65535 || start > end) {
        throw new Error('Invalid range: start and end must be integers between 0 and 65535, with start <= end');
    }

    let rangeString = '';
    for (let code = start; code <= end; code++) {
        rangeString += String.fromCharCode(code);
    }
    return rangeString;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getRangeString,
        getRangePresets
    };
}
