// group-detail.js
document.addEventListener("DOMContentLoaded", () => {
  // ==========  Add Expense Modal ==========
  const openAddExpenseBtn = document.getElementById("openAddExpense");
  const addExpenseModal = document.getElementById("addExpenseModal");
  const closeAddExpenseBtn = document.getElementById("closeAddExpense");
  const cancelAddExpenseBtn = document.getElementById("cancelAddExpense");

  if (openAddExpenseBtn)
    openAddExpenseBtn.addEventListener("click", () => {
      addExpenseModal.style.display = "flex";
    });

  if (closeAddExpenseBtn)
    closeAddExpenseBtn.addEventListener("click", () => {
      addExpenseModal.style.display = "none";
    });

  if (cancelAddExpenseBtn)
    cancelAddExpenseBtn.addEventListener("click", () => {
      addExpenseModal.style.display = "none";
    });

  // ==========  Settle Up Modal ==========
  const openSettleBtn = document.querySelector(".settle-btn");
  const settleUpModal = document.getElementById("settleUpModal");
  const closeSettleUpBtn = document.getElementById("closeSettleUp");
  const cancelSettleUpBtn = document.getElementById("cancelSettleUp");


  if (openSettleBtn)
    openSettleBtn.addEventListener("click", (e) => {
e.preventDefault();
      settleUpModal.style.display = "flex";
    });

  if (closeSettleUpBtn)
    closeSettleUpBtn.addEventListener("click", () => {
      settleUpModal.style.display = "none";
    });

  if (cancelSettleUpBtn)
    cancelSettleUpBtn.addEventListener("click", () => {
      settleUpModal.style.display = "none";
    });

  // ========== Handle Settlement (In-App or PayPal) ==========
  const settleForm = document.querySelector("#settleUpModal form");

  if (settleForm) {
    settleForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      console.log("Settlement form submitted");

      const method = document.getElementById("settleMethod").value;

      // safer selectors that work with Flask-WTF field names
      const amountInput = settleForm.querySelector("input[name*='amount']");
      const payToInput = settleForm.querySelector("select[name*='pay_to']");

      const amount = amountInput ? amountInput.value.trim() : "";
      const payTo = payToInput ? payToInput.value : "";
      const groupId = typeof GROUP_ID !== "undefined" ? GROUP_ID : null;

      console.log("PayPal clicked", { method, payTo, amount, groupId });

      if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        alert("Please enter a valid amount.");
        return;
      }

      if (method === "inapp") {
        settleForm.submit();
      } else if (method === "paypal") {
        try {
          const res = await fetch(`/groups/${groupId}/settlement/start`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ receiver_id: payTo, amount: amount }),
          });

          const data = await res.json();
          console.log("PayPal start response:", data);

          if (data.error) {
            alert("error " + data.error);
            return;
          }

          const paypalUrl = `https://www.sandbox.paypal.com/checkoutnow?token=${data.order_id}`;
          window.open(paypalUrl, "_blank");
          alert("✅ Redirecting to PayPal...");
        } catch (err) {
          console.error(err);
          alert("⚠️ Error starting PayPal settlement.");
        }
      }
    });
  }
});
