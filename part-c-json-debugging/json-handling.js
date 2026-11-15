// QuickCart - Part C: JSON Handling & Output-Based Debugging

console.log("=== PART C: JSON Handling & Output-Based Debugging ===\n");

// Task 1: JSON.stringify() and JSON.parse()
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

const jsonString = JSON.stringify(originalOrder);
console.log("Original Order:", originalOrder);
console.log("\nJSON.stringify():", jsonString);

const parsedOrder = JSON.parse(jsonString);
console.log("\nJSON.parse():", parsedOrder);

console.log("\n[Property Difference Analysis]");
console.log(`- deliveryDate (undefined) lost? ${!("deliveryDate" in parsedOrder)}`);
console.log(`- calculateTax (function) lost? ${!("calculateTax" in parsedOrder)}`);
console.log(`- discount (null) preserved? ${parsedOrder.discount === null}`);
console.log("\nWhy do functions and undefined behave differently in JSON?");
console.log("JSON is a language-agnostic data format. It does not support 'undefined' or executable functions.");
console.log("In object properties, undefined and functions are omitted. In arrays, they coerce to null to preserve index positions.\n");

// Task 2: Predict the output
console.log("--- Task 2: Output Predictions ---");

// Helper to log predictions cleanly
function verifyPrediction(num, desc, actualFn, predicted, reason) {
  console.log(`\n${num}: ${desc}`);
  console.log(`Predicted: ${predicted}`);
  console.log(`Reason: ${reason}`);
  try {
    console.log(`Actual: ${actualFn()}`);
  } catch (err) {
    console.log(`Actual: [${err.name}] ${err.message}`);
  }
}

// Q1 – undefined in an object
verifyPrediction(
  "Q1",
  "undefined in an object",
  () => JSON.stringify({ name: "Rahul", age: undefined }),
  '{"name":"Rahul"}',
  "Object properties with undefined values are omitted."
);

// Q2 – undefined in an array
verifyPrediction(
  "Q2",
  "undefined in an array",
  () => JSON.stringify([10, undefined, 30]),
  "[10,null,30]",
  "Array elements are converted to null to keep element indexing."
);

// Q3 – NaN and Infinity
verifyPrediction(
  "Q3",
  "NaN and Infinity",
  () => JSON.stringify({ price: NaN, discount: Infinity }),
  '{"price":null,"discount":null}',
  "JSON does not support IEEE 754 non-finite numbers (NaN/Infinity), converting them to null."
);

// Q4 – invalid JSON
verifyPrediction(
  "Q4",
  "invalid JSON",
  () => JSON.parse("{name: 'Rahul', age: 25}"),
  "SyntaxError",
  "Standard JSON requires double-quoted property keys and string values."
);

// Q5 – circular reference
verifyPrediction(
  "Q5",
  "circular reference",
  () => {
    const user = { name: "Rahul" };
    user.self = user;
    return JSON.stringify(user);
  },
  "TypeError",
  "JSON cannot serialize circular structures without replacers."
);

// Q6 – Date object
verifyPrediction(
  "Q6",
  "Date object",
  () => JSON.stringify({ createdAt: new Date("2026-01-01") }),
  '{"createdAt":"2026-01-01T00:00:00.000Z"}',
  "Date objects implement toJSON(), returning an ISO 8601 UTC string."
);

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    originalOrder,
    parsedOrder
  };
}
