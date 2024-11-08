document.addEventListener('DOMContentLoaded', function() {
    // Select form elements safely
    const loginForm = document.querySelector('form[action="/auth/login"]');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessageElement = document.getElementById('error-message');

    // Check if elements exist before adding event listeners
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            // Basic client-side validation
            if (!validateForm()) {
                event.preventDefault();
            }
        });
    }

    if (emailInput) {
        emailInput.addEventListener('input', function() {
            validateEmail(this);
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            validatePassword(this);
        });
    }

    function validateForm() {
        let isValid = true;

        // Email validation
        if (emailInput && !validateEmail(emailInput)) {
            isValid = false;
        }

        // Password validation
        if (passwordInput && !validatePassword(passwordInput)) {
            isValid = false;
        }

        return isValid;
    }

    function validateEmail(input) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const errorSpan = input.nextElementSibling;

        if (!input.value.trim()) {
            showError(input, 'Email is required');
            return false;
        }

        if (!emailRegex.test(input.value)) {
            showError(input, 'Invalid email format');
            return false;
        }

        clearError(input);
        return true;
    }

    function validatePassword(input) {
        if (!input.value.trim()) {
            showError(input, 'Password is required');
            return false;
        }

        if (input.value.length < 6) {
            showError(input, 'Password must be at least 6 characters');
            return false;
        }

        clearError(input);
        return true;
    }

    function showError(input, message) {
        // Find or create error span
        let errorSpan = input.parentNode.querySelector('.error-message');
        if (!errorSpan) {
            errorSpan = document.createElement('span');
            errorSpan.className = 'error-message';
            input.parentNode.appendChild(errorSpan);
        }
        
        errorSpan.textContent = message;
        errorSpan.style.color = 'red';
        errorSpan.style.display = 'block';
        input.classList.add('error-input');
    }

    function clearError(input) {
        const errorSpan = input.parentNode.querySelector('.error-message');
        if (errorSpan) {
            errorSpan.textContent = '';
            errorSpan.style.display = 'none';
        }
        input.classList.remove('error-input');
    }

    const closePopupBtn = document.querySelector('.popup-overlay button');
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', function() {
            const popupOverlay = document.querySelector('.popup-overlay');
            if (popupOverlay) {
                popupOverlay.style.display = 'none';
            }
        });
    }
});

window.addEventListener('error', function(event) {
    console.error('Uncaught error:', event.error);
    // Optionally send error to server or show user-friendly message
});