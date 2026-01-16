 
const App = { 
    filters: {
        name: '',
        status: '',
        species: '',
        page: 1
    },
     
    selectedCharacterId: null,
    
    // API endpoints
    api: {
        characters: '/api/characters',
        character: (id) => `/api/characters/${id}`
    }
};

 
function init() {  
    setupEventListeners();
 
}

 
function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    // Filter button
    const filterBtn = document.getElementById('filter-btn');
    if (filterBtn) {
        filterBtn.addEventListener('click', openFilterModal);
    }
    
    // Close filter button
    const closeFilterBtn = document.getElementById('close-filter-btn');
    if (closeFilterBtn) {
        closeFilterBtn.addEventListener('click', closeFilterModal);
    }
    
    // Filter options
    document.querySelectorAll('.filter-option').forEach(btn => {
        btn.addEventListener('click', handleFilterOptionClick);
    });
    
    // Apply filters button
    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }
    
    // Back button (mobile)
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', closeMobileDetail);
    }
    
    // Close modal on backdrop click
    const filterModal = document.getElementById('filter-modal');
    if (filterModal) {
        filterModal.addEventListener('click', (e) => {
            if (e.target === filterModal) {
                closeFilterModal();
            }
        });
    }
}

/**
 * Handle search input
 */
function handleSearch(e) {
    App.filters.name = e.target.value;
    App.filters.page = 1;
    console.log('Search:', App.filters.name);
    // loadCharacters(); // Will be implemented in FASE 4
}

/**
 * Open filter modal
 */
function openFilterModal() {
    const modal = document.getElementById('filter-modal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Close filter modal
 */
function closeFilterModal() {
    const modal = document.getElementById('filter-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

/**
 * Handle filter option click
 */
function handleFilterOptionClick(e) {
    const btn = e.currentTarget;
    const filter = btn.dataset.filter;
    const value = btn.dataset.value;
    
    // Update UI - deselect siblings, select this one
    const container = btn.parentElement;
    container.querySelectorAll('.filter-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    btn.classList.add('selected');
    
    // Update state
    App.filters[filter] = value;
    
    // Enable apply button if any filter is active
    updateApplyButton();
}

/**
 * Update apply button state
 */
function updateApplyButton() {
    const btn = document.getElementById('apply-filters-btn');
    if (btn) {
        const hasFilters = App.filters.status || App.filters.species;
        btn.disabled = false;
        
        if (hasFilters) {
            btn.classList.remove('bg-gray-100', 'text-gray-500');
            btn.classList.add('bg-primary-600', 'text-white');
        } else {
            btn.classList.add('bg-gray-100', 'text-gray-500');
            btn.classList.remove('bg-primary-600', 'text-white');
        }
    }
}

/**
 * Apply filters
 */
function applyFilters() {
    App.filters.page = 1;
    console.log('Applying filters:', App.filters);
    closeFilterModal();
    // loadCharacters(); // Will be implemented in FASE 4
}

/**
 * Close mobile detail panel
 */
function closeMobileDetail() {
    const panel = document.getElementById('mobile-detail-panel');
    if (panel) {
        panel.classList.add('hidden');
        panel.classList.remove('flex');
    }
}

/**
 * Debounce utility
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
