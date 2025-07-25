document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
        window.location.href = '/index.html';
        return;
    }

    const uploadForm = document.getElementById('upload-form');
    const verifyForm = document.getElementById('verify-form');
    const alertBox = document.getElementById('alert');

    const showAlert = (msg, type = 'error') => {
        alertBox.textContent = msg;
        alertBox.className = type === 'error' ? 'alert alert-error' : 'alert alert-success';
        alertBox.classList.remove('hidden');
    };

    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        const fileInput = document.getElementById('upload');
        if (!fileInput.files.length) {
            showAlert("Please select a video to upload.");
            return;
        }
        formData.append('file', fileInput.files[0]);

        const res = await fetch('/video/upload', {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (res.ok) {
            showAlert("Upload successful!", 'success');
        } else {
            const err = await res.json().catch(() => ({}));
            showAlert(err.detail || '[Upload] Unexpected error occurred.');
        }
    });

    verifyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        const fileInput = document.getElementById('verify');
        if (!fileInput.files.length) {
            showAlert("Please select a video to verify.");
            return;
        }
        formData.append('file', fileInput.files[0]);

        const res = await fetch('/video/verify', {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (res.ok) {
            const result = await res.json();
            showAlert(`Verification: ${result.message || 'Success'}`, 'success');
        } else {
            const err = await res.json().catch(() => ({}));
            showAlert(err.detail || '[Verify] Unexpected error occurred.');
        }
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('access_token');
        window.location.href = '/index.html';
    });
});
