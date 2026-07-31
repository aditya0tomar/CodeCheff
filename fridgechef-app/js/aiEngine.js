// Groq API & Recipe Generation Engine for FridgeChef

// Default Groq API Key placeholder - users can update in UI or paste in code
export let GROQ_API_KEY = "";

export function setGroqApiKey(key) {
  GROQ_API_KEY = key.trim();
  localStorage.setItem('fridgechef_groq_key', GROQ_API_KEY);
}

export function getStoredApiKey() {
  return localStorage.getItem('fridgechef_groq_key') || GROQ_API_KEY || '';
}

/**
 * Generates 3-4 authentic, practical Indian hostel/home recipes based on selected ingredients & hostel constraints.
 */
export async function generateRecipes({ selectedItems, customText, hostelMode, apiKey }) {
  const effectiveKey = apiKey || getStoredApiKey();

  const allIngredientsStr = [...selectedItems, customText].filter(Boolean).join(', ');

  if (!allIngredientsStr.trim()) {
    throw new Error('Please select or type at least 1 ingredient!');
  }

  // Construct prompt
  const systemPrompt = `You are "FridgeChef", an expert Indian hostel food & jugaad culinary master. 
Your job is to generate 3 to 4 realistic, appetizing, and quick Indian recipes that can be made using ONLY (or mostly) the user's available ingredients and equipment limits.
Always prioritize Indian home/hostel food style (e.g. Masala Maggi, Aloo Poha, Jeera Rice, Tadka Dahi Toast, Anda Ghotala, Mug Cake, Kettle Pasta, Besan Chilla, etc.).

CRITICAL INSTRUCTIONS:
1. Return ONLY valid, raw JSON array of objects. Do NOT include markdown code fences (\`\`\`json). Just pure JSON text.
2. The JSON array must contain 3 to 4 recipe objects. Each object MUST have this schema:
{
  "id": "unique-id-slug",
  "title": "Dish Name in Hinglish/English (e.g. Hostel Kettle Masala Pasta)",
  "tagline": "Catchy 1-line student pitch",
  "prepTime": "10 mins",
  "cookTime": "15 mins",
  "complexity": "O(1) Easy" | "O(N) Moderate" | "O(N^2) Masterchef",
  "equipmentNeeded": "Electric Kettle / Microwave / Single Pan",
  "ingredientsUsed": ["Item 1", "Item 2"],
  "jugaadSwaps": [
    { "missing": "Butter", "swap": "Use oil or malai for crispness" }
  ],
  "steps": [
    {
      "stepNum": 1,
      "text": "Detailed action step description...",
      "timerMinutes": 3
    }
  ],
  "hostelTip": "A secret student hack or flavor tip for this dish"
}`;

  const userPrompt = `Available Ingredients: ${allIngredientsStr}
Hostel Equipment Limit: ${hostelMode || 'Gas / Any'}

Please generate 3 to 4 Indian dish recipes tailored for a hungry student with these exact ingredients and constraints. Ensure step timerMinutes is integer or 0.`;

  // If no Groq API Key is supplied, use our intelligent Fallback Generator
  if (!effectiveKey) {
    console.log('No Groq API Key provided. Using intelligent offline recipe engine fallback.');
    await new Promise(r => setTimeout(r, 1200)); // realistic network delay feel
    return generateOfflineRecipes(selectedItems, customText, hostelMode);
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${effectiveKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2500
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.warn('Groq API Error, falling back to smart offline generator:', errData);
      return generateOfflineRecipes(selectedItems, customText, hostelMode);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || '';

    // Clean JSON text
    let cleanJson = rawContent.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    try {
      const parsed = JSON.parse(cleanJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.warn('JSON parse error from LLM response, attempting extract:', e);
      const jsonMatch = cleanJson.match(/\[\s*\{.*\}\s*\]/s);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }

    return generateOfflineRecipes(selectedItems, customText, hostelMode);
  } catch (err) {
    console.error('Groq fetch exception:', err);
    return generateOfflineRecipes(selectedItems, customText, hostelMode);
  }
}

/**
 * High quality offline Indian student recipe generator fallback
 */
function generateOfflineRecipes(items, customText, hostelMode) {
  const itemStr = [...items, customText].join(' ').toLowerCase();

  const recipes = [];

  // Recipe 1: Maggi / Noodle hack or Bread snack
  if (itemStr.includes('maggi') || itemStr.includes('noodles') || itemStr.includes('bread') || itemStr.includes('poha')) {
    recipes.push({
      id: 'hostel-masala-tasty-fry',
      title: itemStr.includes('maggi') ? 'Midnight Cheese-Masala Maggi Hack' : 'Crispy Masala Toast Tadka',
      tagline: 'The ultimate 10-minute dorm craving slayer.',
      prepTime: '5 mins',
      cookTime: '8 mins',
      complexity: 'O(1) Super Easy',
      equipmentNeeded: hostelMode === 'kettle' ? 'Electric Kettle' : 'Single Pan / Induction',
      ingredientsUsed: items.slice(0, 4).concat(customText ? [customText] : []),
      jugaadSwaps: [
        { missing: 'Butter', swap: 'Use 1/2 tsp oil or malai from milk' },
        { missing: 'Cheese', swap: 'Pinch of Chat Masala + extra Maggi Masala' }
      ],
      steps: [
        { stepNum: 1, text: 'Finely chop pyaaz, tamatar, and green chilies if available.', timerMinutes: 2 },
        { stepNum: 2, text: 'Heat oil/butter in your pan or kettle. Toss in jeera and chopped veggies.', timerMinutes: 3 },
        { stepNum: 3, text: 'Add haldi, red chili powder, and seasoning. Stir nicely until fragrant.', timerMinutes: 2 },
        { stepNum: 4, text: 'Add 1.5 cups water, boil, toss in main staple, cook covered until thick & flavorful!', timerMinutes: 3 }
      ],
      hostelTip: 'Crush 1 papad or chips on top for an insane extra crunch!'
    });
  }

  // Recipe 2: Aloo / Pyaaz / Dahi / Egg / Rice dishes
  if (itemStr.includes('aloo') || itemStr.includes('pyaaz') || itemStr.includes('anda') || itemStr.includes('egg') || itemStr.includes('dahi') || itemStr.includes('rice') || itemStr.includes('chawal')) {
    recipes.push({
      id: 'desi-tadka-jugaad-fry',
      title: itemStr.includes('anda') || itemStr.includes('egg') ? 'Hostel Style Anda Ghotala' : 'Dahi-Aloo Chatpata Tadka Fry',
      tagline: 'Zero effort, 100% dhaba flavor with limited items.',
      prepTime: '5 mins',
      cookTime: '10 mins',
      complexity: 'O(1) Easy',
      equipmentNeeded: 'Single Pan / Induction',
      ingredientsUsed: items.slice(0, 5),
      jugaadSwaps: [
        { missing: 'Amchur', swap: 'Squeeze 5 drops of fresh lemon juice at the end' },
        { missing: 'Dahi', swap: 'Use milk with 2 drops of lemon to sour it up' }
      ],
      steps: [
        { stepNum: 1, text: 'Dice potatoes/onions into tiny uniform cubes for fast cooking.', timerMinutes: 3 },
        { stepNum: 2, text: 'Sauté in oil with rai, jeera, haldi, and green chili until gold & crispy.', timerMinutes: 5 },
        { stepNum: 3, text: 'Beat dahi or eggs with salt and garamasala, pour over, cook on low flame.', timerMinutes: 3 },
        { stepNum: 4, text: 'Garnish with coriander or extra maggi masala and serve hot!', timerMinutes: 0 }
      ],
      hostelTip: 'Eat directly from the pan to save washing a plate!'
    });
  }

  // Recipe 3: Besan / Atta / Suji / Oats / Paneer / Cheese / Bread
  recipes.push({
    id: 'quick-chilla-sandwich',
    title: itemStr.includes('besan') ? 'Instant Masala Besan Chilla' : 'Hostel Crunchy Cheese-Chili Sandwich',
    tagline: 'High protein, budget friendly student fuel.',
    prepTime: '4 mins',
    cookTime: '6 mins',
    complexity: 'O(N) Quick',
    equipmentNeeded: 'Pan / Sandwich Maker / Kettle (Steamed)',
    ingredientsUsed: items.slice(0, 4),
    jugaadSwaps: [
      { missing: 'Cheese', swap: 'Thick layer of Dahi mixed with chaat masala' }
    ],
    steps: [
      { stepNum: 1, text: 'Mix ingredients into a batter or spread between bread slices.', timerMinutes: 2 },
      { stepNum: 2, text: 'Toast generously on low heat until golden brown and crispy on both sides.', timerMinutes: 4 },
      { stepNum: 3, text: 'Serve with ketchup or green chutney!', timerMinutes: 0 }
    ],
    hostelTip: 'Wrap in aluminum foil if taking to morning lectures!'
  });

  // Recipe 4: Mug / Kettle Sweet or Savory Quick Bite
  recipes.push({
    id: 'kettle-mug-special',
    title: hostelMode === 'kettle' ? 'Hostel Kettle Mac-n-Masala' : '2-Min Microwave Mug Pizza / Cake',
    tagline: 'Single utensil zero-mess miracle dish.',
    prepTime: '2 mins',
    cookTime: '3 mins',
    complexity: 'O(1) Instant',
    equipmentNeeded: hostelMode === 'kettle' ? 'Electric Kettle' : 'Microwave / Kettle',
    ingredientsUsed: items.slice(0, 3),
    jugaadSwaps: [
      { missing: 'Oven', swap: 'Use microwave mug or electric kettle boil method' }
    ],
    steps: [
      { stepNum: 1, text: 'Combine all available dry and liquid staples directly in mug/kettle.', timerMinutes: 1 },
      { stepNum: 2, text: 'Boil or microwave for 2-3 minutes. Watch carefully so it does not spill over.', timerMinutes: 3 },
      { stepNum: 3, text: 'Top with oregano/chili flakes or ketchup and enjoy immediately.', timerMinutes: 0 }
    ],
    hostelTip: 'Use a wooden spoon to stir kettle dishes to prevent scratching.'
  });

  return recipes;
}
