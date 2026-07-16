// Login logic
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value.trim().toLowerCase();
        if (user === 'admin' || user === 'student') {
            localStorage.setItem('role', user);
            window.location.href = 'dashboard.html';
        } else {
            alert('Please enter "student" or "admin" to log in.');
        }
    });
}

// Dashboard Logic
document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.href.includes('dashboard.html')) return;
    
    const role = localStorage.getItem('role');
    if (!role) { window.location.href = 'index.html'; return; }

    document.getElementById('welcomeText').innerText = `Role: ${role.toUpperCase()}`;
    
    if (role === 'student') {
        document.getElementById('studentView').classList.remove('hidden');
        document.getElementById('currentDate').innerText = new Date().toLocaleDateString();
    } else if (role === 'admin') {
        document.getElementById('adminView').classList.remove('hidden');
        loadAttendanceRecords();
    }
});

function markAttendance() {
    let records = JSON.parse(localStorage.getItem('attendance')) || [];
    const newRecord = { name: "Demo Student", date: new Date().toLocaleDateString(), status: "Present" };
    records.push(newRecord);
    localStorage.setItem('attendance', JSON.stringify(records));
    alert('Attendance Marked Successfully!');
    document.getElementById('markBtn').disabled = true;
    document.getElementById('markBtn').innerText = "Marked";
}

function loadAttendanceRecords() {
    const tableBody = document.getElementById('attendanceLogTable');
    let records = JSON.parse(localStorage.getItem('attendance')) || [
        { name: "John Doe", date: "7/15/2026", status: "Present" },
        { name: "Alex Smith", date: "7/16/2026", status: "Present" }
    ];
    tableBody.innerHTML = records.map(r => `<tr><td>${r.name}</td><td>${r.date}</td><td>${r.status}</td></tr>`).join('');
}

function logout() {
    localStorage.removeItem('role');
    window.location.href = 'index.html';
}