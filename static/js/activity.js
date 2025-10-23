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
    
    // ===== EXPORT BUTTON FUNCTIONALITY =====
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            console.log('Export button clicked');
            
            // future me CSV/PDF export functionality
            alert('Export feature coming soon! 📥\n\nYou will be able to export:\n• CSV format\n• PDF report\n• Excel spreadsheet\n• Date range selection');
            
            // future implementation
            // exportTransactions('csv');
        });
    }
    
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