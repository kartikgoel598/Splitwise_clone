// Create Group Page - Minimal JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== CHARACTER COUNT =====
    const textarea = document.getElementById('description');
    const charCount = document.getElementById('charCount');
    
    if (textarea && charCount) {
        textarea.addEventListener('input', function() {
            charCount.textContent = this.value.length;
            charCount.style.color = this.value.length > 180 ? '#ff6b6b' : '#a0aec0';
        });
    }
    
    // ===== ADD/REMOVE MEMBERS =====
    let memberCount = document.querySelectorAll('.member-input-row').length;
    const addBtn = document.getElementById('addMemberBtn');
    const container = document.getElementById('membersContainer');
    
    function updateRemoveButtons() {
        const buttons = document.querySelectorAll('.remove-member-btn');
        buttons.forEach(btn => btn.disabled = buttons.length === 1);
    }
    
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            if (memberCount >= 10) {
                alert('Maximum 10 members allowed!');
                return;
            }
            
            const row = document.createElement('div');
            row.className = 'member-input-row';
            row.innerHTML = `
                <input type="email" name="members-${memberCount}" 
                       class="form-input member-email-input" 
                       placeholder="friend@example.com" required>
                <button type="button" class="remove-member-btn">🗑️</button>
            `;
            
            container.appendChild(row);
            memberCount++;
            
            row.querySelector('.remove-member-btn').addEventListener('click', function() {
                row.remove();
                memberCount--;
                updateRemoveButtons();
            });
            
            updateRemoveButtons();
        });
    }
    
    // Initial remove button setup
    document.querySelectorAll('.remove-member-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.member-input-row').remove();
            memberCount--;
            updateRemoveButtons();
        });
    });
    
    updateRemoveButtons();
});