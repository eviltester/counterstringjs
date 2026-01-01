function validateCounterString(str) {
    if (!str || typeof str !== 'string') {
        throw new Error('Input must be a non-empty string');
    }
    
    let i = 0;
    let lastPosition = 0;
    
    while (i < str.length) {
        let numberBeforeStar = '';
        
        while (i < str.length && str[i] !== '*') {
            numberBeforeStar += str[i];
            i++;
        }
        
        if (i >= str.length) {
            throw new Error(`Invalid counterstring: No asterisk marker found for "${numberBeforeStar}"`);
        }
        
        const starIndex = i;
        const position = numberBeforeStar === '' ? 1 : parseInt(numberBeforeStar, 10);
        
        if (starIndex !== position - 1) {
            throw new Error(`Invalid counterstring: Asterisk at index ${starIndex} but position is ${position} (should be at index ${position - 1})`);
        }
        
        lastPosition = position;
        i++;
    }
    
    if (lastPosition === 0) {
        throw new Error('Invalid counterstring: No asterisk markers found');
    }
    
    if (lastPosition !== str.length) {
        throw new Error(`Invalid counterstring: Last position is ${lastPosition} but string length is ${str.length}`);
    }
    
    return true;
}

module.exports = { validateCounterString };