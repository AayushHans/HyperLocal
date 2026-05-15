// Test examples for NLP processor
// Run this file to test the NLP functionality

const { processOrderText } = require("./nlpProcessor");

console.log("=== NLP Order Processing Test Examples ===\n");

// Test 1: Romanized Hindi - "Ek Kilo Aata"
console.log("Test 1: Romanized Hindi");
console.log('Input: "Ek Kilo Aata"');
const result1 = processOrderText("Ek Kilo Aata", "groceries");
console.log("Output:", result1.clarifiedText);
console.log("Language:", result1.language);
console.log("Needs Clarification:", result1.needsClarification);
console.log("---\n");

// Test 2: Complex Romanized Hindi
console.log("Test 2: Complex Romanized Hindi");
console.log('Input: "do kilo aloo, ek kilo tamatar aur pyaaz chahiye"');
const result2 = processOrderText(
  "do kilo aloo, ek kilo tamatar aur pyaaz chahiye",
  "groceries"
);
console.log("Output:", result2.clarifiedText);
console.log("Language:", result2.language);
console.log("---\n");

// Test 3: Devanagari Hindi
console.log("Test 3: Devanagari Hindi");
console.log('Input: "2 किलो आलू, 1 किलो टमाटर"');
const result3 = processOrderText("2 किलो आलू, 1 किलो टमाटर", "groceries");
console.log("Output:", result3.clarifiedText);
console.log("Language:", result3.language);
console.log("---\n");

// Test 4: Mixed Hinglish
console.log("Test 4: Mixed Hinglish");
console.log('Input: "aloo, tamatar and onions"');
const result4 = processOrderText("aloo, tamatar and onions", "groceries");
console.log("Output:", result4.clarifiedText);
console.log("Language:", result4.language);
console.log("---\n");

// Test 5: English (no translation needed)
console.log("Test 5: English");
console.log('Input: "2 kg potatoes, 1 kg tomatoes"');
const result5 = processOrderText("2 kg potatoes, 1 kg tomatoes", "groceries");
console.log("Output:", result5.clarifiedText);
console.log("Language:", result5.language);
console.log("Needs Clarification:", result5.needsClarification);
console.log("---\n");

// Test 6: More Romanized examples
console.log("Test 6: More Romanized Hindi");
console.log('Input: "teen kilo chawal, do liter doodh, ek packet namak"');
const result6 = processOrderText(
  "teen kilo chawal, do liter doodh, ek packet namak",
  "groceries"
);
console.log("Output:", result6.clarifiedText);
console.log("Language:", result6.language);
console.log("---\n");

// Test 7: Medicines in Romanized Hindi
console.log("Test 7: Medicines in Romanized Hindi");
console.log('Input: "bukhar ki dawa, ek syrup aur paracetamol"');
const result7 = processOrderText(
  "bukhar ki dawa, ek syrup aur paracetamol",
  "medicines"
);
console.log("Output:", result7.clarifiedText);
console.log("Language:", result7.language);
console.log("---\n");

console.log("=== All Tests Complete ===");
