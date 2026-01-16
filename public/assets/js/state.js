/**
 * Application State Management
 */
export class AppState {
    constructor() {
        this.filters = {
            name: '',
            character: '',
            species: '',
            page: 1
        };
        this.selectedCharacterId = null;
        this.characters = [];
        this.starredIds = [];
        this.pagination = null;
        this.isLoading = false;
        this.hasMore = true;
    }

    /**
     * Reset pagination state
     */
    resetPagination() {
        this.filters.page = 1;
        this.characters = [];
        this.hasMore = true;
        this.isLoading = false;
    }

    /**
     * Check if a character is starred
     */
    isStarred(characterId) {
        return this.starredIds.includes(characterId);
    }

    /**
     * Add character to starred list
     */
    addStarred(characterId) {
        if (!this.starredIds.includes(characterId)) {
            this.starredIds.push(characterId);
        }
    }

    /**
     * Remove character from starred list
     */
    removeStarred(characterId) {
        const index = this.starredIds.indexOf(characterId);
        if (index > -1) {
            this.starredIds.splice(index, 1);
        }
    }

    /**
     * Remove character from characters list
     */
    removeCharacter(characterId) {
        this.characters = this.characters.filter(c => c.id !== characterId);
    }

    /**
     * Apply character filter locally (starred/others)
     */
    applyCharacterFilter(characters) {
        if (this.filters.character === 'starred') {
            return characters.filter(c => this.isStarred(c.id));
        } else if (this.filters.character === 'others') {
            return characters.filter(c => !this.isStarred(c.id));
        }
        return characters;
    }

    /**
     * Get query parameters for API requests
     */
    getQueryParams() {
        const params = new URLSearchParams();
        if (this.filters.name) params.append('name', this.filters.name);
        if (this.filters.species) params.append('species', this.filters.species);
        params.append('page', this.filters.page);
        return params;
    }
}
