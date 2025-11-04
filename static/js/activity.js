// page load hone ke baad code run hoga
document.addEventListener('DOMContentLoaded', function() {
    
    console.log('Activity page loaded! 📊');
    
    // ===== ELEMENTS SELECT KIYE =====
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const activityItems = document.querySelectorAll('.activity-item');
    const noResults = document.getElementById('noResults');
    const exportBtn = document.getElementById('exportBtn');
    
    // current active filter track karne ke liye
    let currentFilter = 'all';
    
    // ===== SEARCH FUNCTIONALITY =====
    if (searchInput) {
        // har keystroke pe search run hoga
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase(); // lowercase me convert kiya
            console.log('Searching for:', searchTerm);
            
            // search aur filter dono apply karenge
            filterAndSearch(currentFilter, searchTerm);
        });
    }
    
    // ===== FILTER BUTTONS FUNCTIONALITY =====
    filterButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            // pehle sab buttons se active class hata di
            filterButtons.forEach(b => b.classList.remove('active'));
            
            // is button ko active banaya
            this.classList.add('active');
            
            // filter value nikali data attribute se
            currentFilter = this.getAttribute('data-filter');
            console.log('Filter changed to:', currentFilter);
            
            // search input me jo hai wo bhi consider karenge
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
            
            // filter apply kiya
            filterAndSearch(currentFilter, searchTerm);
        });
    });
    
    // ===== MAIN FILTER AND SEARCH FUNCTION =====
    function filterAndSearch(filter, searchTerm) {
        let visibleCount = 0; // kitne items visible hain count karne ke liye
        
        activityItems.forEach(function(item) {
            // item ka type nikala (owe/owed/settled)
            const itemType = item.getAttribute('data-type');
            
            // item ka text content nikala searching ke liye
            const itemText = item.textContent.toLowerCase();
            
            // check kiya - filter match karta hai ya nahi
            const matchesFilter = filter === 'all' || itemType === filter;
            
            // check kiya - search term match karta hai ya nahi
            const matchesSearch = searchTerm === '' || itemText.includes(searchTerm);
            
            // dono conditions true hain to dikhayen
            if (matchesFilter && matchesSearch) {
                item.style.display = 'flex'; // visible
                visibleCount++;
            } else {
                item.style.display = 'none'; // hidden
            }
        });
        
        // agar koi item nahi dikha to "no results" message show karo
        if (visibleCount === 0) {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }
        
        console.log(`Visible items: ${visibleCount}/${activityItems.length}`);
    }
    
    // ===== ACTIVITY ITEM CLICK FUNCTIONALITY =====
    activityItems.forEach(function(item) {
        item.addEventListener('click', function() {
            // transaction details nikale
            const title = this.querySelector('.activity-title').textContent;
            const amount = this.querySelector('.activity-amount').textContent;
            const group = this.querySelector('.activity-group').textContent;
            const date = this.querySelector('.activity-date').textContent;
            
            console.log('Activity clicked:', title);
            
            // detail modal ya page khulega future me
            alert(`Transaction Details\n\n${title}\nAmount: ${amount}\n${group}\n${date}\n\n(Detailed view coming soon!)`);
            
            // future me ye line use karenge
            // openTransactionDetail(transactionId);
        });
    });
    
    // // ===== EXPORT BUTTON FUNCTIONALITY =====
    // if (exportBtn) {
    //     exportBtn.addEventListener('click', function() {
    //         console.log('Export button clicked');
            
    //         // future me CSV/PDF export functionality
    //         alert('Export feature coming soon! 📥\n\nYou will be able to export:\n• CSV format\n• PDF report\n• Excel spreadsheet\n• Date range selection');
            
    //         // future implementation
    //         // exportTransactions('csv');
    //     });
    // }
    
    // ===== CALCULATE STATISTICS =====
    // optional - page load pe statistics calculate kar sakte hain
    function calculateStats() {
        let totalOwe = 0;
        let totalOwed = 0;
        let settledCount = 0;
        
        activityItems.forEach(function(item) {
            const type = item.getAttribute('data-type');
            const amountText = item.querySelector('.activity-amount').textContent;
            const amount = parseFloat(amountText.replace(/[^0-9.-]+/g, '')); // sirf number nikala
            
            if (type === 'owe') {
                totalOwe += amount;
            } else if (type === 'owed') {
                totalOwed += amount;
            } else if (type === 'settled') {
                settledCount++;
            }
        });
        
        // console me stats print kiye
        console.log('Activity Statistics:');
        console.log(`Total transactions: ${activityItems.length}`);
        console.log(`You owe: $${totalOwe.toFixed(2)}`);
        console.log(`You are owed: $${totalOwed.toFixed(2)}`);
        console.log(`Settled transactions: ${settledCount}`);
        
        return {
            total: activityItems.length,
            owe: totalOwe,
            owed: totalOwed,
            settled: settledCount
        };
    }
    
    // page load pe stats calculate kiye
    calculateStats();
    
    // ===== KEYBOARD SHORTCUTS =====
    document.addEventListener('keydown', function(e) {
        // Ctrl+F or Cmd+F - search box pe focus
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault(); // browser ka default search mat kholo
            if (searchInput) {
                searchInput.focus(); // search input pe focus
            }
        }
    });
    
});
// Activity Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    console.log('Activity page loaded! 📊');
    
    // ===== EXPORT MODAL =====
    const openExportBtn = document.getElementById('openExportModal');
    const exportModal = document.getElementById('exportModal');
    const closeExportBtn = document.getElementById('closeExportModal');
    const cancelExportBtn = document.getElementById('cancelExport');
    const exportForm = document.getElementById('exportForm');
    
    // Open Export Modal
    if (openExportBtn) {
        openExportBtn.addEventListener('click', function() {
            exportModal.style.display = 'flex';
            
            // Set today's date as default end date
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('endDate').value = today;
        });
    }
    
    // Close Export Modal
    function closeExportModal() {
        exportModal.style.display = 'none';
        exportForm.reset();
    }
    
    if (closeExportBtn) {
        closeExportBtn.addEventListener('click', closeExportModal);
    }
    
    if (cancelExportBtn) {
        cancelExportBtn.addEventListener('click', closeExportModal);
    }
    
    // Export Form Submit
    if (exportForm) {
        exportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const format = document.querySelector('input[name="format"]:checked').value;
            const startDate = document.getElementById('startDate').value;
            const endDate = document.getElementById('endDate').value;
            const emailExport = document.getElementById('emailExport').checked;
            
            // Get selected filters
            const includeFilters = [];
            document.querySelectorAll('input[name="include"]:checked').forEach(function(checkbox) {
                includeFilters.push(checkbox.value);
            });
            
            console.log('Export data:', {
                format,
                startDate,
                endDate,
                filters: includeFilters,
                emailExport
            });
            
            // Show loading on button
            const submitBtn = this.querySelector('.btn-submit');
            submitBtn.textContent = '⏳ Generating...';
            submitBtn.disabled = true;
            
            // Simulate export generation
            setTimeout(function() {
                submitBtn.textContent = '📥 Download Export';
                submitBtn.disabled = false;
                
                if (emailExport) {
                    alert(`✅ Export generated and emailed!\n\nFormat: ${format.toUpperCase()}\nDate Range: ${startDate || 'All'} to ${endDate || 'Today'}\n\n(Backend integration pending)`);
                } else {
                    alert(`✅ Export downloaded!\n\nFormat: ${format.toUpperCase()}\nDate Range: ${startDate || 'All'} to ${endDate || 'Today'}\n\n(Backend integration pending)`);
                }
                
                closeExportModal();
            }, 2000);
            
            // TODO: Backend API call
            // fetch('/activity/export', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         format, startDate, endDate, filters: includeFilters, emailExport
            //     })
            // })
        });
    }
    
    // ===== SEARCH FUNCTIONALITY =====
    const searchInput = document.getElementById('searchInput');
    const activityItems = document.querySelectorAll('.activity-item');
    const noResults = document.getElementById('noResults');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            let hasResults = false;
            
            activityItems.forEach(function(item) {
                const title = item.querySelector('.activity-title').textContent.toLowerCase();
                const group = item.querySelector('.activity-group').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || group.includes(searchTerm)) {
                    item.style.display = 'flex';
                    hasResults = true;
                } else {
                    item.style.display = 'none';
                }
            });
            
            noResults.style.display = hasResults ? 'none' : 'block';
        });
    }
    
    // ===== FILTER FUNCTIONALITY =====
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            // Remove active from all
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            let hasResults = false;
            
            activityItems.forEach(function(item) {
                const type = item.getAttribute('data-type');
                
                if (filter === 'all' || type === filter) {
                    item.style.display = 'flex';
                    hasResults = true;
                } else {
                    item.style.display = 'none';
                }
            });
            
            noResults.style.display = hasResults ? 'none' : 'block';
        });
    });
    
    // ===== CLOSE MODAL ON OUTSIDE CLICK =====
    if (exportModal) {
        exportModal.addEventListener('click', function(e) {
            if (e.target === exportModal) {
                closeExportModal();
            }
        });
    }
    
    // ===== ESC KEY TO CLOSE =====
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && exportModal.style.display === 'flex') {
            closeExportModal();
        }
    });
    
});