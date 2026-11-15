// QuickCart - Part D: Asynchronous JavaScript & Promises

console.log("=== PART D: Asynchronous JavaScript & Promises ===\n");

// Task 1: Event loop
console.log("--- Task 1: Event Loop Execution Order ---");
console.log("Predicted Order:");
console.log(" 1. Order Started       (Synchronous Call Stack)");
console.log(" 2. Order Completed     (Synchronous Call Stack)");
console.log(" 3. Payment Successful  (Microtask Queue)");
console.log(" 4. Payment Processing  (Macrotask Queue)\n");

console.log("[Task 1 Questions & Answers]");
console.log("Q1: Why does the Promise callback run before setTimeout()?");
console.log("A: Microtask queue (Promises) has priority and is drained before macrotask queue (setTimeout).\n");
console.log("Q2: What are microtask and macrotask queues?");
console.log("A: Microtasks: Promises, queueMicrotask; Macrotasks: setTimeout, setInterval, I/O.\n");
console.log("Q3: What role does the call stack play?");
console.log("A: Single-threaded LIFO execution structure executing synchronous frames.\n");
console.log("Q4: What does the event loop do?");
console.log("A: Monitors call stack, empties microtasks when stack is free, then runs the next macrotask.\n");

// Live execution of Task 1
console.log("Live execution:");
console.log("Order Started");
setTimeout(() => console.log("Payment Processing"), 0);
Promise.resolve().then(() => console.log("Payment Successful"));
console.log("Order Completed");

// Sequential tasks execution wrapper
async function runAsyncTasks() {
  await new Promise(r => setTimeout(r, 80));

  // Task 2: Callbacks
  console.log("\n--- Task 2: Callbacks ---");
  function validateOrder(cb) {
    setTimeout(() => {
      console.log("Order Validated");
      cb(null);
    }, 1000);
  }

  function processPayment(cb) {
    setTimeout(() => {
      console.log("Payment Completed");
      cb(null);
    }, 1000);
  }

  function sendConfirmation(cb) {
    setTimeout(() => {
      console.log("Confirmation Sent");
      cb(null);
    }, 1000);
  }

  await new Promise(resolve => {
    validateOrder(() => {
      processPayment(() => {
        sendConfirmation(() => {
          console.log("Callback flow completed.");
          console.log("\nWhy callback hell is hard to maintain:");
          console.log("Deep nesting ('pyramid of doom'), repetitive error handling, and hard-to-compose asynchronous logic.\n");
          resolve();
        });
      });
    });
  });

  // Task 3: Promises
  console.log("--- Task 3: Promises ---");
  const validateOrderPromise = () => new Promise(r => setTimeout(() => { console.log("Order Validated (Promise)"); r(); }, 1000));
  const processPaymentPromise = () => new Promise(r => setTimeout(() => { console.log("Payment Completed (Promise)"); r(); }, 1000));
  const sendConfirmationPromise = () => new Promise(r => setTimeout(() => { console.log("Confirmation Sent (Promise)"); r(); }, 1000));

  await validateOrderPromise()
    .then(() => processPaymentPromise())
    .then(() => sendConfirmationPromise())
    .then(() => console.log("Promise chain completed.\n"))
    .catch(err => console.error("Promise Error:", err));

  // Task 4: Async/Await
  console.log("--- Task 4: Async/Await ---");
  async function placeOrder(fail = false) {
    try {
      console.log(`placeOrder() [Simulate Failure: ${fail}]...`);
      await validateOrderPromise();
      if (fail) throw new Error("Payment Gateway Timeout");
      await processPaymentPromise();
      await sendConfirmationPromise();
      console.log("Success: Order confirmed!\n");
    } catch (err) {
      console.log(`Failure: ${err.message}\n`);
    }
  }

  await placeOrder(false);
  await placeOrder(true);

  // Task 5: Promise combinators
  console.log("--- Task 5: Promise Combinators ---");
  const productsAPI = () => new Promise(r => setTimeout(() => r("Products Loaded"), 1000));
  const paymentAPI = () => new Promise((_, rej) => setTimeout(() => rej(new Error("Payment Service Failed")), 1500));
  const deliveryAPI = () => new Promise(r => setTimeout(() => r("Delivery Loaded"), 2000));

  // Promise.all()
  try {
    await Promise.all([productsAPI(), paymentAPI(), deliveryAPI()]);
  } catch (err) {
    console.log("1. Promise.all() rejected first:", err.message);
  }

  // Promise.allSettled()
  const settled = await Promise.allSettled([productsAPI(), paymentAPI(), deliveryAPI()]);
  console.log("2. Promise.allSettled() results count:", settled.length);

  // Promise.race()
  try {
    const raceRes = await Promise.race([productsAPI(), paymentAPI(), deliveryAPI()]);
    console.log("3. Promise.race() settled first:", raceRes);
  } catch (err) {
    console.log("3. Promise.race() error:", err.message);
  }

  // Promise.any()
  try {
    const anyRes = await Promise.any([productsAPI(), paymentAPI(), deliveryAPI()]);
    console.log("4. Promise.any() first success:", anyRes);
  } catch (err) {
    console.log("4. Promise.any() all rejected:", err.errors);
  }

  console.log("\n[Task 5 Questions & Answers]");
  console.log("Q1: What is the difference between all() and allSettled()?");
  console.log("A: all() rejects on first failure; allSettled() waits for all promises to resolve or reject.\n");
  console.log("Q2: Does race() wait for success or just the first settled result?");
  console.log("A: race() returns the first settled result (resolve or reject).\n");
  console.log("Q3: How is any() different from race()?");
  console.log("A: any() waits for the first success; race() stops at the first settled outcome.\n");
  console.log("Q4: What happens when every Promise in any() rejects?");
  console.log("A: It rejects with an AggregateError containing all errors.\n");
}

if (typeof require !== "undefined" && require.main === module) {
  runAsyncTasks();
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { runAsyncTasks };
}
