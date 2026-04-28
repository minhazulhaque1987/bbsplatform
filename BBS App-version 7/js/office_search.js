// ============================================
// BBS Office Auto-Complete System
// For: BBS Employee Platform
// ============================================

let selectedOffice = null;
let highlightedIndex = -1;
let filteredOffices = [];

/**
 * Search offices by query (Bangla or English)
 * @param {string} query - Search text
 * @returns {Array} - Matching offices (max 50)
 */
function searchOffices(query) {
  if (!query || query.length < 1) return [];

  const lowerQuery = query.toLowerCase();

  return bbsOffices.filter(office => {
    return office.bn.toLowerCase().includes(lowerQuery) || 
           office.en.toLowerCase().includes(lowerQuery);
  }).slice(0, 50); // Limit to 50 for performance
}

/**
 * Render dropdown with search results
 * @param {Array} offices - Filtered office list
 * @param {string} dropdownId - Dropdown element ID
 */
function renderOfficeDropdown(offices, dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  if (!dropdown) return;

  if (offices.length === 0) {
    dropdown.innerHTML = `<div class="office-dropdown-item" style="padding:12px;text-align:center;color:#999;font-family:'Noto Sans Bengali',sans-serif">❌ কোনো ফলাফল পাওয়া যায়নি</div>`;
    dropdown.style.display = 'block';
    return;
  }

  let html = '';
  offices.forEach((office, index) => {
    // Type badge colors
    const typeColors = {
      'HQ Wing': { bg: '#ffebee', color: '#c62828' },
      'Divisional': { bg: '#e8f5e9', color: '#2e7d32' },
      'District': { bg: '#e3f2fd', color: '#1565c0' },
      'Upazila': { bg: '#fff8e1', color: '#ef6c00' }
    };
    const style = typeColors[office.type] || { bg: '#f5f5f5', color: '#666' };

    html += `
      <div class="office-dropdown-item" data-index="${index}" 
           onclick="selectOffice(${index}, '${dropdownId}')" 
           onmouseenter="highlightItem(${index}, '${dropdownId}')">
        <div style="font-weight:600;font-size:14px;color:#2c3e50;font-family:'Noto Sans Bengali',sans-serif">${office.bn}</div>
        <div style="font-size:11px;color:#7f8c8d;margin-top:2px">${office.en}</div>
        <span style="display:inline-block;font-size:10px;padding:2px 8px;border-radius:8px;margin-top:4px;background:${style.bg};color:${style.color};font-weight:600">${office.type}</span>
      </div>
    `;
  });

  dropdown.innerHTML = html;
  dropdown.style.display = 'block';
}

/**
 * Select an office from dropdown
 * @param {number} index - Selected index
 * @param {string} dropdownId - Dropdown element ID
 */
function selectOffice(index, dropdownId) {
  selectedOffice = filteredOffices[index];
  const input = document.getElementById('s-office');
  if (input) {
    input.value = selectedOffice.bn;
    // Store extra data in dataset
    input.dataset.selectedEn = selectedOffice.en;
    input.dataset.selectedType = selectedOffice.type;
  }
  document.getElementById(dropdownId).style.display = 'none';
  highlightedIndex = -1;
}

/**
 * Highlight item on hover/keyboard
 * @param {number} index - Item index
 * @param {string} dropdownId - Dropdown element ID
 */
function highlightItem(index, dropdownId) {
  highlightedIndex = index;
  const items = document.querySelectorAll(`#${dropdownId} .office-dropdown-item`);
  items.forEach((item, i) => {
    item.style.background = i === index ? '#e3f2fd' : 'white';
  });
}

/**
 * Setup auto-complete for an input field
 * @param {string} inputId - Input element ID
 * @param {string} dropdownId - Dropdown element ID
 */
function setupOfficeAutocomplete(inputId, dropdownId) {
  const input = document.getElementById(inputId);
  const dropdown = document.getElementById(dropdownId);

  if (!input) {
    console.error('Office input not found: ' + inputId);
    return;
  }

  // Input event - search as user types
  input.addEventListener('input', function(e) {
    const query = e.target.value.trim();
    selectedOffice = null;
    delete input.dataset.selectedEn;
    delete input.dataset.selectedType;

    if (query.length < 1) {
      if (dropdown) dropdown.style.display = 'none';
      return;
    }

    filteredOffices = searchOffices(query);
    highlightedIndex = -1;
    renderOfficeDropdown(filteredOffices, dropdownId);
  });

  // Keyboard navigation
  input.addEventListener('keydown', function(e) {
    const items = document.querySelectorAll(`#${dropdownId} .office-dropdown-item`);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      highlightedIndex = Math.min(highlightedIndex + 1, items.length - 1);
      highlightItem(highlightedIndex, dropdownId);
      if (items[highlightedIndex]) {
        items[highlightedIndex].scrollIntoView({ block: 'nearest' });
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      highlightedIndex = Math.max(highlightedIndex - 1, 0);
      highlightItem(highlightedIndex, dropdownId);
      if (items[highlightedIndex]) {
        items[highlightedIndex].scrollIntoView({ block: 'nearest' });
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && filteredOffices[highlightedIndex]) {
        selectOffice(highlightedIndex, dropdownId);
      }
    } else if (e.key === 'Escape') {
      if (dropdown) dropdown.style.display = 'none';
      highlightedIndex = -1;
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
 * Get the currently selected office object
 * @returns {Object|null} - Selected office or null
 */
function getSelectedOffice() {
  const input = document.getElementById('s-office');
  if (!input) return null;

  if (selectedOffice && input.value === selectedOffice.bn) {
    return selectedOffice;
  }

  // Try to find exact match
  if (input.value) {
    const match = bbsOffices.find(o => o.bn === input.value || o.en === input.value);
    if (match) return match;
  }

  return null;
}

/**
 * Validate that an office is selected from the list
 * @returns {boolean} - True if valid
 */
function validateOfficeSelection() {
  const office = getSelectedOffice();
  if (!office) {
    // Show error
    const errEl = document.getElementById('s-office-e');
    if (errEl) {
      errEl.textContent = 'দয়া করে তালিকা থেকে একটি অফিস নির্বাচন করুন';
      errEl.style.display = 'block';
    }
    return false;
  }
  return true;
}
