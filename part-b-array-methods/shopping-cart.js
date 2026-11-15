/**
 * QuickCart - Advanced JavaScript Practical Assignment
 * Part B: Higher-Order Functions, Map, Set & Object Methods
 * File: part-b-array-methods/shopping-cart.js
 */

console.log("==================================================");
console.log("  PART B: Higher-Order Functions, Map, Set & Object Methods");
console.log("==================================================\n");

// Cart array of objects as defined in assignment
const cart = [
  { id: 101, name: "Laptop", price: 50000, qty: 1, category: "Electronics" },
  { id: 102, name: "Mouse", price: 800, qty: 2, category: "Accessories" },
  { id: 103, name: "Keyboard", price: 1500, qty: 1, category: "Accessories" },
  { id: 104, name: "Monitor", price: 12000, qty: 1, category: "Electronics" },
  { id: 105, name: "Headphones", price: 2500, qty: 2, category: "Accessories" }
];

// ============================================================================
// TASK 1: Array Methods
// ============================================================================
console.log("--- Task 1: Array Methods ---");

// 1. map() -> names with total item price (price * qty)
const namesWithTotalPrice = cart.map(item => ({
  name: item.name,
  totalItemPrice: item.price * item.qty
}));
console.log("1. map() -> Names with Total Item Price:");
console.table(namesWithTotalPrice);

// 2. filter() -> products above ₹2,000 (unit price > 2000)
const productsAbove2000 = cart.filter(item => item.price > 2000);
console.log("\n2. filter() -> Products with Unit Price > ₹2,000:");
console.table(productsAbove2000);

// 3. reduce() -> total cart value (price * quantity)
const totalCartValue = cart.reduce((accumulator, item) => accumulator + (item.price * item.qty), 0);
console.log(`\n3. reduce() -> Total Cart Value: ₹${totalCartValue}`);

// 4. forEach() -> log name, category, and quantity
console.log("\n4. forEach() -> Logging Name, Category, and Quantity:");
cart.forEach(item => {
  console.log(` - Item: ${item.name.padEnd(12)} | Category: ${item.category.padEnd(12)} | Qty: ${item.qty}`);
});

// 5. combined -> total value of all Electronics products
const electronicsTotalValue = cart
  .filter(item => item.category === "Electronics")
  .reduce((sum, item) => sum + (item.price * item.qty), 0);
console.log(`\n5. Combined Methods -> Total Value of Electronics: ₹${electronicsTotalValue}`);

console.log("\n[Task 1 Questions & Answers]:");
console.log(`Q1: What is the difference between map() and forEach()?
A: map() transforms each element of an array based on the callback and returns a brand-new array containing the transformed elements. forEach() iterates over the array executing a side-effect callback for each element, but always returns undefined without creating a new array.\n`);

console.log(`Q2: Does filter() change the original array?
A: No, filter() is a non-mutating (pure) method. It creates and returns a shallow copy of a portion of the given array filtered down to just the elements that pass the test implemented by the callback function.\n`);

console.log(`Q3: Why is reduce() useful for totals?
A: reduce() iterates through an array while carrying an accumulator value from one step to the next. This makes it ideal for folding or condensing an entire array of items into a single calculated aggregate value (such as a sum, average, or grouped object).\n`);

console.log(`Q4: Which method returns a new transformed array?
A: map() returns a new transformed array.\n`);


// ============================================================================
// TASK 2: Map and Set
// ============================================================================
console.log("--- Task 2: Map and Set ---");

// A. Inventory using Map
console.log("A. Map: Inventory Management");
const inventory = new Map();

// Populate Map: key = product ID, value = product details
cart.forEach(item => {
  inventory.set(item.id, {
    name: item.name,
    price: item.price,
    qty: item.qty,
    category: item.category
  });
});

console.log(`Initial Inventory Size: ${inventory.size} items`);

// Get a product
const product101 = inventory.get(101);
console.log("Get Product (ID 101):", product101);

// Update its quantity
if (inventory.has(101)) {
  const current = inventory.get(101);
  inventory.set(101, { ...current, qty: current.qty + 5 });
  console.log("Updated Product 101 Quantity:", inventory.get(101));
}

// Delete one product (e.g. ID 102 - Mouse)
const deleted = inventory.delete(102);
console.log(`Deleted Product 102: ${deleted ? "Success" : "Failed"}`);

// Loop over all entries
console.log("All Remaining Inventory Entries:");
for (const [id, details] of inventory.entries()) {
  console.log(` [ID: ${id}] -> ${details.name} (Stock Qty: ${details.qty}, Price: ₹${details.price})`);
}

// B. Duplicates using Set
console.log("\nB. Set: Removing Duplicate Emails");
const rawEmails = [
  "rahul@gmail.com",
  "priya@gmail.com",
  "rahul@gmail.com",
  "arjun@gmail.com",
  "priya@gmail.com"
];

console.log("Original Emails List (with duplicates):", rawEmails);
const uniqueEmailSet = new Set(rawEmails);
const uniqueEmails = [...uniqueEmailSet];
console.log("Unique Emails (after Set deduplication):", uniqueEmails);

console.log("\n[Task 2 Questions & Answers]:");
console.log(`Q1: How is Map different from a plain object?
A: 1) Keys: Map keys can be of any type (objects, functions, primitives), whereas object keys must be strings or symbols.
   2) Order: Map guarantees insertion order iteration.
   3) Size: Map has a built-in .size property, whereas objects require Object.keys(obj).length.
   4) Prototype: Plain objects inherit from Object.prototype and can have key collisions; Map has no default keys.
   5) Performance: Map is optimized for frequent addition and removal of key-value pairs.\n`);

console.log(`Q2: Why is Set good for removing duplicates?
A: A Set is a collection of unique values. When values are added, the Set automatically discards any duplicate value based on the SameValueZero equality algorithm, achieving O(N) deduplication without manual nested loops.\n`);

console.log(`Q3: Can a Map use an object as a key?
A: Yes! Unlike plain objects, Map allows any object, array, or function reference to be used as a key.\n`);

console.log(`Q4: Does Set keep insertion order?
A: Yes, elements in a Set are iterated in the exact order in which they were originally inserted.\n`);


// ============================================================================
// TASK 3: Object.freeze() vs Object.seal()
// ============================================================================
console.log("--- Task 3: Object.freeze() vs Object.seal() ---");

const productConfig = { name: "Laptop", price: 50000, stock: 20 };

// Copy 1: Object.freeze()
const frozenConfig = Object.freeze({ ...productConfig });

console.log("Testing Object.freeze():");
console.log("Is frozen?", Object.isFrozen(frozenConfig));

// 1. Try to change price
try {
  frozenConfig.price = 55000;
} catch (e) {
  console.log(" Error modifying price:", e.message);
}
console.log("Price after attempt to modify:", frozenConfig.price);

// 2. Try to add property
try {
  frozenConfig.color = "Space Gray";
} catch (e) {
  console.log(" Error adding property:", e.message);
}
console.log("Color property after attempt to add:", frozenConfig.color);

// 3. Try to delete property
try {
  delete frozenConfig.stock;
} catch (e) {
  console.log(" Error deleting property:", e.message);
}
console.log("Stock property after attempt to delete:", frozenConfig.stock);


// Copy 2: Object.seal()
const sealedConfig = Object.seal({ ...productConfig });

console.log("\nTesting Object.seal():");
console.log("Is sealed?", Object.isSealed(sealedConfig));

// 1. Try to change price (ALLOWED in sealed objects)
try {
  sealedConfig.price = 55000;
  console.log("Price after modifying (Allowed!):", sealedConfig.price);
} catch (e) {
  console.log(" Error modifying price:", e.message);
}

// 2. Try to add property (PREVENTED in sealed objects)
try {
  sealedConfig.color = "Space Gray";
} catch (e) {
  console.log(" Error adding property:", e.message);
}
console.log("Color property after attempt to add:", sealedConfig.color);

// 3. Try to delete property (PREVENTED in sealed objects)
try {
  delete sealedConfig.stock;
} catch (e) {
  console.log(" Error deleting property:", e.message);
}
console.log("Stock property after attempt to delete:", sealedConfig.stock);

console.log("\n[Task 3 Questions & Answers]:");
console.log(`Q1: What is the difference between freeze() and seal()?
A: Object.seal() prevents adding new properties and marks all existing properties as non-configurable (cannot be deleted or reconfigured), but existing writable properties CAN still be modified. Object.freeze() does everything seal() does PLUS makes all existing properties non-writable (read-only), so values cannot be changed at all.\n`);

console.log(`Q2: Can a property be changed after seal()?
A: Yes! If the property was writable before sealing, its value can still be changed. Only additions, deletions, and property descriptor reconfigurations are blocked.\n`);

console.log(`Q3: Are nested objects frozen automatically?
A: No. Object.freeze() is shallow. If a property references another object or array, that nested object is not frozen and can be modified unless deep-frozen recursively.\n`);

console.log(`Q4: What is shallow freezing?
A: Shallow freezing means only the direct immediate properties of the target object are frozen. Any referenced objects/arrays held inside properties remain mutable.\n`);

console.log("=================== End of Part B ===================\n");

// Export for module/testing usage if in Node
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    cart,
    namesWithTotalPrice,
    productsAbove2000,
    totalCartValue,
    electronicsTotalValue,
    inventory,
    uniqueEmails,
    frozenConfig,
    sealedConfig
  };
}
