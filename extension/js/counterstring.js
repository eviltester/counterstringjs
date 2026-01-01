function reverseString(reverseMe) {
    return reverseMe.split("").reverse().join("");
}

function getCounterString(count, delimiter) {
    console.log('getCounterString called with count:', count, 'delimiter:', delimiter);
    
    if (delimiter === undefined || delimiter === null || delimiter === '') {
        delimiter = '*';
    }
    
    var counterString = "";

    while(count>0){

        var appendThis = delimiter + reverseString(count.toString());
        
        if(appendThis.length>count){
            appendThis = appendThis.substring(0,count);
        }    

        counterString = counterString + appendThis;

        count = count - appendThis.length;
    }

    return reverseString(counterString);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        reverseString,
        getCounterString
    };
}
