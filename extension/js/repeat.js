/* exported getRepeatedText */
function getRepeatedText(config) {
    if (config.contentMode === 'text') {
        return config.text.repeat(config.repeatCount);
    }
    if (config.contentMode === 'chr') {
        return config.chr.repeat(config.repeatCount);
    }

    let repeated = '';
    if (config.contentMode === 'regex') {
        for (let i = 0; i < config.repeatCount; i++) {
            repeated += getRandomString(config.pattern, config.flags);
        }
    }
    return repeated;
}
