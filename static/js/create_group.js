document.addEventListener('DOMContentLoaded', () => {
    const addMemberBtn = document.getElementById('addMemberBtn');
    const membersContainer = document.getElementById('membersContainer');

    // Add a new member input row
    addMemberBtn.addEventListener('click', () => {
        const memberRow = document.createElement('div');
        memberRow.classList.add('member-input-row');

        const count = membersContainer.querySelectorAll('.member-input-row').length;

        memberRow.innerHTML = `
            <input
                type="email"
                class="form-input member-email-input"
                name="members-${count}"
                placeholder="friend@example.com"
                required
            />
            <button type="button" class="remove-member-btn">✖</button>
        `;

        membersContainer.appendChild(memberRow);

        // Handle remove button
        const removeBtn = memberRow.querySelector('.remove-member-btn');
        removeBtn.addEventListener('click', () => {
            membersContainer.removeChild(memberRow);
            renumberMembers();
        });
    });

    // Renumber inputs after removal
    function renumberMembers() {
        const allRows = membersContainer.querySelectorAll('.member-input-row');
        allRows.forEach((row, i) => {
            const input = row.querySelector('.member-email-input');
            input.name = `members-${i}`;
        });
    }

    // ✅ Let Flask handle the actual submission
    // (No preventDefault here — real submission goes to Flask)
});
