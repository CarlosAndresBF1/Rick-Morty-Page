const App = {
    filters: {
        name: '',
        character: '',
        species: '',
        page: 1
    },
    selectedCharacterId: null,
    characters: [],
    starredIds: [],
    pagination: null,
    isLoading: false,
    hasMore: true,
    api: {
        characters: '/api/characters',
        character: (id) => `/api/characters/${id}`,
        starred: '/api/starred',
        toggleStar: (id) => `/api/characters/${id}/star`,
        deleteChar: (id) => `/api/characters/${id}`,
        restore: (id) => `/api/characters/${id}/restore`
    }
};

// Load starred characters from server
async function loadStarredFromServer() {
    try {
        const response = await fetch(App.api.starred);
        const data = await response.json();
        if (data.success) {
            App.starredIds = data.data.map(id => parseInt(id));
        }
    } catch (e) {
        console.error('Error loading starred characters:', e);
        App.starredIds = [];
    }
}

// Toggle starred status for a character (via API)
async function toggleStarred(characterId, event) {
    if (event) {
        event.stopPropagation();
    }
    
    try {
        const response = await fetch(App.api.toggleStar(characterId), {
            method: 'POST'
        });
        const data = await response.json();
        
        if (data.success) {
            if (data.starred) {
                if (!App.starredIds.includes(characterId)) {
                    App.starredIds.push(characterId);
                }
            } else {
                const index = App.starredIds.indexOf(characterId);
                if (index > -1) {
                    App.starredIds.splice(index, 1);
                }
            }
            renderCharacters();
            
            // Update detail panel if this character is selected
            if (App.selectedCharacterId === characterId) {
                const character = App.characters.find(c => c.id === characterId);
                if (character) {
                    renderCharacterDetail(character);
                }
            }
        }
    } catch (e) {
        console.error('Error toggling starred:', e);
    }
}

// Delete a character (soft delete via API)
async function deleteCharacter(characterId, event) {
    if (event) {
        event.stopPropagation();
    }
    
    if (!confirm('Are you sure you want to delete this character?')) {
        return;
    }
    
    try {
        const response = await fetch(App.api.deleteChar(characterId), {
            method: 'DELETE'
        });
        const data = await response.json();
        
        if (data.success) {
            // Remove from local arrays
            App.characters = App.characters.filter(c => c.id !== characterId);
            const starredIndex = App.starredIds.indexOf(characterId);
            if (starredIndex > -1) {
                App.starredIds.splice(starredIndex, 1);
            }
            
            // If this was the selected character, select another
            if (App.selectedCharacterId === characterId) {
                App.selectedCharacterId = null;
                if (App.characters.length > 0) {
                    selectCharacter(App.characters[0].id);
                } else {
                    // Hide detail panel
                    const detailContainer = document.getElementById('character-detail');
                    const detailPlaceholder = document.getElementById('detail-placeholder');
                    if (detailContainer) detailContainer.classList.add('hidden');
                    if (detailPlaceholder) detailPlaceholder.classList.remove('hidden');
                }
            }
            
            renderCharacters();
        }
    } catch (e) {
        console.error('Error deleting character:', e);
    }
}

// Check if character is starred
function isStarred(characterId) {
    return App.starredIds.includes(characterId);
}

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

async function init() {
    await loadStarredFromServer();
    setupEventListeners();
    setupInfiniteScroll();
    loadCharacters();
}

function setupInfiniteScroll() {
    const listContainer = document.getElementById('character-list');
    if (!listContainer) return;
    
    listContainer.addEventListener('scroll', debounce(() => {
        if (App.isLoading || !App.hasMore) return;
        
        const { scrollTop, scrollHeight, clientHeight } = listContainer;
        // Load more when user scrolls to 80% of the list
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            loadMoreCharacters();
        }
    }, 100));
}

async function loadMoreCharacters() {
    if (App.isLoading || !App.hasMore) return;
    
    App.filters.page += 1;
    App.isLoading = true;
    
    showLoadingMore();
    
    try {
        const params = new URLSearchParams();
        if (App.filters.name) params.append('name', App.filters.name);
        if (App.filters.species) params.append('species', App.filters.species);
        params.append('page', App.filters.page);

        const response = await fetch(`${App.api.characters}?${params}`);
        const data = await response.json();

        if (data.success && data.data.length > 0) {
            let characters = data.data;
            
            // Apply character filter locally (starred/others)
            if (App.filters.character === 'starred') {
                characters = characters.filter(c => isStarred(c.id));
            } else if (App.filters.character === 'others') {
                characters = characters.filter(c => !isStarred(c.id));
            }
            
            App.characters = [...App.characters, ...characters];
            App.pagination = data.info;
            App.hasMore = App.filters.page < data.info.pages;
            
            renderCharacters();
        } else {
            App.hasMore = false;
        }
    } catch (error) {
        console.error('Error loading more characters:', error);
        App.hasMore = false;
    } finally {
        App.isLoading = false;
        hideLoadingMore();
    }
}

function showLoadingMore() {
    const container = document.getElementById('characters-container');
    if (!container) return;
    
    // Remove existing loading indicator if present
    const existingLoader = container.querySelector('.loading-more');
    if (existingLoader) existingLoader.remove();
    
    const loadingHTML = `
        <div class="loading-more flex items-center justify-center py-4">
            <div class="animate-spin rounded-full h-6 w-6 border-2 border-primary-600 border-t-transparent"></div>
            <span class="ml-2 text-sm text-gray-500">Loading more...</span>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', loadingHTML);
}

function hideLoadingMore() {
    const loader = document.querySelector('.loading-more');
    if (loader) loader.remove();
}

function setupEventListeners() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }

    const filterBtn = document.getElementById('filter-btn');
    if (filterBtn) {
        filterBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const dropdown = document.getElementById('filter-dropdown');
            if (dropdown) {
                dropdown.classList.toggle('hidden');
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

async function loadCharacters() {
    showLoading();
    
    // Reset state for new search/filter
    App.filters.page = 1;
    App.characters = [];
    App.hasMore = true;
    App.isLoading = true;
    
    try {
        const params = new URLSearchParams();
        if (App.filters.name) params.append('name', App.filters.name);
        // Note: character filter (starred/others) is applied locally, not sent to API
        if (App.filters.species) params.append('species', App.filters.species);
        params.append('page', App.filters.page);

        const response = await fetch(`${App.api.characters}?${params}`);
        const data = await response.json();

        if (data.success && data.data.length > 0) {
            let characters = data.data;
            
            // Apply character filter locally (starred/others)
            if (App.filters.character === 'starred') {
                characters = characters.filter(c => isStarred(c.id));
            } else if (App.filters.character === 'others') {
                characters = characters.filter(c => !isStarred(c.id));
            }
            
            App.characters = characters;
            App.pagination = data.info;
            App.hasMore = App.filters.page < data.info.pages;
            
            if (characters.length > 0) {
                renderCharacters();
                
                if (!App.selectedCharacterId || !characters.find(c => c.id === App.selectedCharacterId)) {
                    selectCharacter(characters[0].id);
                }
            } else {
                showEmptyState();
            }
        } else {
            App.hasMore = false;
            showEmptyState();
        }
    } catch (error) {
        console.error('Error loading characters:', error);
        App.hasMore = false;
        showEmptyState();
    } finally {
        App.isLoading = false;
    }
}

function showLoading() {
    document.getElementById('loading-state')?.classList.remove('hidden');
    document.getElementById('characters-container')?.classList.add('hidden');
    document.getElementById('empty-state')?.classList.add('hidden');
}

function showEmptyState() {
    document.getElementById('loading-state')?.classList.add('hidden');
    document.getElementById('characters-container')?.classList.add('hidden');
    document.getElementById('empty-state')?.classList.remove('hidden');
}

function renderCharacters() {
    const container = document.getElementById('characters-container');
    if (!container) return;

    document.getElementById('loading-state')?.classList.add('hidden');
    document.getElementById('empty-state')?.classList.add('hidden');
    container.classList.remove('hidden');

    // Separate starred and non-starred characters
    const starredCharacters = App.characters.filter(c => isStarred(c.id));
    const regularCharacters = App.characters.filter(c => !isStarred(c.id));

    let html = '';

    // Starred Characters Section
    if (starredCharacters.length > 0) {
        html += `
            <div class="px-5 py-3">
                <h2 class="text-xs font-medium text-gray-500 uppercase tracking-wider">STARRED CHARACTERS (${starredCharacters.length})</h2>
            </div>
        `;
        html += starredCharacters.map(character => createCharacterCard(character)).join('');
    }

    // Regular Characters Section
    html += `
        <div class="px-5 py-3 ${starredCharacters.length > 0 ? 'mt-4 border-t border-gray-200' : ''}">
            <h2 class="text-xs font-medium text-gray-500 uppercase tracking-wider">CHARACTERS (${regularCharacters.length})</h2>
        </div>
    `;
    html += regularCharacters.map(character => createCharacterCard(character)).join('');

    container.innerHTML = html;

    // Add event listeners for character cards
    container.querySelectorAll('[data-character-id]').forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't select character if clicking on heart button
            if (e.target.closest('.heart-btn')) return;
            const id = parseInt(card.dataset.characterId);
            selectCharacter(id);
        });
    });

    // Add event listeners for heart buttons
    container.querySelectorAll('[data-heart-id]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.heartId);
            toggleStarred(id, e);
        });
    });
}

function createCharacterCard(character) {
    const isSelected = character.id === App.selectedCharacterId;
    const starred = isStarred(character.id);
    const heartButton = getHeartButton(character.id, starred);
    
    return `
        <div class="flex items-center gap-4 px-5 py-4 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-primary-100' : 'hover:bg-gray-100'}"
             data-character-id="${character.id}">
            <img src="${character.image}" 
                 alt="${character.name}" 
                 class="w-8 h-8 rounded-[20px] object-cover flex-shrink-0">
            <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-base text-gray-900 truncate">${character.name}</h3>
                <p class="text-sm text-gray-500 truncate">${character.species}</p>
            </div>
            ${heartButton}
        </div>
    `;
}

function getHeartButton(characterId, isStarred) {
    if (isStarred) {
        // Filled heart - starred
        return `
            <button class="heart-btn flex-shrink-0 p-1 transition-transform hover:scale-110" 
                    data-heart-id="${characterId}"
                    aria-label="Remove from favorites">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#53C62A" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#53C62A"/>
                </svg>
            </button>
        `;
    } else {
        // Outline heart - not starred
        return `
            <button class="heart-btn flex-shrink-0 p-1 transition-transform hover:scale-110" 
                    data-heart-id="${characterId}"
                    aria-label="Add to favorites">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="#53C62A" stroke-width="2" fill="none"/>
                </svg>
            </button>
        `;
    }
}

function getStatusBadge(status) {
    const badges = {
        'Alive': '<span class="badge-alive px-2 py-1 text-xs font-medium rounded text-white bg-secondary-600">Alive</span>',
        'Dead': '<span class="badge-dead px-2 py-1 text-xs font-medium rounded text-white bg-primary-700">Dead</span>',
        'unknown': '<span class="badge-unknown px-2 py-1 text-xs font-medium rounded text-white bg-gray-500">Unknown</span>'
    };
    return badges[status] || badges['unknown'];
}

function selectCharacter(id) {
    App.selectedCharacterId = id;
    
    document.querySelectorAll('[data-character-id]').forEach(card => {
        const cardId = parseInt(card.dataset.characterId);
        if (cardId === id) {
            card.classList.add('bg-primary-100');
            card.classList.remove('hover:bg-gray-100');
        } else {
            card.classList.remove('bg-primary-100');
            card.classList.add('hover:bg-gray-100');
        }
    });

    loadCharacterDetail(id);
}

async function loadCharacterDetail(id) {
    try {
        const response = await fetch(App.api.character(id));
        const data = await response.json();

        if (data.success && data.data) {
            renderCharacterDetail(data.data);
        }
    } catch (error) {
        console.error('Error loading character detail:', error);
    }
}

function renderCharacterDetail(character) {
    const detailPlaceholder = document.getElementById('detail-placeholder');
    const detailContainer = document.getElementById('character-detail');
    const mobileDetailContent = document.getElementById('mobile-detail-content');

    const detailHTML = createDetailHTML(character);

    if (detailPlaceholder) detailPlaceholder.classList.add('hidden');
    if (detailContainer) {
        detailContainer.classList.remove('hidden');
        detailContainer.innerHTML = detailHTML;
        
        // Add event listener for detail heart button
        const heartBtn = detailContainer.querySelector('[data-detail-heart-id]');
        if (heartBtn) {
            heartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(heartBtn.dataset.detailHeartId);
                toggleStarred(id, e);
            });
        }
        
        // Add event listener for delete button
        const deleteBtn = detailContainer.querySelector('[data-delete-id]');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                const id = parseInt(deleteBtn.dataset.deleteId);
                deleteCharacter(id, e);
            });
        }
    }

    if (mobileDetailContent) {
        mobileDetailContent.innerHTML = detailHTML;
        
        // Add event listener for mobile detail heart button
        const mobileHeartBtn = mobileDetailContent.querySelector('[data-detail-heart-id]');
        if (mobileHeartBtn) {
            mobileHeartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(mobileHeartBtn.dataset.detailHeartId);
                toggleStarred(id, e);
            });
        }
        
        // Add event listener for mobile delete button
        const mobileDeleteBtn = mobileDetailContent.querySelector('[data-delete-id]');
        if (mobileDeleteBtn) {
            mobileDeleteBtn.addEventListener('click', (e) => {
                const id = parseInt(mobileDeleteBtn.dataset.deleteId);
                deleteCharacter(id, e);
            });
        }
    }

    if (window.innerWidth < 1024) {
        const mobilePanel = document.getElementById('mobile-detail-panel');
        if (mobilePanel) {
            mobilePanel.classList.remove('hidden');
            mobilePanel.classList.add('flex');
        }
    }
}

function createDetailHTML(character) {
    const starred = isStarred(character.id);
    const heartIcon = starred 
        ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="#53C62A" xmlns="http://www.w3.org/2000/svg">
             <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#53C62A"/>
           </svg>`
        : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="#53C62A" stroke-width="2" fill="none"/>
           </svg>`;
    
    return `
        <div class="text-left">
            <!-- Image with heart button overlay -->
            <div class="relative inline-block mb-4">
                <img src="${character.image}" 
                     alt="${character.name}" 
                     style="width: 75px; height: 75px; border-radius: 500px; object-fit: cover;">
                <button class="detail-heart-btn absolute -bottom-1 -right-1 p-1 transition-transform hover:scale-110 bg-white rounded-full shadow-sm" 
                        data-detail-heart-id="${character.id}"
                        aria-label="${starred ? 'Remove from favorites' : 'Add to favorites'}">
                    ${heartIcon}
                </button>
            </div>
            
            <h2 class="text-2xl font-bold text-gray-900 mb-6">${character.name}</h2>
            
            <div class="space-y-4">
                <div class="py-3 border-b border-gray-200">
                    <span class="block text-gray-900 font-semibold">Specie</span>
                    <span class="block text-gray-500 font-normal">${character.species}</span>
                </div>
                <div class="py-3 border-b border-gray-200">
                    <span class="block text-gray-900 font-semibold">Gender</span>
                    <span class="block text-gray-500 font-normal">${character.gender}</span>
                </div>
                <div class="py-3 border-b border-gray-200">
                    <span class="block text-gray-900 font-semibold">Origin</span>
                    <span class="block text-gray-500 font-normal">${character.origin?.name || 'Unknown'}</span>
                </div>
                <div class="py-3 border-b border-gray-200">
                    <span class="block text-gray-900 font-semibold">Location</span>
                    <span class="block text-gray-500 font-normal">${character.location?.name || 'Unknown'}</span>
                </div>
            </div>
            
            <!-- Delete button -->
            <div class="mt-6 pt-4 border-t border-gray-200">
                <button class="delete-btn w-full py-2 px-4 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                        data-delete-id="${character.id}">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/>
                    </svg>
                    Delete Character
                </button>
            </div>
        </div>
    `;
}

function renderPagination() {
    const container = document.getElementById('pagination');
    if (!container || !App.pagination) return;

    const { pages } = App.pagination;
    const currentPage = App.filters.page;

    if (pages <= 1) {
        container.innerHTML = '';
        return;
    }

    let paginationHTML = '<div class="flex items-center justify-center gap-2">';
    
    // Previous button
    paginationHTML += `
        <button onclick="goToPage(${currentPage - 1})" 
                ${currentPage === 1 ? 'disabled' : ''}
                class="px-3 py-2 rounded-lg text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100'}">
            ←
        </button>
    `;

    // Page numbers
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(pages, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <button onclick="goToPage(${i})"
                    class="w-10 h-10 rounded-lg text-sm font-medium ${i === currentPage ? 'bg-primary-100 text-primary-600' : 'text-gray-500 hover:bg-gray-100'}">
                ${i}
            </button>
        `;
    }

    // Next button
    paginationHTML += `
        <button onclick="goToPage(${currentPage + 1})"
                ${currentPage === pages ? 'disabled' : ''}
                class="px-3 py-2 rounded-lg text-sm font-medium ${currentPage === pages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100'}">
            →
        </button>
    `;

    paginationHTML += '</div>';
    container.innerHTML = paginationHTML;
}

function goToPage(page) {
    if (page < 1 || (App.pagination && page > App.pagination.pages)) return;
    App.filters.page = page;
    App.selectedCharacterId = null;
    loadCharacters();
}

function handleSearch(e) {
    App.filters.name = e.target.value;
    App.selectedCharacterId = null;
    loadCharacters();
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
        btn.disabled = false;
        const hasFilters = App.filters.character || App.filters.species;

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
    App.selectedCharacterId = null;
    closeFilterModal();
    loadCharacters();
}

function closeMobileDetail() {
    const panel = document.getElementById('mobile-detail-panel');
    if (panel) {
        panel.classList.add('hidden');
        panel.classList.remove('flex');
    }
}

document.addEventListener('DOMContentLoaded', init);