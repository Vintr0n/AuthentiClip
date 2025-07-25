document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('upload-form');
    const verifyForm = document.getElementById('verify-form');
    const logoutBtn = document.getElementById('logout-btn');

    const token = localStorage.getItem('access_token');
    if (!token) {
        window.location.href = '/index.html';
        return;
    }

    if (uploadForm) {
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fileInput = document.querySelector('#upload');
            const file = fileInput.files[0];
            if (!file) return alert("Select a file");

            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/video/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const result = await res.json();
            alert(result.detail || result.message || 'Upload complete');
        });
    }

    if (verifyForm) {
        verifyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fileInput = document.querySelector('#verify');
            const file = fileInput.files[0];
            const target = document.querySelector('#target-username').value;
            if (!file || !target) return alert("Fill all fields");

            const formData = new FormData();
            formData.append('file', file);
            formData.append('target_username', target);

            const res = await fetch('/video/verify', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const result = await res.json();
            alert(result.detail || (result.match ? 'Match' : 'No match'));
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('access_token');
            window.location.href = '/index.html';
        });
    }
});
