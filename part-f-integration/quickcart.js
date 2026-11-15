/**
 * QuickCart - Advanced JavaScript Practical Assignment
 * Part F: Final Real-Time Integration Challenge
 * File: part-f-integration/quickcart.js
 */

console.log("==================================================");
console.log("  PART F: Final Real-Time Integration Challenge");
console.log("==================================================\n");

// ============================================================================
// 1. ES6 Product Class
// ============================================================================
class Product {
  constructor(id, name, price, qty) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.qty = qty;
  }

  // Calculate total price for this item
  getTotalPrice() {
    return this.price * this.qty;
  }

  // Formatted product summary line
  getSummaryLine() {
    return `${this.name.padEnd(8)} - ₹${this.getTotalPrice()}`;
  }
}

// Initial Raw Products Data as specified
const rawProducts = [
  { id: 1, name: "Laptop", price: 50000, qty: 1 },
  { id: 2, name: "Mouse", price: 1000, qty: 2 },
  { id: 3, name: "Monitor", price: 15000, qty: 1 },
  { id: 4, name: "Keyboard", price: 2000, qty: 1 }
];

// Instantiate Product instances
const products = rawProducts.map(
  ({ id, name, price, qty }) => new Product(id, name, price, qty) // Destructuring in map callback
);

// ============================================================================
// 2. Destructuring & Array Methods (map, filter, reduce)
// ============================================================================
// map() for product item totals and formatted lines
const productLines = products.map((product) => {
  const { name } = product; // Destructuring property
  return product.getSummaryLine();
});

// filter() for products over ₹5,000 (demonstrating high-value items filter)
const premiumProducts = products.filter(({ price }) => price > 5000);

// reduce() for the total order amount
const totalOrderAmount = products.reduce(
  (accumulator, product) => accumulator + product.getTotalPrice(),
  0
);

// ============================================================================
// 3. Set for Unique Product IDs & Map for Inventory
// ============================================================================
// Set of unique product IDs
const uniqueProductIds = new Set(products.map(({ id }) => id));

// Map for inventory tracking
const inventoryMap = new Map();
products.forEach((product) => {
  const { id, name, qty } = product;
  inventoryMap.set(id, { name, stock: qty * 10 }); // e.g. warehouse stock
});

// ============================================================================
// 4. Object.freeze() on Order Configuration
// ============================================================================
const orderConfig = Object.freeze({
  customerName: "Rahul",
  currencySymbol: "₹",
  taxRate: 0.18,
  allowBackorders: false
});

// Attempt mutation to demonstrate immutability under Object.freeze
try {
  orderConfig.customerName = "Intruder";
} catch {
  // Silent or strict error handled
}

// ============================================================================
// 5. JSON.stringify() on the Order Payload
// ============================================================================
const orderPayload = {
  customer: orderConfig.customerName,
  items: products.map(({ id, name, price, qty }) => ({
    id,
    name,
    price,
    qty,
    itemTotal: price * qty
  })),
  totalAmount: totalOrderAmount,
  uniqueItemCount: uniqueProductIds.size,
  createdAt: new Date().toISOString()
};

const serializedOrderJSON = JSON.stringify(orderPayload, null, 2);

// ============================================================================
// 6. Async/Await Order Confirmation with try/catch & Template Literal Output
// ============================================================================
async function processOrderConfirmation(orderData) {
  try {
    const { customerName } = orderConfig; // Destructuring

    // 1. Initial output banner
    console.log(`====== QUICKCART ORDER SUMMARY ======`);
    console.log(`Customer: ${customerName}`);
    console.log(`Products:`);
    productLines.forEach((line) => console.log(line));
    console.log(`Total Order Amount: ₹${totalOrderAmount}`);
    console.log(`Unique Products: ${uniqueProductIds.size}`);
    console.log(`Order Status: Processing...`);

    // Simulate asynchronous server confirmation delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulated status transition
    console.log(`Order Status: Confirmed Successfully!`);
    console.log(`=====================================`);

    // Complete formatted order summary text via template literal
    const orderSummaryText = `
====== QUICKCART ORDER SUMMARY ======
Customer: ${customerName}
Products:
${productLines.join("\n")}
Total Order Amount: ₹${totalOrderAmount}
Unique Products: ${uniqueProductIds.size}
Order Status: Confirmed Successfully!
=====================================`;

    return {
      success: true,
      summaryText: orderSummaryText,
      payload: orderData
    };
  } catch (error) {
    console.error(`Order Confirmation Failed: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Execute confirmation if run directly
if (typeof require !== "undefined" && require.main === module) {
  processOrderConfirmation(orderPayload);
}

// Export for module/testing usage
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    Product,
    products,
    productLines,
    premiumProducts,
    totalOrderAmount,
    uniqueProductIds,
    inventoryMap,
    orderConfig,
    orderPayload,
    serializedOrderJSON,
    processOrderConfirmation
  };
}
