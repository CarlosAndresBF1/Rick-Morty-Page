import { UIHelpers } from './ui.js';

/**
 * Character Card and Detail HTML Templates
 */
export class CharacterTemplates {
    /**
     * Create heart button HTML
     */
    static getHeartButton(characterId, isStarred) {
        if (isStarred) {
            return `
                <button class="heart-btn flex-shrink-0 w-8 h-8 bg-white flex items-center justify-center transition-transform hover:scale-110 shadow-sm" 
                        style="border-radius: 50%;"
                        data-heart-id="${characterId}"
                        aria-label="Remove from favorites">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#53C62A" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#53C62A"/>
                    </svg>
                </button>
            `;
        } else {
            return `
                <button class="heart-btn flex-shrink-0 w-8 h-8 bg-white flex items-center justify-center transition-transform hover:scale-110 shadow-sm" 
                        style="border-radius: 50%;"
                        data-heart-id="${characterId}"
                        aria-label="Add to favorites">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="#53C62A" stroke-width="2" fill="none"/>
                    </svg>
                </button>
            `;
        }
    }

    /**
     * Create character card HTML
     */
    static createCharacterCard(character, isSelected, isStarred) {
        const heartButton = this.getHeartButton(character.id, isStarred);
        
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

    /**
     * Create detail panel HTML
     */
    static createDetailHTML(character, isStarred) {
        const heartIcon = isStarred 
            ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="#53C62A" xmlns="http://www.w3.org/2000/svg">
                 <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#53C62A"/>
               </svg>`
            : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="#53C62A" stroke-width="2" fill="none"/>
               </svg>`;
        
        return `
            <div class="text-left">
                <!-- Image with heart button overlay -->
                <div class="relative mb-4" style="width: 75px; height: 75px;">
                    <img src="${character.image}" 
                         alt="${character.name}" 
                         class="w-full h-full object-cover"
                         style="border-radius: 500px;">
                    <button class="detail-heart-btn absolute w-8 h-8 flex items-center justify-center transition-transform hover:scale-110 bg-white shadow-sm" 
                            style="bottom: -12px; right: 0; border-radius: 50%;"
                            data-detail-heart-id="${character.id}"
                            aria-label="${isStarred ? 'Remove from favorites' : 'Add to favorites'}">
                        ${heartIcon}
                    </button>
                </div>
                
                <h2 class="text-2xl font-bold text-gray-900 mb-6">${character.name}</h2>
                
                <div class="space-y-4 mb-6">
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
                <div>
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
}

/**
 * Character Rendering Functions
 */
export class CharacterRenderer {
    constructor(state) {
        this.state = state;
    }

    /**
     * Render all characters in the list
     */
    renderCharacters() {
        const container = document.getElementById('characters-container');
        if (!container) return;

        UIHelpers.showCharacters();

        const starredCharacters = this.state.characters.filter(c => this.state.isStarred(c.id));
        const regularCharacters = this.state.characters.filter(c => !this.state.isStarred(c.id));

        let html = '';

        if (starredCharacters.length > 0) {
            html += `
                <div class="px-5 py-3">
                    <h2 class="text-xs font-medium text-gray-500 uppercase tracking-wider">STARRED CHARACTERS (${starredCharacters.length})</h2>
                </div>
            `;
            html += starredCharacters.map(character => 
                CharacterTemplates.createCharacterCard(
                    character,
                    character.id === this.state.selectedCharacterId,
                    this.state.isStarred(character.id)
                )
            ).join('');
        }

        html += `
            <div class="px-5 py-3 ${starredCharacters.length > 0 ? 'mt-4 border-t border-gray-200' : ''}">
                <h2 class="text-xs font-medium text-gray-500 uppercase tracking-wider">CHARACTERS (${regularCharacters.length})</h2>
            </div>
        `;
        html += regularCharacters.map(character => 
            CharacterTemplates.createCharacterCard(
                character,
                character.id === this.state.selectedCharacterId,
                this.state.isStarred(character.id)
            )
        ).join('');

        container.innerHTML = html;
    }

    /**
     * Render character detail panel
     */
    renderCharacterDetail(character) {
        const detailPlaceholder = document.getElementById('detail-placeholder');
        const detailContainer = document.getElementById('character-detail');
        const mobileDetailContent = document.getElementById('mobile-detail-content');

        const detailHTML = CharacterTemplates.createDetailHTML(
            character,
            this.state.isStarred(character.id)
        );

        if (detailPlaceholder) detailPlaceholder.classList.add('hidden');
        if (detailContainer) {
            detailContainer.classList.remove('hidden');
            detailContainer.innerHTML = detailHTML;
        }

        if (mobileDetailContent) {
            mobileDetailContent.innerHTML = detailHTML;
        }

        UIHelpers.showMobileDetail();
    }

    /**
     * Update character selection UI
     */
    updateSelection(characterId) {
        document.querySelectorAll('[data-character-id]').forEach(card => {
            const cardId = parseInt(card.dataset.characterId);
            if (cardId === characterId) {
                card.classList.add('bg-primary-100');
                card.classList.remove('hover:bg-gray-100');
            } else {
                card.classList.remove('bg-primary-100');
                card.classList.add('hover:bg-gray-100');
            }
        });
    }
}
