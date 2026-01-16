<div class="p-4 lg:p-5 relative">
    <div class="relative">
        <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none z-10"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input type="text" id="search-input" placeholder="Search or filter results"
            class="w-full h-[52px] pl-12 pr-14 bg-gray-100 rounded-lg text-sm font-medium text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
            value="<?= e($filters['name'] ?? '') ?>">
        <button type="button" id="filter-btn"
            class="absolute right-2 top-1/2 -translate-y-1/2 w-[38px] h-[38px] flex items-center justify-center bg-primary-100 rounded-lg hover:bg-primary-200 transition-colors z-10"
            aria-label="Open filters">
            <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
        </button>
    </div>

    <!-- Filter Dropdown -->
    <?php include __DIR__ . '/_filter-dropdown.php'; ?>
</div>
