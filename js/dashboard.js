var trendChart = null;
var doughnutChart = null;

function renderAdminOverview() {
    seedDemoData();
    migrateOldRecords();

    var students = getStudents();
    var allStats = getAllStudentStats();
    var totalStudents = students.length;

    /* Average attendance */
    var totalPct = 0;
    allStats.forEach(function(item) { totalPct += item.stats.pct; });
    var avgPct = totalStudents > 0 ? Math.round(totalPct / totalStudents) : 0;

    /* Today's rate */
    var todayRate = getDailyRate(todayStr());

    /* Defaulter count */
    var defaulterCount = getDefaulters().length;

    /* Update stat cards */
    setText('admTotalStudents', totalStudents);
    setText('admAvgPct', avgPct + '%');
    setText('admTodayPct', todayRate > 0 ? todayRate + '%' : 'N/A');
    setText('admDefaulterCount', defaulterCount);

    /* Update defaulter badge */
    var badge = document.getElementById('defaulterBadge');
    if (badge) {
        badge.textContent = defaulterCount;
        badge.style.display = defaulterCount > 0 ? 'inline' : 'none';
    }

    renderTrendChart();
    renderDoughnutChart();
    renderRecentActivity();
}

function renderTrendChart() {
    var ctx = document.getElementById('trendChart');
    if (!ctx) return;
    if (trendChart) trendChart.destroy();

    var dates = getUniqueDates().slice(-15);
    var data = dates.map(function(d) { return getDailyRate(d); });
    var labels = dates.map(formatDateShort);

    trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Attendance %',
                data: data,
                borderColor: '#10B981',
                backgroundColor: function(context) {
                    var chart = context.chart;
                    var g = chart.ctx.createLinearGradient(0, 0, 0, 260);
                    g.addColorStop(0, 'rgba(16,185,129,0.2)');
                    g.addColorStop(1, 'rgba(16,185,129,0.0)');
                    return g;
                },
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointBackgroundColor: '#10B981',
                pointBorderColor: '#161B28',
                pointBorderWidth: 2,
                borderWidth: 2.5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1C2234',
                    titleColor: '#E8ECF4',
                    bodyColor: '#8892A8',
                    borderColor: '#2E3650',
                    borderWidth: 1,
                    padding: 10,
                    cornerRadius: 8,
                    callbacks: { label: function(c) { return 'Attendance: ' + c.raw + '%'; } }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(35,42,59,0.5)', drawBorder: false },
                    ticks: { color: '#505B73', font: { size: 10 }, maxRotation: 45 }
                },
                y: {
                    min: 40, max: 100,
                    grid: { color: 'rgba(35,42,59,0.5)', drawBorder: false },
                    ticks: { color: '#505B73', font: { size: 10 }, callback: function(v) { return v + '%'; } }
                }
            }
        }
    });
}

function renderDoughnutChart() {
    var ctx = document.getElementById('doughnutChart');
    if (!ctx) return;
    if (doughnutChart) doughnutChart.destroy();

    var todayRecs = getRecords().filter(function(r) { return r.date === todayStr(); });
    var present = todayRecs.filter(function(r) { return r.status === 'present'; }).length;
    var absent = todayRecs.length - present;

    if (todayRecs.length === 0) { present = 0; absent = 1; }

    doughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: todayRecs.length > 0 ? ['Present', 'Absent'] : ['No Data'],
            datasets: [{
                data: todayRecs.length > 0 ? [present, absent] : [1],
                backgroundColor: todayRecs.length > 0 ? ['#10B981', '#EF4444'] : ['#2E3650'],
                borderColor: '#161B28',
                borderWidth: 3,
                hoverOffset: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '72%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#8892A8', padding: 16, font: { size: 12 }, usePointStyle: true, pointStyleWidth: 8 }
                },
                tooltip: {
                    backgroundColor: '#1C2234',
                    titleColor: '#E8ECF4',
                    bodyColor: '#8892A8',
                    borderColor: '#2E3650',
                    borderWidth: 1,
                    padding: 10,
                    cornerRadius: 8
                }
            }
        }
    });
}

function renderRecentActivity() {
    var tbody = document.getElementById('recentActivityTable');
    if (!tbody) return;

    var records = getRecords().slice().sort(function(a, b) { return (b.timestamp || 0) - (a.timestamp || 0); }).slice(0, 10);

    tbody.innerHTML = records.map(function(r) {
        var statusBadge = r.status === 'present'
            ? '<span class="badge badge-success">Present</span>'
            : '<span class="badge badge-danger">Absent</span>';
        return '<tr>' +
            '<td><div class="student-cell">' +
                '<div class="student-avatar-sm" style="background:' + pctColor(getStudentStats(r.id).pct) + '15;color:' + pctColor(getStudentStats(r.id).pct) + '">' + getInitials(r.name) + '</div>' +
                '<span class="student-name">' + r.name + '</span>' +
            '</div></td>' +
            '<td style="color:var(--text-secondary);font-family:monospace;font-size:0.8125rem">' + r.rollNo + '</td>' +
            '<td><span class="badge badge-warning" style="background:var(--info-subtle);color:var(--info)">' + r.className + '</span></td>' +
            '<td style="color:var(--text-secondary)">' + formatDate(r.date) + '</td>' +
            '<td>' + statusBadge + '</td>' +
        '</tr>';
    }).join('');
}

/* Helper to safely set text */
function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
}