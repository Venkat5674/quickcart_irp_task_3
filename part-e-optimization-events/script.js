// QuickCart - Part E: Performance Optimization & DOM Events

// Task 1: Debouncing (500 ms)
function debounce(callback, delay = 500) {
  let timerId = null;

  return function (...args) {
    const context = this;
    if (timerId !== null) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      callback.apply(context, args);
      timerId = null;
    }, delay);
  };
}

// Task 2: Throttling (1000 ms)
function throttle(callback, delay = 1000) {
  let lastExecTime = 0;
  let timeoutId = null;

  return function (...args) {
    const context = this;
    const currentTime = Date.now();
    const timeRemaining = delay - (currentTime - lastExecTime);

    if (timeRemaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastExecTime = currentTime;
      callback.apply(context, args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastExecTime = Date.now();
        timeoutId = null;
        callback.apply(context, args);
      }, timeRemaining);
    }
  };
}

// Task 3: Memoization
function calculateDiscount(price, percentage) {
  return price - ((price * percentage) / 100);
}

function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    const cacheKey = JSON.stringify(args);

    if (cache.has(cacheKey)) {
      return {
        result: cache.get(cacheKey),
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

const memoizedCalculateDiscount = memoize(calculateDiscount);

// DOM event bindings
document.addEventListener("DOMContentLoaded", () => {
  // 1. Debounce integration
  const searchInput = document.getElementById("searchInput");
  const rawKeystrokesCountEl = document.getElementById("rawKeystrokesCount");
  const debounceTriggersCountEl = document.getElementById("debounceTriggersCount");
  const debounceLogs = document.getElementById("debounceLogs");

  let rawKeystrokes = 0;
  let debounceExecutions = 0;

  function appendLog(boxElement, text, type = "") {
    if (!boxElement) return;
    const time = new Date().toLocaleTimeString();
    const entry = document.createElement("div");
    entry.className = `log-entry ${type}`;
    entry.textContent = `[${time}] ${text}`;
    boxElement.prepend(entry);
  }

  const debouncedSearchHandler = debounce((e) => {
    debounceExecutions += 1;
    if (debounceTriggersCountEl) debounceTriggersCountEl.textContent = debounceExecutions;
    appendLog(debounceLogs, `Executed search: "${e.target.value}"`, "fresh");
  }, 500);

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      rawKeystrokes += 1;
      if (rawKeystrokesCountEl) rawKeystrokesCountEl.textContent = rawKeystrokes;
      debouncedSearchHandler(e);
    });
  }

  // 2. Throttle integration
  const scrollContainer = document.getElementById("scrollContainer");
  const rawScrollEventsCountEl = document.getElementById("rawScrollEventsCount");
  const throttledExecutionsCountEl = document.getElementById("throttledExecutionsCount");
  const throttleLogs = document.getElementById("throttleLogs");

  let rawScrollEvents = 0;
  let throttledExecutions = 0;

  const throttledScrollHandler = throttle((scrollTop) => {
    throttledExecutions += 1;
    if (throttledExecutionsCountEl) throttledExecutionsCountEl.textContent = throttledExecutions;
    appendLog(throttleLogs, `Throttled scroll at: ${Math.round(scrollTop)}px`, "fresh");
  }, 1000);

  if (scrollContainer) {
    scrollContainer.addEventListener("scroll", (e) => {
      rawScrollEvents += 1;
      if (rawScrollEventsCountEl) rawScrollEventsCountEl.textContent = rawScrollEvents;
      throttledScrollHandler(e.target.scrollTop);
    });
  }

  // 3. Memoization integration
  const memoPriceInput = document.getElementById("memoPriceInput");
  const memoPercentInput = document.getElementById("memoPercentInput");
  const calcDiscountBtn = document.getElementById("calcDiscountBtn");
  const memoResultOutput = document.getElementById("memoResultOutput");
  const memoLogs = document.getElementById("memoLogs");

  if (calcDiscountBtn) {
    calcDiscountBtn.addEventListener("click", () => {
      const price = parseFloat(memoPriceInput.value);
      const percentage = parseFloat(memoPercentInput.value);

      if (isNaN(price) || isNaN(percentage)) return;

      const { result, source, key } = memoizedCalculateDiscount(price, percentage);

      if (source === "cache") {
        memoResultOutput.innerHTML = `<span style="color:#d97706; font-weight:700;">💾 ₹${result} (Cache Hit)</span>`;
        appendLog(memoLogs, `Cache hit for ${key} -> ₹${result}`, "cache");
      } else {
        memoResultOutput.innerHTML = `<span style="color:#10b981; font-weight:700;">⚡ ₹${result} (Fresh Calculation)</span>`;
        appendLog(memoLogs, `Fresh calculation for ${key} -> ₹${result}`, "fresh");
      }
    });
  }

  // 4. Bubbling & Event delegation
  const productListContainer = document.getElementById("productListContainer");
  const stopPropCheckbox = document.getElementById("stopPropCheckbox");
  const bubblingLogs = document.getElementById("bubblingLogs");
  const addProductBtn = document.getElementById("addProductBtn");

  let nextProductId = 104;

  if (productListContainer) {
    // Parent bubbling listener
    productListContainer.addEventListener("click", (event) => {
      appendLog(
        bubblingLogs,
        `Bubbled to parent! Target: <${event.target.tagName.toLowerCase()}> | CurrentTarget: <${event.currentTarget.tagName.toLowerCase()}>`,
        "fresh"
      );
    });

    // Delegated click listener for removal
    productListContainer.addEventListener("click", (event) => {
      const removeBtn = event.target.closest(".btn-remove-product");
      if (removeBtn) {
        if (stopPropCheckbox && stopPropCheckbox.checked) {
          event.stopPropagation();
          appendLog(bubblingLogs, "stopPropagation() called; bubbling stopped.", "warn");
        }

        const productItem = removeBtn.closest(".product-item");
        if (productItem) {
          const title = productItem.querySelector(".product-title")?.textContent || "Item";
          productItem.remove();
          appendLog(bubblingLogs, `Removed "${title}" via delegation.`, "fresh");
        }
      }
    });
  }

  // Dynamic product addition
  if (addProductBtn) {
    addProductBtn.addEventListener("click", () => {
      const names = ["Webcam", "USB-C Hub", "Laptop Stand", "Speaker"];
      const name = names[Math.floor(Math.random() * names.length)];
      const price = Math.floor(Math.random() * 3000) + 800;

      const item = document.createElement("div");
      item.className = "product-item";
      item.setAttribute("data-id", nextProductId);
      item.innerHTML = `
        <div class="product-info">
          <span class="product-title">${name}</span>
          <span class="product-meta">ID: #${nextProductId} · Price: ₹${price}</span>
        </div>
        <button class="btn btn-danger btn-sm btn-remove-product" type="button">Remove</button>
      `;

      nextProductId++;
      productListContainer.appendChild(item);
      appendLog(bubblingLogs, `Added "${name}". Handled dynamically by delegation.`, "fresh");
    });
  }
});

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    debounce,
    throttle,
    calculateDiscount,
    memoize
  };
}
