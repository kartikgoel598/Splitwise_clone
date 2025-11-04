// Friends Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    console.log('Friends page loaded! 👥');
    
    // ===== ADD FRIEND MODAL =====
    const addFriendBtn = document.getElementById('openAddFriendModal');
    const addFriendModal = document.getElementById('addFriendModal');
    const closeAddFriendBtn = document.getElementById('closeAddFriendModal');
    const cancelAddFriendBtn = document.getElementById('cancelAddFriend');
    const addFriendForm = document.getElementById('addFriendForm');
    
    // Open Add Friend Modal
    if (addFriendBtn) {
        addFriendBtn.addEventListener('click', function() {
            addFriendModal.style.display = 'flex';
        });
    }
    
    // Close Add Friend Modal
    function closeAddFriendModal() {
        addFriendModal.style.display = 'none';
        addFriendForm.reset();
    }
    
    if (closeAddFriendBtn) {
        closeAddFriendBtn.addEventListener('click', closeAddFriendModal);
    }
    
    if (cancelAddFriendBtn) {
        cancelAddFriendBtn.addEventListener('click', closeAddFriendModal);
    }
    
    // Add Friend Form Submit
    if (addFriendForm) {
        addFriendForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('friendEmail').value;
            const name = document.getElementById('friendName').value;
            
            console.log('Add Friend:', { email, name });
            
            alert(`Friend request sent to ${email}!\n\n(Backend integration pending)`);
            
            closeAddFriendModal();
            
            // TODO: Backend API call
            // fetch('/friends/add', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ email, name })
            // })
        });
    }
    
    // ===== SETTLE UP MODAL =====
    const settleButtons = document.querySelectorAll('.settle-btn:not(.disabled)');
    const settleModal = document.getElementById('settleUpModal');
    const closeSettleBtn = document.getElementById('closeSettleModal');
    const cancelSettleBtn = document.getElementById('cancelSettle');
    const settleForm = document.getElementById('settleUpForm');
    
    let currentSettleFriend = '';
    let currentSettleAmount = 0;
    
    // Open Settle Up Modal
    settleButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            currentSettleFriend = this.getAttribute('data-friend');
            currentSettleAmount = this.getAttribute('data-amount');
            
            document.getElementById('settleFriendName').value = currentSettleFriend;
            document.getElementById('settleAmount').value = currentSettleAmount;
            
            settleModal.style.display = 'flex';
        });
    });
    
    // Close Settle Modal
    function closeSettleModal() {
        settleModal.style.display = 'none';
        settleForm.reset();
    }
    
    if (closeSettleBtn) {
        closeSettleBtn.addEventListener('click', closeSettleModal);
    }
    
    if (cancelSettleBtn) {
        cancelSettleBtn.addEventListener('click', closeSettleModal);
    }
    
    // Settle Form Submit
    if (settleForm) {
        settleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const friend = document.getElementById('settleFriendName').value;
            const amount = document.getElementById('settleAmount').value;
            const method = document.getElementById('paymentMethod').value;
            const note = document.getElementById('settleNote').value;
            
            console.log('Settle Up:', { friend, amount, method, note });
            
            alert(`Payment of $${amount} to ${friend} recorded!\nMethod: ${method}\n\n(Backend integration pending)`);
            
            closeSettleModal();
            
            // TODO: Backend API call
        });
    }
    
    // ===== CLOSE MODALS ON OUTSIDE CLICK =====
    if (addFriendModal) {
        addFriendModal.addEventListener('click', function(e) {
            if (e.target === addFriendModal) {
                closeAddFriendModal();
            }
        });
    }
    
    if (settleModal) {
        settleModal.addEventListener('click', function(e) {
            if (e.target === settleModal) {
                closeSettleModal();
            }
        });
    }
    
    // ===== ESC KEY TO CLOSE =====
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (addFriendModal.style.display === 'flex') {
                closeAddFriendModal();
            }
            if (settleModal.style.display === 'flex') {
                closeSettleModal();
            }
        }
    });
    
    // ===== FRIEND CARD CLICK ANIMATION =====
    const friendCards = document.querySelectorAll('.friend-card');
    
    friendCards.forEach(function(card) {
        card.addEventListener('click', function(e) {
            // Agar button click hua to card click ignore
            if (e.target.classList.contains('settle-btn')) {
                return;
            }
            
            console.log('Friend card clicked:', this.querySelector('.friend-name').textContent);
            
            // Future: Redirect to friend detail page
            // window.location.href = `/friends/${friendId}`;
        });
    });
    
});
// Friends Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    console.log('Friends page loaded! 👥');
    
    // ===== ADD FRIEND MODAL =====
    const addFriendBtn = document.getElementById('openAddFriendModal');
    const addFriendModal = document.getElementById('addFriendModal');
    const closeAddFriendBtn = document.getElementById('closeAddFriendModal');
    const cancelAddFriendBtn = document.getElementById('cancelAddFriend');
    const addFriendForm = document.getElementById('addFriendForm');
    
    if (addFriendBtn) {
        addFriendBtn.addEventListener('click', function() {
            addFriendModal.style.display = 'flex';
        });
    }
    
    function closeAddFriendModal() {
        addFriendModal.style.display = 'none';
        addFriendForm.reset();
    }
    
    if (closeAddFriendBtn) {
        closeAddFriendBtn.addEventListener('click', closeAddFriendModal);
    }
    
    if (cancelAddFriendBtn) {
        cancelAddFriendBtn.addEventListener('click', closeAddFriendModal);
    }
    
    if (addFriendForm) {
        addFriendForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('friendEmail').value;
            const name = document.getElementById('friendName').value || 'your friend';
            
            console.log('Sending invitation to:', email);
            
            showSuccess(`📧 Invitation sent to ${name}!`);
            closeAddFriendModal();
            
            // TODO: Backend API call
        });
    }
    
    // ===== SETTLE UP MODAL =====
    const settleButtons = document.querySelectorAll('.settle-btn:not(.disabled)');
    const settleModal = document.getElementById('settleUpModal');
    const closeSettleBtn = document.getElementById('closeSettleModal');
    const cancelSettleBtn = document.getElementById('cancelSettle');
    const settleForm = document.getElementById('settleUpForm');
    
    settleButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const friend = this.getAttribute('data-friend');
            const amount = this.getAttribute('data-amount');
            
            document.getElementById('settleFriendName').value = friend;
            document.getElementById('settleAmount').value = amount;
            
            settleModal.style.display = 'flex';
        });
    });
    
    function closeSettleModal() {
        settleModal.style.display = 'none';
        settleForm.reset();
    }
    
    if (closeSettleBtn) {
        closeSettleBtn.addEventListener('click', closeSettleModal);
    }
    
    if (cancelSettleBtn) {
        cancelSettleBtn.addEventListener('click', closeSettleModal);
    }
    
    if (settleForm) {
        settleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const friend = document.getElementById('settleFriendName').value;
            const amount = document.getElementById('settleAmount').value;
            const method = document.querySelector('input[name="paymentMethod"]:checked').value;
            const note = document.getElementById('settleNote').value;
            
            console.log('Settlement:', { friend, amount, method, note });
            
            showSuccess(`✅ Payment of $${amount} to ${friend} recorded!`);
            closeSettleModal();
            
            // TODO: Backend API call
        });
    }
    
    // ===== REMIND MODAL =====
    const remindButtons = document.querySelectorAll('.remind-btn');
    const remindModal = document.getElementById('remindModal');
    const closeRemindBtn = document.getElementById('closeRemindModal');
    const cancelRemindBtn = document.getElementById('cancelRemind');
    const remindForm = document.getElementById('remindForm');
    
    let currentRemindEmail = '';
    
    remindButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const friend = this.getAttribute('data-friend');
            const amount = this.getAttribute('data-amount');
            currentRemindEmail = this.getAttribute('data-email');
            
            document.getElementById('remindFriendName').value = friend;
            document.getElementById('remindAmount').value = amount;
            
            remindModal.style.display = 'flex';
        });
    });
    
    function closeRemindModal() {
        remindModal.style.display = 'none';
        remindForm.reset();
    }
    
    if (closeRemindBtn) {
        closeRemindBtn.addEventListener('click', closeRemindModal);
    }
    
    if (cancelRemindBtn) {
        cancelRemindBtn.addEventListener('click', closeRemindModal);
    }
    
    if (remindForm) {
        remindForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const friend = document.getElementById('remindFriendName').value;
            const amount = document.getElementById('remindAmount').value;
            const message = document.getElementById('remindMessage').value;
            
            console.log('Sending reminder:', { friend, amount, message, email: currentRemindEmail });
            
            // Show plane animation
            const plane = document.getElementById('planeAnimation');
            plane.style.display = 'block';
            
            closeRemindModal();
            
            setTimeout(function() {
                plane.style.display = 'none';
                showSuccess(`✈️ Reminder sent to ${friend}!`);
            }, 2000);
            
            // TODO: Backend API call to send reminder email
            // fetch('/friends/remind', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ 
            //         email: currentRemindEmail, 
            //         friend, 
            //         amount, 
            //         message 
            //     })
            // })
        });
    }
    
    // ===== SUCCESS MESSAGE =====
    function showSuccess(message) {
        const successBox = document.getElementById('successMessage');
        successBox.textContent = message;
        successBox.style.display = 'block';
        
        setTimeout(function() {
            successBox.style.display = 'none';
        }, 4000);
    }
    
    // ===== CLOSE MODALS ON OUTSIDE CLICK =====
    [addFriendModal, settleModal, remindModal].forEach(function(modal) {
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
    });
    
    // ===== ESC KEY TO CLOSE =====
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (addFriendModal && addFriendModal.style.display === 'flex') {
                closeAddFriendModal();
            }
            if (settleModal && settleModal.style.display === 'flex') {
                closeSettleModal();
            }
            if (remindModal && remindModal.style.display === 'flex') {
                closeRemindModal();
            }
        }
    });
    
});