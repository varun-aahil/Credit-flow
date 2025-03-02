document.addEventListener('DOMContentLoaded', () => {
  const loanAmount = document.getElementById('loanAmount');
  const loanTenure = document.getElementById('loanTenure');
  const loanInterest = document.getElementById('loanIntrest');
  const amountDisplay = document.querySelector('.amount-display');
  const tenureDisplay = document.querySelector('.tenure-display');
  const interestDisplay = document.querySelector('.intrest-display');
  const emiAmount = document.querySelector('.emi-amount');
  const totalAmount = document.querySelector('.total-amount');
  const totalIntrest = document.querySelector('.intrest-amount')

  function calculateEMI() {
      const P = parseFloat(loanAmount.value);
      const N = parseFloat(loanTenure.value);
      const R = parseFloat(loanInterest.value);
      const T = R / (12 * 100);

      const emi = (P * T * Math.pow(1 + T, N)) / (Math.pow(1 + T, N) - 1);
      const total = emi * N;

      emiAmount.textContent = `₹${Math.round(emi).toLocaleString()}`;
      totalAmount.textContent = `₹${Math.round(total).toLocaleString()}`;
      totalIntrest.textContent = `${loanInterest.value}% p.a.`;
  }

  function updateDisplays() {
      amountDisplay.textContent = `₹${parseInt(loanAmount.value).toLocaleString()}`;
      tenureDisplay.textContent = `${loanTenure.value} months`;
      interestDisplay.textContent = `${loanInterest.value}%`;
      calculateEMI();
  }

  loanAmount.addEventListener('input', updateDisplays);
  loanTenure.addEventListener('input', updateDisplays);
  loanInterest.addEventListener('input', updateDisplays);

  updateDisplays();
});
