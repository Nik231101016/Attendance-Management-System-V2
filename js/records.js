var _recordsInitialized = false;

function initRecords() {
    if (_recordsInitialized) return;
    _recordsInitialized = true;

    seedDemoData();
    migrateOldRecords();

    /* Populate class filter */
    var select = document.getElementById('recordClassFilter');
    if (!select) return;

    var classes = getClassNames();
    select.innerHTML = '<option value="all">All Classes</option>';
    classes.forEach(function(c) {
        select.innerHTML += '<option value="' + c + '">' + c + '</option>';
    });
}

function renderRecordsTable() {
    initRecords();

    var search = (document.getElementById('recordSearch').value || '').toLowerCase();
    var classFilter = document.getElementById('recordClassFilter').value;
    var tbody = document.getElementById('recordsTable');
    var emptyEl = document.getElementById('recordsEmpty');
    if (!tbody) return;

    var records = getRecords().filter(function(r) {
        var matchSearch = !search || r.name.toLowerCase().indexOf(search) !== -1 || r.rollNo.toLowerCase().indexOf(search) !== -1;
        var matchClass = classFilter === 'all' || r.className === classFilter;
        return matchSearch && matchClass;
    }).sort(function(a, b) { return (b.timestamp || 0) - (a.timestamp || 0); });

    if (records.length === 0) {
        tbody.innerHTML = '';
        if (emptyEl) emptyEl.classList.remove('hidden');
        return;
    }

    if (emptyEl) emptyEl.classList.add('hidden');

    tbody.innerHTML = records.map(function(r) {
        var badge = r.status === 'present'
            ? '<span class="badge badge-success">Present</span>'
            : '<span class="badge badge-danger">Absent</span>';
        var stats = getStudentStats(r.id);

        return '<tr>' +
            '<td><div class="student-cell">' +
                '<div class="student-avatar-sm" style="background:' + pctColor(stats.pct) + '15;color:' + pctColor(stats.pct) + '">' + getInitials(r.name) + '</div>' +
                '<span class="student-name">' + r.name + '</span>' +
            '</div></td>' +
            '<td style="color:var(--text-secondary);font-family:monospace;font-size:0.8125rem">' + r.rollNo + '</td>' +
            '<td class="hide-mobile"><span class="badge" style="background:var(--info-subtle);color:var(--info)">' + r.className + '</span></td>' +
            '<td style="color:var(--text-secondary)">' + formatDate(r.date) + '</td>' +
            '<td>' + badge + '</td>' +
        '</tr>';
    }).join('');
}