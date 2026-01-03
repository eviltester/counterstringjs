function getRandomString(pattern, flags) {
    if (typeof pattern !== 'string' || pattern.trim() === '') {
        throw new Error('Pattern must be a non-empty string');
    }

    if (typeof flags !== 'string') {
        flags = '';
    }

    // Validate flags: only 'i' and 'm' allowed
    const validFlags = /^[im]*$/;
    if (!validFlags.test(flags)) {
        throw new Error('Flags must contain only \'i\' and/or \'m\'');
    }

    try {
        const randexp = new RandExp(pattern, flags);
        let randomString = randexp.gen();

        // Limit to 1000 characters
        if (randomString.length > 1000) {
            randomString = randomString.substring(0, 1000);
        }

        return randomString;
    } catch (error) {
        throw new Error('Error generating random string: ' + error.message);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getRandomString
    };
}