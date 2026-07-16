/* ===== Student: Mark Attendance ===== */
function initStudentMark() {
    migrateOldRecords();

    var dateEl = document.getElementById('currentDate');
    if (dateEl) dateEl.textContent = formatDate(todayStr());

    /* Check if already marked today */
    var todayRecs = getRecords().filter(function(r) {
        return r.id === 'STU001' && r.date === todayStr();
    });

    var btn = document.getElementById('markBtn');
    if (todayRecs.length > 0) {
        if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-circle-check"></i><span>Already Marked</span>'; }
    }

    /* Show student stats */
    var stats = getStudentStats('STU001');
    setText('stuTotalClasses', stats.total);
    setText('stuPresentCount', stats.present);
    setText('stuAttPct', stats.pct + '%');
}

function markAttendance() {
    var record = {
        id: 'STU001',
        name: 'Demo Student',
        rollNo: 'CS-01',
        className: 'CS-101',
        date: todayStr(),
        status: 'present',
        timestamp: Date.now()
    };

    addRecord(record);
    showToast('Attendance marked successfully!', 'success');

    var btn = document.getElementById('markBtn');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-circle-check"></i><span>Already Marked</span>'; }

    /* Refresh stats */
    var stats = getStudentStats('STU001');
    setText('stuTotalClasses', stats.total);
    setText('stuPresentCount', stats.present);
    setText('stuAttPct', stats.pct + '%');
}

/* ===== Student: History ===== */
function renderStudentHistory() {
    migrateOldRecords();

    var tbody = document.getElementById('studentHistoryTable');
    var emptyEl = document.getElementById('studentHistoryEmpty');
    if (!tbody) return;

    var records = getStudentRecords('STU001').slice().sort(function(a, b) {
        return (b.timestamp || 0) - (a.timestamp || 0);
    });

    if (records.length === 0) {
        tbody.innerHTML = '';
        if (emptyEl) emptyEl.classList.remove('hidden');
        return;
    }

    if (emptyEl) emptyEl.classList.add('hidden');

    tbody.innerHTML = records.map(function(r, i) {
        var badge = r.status === 'present'
            ? '<span class="badge badge-success">Present</span>'
            : '<span class="badge badge-danger">Absent</span>';
        return '<tr>' +
            '<td style="color:var(--text-muted)">' + (i + 1) + '</td>' +
            '<td>' + formatDate(r.date) + '</td>' +
            '<td>' + badge + '</td>' +
        '</tr>';
    }).join('');
}

/* ===== Admin: Mark Attendance Form ===== */
function initAdminMark() {
    seedDemoData();
    migrateOldRecords();

    var select = document.getElementById('admStudent');
    var dateInput = document.getElementById('admDate');
    if (!select) return;

    /* Populate student dropdown */
    var students = getStudents();
    select.innerHTML = '<option value="">Select student</option>';
    students.forEach(function(s) {
        select.innerHTML += '<option value="' + s.id + '">' + s.name + ' (' + s.rollNo + ')</option>';
    });

    /* Set default date to today */
    if (dateInput) {
        dateInput.value = todayStr();
        dateInput.max = todayStr();
    }

    /* Toggle button visual feedback */
    var radios = document.querySelectorAll('input[name="admStatus"]');
    radios.forEach(function(r) {
        r.addEventListener('change', function() {
            document.getElementById('togglePresent').style.borderColor = '';
            document.getElementById('togglePresent').style.color = '';
            document.getElementById('togglePresent').style.background = '';
            document.getElementById('toggleAbsent').style.borderColor = '';
            document.getElementById('toggleAbsent').style.color = '';
            document.getElementById('toggleAbsent').style.background = '';
        });
    });
}

function adminMarkAttendance(e) {
    e.preventDefault();

    var studentId = document.getElementById('admStudent').value;
    var date = document.getElementById('admDate').value;
    var status = document.querySelector('input[name="admStatus"]:checked').value;

    if (!studentId) {
        showToast('Please select a student', 'error');
        return;
    }
    if (!date) {
        showToast('Please select a date', 'error');
        return;
    }

    var student = getStudents().find(function(s) { return s.id === studentId; });
    if (!student) return;

    /* Check for duplicate */
    var existing = getRecords().find(function(r) { return r.id === studentId && r.date === date; });

    var bodyHTML = '<p>Confirm attendance for:</p>' +
        '<div style="background:var(--bg-body);border-radius:var(--radius-md);padding:14px;margin-top:10px">' +
        '<p style="font-weight:600;color:var(--text-primary)"><i class="fa-solid fa-user" style="color:var(--accent);margin-right:8px"></i>' + student.name + ' <span style="color:var(--text-muted)">(' + student.rollNo + ')</span></p>' +
        '<p style="font-size:0.8125rem;color:var(--text-secondary);margin-top:4px"><i class="fa-solid fa-calendar" style="margin-right:8px"></i>' + formatDate(date) + '</p>' +
        '</div>' +
        '<p style="margin-top:10px">Status: <strong style="color:' + (status === 'present' ? 'var(--accent)' : 'var(--danger)') + '">' + status.charAt(0).toUpperCase() + status.slice(1) + '</strong></p>' +
        (existing ? '<p style="margin-top:8px;color:var(--warning);font-size:0.8125rem"><i class="fa-solid fa-exclamation-circle" style="margin-right:4px"></i>This will overwrite the existing record.</p>' : '');

    openModal(bodyHTML, function() {
        var record = {
            id: student.id,
            name: student.name,
            rollNo: student.rollNo,
            className: student.className,
            date: date,
            status: status,
            timestamp: new Date(date + 'T12:00:00').getTime()
        };

        addRecord(record);
        showToast('Attendance recorded for ' + student.name, 'success');

        /* Reset form */
        document.getElementById('admStudent').value = '';
    });
}