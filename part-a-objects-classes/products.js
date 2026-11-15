/**
 * QuickCart - Advanced JavaScript Practical Assignment
 * Part A: Objects, Prototypes & ES6 Classes
 * File: part-a-objects-classes/products.js
 */

console.log("==================================================");
console.log("  PART A: Objects, Prototypes & ES6 Classes");
console.log("==================================================\n");

// ============================================================================
// TASK 1: Prototype-based Products
// ============================================================================
console.log("--- Task 1: Prototype-based Products ---");

/**
 * Product constructor function
 * @param {string} productName
 * @param {number} price
 * @param {string} category
 */
function Product(productName, price, category) {
  this.productName = productName;
  this.price = price;
  this.category = category;
}

// Add displayProduct to Product.prototype for memory efficiency
Product.prototype.displayProduct = function () {
  return `Product: ${this.productName} | Price: ₹${this.price} | Category: ${this.category}`;
};

// Create three product instances using constructor
const product1 = new Product("Laptop", 50000, "Electronics");
const product2 = new Product("Wireless Mouse", 800, "Accessories");
const product3 = new Product("Mechanical Keyboard", 1500, "Accessories");

console.log(product1.displayProduct());
console.log(product2.displayProduct());
console.log(product3.displayProduct());

console.log("\n[Task 1 Questions & Answers]:");
console.log(`Q1: Why add displayProduct() to the prototype instead of the constructor?
A: When defined inside the constructor, a new copy of the function is created in memory for every single instance created. Adding it to the prototype ensures that all instances share a single reference to the method via their prototype chain (__proto__), saving significant memory.\n`);

console.log(`Q2: What is the difference between __proto__ and prototype?
A: 'prototype' is a property existing on constructor functions and classes that defines what will become the prototype (__proto__) of all instances created by that function with 'new'. '__proto__' is an accessor property on an actual object instance that points to the prototype object from which it inherited properties and methods.\n`);

console.log(`Q3: What happens when JavaScript cannot find a property on an object?
A: JavaScript follows the prototype chain. It checks the object itself, then its prototype (obj.__proto__), then the prototype's prototype, up to Object.prototype.__proto__ which is null. If the property is not found anywhere along the chain, JavaScript returns undefined (or throws a ReferenceError if evaluating an undeclared variable, or TypeError if invoked as a function).\n`);


// ============================================================================
// TASK 2: ES6 Classes
// ============================================================================
console.log("--- Task 2: ES6 Classes & Inheritance ---");

class ProductClass {
  constructor(name, price, category) {
    this.name = name;
    this.price = price;
    this.category = category;
  }

  getProductDetails() {
    return `[Product Details] Name: ${this.name}, Price: ₹${this.price}, Category: ${this.category}`;
  }
}

// Child class: ElectronicProduct extending ProductClass
class ElectronicProduct extends ProductClass {
  constructor(name, price, warrantyYears) {
    super(name, price, "Electronics");
    this.warrantyYears = warrantyYears;
  }

  // Unique method for ElectronicProduct
  getWarrantyInfo() {
    return `${this.name} comes with ${this.warrantyYears} year(s) of official manufacturer warranty.`;
  }
}

// Child class: ClothingProduct extending ProductClass
class ClothingProduct extends ProductClass {
  constructor(name, price, size, fabric) {
    super(name, price, "Clothing");
    this.size = size;
    this.fabric = fabric;
  }

  // Unique method for ClothingProduct
  getSizeGuide() {
    return `Size: ${this.size} | Fabric: ${this.fabric} | Washing Guide: Machine wash cold with similar colors.`;
  }
}

const laptop = new ElectronicProduct("Dell XPS 15", 120000, 2);
const tShirt = new ClothingProduct("Organic Cotton Tee", 999, "L", "100% Cotton");

console.log(laptop.getProductDetails());
console.log(laptop.getWarrantyInfo());
console.log(tShirt.getProductDetails());
console.log(tShirt.getSizeGuide());

console.log("\n[Task 2 Questions & Answers]:");
console.log(`Q1: What is the purpose of extends?
A: The 'extends' keyword establishes prototypal inheritance between two classes. It configures the subclass's prototype to inherit from the parent class's prototype (SubClass.prototype.__proto__ === ParentClass.prototype) and inherits static methods.\n`);

console.log(`Q2: Why must super() be called before using this?
A: In derived classes, the instance object is created and initialized by the superclass constructor. Before super() executes, 'this' is in the Temporal Dead Zone (TDZ). Attempting to access 'this' before super() throws a ReferenceError.\n`);

console.log(`Q3: Are ES6 classes completely different from prototype-based inheritance?
A: No. ES6 classes are primarily syntactic sugar over JavaScript's existing prototype-based inheritance model. Under the hood, typeof ClassName is still 'function', and methods are attached to ClassName.prototype.\n`);


// ============================================================================
// TASK 3: ES6 Syntax in Checkout
// ============================================================================
console.log("--- Task 3: ES6 Syntax in Checkout ---");

// (A) Arrow function for final price after discount
const calculateFinalPrice = (price, discountPercent) => price - (price * (discountPercent / 100));
const originalPrice = 50000;
const discountPercent = 10;
const discountedPrice = calculateFinalPrice(originalPrice, discountPercent);
console.log(`(A) Discounted Price for ₹${originalPrice} at ${discountPercent}% off: ₹${discountedPrice}`);

// (B) Template literal
const customerName = "Rahul";
const orderedItem = "Laptop";
const totalBill = 50000;
const confirmationMessage = `Hello ${customerName}, your order of ${orderedItem} is confirmed. Total: ₹${totalBill}.`;
console.log(`(B) ${confirmationMessage}`);

// (C) Destructure name and email
const customer = {
  name: "Rahul",
  email: "rahul@gmail.com",
  city: "Mumbai"
};
const { name: custName, email: custEmail } = customer;
console.log(`(C) Destructured Customer -> Name: ${custName}, Email: ${custEmail}`);

// (D) calculateTotal(...prices) using rest operator
const calculateTotal = (...prices) => prices.reduce((acc, current) => acc + current, 0);
const sampleTotal = calculateTotal(50000, 800, 1500, 12000, 2500);
console.log(`(D) Total of prices (50000, 800, 1500, 12000, 2500): ₹${sampleTotal}`);

// (E) Spread operator to copy a product with a new price without mutating original
const originalProductObj = { id: 101, name: "Laptop", price: 50000, category: "Electronics" };
const updatedProductObj = { ...originalProductObj, price: 45000 };

console.log("(E) Original Product:", originalProductObj);
console.log("    Updated Product (new price, original unchanged):", updatedProductObj);
console.log("    Is original mutated?", originalProductObj.price === 45000 ? "Yes (Failed)" : "No (Passed!)");

console.log("\n=================== End of Part A ===================\n");

// Export for module/testing usage if in Node
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    Product,
    ProductClass,
    ElectronicProduct,
    ClothingProduct,
    calculateFinalPrice,
    calculateTotal
  };
}
