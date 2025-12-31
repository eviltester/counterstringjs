var count = window.prompt("Counterstring Length?", "100");

try{
    var reverseString = function(reverseMe){
        return reverseMe.split("").reverse().join("");
    }

    var getCounterString = function(count){
        
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

    var counterString = getCounterString(count);
    console.log(counterString);
    document.activeElement.value=counterString;
} catch (err) {
    console.error('Error while setting activeElement value:', err);
}

