/**
 * QuickCart - Advanced JavaScript Practical Assignment
 * Part C: JSON Handling & Output-Based Debugging
 * File: part-c-json-debugging/json-handling.js
 */

console.log("==================================================");
console.log("  PART C: JSON Handling & Output-Based Debugging");
console.log("==================================================\n");

// ============================================================================
// TASK 1: JSON.stringify() and JSON.parse()
// ============================================================================
console.log("--- Task 1: JSON.stringify() and JSON.parse() ---");

const originalOrder = {
  orderId: 501,
  customer: "Rahul",
  amount: 5000,
  deliveryDate: undefined,
  discount: null,
  calculateTax: function () {
    return 500;
  }
};

console.log("Original Order Object:", originalOrder);

// Serialize to JSON string
const jsonString = JSON.stringify(originalOrder);
console.log("\nSerialized JSON String:");
console.log(jsonString);

// Deserialize back to JavaScript object
const parsedOrder = JSON.parse(jsonString);
console.log("\nParsed Object from JSON:");
console.log(parsedOrder);

// Analysis of lost / modified properties
console.log("\n[Property Difference Analysis]:");
console.log(`1. 'deliveryDate' (value was undefined):
   - Lost in JSON: ${!("deliveryDate" in parsedOrder)}
   - Explanation: JSON specification does not define an 'undefined' type. When serializing an object, properties with 'undefined' values are completely omitted.

2. 'calculateTax' (value was a function):
   - Lost in JSON: ${!("calculateTax" in parsedOrder)}
   - Explanation: JSON is purely a static data interchange format and cannot represent executable code or function closures. Functions are omitted during object serialization.

3. 'discount' (value was null):
   - Preserved in JSON: ${parsedOrder.discount === null}
   - Explanation: 'null' is an official, first-class primitive value in the JSON specification, so it is safely preserved.

Why do functions and undefined behave differently in JSON?
JSON (JavaScript Object Notation) was intentionally standardized strictly as an agnostic data-transport format. It purposely excludes JavaScript-specific runtime concepts like undefined, functions, Symbols, and memory pointers. Therefore, during JSON.stringify():
- In objects: Keys whose values are undefined, functions, or Symbols are silently omitted.
- In arrays: Undefined and functions are converted to null to keep the array length and indexing intact.`);


// ============================================================================
// TASK 2: Predict the Output & Output-Based Debugging
// ============================================================================
console.log("\n--- Task 2: Predict the Output ---");

// Helper function for structured output prediction logging
function testPrediction({ qNum, title, codeString, prediction, explanation, execute }) {
  console.log(`\n--------------------------------------------------`);
  console.log(`${qNum}: ${title}`);
  console.log(`Code: ${codeString}`);
  console.log(`Predicted Output: ${prediction}`);
  console.log(`Reasoning / Explanation: ${explanation}`);
  try {
    const actual = execute();
    console.log(`Actual Output: ${actual}`);
  } catch (err) {
    console.log(`Actual Error Thrown: [${err.name}] ${err.message}`);
  }
}

// Q1 – undefined in an object
testPrediction({
  qNum: "Q1",
  title: "undefined in an object",
  codeString: 'JSON.stringify({ name: "Rahul", age: undefined })',
  prediction: '{"name":"Rahul"}',
  explanation: "In object literals, properties whose values are 'undefined' are skipped/omitted entirely by JSON.stringify().",
  execute: () => JSON.stringify({ name: "Rahul", age: undefined })
});

// Q2 – undefined in an array
testPrediction({
  qNum: "Q2",
  title: "undefined in an array",
  codeString: 'JSON.stringify([10, undefined, 30])',
  prediction: '[10,null,30]',
  explanation: "In arrays, elements cannot simply disappear because that would change index positions of subsequent elements. Therefore, 'undefined' is coerced to 'null'.",
  execute: () => JSON.stringify([10, undefined, 30])
});

// Q3 – NaN and Infinity
testPrediction({
  qNum: "Q3",
  title: "NaN and Infinity",
  codeString: 'JSON.stringify({ price: NaN, discount: Infinity })',
  prediction: '{"price":null,"discount":null}',
  explanation: "The JSON number specification adheres strictly to IEEE 754 finite values and does not support NaN or Infinity. JSON.stringify() converts NaN, Infinity, and -Infinity to null.",
  execute: () => JSON.stringify({ price: NaN, discount: Infinity })
});

// Q4 – invalid JSON
testPrediction({
  qNum: "Q4",
  title: "invalid JSON syntax",
  codeString: "JSON.parse(\"{name: 'Rahul', age: 25}\")",
  prediction: "SyntaxError: Unexpected token ... (or Expected property name)",
  explanation: "Standard JSON requires all property keys and string values to be enclosed in double quotes (\"). Unquoted keys and single quotes (') cause JSON.parse() to throw a SyntaxError.",
  execute: () => JSON.parse("{name: 'Rahul', age: 25}")
});

// Q5 – circular reference
testPrediction({
  qNum: "Q5",
  title: "circular reference",
  codeString: "const user = { name: 'Rahul' }; user.self = user; JSON.stringify(user)",
  prediction: "TypeError: Converting circular structure to JSON",
  explanation: "JSON data represents a strict acyclic tree. When an object directly or indirectly references itself, JSON.stringify() enters an infinite loop and throws a TypeError.",
  execute: () => {
    const user = { name: "Rahul" };
    user.self = user;
    return JSON.stringify(user);
  }
});

// Q6 – Date object
testPrediction({
  qNum: "Q6",
  title: "Date object serialization",
  codeString: 'JSON.stringify({ createdAt: new Date("2026-01-01") })',
  prediction: '{"createdAt":"2026-01-01T00:00:00.000Z"}',
  explanation: "Date objects possess a built-in .toJSON() method, which delegates to .toISOString(). JSON.stringify() automatically calls this method, producing an ISO 8601 UTC formatted string.",
  execute: () => JSON.stringify({ createdAt: new Date("2026-01-01") })
});

console.log("\n=================== End of Part C ===================\n");

// Export for module/testing usage if in Node
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    originalOrder,
    parsedOrder
  };
}
