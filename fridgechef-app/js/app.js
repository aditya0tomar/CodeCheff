// Main Application Logic for FridgeChef
import { INGREDIENTS, INGREDIENT_CATEGORIES, HOSTEL_MODES } from './ingredients.js';
import { generateRecipes, setGroqApiKey, getStoredApiKey } from './aiEngine.js';

// State
let selectedItems = new Set();
let activeCategory = 'all';
let activeHostelMode = 'any';
let activeTimers = {}; // { stepId: { intervalId, remainingSeconds } }

// DOM Elements
const ingredientsGrid = document.getElementById('ingredientsGrid');
const categoryTabs = document.getElementById('categoryTabs');
const hostelModeBar = document.getElementById('hostelModeBar');
const selectionCount = document.getElementById('selectionCount');
const customInput = document.getElementById('customInput');
const generateBtn = document.getElementById('generateBtn');
const recipeModal = document.getElementById('recipeModal');
const recipeSheetBody = document.getElementById('recipeSheetBody');
const closeSheetBtn = document.getElementById('closeSheetBtn');

// Groq Key Drawer Elements
const toggleKeyDrawerBtn = document.getElementById('toggleKeyDrawerBtn');
const apiDrawer = document.getElementById('apiDrawer');
const groqKeyInput = document.getElementById('groqKeyInput');
const saveKeyBtn = document.getElementById('saveKeyBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderHostelModes();
  renderCategoryTabs();
  renderIngredients();
  initKeyDrawer();
  attachEventListeners();
});

// Render Hostel Equipment Modes
function renderHostelModes() {
  hostelModeBar.innerHTML = HOSTEL_MODES.map(mode => `
    <button class="mode-chip ${mode.id === activeHostelMode ? 'active' : ''}" data-mode="${mode.id}">
      <span>${mode.icon}</span>
      <span>${mode.label}</span>
    </button>
  `).join('');

  hostelModeBar.querySelectorAll('.mode-chip').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const mode = btn.dataset.mode;
      activeHostelMode = mode;
      renderHostelModes();
    });
  });
}

// Render Category Filter Tabs
function renderCategoryTabs() {
  const tabsHTML = [
    { id: 'all', name: 'All 100+ Items', icon: '⚡' },
    ...INGREDIENT_CATEGORIES
  ].map(cat => `
    <button class="tab-btn ${cat.id === activeCategory ? 'active' : ''}" data-cat="${cat.id}">
      <span>${cat.icon}</span>
      <span>${cat.name}</span>
    </button>
  `).join('');

  categoryTabs.innerHTML = tabsHTML;

  categoryTabs.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.dataset.cat;
      renderCategoryTabs();
      renderIngredients();
    });
  });
}

// Render 100+ Ingredients Grid
function renderIngredients() {
  const filtered = INGREDIENTS.filter(item => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  ingredientsGrid.innerHTML = filtered.map(item => {
    const isSelected = selectedItems.has(item.name);
    return `
      <div class="ingredient-chip ${isSelected ? 'selected' : ''}" data-name="${item.name}">
        <span class="item-icon">${item.icon}</span>
        <span class="item-name">${item.name}</span>
      </div>
    `;
  }).join('');

  // Attach selection listeners
  ingredientsGrid.querySelectorAll('.ingredient-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const name = chip.dataset.name;
      if (selectedItems.has(name)) {
        selectedItems.delete(name);
      } else {
        selectedItems.add(name);
      }
      updateSelectionSummary();
      renderIngredients();
    });
  });
}

function updateSelectionSummary() {
  const count = selectedItems.size;
  selectionCount.textContent = `${count} selected`;
}

// Key Drawer Logic
function initKeyDrawer() {
  groqKeyInput.value = getStoredApiKey();

  toggleKeyDrawerBtn.addEventListener('click', () => {
    apiDrawer.classList.toggle('open');
  });

  saveKeyBtn.addEventListener('click', () => {
    setGroqApiKey(groqKeyInput.value);
    apiDrawer.classList.remove('open');
    alert('Groq API Key saved!');
  });
}

// Event Listeners
function attachEventListeners() {
  generateBtn.addEventListener('click', handleGenerateRecipes);
  closeSheetBtn.addEventListener('click', () => {
    recipeModal.classList.remove('open');
  });
}

// Main Recipe Generator Trigger
async function handleGenerateRecipes() {
  const customText = customInput.value.trim();
  const selectedList = Array.from(selectedItems);

  if (selectedList.length === 0 && !customText) {
    alert('Please select at least 1 ingredient or type custom items!');
    return;
  }

  // Show loading in modal
  recipeModal.classList.add('open');
  recipeSheetBody.innerHTML = `
    <div style="text-align: center; padding: 40px 20px;">
      <div style="font-size: 40px; margin-bottom: 12px; animation: spin 1s infinite linear;">⚡</div>
      <h3 style="font-size: 16px; font-weight: 800; color: var(--text-dark); margin-bottom: 6px;">Compiling Jugaad Recipes...</h3>
      <p style="font-size: 12px; color: var(--text-muted);">Consulting Llama-3.1-8b for optimal student dishes</p>
    </div>
  `;

  try {
    const recipes = await generateRecipes({
      selectedItems: selectedList,
      customText,
      hostelMode: activeHostelMode,
      apiKey: getStoredApiKey()
    });

    renderRecipeCards(recipes);
  } catch (err) {
    recipeSheetBody.innerHTML = `
      <div style="text-align: center; padding: 30px 20px; color: var(--primary-orange);">
        <div style="font-size: 36px; margin-bottom: 8px;">⚠️</div>
        <h4>${err.message || 'Generation error'}</h4>
        <p style="font-size: 12px; color: var(--text-muted); margin-top: 6px;">Try selecting more items!</p>
      </div>
    `;
  }
}

// Render Recipe Cards in Modal Sheet
function renderRecipeCards(recipes) {
  if (!recipes || recipes.length === 0) {
    recipeSheetBody.innerHTML = `<p style="text-align:center; padding:20px;">No recipes generated.</p>`;
    return;
  }

  recipeSheetBody.innerHTML = recipes.map((recipe, index) => {
    const recipeId = recipe.id || `recipe-${index}`;

    // Jugaad swaps HTML
    const swapsHTML = (recipe.jugaadSwaps || []).map(swap => `
      <div class="jugaad-box">
        <div class="jugaad-title">💡 Jugaad Swap (${swap.missing})</div>
        <div>${swap.swap}</div>
      </div>
    `).join('');

    // Steps HTML with interactive timers
    const stepsHTML = (recipe.steps || []).map((step, sIdx) => {
      const timerId = `${recipeId}-step-${sIdx}`;
      const minutes = step.timerMinutes || 0;
      return `
        <div class="step-item">
          <div class="step-top">
            <div class="step-num">${step.stepNum || (sIdx + 1)}</div>
            <div class="step-text">${step.text}</div>
          </div>
          ${minutes > 0 ? `
            <div class="timer-widget" id="widget-${timerId}">
              <span>⏱️ <span id="display-${timerId}">${minutes}:00</span></span>
              <button class="timer-start-btn" data-timerid="${timerId}" data-mins="${minutes}">Start</button>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    return `
      <div class="recipe-card">
        <div class="recipe-card-header">
          <div class="recipe-title">${recipe.title}</div>
          <span class="complexity-badge">${recipe.complexity || 'O(1) Easy'}</span>
        </div>
        
        <div class="recipe-tagline">"${recipe.tagline || 'Quick student dish'}"</div>

        <div class="recipe-meta-row">
          <div class="meta-item">⏱️ Prep: ${recipe.prepTime || '5m'}</div>
          <div class="meta-item">🔥 Cook: ${recipe.cookTime || '10m'}</div>
          <div class="meta-item">🍳 ${recipe.equipmentNeeded || 'Pan'}</div>
        </div>

        ${swapsHTML}

        <div style="font-size: 13px; font-weight: 800; margin-bottom: 8px; color: var(--text-dark);">
          Step-by-Step Cooking Guide:
        </div>
        <div class="steps-list">
          ${stepsHTML}
        </div>

        ${recipe.hostelTip ? `
          <div class="hostel-tip-box">
            💡 <strong>Hostel Tip:</strong> ${recipe.hostelTip}
          </div>
        ` : ''}
      </div>
    `;
  }).join('');

  // Attach interactive timer click handlers
  recipeSheetBody.querySelectorAll('.timer-start-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const timerId = btn.dataset.timerid;
      const mins = parseInt(btn.dataset.mins, 10);
      toggleStepTimer(timerId, mins, btn);
    });
  });
}

// Step Countdown Timer Handler
function toggleStepTimer(timerId, totalMins, btnElement) {
  if (activeTimers[timerId]) {
    // Stop running timer
    clearInterval(activeTimers[timerId].intervalId);
    delete activeTimers[timerId];
    btnElement.textContent = 'Start';
    btnElement.classList.remove('running');
    document.getElementById(`display-${timerId}`).textContent = `${totalMins}:00`;
    return;
  }

  // Start new countdown timer
  let remainingSeconds = totalMins * 60;
  btnElement.textContent = 'Pause';
  btnElement.classList.add('running');

  const intervalId = setInterval(() => {
    remainingSeconds--;
    if (remainingSeconds <= 0) {
      clearInterval(intervalId);
      delete activeTimers[timerId];
      btnElement.textContent = 'Done! 🔔';
      btnElement.classList.remove('running');
      document.getElementById(`display-${timerId}`).textContent = '0:00';
      playBeepAlert();
      return;
    }

    const m = Math.floor(remainingSeconds / 60);
    const s = remainingSeconds % 60;
    const formatted = `${m}:${s < 10 ? '0' : ''}${s}`;
    const displayEl = document.getElementById(`display-${timerId}`);
    if (displayEl) displayEl.textContent = formatted;
  }, 1000);

  activeTimers[timerId] = { intervalId, remainingSeconds };
}

// Beep audio alert when step timer ends
function playBeepAlert() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {
    console.log('Audio alert fallback:', e);
  }
}
