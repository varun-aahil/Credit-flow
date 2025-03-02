document.addEventListener('DOMContentLoaded', function() {
    const kycForm = document.getElementById('kycForm');
  
    kycForm.addEventListener('submit', async function(e) {
      e.preventDefault();
  
      const formData = new FormData(kycForm);
  
      try {
        const response = await fetch('/kyc', {
          method: 'POST',
          body: formData
        });
  
        if (response.ok) {
          alert('KYC verification submitted successfully!');
        } else {
          const errorText = await response.text();
          alert('Error: ' + errorText);
        }
      } catch (error) {
        console.error('Error during KYC submission:', error);
        alert('Error during KYC submission. Check console for details.');
      }
    });
  });
  