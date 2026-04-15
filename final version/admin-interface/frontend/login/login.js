document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('error');
    const successDiv = document.getElementById('success');
    const submitBtn = document.querySelector('.btn-submit');
    
    // Clear previous messages
    errorDiv.style.display = 'none';
    errorDiv.textContent = '';
    successDiv.style.display = 'none';
    successDiv.textContent = '';
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in...';
    
    try {
        // Use Auth module to login
        const result = await Auth.login(username, password);
        
        if (result.success) {
            // Show success message
            successDiv.textContent = 'Login successful! Redirecting...';
            successDiv.style.display = 'block';
            
            // Redirect to admin main page or dashboard
            setTimeout(() => {
                window.location.href = '../main/main.html';
            }, 1500);
        } else {
            // Show error message
            errorDiv.textContent = result.message || 'Invalid credentials';
            errorDiv.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign In';
        }
    } catch (error) {
        console.error('Login error:', error);
        errorDiv.textContent = 'An error occurred. Please try again.';
        errorDiv.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign In';
    }
});