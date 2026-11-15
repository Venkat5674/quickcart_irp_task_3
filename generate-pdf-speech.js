const fs = require('fs');
const SimplePDF = require('./generate-pdf');

// Helper to escape PDF text strings
function escapePDFText(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

// Word wrapper
function wrapText(text, maxChars = 75) {
  const words = text.split(' ');
  const lines = [];
  let current = '';

  for (const word of words) {
    if ((current + (current ? ' ' : '') + word).length <= maxChars) {
      current += (current ? ' ' : '') + word;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

const pdf = new SimplePDF();

class PageWriter {
  constructor(pageNumber, totalPages = 4) {
    this.cmds = [];
    this.y = 790;
    this.pageNumber = pageNumber;
    this.totalPages = totalPages;

    // Header background bar
    this.rect(36, 805, 523, 4, [0.31, 0.27, 0.9]); // Indigo accent line
  }

  rect(x, y, w, h, fillColor = null, strokeColor = null, lineWidth = 1) {
    let s = `${lineWidth} w\n`;
    if (fillColor) {
      s += `${fillColor[0]} ${fillColor[1]} ${fillColor[2]} rg\n`;
    }
    if (strokeColor) {
      s += `${strokeColor[0]} ${strokeColor[1]} ${strokeColor[2]} RG\n`;
    }
    s += `${x} ${y} ${w} ${h} re\n`;
    if (fillColor && strokeColor) {
      s += `B\n`;
    } else if (fillColor) {
      s += `f\n`;
    } else if (strokeColor) {
      s += `S\n`;
    }
    this.cmds.push(s);
  }

  drawHeader(title, subtitle) {
    this.cmds.push(`BT /F1 18 Tf 0.12 0.11 0.29 rg 40 ${this.y} Td (${escapePDFText(title)}) Tj ET`);
    this.y -= 16;
    this.cmds.push(`BT /F2 10 Tf 0.31 0.27 0.9 rg 40 ${this.y} Td (${escapePDFText(subtitle)}) Tj ET`);
    this.y -= 22;
  }

  drawMetaBar(items) {
    this.rect(38, this.y - 12, 519, 18, [0.97, 0.98, 0.99], [0.85, 0.88, 0.92], 1);
    let xOffset = 46;
    for (const item of items) {
      this.cmds.push(`BT /F1 8.5 Tf 0.15 0.23 0.36 rg ${xOffset} ${this.y - 7} Td (${escapePDFText(item.label)}:) Tj ET`);
      const labelWidth = item.label.length * 5.2;
      this.cmds.push(`BT /F2 8.5 Tf 0.3 0.35 0.45 rg ${xOffset + labelWidth + 4} ${this.y - 7} Td (${escapePDFText(item.value)}) Tj ET`);
      xOffset += 165;
    }
    this.y -= 28;
  }

  drawSection(title, timeBadge, screenCue, speechParagraphs, keyAnswers) {
    const cardTop = this.y;

    // Header title & badge
    this.cmds.push(`BT /F1 12.5 Tf 0.12 0.11 0.29 rg 42 ${this.y - 12} Td (${escapePDFText(title)}) Tj ET`);
    // Badge
    const badgeText = `[ ${timeBadge} ]`;
    this.cmds.push(`BT /F1 9 Tf 0.27 0.22 0.79 rg 440 ${this.y - 12} Td (${escapePDFText(badgeText)}) Tj ET`);
    this.y -= 20;

    // Screen Cue Box
    const cueLines = wrapText(screenCue, 78);
    const cueBoxH = cueLines.length * 12 + 10;
    this.rect(40, this.y - cueBoxH + 4, 515, cueBoxH, [0.94, 0.99, 0.95], [0.55, 0.85, 0.6], 0.75);

    let cueY = this.y - 8;
    this.cmds.push(`BT /F1 8.5 Tf 0.08 0.4 0.18 rg 46 ${cueY} Td (SCREEN CUE: ) Tj ET`);
    this.cmds.push(`BT /F3 8.5 Tf 0.08 0.4 0.18 rg 115 ${cueY} Td (${escapePDFText(cueLines[0])}) Tj ET`);
    cueY -= 12;
    for (let i = 1; i < cueLines.length; i++) {
      this.cmds.push(`BT /F3 8.5 Tf 0.08 0.4 0.18 rg 46 ${cueY} Td (${escapePDFText(cueLines[i])}) Tj ET`);
      cueY -= 12;
    }
    this.y -= (cueBoxH + 8);

    // Speech Heading
    this.cmds.push(`BT /F1 9 Tf 0.18 0.16 0.45 rg 42 ${this.y} Td (SPEECH SCRIPT (Speak clearly for ~1 min):) Tj ET`);
    this.y -= 13;

    // Speech Paragraphs
    for (const para of speechParagraphs) {
      const lines = wrapText(para, 82);
      for (const line of lines) {
        this.cmds.push(`BT /F2 9.5 Tf 0.08 0.1 0.18 rg 44 ${this.y} Td (${escapePDFText(line)}) Tj ET`);
        this.y -= 12.5;
      }
      this.y -= 4;
    }

    // Key technical answers
    if (keyAnswers) {
      this.cmds.push(`0.5 w 0.88 0.9 0.94 RG 42 ${this.y + 2} m 550 ${this.y + 2} l S`);
      this.y -= 8;
      this.cmds.push(`BT /F1 8 Tf 0.3 0.35 0.45 rg 44 ${this.y} Td (KEY TECHNICAL HIGHLIGHTS: ) Tj ET`);
      const ansLines = wrapText(keyAnswers, 68);
      this.cmds.push(`BT /F2 8 Tf 0.3 0.35 0.45 rg 180 ${this.y} Td (${escapePDFText(ansLines[0])}) Tj ET`);
      this.y -= 10;
      for (let i = 1; i < ansLines.length; i++) {
        this.cmds.push(`BT /F2 8 Tf 0.3 0.35 0.45 rg 44 ${this.y} Td (${escapePDFText(ansLines[i])}) Tj ET`);
        this.y -= 10;
      }
    }

    // Draw outer container border
    const cardHeight = cardTop - this.y + 6;
    this.rect(38, this.y - 2, 519, cardHeight, null, [0.82, 0.85, 0.9], 0.75);
    this.y -= 16;
  }

  finish() {
    // Footer page number
    this.cmds.push(`BT /F2 8.5 Tf 0.5 0.55 0.65 rg 240 24 Td (Page ${this.pageNumber} of ${this.totalPages} | QuickCart Loom Presentation Guide) Tj ET`);
    return this.cmds;
  }
}

// ==========================================
// PAGE 1: Intro & Part A
// ==========================================
const page1 = new PageWriter(1, 4);
page1.drawHeader("QuickCart — Loom 1-Minute-Per-Part Speech Guide", "Complete Screen Recording Script & Walkthrough (100 Marks)");
page1.drawMetaBar([
  { label: "Target Duration", value: "6 to 7 Minutes" },
  { label: "Format", value: "1 Minute per Part (A to F)" },
  { label: "Language", value: "Modern ES6+ Vanilla JS" }
]);

page1.drawSection(
  "🎙️ Section 0: Introduction & Overview",
  "0:00 - 0:45 (45s)",
  "Show repository tree in VS Code or open index.html master portal in your browser.",
  [
    `"Hello everyone! My name is Venkat, and today I am excited to present my solution for the QuickCart Advanced JavaScript Practical Assignment.`,
    `QuickCart is a real-world e-commerce order management system that faced architectural challenges across object inheritance, array calculations, JSON parsing, asynchronous order execution, and DOM performance bottlenecks.`,
    `I have resolved all 6 parts—from Part A through Part F—using pure, modern JavaScript (ES6+) with zero external libraries. Every part executes flawlessly in Node.js and is fully configured for deployment on Vercel. Let's begin with Part A!"`
  ],
  "Self-introduction, QuickCart scenario, ES6+ pure JavaScript, 100/100 marks structure."
);

page1.drawSection(
  "📦 Section 1: Part A — Objects, Prototypes & ES6 Classes",
  "0:45 - 1:45 (1 min)",
  "Open part-a-objects-classes/products.js in editor and run 'node part-a-objects-classes/products.js'.",
  [
    `"In Part A, we solve duplicated method allocations and inconsistent object structures.`,
    `In Task 1, I created the Product constructor and attached displayProduct() to Product.prototype. This is critical for memory efficiency: prototype methods share a single function reference across all instances via the __proto__ chain, rather than duplicating the function closure in memory on every new instance. If a property is not on the object, JavaScript ascends the prototype chain until null.`,
    `In Task 2, I migrated to ES6 classes, extending ProductClass into ElectronicProduct and ClothingProduct. I used super() in derived constructors because derived classes cannot access 'this' before super() executes—doing so throws a ReferenceError due to the Temporal Dead Zone.`,
    `In Task 3, I implemented modern checkout syntax: an arrow function for discount calculations, a template literal for confirmation, object destructuring for customer details, the rest operator for dynamic pricing totals, and the spread operator to create immutable copies without mutating original objects."`
  ],
  "Prototype memory sharing vs constructor closure; __proto__ vs prototype; super() initializing 'this'; immutability via spread."
);

pdf.addPage(page1.finish());

// ==========================================
// PAGE 2: Part B & Part C
// ==========================================
const page2 = new PageWriter(2, 4);
page2.drawHeader("QuickCart — Loom 1-Minute-Per-Part Speech Guide", "Complete Screen Recording Script & Walkthrough (100 Marks)");

page2.drawSection(
  "🛒 Section 2: Part B — Higher-Order Functions, Map, Set & Object Methods",
  "1:45 - 2:45 (1 min)",
  "Open part-b-array-methods/shopping-cart.js and run 'node part-b-array-methods/shopping-cart.js'.",
  [
    `"In Part B, we manage a customer's shopping cart using declarative higher-order functions.`,
    `In Task 1, I used map() to calculate total item prices (price * qty), filter() to select products with unit price over ₹2,000, and reduce() to accumulate the grand cart value of ₹70,100. Unlike forEach(), which executes side-effects and returns undefined, map() returns a new transformed array, and filter() is completely non-mutating. I also chained filter and reduce to compute the Electronics total of ₹62,000.`,
    `In Task 2, I implemented an inventory tracker using a JavaScript Map. Maps are superior to plain objects because keys can be of any type, insertion order is guaranteed, and it provides an instant .size property. To remove duplicate customer emails, I used a Set, which deduplicates values automatically in O(N) linear time.`,
    `In Task 3, I tested Object.freeze() versus Object.seal(). While seal() permits modifying existing writable properties like price, freeze() makes the object completely immutable and read-only, preventing modifications, additions, and deletions."`
  ],
  "map() vs forEach(); pure non-mutating filter(); Map vs plain Object; Object.freeze() vs Object.seal()."
);

page2.drawSection(
  "🔍 Section 3: Part C — JSON Handling & Output-Based Debugging",
  "2:45 - 3:45 (1 min)",
  "Open part-c-json-debugging/json-handling.js and run 'node part-c-json-debugging/json-handling.js'.",
  [
    `"In Part C, we handle API data interchange and debug subtle JSON conversion edge cases.`,
    `In Task 1, I serialized an order object containing undefined, null, and a tax calculation function. During JSON.stringify(), the deliveryDate property (undefined) and the calculateTax function are completely omitted. This happens because JSON is a language-agnostic data format that intentionally excludes runtime JavaScript concepts like undefined and closures. However, discount: null is safely preserved because null is an official JSON primitive.`,
    `In Task 2, I verified all 6 output prediction challenges: In objects, undefined is omitted, but in arrays, it converts to null to maintain index alignments. NaN and Infinity convert to null because JSON only supports finite IEEE 754 numbers. Single-quoted JSON strings throw a SyntaxError because JSON requires double quotes. Circular references throw a TypeError to avoid infinite serialization loops. And Date objects serialize to ISO 8601 strings via their built-in toJSON() method."`
  ],
  "Why undefined/functions drop in JSON; array preservation via null; NaN/Infinity handling; circular reference TypeError."
);

pdf.addPage(page2.finish());

// ==========================================
// PAGE 3: Part D & Part E
// ==========================================
const page3 = new PageWriter(3, 4);
page3.drawHeader("QuickCart — Loom 1-Minute-Per-Part Speech Guide", "Complete Screen Recording Script & Walkthrough (100 Marks)");

page3.drawSection(
  "⚡ Section 4: Part D — Asynchronous JavaScript & Promises",
  "3:45 - 4:45 (1 min)",
  "Open part-d-asynchronous/order-processing.js and run 'node part-d-asynchronous/order-processing.js'.",
  [
    `"In Part D, we examine JavaScript's single-threaded asynchronous execution architecture.`,
    `In Task 1, we trace the Event Loop. Synchronous code on the Call Stack runs first: 'Order Started' and 'Order Completed'. Then the Event Loop drains the Microtask Queue—which is why Promise.then fires next with 'Payment Successful'—before finally picking the setTimeout callback from the Macrotask Queue for 'Payment Processing'.`,
    `In Tasks 2, 3, and 4, I demonstrated the asynchronous evolution: starting with nested sequential callbacks, showing how callback hell leads to deep nesting and fragile error propagation; then refactoring to a clean Promise chain with .then() and .catch(); and ultimately implementing an async/await placeOrder() workflow with try/catch handling both success and simulated payment gateway timeouts.`,
    `In Task 5, I demonstrated all 4 Promise combinators: Promise.all fast-fails when the payment service rejects; Promise.allSettled waits for all 3 outcomes; Promise.race settles with the earliest response at 1000ms; and Promise.any returns the first fulfilled success."`
  ],
  "Microtask queue priority over macrotasks; callback hell pitfalls; Promise chaining; all vs allSettled vs race vs any."
);

page3.drawSection(
  "🎨 Section 5: Part E — Performance Optimization & DOM Events",
  "4:45 - 5:45 (1 min)",
  "Open part-e-optimization-events/index.html live in browser. Type in search, scroll box, click calculate & remove.",
  [
    `"Now let's switch to the browser to demonstrate Part E's live DOM performance playground.`,
    `In Task 1 (Debouncing): Notice as I type rapidly in this search field, the raw keystrokes count increments on every letter, but the actual search API only fires after I pause typing for 500 ms. This protects backend servers from excessive keystroke requests.`,
    `In Task 2 (Throttling): In this scroll viewport, scrolling triggers dozens of events, but the throttle wrapper regulates execution to fire at most once every 1,000 ms, ensuring silky-smooth UI performance.`,
    `In Task 3 (Memoization): When I calculate a 10% discount on ₹50,000, it computes fresh. When I click calculate again with identical inputs, it returns instantly from the lexical closure cache with this orange badge!`,
    `In Task 4 (Bubbling & Delegation): I attached a single click listener to the parent container. Clicking Remove bubbles up to the parent, finds the target via event.target.closest(), and removes the item. If I enable stopPropagation, bubbling to the parent is stopped. And clicking 'Add Product' dynamically proves that new items are handled automatically without binding new event listeners!"`
  ],
  "Debounce vs throttle use-cases; closure cache encapsulation; bubbling phase; event.target vs currentTarget; delegation memory savings."
);

pdf.addPage(page3.finish());

// ==========================================
// PAGE 4: Part F & Closing Checklist
// ==========================================
const page4 = new PageWriter(4, 4);
page4.drawHeader("QuickCart — Loom 1-Minute-Per-Part Speech Guide", "Complete Screen Recording Script & Walkthrough (100 Marks)");

page4.drawSection(
  "🏆 Section 6: Part F — Final Integration Challenge & Summary",
  "5:45 - 6:45 (1 min)",
  "Run 'node part-f-integration/quickcart.js' or show the master Vercel portal index.html in the browser.",
  [
    `"Finally, Part F brings every single concept together into an end-to-end real-time order confirmation pipeline.`,
    `In quickcart.js, we take customer Rahul's order. We model items with a Product class, extract properties using destructuring, calculate item totals using map(), filter high-value products over ₹5,000, compute the grand order total with reduce(), store unique product IDs in a Set, track stock in a Map, enforce immutability with Object.freeze(), and simulate asynchronous verification via async/await with try/catch.`,
    `As you can see in the terminal output, the values are completely computed—not hardcoded: Total Order Amount of ₹69,000, 4 Unique Products, and the status transitions seamlessly from 'Processing...' to 'Confirmed Successfully!'.`,
    `The complete project is committed and pushed to GitHub at Venkat5674/quickcart_irp_task_3, accompanied by a comprehensive README and vercel.json for instant edge deployment. Thank you so much for your time and evaluation!"`
  ],
  "Computed ₹69,000 total; Set unique count 4; async status confirmation; GitHub & Vercel deployment readiness."
);

page4.drawSection(
  "🎯 Speaker Checklist & Loom Recording Tips",
  "Pre-Recording Checklist",
  "Keep terminal clear and font size set to 14-16px for crisp 1080p video recording.",
  [
    `1. Screen Layout: Split screen 50/50 with VS Code/Terminal on the left and Chrome/Edge on the right.`,
    `2. Terminal Commands: Have 'node part-a-objects-classes/products.js', 'part-b', 'part-c', 'part-d', and 'part-f' queued in terminal history so you can press Up-Arrow + Enter seamlessly.`,
    `3. Pacing: Speak at a steady conversational pace (~120 words per minute). Don't rush; pause for 2 seconds after each terminal command so the reviewer can read the clean output.`,
    `4. Live Link & Submission: Mention that the live Vercel portal and public GitHub repository links are included in the submission.`
  ],
  "Loom video tip: Keep face bubble in bottom-left corner to avoid obscuring code or browser UI."
);

pdf.addPage(page4.finish());

// Write the PDF
const pdfBytes = pdf.build();
fs.writeFileSync('QuickCart_Loom_Presentation_Speech.pdf', pdfBytes);
console.log(`Successfully generated QuickCart_Loom_Presentation_Speech.pdf (${pdfBytes.length} bytes)`);
