// Group Detail Page JavaScript
document.addEventListener("DOMContentLoaded", () => {
    
    console.log('Group Detail page loaded! 📊');
    
    // ===== ADD EXPENSE MODAL =====
    const openExpenseBtn1 = document.getElementById("openAddExpense");
    const openExpenseBtn2 = document.getElementById("openAddExpense2");
    const expenseModal = document.getElementById("addExpenseModal");
    const closeExpenseBtn = document.getElementById("closeAddExpense");
    const cancelExpenseBtn = document.getElementById("cancelAddExpense");
    
    if (openExpenseBtn1) {
        openExpenseBtn1.addEventListener("click", () => {
            expenseModal.style.display = "flex";
        });
    }
    
    if (openExpenseBtn2) {
        openExpenseBtn2.addEventListener("click", () => {
            expenseModal.style.display = "flex";
        });
    }
    
    if (closeExpenseBtn) {
        closeExpenseBtn.addEventListener("click", () => {
            expenseModal.style.display = "none";
        });
    }
    
    if (cancelExpenseBtn) {
        cancelExpenseBtn.addEventListener("click", () => {
            expenseModal.style.display = "none";
        });
    }
    
    // ===== SETTLE UP MODAL =====
    const openSettleBtn = document.querySelector(".settle-btn");
    const settleModal = document.getElementById("settleUpModal");
    const closeSettleBtn = document.getElementById("closeSettleUp");
    const cancelSettleBtn = document.getElementById("cancelSettleUp");
    
    if (openSettleBtn) {
        openSettleBtn.addEventListener("click", () => {
            settleModal.style.display = "flex";
        });
    }
    
    if (closeSettleBtn) {
        closeSettleBtn.addEventListener("click", () => {
            settleModal.style.display = "none";
        });
    }
    
    if (cancelSettleBtn) {
        cancelSettleBtn.addEventListener("click", () => {
            settleModal.style.display = "none";
        });
    }
    
    // ===== CLOSE MODAL ON OUTSIDE CLICK =====
    if (expenseModal) {
        expenseModal.addEventListener("click", (e) => {
            if (e.target === expenseModal) {
                expenseModal.style.display = "none";
            }
        });
    }
    
    if (settleModal) {
        settleModal.addEventListener("click", (e) => {
            if (e.target === settleModal) {
                settleModal.style.display = "none";
            }
        });
    }
    
    // ===== ESC KEY TO CLOSE MODALS =====
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            if (expenseModal.style.display === "flex") {
                expenseModal.style.display = "none";
            }
            if (settleModal.style.display === "flex") {
                settleModal.style.display = "none";
            }
        }
    });
    
});