document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const showPasswordCheckbox = document.getElementById('showpassword');
  
    showPasswordCheckbox.addEventListener('change', () => {
      if (showPasswordCheckbox.checked) {
        passwordInput.type = 'text'; // Show password
      } else {
        passwordInput.type = 'password'; // Hide password
      }
    });
  });
  