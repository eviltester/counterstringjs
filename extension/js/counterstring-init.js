var originalActiveElement = document.activeElement;

var result = showCounterstringDialog({
    title: 'Generate Counterstring',
    buttonText: 'Generate',
    showDelay: false,
    showTriggerInputEvents: true
});

result.then(function(config) {
    if (!config) {
        return;
    }

    var counterString = getCounterString(config.length, config.delimiter);
    
    if (originalActiveElement) {
        if (config.triggerInputEvents) {
            // Create and dispatch input event to trigger form validation and event listeners
            const inputEvent = new InputEvent('input', {
                data: counterString,
                inputType: 'insertText',
                bubbles: true,
                cancelable: true
            });
            originalActiveElement.dispatchEvent(inputEvent);
        }
        
        // Then set the value
        originalActiveElement.value = counterString;
    }
}).catch(function(err) {
    if (err !== null) {
        console.error('Error generating counterstring:', err);
    }
});
