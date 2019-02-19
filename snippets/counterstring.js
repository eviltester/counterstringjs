
/*
    The initial JavaScript code to create the counterstrings
    run from Snippets in Chrome Dev Tools
*/
function reverseString(reverseMe){
    return reverseMe.split("").reverse().join("");
}

function getCounterString(count){
    
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

var count = window.prompt("Counterstring Length?", "100");
var counterString = getCounterString(count);
console.log(counterString);
document.activeElement.value=counterString;