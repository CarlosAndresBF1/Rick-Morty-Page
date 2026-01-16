const App = {
    filters: {
        name: '',
        status: '',
        species: '',
        page: 1
    },
    selectedCharacterId: null,
    api: {
        characters: '/api/characters',
        character: (id) => `/api/characters/${id}`
    }
};

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

function init() {
    console.log('App initialized');
    setupEventListeners();
}

function setupEventListeners() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }

    const filterBtn = document.getElementById('filter-btn');
    console.log('Filter button found:', filterBtn);
    if (filterBtn) {
        filterBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            console.log('Filter button clicked');
            const dropdown = document.getElementById('filter-dropdown');
            console.log('Dropdown found:', dropdown);
            if (dropdown) {
                dropdown.classList.toggle('hidden');
                console.log('Dropdown hidden:', dropdown.classList.contains('hidden'));
            }
        });
    }

    const closeFilterBtn = document.getElementById('close-filter-btn');
    if (closeFilterBtn) {
        closeFilterBtn.addEventListener('click', closeFilterModal);
    }

    document.querySelectorAll('.filter-option').forEach(btn => {
        btn.addEventListener('click', handleFilterOptionClick);
    });

    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }

    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', closeMobileDetail);
    }

    document.addEventListener('click', (e) => {
        const dropdown = document.getElementById('filter-dropdown');
        const filterBtn = document.getElementById('filter-btn');
        if (dropdown && filterBtn && !dropdown.contains(e.target) && !filterBtn.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });
}

function handleSearch(e) {
    App.filters.name = e.target.value;
    App.filters.page = 1;
    console.log('Search:', App.filters.name);
}

function closeFilterModal() {
    const dropdown = document.getElementById('filter-dropdown');
    if (dropdown) {
        dropdown.classList.add('hidden');
    }
}

function handleFilterOptionClick(e) {
    const btn = e.currentTarget;
    const filter = btn.dataset.filter;
    const value = btn.dataset.value;

    const container = btn.parentElement;
    container.querySelectorAll('.filter-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    btn.classList.add('selected');

    App.filters[filter] = value;
    updateApplyButton();
}

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

function applyFilters() {
    App.filters.page = 1;
    console.log('Applying filters:', App.filters);
    closeFilterModal();
}

function closeMobileDetail() {
    const panel = document.getElementById('mobile-detail-panel');
    if (panel) {
        panel.classList.add('hidden');
        panel.classList.remove('flex');
    }
}

document.addEventListener('DOMContentLoaded', init);