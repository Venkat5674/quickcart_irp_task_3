/**
 * QuickCart - Advanced JavaScript Practical Assignment
 * Part D: Asynchronous JavaScript & Promises
 * File: part-d-asynchronous/order-processing.js
 */

console.log("==================================================");
console.log("  PART D: Asynchronous JavaScript & Promises");
console.log("==================================================\n");

// Helper delay utility for clean sequencing
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// TASK 1: Event Loop Execution & Prediction
// ============================================================================
console.log("--- Task 1: Event Loop Output Prediction ---");

console.log(`Code under test:
  console.log("Order Started");
  setTimeout(() => console.log("Payment Processing"), 0);
  Promise.resolve().then(() => console.log("Payment Successful"));
  console.log("Order Completed");
`);

console.log("Predicted Output Order:");
console.log(" 1. Order Started       (Synchronous Call Stack)");
console.log(" 2. Order Completed     (Synchronous Call Stack)");
console.log(" 3. Payment Successful  (Microtask Queue - drained before macrotasks)");
console.log(" 4. Payment Processing  (Macrotask / Timer Queue - runs after microtasks)\n");

console.log("[Task 1 Questions & Answers]:");
console.log(`Q1: Why does the Promise callback run before setTimeout()?
A: Promise reactions (.then/.catch) are scheduled in the Microtask Queue, while setTimeout callbacks are scheduled in the Macrotask (Task) Queue. The JavaScript Event Loop always checks and completely drains the Microtask Queue as soon as the synchronous call stack empties, BEFORE picking the next macrotask from the Macrotask Queue.\n`);

console.log(`Q2: What are the microtask and macrotask queues?
A: - Microtask Queue: A high-priority queue for immediate asynchronous callbacks including Promises (.then, .catch, .finally), queueMicrotask(), and MutationObserver.
   - Macrotask Queue: A queue for scheduled runtime tasks such as setTimeout, setInterval, setImmediate (Node.js), and I/O callbacks.\n`);

console.log(`Q3: What role does the call stack play?
A: The call stack is a LIFO (Last-In, First-Out) data structure that tracks the currently executing function frames in the single-threaded JavaScript runtime. Code on the call stack executes synchronously to completion before any queued asynchronous callbacks can be processed.\n`);

console.log(`Q4: What does the event loop do?
A: The event loop constantly monitors the call stack and message queues. When the call stack becomes empty, it first runs all pending microtasks until the microtask queue is empty, and then picks the oldest ready macrotask from the macrotask queue and pushes it onto the call stack for execution.\n`);

// Execution Demonstration of Task 1:
console.log("Executing Task 1 code live:");
console.log("Order Started");
setTimeout(() => console.log("Payment Processing"), 0);
Promise.resolve().then(() => console.log("Payment Successful"));
console.log("Order Completed");


// ============================================================================
// TASKS 2, 3, 4, 5 (Coordinated via an orchestrator to maintain clear terminal output)
// ============================================================================
async function runAsynchronousWorkflow() {
  // Allow Task 1 event loop microtasks/macrotasks to settle
  await delay(100);

  // --------------------------------------------------------------------------
  // TASK 2: Callbacks
  // --------------------------------------------------------------------------
  console.log("\n--------------------------------------------------");
  console.log("--- Task 2: Callback-based Order Processing ---");
  console.log("--------------------------------------------------");

  function validateOrder(cb) {
    setTimeout(() => {
      console.log("Order Validated");
      cb(null, { orderId: 101, validated: true });
    }, 1000);
  }

  function processPayment(cb) {
    setTimeout(() => {
      console.log("Payment Completed");
      cb(null, { orderId: 101, paid: true, amount: 50000 });
    }, 1000);
  }

  function sendConfirmation(cb) {
    setTimeout(() => {
      console.log("Confirmation Sent");
      cb(null, { orderId: 101, confirmed: true });
    }, 1000);
  }

  await new Promise((resolve) => {
    // Nested sequential callback execution (Callback Hell)
    validateOrder((err, valResult) => {
      if (err) return console.error("Validation error:", err);

      processPayment((err, payResult) => {
        if (err) return console.error("Payment error:", err);

        sendConfirmation((err, confResult) => {
          if (err) return console.error("Confirmation error:", err);

          console.log("All callback steps finished sequentially!");
          console.log("\n[Why deeply nested callbacks (callback hell) are hard to maintain]:");
          console.log(` 1. Pyramid of Doom: Deep horizontal indentation makes code unreadable and hard to trace.
 2. Inversion of Control & Error Handling: Every single callback must duplicate error-handling boilerplate (if (err)...), increasing bug risk.
 3. Difficult Composition: Orchestrating parallel tasks, early returns, or cleanup logic is cumbersome compared to Promises.`);
          resolve();
        });
      });
    });
  });

  // --------------------------------------------------------------------------
  // TASK 3: Promises
  // --------------------------------------------------------------------------
  console.log("\n--------------------------------------------------");
  console.log("--- Task 3: Promise-based Order Processing (.then / .catch) ---");
  console.log("--------------------------------------------------");

  function validateOrderPromise() {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Order Validated (Promise)");
        resolve({ orderId: 101, valid: true });
      }, 1000);
    });
  }

  function processPaymentPromise() {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Payment Completed (Promise)");
        resolve({ orderId: 101, paid: true, amount: 50000 });
      }, 1000);
    });
  }

  function sendConfirmationPromise() {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Confirmation Sent (Promise)");
        resolve({ orderId: 101, confirmed: true });
      }, 1000);
    });
  }

  await validateOrderPromise()
    .then((valResult) => {
      return processPaymentPromise();
    })
    .then((payResult) => {
      return sendConfirmationPromise();
    })
    .then((confResult) => {
      console.log("Promise Chain completed successfully with .then()!");
    })
    .catch((err) => {
      console.error("Promise Chain caught error:", err);
    });

  // --------------------------------------------------------------------------
  // TASK 4: Async / Await
  // --------------------------------------------------------------------------
  console.log("\n--------------------------------------------------");
  console.log("--- Task 4: Async/Await Order Processing ---");
  console.log("--------------------------------------------------");

  async function placeOrder(simulateFailure = false) {
    try {
      console.log(`Starting placeOrder() [Simulate Failure: ${simulateFailure}]...`);
      await validateOrderPromise();

      if (simulateFailure) {
        throw new Error("Payment Gateway Timeout: Unable to complete payment");
      }

      await processPaymentPromise();
      await sendConfirmationPromise();
      console.log("Success: Order placed and confirmed successfully!");
      return { status: "SUCCESS", orderId: 101 };
    } catch (error) {
      console.log(`Failure: Order processing encountered an error -> ${error.message}`);
      return { status: "FAILED", reason: error.message };
    }
  }

  console.log("Testing Happy Path:");
  await placeOrder(false);

  console.log("\nTesting Error Path:");
  await placeOrder(true);

  // --------------------------------------------------------------------------
  // TASK 5: Promise Combinators
  // --------------------------------------------------------------------------
  console.log("\n--------------------------------------------------");
  console.log("--- Task 5: Promise Combinators ---");
  console.log("--------------------------------------------------");

  const productsAPI = () =>
    new Promise((resolve) => {
      setTimeout(() => resolve("Products Loaded"), 1000);
    });

  const paymentAPI = () =>
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Payment Service Failed")), 1500);
    });

  const deliveryAPI = () =>
    new Promise((resolve) => {
      setTimeout(() => resolve("Delivery Loaded"), 2000);
    });

  // 1. Promise.all()
  console.log("1. Running Promise.all([productsAPI(), paymentAPI(), deliveryAPI()])...");
  try {
    const allResult = await Promise.all([productsAPI(), paymentAPI(), deliveryAPI()]);
    console.log("Promise.all() Resolved:", allResult);
  } catch (err) {
    console.log("Promise.all() Rejected (Fast-fails on first rejection):", err.message);
  }

  // 2. Promise.allSettled()
  console.log("\n2. Running Promise.allSettled([productsAPI(), paymentAPI(), deliveryAPI()])...");
  const settledResults = await Promise.allSettled([productsAPI(), paymentAPI(), deliveryAPI()]);
  console.log("Promise.allSettled() Results (All settled regardless of reject/resolve):");
  settledResults.forEach((res, idx) => {
    const apiName = ["productsAPI", "paymentAPI", "deliveryAPI"][idx];
    if (res.status === "fulfilled") {
      console.log(` - ${apiName}: Fulfilled -> "${res.value}"`);
    } else {
      console.log(` - ${apiName}: Rejected -> "${res.reason.message}"`);
    }
  });

  // 3. Promise.race()
  console.log("\n3. Running Promise.race([productsAPI(), paymentAPI(), deliveryAPI()])...");
  try {
    const raceResult = await Promise.race([productsAPI(), paymentAPI(), deliveryAPI()]);
    console.log("Promise.race() Settled First (at 1000ms):", raceResult);
  } catch (err) {
    console.log("Promise.race() Rejected First:", err.message);
  }

  // 4. Promise.any()
  console.log("\n4. Running Promise.any([productsAPI(), paymentAPI(), deliveryAPI()])...");
  try {
    const anyResult = await Promise.any([productsAPI(), paymentAPI(), deliveryAPI()]);
    console.log("Promise.any() First Successful Result:", anyResult);
  } catch (err) {
    console.log("Promise.any() All Rejected:", err.errors);
  }

  console.log("\n[Task 5 Questions & Answers]:");
  console.log(`Q1: What is the difference between all() and allSettled()?
A: Promise.all() rejects immediately (short-circuits) if ANY single promise rejects, discarding the remaining results. Promise.allSettled() waits until ALL promises have completed (settled), whether they resolved or rejected, returning an array of descriptor objects with each promise's status and value/reason.\n`);

  console.log(`Q2: Does race() wait for success or just the first settled result?
A: Promise.race() only waits for the FIRST promise to settle (either fulfill OR reject). Whichever settles first determines the outcome.\n`);

  console.log(`Q3: How is any() different from race()?
A: Promise.any() waits for the FIRST SUCCESSFUL (fulfilled) promise, ignoring any intermediate rejections. In contrast, Promise.race() settles with the very first result, even if it is a rejection.\n`);

  console.log(`Q4: What happens when every Promise in any() rejects?
A: When all promises reject, Promise.any() rejects with an AggregateError, which is a special error object grouping all the individual rejection reasons in its .errors array property.\n`);

  console.log("=================== End of Part D ===================\n");
}

// Kick off the sequence if running as main
if (typeof require !== "undefined" && require.main === module) {
  runAsynchronousWorkflow();
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    runAsynchronousWorkflow
  };
}
