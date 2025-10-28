// page load hone ke baad code run hoga
document.addEventListener('DOMContentLoaded', function() {
    
    console.log('Auth page loaded! 🔐');
    
    // ===== PASSWORD TOGGLE FUNCTIONALITY =====
    // saare password toggle buttons select kiye
    const toggleButtons = document.querySelectorAll('.password-toggle');
    
    toggleButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // is button se related input field nikala
            const passwordInput = this.previousElementSibling;
            
            // current type check kiya
            if (passwordInput.type === 'password') {
                // password show karo
                passwordInput.type = 'text';
                this.textContent = '🙈'; // change icon to hide
            } else {
                // password hide karo
                passwordInput.type = 'password';
                this.textContent = '👁️'; // change icon to show
            }
        });
    });
    
    // ===== LOGIN FORM SUBMISSION =====
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault(); // page reload na ho
            
            // form values nikale
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            console.log('Login attempt:', {
                email: email,
                rememberMe: rememberMe
            });
            
            // validation check - basic
            if (!email || !password) {
                alert('Please fill in all fields! ⚠️');
                return;
            }
            
            // abhi alert dikha rahe - future me backend API call hogi
            alert(`Login Successful! 🎉\n\nEmail: ${email}\nRemember Me: ${rememberMe ? 'Yes' : 'No'}\n\n(Backend authentication coming soon!)`);
            
            // future me ye line uncomment karenge - dashboard pe redirect
            // window.location.href = 'index.html';
        });
    }
    
    // ===== SIGNUP FORM SUBMISSION =====
    const signupForm = document.getElementById('signupForm');
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // form values
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('signupEmail').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const agreeTerms = document.getElementById('agreeTerms').checked;
            
            console.log('Signup attempt:', {
                name: fullName,
                email: email,
                phone: phone
            });
            
            // validation checks
            if (!fullName || !email || !password || !confirmPassword) {
                alert('Please fill in all required fields! ⚠️');
                return;
            }
            
            // password match check
            if (password !== confirmPassword) {
                alert('Passwords do not match! ❌');
                return;
            }
            
            // terms checkbox check
            if (!agreeTerms) {
                alert('Please agree to Terms & Conditions! 📋');
                return;
            }
            
            // success message
            alert(`Account Created! 🎉\n\nWelcome ${fullName}!\nEmail: ${email}\n\n(Account will be created in backend!)`);
            
            // future me login page pe redirect
            // window.location.href = 'login.html';
        });
        
        // ===== PASSWORD STRENGTH CHECKER =====
        const signupPassword = document.getElementById('signupPassword');
        const strengthBar = document.querySelector('.strength-bar');
        const strengthLabel = document.getElementById('strengthLabel');
        
        if (signupPassword && strengthBar) {
            signupPassword.addEventListener('input', function() {
                const password = this.value;
                const strength = calculatePasswordStrength(password);
                
                // strength bar update kiya
                strengthBar.className = 'strength-bar'; // reset classes
                
                if (strength.score === 0) {
                    strengthBar.classList.add('weak');
                    strengthLabel.textContent = 'Weak';
                    strengthLabel.style.color = '#ff6b6b';
                } else if (strength.score === 1) {
                    strengthBar.classList.add('medium');
                    strengthLabel.textContent = 'Medium';
                    strengthLabel.style.color = '#f7b731';
                } else {
                    strengthBar.classList.add('strong');
                    strengthLabel.textContent = 'Strong';
                    strengthLabel.style.color = '#1cc29f';
                }
            });
        }
    }
    
    // ===== FORGOT PASSWORD FORM =====
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('recoveryEmail').value;
            
            console.log('Password reset requested for:', email);
            
            if (!email) {
                alert('Please enter your email address! ⚠️');
                return;
            }
            
            // success message
            alert(`Password Reset Link Sent! 📧\n\nCheck your email: ${email}\n\n(Email will be sent via backend!)`);
            
            // future me login page pe redirect
            // setTimeout(() => {
            //     window.location.href = 'login.html';
            // }, 2000);
        });
    }
    
    // ===== PASSWORD STRENGTH CALCULATION FUNCTION =====
    function calculatePasswordStrength(password) {
        let score = 0;
        
        // empty password
        if (!password) return { score: 0 };
        
        // length check
        if (password.length >= 8) score++;
        
        // has lowercase and uppercase
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        
        // has numbers
        if (/\d/.test(password)) score++;
        
        // has special characters
        if (/[^A-Za-z0-9]/.test(password)) score++;
        
        // score normalize kiya (0, 1, 2 me convert)
        if (score <= 1) return { score: 0 }; // weak
        if (score <= 3) return { score: 1 }; // medium
        return { score: 2 }; // strong
    }
    
    // ===== FORM INPUT ANIMATIONS =====
    // jab user type kare to input highlight ho
    const formInputs = document.querySelectorAll('.form-input');
    
    formInputs.forEach(function(input) {
        // focus - label color change
        input.addEventListener('focus', function() {
            const label = this.previousElementSibling;
            if (label && label.classList.contains('form-label')) {
                label.style.color = '#1cc29f';
            }
        });
        
        // blur - label normal color
        input.addEventListener('blur', function() {
            const label = this.previousElementSibling;
            if (label && label.classList.contains('form-label')) {
                label.style.color = '#2d3748';
            }
        });
    });
    
});