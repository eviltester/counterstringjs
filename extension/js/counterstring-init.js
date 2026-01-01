var originalActiveElement = document.activeElement;

console.log('About to show dialog...');

var result = showCounterstringDialog({
    title: 'Generate Counterstring',
    buttonText: 'Generate',
    showDelay: false
});

console.log('Dialog promise created:', result);

result.then(function(config) {
    console.log('Dialog then callback fired, config:', config);
    
    if (!config) {
        console.log('Cancelled by user');
        return;
    }

    console.log('Config received:', config);
    console.log('Delimiter from config:', config.delimiter);

    var counterString = getCounterString(config.length, config.delimiter);
    console.log('Generated counterstring:', counterString);
    
    if (originalActiveElement) {
        originalActiveElement.value = counterString;
    }
}).catch(function(err) {
    console.error('Error generating counterstring:', err);
});
