var originalActiveElement = document.activeElement;

var result = showRandomDialog({
    title: 'Generate Random',
    buttonText: 'Generate',
    showDelay: false
});

result.then(function(config) {
    if (!config) {
        return;
    }

    try {
        var randomString = getRandomString(config.pattern, config.flags);

        console.log(randomString);

        if (originalActiveElement) {
            // Create and dispatch input event to trigger form validation and event listeners
            const inputEvent = new InputEvent('input', {
                data: randomString,
                inputType: 'insertText',
                bubbles: true,
                cancelable: true
            });
            originalActiveElement.dispatchEvent(inputEvent);

            // Then set the value
            originalActiveElement.value = randomString;
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}).catch(function(err) {
    if (err !== null) {
        console.error('Error generating random:', err);
    }
});