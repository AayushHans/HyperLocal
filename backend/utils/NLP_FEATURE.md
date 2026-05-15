# NLP Order Processing Feature

## Overview

This feature uses Natural Language Processing to help customers create clearer orders by:

- Detecting the language (Hindi, English, or Hinglish)
- Translating Hindi text to English
- Formatting and structuring the order items
- Providing suggestions for clearer communication with delivery agents

## How It Works

### Frontend (CreateOrder.js)

1. Customer types their order in the "Items List" field
2. After 1.5 seconds of inactivity (debounce), the text is sent to the backend
3. If a clearer version is suggested, a green suggestion box appears
4. Customer can choose to "Use This" or "Keep Original"

### Backend (nlpProcessor.js)

1. **Language Detection**: Identifies if text contains Hindi/Devanagari characters
2. **Translation**: Converts Hindi words to English using a comprehensive dictionary
3. **Formatting**: Structures items into a clear list format
4. **Quantity Extraction**: Identifies and standardizes quantities (kg, grams, liters)

## Supported Languages

- **Hindi**: Full Devanagari script support (आलू, टमाटर, प्याज)
- **Romanized Hindi**: English script Hindi words (aloo, tamatar, pyaaz, ek kilo aata)
- **English**: Native support
- **Hinglish**: Mixed Hindi-English text in any combination

## Dictionary Coverage

### Vegetables (30+ items)

- **Devanagari**: आलू, टमाटर, प्याज, मिर्च, गोभी, पालक, भिंडी, बैंगन, गाजर, मटर
- **Romanized**: aloo, tamatar, pyaaz, mirch, gobi, palak, bhindi, baingan, gajar, matar

### Fruits (15+ items)

- **Devanagari**: सेब, केला, संतरा, अंगूर, आम, पपीता, तरबूज
- **Romanized**: seb, kela, santra, angoor, aam, papita, tarbooj

### Grains & Staples (20+ items)

- **Devanagari**: चावल, आटा, दाल, चीनी, नमक, तेल, घी
- **Romanized**: chawal, aata/atta, dal, cheeni, namak, tel, ghee

### Dairy Products

- **Devanagari**: दूध, दही, पनीर, मक्खन
- **Romanized**: doodh, dahi, paneer, makhan

### Medicines

- **Devanagari**: दवा, गोली, सिरप, बुखार
- **Romanized**: dawa, goli, syrup, bukhar

### Quantities & Numbers

- **Devanagari**: किलो, ग्राम, लीटर, एक, दो, तीन
- **Romanized**: kilo, gram, liter, ek, do, teen

## Example Transformations

### Example 1: Hindi to English

**Input:**

```
2 किलो आलू
1 किलो टमाटर
प्याज
हरी मिर्च
```

**Output:**

```
Potatoes - 2 kg
Tomatoes - 1 kg
Onions
Green chilies
```

### Example 2: Romanized Hindi (English Script)

**Input:**

```
Ek Kilo Aata
```

**Output:**

```
Wheat flour - 1 kg
```

### Example 3: Complex Romanized Hindi

**Input:**

```
do kilo aloo, ek kilo tamatar aur pyaaz chahiye
```

**Output:**

```
Potatoes - 2 kg
Tomatoes - 1 kg
Onions
```

### Example 4: Hinglish (Mixed Script)

**Input:**

```
आलू, टमाटर और onions चाहिए
```

**Output:**

```
Potatoes
Tomatoes
Onions
```

### Example 5: Formatting

**Input:**

```
milk 2 liters, bread, eggs, butter
```

**Output:**

```
Milk - 2 liters
Bread
Eggs
Butter
```

## API Endpoint

### POST `/api/orders/process-nlp`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "text": "2 किलो आलू और 1 किलो टमाटर",
  "category": "groceries"
}
```

**Response:**

```json
{
  "suggestion": "Potatoes - 2 kg\nTomatoes - 1 kg",
  "detectedLanguage": "Hindi",
  "confidence": 0.9
}
```

## Future Enhancements

1. **Machine Learning Integration**: Use ML models for better translation
2. **More Languages**: Add support for Tamil, Telugu, Bengali, etc.
3. **Context Awareness**: Better understanding of regional item names
4. **Spell Correction**: Auto-correct common spelling mistakes
5. **Voice Input**: Convert speech to text with NLP processing
6. **Smart Suggestions**: Suggest related items based on category

## Configuration

No additional configuration needed. The feature works out of the box with the existing authentication system.

## Performance

- **Debounce Time**: 1.5 seconds (prevents excessive API calls)
- **Processing Time**: < 100ms for typical orders
- **Dictionary Size**: 100+ common items

## Privacy

- All processing happens on your server
- No third-party API calls
- No data is stored or logged beyond standard order data
