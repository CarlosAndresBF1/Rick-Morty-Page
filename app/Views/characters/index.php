 <div class="min-h-screen flex flex-col lg:flex-row">
     <!-- Left Sidebar: Character List -->
     <aside class="w-full lg:w-[400px] xl:w-[480px] flex-shrink-0 flex flex-col h-screen lg:h-screen"
         style="background-color: #FDFDFD; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);"
         id="list-panel">
         
         <?php include __DIR__ . '/_header.php'; ?>
         
         <?php include __DIR__ . '/_search-filter.php'; ?>
         
         <?php include __DIR__ . '/_character-list.php'; ?>

     </aside>

     <!-- Right Panel: Character Detail (Desktop) -->
     <?php include __DIR__ . '/_detail-panel.php'; ?>

     <!-- Mobile Detail Panel -->
     <?php include __DIR__ . '/_mobile-detail.php'; ?>

 </div>

 <?php include __DIR__ . '/_styles.php'; ?>
