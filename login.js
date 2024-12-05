document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');

    function clearMessages() {
        errorMessage.textContent = '';
        successMessage.textContent = '';
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault(); 
        clearMessages(); 

        let valid = true;
        const usernameEmail = document.getElementById('usernameEmail').value.trim();
        const password = document.getElementById('password').value.trim();

        if (usernameEmail === '') {
            valid = false;
            errorMessage.textContent = 'Username or Email is required.';
        }

        if (password === '') {
            valid = false;
            errorMessage.textContent += '\nPassword is required.';
        }

        if (valid) {
            const formData = new FormData(form);
            const xhr = new XMLHttpRequest();
            xhr.open('POST', form.action, true); 

            xhr.onload = function () {
                if (xhr.status === 200) {
                    const response = xhr.responseText.trim();

                    if (response === 'Logged in successfully!') {
                        successMessage.textContent = response;
                        window.location.href = "dashboard.html"; 
                    } else {
                        errorMessage.textContent = response;
                    }
                } else {
                    errorMessage.textContent = 'An error occurred, please try again.'; 
                }
            };

            xhr.send(formData);
        }
    });
});
