const form = document.getElementById('resetForm');
const message = document.getElementById('message');

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email')?.value.trim();
  
  if (!email) {
    message.textContent = 'Please enter your email address.';
    message.className = 'error';
    return;
  }

  const accounts = (() => {
    try {
      const raw = localStorage.getItem('umma_accounts');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  })();

  const account = accounts.find((a) => a.email?.toLowerCase() === email.toLowerCase());
  
  if (account) {
    message.textContent = `Password reset instructions have been sent to ${email}. (In production, contact ICT support at ict@umma.edu)`;
    message.className = 'success';
  } else {
    message.textContent = 'No account found with this email. Please contact ICT support.';
    message.className = 'error';
  }
});
