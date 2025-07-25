const API = '/auth';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = new FormData(loginForm);
            const res = await fetch(`${API}/login`, {
                method: 'POST',
                body: data,
                credentials: 'include'
            });
            const result = await res.json();
            if (res.ok) {
                localStorage.setItem('access_token', result.access_token);
                window.location.href = '/upload_video.html';
            } else {
                showAlert(result.detail || 'Login failed', 'alert-error');
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = new FormData(signupForm);
            const res = await fetch(`${API}/signup`, {
                method: 'POST',
                body: data,
                credentials: 'include'
            });
            const result = await res.json();
            if (res.ok) {
                // Optionally login after signup
                const loginRes = await fetch(`${API}/login`, {
                    method: 'POST',
                    body: new URLSearchParams({
                        username: data.get('username'),
                        password: data.get('password')
                    }),
                    credentials: 'include'
                });
                const loginResult = await loginRes.json();
                if (loginRes.ok) {
                    localStorage.setItem('access_token', loginResult.access_token);
                    window.location.href = '/upload_video.html';
                } else {
                    showAlert('Signup succeeded, but auto-login failed', 'alert-error');
                }
            } else {
                showAlert(result.detail || 'Signup failed', 'alert-error');
            }
        });
    }
});

function showAlert(msg, className) {
    const alert = document.getElementById('alert');
    alert.textContent = msg;
    alert.className = `alert ${className}`;
    alert.classList.remove('hidden');
}
