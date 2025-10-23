// page load hone ke baad ye sab run hoga
document.addEventListener('DOMContentLoaded', function() {
    
    // console me message - page load hua ye check karne ke liye
    console.log('Groups page loaded! 🏘️');
    
    // ===== GROUP CARDS PE CLICK FUNCTIONALITY =====
    // saare group cards select kar liye
    const groupCards = document.querySelectorAll('.group-card');
    
    // har ek card pe loop chalaya
    groupCards.forEach(function(card) {
        // click event lagaya
        card.addEventListener('click', function() {
            // is card ka data-group-id nikala (HTML me set kiya tha)
            const groupId = this.getAttribute('data-group-id');
            // group ka naam nikala card se
            const groupName = this.querySelector('.group-name').textContent;
            
            // console me print kiya debugging ke liye
            console.log(`Group clicked: ${groupName} (ID: ${groupId})`);
            
            // abhi ke liye alert dikhaya
            // baad me ye group detail page pe redirect hoga
            alert(`Opening ${groupName} group...\n\n(Group detail page coming soon! Kartik backend se connect karega.)`);
            
            // future me ye line uncomment karni hai redirect ke liye
            // window.location.href = `group-detail.html?id=${groupId}`;
        });
    });
    
    // ===== CREATE GROUP BUTTON KI FUNCTIONALITY =====
    // create button ko select kiya
    const createGroupBtn = document.getElementById('createGroupBtn');
    
    // agar button exist karta hai to
    if (createGroupBtn) {
        // click event add kiya
        createGroupBtn.addEventListener('click', function() {
            // console me log kiya
            console.log('Create Group button clicked');
            
            // abhi alert dikha rahe hain
            // baad me modal ya naya page khulega
            alert('Create Group feature coming soon! 🚀\n\nFeatures:\n• Group name set kar sakte\n• Members add kar sakte\n• Icon choose kar sakte\n• Description likh sakte');
            
            // future me ye function call karenge
            // openCreateGroupModal();
        });
    }
    
    // ===== CARDS PE HOVER ANIMATION =====
    // thoda extra smoothness ke liye
    groupCards.forEach(function(card) {
        // jab mouse card pe aaye
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.3s ease';
        });
        
        // jab mouse card se hatt jaye
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)'; /* original position pe wapis */
        });
    });
    
});