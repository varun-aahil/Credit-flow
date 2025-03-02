document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loanForm');
    const steps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.step');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');
  
    let currentStep = 0;
  
    function showStep(stepIndex) {
      steps.forEach((step, index) => {
        step.classList.toggle('hidden', index !== stepIndex);
      });
  
      progressSteps.forEach((step, index) => {
        step.classList.toggle('active', index <= stepIndex);
      });
  
      prevBtn.classList.toggle('hidden', stepIndex === 0);
      nextBtn.classList.toggle('hidden', stepIndex === steps.length - 1);
      submitBtn.classList.toggle('hidden', stepIndex !== steps.length - 1);
    }
  
    nextBtn.addEventListener('click', () => {
      if (validateStep(currentStep)) {
        currentStep++;
        showStep(currentStep);
      }
    });
  
    prevBtn.addEventListener('click', () => {
      currentStep--;
      showStep(currentStep);
    });
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (validateStep(currentStep)) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
  
        try {
          const response = await fetch('/apply', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
  
          if (response.ok) {
            alert('Application submitted successfully!');
            window.location.href = "kyc.html"
          } else {
            const errorText = await response.text();
            alert('Error: ' + errorText);
          }
        } catch (error) {
          console.error('Error during form submission:', error);
          alert('Error during form submission. Check console for details.');
        }
      }
    });
  
    function validateStep(stepIndex) {
      // Add your step validation logic here
      return true;
    }
  
    showStep(currentStep);
  });
  