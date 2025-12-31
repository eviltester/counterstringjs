function reverseString(reverseMe) {
    return reverseMe.split("").reverse().join("");
}

function getCounterString(count) {
    
    var counterString = "";

    while(count>0){

        var appendThis = "*" + reverseString(count.toString());
        
        if(appendThis.length>count){
            appendThis = appendThis.substring(0,count);
        }    

        counterString = counterString + appendThis;

        count = count - appendThis.length;
    }

    return reverseString(counterString);
}

module.exports = {
    reverseString,
    getCounterString
};
