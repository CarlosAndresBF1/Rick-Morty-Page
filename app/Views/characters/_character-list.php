<div class="flex-1 overflow-y-auto scrollbar-hide" id="character-list">
    <!-- Loading State -->
    <div class="p-4 lg:p-5 space-y-2" id="loading-state">
        <?php for ($i = 0; $i < 8; $i++): ?>
            <div class="animate-pulse flex items-center gap-4 px-5 py-4 bg-primary-100 rounded-lg">
                <div class="w-8 h-8 bg-primary-200 rounded-[20px]"></div>
                <div class="flex-1 space-y-2">
                    <div class="h-4 bg-primary-200 rounded w-3/4"></div>
                    <div class="h-3 bg-primary-200 rounded w-1/2"></div>
                </div>
            </div>
        <?php endfor; ?>
    </div>

    <!-- Characters Container -->
    <div class="p-4 lg:p-5 space-y-2 hidden" id="characters-container">
    </div>

    <!-- Empty State -->
    <div class="p-4 lg:p-5 hidden" id="empty-state">
        <div class="text-center py-12">
            <div class="text-6xl mb-4">🔍</div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">No characters found</h3>
            <p class="text-gray-500">Try adjusting your search or filters</p>
        </div>
    </div>
</div>