var originalActiveElement = document.activeElement;

var result = showRangeDialog({
    title: 'Generate Range',
    buttonText: 'Generate',
    showDelay: false
});

result.then(function(config) {
    if (!config) {
        return;
    }

    var rangeString = getRangeString(config.start, config.end);

    console.log(rangeString);

    if (originalActiveElement) {
        // Create and dispatch input event to trigger form validation and event listeners
        const inputEvent = new InputEvent('input', {
            data: rangeString,
            inputType: 'insertText',
            bubbles: true,
            cancelable: true
        });
        originalActiveElement.dispatchEvent(inputEvent);

        // Then set the value
        originalActiveElement.value = rangeString;
    }
}).catch(function(err) {
    if (err !== null) {
        console.error('Error generating range:', err);
    }
});