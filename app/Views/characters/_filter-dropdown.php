<div class="hidden absolute left-4 right-4 top-full mt-2 bg-white rounded-lg shadow-dropdown z-50 border border-gray-200"
    id="filter-dropdown">
    <div class="p-4 space-y-6">
        <div>
            <label class="block text-sm font-medium text-gray-500 mb-3">Character</label>
            <div class="flex flex-wrap gap-2" id="character-filters">
                <button type="button" data-filter="character" data-value=""
                    class="filter-option selected">All</button>
                <button type="button" data-filter="character" data-value="starred"
                    class="filter-option">Starred</button>
                <button type="button" data-filter="character" data-value="others"
                    class="filter-option">Others</button>
            </div>
        </div>
        <div>
            <label class="block text-sm font-medium text-gray-500 mb-3">Species</label>
            <div class="flex flex-wrap gap-2" id="species-filters">
                <button type="button" data-filter="species" data-value=""
                    class="filter-option selected">All</button>
                <button type="button" data-filter="species" data-value="Human"
                    class="filter-option">Human</button>
                <button type="button" data-filter="species" data-value="Alien"
                    class="filter-option">Alien</button>
                <button type="button" data-filter="species" data-value="Humanoid"
                    class="filter-option">Humanoid</button>
                <button type="button" data-filter="species" data-value="Robot"
                    class="filter-option">Robot</button>
            </div>
        </div>
    </div>

    <footer class="p-4 border-t border-gray-200">
        <button type="button" id="apply-filters-btn"
            class="w-full h-[38px] bg-gray-100 text-gray-500 font-medium text-sm rounded-lg hover:bg-primary-100 hover:text-primary-600 transition-colors disabled:opacity-50"
            disabled>
            Filter
        </button>
    </footer>
</div>