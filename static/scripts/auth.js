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
            handleResponse(res, 'upload_video.html');
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
            handleResponse(res, 'upload_video.html');
        });
    }
});

function handleResponse(res, successRedirect) {
    res.json().then(data => {
        if (res.ok) {
            window.location.href = successRedirect;
        } else {
            showAlert(data.message || 'Error occurred', 'alert-error');
        }
    });
}

function logout() {
    fetch(`${API}/logout`, { method: 'POST', credentials: 'include' }).then(() => {
        document.cookie = 'session=; Max-Age=0';
        window.location.href = 'index.html';
    });
}

function showAlert(msg, className) {
    const alert = document.getElementById('alert');
    alert.textContent = msg;
    alert.className = `alert ${className}`;
}
