import { centsToDollar } from "../../scripts/utils/money.js";

console.log('Test suite: centsToDollar');
function testCentsToDollar(testDesc, input, output) {
  console.log(testDesc);
  if (centsToDollar(input) === output) {
    console.log('passed');
  }
  else {
    console.log('failed');
  }
}


testCentsToDollar('Converts cents into dollars', 2095, '20.95');

testCentsToDollar('Works with 0', 0, '0.00');

testCentsToDollar('Rounds up to the nearest cent', 8000.5, '80.01');

