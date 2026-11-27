var originalActiveElement = document.activeElement;

showBinaryChopDialog().then(function(dialog) {
    if (!dialog) {
        return;
    }

    dialog.setOnGenerate(function(config) {
        try {
            const report = getBinaryChopReport(config.start, config.end, config.bound);
            console.log('\n' + report.text);
            console.table(report.rows);
            config.resultsTextarea.value = report.text;
            
        } catch (err) {
            console.error('Error generating binary chop:', err);
            alert('Error: ' + err.message);
        }
    });

}).catch(function(err) {
    if (err !== null) {
        console.error('Binary chop dialog error:', err);
    }
});
