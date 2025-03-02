document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
  
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
  
      // Make a POST request to the server to save signup details
      try {
        const response = await fetch('/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
  
        if (response.ok) {
          alert('Signup successful!');
          window.location.href = 'login.html';
        } else {
          const errorText = await response.text();
          alert('Error: ' + errorText);
        }
      } catch (error) {
        console.error('Error during signup attempt:', error);
        alert('Error during signup attempt. Check console for details.');
      }
    });
  });
  