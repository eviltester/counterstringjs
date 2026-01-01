
function generateSchemaForCounterString(X) {

    // special cases
    if (X <= 0) return [];
    if (X == 1) return [{startNumber:1, endNumber:1, increment:2}];
    
    let schemaLines = [];
    let current = X;
    let next=X;
    let currentInc = 0;
    const separator="*";
    const separatorLength = separator.toString().length;

    let schemaLine = {};
    
    let state = "NEW_SCHEMA";

    while(current > 0) {

        if(state == "NEW_SCHEMA"){
            schemaLine = {};
            schemaLine.endNumber = current;

            currentInc = current.toString().length + separatorLength;
            schemaLine.increment = currentInc;

            // will find real start in due course
            schemaLine.startNumber = current;

            schemaLines.unshift(schemaLine);
            state="";
        }

        // and the next number to check is
        next = current - currentInc;
        nextLen = next.toString().length + separatorLength;

        if(nextLen < currentInc){
            // we are in a new range
            state="NEW_SCHEMA";
        }else{
            // make the next one the start
            if(next>=1){
                schemaLine.startNumber = next;
            }
        }

        current=next;
    }

    return schemaLines;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = generateSchemaForCounterString;
}

