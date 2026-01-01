function generateSchemaForCounterStringAI(X) {
    if (X <= 0) return [];
    
    let ends = [];
    let current = X;
    let currentInc = 2;
    
    while (current > 0) {
        let len = current.toString().length;
        let candidate = current - (len - 1);
        
        if (candidate.toString().length < len) {
            let prevEnd = candidate - currentInc;
            
            if (prevEnd <= 0) {
                ends.unshift(current);
                break;
            }
            
            ends.unshift(current);
            current = prevEnd;
            currentInc++;
        } else {
            ends.unshift(current);
            current = candidate;
        }
        console.log("current " + current);
        console.log(ends);
    }
    
    if (current > 0) {
        ends.unshift(current);
    }
    
    let ranges = [];
    let prevEndVal = 0;
    let currentIter = 2;
    
    for (let i = 0; i < ends.length; i++) {
        let end = ends[i];
        let start = i === 0 ? 1 : prevEndVal + currentIter;
        
        ranges.push({
            startNumber: start,
            endNumber: end,
            increment: currentIter
        });
        
        prevEndVal = end;
        currentIter++;
    }
    
    return ranges;
}


function generateSchemaForCounterString(X) {

    // special cases
    if (X <= 0) return [];
    if (X == 1) return [{startNumber:1, endNumber:1, increment:2}];
    
    let schemaLines = [];
    let current = X;
    let previous=X;
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
            state="FIND_SCHEMA_START";
        }

        if(state=="FIND_SCHEMA_START"){
            // if current + separator length < current inc then we are in the previous range
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

module.exports = generateSchemaForCounterString;