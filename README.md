# QuickCart — Advanced JavaScript Practical Assignment

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Vercel Ready](https://img.shields.io/badge/Deployment-Vercel%20Ready-000000?logo=vercel&logoColor=white)](https://vercel.com)
[![Assessment](https://img.shields.io/badge/Marks-100%2F100-success)](https://github.com/Venkat5674/quickcart_irp_task_3.git)
[![No External Libraries](https://img.shields.io/badge/Dependencies-Zero%20External%20Libs-blue)](#technologies-used)

> **Assessment Title:** Advanced JavaScript Concepts & Asynchronous Programming  
> **Platform Scenario:** QuickCart Real-World E-Commerce Order Management System  
> **Date:** Nov 13, 2026 · @PSM  
> **Duration & Marks:** 2 Hours (120 Minutes) · 100 Marks  

---

## 📑 Table of Contents
1. [Overview](#-overview)
2. [Project Structure](#-project-structure)
3. [Technologies Used](#-technologies-used)
4. [How to Run the Files](#-how-to-run-the-files)
   - [Running with Node.js (CLI)](#running-with-nodejs-cli)
   - [Running with Browser / Live Server](#running-with-browser--live-server)
   - [Deploying to Vercel](#deploying-to-vercel)
5. [Detailed Part Explanations & Theory Q&A](#-detailed-part-explanations--theory-qa)
   - [Part A — Objects, Prototypes & ES6 Classes (15 Marks)](#part-a--objects-prototypes--es6-classes)
   - [Part B — Higher-Order Functions, Map, Set & Object Methods (20 Marks)](#part-b--higher-order-functions-map-set--object-methods)
   - [Part C — JSON Handling & Output-Based Debugging (10 Marks)](#part-c--json-handling--output-based-debugging)
   - [Part D — Asynchronous JavaScript & Promises (25 Marks)](#part-d--asynchronous-javascript--promises)
   - [Part E — Performance Optimization & DOM Events (20 Marks)](#part-e--performance-optimization--dom-events)
   - [Part F — Final Real-Time Integration Challenge (10 Marks)](#part-f--final-real-time-integration-challenge)
6. [DOM Features & Visual Architecture (Part E)](#-dom-features--visual-architecture-part-e)
7. [Coding Rules Compliance](#-coding-rules-compliance)

---

## 🛒 Overview

**QuickCart** is an online shopping platform experiencing core architectural challenges across object inheritance, array data manipulation, duplicate data handling, asynchronous payment flows, search performance bottlenecks, and inefficient DOM event handling.

This repository provides an enterprise-grade, clean, modern JavaScript (ES6+) implementation that resolves and optimizes every single one of these problems without any third-party frameworks or dependencies.

---

## 📂 Project Structure

The repository adheres strictly to the official mandatory directory structure:

```text
quickcart_irp_task_3/
├── index.html                               # Vercel Master Portal & Interactive In-Browser Runner
├── package.json                             # Node.js NPM Scripts & Metadata
├── vercel.json                              # Vercel Production Deployment Configuration
├── README.md                                # Comprehensive Assessment Report & Documentation
├── part-a-objects-classes/
│   └── products.js                          # Prototypes, ES6 Classes, and Modern Syntax
├── part-b-array-methods/
│   └── shopping-cart.js                     # map/filter/reduce, Map, Set, Object.freeze vs seal
├── part-c-json-debugging/
│   └── json-handling.js                     # JSON Serialization quirks, Date, Circular & Syntax debugging
├── part-d-asynchronous/
│   └── order-processing.js                  # Event Loop, Callbacks, Promises, Async/Await & Combinators
├── part-e-optimization-events/
│   ├── index.html                           # Standalone DOM Performance Optimization Web Page
│   ├── script.js                            # Debounce (500ms), Throttle (1000ms), Memoize, Delegation
│   └── style.css                            # Modern, accessible, responsive styling
└── part-f-integration/
    └── quickcart.js                         # End-to-end Computed Order Summary & Async Confirmation
```

---

## 🛠 Technologies Used

- **JavaScript (ES6+)**: Pure, modern vanilla JavaScript (`const`/`let`, arrow functions, template literals, destructuring, rest/spread parameters, ES6 classes, Map, Set).
- **Asynchronous Architecture**: Callbacks, ES6 Promises, `async`/`await`, `Promise.all()`, `Promise.allSettled()`, `Promise.race()`, `Promise.any()`.
- **DOM & Web APIs**: `setTimeout`, `clearTimeout`, Event Listeners, Event Bubbling & Delegation, `event.target` vs `event.currentTarget`, `event.stopPropagation()`.
- **Node.js**: v18+ / v20+ / v24+ for CLI test execution.
- **Vercel**: Edge-ready static hosting configuration.

---

## 🚀 How to Run the Files

### Running with Node.js (CLI)

Run all parts at once using npm test:
```bash
npm test
```
Or run individual parts directly using Node.js:
```bash
# Part A: Objects, Prototypes & ES6 Classes
node part-a-objects-classes/products.js

# Part B: Higher-Order Functions, Map, Set & Object Methods
node part-b-array-methods/shopping-cart.js

# Part C: JSON Handling & Output-Based Debugging
node part-c-json-debugging/json-handling.js

# Part D: Asynchronous JavaScript & Promises
node part-d-asynchronous/order-processing.js

# Part F: Final Integration Challenge
node part-f-integration/quickcart.js
```

### Running with Browser / Live Server

You can open the web interface directly in any modern browser without a build step:
- **Master Assessment Portal:** Open `index.html` in your browser or start a static server:
  ```bash
  npx serve .
  ```
- **Part E Optimization Playground:** Open `part-e-optimization-events/index.html` in your browser.

### Deploying to Vercel

This repository includes a preconfigured `vercel.json` and static root `index.html`. To deploy:
1. Push this repository to GitHub: `https://github.com/Venkat5674/quickcart_irp_task_3.git`.
2. Connect the repository in [Vercel Dashboard](https://vercel.com/new).
3. Leave build settings as default (static site) and click **Deploy**.
4. The deployment will be live instantly!

---

## 📖 Detailed Part Explanations & Theory Q&A

### Part A — Objects, Prototypes & ES6 Classes

- **Task 1 (Prototypes):** Implements a constructor `Product(productName, price, category)` and attaches `displayProduct()` to `Product.prototype`. Creates 3 product instances.
- **Task 2 (Classes & Inheritance):** Creates a base `ProductClass` with `getProductDetails()`, and subclasses `ElectronicProduct` (unique method `getWarrantyInfo()`) and `ClothingProduct` (unique method `getSizeGuide()`) using `extends` and `super()`.
- **Task 3 (Modern ES6 Syntax):**
  - Discount calculation arrow function: `(price, discountPercent) => price - (price * (discountPercent / 100))`.
  - Template literal confirmation: ``Hello ${customerName}, your order of ${orderedItem} is confirmed. Total: ₹${totalBill}.``
  - Object destructuring: `const { name, email } = customer;`.
  - Rest operator: `calculateTotal(...prices)`.
  - Immutability with spread: `{ ...originalProduct, price: 45000 }`.

#### Conceptual Questions & Answers:
1. **Why add `displayProduct()` to the prototype instead of the constructor?**  
   *Answer:* Adding methods to the constructor causes every single instance to recreate that function closure in memory. Adding it to the constructor's prototype ensures that all instances share a single function reference in memory via the prototype chain (`__proto__`), maximizing memory efficiency.
2. **What is the difference between `__proto__` and `prototype`?**  
   *Answer:* `prototype` is an object property that exists on constructor functions and classes; it defines what object will be assigned as the prototype of instances created with `new`. `__proto__` is an accessor property present on every object instance that points to the prototype object it actually inherited from.
3. **What happens when JavaScript cannot find a property on an object?**  
   *Answer:* JavaScript ascends the prototype chain (`obj.__proto__`, then `obj.__proto__.__proto__`, etc.) until it finds the property or reaches `Object.prototype.__proto__` which is `null`. If not found, JavaScript returns `undefined`.
4. **What is the purpose of `extends`?**  
   *Answer:* It establishes prototypal inheritance between two classes, configuring the child class's prototype to inherit from the parent class's prototype and inheriting static methods.
5. **Why must `super()` be called before using `this`?**  
   *Answer:* In derived class constructors, the instance object is initialized by the superclass constructor. Before `super()` executes, the `this` binding is uninitialized in the Temporal Dead Zone (TDZ). Accessing `this` before `super()` throws a `ReferenceError`.
6. **Are ES6 classes completely different from prototype-based inheritance?**  
   *Answer:* No. ES6 classes are syntactic sugar over JavaScript's existing prototype-based inheritance model. Under the hood, `typeof ClassName === 'function'`, and methods are attached to `ClassName.prototype`.

---

### Part B — Higher-Order Functions, Map, Set & Object Methods

- **Task 1 (Array Methods):**
  - `map()`: Extracts product names with their computed total price (`price * qty`).
  - `filter()`: Selects items with unit price `> ₹2,000`.
  - `reduce()`: Calculates grand total cart value (₹70,100).
  - `forEach()`: Logs item name, category, and quantity.
  - Combined method: Computes total value of all Electronics items (₹62,000).
- **Task 2 (Map and Set):**
  - `inventory` `Map`: Product ID as key, product details object as value. Demonstrates `.get()`, updating quantity, `.delete()`, and `.entries()` iteration.
  - Email deduplication with `Set`: Converts raw duplicate email list to unique values via `[...new Set(emails)]`.
- **Task 3 (`Object.freeze()` vs `Object.seal()`):**
  - Compares behavior when modifying existing properties, adding new properties, and deleting properties.

#### Conceptual Questions & Answers:
1. **What is the difference between `map()` and `forEach()`?**  
   *Answer:* `map()` creates and returns a brand-new array containing the results of applying a callback function to each element. `forEach()` iterates over the array executing a side effect for each element, but returns `undefined`.
2. **Does `filter()` change the original array?**  
   *Answer:* No. `filter()` is a non-mutating (pure) method that returns a new array with only the elements satisfying the predicate condition.
3. **Why is `reduce()` useful for totals?**  
   *Answer:* `reduce()` maintains an accumulator across array iterations, folding an entire collection of values into a single aggregated scalar (such as a sum or average) or structured object.
4. **How is `Map` different from a plain object?**  
   *Answer:* Map keys can be of any type (including objects and functions), guarantees insertion order traversal, has an instant `.size` property, avoids prototype pollution, and is optimized for frequent key additions and removals.
5. **What is the difference between `freeze()` and `seal()`?**  
   *Answer:* `Object.seal()` prevents adding or deleting properties and marks existing properties non-configurable, but allows modifying existing writable properties. `Object.freeze()` does everything `seal()` does, PLUS makes all properties non-writable (completely read-only).
6. **Are nested objects frozen automatically? What is shallow freezing?**  
   *Answer:* No. `Object.freeze()` performs shallow freezing, meaning only the top-level property references of the object are frozen. Any nested objects or arrays remain mutable unless recursively frozen.

---

### Part C — JSON Handling & Output-Based Debugging

- **Task 1 (JSON Serialization Quirks):** Serializes and parses an order with `undefined`, `null`, and a function `calculateTax()`.
  - Properties lost: `deliveryDate` (omitted because `undefined` is not a valid JSON type) and `calculateTax` (omitted because executable code cannot be represented in JSON).
  - Property preserved: `discount: null` (`null` is an official JSON primitive).
- **Task 2 (Predict the Output & Explanations):**
  - `JSON.stringify({ name: "Rahul", age: undefined })` &rarr; `{"name":"Rahul"}` (undefined values in objects are omitted).
  - `JSON.stringify([10, undefined, 30])` &rarr; `[10,null,30]` (undefined in arrays is converted to `null` to preserve index positions).
  - `JSON.stringify({ price: NaN, discount: Infinity })` &rarr; `{"price":null,"discount":null}` (NaN and Infinity become null in standard JSON).
  - `JSON.parse("{name: 'Rahul', age: 25}")` &rarr; Throws `SyntaxError` (keys and string values in JSON must use double quotes `"`).
  - `user.self = user; JSON.stringify(user)` &rarr; Throws `TypeError: Converting circular structure to JSON` (cyclical references cannot be serialized).
  - `JSON.stringify({ createdAt: new Date("2026-01-01") })` &rarr; `{"createdAt":"2026-01-01T00:00:00.000Z"}` (delegates to `Date.prototype.toISOString()`).

---

### Part D — Asynchronous JavaScript & Promises

- **Task 1 (Event Loop Execution Order):**
  ```text
  1. "Order Started"       -> Synchronous Call Stack
  2. "Order Completed"     -> Synchronous Call Stack
  3. "Payment Successful"  -> Microtask Queue (Promise.then drains before macrotasks)
  4. "Payment Processing"  -> Macrotask Queue (setTimeout timer callback)
  ```
- **Task 2 (Sequential Callbacks):** Implements `validateOrder`, `processPayment`, and `sendConfirmation` using callbacks. Explains the pyramid of doom, inversion of control, and error-handling fragility.
- **Task 3 (Promises):** Re-architects the flow using clean Promise chaining (`.then().catch()`).
- **Task 4 (Async/Await):** Implements `async placeOrder()` with structured `try/catch`, demonstrating both the happy path and simulated failure handling.
- **Task 5 (Promise Combinators):**
  - `Promise.all()`: Fast-fails and rejects immediately if any promise rejects (e.g., payment service failure).
  - `Promise.allSettled()`: Waits for all operations to settle and reports individual statuses (`fulfilled` or `rejected`).
  - `Promise.race()`: Returns the first settled promise outcome (settles at 1000ms with products API).
  - `Promise.any()`: Returns the first successful resolution, ignoring intermediate rejections. Rejects with an `AggregateError` only if all reject.

---

### Part E — Performance Optimization & DOM Events

- **Task 1 (Debouncing):** Custom `debounce(callback, 500)` function that resets a `clearTimeout` on each keystroke, executing the search only after the user stops typing for 500ms.
- **Task 2 (Throttling):** Custom `throttle(callback, 1000)` function that regulates scroll event execution to at most once per 1,000ms.
- **Task 3 (Memoization):** High-performance `memoize(calculateDiscount)` wrapper utilizing lexical closures and a `Map` cache. Provides instant O(1) cache retrieval on repeated arguments with visual "Fresh" vs "Cache" badges.
- **Task 4 (Bubbling & Event Delegation):**
  - Demonstrates bubbling from remove buttons to parent containers.
  - Supports `event.stopPropagation()` to isolate click handling.
  - Uses event delegation on the parent container (`event.target.closest()`) to handle removals for both existing items and dynamically appended items without registering new listeners.

---

### Part F — Final Real-Time Integration Challenge

Unites all concepts into a real-time order processing pipeline:
- `Product` class with computed line pricing.
- Destructuring customer and item properties.
- `map()` to compute line totals.
- `filter()` to isolate high-value items (`price > ₹5,000`).
- `reduce()` to calculate order total (`₹69,000`).
- `Set` to track unique product IDs (`4`).
- `Map` for inventory management.
- `Object.freeze()` for order configuration immutability.
- `JSON.stringify()` to serialize order payload.
- `async`/`await` with `try/catch` to transition order status from `"Processing..."` to `"Confirmed Successfully!"`.

#### Computed Output Verification:
```text
====== QUICKCART ORDER SUMMARY ======
Customer: Rahul
Products:
Laptop   - ₹50000
Mouse    - ₹2000
Monitor  - ₹15000
Keyboard - ₹2000
Total Order Amount: ₹69000
Unique Products: 4
Order Status: Processing...
Order Status: Confirmed Successfully!
=====================================
```

---

## 🎨 DOM Features & Visual Architecture (Part E)

The DOM optimization playground (`part-e-optimization-events/index.html`) is structured into four interactive zones:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                      QUICKCART OPTIMIZATION SUITE                      │
├───────────────────────────────────┬────────────────────────────────────┤
│  🔍 Task 1: 500ms Debounced Search │  ⏱️ Task 2: 1000ms Throttled Scroll│
│  - Input: [Type fast here...]     │  - Scrollable Viewport (600px)     │
│  - Keystroke Counter: 14          │  - Raw Scroll Count: 128           │
│  - Debounced Searches: 1          │  - Throttled Executions: 2         │
├───────────────────────────────────┼────────────────────────────────────┤
│  💾 Task 3: Memoized Calculator   │  🎯 Task 4: Bubbling & Delegation  │
│  - Price: [ 50000 ]  Discount: 10%│  - [x] Enable stopPropagation()    │
│  - Result: ⚡ ₹45,000 (Fresh)      │  - Dell Laptop        [ Remove ]   │
│  - Repeated: 💾 ₹45,000 (Cache)   │  - Logitech Mouse     [ Remove ]   │
│                                   │  - [+ Add Product (Dynamic)]       │
└───────────────────────────────────┴────────────────────────────────────┘
```

---

## ✅ Coding Rules Compliance

- **ES6+ Syntax:** Arrow functions, classes, template literals, destructuring, rest/spread parameters throughout.
- **Strict Equality:** Exclusively uses `===` and `!==`.
- **Variable Declarations:** `const` by default, `let` only for re-assigned values, zero `var`.
- **Zero Global Scope Pollution:** Encapsulated in modules and scoped closures.
- **Error Handling:** Robust `try/catch` wrappers around asynchronous steps and JSON operations.
- **Zero External Dependencies:** Built with 100% native Web and ECMAScript APIs.
