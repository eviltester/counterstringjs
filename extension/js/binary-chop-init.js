var originalActiveElement = document.activeElement;

showBinaryChopDialog().then(function(dialog) {
    if (!dialog) {
        return;
    }

    dialog.setOnGenerate(function(config) {
        try {
            const binaryChopper = new BinaryChopifier();
            const binaryChop = binaryChopper.chop(config.start, config.end);
            
            const header = `start: ${config.start} end: ${config.end}\nresult\n\n`;
            const separator = 'chop: value (inc)\n' + '-'.repeat(20) + '\n';
            
            let output = header + separator;
            
            for (let i = 1; i <= binaryChop.countChopPoints(); i++) {
                const value = binaryChop.getChopPoint(i);
                const diff = binaryChop.getChopPointDiff(i);
                const lineNumber = i.toString().padStart(2, '0');
                output += `${lineNumber}: ${value.toString().padEnd(5)} (${diff})\n`;
            }
            
            console.log('\n' + output);
            
            const tableData = [];
            for (let i = 1; i <= binaryChop.countChopPoints(); i++) {
                tableData.push({
                    '#': i,
                    value: binaryChop.getChopPoint(i),
                    inc: binaryChop.getChopPointDiff(i)
                });
            }
            
            console.table(tableData);
            
            config.resultsTextarea.value = output;
            
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
