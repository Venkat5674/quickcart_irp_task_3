// QuickCart - Part B: Higher-Order Functions, Map, Set & Object Methods

console.log("=== PART B: Higher-Order Functions, Map, Set & Object Methods ===\n");

const cart = [
  { id: 101, name: "Laptop", price: 50000, qty: 1, category: "Electronics" },
  { id: 102, name: "Mouse", price: 800, qty: 2, category: "Accessories" },
  { id: 103, name: "Keyboard", price: 1500, qty: 1, category: "Accessories" },
  { id: 104, name: "Monitor", price: 12000, qty: 1, category: "Electronics" },
  { id: 105, name: "Headphones", price: 2500, qty: 2, category: "Accessories" }
];

// Task 1: Array methods
// map() -> names with total item price
const namesWithTotalPrice = cart.map(item => ({
  name: item.name,
  totalItemPrice: item.price * item.qty
}));
console.log("1. map() -> Names with Total Item Price:");
console.table(namesWithTotalPrice);

// filter() -> products above ₹2,000
const productsAbove2000 = cart.filter(item => item.price > 2000);
console.log("\n2. filter() -> Products with Unit Price > ₹2,000:");
console.table(productsAbove2000);

// reduce() -> total cart value
const totalCartValue = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
console.log(`\n3. reduce() -> Total Cart Value: ₹${totalCartValue}`);

// forEach() -> log name, category, and quantity
console.log("\n4. forEach() -> Items:");
cart.forEach(item => {
  console.log(` - Item: ${item.name.padEnd(12)} | Category: ${item.category.padEnd(12)} | Qty: ${item.qty}`);
});

// Combined: total value of all Electronics products
const electronicsTotalValue = cart
  .filter(item => item.category === "Electronics")
  .reduce((sum, item) => sum + (item.price * item.qty), 0);
console.log(`\n5. Combined -> Total Electronics Value: ₹${electronicsTotalValue}`);

console.log("\n[Task 1 Questions & Answers]");
console.log("Q1: What is the difference between map() and forEach()?");
console.log("A: map() returns a new transformed array; forEach() executes side-effects and returns undefined.\n");
console.log("Q2: Does filter() change the original array?");
console.log("A: No, filter() is pure and returns a new shallow copy array.\n");
console.log("Q3: Why is reduce() useful for totals?");
console.log("A: reduce() carries an accumulator across iterations to condense elements into a single aggregate value.\n");
console.log("Q4: Which method returns a new transformed array?");
console.log("A: map() returns a new transformed array.\n");

// Task 2: Map and Set
// A. Inventory using Map
const inventory = new Map();
cart.forEach(item => {
  inventory.set(item.id, {
    name: item.name,
    price: item.price,
    qty: item.qty,
    category: item.category
  });
});

console.log("--- Task 2: Map and Set ---");
console.log("Get Product 101:", inventory.get(101));

// Update quantity
if (inventory.has(101)) {
  const current = inventory.get(101);
  inventory.set(101, { ...current, qty: current.qty + 5 });
  console.log("Updated Product 101 Qty:", inventory.get(101));
}

// Delete product 102
inventory.delete(102);
console.log("Deleted Product 102. Remaining Inventory:");
for (const [id, details] of inventory.entries()) {
  console.log(` [ID: ${id}] -> ${details.name} (Qty: ${details.qty}, Price: ₹${details.price})`);
}

// B. Deduplication using Set
const rawEmails = [
  "rahul@gmail.com",
  "priya@gmail.com",
  "rahul@gmail.com",
  "arjun@gmail.com",
  "priya@gmail.com"
];
const uniqueEmails = [...new Set(rawEmails)];
console.log("\nUnique Emails via Set:", uniqueEmails);

console.log("\n[Task 2 Questions & Answers]");
console.log("Q1: How is Map different from a plain object?");
console.log("A: Map keys can be any type, insertion order is guaranteed, has .size, and prevents prototype pollution.\n");
console.log("Q2: Why is Set good for removing duplicates?");
console.log("A: Set enforces value uniqueness automatically under SameValueZero in O(N) complexity.\n");
console.log("Q3: Can a Map use an object as a key?");
console.log("A: Yes, any object reference can be used as a key in a Map.\n");
console.log("Q4: Does Set keep insertion order?");
console.log("A: Yes, Set iterates elements in insertion order.\n");

// Task 3: Object.freeze() vs Object.seal()
const productConfig = { name: "Laptop", price: 50000, stock: 20 };

// Object.freeze() test
const frozenConfig = Object.freeze({ ...productConfig });
console.log("--- Task 3: Object.freeze() vs Object.seal() ---");
console.log("frozenConfig - isFrozen:", Object.isFrozen(frozenConfig));
try { frozenConfig.price = 55000; } catch (e) {}
console.log("Price after modify attempt:", frozenConfig.price);
try { frozenConfig.color = "Gray"; } catch (e) {}
console.log("New property after add attempt:", frozenConfig.color);
try { delete frozenConfig.stock; } catch (e) {}
console.log("Stock after delete attempt:", frozenConfig.stock);

// Object.seal() test
const sealedConfig = Object.seal({ ...productConfig });
console.log("\nsealedConfig - isSealed:", Object.isSealed(sealedConfig));
try { sealedConfig.price = 55000; } catch (e) {}
console.log("Price after modify attempt (Allowed):", sealedConfig.price);
try { sealedConfig.color = "Gray"; } catch (e) {}
console.log("New property after add attempt:", sealedConfig.color);
try { delete sealedConfig.stock; } catch (e) {}
console.log("Stock after delete attempt:", sealedConfig.stock);

console.log("\n[Task 3 Questions & Answers]");
console.log("Q1: What is the difference between freeze() and seal()?");
console.log("A: seal() allows modifying existing writable properties but blocks add/delete. freeze() blocks add/delete AND makes all properties read-only.\n");
console.log("Q2: Can a property be changed after seal()?");
console.log("A: Yes, existing writable properties can still be modified.\n");
console.log("Q3: Are nested objects frozen automatically?");
console.log("A: No, Object.freeze() is shallow.\n");
console.log("Q4: What is shallow freezing?");
console.log("A: Only top-level properties are frozen; nested objects/arrays remain mutable.\n");

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
