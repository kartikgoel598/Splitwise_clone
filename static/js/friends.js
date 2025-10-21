// page load hone ke baad ye code run hoga
document.addEventListener('DOMContentLoaded', function() {
    
    // console me message - page load check karne ke liye
    console.log('Friends page loaded! 👥');
    
    // ===== FRIEND CARDS CLICK FUNCTIONALITY =====
    // saare friend cards select kar liye
    const friendCards = document.querySelectorAll('.friend-card');
    
    // har card pe loop chalaya
    friendCards.forEach(function(card) {
        // click event lagaya
        card.addEventListener('click', function(e) {
            // agar settle button pe click kiya to card click na ho
            if (e.target.classList.contains('settle-btn')) {
                return; // function se bahar nikal gaye
            }
            
            // friend ka ID nikala HTML attribute se
            const friendId = this.getAttribute('data-friend-id');
            // friend ka naam card se nikala
            const friendName = this.querySelector('.friend-name').textContent;
            // balance amount nikala
            const balanceAmount = this.querySelector('.balance-amount').textContent;
            
            // console me print kiya debugging ke liye
            console.log(`Friend clicked: ${friendName} (ID: ${friendId})`);
            
            // abhi alert dikha rahe - baad me detail page pe jayenge
            alert(`Opening ${friendName}'s profile...\n\nBalance: ${balanceAmount}\n\n(Friend detail page coming soon! Backend se expenses aur transaction history dikhenge.)`);
            
            // future me ye line use karenge detail page ke liye
            // window.location.href = `friend-detail.html?id=${friendId}`;
        });
    });
    
    // ===== ADD FRIEND BUTTON FUNCTIONALITY =====
    // add friend button select kiya
    const addFriendBtn = document.getElementById('addFriendBtn');
    
    // agar button exist karta hai
    if (addFriendBtn) {
        // click event add kiya
        addFriendBtn.addEventListener('click', function() {
            console.log('Add Friend button clicked');
            
            // abhi alert dikha rahe - baad me modal khulega
            alert('Add Friend feature coming soon! 🚀\n\nYou will be able to:\n• Search friends by email/phone\n• Send friend request\n• Import from contacts\n• Share invite link');
            
            // future me modal open karenge
            // openAddFriendModal();
        });
    }
    
    // ===== SETTLE UP BUTTONS FUNCTIONALITY =====
    // saare settle buttons select kiye
    const settleButtons = document.querySelectorAll('.settle-btn:not(.disabled)');
    
    // har button pe loop
    settleButtons.forEach(function(btn) {
        // click event - card click se pehle handle hoga
        btn.addEventListener('click', function(e) {
            // event ko parent (card) tak jaane se roko
            e.stopPropagation();
            
            // button se data attributes nikale
            const friendName = this.getAttribute('data-friend');
            const amount = this.getAttribute('data-amount');
            
            console.log(`Settle up clicked for ${friendName}: $${amount}`);
            
            // button ka text check kiya - Settle Up ya Remind
            const buttonText = this.textContent.trim();
            
            if (buttonText === 'Settle Up') {
                // mujhe paisa dena hai - payment karna hai
                alert(`Settle up with ${friendName}\n\nAmount: $${amount}\n\n(Payment integration coming soon!\nOptions: Bank transfer, UPI, Cash, etc.)`);
            } else if (buttonText === 'Remind') {
                // mujhe paisa milna hai - reminder bhejni hai
                alert(`Send reminder to ${friendName}\n\nAmount owed: $${amount}\n\n(Reminder will be sent via:\n• Email notification\n• In-app notification\n• SMS (optional))`);
            }
            
            // future me actual functionality implement hogi
            // processSettlement(friendName, amount);
        });
    });
    
    // ===== CARD HOVER ANIMATION =====
    // smooth hover effect ke liye
    friendCards.forEach(function(card) {
        // mouse enter
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
        
        // mouse leave - original position pe wapas
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // ===== CALCULATE TOTAL SUMMARY =====
    // optional - total kitna lena/dena hai calculate kar sakte hain
    function calculateTotalBalance() {
        let totalOwe = 0; // mujhe dena hai
        let totalOwed = 0; // mujhe milna hai
        
        // saare balance amounts ko loop karke add kiya
        friendCards.forEach(function(card) {
            const balanceText = card.querySelector('.balance-text');
            const balanceAmount = card.querySelector('.balance-amount').textContent;
            
            // $ sign aur comma hata ke number banaya
            const amount = parseFloat(balanceAmount.replace('$', '').replace(',', ''));
            
            // check kiya owe hai ya owed
            if (balanceText.classList.contains('owe')) {
                totalOwe += amount;
            } else if (balanceText.classList.contains('owed')) {
                totalOwed += amount;
            }
        });
        
        // console me total print kiya
        console.log(`Total Summary:`);
        console.log(`You owe: $${totalOwe.toFixed(2)}`);
        console.log(`You are owed: $${totalOwed.toFixed(2)}`);
        console.log(`Net balance: $${(totalOwed - totalOwe).toFixed(2)}`);
        
        // ye data dashboard pe bhi dikha sakte hain future me
        return {
            owe: totalOwe,
            owed: totalOwed,
            net: totalOwed - totalOwe
        };
    }
    
    // page load pe total calculate kar liya
    calculateTotalBalance();
    
});