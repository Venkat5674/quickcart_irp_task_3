// QuickCart - Part A: Objects, Prototypes & ES6 Classes

console.log("=== PART A: Objects, Prototypes & ES6 Classes ===\n");

// Task 1: Prototype-based products
function Product(productName, price, category) {
  this.productName = productName;
  this.price = price;
  this.category = category;
}

// Attach method to prototype for shared memory efficiency
Product.prototype.displayProduct = function () {
  return `Product: ${this.productName} | Price: ₹${this.price} | Category: ${this.category}`;
};

const product1 = new Product("Laptop", 50000, "Electronics");
const product2 = new Product("Wireless Mouse", 800, "Accessories");
const product3 = new Product("Mechanical Keyboard", 1500, "Accessories");

console.log(product1.displayProduct());
console.log(product2.displayProduct());
console.log(product3.displayProduct());

console.log("\n[Task 1 Questions & Answers]");
console.log("Q1: Why add displayProduct() to prototype instead of constructor?");
console.log("A: Prototype methods share a single function reference across all instances via __proto__, saving memory.\n");
console.log("Q2: What is the difference between __proto__ and prototype?");
console.log("A: 'prototype' is on constructor functions/classes to initialize new instances; '__proto__' is the instance's pointer to its prototype.\n");
console.log("Q3: What happens when JavaScript cannot find a property on an object?");
console.log("A: JavaScript traverses up the prototype chain until Object.prototype.__proto__ (null). If not found, it returns undefined.\n");

// Task 2: ES6 classes
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

class ElectronicProduct extends ProductClass {
  constructor(name, price, warrantyYears) {
    super(name, price, "Electronics");
    this.warrantyYears = warrantyYears;
  }

  getWarrantyInfo() {
    return `${this.name} comes with ${this.warrantyYears} year(s) of official manufacturer warranty.`;
  }
}

class ClothingProduct extends ProductClass {
  constructor(name, price, size, fabric) {
    super(name, price, "Clothing");
    this.size = size;
    this.fabric = fabric;
  }

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

console.log("\n[Task 2 Questions & Answers]");
console.log("Q1: What is the purpose of extends?");
console.log("A: Sets up prototypal inheritance between parent and child class prototypes and inherits static properties.\n");
console.log("Q2: Why must super() be called before using this?");
console.log("A: Derived constructors rely on parent class to initialize 'this'. Accessing 'this' before super() throws ReferenceError.\n");
console.log("Q3: Are ES6 classes completely different from prototype-based inheritance?");
console.log("A: No, ES6 classes are syntactic sugar over prototypal inheritance (typeof Class is function, methods attach to prototype).\n");

// Task 3: ES6 syntax in checkout
// (A) Arrow function for discounted price
const calculateFinalPrice = (price, discountPercent) => price - (price * (discountPercent / 100));
console.log(`(A) Discounted Price (₹50000 at 10% off): ₹${calculateFinalPrice(50000, 10)}`);

// (B) Template literal
const customerName = "Rahul";
const orderedItem = "Laptop";
const totalBill = 50000;
console.log(`(B) Hello ${customerName}, your order of ${orderedItem} is confirmed. Total: ₹${totalBill}.`);

// (C) Destructure name and email
const customer = { name: "Rahul", email: "rahul@gmail.com", city: "Mumbai" };
const { name: custName, email: custEmail } = customer;
console.log(`(C) Destructured -> Name: ${custName}, Email: ${custEmail}`);

// (D) Rest operator for total
const calculateTotal = (...prices) => prices.reduce((acc, curr) => acc + curr, 0);
console.log(`(D) Rest Total: ₹${calculateTotal(50000, 800, 1500, 12000, 2500)}`);

// (E) Spread operator to copy with new price without mutating original
const originalProductObj = { id: 101, name: "Laptop", price: 50000, category: "Electronics" };
const updatedProductObj = { ...originalProductObj, price: 45000 };
console.log("(E) Original:", originalProductObj);
console.log("    Updated:", updatedProductObj);
console.log("    Original mutated?", originalProductObj.price === 45000 ? "Yes (Failed)" : "No (Passed)");

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
