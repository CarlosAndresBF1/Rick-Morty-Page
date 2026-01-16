 <div class="min-h-screen flex flex-col lg:flex-row">
     <aside
         class="w-full lg:w-[400px] xl:w-[480px] flex-shrink-0 border-r border-gray-200 flex flex-col h-screen lg:h-screen"
         id="list-panel">
         <header class="p-4 lg:p-5 border-b border-gray-200">
             <h1 class="text-2xl font-bold text-gray-900 leading-8">Rick & Morty</h1>
         </header>
         <div class="p-4 lg:p-5 border-b border-gray-200 relative">
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

             <!-- Filter Dropdown (positioned below search bar) -->
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
         </div>

         <div class="flex-1 overflow-y-auto" id="character-list">
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
             <div class="p-4 lg:p-5 space-y-2 hidden" id="characters-container">
             </div>

             <div class="p-4 lg:p-5 hidden" id="empty-state">
                 <div class="text-center py-12">
                     <div class="text-6xl mb-4">🔍</div>
                     <h3 class="text-lg font-semibold text-gray-900 mb-2">No characters found</h3>
                     <p class="text-gray-500">Try adjusting your search or filters</p>
                 </div>
             </div>
         </div>

     </aside>

     <section class="flex-1 hidden lg:flex flex-col h-screen overflow-y-auto bg-gray-50" id="detail-panel">

         <div class="flex-1 flex items-center justify-center" id="detail-content">
             <div class="text-center text-gray-500" id="detail-placeholder">
                 <p class="text-lg font-medium">Detail</p>
             </div>

             <div class="hidden w-full max-w-2xl mx-auto p-8" id="character-detail">
             </div>
         </div>

     </section>

     <section class="fixed inset-0 bg-white z-50 hidden lg:hidden flex-col" id="mobile-detail-panel">
         <header class="p-4 border-b border-gray-200">
             <button type="button" id="back-btn" class="flex items-center gap-2 text-primary-600 font-medium">
                 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                 </svg>
                 Back
             </button>
         </header>

         <div class="flex-1 overflow-y-auto p-4" id="mobile-detail-content">
         </div>
     </section>

 </div>

 <style>
     .filter-option {
         padding: 9px 17px;
         border-radius: 8px;
         border: 1px solid #E5E7EB;
         background: #FFFFFF;
         font-weight: 500;
         font-size: 14px;
         line-height: 20px;
         text-align: center;
         color: #6B7280;
         transition: all 0.2s;
     }

     .filter-option:hover {
         border-color: #8054C7;
     }

     .filter-option.selected {
         background: #EEE3FF;
         border-color: #EEE3FF;
         color: #8054C7;
         font-weight: 600;
     }
 </style>