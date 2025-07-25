const VIDEO_API = '/video';

document.addEventListener('DOMContentLoaded', () => {
    if (!document.cookie.includes('session')) {
        window.location.href = 'index.html';
    }

    const uploadForm = document.getElementById('upload-form');
    const verifyForm = document.getElementById('verify-form');

    if (uploadForm) {
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = new FormData(uploadForm);
            const res = await fetch(`${VIDEO_API}/upload`, {
                method: 'POST',
                body: data,
                credentials: 'include'
            });
            handleVideoResponse(res);
        });
    }

    if (verifyForm) {
        verifyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = new FormData(verifyForm);
            const res = await fetch(`${VIDEO_API}/verify`, {
                method: 'POST',
                body: data,
                credentials: 'include'
            });
            handleVideoResponse(res);
        });
    }
});

function handleVideoResponse(res) {
    res.json().then(data => {
        if (res.ok) {
            showAlert(data.message || 'Success', 'alert-success');
        } else {
            showAlert(data.message || 'Failed', 'alert-error');
        }
    });
}

function showAlert(msg, className) {
    const alert = document.getElementById('alert');
    alert.textContent = msg;
    alert.className = `alert ${className}`;
    alert.classList.remove('hidden');
}
