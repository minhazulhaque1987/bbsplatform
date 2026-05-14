// ============================================
// BBS Position Auto-Complete System
// For: BBS Employee Platform
// ============================================

let selectedPosition = null;
let highlightedPositionIndex = -1;
let filteredPositions = [];

/**
 * Search positions by query (Bangla or English)
 * @param {string} query - Search text
 * @returns {Array} - Matching positions (max 50)
 */
function searchPositions(query) {
  if (!query || query.length < 1) return [];

  const lowerQuery = query.toLowerCase();
  console.log('Searching positions with query:', lowerQuery);

  return bbsPositions.filter(position => {
    return position.bn.toLowerCase().includes(lowerQuery) ||
           position.en.toLowerCase().includes(lowerQuery);
  }).slice(0, 50); // Limit to 50 for performance
}

/**
 * Render dropdown with search results
 * @param {Array} positions - Filtered position list
 * @param {string} dropdownId - Dropdown element ID
 */
function renderPositionDropdown(positions, dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  if (!dropdown) {
    console.error('Dropdown not found:', dropdownId);
    return;
  }

  console.log('Rendering dropdown:', dropdownId, 'with', positions.length, 'positions');

  if (positions.length === 0) {
    dropdown.innerHTML = `<div class="position-dropdown-item" style="padding:12px;text-align:center;color:#999;font-family:'Noto Sans Bengali',sans-serif">❌ কোনো ফলাফল পাওয়া যায়নি</div>`;
    dropdown.style.display = 'block';
    return;
  }

  let html = '';
  positions.forEach((position, index) => {
    // Grade badge colors based on grade level
    const gradeColors = {
      '৩য় গ্রেড': { bg: '#ffebee', color: '#c62828' },
      '৪র্থ গ্রেড': { bg: '#fce4ec', color: '#ad1457' },
      '৫ম গ্রেড': { bg: '#f3e5f5', color: '#6a1b9a' },
      '৬ষ্ঠ গ্রেড': { bg: '#e8eaf6', color: '#283593' },
      '৯ম গ্রেড': { bg: '#e3f2fd', color: '#1565c0' },
      '১০ম গ্রেড': { bg: '#e0f2f1', color: '#00695c' },
      '১১তম গ্রেড': { bg: '#f1f8e9', color: '#33691e' },
      '১৩তম গ্রেড': { bg: '#fff8e1', color: '#f57f17' },
      '১৪তম গ্রেড': { bg: '#efebe9', color: '#4e342e' },
      '১৬তম গ্রেড': { bg: '#fafafa', color: '#424242' },
      '২০তম গ্রেড': { bg: '#eceff1', color: '#37474f' }
    };
    const style = gradeColors[position.grade] || { bg: '#f5f5f5', color: '#666' };

    html += `
      <div class="position-dropdown-item" data-index="${index}"
           onclick="selectPosition(${index}, '${dropdownId}')"
           onmouseenter="highlightPositionItem(${index}, '${dropdownId}')">
        <div style="font-weight:600;font-size:14px;color:#2c3e50;font-family:'Noto Sans Bengali',sans-serif">${position.bn}</div>
        <div style="font-size:11px;color:#7f8c8d;margin-top:2px">${position.en}</div>
        <span style="display:inline-block;font-size:10px;padding:2px 8px;border-radius:8px;margin-top:4px;background:${style.bg};color:${style.color};font-weight:600">${position.grade}</span>
      </div>
    `;
  });

  dropdown.innerHTML = html;
  dropdown.style.display = 'block';
}

/**
 * Select a position from dropdown
 * @param {number} index - Selected index
 * @param {string} dropdownId - Dropdown element ID
 */
function selectPosition(index, dropdownId) {
  selectedPosition = filteredPositions[index];
  const input = document.getElementById('s-post');
  if (input) {
    input.value = selectedPosition.bn;
    // Store extra data in dataset
    input.dataset.selectedEn = selectedPosition.en;
    input.dataset.selectedGrade = selectedPosition.grade;
  }
  document.getElementById(dropdownId).style.display = 'none';
  highlightedPositionIndex = -1;
}

/**
 * Highlight item on hover/keyboard
 * @param {number} index - Item index
 * @param {string} dropdownId - Dropdown element ID
 */
function highlightPositionItem(index, dropdownId) {
  highlightedPositionIndex = index;
  const items = document.querySelectorAll(`#${dropdownId} .position-dropdown-item`);
  items.forEach((item, i) => {
    item.style.background = i === index ? '#e3f2fd' : 'white';
  });
}

/**
 * Setup auto-complete for position input field
 * @param {string} inputId - Input element ID
 * @param {string} dropdownId - Dropdown element ID
 */
function setupPositionAutocomplete(inputId, dropdownId) {
  const input = document.getElementById(inputId);
  const dropdown = document.getElementById(dropdownId);

  if (!input) {
    console.error('Position input not found: ' + inputId);
    return;
  }

  console.log('Position autocomplete setup for:', inputId, dropdownId);

  // Input event - search as user types
  input.addEventListener('input', function(e) {
    const query = e.target.value.trim();
    console.log('Position input event:', query);
    selectedPosition = null;
    delete input.dataset.selectedEn;
    delete input.dataset.selectedGrade;

    if (query.length < 1) {
      if (dropdown) dropdown.style.display = 'none';
      return;
    }

    filteredPositions = searchPositions(query);
    console.log('Filtered positions:', filteredPositions.length);
    highlightedPositionIndex = -1;
    renderPositionDropdown(filteredPositions, dropdownId);
  });

  // Keyboard navigation
  input.addEventListener('keydown', function(e) {
    const items = document.querySelectorAll(`#${dropdownId} .position-dropdown-item`);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      highlightedPositionIndex = Math.min(highlightedPositionIndex + 1, items.length - 1);
      highlightPositionItem(highlightedPositionIndex, dropdownId);
      if (items[highlightedPositionIndex]) {
        items[highlightedPositionIndex].scrollIntoView({ block: 'nearest' });
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      highlightedPositionIndex = Math.max(highlightedPositionIndex - 1, 0);
      highlightPositionItem(highlightedPositionIndex, dropdownId);
      if (items[highlightedPositionIndex]) {
        items[highlightedPositionIndex].scrollIntoView({ block: 'nearest' });
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedPositionIndex >= 0 && filteredPositions[highlightedPositionIndex]) {
        selectPosition(highlightedPositionIndex, dropdownId);
      }
    } else if (e.key === 'Escape') {
      if (dropdown) dropdown.style.display = 'none';
      highlightedPositionIndex = -1;
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest(`#${inputId}`) && !e.target.closest(`#${dropdownId}`)) {
      if (dropdown) dropdown.style.display = 'none';
    }
  });
}

/**
 * Get the currently selected position object
 * @returns {Object|null} - Selected position or null
 */
function getSelectedPosition() {
  const input = document.getElementById('s-post');
  if (!input) return null;

  if (selectedPosition && input.value === selectedPosition.bn) {
    return selectedPosition;
  }

  // Try to find exact match
  if (input.value) {
    const match = bbsPositions.find(p => p.bn === input.value || p.en === input.value);
    if (match) return match;
  }

  return null;
}

/**
 * Validate that a position is selected from the list
 * @returns {boolean} - True if valid
 */
function validatePositionSelection() {
  const position = getSelectedPosition();
  if (!position) {
    // Show error
    const errEl = document.getElementById('s-post-e');
    if (errEl) {
      errEl.textContent = 'দয়া করে তালিকা থেকে একটি পদবি নির্বাচন করুন';
      errEl.style.display = 'block';
    }
    return false;
  }
  return true;
}