// QuickCart - Part F: Final Real-Time Integration Challenge

// Product class definition
class Product {
  constructor(id, name, price, qty) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.qty = qty;
  }

  getTotalPrice() {
    return this.price * this.qty;
  }

  getSummaryLine() {
    return `${this.name.padEnd(8)} - ₹${this.getTotalPrice()}`;
  }
}

const rawProducts = [
  { id: 1, name: "Laptop", price: 50000, qty: 1 },
  { id: 2, name: "Mouse", price: 1000, qty: 2 },
  { id: 3, name: "Monitor", price: 15000, qty: 1 },
  { id: 4, name: "Keyboard", price: 2000, qty: 1 }
];

// Product instances via destructuring
const products = rawProducts.map(
  ({ id, name, price, qty }) => new Product(id, name, price, qty)
);

// map() for product line totals
const productLines = products.map(product => product.getSummaryLine());

// filter() for products over ₹5,000
const premiumProducts = products.filter(({ price }) => price > 5000);

// reduce() for total order amount
const totalOrderAmount = products.reduce(
  (acc, product) => acc + product.getTotalPrice(),
  0
);

// Set for unique product IDs
const uniqueProductIds = new Set(products.map(({ id }) => id));

// Map for inventory
const inventoryMap = new Map();
products.forEach(({ id, name, qty }) => {
  inventoryMap.set(id, { name, stock: qty * 10 });
});

// Object.freeze() on configuration
const orderConfig = Object.freeze({
  customerName: "Rahul",
  currency: "₹"
});

// JSON.stringify() on order
const orderPayload = {
  customer: orderConfig.customerName,
  items: products.map(({ id, name, price, qty }) => ({
    id,
    name,
    price,
    qty,
    total: price * qty
  })),
  totalAmount: totalOrderAmount,
  uniqueProductsCount: uniqueProductIds.size
};
const serializedOrder = JSON.stringify(orderPayload);

// async/await confirmation with try/catch and template literal
async function processOrderConfirmation() {
  try {
    const { customerName } = orderConfig;

    console.log("====== QUICKCART ORDER SUMMARY ======");
    console.log(`Customer: ${customerName}`);
    console.log("Products:");
    productLines.forEach(line => console.log(line));
    console.log(`Total Order Amount: ₹${totalOrderAmount}`);
    console.log(`Unique Products: ${uniqueProductIds.size}`);
    console.log("Order Status: Processing...");

    // Simulated network processing delay
    await new Promise(resolve => setTimeout(resolve, 800));

    console.log("Order Status: Confirmed Successfully!");
    console.log("=====================================");
  } catch (error) {
    console.error(`Order Confirmation Failed: ${error.message}`);
  }
}

if (typeof require !== "undefined" && require.main === module) {
  processOrderConfirmation();
}

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
    serializedOrder,
    processOrderConfirmation
  };
}
