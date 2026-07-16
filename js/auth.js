/* ===== Login Page Logic ===== */
var loginForm = document.getElementById('loginForm');

if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var user = document.getElementById('username').value.trim().toLowerCase();

        if (user === 'admin' || user === 'student') {
            localStorage.setItem('role', user);
            window.location.href = 'dashboard.html';
        } else {
            showToast('Please enter "student" or "admin" to log in', 'error');
        }
    });
}

/* Role card quick-select */
function selectRole(role) {
    document.getElementById('username').value = role;
    document.querySelectorAll('.role-card').forEach(function(card) {
        card.classList.toggle('selected', card.getAttribute('data-role') === role);
    });
}

/* ===== Logout ===== */
function logout() {
    localStorage.removeItem('role');
    window.location.href = 'index.html';
}