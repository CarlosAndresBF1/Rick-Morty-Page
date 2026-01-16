/**
 * UI Utilities and Helper Functions
 */
export class UIHelpers {
    /**
     * Debounce function for event handling
     */
    static debounce(func, wait) {
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

    /**
     * Show loading state
     */
    static showLoading() {
        document.getElementById('loading-state')?.classList.remove('hidden');
        document.getElementById('characters-container')?.classList.add('hidden');
        document.getElementById('empty-state')?.classList.add('hidden');
    }

    /**
     * Show empty state
     */
    static showEmptyState() {
        document.getElementById('loading-state')?.classList.add('hidden');
        document.getElementById('characters-container')?.classList.add('hidden');
        document.getElementById('empty-state')?.classList.remove('hidden');
    }

    /**
     * Hide loading state and show characters
     */
    static showCharacters() {
        const container = document.getElementById('characters-container');
        if (!container) return;

        document.getElementById('loading-state')?.classList.add('hidden');
        document.getElementById('empty-state')?.classList.add('hidden');
        container.classList.remove('hidden');
    }

    /**
     * Show loading more indicator
     */
    static showLoadingMore() {
        const container = document.getElementById('characters-container');
        if (!container) return;
        
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

    /**
     * Hide loading more indicator
     */
    static hideLoadingMore() {
        const loader = document.querySelector('.loading-more');
        if (loader) loader.remove();
    }

    /**
     * Close filter dropdown
     */
    static closeFilterModal() {
        const dropdown = document.getElementById('filter-dropdown');
        if (dropdown) {
            dropdown.classList.add('hidden');
        }
    }

    /**
     * Close mobile detail panel
     */
    static closeMobileDetail() {
        const panel = document.getElementById('mobile-detail-panel');
        if (panel) {
            panel.classList.add('hidden');
            panel.classList.remove('flex');
        }
    }

    /**
     * Show mobile detail panel
     */
    static showMobileDetail() {
        if (window.innerWidth < 1024) {
            const mobilePanel = document.getElementById('mobile-detail-panel');
            if (mobilePanel) {
                mobilePanel.classList.remove('hidden');
                mobilePanel.classList.add('flex');
            }
        }
    }

    /**
     * Update apply filters button state
     */
    static updateApplyButton(hasFilters) {
        const btn = document.getElementById('apply-filters-btn');
        if (btn) {
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
}
