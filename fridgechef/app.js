/* ==========================================================================
   CodeChef - AI Recipe Finder for Hostellers & Students
   Powered by Groq Llama 3.1 8B Instant API & Dynamic Jugaad Engine
   ========================================================================== */

// Default Groq API Key (enter in settings modal or browser storage)
const DEFAULT_GROQ_KEY = '';

// --- 100+ INGREDIENTS DATASET ---
const INGREDIENTS_DATA = [
  // Veggies & Herbs
  { id: 'v1', name: 'Aloo (Potato)', category: 'veggies', emoji: '🥔' },
  { id: 'v2', name: 'Pyaaz (Onion)', category: 'veggies', emoji: '🧅' },
  { id: 'v3', name: 'Tamatar (Tomato)', category: 'veggies', emoji: '🍅' },
  { id: 'v4', name: 'Adrak (Ginger)', category: 'veggies', emoji: '🫚' },
  { id: 'v5', name: 'Lahsun (Garlic)', category: 'veggies', emoji: '🧄' },
  { id: 'v6', name: 'Hari Mirch (Green Chili)', category: 'veggies', emoji: '🌶️' },
  { id: 'v7', name: 'Palak (Spinach)', category: 'veggies', emoji: '🥬' },
  { id: 'v8', name: 'Matar (Green Peas)', category: 'veggies', emoji: '🫛' },
  { id: 'v9', name: 'Paneer (Cottage Cheese)', category: 'veggies', emoji: '🧀' },
  { id: 'v10', name: 'Shimla Mirch (Capsicum)', category: 'veggies', emoji: '🫑' },
  { id: 'v11', name: 'Gobi (Cauliflower)', category: 'veggies', emoji: '🥦' },
  { id: 'v12', name: 'Bhindi (Okra)', category: 'veggies', emoji: '🫛' },
  { id: 'v13', name: 'Lemon / Nimbu', category: 'veggies', emoji: '🍋' },
  { id: 'v14', name: 'Dhaniya / Coriander', category: 'veggies', emoji: '🌿' },
  { id: 'v15', name: 'Kadi Patta (Curry Leaves)', category: 'veggies', emoji: '🍃' },
  { id: 'v16', name: 'Gajar (Carrot)', category: 'veggies', emoji: '🥕' },
  { id: 'v17', name: 'Mooli (Radish)', category: 'veggies', emoji: '🥗' },
  { id: 'v18', name: 'Cucumber / Kheera', category: 'veggies', emoji: '🥒' },
  { id: 'v19', name: 'Mushrooms', category: 'veggies', emoji: '🍄' },
  { id: 'v20', name: 'Sweet Corn', category: 'veggies', emoji: '🌽' },

  // Masale & Sauces
  { id: 'm1', name: 'Maggi Masala', category: 'masale', emoji: '✨' },
  { id: 'm2', name: 'Haldi (Turmeric)', category: 'masale', emoji: '🟡' },
  { id: 'm3', name: 'Lal Mirch (Red Chili)', category: 'masale', emoji: '🌶️' },
  { id: 'm4', name: 'Dhaniya Powder', category: 'masale', emoji: '🤎' },
  { id: 'm5', name: 'Jeera (Cumin)', category: 'masale', emoji: '🌾' },
  { id: 'm6', name: 'Garam Masala', category: 'masale', emoji: '🪵' },
  { id: 'm7', name: 'Chaat Masala', category: 'masale', emoji: '🧂' },
  { id: 'm8', name: 'Kasuri Methi', category: 'masale', emoji: '🍃' },
  { id: 'm9', name: 'Hing (Asafoetida)', category: 'masale', emoji: '🫙' },
  { id: 'm10', name: 'Rai (Mustard Seeds)', category: 'masale', emoji: '⚫' },
  { id: 'm11', name: 'Soya Sauce', category: 'masale', emoji: '🍾' },
  { id: 'm12', name: 'Vinegar', category: 'masale', emoji: '🧪' },
  { id: 'm13', name: 'Schezwan Sauce', category: 'masale', emoji: '🔥' },
  { id: 'm14', name: 'Tomato Ketchup', category: 'masale', emoji: '🥫' },
  { id: 'm15', name: 'Chili Sauce', category: 'masale', emoji: '🌶️' },
  { id: 'm16', name: 'Mayonnaise', category: 'masale', emoji: '🥄' },
  { id: 'm17', name: 'Chili Flakes', category: 'masale', emoji: '🌶️' },
  { id: 'm18', name: 'Oregano', category: 'masale', emoji: '🌿' },
  { id: 'm19', name: 'Black Pepper (Kali Mirch)', category: 'masale', emoji: '🧂' },

  // Staples & Grains
  { id: 's1', name: 'Maggi / Instant Noodles', category: 'staples', emoji: '🍜' },
  { id: 's2', name: 'Bread Slices', category: 'staples', emoji: '🍞' },
  { id: 's3', name: 'Poha (Flattened Rice)', category: 'staples', emoji: '🥣' },
  { id: 's4', name: 'Chawal (Rice)', category: 'staples', emoji: '🍚' },
  { id: 's5', name: 'Atta (Wheat Flour)', category: 'staples', emoji: '🌾' },
  { id: 's6', name: 'Suji / Rava', category: 'staples', emoji: '🥣' },
  { id: 's7', name: 'Oats', category: 'staples', emoji: '🌾' },
  { id: 's8', name: 'Besan (Gram Flour)', category: 'staples', emoji: '🟡' },
  { id: 's9', name: 'Maida (All-purpose Flour)', category: 'staples', emoji: '⚪' },
  { id: 's10', name: 'Pasta (Macaroni/Penne)', category: 'staples', emoji: '🍝' },
  { id: 's11', name: 'Sev / Bhujia', category: 'staples', emoji: '🍜' },
  { id: 's12', name: 'Cornflour', category: 'staples', emoji: '🌽' },
  { id: 's13', name: 'Boiled Chana / Chickpeas', category: 'staples', emoji: '🧆' },
  { id: 's14', name: 'Dal (Moong/Toor)', category: 'staples', emoji: '🍲' },
  { id: 's15', name: 'Papad', category: 'staples', emoji: '🫓' },

  // Dairy & Eggs
  { id: 'd1', name: 'Dahi (Yogurt)', category: 'dairy', emoji: '🥛' },
  { id: 'd2', name: 'Milk / Doodh', category: 'dairy', emoji: '🥛' },
  { id: 'd3', name: 'Butter / Amul Butter', category: 'dairy', emoji: '🧈' },
  { id: 'd4', name: 'Ghee', category: 'dairy', emoji: '🫙' },
  { id: 'd5', name: 'Cheese Slice', category: 'dairy', emoji: '🧀' },
  { id: 'd6', name: 'Cheese Cube/Block', category: 'dairy', emoji: '🧀' },
  { id: 'd7', name: 'Cream / Malai', category: 'dairy', emoji: '🧴' },
  { id: 'd8', name: 'Eggs (Anda)', category: 'dairy', emoji: '🥚' },

  // Hostel Snacks & Junk
  { id: 'sn1', name: 'Kurkure', category: 'snacks', emoji: '🍟' },
  { id: 'sn2', name: 'Lay\'s Chips', category: 'snacks', emoji: '🥔' },
  { id: 'sn3', name: 'Peanut Butter', category: 'snacks', emoji: '🥜' },
  { id: 'sn4', name: 'Jam', category: 'snacks', emoji: '🍓' },
  { id: 'sn5', name: 'Monaco / Parle-G Biscuits', category: 'snacks', emoji: '🍪' },
  { id: 'sn6', name: 'Nachos', category: 'snacks', emoji: '📐' },
  { id: 'sn7', name: 'Momo Chutney', category: 'snacks', emoji: '🌶️' },
  { id: 'sn8', name: 'Chili Oil', category: 'snacks', emoji: '🫙' },

  // Fruits & Sweets
  { id: 'f1', name: 'Banana (Kela)', category: 'fruits', emoji: '🍌' },
  { id: 'f2', name: 'Apple (Seb)', category: 'fruits', emoji: '🍎' },
  { id: 'f3', name: 'Sugar / Cheeni', category: 'fruits', emoji: '🍬' },
  { id: 'f4', name: 'Jaggery / Gud', category: 'fruits', emoji: '🍯' },
  { id: 'f5', name: 'Honey', category: 'fruits', emoji: '🍯' },
  { id: 'f6', name: 'Chocolate Bar', category: 'fruits', emoji: '🍫' }
];

// --- APP STATE ---
const state = {
  selectedIngredients: new Set(),
  activeCategory: 'all',
  searchQuery: '',
  equipments: new Set(['kettle', 'induction']),
  maxTime: 'any',
  recipes: [],
  apiKey: (function(){ try { return localStorage.getItem('fridgechef_groq_key') || DEFAULT_GROQ_KEY; } catch(e) { return DEFAULT_GROQ_KEY; } })(),
  useMock: (function(){ try { return localStorage.getItem('fridgechef_use_mock') === 'true'; } catch(e) { return false; } })()
};

// --- DOM ELEMENTS ---
const landingScreen = document.getElementById('landingScreen');
const mainAppScreen = document.getElementById('mainAppScreen');
const enterAppBtn = document.getElementById('enterAppBtn');
const brandHomeClick = document.getElementById('brandHomeClick');

const ingredientGrid = document.getElementById('ingredientGrid');
const selectedCounter = document.getElementById('selectedCounter');
const btnCountBadge = document.getElementById('btnCountBadge');
const generateBtn = document.getElementById('generateBtn');
const customIngredientsInput = document.getElementById('customIngredients');
const clearCustomInputBtn = document.getElementById('clearCustomInput');
const searchInput = document.getElementById('searchIngredients');
const categoryScroll = document.getElementById('categoryScroll');
const resultsSection = document.getElementById('resultsSection');
const recipeCardsContainer = document.getElementById('recipeCardsContainer');
const loadingSkeleton = document.getElementById('loadingSkeleton');
const resetSearchBtn = document.getElementById('resetSearchBtn');
const resultsSubtext = document.getElementById('resultsSubtext');

// Modal Elements
const recipeModal = document.getElementById('recipeModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalRecipeContent = document.getElementById('modalRecipeContent');
const keyModal = document.getElementById('keyModal');
const openKeyModalBtn = document.getElementById('openKeyModal');
const closeKeyModalBtn = document.getElementById('closeKeyModal');
const saveKeyBtn = document.getElementById('saveKeyBtn');
const groqApiKeyInput = document.getElementById('groqApiKeyInput');
const useMockCheckbox = document.getElementById('useMockFallback');

// --- INITIALIZATION ---
function initApp() {
  renderIngredients();
  setupEventListeners();
  updateCounters();
  if (groqApiKeyInput) groqApiKeyInput.value = state.apiKey;
  if (useMockCheckbox) useMockCheckbox.checked = state.useMock;
}

// --- LANDING PAGE SCREEN TRANSITIONS ---
function showMainAppScreen() {
  const landing = document.getElementById('landingScreen');
  const main = document.getElementById('mainAppScreen');
  if (landing) landing.style.display = 'none';
  if (main) main.style.display = 'flex';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showLandingScreen() {
  const landing = document.getElementById('landingScreen');
  const main = document.getElementById('mainAppScreen');
  if (main) main.style.display = 'none';
  if (landing) landing.style.display = 'flex';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Expose globally so inline onclick works unconditionally
window.showMainAppScreen = showMainAppScreen;
window.showLandingScreen = showLandingScreen;

// Quick select from popular bar
window.quickSelectPopular = function(ingredientName) {
  state.selectedIngredients.add(ingredientName);
  renderIngredients();
  updateCounters();
  showMainAppScreen();
};

// --- RENDER INGREDIENT PILLS ---
function renderIngredients() {
  ingredientGrid.innerHTML = '';

  const filtered = INGREDIENTS_DATA.filter(item => {
    const matchesCategory = state.activeCategory === 'all' || item.category === state.activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(state.searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    ingredientGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 20px; font-size: 13px;">No ingredients found matching "${state.searchQuery}"</div>`;
    return;
  }

  filtered.forEach(item => {
    const isSelected = state.selectedIngredients.has(item.name);
    const badge = document.createElement('div');
    badge.className = `ing-badge ${isSelected ? 'selected' : ''}`;
    badge.innerHTML = `<span class="ing-emoji">${item.emoji}</span><span>${item.name}</span>`;
    badge.addEventListener('click', () => toggleIngredient(item.name));
    ingredientGrid.appendChild(badge);
  });
}

function toggleIngredient(name) {
  if (state.selectedIngredients.has(name)) {
    state.selectedIngredients.delete(name);
  } else {
    state.selectedIngredients.add(name);
  }
  renderIngredients();
  updateCounters();
}

function updateCounters() {
  const count = state.selectedIngredients.size;
  selectedCounter.textContent = `${count} selected`;
  btnCountBadge.textContent = count;
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
  // Navigation Transitions
  enterAppBtn.addEventListener('click', showMainAppScreen);
  brandHomeClick.addEventListener('click', showLandingScreen);

  // Category tabs click
  categoryScroll.querySelectorAll('.cat-pill').forEach(btn => {
    btn.addEventListener('click', (e) => {
      categoryScroll.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      state.activeCategory = e.target.dataset.cat;
      renderIngredients();
    });
  });

  // Search input
  searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.trim();
    renderIngredients();
  });

  // Custom ingredients input typing
  customIngredientsInput.addEventListener('input', (e) => {
    clearCustomInputBtn.style.display = e.target.value.length > 0 ? 'block' : 'none';
  });

  clearCustomInputBtn.addEventListener('click', () => {
    customIngredientsInput.value = '';
    clearCustomInputBtn.style.display = 'none';
  });

  // Equipment chip toggles
  document.querySelectorAll('.chip-toggle').forEach(chip => {
    chip.addEventListener('click', () => {
      const equip = chip.dataset.equip;
      chip.classList.toggle('active');
      if (state.equipments.has(equip)) {
        state.equipments.delete(equip);
      } else {
        state.equipments.add(equip);
      }
    });
  });

  // Time filter segments
  document.querySelectorAll('.segment').forEach(seg => {
    seg.addEventListener('click', () => {
      document.querySelectorAll('.segment').forEach(s => s.classList.remove('active'));
      seg.classList.add('active');
      state.maxTime = seg.dataset.time;
    });
  });

  // Generate Button Click
  generateBtn.addEventListener('click', handleGenerateRecipes);

  // Clear / Reset button
  resetSearchBtn.addEventListener('click', () => {
    state.selectedIngredients.clear();
    customIngredientsInput.value = '';
    clearCustomInputBtn.style.display = 'none';
    renderIngredients();
    updateCounters();
    resultsSection.style.display = 'none';
  });

  // Modal Closures
  closeModalBtn.addEventListener('click', () => recipeModal.style.display = 'none');
  recipeModal.addEventListener('click', (e) => {
    if (e.target === recipeModal) recipeModal.style.display = 'none';
  });

  openKeyModalBtn.addEventListener('click', () => keyModal.style.display = 'flex');
  closeKeyModalBtn.addEventListener('click', () => keyModal.style.display = 'none');
  keyModal.addEventListener('click', (e) => {
    if (e.target === keyModal) keyModal.style.display = 'none';
  });

  saveKeyBtn.addEventListener('click', () => {
    state.apiKey = groqApiKeyInput.value.trim() || DEFAULT_GROQ_KEY;
    state.useMock = useMockCheckbox.checked;
    localStorage.setItem('fridgechef_groq_key', state.apiKey);
    localStorage.setItem('fridgechef_use_mock', state.useMock);
    keyModal.style.display = 'none';
    alert('Settings saved!');
  });
}

// --- GENERATE RECIPES VIA GROQ LLAMA-3.1-8B-INSTANT ---
async function handleGenerateRecipes() {
  const customItems = customIngredientsInput.value
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  const allAvailable = [...Array.from(state.selectedIngredients), ...customItems];

  if (allAvailable.length === 0) {
    alert('Please select at least 1 ingredient or type something you have!');
    return;
  }

  // Scroll to results and show skeleton
  resultsSection.style.display = 'block';
  recipeCardsContainer.innerHTML = '';
  loadingSkeleton.style.display = 'block';
  resultsSection.scrollIntoView({ behavior: 'smooth' });

  const equipmentsList = Array.from(state.equipments).join(', ') || 'No special equipment';
  const timeLimit = state.maxTime === 'any' ? 'No limit' : `${state.maxTime} minutes`;

  const activeKey = state.apiKey || DEFAULT_GROQ_KEY;

  // Live Groq API Request with Random Variation Seed
  try {
    const randomSeed = Math.floor(Math.random() * 100000);
    const prompt = `You are CodeChef, an expert Indian hostel chef AI. The user has ONLY these ingredients available: ${allAvailable.join(', ')}.
Equipment available: ${equipmentsList}.
Max prep time requested: ${timeLimit}.
Random variation seed: ${randomSeed}.

Generate 3 to 4 unique, creative Indian hostel/student recipes using ONLY these available ingredients (or with smart Jugaad swaps).
Make sure each dish is distinct, exciting, and specifically built around these available ingredients: ${allAvailable.join(', ')}.
IMPORTANT: Return strictly a valid JSON array of recipe objects with no extra intro markdown or text.

Each JSON object MUST have:
- "title": string (creative Indian dish name)
- "emoji": string (single emoji)
- "prep_time": string (e.g. "8 mins")
- "equipment": string (e.g. "Electric Kettle" or "Induction")
- "matching_percent": string (e.g. "95%")
- "description": string (short mouthwatering summary)
- "jugaad_swap": string (practical hostel substitute tip, e.g., "No gas? Use electric kettle for boiling potatoes")
- "ingredients_used": array of strings
- "steps": array of objects with keys: "step" (number), "text" (string), "timer_seconds" (number, 0 if no timer needed)`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${activeKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'You are CodeChef AI. You reply exclusively in JSON format without markdown ticks. Provide fresh unique recipes on every request.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.85,
        max_tokens: 1400
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const rawContent = data.choices[0].message.content.trim();
    
    // Clean potential markdown quotes
    const jsonStr = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
    const recipes = JSON.parse(jsonStr);

    loadingSkeleton.style.display = 'none';
    resultsSubtext.textContent = 'Powered by CodeChef Llama 3.1 ⚡';
    renderRecipeCards(recipes);
  } catch (err) {
    console.warn('Groq API Call failed, falling back to dynamic generator:', err);
    loadingSkeleton.style.display = 'none';
    resultsSubtext.textContent = 'Dynamic CodeChef Engine (Groq fallback activated)';
    const mockData = generateDynamicSmartRecipes(allAvailable, equipmentsList, state.maxTime);
    renderRecipeCards(mockData);
  }
}

// --- RENDER RECIPE CARDS ---
function renderRecipeCards(recipes) {
  recipeCardsContainer.innerHTML = '';
  state.recipes = recipes;

  recipes.forEach((rec, idx) => {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.innerHTML = `
      <div class="recipe-card-header">
        <h3 class="recipe-title">${rec.emoji || '🍳'} ${rec.title}</h3>
        <span class="tag tag-match">${rec.matching_percent || '90% Match'}</span>
      </div>
      
      <div class="recipe-tags">
        <span class="tag tag-time">⏱️ ${rec.prep_time}</span>
        <span class="tag tag-equip">⚡ ${rec.equipment}</span>
      </div>

      <p class="recipe-desc">${rec.description}</p>

      ${rec.jugaad_swap ? `
        <div class="jugaad-box">
          <i class="ri-lightbulb-fill text-orange"></i>
          <span><strong>Jugaad Swap:</strong> ${rec.jugaad_swap}</span>
        </div>
      ` : ''}

      <button class="btn-view-steps" onclick="openStepModal(${idx})">
        <i class="ri-restaurant-line"></i> View Steps & Start Cooking
      </button>
    `;
    recipeCardsContainer.appendChild(card);
  });
}

// --- OPEN COOKING MODAL & TIMERS ---
window.openStepModal = function(index) {
  const recipe = state.recipes[index];
  if (!recipe) return;

  modalRecipeContent.innerHTML = `
    <div style="margin-bottom: 16px;">
      <h2 style="font-family: var(--font-heading); font-size: 20px; font-weight: 800; color: var(--rust-dark);">
        ${recipe.emoji || '🍳'} ${recipe.title}
      </h2>
      <p style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">
        CodeChef Hostel Guide • ${recipe.prep_time} • ${recipe.equipment}
      </p>
    </div>

    <div style="background: var(--bg-cream-subtle); padding: 12px; border-radius: var(--radius-md); margin-bottom: 16px;">
      <h4 style="font-size: 12px; text-transform: uppercase; color: var(--rust-dark); margin-bottom: 6px;">Ingredients Used:</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 6px;">
        ${(recipe.ingredients_used || []).map(ing => `<span class="tag" style="background: #FFF;">${ing}</span>`).join('')}
      </div>
    </div>

    <h3 style="font-family: var(--font-heading); font-size: 16px; color: var(--rust-dark); margin-bottom: 10px;">
      Step-by-Step Instructions:
    </h3>

    <div class="cooking-steps-list">
      ${(recipe.steps || []).map((step, sIdx) => `
        <div class="step-item">
          <div class="step-num">${step.step || sIdx + 1}</div>
          <div class="step-content">
            <p class="step-text">${step.text}</p>
            ${step.timer_seconds ? `
              <div class="timer-widget" id="timerWidget_${sIdx}">
                <i class="ri-timer-flash-line text-orange"></i>
                <span class="timer-time" id="timerDisplay_${sIdx}">${formatSeconds(step.timer_seconds)}</span>
                <button class="timer-btn" onclick="toggleTimer(${sIdx}, ${step.timer_seconds})">Start Timer</button>
              </div>
            ` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;

  recipeModal.style.display = 'flex';
};

// --- INTERACTIVE STEP TIMER & SYNTH AUDIO ---
const timerStates = {};

window.toggleTimer = function(stepIdx, initialSeconds) {
  const display = document.getElementById(`timerDisplay_${stepIdx}`);
  const btn = display.nextElementSibling;

  if (timerStates[stepIdx] && timerStates[stepIdx].interval) {
    // Pause
    clearInterval(timerStates[stepIdx].interval);
    timerStates[stepIdx].interval = null;
    btn.textContent = 'Resume';
    btn.style.background = 'var(--orange-primary)';
  } else {
    // Start or Resume
    let currentSec = timerStates[stepIdx] ? timerStates[stepIdx].currentSec : initialSeconds;
    btn.textContent = 'Pause';
    btn.style.background = 'var(--rust-dark)';

    timerStates[stepIdx] = {
      currentSec: currentSec,
      interval: setInterval(() => {
        currentSec--;
        timerStates[stepIdx].currentSec = currentSec;
        display.textContent = formatSeconds(currentSec);

        if (currentSec <= 0) {
          clearInterval(timerStates[stepIdx].interval);
          timerStates[stepIdx].interval = null;
          display.textContent = 'DONE! 🔔';
          btn.textContent = 'Restart';
          btn.style.background = 'var(--orange-primary)';
          playBeepSound();
        }
      }, 1000)
    };
  }
};

function formatSeconds(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function playBeepSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.8);
  } catch (e) {
    console.log('Audio alert triggered');
  }
}

// --- DYNAMIC SMART RECIPE GENERATOR ENGINE (FALLBACK) ---
function generateDynamicSmartRecipes(available, equipmentStr, maxTime) {
  const itemsList = available.map(i => i.split('(')[0].trim());
  const equipList = Array.from(state.equipments);

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  const cookingStyles = [
    { prefix: 'CodeChef Special', suffix: 'Toss', style: 'Pan Fry', emoji: '🔥' },
    { prefix: 'Hostel Jugaad', suffix: 'Masala Roll', style: 'Wrap', emoji: '🌯' },
    { prefix: '5-Min Kettle', suffix: 'Hot Soup', style: 'Boiled Broth', emoji: '🫖' },
    { prefix: 'Crispy Induction', suffix: 'Bites', style: 'Roast', emoji: '🍳' },
    { prefix: 'No-Cook', suffix: 'Bhel Chaat', style: 'Toss', emoji: '🍿' },
    { prefix: 'Desi Spiced', suffix: 'Bowl', style: 'Curry Fry', emoji: '🍲' },
    { prefix: 'Late Night', suffix: 'Cheesy Melt', style: 'Microwave Melt', emoji: '🧀' },
    { prefix: 'Kettle Steamed', suffix: 'Poha Mix', style: 'Steam Cook', emoji: '🥣' }
  ];

  const jugaadSwapsList = [
    "No Gas/Induction? Poke with a fork & microwave for 3 mins!",
    "No Dahi? Mix Mayo + 3 drops of lemon juice for creamy tanginess.",
    "No Maggi Masala? Mix Chaat masala + chili flakes + salt!",
    "No Butter? Use ghee or a splash of refined oil.",
    "No Tomato? Tomato ketchup + vinegar gives the exact same sweet-tangy taste!"
  ];

  const recipes = [];
  const shuffledStyles = shuffle(cookingStyles);

  for (let i = 0; i < Math.min(4, Math.max(3, itemsList.length)); i++) {
    const mainItem = itemsList[i % itemsList.length];
    const subItem = itemsList[(i + 1) % itemsList.length] || 'Spices';
    const accentItem = itemsList[(i + 2) % itemsList.length] || 'Masala';

    const style = shuffledStyles[i % shuffledStyles.length];
    const equip = equipList[i % equipList.length] || 'Zero Equipment';

    const equipName = equip === 'kettle' ? 'Electric Kettle' :
                      equip === 'induction' ? 'Induction / Pan' :
                      equip === 'microwave' ? 'Microwave' : 'No Gas / No Cook';

    const timeInMins = Math.floor(Math.random() * 8) + 4;
    const matchPct = Math.floor(Math.random() * 12) + 88;

    const recipeTitle = `${style.prefix} ${mainItem} ${subItem !== mainItem ? '& ' + subItem : ''} ${style.suffix}`;
    const description = `A delicious ${style.style.toLowerCase()} made using your ${mainItem.toLowerCase()} and ${subItem.toLowerCase()}, seasoned with ${accentItem.toLowerCase()}. Perfect quick meal for room hunger!`;

    const ingredientsUsed = [mainItem, subItem, accentItem, ...shuffle(itemsList).slice(0, 2)];
    const uniqueIngredients = Array.from(new Set(ingredientsUsed));

    recipes.push({
      title: recipeTitle,
      emoji: style.emoji,
      prep_time: `${timeInMins} mins`,
      equipment: equipName,
      matching_percent: `${matchPct}% Match`,
      description: description,
      jugaad_swap: jugaadSwapsList[Math.floor(Math.random() * jugaadSwapsList.length)],
      ingredients_used: uniqueIngredients,
      steps: [
        { 
          step: 1, 
          text: `Prep your ${mainItem} and ${subItem} into small bite-sized pieces for quick cooking in your ${equipName}.`, 
          timer_seconds: 60 
        },
        { 
          step: 2, 
          text: `Heat your ${equipName}, add a teaspoon of butter/oil/ghee, and toss in ${accentItem} along with green chilis or spices.`, 
          timer_seconds: 120 
        },
        { 
          step: 3, 
          text: `Combine everything together, cook for ${timeInMins - 2} minutes until fragrant, and serve piping hot!`, 
          timer_seconds: (timeInMins - 2) * 60 
        }
      ]
    });
  }

  return recipes;
}

// Start app on DOM loaded
document.addEventListener('DOMContentLoaded', initApp);
