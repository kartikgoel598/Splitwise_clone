//  kartik Jab pura page load ho jaye tab ye code chalega 
// sun toggle part thik kardio mujhe mill nhi raha google se uska solution..
document.addEventListener('DOMContentLoaded', function() {
    
    console.log('Split Wisely App Loaded! ');
    
    // 🔹 Modal ke saare elements ko select kar liya
    const modal = document.getElementById('expenseModal');
    const addExpenseBtn = document.querySelector('.add-expense-btn');
    const closeModalBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const expenseForm = document.getElementById('expenseForm');
    
    //  Modal open karne ka kaam
    if (addExpenseBtn) {
        addExpenseBtn.addEventListener('click', function() {
            modal.classList.add('active');
            console.log('Modal opened');
            
            // 🔹 Aaj ki date automatic bharne ke liye
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('date').value = today;
        });
    }
    
    //  Modal close karne ka function
    function closeModal() {
        modal.classList.remove('active');
        expenseForm.reset(); // form reset bhi ho jaye
        console.log('Modal closed');
    }
    
    // Cross button se close karne ke liye
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    //  Cancel button se bhi close ho jaye
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }
    
    //  Bahar click karne par modal band ho jaye
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Modal ke andar click karne par band na ho
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
        modalContent.addEventListener('click', function(e) {
            e.stopPropagation(); // andar click ignore kare
        });
    }
    
    // Form submit hone par kya karna hai
    if (expenseForm) {
        expenseForm.addEventListener('submit', function(e) {
            e.preventDefault(); // default reload rok diya
            
            //  Form ke sab data le liye
            const description = document.getElementById('description').value;
            const amount = document.getElementById('amount').value;
            const paidBy = document.getElementById('paidBy').value;
            const splitWith = document.getElementById('splitWith').value;
            const date = document.getElementById('date').value;
            
            //  Data console me print karne ke liye
            console.log('New Expense Added:', {
                description: description,
                amount: '$' + amount,
                paidBy: paidBy,
                splitWith: splitWith,
                date: date
            });
            
            //  Alert box me success message
            alert(`Expense Added! 💰\n\nDescription: ${description}\nAmount: $${amount}\nPaid By: ${paidBy}\nSplit With: ${splitWith}\nDate: ${date}\n\n(Backend integration pending - Kartik will handle this)`);
            
            // 🔹Modal close kar do aur form reset
            closeModal();
        });
    }
    
    //  Expense items par click hone par animation
    const expenseItems = document.querySelectorAll('.expense-item');
    
    expenseItems.forEach(function(item) {
        item.addEventListener('click', function() {
            // 🔹 Thoda click effect dene ke liye scale
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
            
            console.log('Expense clicked:', this.querySelector('h4').textContent);
        });
    });
    
    // Balance cards page load par animation ke sath aaye
    const balanceCards = document.querySelectorAll('.balance-card');
    
    balanceCards.forEach(function(card, index) {
        // Thoda delay ke sath card dikhaye
        setTimeout(function() {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.5s ease';
            
            setTimeout(function() {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        }, index * 100);
    });
    
    //  Navigation links click hone par alert dikhaye
    // const navLinks = document.querySelectorAll('.nav-links a');
    
    // navLinks.forEach(function(link) {
    //     link.addEventListener('click', function(e) {
    //         e.preventDefault();
    //         console.log('Navigation clicked:', this.textContent);
    //         alert(`${this.textContent} page coming soon! 🚧`);
    //     });
    // });
    
    //  Keyboard shortcut - ESC dabane par modal band ho jaye
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
});

// Currency format karne ka function
function formatCurrency(amount) {
    return '$' + parseFloat(amount).toFixed(2);
}

//  Total balance nikalne ka function
function calculateBalance(youOwe, youAreOwed) {
    return youAreOwed - youOwe;
}

//  Bas ek example check karne ke liye
console.log('Currency format example:', formatCurrency(245.50));

//  Dark mode toggle button ka code
const themeToggle = document.getElementById('themeToggle');

// User ka saved theme check kar lo
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    if (themeToggle) themeToggle.checked = true;
}

//  Toggle change hone par dark/light mode set karna
if (themeToggle) {
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            // Dark mode on
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            console.log('Dark mode enabled 🌙');
        } else {
            //  Light mode wapas on
            document.body.classList.remove('dark-mode');
            localStorage.removeItem('theme');
            console.log('Light mode enabled ☀️');
        }
    });
}

//  Total balance ka color logic (positive/negative)
function updateBalanceColor() {
    const totalBalanceCard = document.querySelector('.balance-card.total .amount');
    if (totalBalanceCard) {
        const balanceText = totalBalanceCard.textContent;
        const balanceValue = parseFloat(balanceText.replace('$', '').replace(',', ''));
        
        // 🔹 Pehle saare colors hata do
        totalBalanceCard.classList.remove('balance-negative', 'balance-positive', 'balance-zero');
        
        if (balanceValue < 0) {
            //  Agar balance negative ho to red
            totalBalanceCard.classList.add('balance-negative');
        } else if (balanceValue > 0) {
            // Agar balance positive ho to green
            totalBalanceCard.classList.add('balance-positive');
        } else {
            //  Agar zero ho to neutral color
            totalBalanceCard.classList.add('balance-zero');
        }
    }
}

//  Page load par balance color update ho jaye
updateBalanceColor();