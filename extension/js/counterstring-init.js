var originalActiveElement = document.activeElement;

var result = showCounterstringDialog({
    title: 'Generate Counterstring',
    buttonText: 'Generate',
    showDelay: false
});

result.then(function(config) {
    if (!config) {
        return;
    }

    var counterString = getCounterString(config.length, config.delimiter);
    
    if (originalActiveElement) {
        originalActiveElement.value = counterString;
    }
}).catch(function(err) {
    console.error('Error generating counterstring:', err);
});
