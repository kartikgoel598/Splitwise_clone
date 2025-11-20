// // Activity Page - Minimized
// document.addEventListener('DOMContentLoaded', function() {
    
//     console.log('Activity page loaded! 📊');
    
//     // Elements
//     const exportModal = document.getElementById('exportModal');
//     const exportForm = document.getElementById('exportForm');
//     const searchInput = document.getElementById('searchInput');
//     const activityItems = document.querySelectorAll('.activity-item');
//     const noResults = document.getElementById('noResults');
//     const filterButtons = document.querySelectorAll('.filter-btn');
    
//     let currentFilter = 'all';
    
//     // Modal handlers
//     const modalBtns = {
//         'openExportModal': () => {
//             exportModal.style.display = 'flex';
//             document.getElementById('endDate').value = new Date().toISOString().split('T')[0];
//         },
//         'closeExportModal': () => closeModal(),
//         'cancelExport': () => closeModal()
//     };
    
//     Object.keys(modalBtns).forEach(id => {
//         const btn = document.getElementById(id);
//         if (btn) btn.onclick = modalBtns[id];
//     });
    
//     function closeModal() {
//         exportModal.style.display = 'none';
//         if (exportForm) exportForm.reset();
//     }
    
//     // Export form
//     if (exportForm) {
//         exportForm.onsubmit = (e) => {
//             e.preventDefault();
//             const submitBtn = exportForm.querySelector('.btn-submit');
//             submitBtn.textContent = '⏳ Generating...';
//             submitBtn.disabled = true;
            
//             setTimeout(() => {
//                 const format = document.querySelector('input[name="format"]:checked').value;
//                 const emailExport = document.getElementById('emailExport').checked;
                
//                 submitBtn.textContent = '📥 Download Export';
//                 submitBtn.disabled = false;
                
//                 alert(`✅ Export ${emailExport ? 'emailed' : 'downloaded'}!\n\nFormat: ${format.toUpperCase()}\n\n(Backend pending)`);
//                 closeModal();
//             }, 2000);
//         };
//     }
    
//     // Filter & Search
//     function updateView() {
//         const search = searchInput ? searchInput.value.toLowerCase() : '';
//         let visible = 0;
        
//         activityItems.forEach(item => {
//             const type = item.dataset.type;
//             const text = item.textContent.toLowerCase();
//             const show = (currentFilter === 'all' || type === currentFilter) && 
//                          (!search || text.includes(search));
            
//             item.style.display = show ? 'flex' : 'none';
//             if (show) visible++;
//         });
        
//         if (noResults) noResults.style.display = visible ? 'none' : 'block';
//     }
    
//     // Search
//     if (searchInput) searchInput.oninput = updateView;
    
//     // Filters
//     filterButtons.forEach(btn => {
//         btn.onclick = function() {
//             filterButtons.forEach(b => b.classList.remove('active'));
//             this.classList.add('active');
//             currentFilter = this.dataset.filter;
//             updateView();
//         };
//     });
    
//     // Item click
//     activityItems.forEach(item => {
//         item.onclick = function() {
//             const title = this.querySelector('.activity-title').textContent;
//             const amount = this.querySelector('.activity-amount').textContent;
//             alert(`Transaction Details\n\n${title}\nAmount: ${amount}\n\n(Detailed view coming soon!)`);
//         };
//     });
    
//     // Modal close handlers
//     if (exportModal) {
//         exportModal.onclick = (e) => {
//             if (e.target === exportModal) closeModal();
//         };
//     }
    
//     // ESC & Keyboard shortcuts
//     document.onkeydown = (e) => {
//         if (e.key === 'Escape' && exportModal && exportModal.style.display === 'flex') {
//             closeModal();
//         }
//         if ((e.ctrlKey || e.metaKey) && e.key === 'f' && searchInput) {
//             e.preventDefault();
//             searchInput.focus();
//         }
//     };
    
//     // Stats (optional)
//     function logStats() {
//         let owe = 0, owed = 0, settled = 0;
//         activityItems.forEach(item => {
//             const type = item.dataset.type;
//             const amount = parseFloat(item.querySelector('.activity-amount').textContent.replace(/[^0-9.-]/g, ''));
//             if (type === 'owe') owe += amount;
//             else if (type === 'owed') owed += amount;
//             else if (type === 'settled') settled++;
//         });
//         console.log(`Stats: ${activityItems.length} transactions | Owe: $${owe.toFixed(2)} | Owed: $${owed.toFixed(2)} | Settled: ${settled}`);
//     }
    
//     logStats();
// });