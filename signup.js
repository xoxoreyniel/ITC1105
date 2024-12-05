document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('signupForm');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');

    function clearMessages() {
        errorMessage.textContent = '';
        successMessage.textContent = '';
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => input.classList.remove('invalid'));
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        clearMessages();

        const formData = new FormData(form);
        const xhr = new XMLHttpRequest();
        xhr.open('POST', form.action, true);

        xhr.onload = function () {
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText); // Parse the JSON response

                    if (response.success) {
                        successMessage.textContent = response.message;
                        setTimeout(() => {
                            window.location.href = 'passwordsecurity.html'; // Redirect on success
                        }, 1000);
                    } else {
                        errorMessage.textContent = response.message;
                    }
                } catch (e) {
                    errorMessage.textContent = 'Invalid server response. Please try again.';
                }
            } else {
                errorMessage.textContent = 'An error occurred, please try again.';
            }
        };

        xhr.send(formData);
    });
});