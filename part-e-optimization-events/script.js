/**
 * QuickCart - Advanced JavaScript Practical Assignment
 * Part E: Performance Optimization & DOM Events
 * File: part-e-optimization-events/script.js
 */

// ============================================================================
// TASK 1: Debouncing (500 ms)
// ============================================================================
/**
 * Debounce higher-order function
 * Delays invoking callback until after 'delay' milliseconds have elapsed
 * since the last time the debounced function was invoked.
 *
 * @param {Function} callback - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(callback, delay = 500) {
  let timerId = null;

  return function (...args) {
    const context = this;

    // Clear any existing timer to reset the quiet period
    if (timerId !== null) {
      clearTimeout(timerId);
    }

    // Schedule the callback execution
    timerId = setTimeout(() => {
      callback.apply(context, args);
      timerId = null;
    }, delay);
  };
}


// ============================================================================
// TASK 2: Throttling (1000 ms)
// ============================================================================
/**
 * Throttle higher-order function
 * Ensures callback is invoked at most once per 'delay' millisecond interval.
 *
 * @param {Function} callback - Function to throttle
 * @param {number} delay - Interval window in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(callback, delay = 1000) {
  let lastExecTime = 0;
  let timeoutId = null;

  return function (...args) {
    const context = this;
    const currentTime = Date.now();
    const timeRemaining = delay - (currentTime - lastExecTime);

    if (timeRemaining <= 0) {
      // Interval has passed, execute immediately
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastExecTime = currentTime;
      callback.apply(context, args);
    } else if (!timeoutId) {
      // Ensure trailing edge execution if requested within interval
      timeoutId = setTimeout(() => {
        lastExecTime = Date.now();
        timeoutId = null;
        callback.apply(context, args);
      }, timeRemaining);
    }
  };
}


// ============================================================================
// TASK 3: Memoization
// ============================================================================
/**
 * Expensive discount computation function
 * @param {number} price
 * @param {number} percentage
 * @returns {number} Final discounted price
 */
function calculateDiscount(price, percentage) {
  // Simulate computationally intensive math
  const discountAmount = (price * percentage) / 100;
  return price - discountAmount;
}

/**
 * Generic Memoization Wrapper
 * Caches function outputs based on stringified arguments.
 *
 * @param {Function} fn - Pure function to memoize
 * @returns {Function} Memoized function
 */
function memoize(fn) {
  // Closure variable maintaining the internal cache
  const cache = new Map();

  return function (...args) {
    const cacheKey = JSON.stringify(args);

    if (cache.has(cacheKey)) {
      const cachedValue = cache.get(cacheKey);
      return {
        result: cachedValue,
        source: "cache",
        key: cacheKey
      };
    }

    const computedValue = fn.apply(this, args);
    cache.set(cacheKey, computedValue);
    return {
      result: computedValue,
      source: "fresh",
      key: cacheKey
    };
  };
}

// Create memoized discount calculator
const memoizedCalculateDiscount = memoize(calculateDiscount);


// ============================================================================
// DOM EVENT BINDINGS & DEMONSTRATION LOGIC
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  // --------------------------------------------------------------------------
  // 1. Debounce UI Integration
  // --------------------------------------------------------------------------
  const searchInput = document.getElementById("searchInput");
  const rawKeystrokesCountEl = document.getElementById("rawKeystrokesCount");
  const debounceTriggersCountEl = document.getElementById("debounceTriggersCount");
  const debounceLogs = document.getElementById("debounceLogs");

  let rawKeystrokes = 0;
  let debounceExecutions = 0;

  function appendLog(boxElement, text, type = "") {
    const time = new Date().toLocaleTimeString();
    const entry = document.createElement("div");
    entry.className = `log-entry ${type}`;
    entry.textContent = `[${time}] ${text}`;
    boxElement.prepend(entry);
  }

  // The actual search API function to be debounced
  function performSearch(query) {
    debounceExecutions += 1;
    debounceTriggersCountEl.textContent = debounceExecutions;
    appendLog(
      debounceLogs,
      `🔎 Executed search query for: "${query || "(empty)"}"`,
      "fresh"
    );
  }

  const debouncedSearchHandler = debounce((e) => {
    performSearch(e.target.value);
  }, 500);

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      rawKeystrokes += 1;
      rawKeystrokesCountEl.textContent = rawKeystrokes;
      debouncedSearchHandler(e);
    });
  }

  // --------------------------------------------------------------------------
  // 2. Throttle UI Integration
  // --------------------------------------------------------------------------
  const scrollContainer = document.getElementById("scrollContainer");
  const rawScrollEventsCountEl = document.getElementById("rawScrollEventsCount");
  const throttledExecutionsCountEl = document.getElementById("throttledExecutionsCount");
  const throttleLogs = document.getElementById("throttleLogs");

  let rawScrollEvents = 0;
  let throttledExecutions = 0;

  function handleScrollUpdate(scrollTop) {
    throttledExecutions += 1;
    throttledExecutionsCountEl.textContent = throttledExecutions;
    appendLog(
      throttleLogs,
      `⏱️ Throttled scroll triggered at position: ${Math.round(scrollTop)}px`,
      "fresh"
    );
  }

  const throttledScrollHandler = throttle((scrollTop) => {
    handleScrollUpdate(scrollTop);
  }, 1000);

  if (scrollContainer) {
    scrollContainer.addEventListener("scroll", (e) => {
      rawScrollEvents += 1;
      rawScrollEventsCountEl.textContent = rawScrollEvents;
      throttledScrollHandler(e.target.scrollTop);
    });
  }

  // --------------------------------------------------------------------------
  // 3. Memoization UI Integration
  // --------------------------------------------------------------------------
  const memoPriceInput = document.getElementById("memoPriceInput");
  const memoPercentInput = document.getElementById("memoPercentInput");
  const calcDiscountBtn = document.getElementById("calcDiscountBtn");
  const memoResultOutput = document.getElementById("memoResultOutput");
  const memoLogs = document.getElementById("memoLogs");

  if (calcDiscountBtn) {
    calcDiscountBtn.addEventListener("click", () => {
      const price = parseFloat(memoPriceInput.value);
      const percentage = parseFloat(memoPercentInput.value);

      if (isNaN(price) || isNaN(percentage)) {
        alert("Please enter valid numeric values for price and percentage.");
        return;
      }

      const { result, source, key } = memoizedCalculateDiscount(price, percentage);

      if (source === "cache") {
        memoResultOutput.innerHTML = `<span style="color:#d97706; font-weight:700;">💾 ₹${result} (Retrieved from Cache)</span>`;
        appendLog(memoLogs, `💾 CACHE HIT for args ${key} -> Result: ₹${result}`, "cache");
      } else {
        memoResultOutput.innerHTML = `<span style="color:#10b981; font-weight:700;">⚡ ₹${result} (Fresh Calculation)</span>`;
        appendLog(memoLogs, `⚡ FRESH CALCULATION for args ${key} -> Result: ₹${result}`, "fresh");
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. Event Bubbling & Delegation
  // --------------------------------------------------------------------------
  const productListContainer = document.getElementById("productListContainer");
  const stopPropCheckbox = document.getElementById("stopPropCheckbox");
  const bubblingLogs = document.getElementById("bubblingLogs");
  const addProductBtn = document.getElementById("addProductBtn");

  let nextProductId = 104;

  // Task 4 Bubbling listener on parent list container
  if (productListContainer) {
    // 1. Parent listener to demonstrate bubbling
    productListContainer.addEventListener("click", (event) => {
      appendLog(
        bubblingLogs,
        `🔔 [Bubbling Parent Container] Click arrived at container! Target: <${event.target.tagName.toLowerCase()} class="${event.target.className}"> | CurrentTarget: <${event.currentTarget.tagName.toLowerCase()}>`,
        "fresh"
      );
    });

    // 2. Event Delegation for Remove Buttons
    productListContainer.addEventListener("click", (event) => {
      // Check if the clicked target is the remove button
      const removeBtn = event.target.closest(".btn-remove-product");

      if (removeBtn) {
        // If stopPropagation checkbox is active, stop it from bubbling up
        if (stopPropCheckbox && stopPropCheckbox.checked) {
          event.stopPropagation();
          appendLog(
            bubblingLogs,
            `🛑 event.stopPropagation() called! Event prevented from bubbling to parent container handlers.`,
            "warn"
          );
        }

        const productItem = removeBtn.closest(".product-item");
        if (productItem) {
          const productName = productItem.querySelector(".product-title")?.textContent || "Item";
          productItem.style.opacity = "0";
          productItem.style.transform = "translateX(20px)";
          setTimeout(() => {
            productItem.remove();
            appendLog(
              bubblingLogs,
              `🗑️ [Delegation] Successfully removed "${productName}" from DOM using event.target!`,
              "fresh"
            );
          }, 200);
        }
      }
    });
  }

  // Ability to dynamically add a product to prove event delegation handles dynamic elements
  if (addProductBtn) {
    addProductBtn.addEventListener("click", () => {
      const sampleNames = ["Gaming Mousepad", "4K Webcam", "USB-C Hub", "Laptop Stand", "Bluetooth Speaker"];
      const chosenName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
      const randomPrice = Math.floor(Math.random() * 4000) + 500;

      const newProductItem = document.createElement("div");
      newProductItem.className = "product-item";
      newProductItem.setAttribute("data-id", nextProductId);
      newProductItem.innerHTML = `
        <div class="product-info">
          <span class="product-title">${chosenName}</span>
          <span class="product-meta">ID: #${nextProductId} · Price: ₹${randomPrice} · (Dynamically Added)</span>
        </div>
        <button class="btn btn-danger btn-sm btn-remove-product" type="button">
          Remove
        </button>
      `;

      nextProductId++;
      productListContainer.appendChild(newProductItem);

      appendLog(
        bubblingLogs,
        `➕ Dynamically inserted "${chosenName}". Notice no new event listener was attached! Event delegation automatically handles it.`,
        "fresh"
      );
    });
  }
});

// Export functions for Node / unit test evaluation
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    debounce,
    throttle,
    calculateDiscount,
    memoize
  };
}
