var count = window.prompt("Counterstring Length?", "100");
var counterString = getCounterString(count);
console.log(counterString);
document.activeElement.value = counterString;
