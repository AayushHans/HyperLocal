// NLP Processor for order text clarification and translation

// Hindi to English dictionary for common items
const hindiToEnglish = {
  // Vegetables
  आलू: "potatoes",
  टमाटर: "tomatoes",
  प्याज: "onions",
  मिर्च: "chili peppers",
  "हरी मिर्च": "green chilies",
  "लाल मिर्च": "red chilies",
  गोभी: "cauliflower",
  "फूल गोभी": "cauliflower",
  "पत्ता गोभी": "cabbage",
  पालक: "spinach",
  भिंडी: "okra",
  बैंगन: "eggplant",
  गाजर: "carrots",
  मटर: "peas",
  "शिमला मिर्च": "capsicum",
  खीरा: "cucumber",
  मूली: "radish",
  लौकी: "bottle gourd",
  तोरी: "ridge gourd",
  कद्दू: "pumpkin",
  आलु: "potatoes",
  टमाटर: "tomatoes",

  // Fruits
  सेब: "apples",
  केला: "bananas",
  संतरा: "oranges",
  अंगूर: "grapes",
  आम: "mangoes",
  पपीता: "papaya",
  तरबूज: "watermelon",
  खरबूजा: "muskmelon",
  अनार: "pomegranate",
  नाशपाती: "pear",
  अमरूद: "guava",
  नींबू: "lemon",
  निम्बू: "lemon",

  // Grains & Staples
  चावल: "rice",
  आटा: "wheat flour",
  "गेहूं का आटा": "wheat flour",
  मैदा: "all-purpose flour",
  दाल: "lentils",
  "मूंग दाल": "moong dal",
  "तूर दाल": "toor dal",
  "चना दाल": "chana dal",
  "उड़द दाल": "urad dal",
  "मसूर दाल": "masoor dal",
  चीनी: "sugar",
  नमक: "salt",
  तेल: "oil",
  घी: "ghee",
  "सरसों का तेल": "mustard oil",
  "सूरजमुखी तेल": "sunflower oil",

  // Dairy
  दूध: "milk",
  दही: "yogurt",
  पनीर: "cottage cheese",
  मक्खन: "butter",
  मलाई: "cream",

  // Spices
  हल्दी: "turmeric",
  धनिया: "coriander",
  जीरा: "cumin",
  "गरम मसाला": "garam masala",
  "लाल मिर्च पाउडर": "red chili powder",

  // Medicines
  दवा: "medicine",
  दवाई: "medicine",
  गोली: "tablet",
  सिरप: "syrup",
  "दर्द की दवा": "pain medicine",
  बुखार: "fever",
  "सर दर्द": "headache",
  "पेट दर्द": "stomach ache",

  // Quantities
  किलो: "kg",
  ग्राम: "grams",
  लीटर: "liters",
  पैकेट: "packet",
  डिब्बा: "box",
  बोतल: "bottle",
  थैला: "bag",

  // Common words
  और: "and",
  का: "of",
  के: "of",
  की: "of",
  चाहिए: "",
  लाना: "",
  है: "",
  में: "in",
  से: "from",
  को: "to",
  एक: "1",
  दो: "2",
  तीन: "3",
  चार: "4",
  पांच: "5",
  छह: "6",
  सात: "7",
  आठ: "8",
  नौ: "9",
  दस: "10",
};

// Romanized Hindi (Hinglish) to English dictionary
const hinglishToEnglish = {
  // Vegetables
  aloo: "potatoes",
  aaloo: "potatoes",
  alu: "potatoes",
  tamatar: "tomatoes",
  tamaatar: "tomatoes",
  pyaaz: "onions",
  pyaj: "onions",
  mirch: "chili peppers",
  "hari mirch": "green chilies",
  "lal mirch": "red chilies",
  gobi: "cauliflower",
  gobhi: "cauliflower",
  "phool gobi": "cauliflower",
  "patta gobi": "cabbage",
  palak: "spinach",
  bhindi: "okra",
  baingan: "eggplant",
  baigan: "eggplant",
  gajar: "carrots",
  gaajar: "carrots",
  matar: "peas",
  mutter: "peas",
  "shimla mirch": "capsicum",
  kheera: "cucumber",
  khira: "cucumber",
  mooli: "radish",
  muli: "radish",
  lauki: "bottle gourd",
  tori: "ridge gourd",
  kaddu: "pumpkin",

  // Fruits
  seb: "apples",
  kela: "bananas",
  kelaa: "bananas",
  santra: "oranges",
  santara: "oranges",
  angoor: "grapes",
  angur: "grapes",
  aam: "mangoes",
  papita: "papaya",
  papaya: "papaya",
  tarbooj: "watermelon",
  tarbuj: "watermelon",
  kharbooja: "muskmelon",
  kharbuja: "muskmelon",
  anaar: "pomegranate",
  anar: "pomegranate",
  nashpati: "pear",
  amrood: "guava",
  amrud: "guava",
  nimbu: "lemon",
  neembu: "lemon",

  // Grains & Staples
  chawal: "rice",
  chaawal: "rice",
  aata: "wheat flour",
  atta: "wheat flour",
  "gehun ka aata": "wheat flour",
  "gehu ka atta": "wheat flour",
  maida: "all-purpose flour",
  daal: "lentils",
  dal: "lentils",
  "moong dal": "moong dal",
  "mung dal": "moong dal",
  "toor dal": "toor dal",
  "tur dal": "toor dal",
  "chana dal": "chana dal",
  "urad dal": "urad dal",
  "masoor dal": "masoor dal",
  cheeni: "sugar",
  chini: "sugar",
  namak: "salt",
  tel: "oil",
  tail: "oil",
  ghee: "ghee",
  ghi: "ghee",

  // Dairy
  doodh: "milk",
  dudh: "milk",
  dahi: "yogurt",
  dahee: "yogurt",
  paneer: "cottage cheese",
  panir: "cottage cheese",
  makhan: "butter",
  makkhan: "butter",
  malai: "cream",

  // Spices
  haldi: "turmeric",
  dhania: "coriander",
  dhaniya: "coriander",
  jeera: "cumin",
  jira: "cumin",
  "garam masala": "garam masala",

  // Medicines
  dawa: "medicine",
  dawai: "medicine",
  davai: "medicine",
  goli: "tablet",
  golee: "tablet",
  syrup: "syrup",
  sirup: "syrup",
  bukhar: "fever",
  bukhaar: "fever",

  // Quantities
  kilo: "kg",
  kilogram: "kg",
  gram: "grams",
  liter: "liters",
  litre: "liters",
  packet: "packet",
  paket: "packet",
  dibba: "box",
  bottle: "bottle",
  botal: "bottle",
  thaila: "bag",
  thela: "bag",

  // Numbers
  ek: "1",
  do: "2",
  teen: "3",
  tin: "3",
  char: "4",
  chaar: "4",
  paanch: "5",
  panch: "5",
  chhe: "6",
  che: "6",
  saat: "7",
  sat: "7",
  aath: "8",
  ath: "8",
  nau: "9",
  no: "9",
  das: "10",
  dus: "10",

  // Common words
  aur: "and",
  or: "and",
  ka: "",
  ke: "",
  ki: "",
  chahiye: "",
  chahie: "",
  chaiye: "",
  lana: "",
  laana: "",
  hai: "",
  he: "",
  mein: "",
  me: "",
  se: "",
  ko: "",
};

// Detect if text contains Hindi/Devanagari characters or Romanized Hindi
function detectLanguage(text) {
  const hindiPattern = /[\u0900-\u097F]/;
  const hasHindi = hindiPattern.test(text);

  // Check percentage of Hindi characters
  const hindiChars = (text.match(/[\u0900-\u097F]/g) || []).length;
  const totalChars = text.replace(/\s/g, "").length;
  const hindiPercentage = totalChars > 0 ? hindiChars / totalChars : 0;

  if (hindiPercentage > 0.3) {
    return { language: "Hindi", confidence: 0.9 };
  } else if (hasHindi) {
    return { language: "Hinglish", confidence: 0.7 };
  }

  // Check for Romanized Hindi words
  const lowerText = text.toLowerCase();
  const hinglishWords = Object.keys(hinglishToEnglish);
  let hinglishMatches = 0;

  hinglishWords.forEach((word) => {
    if (lowerText.includes(word)) {
      hinglishMatches++;
    }
  });

  if (hinglishMatches >= 2) {
    return { language: "Hinglish", confidence: 0.8 };
  } else if (hinglishMatches === 1) {
    return { language: "Hinglish", confidence: 0.6 };
  }

  return { language: "English", confidence: 0.95 };
}

// Translate Hindi text to English (both Devanagari and Romanized)
function translateHindiToEnglish(text) {
  let translatedText = text;

  // First, handle Devanagari script
  const sortedHindiKeys = Object.keys(hindiToEnglish).sort(
    (a, b) => b.length - a.length
  );

  sortedHindiKeys.forEach((hindi) => {
    const regex = new RegExp(hindi, "g");
    translatedText = translatedText.replace(regex, hindiToEnglish[hindi]);
  });

  // Then, handle Romanized Hindi (case-insensitive)
  const sortedHinglishKeys = Object.keys(hinglishToEnglish).sort(
    (a, b) => b.length - a.length
  );

  sortedHinglishKeys.forEach((hinglish) => {
    const regex = new RegExp(`\\b${hinglish}\\b`, "gi");
    translatedText = translatedText.replace(regex, hinglishToEnglish[hinglish]);
  });

  return translatedText;
}

// Format and structure the order text
function formatOrderText(text, category) {
  // Split by common separators
  let items = text
    .split(/[,\n।]+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  // Format each item
  items = items.map((item) => {
    // Remove extra spaces
    item = item.replace(/\s+/g, " ").trim();

    // Capitalize first letter
    if (item.length > 0) {
      item = item.charAt(0).toUpperCase() + item.slice(1);
    }

    // Extract quantity if present
    const quantityMatch = item.match(/(\d+\.?\d*)\s*(kg|grams|liters|l|g)/i);
    if (quantityMatch) {
      const quantity = quantityMatch[1];
      const unit = quantityMatch[2].toLowerCase();
      const itemName = item.replace(quantityMatch[0], "").trim();

      // Standardize units
      let standardUnit = unit;
      if (unit === "g") standardUnit = "grams";
      if (unit === "l") standardUnit = "liters";

      return `${itemName} - ${quantity} ${standardUnit}`;
    }

    return item;
  });

  // Remove duplicates
  items = [...new Set(items)];

  // Join items with proper formatting
  return items.join("\n");
}

// Main NLP processing function
function processOrderText(text, category = "groceries") {
  if (!text || text.trim().length < 5) {
    return {
      clarifiedText: text,
      language: "Unknown",
      confidence: 0,
      needsClarification: false,
    };
  }

  // Detect language
  const languageInfo = detectLanguage(text);

  let clarifiedText = text;
  let needsClarification = false;

  // Translate if Hindi is detected
  if (
    languageInfo.language === "Hindi" ||
    languageInfo.language === "Hinglish"
  ) {
    clarifiedText = translateHindiToEnglish(text);
    needsClarification = true;
  }

  // Format the text
  clarifiedText = formatOrderText(clarifiedText, category);

  // Clean up extra spaces and empty lines
  clarifiedText = clarifiedText
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .join("\n");

  // Check if clarification is needed
  if (clarifiedText.toLowerCase() === text.toLowerCase()) {
    needsClarification = false;
  }

  return {
    clarifiedText,
    language: languageInfo.language,
    confidence: languageInfo.confidence,
    needsClarification,
  };
}

module.exports = {
  processOrderText,
  detectLanguage,
  translateHindiToEnglish,
  formatOrderText,
};
