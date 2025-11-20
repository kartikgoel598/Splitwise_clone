document.addEventListener("DOMContentLoaded", () => {
 
    // ========= ADD FRIEND MODAL =========
    const openAddModal = document.getElementById("openAddFriendModal");
    const addFriendModal = document.getElementById("addFriendModal");
    const closeAddModal = document.getElementById("closeAddFriendModal");
    const cancelAddFriend = document.getElementById("cancelAddFriend");
 
    if (openAddModal) {
        openAddModal.addEventListener("click", () => {
            addFriendModal.style.display = "flex";
        });
    }
 
    if (closeAddModal) {
        closeAddModal.addEventListener("click", () => {
            addFriendModal.style.display = "none";
        });
    }
 
    if (cancelAddFriend) {
        cancelAddFriend.addEventListener("click", () => {
            addFriendModal.style.display = "none";
        });
    }
 
    // ========= REMIND MODAL =========
    const remindModal = document.getElementById("remindModal");
    const closeRemindModal = document.getElementById("closeRemindModal");
    const cancelRemind = document.getElementById("cancelRemind");
 
    const remindFriendName = document.getElementById("remindFriendName");
    const remindAmount = document.getElementById("remindAmount");
    const remindMessage = document.getElementById("remindMessage");
    const remindForm = document.getElementById("remindForm");
 
    // open remind modal for each remind button
    document.querySelectorAll(".remind-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            remindFriendName.value = btn.dataset.friend;
            remindAmount.value = btn.dataset.amount;
            remindModal.dataset.friendId = btn.dataset.friendId;
            remindModal.style.display = "flex";
        });
    });
 
    if (closeRemindModal) {
        closeRemindModal.addEventListener("click", () => {
            remindModal.style.display = "none";
        });
    }
 
    if (cancelRemind) {
        cancelRemind.addEventListener("click", () => {
            remindModal.style.display = "none";
        });
    }
 
    // when user submits reminder → redirect to backend URL
    remindForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const friendId = remindModal.dataset.friendId;
        window.location.href = `/friends/remind/${friendId}`;
    });
 
});