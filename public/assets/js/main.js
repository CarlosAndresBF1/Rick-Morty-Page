import { API, ApiClient } from './api.js';
import { AppState } from './state.js';
import { UIHelpers } from './ui.js';
import { CharacterRenderer } from './characters.js';

/**
 * Main Application Controller
 */
class App {
    constructor() {
        this.state = new AppState();
        this.renderer = new CharacterRenderer(this.state);
    }

    /**
     * Initialize application
     */
    async init() {
        await this.loadStarredFromServer();
        this.setupEventListeners();
        this.setupInfiniteScroll();
        this.loadCharacters();
    }

    /**
     * Load starred characters from server
     */
    async loadStarredFromServer() {
        try {
            const data = await ApiClient.get(API.starred);
            if (data.success) {
                this.state.starredIds = data.data.map(id => parseInt(id));
            }
        } catch (e) {
            console.error('Error loading starred characters:', e);
            this.state.starredIds = [];
        }
    }

    /**
     * Toggle starred status for a character
     */
    async toggleStarred(characterId, event) {
        if (event) event.stopPropagation();
        
        try {
            const data = await ApiClient.post(API.toggleStar(characterId));
            
            if (data.success) {
                if (data.starred) {
                    this.state.addStarred(characterId);
                } else {
                    this.state.removeStarred(characterId);
                }
                
                this.renderer.renderCharacters();
                
                if (this.state.selectedCharacterId === characterId) {
                    const character = this.state.characters.find(c => c.id === characterId);
                    if (character) {
                        this.renderer.renderCharacterDetail(character);
                        this.attachDetailEventListeners();
                    }
                }
            }
        } catch (e) {
            console.error('Error toggling starred:', e);
        }
    }

    /**
     * Delete a character (soft delete)
     */
    async deleteCharacter(characterId, event) {
        if (event) event.stopPropagation();
        
        if (!confirm('Are you sure you want to delete this character?')) {
            return;
        }
        
        try {
            const data = await ApiClient.delete(API.deleteChar(characterId));
            
            if (data.success) {
                this.state.removeCharacter(characterId);
                this.state.removeStarred(characterId);
                
                if (this.state.selectedCharacterId === characterId) {
                    this.state.selectedCharacterId = null;
                    if (this.state.characters.length > 0) {
                        this.selectCharacter(this.state.characters[0].id);
                    } else {
                        const detailContainer = document.getElementById('character-detail');
                        const detailPlaceholder = document.getElementById('detail-placeholder');
                        if (detailContainer) detailContainer.classList.add('hidden');
                        if (detailPlaceholder) detailPlaceholder.classList.remove('hidden');
                    }
                }
                
                this.renderer.renderCharacters();
                this.attachListEventListeners();
            }
        } catch (e) {
            console.error('Error deleting character:', e);
        }
    }

    /**
     * Setup infinite scroll
     */
    setupInfiniteScroll() {
        const listContainer = document.getElementById('character-list');
        if (!listContainer) return;
        
        listContainer.addEventListener('scroll', UIHelpers.debounce(() => {
            if (this.state.isLoading || !this.state.hasMore) return;
            
            const { scrollTop, scrollHeight, clientHeight } = listContainer;
            if (scrollTop + clientHeight >= scrollHeight - 100) {
                this.loadMoreCharacters();
            }
        }, 100));
    }

    /**
     * Load more characters (infinite scroll)
     */
    async loadMoreCharacters() {
        if (this.state.isLoading || !this.state.hasMore) return;
        
        this.state.filters.page += 1;
        this.state.isLoading = true;
        
        UIHelpers.showLoadingMore();
        
        try {
            const params = this.state.getQueryParams();
            const data = await ApiClient.get(`${API.characters}?${params}`);

            if (data.success && data.data.length > 0) {
                let characters = this.state.applyCharacterFilter(data.data);
                
                this.state.characters = [...this.state.characters, ...characters];
                this.state.pagination = data.info;
                this.state.hasMore = this.state.filters.page < data.info.pages;
                
                this.renderer.renderCharacters();
                this.attachListEventListeners();
            } else {
                this.state.hasMore = false;
            }
        } catch (error) {
            console.error('Error loading more characters:', error);
            this.state.hasMore = false;
        } finally {
            this.state.isLoading = false;
            UIHelpers.hideLoadingMore();
        }
    }

    /**
     * Load characters
     */
    async loadCharacters() {
        UIHelpers.showLoading();
        
        this.state.resetPagination();
        
        try {
            const params = this.state.getQueryParams();
            const data = await ApiClient.get(`${API.characters}?${params}`);

            if (data.success && data.data.length > 0) {
                let characters = this.state.applyCharacterFilter(data.data);
                
                this.state.characters = characters;
                this.state.pagination = data.info;
                this.state.hasMore = this.state.filters.page < data.info.pages;
                
                if (characters.length > 0) {
                    this.renderer.renderCharacters();
                    this.attachListEventListeners();
                    
                    if (!this.state.selectedCharacterId || !characters.find(c => c.id === this.state.selectedCharacterId)) {
                        this.selectCharacter(characters[0].id);
                    }
                } else {
                    UIHelpers.showEmptyState();
                }
            } else {
                this.state.hasMore = false;
                UIHelpers.showEmptyState();
            }
        } catch (error) {
            console.error('Error loading characters:', error);
            this.state.hasMore = false;
            UIHelpers.showEmptyState();
        } finally {
            this.state.isLoading = false;
        }
    }

    /**
     * Select a character
     */
    selectCharacter(id) {
        this.state.selectedCharacterId = id;
        this.renderer.updateSelection(id);
        this.loadCharacterDetail(id);
    }

    /**
     * Load character detail
     */
    async loadCharacterDetail(id) {
        try {
            const data = await ApiClient.get(API.character(id));

            if (data.success && data.data) {
                this.renderer.renderCharacterDetail(data.data);
                this.attachDetailEventListeners();
            }
        } catch (error) {
            console.error('Error loading character detail:', error);
        }
    }

    /**
     * Attach event listeners to character list
     */
    attachListEventListeners() {
        const container = document.getElementById('characters-container');
        if (!container) return;

        container.querySelectorAll('[data-character-id]').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('.heart-btn')) return;
                const id = parseInt(card.dataset.characterId);
                this.selectCharacter(id);
            });
        });

        container.querySelectorAll('[data-heart-id]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.heartId);
                this.toggleStarred(id, e);
            });
        });
    }

    /**
     * Attach event listeners to detail panel
     */
    attachDetailEventListeners() {
        const detailContainer = document.getElementById('character-detail');
        const mobileDetailContent = document.getElementById('mobile-detail-content');

        [detailContainer, mobileDetailContent].forEach(container => {
            if (!container) return;

            const heartBtn = container.querySelector('[data-detail-heart-id]');
            if (heartBtn) {
                heartBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const id = parseInt(heartBtn.dataset.detailHeartId);
                    this.toggleStarred(id, e);
                });
            }

            const deleteBtn = container.querySelector('[data-delete-id]');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    const id = parseInt(deleteBtn.dataset.deleteId);
                    this.deleteCharacter(id, e);
                });
            }
        });
    }

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', UIHelpers.debounce((e) => {
                this.state.filters.name = e.target.value;
                this.state.selectedCharacterId = null;
                this.loadCharacters();
            }, 300));
        }

        // Filter button
        const filterBtn = document.getElementById('filter-btn');
        if (filterBtn) {
            filterBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const dropdown = document.getElementById('filter-dropdown');
                if (dropdown) {
                    dropdown.classList.toggle('hidden');
                }
            });
        }

        // Filter options
        document.querySelectorAll('.filter-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const button = e.currentTarget;
                const filter = button.dataset.filter;
                const value = button.dataset.value;

                const container = button.parentElement;
                container.querySelectorAll('.filter-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                button.classList.add('selected');

                this.state.filters[filter] = value;
                
                const hasFilters = this.state.filters.character || this.state.filters.species;
                UIHelpers.updateApplyButton(hasFilters);
            });
        });

        // Apply filters button
        const applyFiltersBtn = document.getElementById('apply-filters-btn');
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => {
                this.state.selectedCharacterId = null;
                UIHelpers.closeFilterModal();
                this.loadCharacters();
            });
        }

        // Back button (mobile)
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', UIHelpers.closeMobileDetail);
        }

        // Close filter dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('filter-dropdown');
            const filterBtn = document.getElementById('filter-btn');
            if (dropdown && filterBtn && !dropdown.contains(e.target) && !filterBtn.contains(e.target)) {
                dropdown.classList.add('hidden');
            }
        });
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});
