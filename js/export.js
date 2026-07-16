/* ===== CSV Export ===== */
function downloadCSV(data, filename) {
    if (!data || data.length === 0) {
        showToast('No data to export', 'error');
        return;
    }

    var headers = Object.keys(data[0]);
    var csvRows = [headers.join(',')];

    data.forEach(function(row) {
        var values = headers.map(function(h) {
            var val = row[h];
            if (typeof val === 'string' && (val.indexOf(',') !== -1 || val.indexOf('"') !== -1)) {
                val = '"' + val.replace(/"/g, '""') + '"';
            }
            return val;
        });
        csvRows.push(values.join(','));
    });

    var csvString = csvRows.join('\n');
    var blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Exported ' + data.length + ' records to CSV', 'success');
}

function exportRecordsCSV() {
    var search = (document.getElementById('recordSearch').value || '').toLowerCase();
    var classFilter = document.getElementById('recordClassFilter').value;

    var records = getRecords().filter(function(r) {
        var matchSearch = !search || r.name.toLowerCase().indexOf(search) !== -1 || r.rollNo.toLowerCase().indexOf(search) !== -1;
        var matchClass = classFilter === 'all' || r.className === classFilter;
        return matchSearch && matchClass;
    });

    var data = records.map(function(r) {
        return {
            'Roll No': r.rollNo,
            'Name': r.name,
            'Class': r.className,
            'Date': r.date,
            'Status': r.status.charAt(0).toUpperCase() + r.status.slice(1)
        };
    });

    downloadCSV(data, 'AttendX_Records_' + todayStr() + '.csv');
}

function exportDefaultersCSV() {
    var defaulters = getDefaulters();
    var data = defaulters.map(function(item) {
        return {
            'Roll No': item.student.rollNo,
            'Name': item.student.name,
            'Class': item.student.className,
            'Total Classes': item.stats.total,
            'Present': item.stats.present,
            'Absent': item.stats.absent,
            'Attendance %': item.stats.pct + '%',
            'Shortfall': (75 - item.stats.pct) + '%'
        };
    });

    downloadCSV(data, 'AttendX_Defaulters_' + todayStr() + '.csv');
}