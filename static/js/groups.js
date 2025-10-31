// page load hone ke baad ye sab run hoga
document.addEventListener('DOMContentLoaded', function() {
    
    // console me message - page load hua ye check karne ke liye
    console.log('Groups page loaded! 🏘️');
    
    
    
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
// ===== CREATE GROUP MODAL LOGIC =====

// Elements
const createGroupBtn = document.getElementById("createGroupBtn");
const createGroupModal = document.getElementById("createGroupModal");
const closeCreateGroupModal = document.getElementById("closeCreateGroupModal");
const cancelCreateGroup = document.getElementById("cancelCreateGroup");
const addMemberBtn = document.getElementById("addMemberBtn");
const memberList = document.getElementById("memberList");
const groupNameInput = document.getElementById("groupNameInput");
const groupNameError = document.getElementById("groupNameError");
const memberEmailInput = document.getElementById("memberEmailInput");
const memberEmailError = document.getElementById("memberEmailError");

let members = []; // Store email list

// ✅ Open modal
createGroupBtn.addEventListener("click", () => {
    createGroupModal.style.display = "flex";
    groupNameError.textContent = "";
    memberEmailError.textContent = "";
});

// ✅ Close modal
closeCreateGroupModal.addEventListener("click", () => {
    createGroupModal.style.display = "none";
});
cancelCreateGroup.addEventListener("click", () => {
    createGroupModal.style.display = "none";
});

// ✅ Add member
addMemberBtn.addEventListener("click", () => {
    const email = memberEmailInput.value.trim();

    // Validation
    if (!email) {
        memberEmailError.textContent = "Please enter an email.";
        return;
    }
    if (!validateEmail(email)) {
        memberEmailError.textContent = "Enter a valid email format.";
        return;
    }
    if (members.includes(email)) {
        memberEmailError.textContent = "This email is already added.";
        return;
    }

    // Add to list
    members.push(email);
    updateMemberUI();
    memberEmailInput.value = "";
    memberEmailError.textContent = "";
});

// ✅ Render member list
function updateMemberUI() {
    memberList.innerHTML = "";
    members.forEach((email, index) => {
        const li = document.createElement("li");
        li.textContent = email;

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "✖";
        removeBtn.classList.add("remove-member-btn");
        removeBtn.onclick = () => {
            members.splice(index, 1);
            updateMemberUI();
        };

        li.appendChild(removeBtn);
        memberList.appendChild(li);
    });
}

// ✅ Email validation
function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}
