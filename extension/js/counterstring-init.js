var originalActiveElement = document.activeElement;

var result = showCounterstringDialog({
    title: 'Generate Counterstring',
    buttonText: 'Generate',
    showDelay: false
});

result.then(function(config) {
    if (!config) {
        console.log('Cancelled by user');
        return;
    }

    var counterString = getCounterString(config.length);
    console.log(counterString);
    
    if (originalActiveElement) {
        originalActiveElement.value = counterString;
    }
}).catch(function(err) {
    console.error('Error generating counterstring:', err);
});
