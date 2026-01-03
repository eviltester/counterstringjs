/* eslint-disable no-unused-vars */
function getCodeForChar(char) {
    if (char === ' ') {
        return 'Space';
    } else if (char === '!') {
        return 'Digit1';
    } else if (char === '"') {
        return 'Quote';
    } else if (char === '#') {
        return 'Digit3';
    } else if (char === '$') {
        return 'Digit4';
    } else if (char === '%') {
        return 'Digit5';
    } else if (char === '&') {
        return 'Digit6';
    } else if (char === '\'') {
        return 'Quote';
    } else if (char === '(') {
        return 'Digit9';
    } else if (char === ')') {
        return 'Digit0';
    } else if (char === '*') {
        return 'Digit8';
    } else if (char === '+') {
        return 'Equal';
    } else if (char === ',') {
        return 'Comma';
    } else if (char === '-') {
        return 'Minus';
    } else if (char === '.') {
        return 'Period';
    } else if (char === '/') {
        return 'Slash';
    } else if (char === ':') {
        return 'Semicolon';
    } else if (char === ';') {
        return 'Semicolon';
    } else if (char === '<') {
        return 'Comma';
    } else if (char === '=') {
        return 'Equal';
    } else if (char === '>') {
        return 'Period';
    } else if (char === '?') {
        return 'Slash';
    } else if (char === '@') {
        return 'Digit2';
    } else if (char === '[') {
        return 'BracketLeft';
    } else if (char === ']') {
        return 'BracketRight';
    } else if (char === '^') {
        return 'Digit6';
    } else if (char === '_') {
        return 'Minus';
    } else if (char === '`') {
        return 'Backquote';
    } else if (char === '{') {
        return 'BracketLeft';
    } else if (char === '|') {
        return 'Backslash';
    } else if (char === '}') {
        return 'BracketRight';
    } else if (char === '~') {
        return 'Backquote';
    } else if (char >= '0' && char <= '9') {
        return 'Digit' + char;
    } else if (char >= 'a' && char <= 'z') {
        return 'Key' + char.toUpperCase();
    } else if (char >= 'A' && char <= 'Z') {
        return 'Key' + char.toUpperCase();
    } else {
        return 'Space';
    }
}