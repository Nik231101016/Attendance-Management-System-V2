function renderDefaulters() {
    seedDemoData();
    migrateOldRecords();

    var defaulters = getDefaulters();
    var students = getStudents();
    var classes = getClassNames();

    /* Summary cards per class */
    var summaryEl = document.getElementById('defaulterSummary');
    if (summaryEl) {
        summaryEl.innerHTML = classes.map(function(cls) {
            var count = defaulters.filter(function(d) { return d.student.className === cls; }).length;
            var total = students.filter(function(s) { return s.className === cls; }).length;
            return '<div class="defaulter-class-card">' +
                '<p class="dcc-label">' + cls + '</p>' +
                '<p class="dcc-value" style="color:' + (count > 0 ? 'var(--danger)' : 'var(--accent)') + '">' + count + '</p>' +
                '<p class="dcc-sub">' + (count > 0 ? 'defaulters' : 'all safe') + ' (' + total + ' students)</p>' +
            '</div>';
        }).join('');
    }

    /* Count badge */
    var countBadge = document.getElementById('defaulterCountBadge');
    if (countBadge) countBadge.textContent = defaulters.length;

    /* Table */
    var tbody = document.getElementById('defaultersTable');
    var emptyEl = document.getElementById('defaultersEmpty');
    if (!tbody) return;

    if (defaulters.length === 0) {
        tbody.innerHTML = '';
        if (emptyEl) emptyEl.classList.remove('hidden');
        return;
    }

    if (emptyEl) emptyEl.classList.add('hidden');

    tbody.innerHTML = defaulters.map(function(item) {
        var s = item.student;
        var st = item.stats;
        var color = pctColorHex(st.pct);

        return '<tr class="defaulter-row">' +
            '<td><div class="student-cell">' +
                '<div class="student-avatar-sm" style="background:rgba(239,68,68,0.15);color:var(--danger)">' + getInitials(s.name) + '</div>' +
                '<span class="student-name">' + s.name + '</span>' +
            '</div></td>' +
            '<td style="color:var(--text-secondary);font-family:monospace;font-size:0.8125rem">' + s.rollNo + '</td>' +
            '<td class="hide-mobile"><span class="badge" style="background:var(--info-subtle);color:var(--info)">' + s.className + '</span></td>' +
            '<td style="color:var(--text-secondary)">' + st.present + ' / ' + st.total + '</td>' +
            '<td><div class="progress-cell">' +
                '<div class="progress-bar"><div class="progress-fill" style="width:' + st.pct + '%;background:' + color + '"></div></div>' +
                '<span class="pct" style="color:' + color + '">' + st.pct + '%</span>' +
            '</div></td>' +
            '<td><span class="badge badge-danger">Defaulter</span></td>' +
        '</tr>';
    }).join('');
}