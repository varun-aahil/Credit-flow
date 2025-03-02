document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    // Make a POST request to the server to save login details
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, remember })
      });

      if (response.ok) {
        alert('Login successful!');
        window.location.href = 'main.html';
      } else {
        const errorText = await response.text();
        alert('Error: ' + errorText);
      }
    } catch (error) {
      console.error('Error during login attempt:', error);
      alert('Error during login attempt. Check console for details.');
    }
  });
});
