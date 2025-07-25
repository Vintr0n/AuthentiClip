const VIDEO_API = '/video';

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('access_token');

    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    const uploadForm = document.getElementById('upload-form');
    const verifyForm = document.getElementById('verify-form');

    if (uploadForm) {
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(uploadForm);
            const res = await fetch(`${VIDEO_API}/upload`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await res.json();
            if (res.ok) {
                showAlert('Upload successful.', 'alert-success');
            } else {
                showAlert(result.detail || 'Upload failed', 'alert-error');
            }
        });
    }

    if (verifyForm) {
        verifyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(verifyForm);
            const res = await fetch(`${VIDEO_API}/verify`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await res.json();
            if (res.ok) {
                showAlert(result.message || 'Verification complete', 'alert-success');
            } else {
                showAlert(result.detail || 'Verification failed', 'alert-error');
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
