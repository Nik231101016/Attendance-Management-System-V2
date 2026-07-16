/* ===== Page Titles Config ===== */
var PAGE_TITLES = {
    'student-mark':      ['Mark Attendance', 'Record your attendance for today'],
    'student-history':   ['My History', 'View your past attendance records'],
    'admin-overview':    ['Overview', 'Analytics and attendance insights'],
    'admin-mark':        ['Mark Attendance', 'Record attendance for any student'],
    'admin-records':     ['Records', 'View and export all attendance data'],
    'admin-defaulters':  ['Defaulters', 'Students with attendance below 75%']
};

var currentView = '';

/* ===== Navigation ===== */
function navigateTo(viewId) {
    currentView = viewId;

    /* Update panels */
    document.querySelectorAll('.view-panel').forEach(function(p) {
        p.classList.remove('active');
    });
    var target = document.getElementById('view-' + viewId);
    if (target) target.classList.add('active');

    /* Update nav items */
    document.querySelectorAll('.nav-item').forEach(function(item) {
        item.classList.toggle('active', item.getAttribute('data-view') === viewId);
    });

    /* Update topbar */
    var info = PAGE_TITLES[viewId] || ['Dashboard', ''];
    setText('pageTitle', info[0]);
    setText('pageSubtitle', info[1]);

    /* Render view content */
    switch (viewId) {
        case 'student-mark':    initStudentMark(); break;
        case 'student-history': renderStudentHistory(); break;
        case 'admin-overview':  renderAdminOverview(); break;
        case 'admin-mark':      initAdminMark(); break;
        case 'admin-records':   renderRecordsTable(); break;
        case 'admin-defaulters': renderDefaulters(); break;
    }

    /* Close sidebar on mobile */
    if (window.innerWidth < 768) toggleSidebar(false);
}

/* ===== Sidebar Toggle (mobile) ===== */
function toggleSidebar(forceState) {
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebarOverlay');
    var isOpen = sidebar.classList.contains('open');
    var shouldOpen = forceState !== undefined ? forceState : !isOpen;

    sidebar.classList.toggle('open', shouldOpen);
    overlay.classList.toggle('show', shouldOpen);
}

/* ===== Dashboard Init ===== */
function initDashboard() {
    var role = localStorage.getItem('role');

    if (!role) {
        window.location.href = 'index.html';
        return;
    }

    /* Show/hide nav groups based on role */
    document.querySelectorAll('.nav-group').forEach(function(group) {
        var groupRole = group.getAttribute('data-role');
        group.style.display = groupRole === role ? 'block' : 'none';
    });

    /* Set user info */
    setText('userName', role === 'admin' ? 'Admin User' : 'Demo Student');
    setText('userRole', role === 'admin' ? 'Administrator' : 'Student');
    var avatar = document.getElementById('userAvatar');
    if (avatar) avatar.textContent = role === 'admin' ? 'A' : 'DS';

    /* Set date */
    setText('topbarDate', todayDisplay());

    /* Navigate to default view */
    var defaultView = role === 'admin' ? 'admin-overview' : 'student-mark';
    navigateTo(defaultView);
}

/* ===== Boot ===== */
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('sidebar')) {
        initDashboard();
    }
});