/* ===== Data Layer (localStorage) ===== */

var DEMO_STUDENTS = [
    { id: 'STU001', name: 'Arjun Sharma',    rollNo: 'CS-01', className: 'CS-101' },
    { id: 'STU002', name: 'Priya Patel',     rollNo: 'CS-02', className: 'CS-101' },
    { id: 'STU003', name: 'Rohan Mehta',     rollNo: 'CS-03', className: 'CS-101' },
    { id: 'STU004', name: 'Sneha Gupta',     rollNo: 'CS-04', className: 'CS-101' },
    { id: 'STU005', name: 'Vikram Singh',    rollNo: 'CS-05', className: 'CS-102' },
    { id: 'STU006', name: 'Ananya Reddy',    rollNo: 'CS-06', className: 'CS-102' },
    { id: 'STU007', name: 'Karthik Iyer',    rollNo: 'CS-07', className: 'CS-102' },
    { id: 'STU008', name: 'Divya Nair',      rollNo: 'CS-08', className: 'CS-102' },
    { id: 'STU009', name: 'Rahul Verma',     rollNo: 'CS-09', className: 'CS-201' },
    { id: 'STU010', name: 'Meera Joshi',     rollNo: 'CS-10', className: 'CS-201' },
    { id: 'STU011', name: 'Aditya Kumar',    rollNo: 'CS-11', className: 'CS-201' },
    { id: 'STU012', name: 'Pooja Desai',     rollNo: 'CS-12', className: 'CS-201' }
];

/* Students who are natural defaulters */
var DEFAULTER_IDS = ['STU004', 'STU007', 'STU011'];

function getStudents() {
    return JSON.parse(localStorage.getItem('attendx_students')) || DEMO_STUDENTS;
}

function getRecords() {
    return JSON.parse(localStorage.getItem('attendance')) || [];
}

function saveRecords(records) {
    localStorage.setItem('attendance', JSON.stringify(records));
}

function addRecord(record) {
    var records = getRecords();
    /* Remove existing record for same student+date to avoid duplicates */
    records = records.filter(function(r) {
        return !(r.id === record.id && r.date === record.date);
    });
    records.push(record);
    saveRecords(records);
}

function getStudentRecords(studentId) {
    return getRecords().filter(function(r) { return r.id === studentId; });
}

/* Calculate attendance stats for a student */
function getStudentStats(studentId) {
    var recs = getStudentRecords(studentId);
    var total = recs.length;
    var present = recs.filter(function(r) { return r.status === 'present'; }).length;
    var pct = total > 0 ? Math.round((present / total) * 100) : 0;
    return { total: total, present: present, absent: total - present, pct: pct };
}

/* Get all student stats */
function getAllStudentStats() {
    var students = getStudents();
    return students.map(function(s) {
        var stats = getStudentStats(s.id);
        return { student: s, stats: stats };
    });
}

/* Get defaulters (below 75%) */
function getDefaulters() {
    return getAllStudentStats()
        .filter(function(item) { return item.stats.pct < 75; })
        .sort(function(a, b) { return a.stats.pct - b.stats.pct; });
}

/* Get unique class names */
function getClassNames() {
    var students = getStudents();
    var classes = [];
    students.forEach(function(s) {
        if (classes.indexOf(s.className) === -1) classes.push(s.className);
    });
    return classes.sort();
}

/* Get daily attendance rate for a specific date */
function getDailyRate(dateStr) {
    var recs = getRecords().filter(function(r) { return r.date === dateStr; });
    if (recs.length === 0) return 0;
    var present = recs.filter(function(r) { return r.status === 'present'; }).length;
    return Math.round((present / recs.length) * 100);
}

/* Get unique dates from records, sorted */
function getUniqueDates() {
    var dates = {};
    getRecords().forEach(function(r) { dates[r.date] = true; });
    return Object.keys(dates).sort();
}

/* Seed demo data on first admin login */
function seedDemoData() {
    if (localStorage.getItem('attendx_seeded')) return;

    var records = [];
    var today = new Date();
    var dayCount = 0;
    var d = new Date(today);

    DEMO_STUDENTS.forEach(function(student) {
        dayCount = 0;
        d = new Date(today);
        while (dayCount < 20) {
            d.setDate(d.getDate() - 1);
            if (d.getDay() === 0 || d.getDay() === 6) continue;
            dayCount++;

            var isDefaulter = DEFAULTER_IDS.indexOf(student.id) !== -1;
            var rate = isDefaulter ? (0.55 + Math.random() * 0.15) : (0.82 + Math.random() * 0.13);

            records.push({
                id: student.id,
                name: student.name,
                rollNo: student.rollNo,
                className: student.className,
                date: d.toISOString().split('T')[0],
                status: Math.random() < rate ? 'present' : 'absent',
                timestamp: d.getTime()
            });
        }
    });

    saveRecords(records);
    localStorage.setItem('attendx_students', JSON.stringify(DEMO_STUDENTS));
    localStorage.setItem('attendx_seeded', 'true');
}

/* Migrate old-format records (from original project) */
function migrateOldRecords() {
    if (localStorage.getItem('attendx_migrated')) return;
    var records = getRecords();
    var needsMigration = records.length > 0 && !records[0].id;

    if (needsMigration) {
        var migrated = records.map(function(r, i) {
            return {
                id: 'STU001',
                name: r.name || 'Demo Student',
                rollNo: 'CS-01',
                className: 'CS-101',
                date: r.date ? new Date(r.date).toISOString().split('T')[0] : todayStr(),
                status: (r.status || 'present').toLowerCase(),
                timestamp: Date.now() + i
            };
        });
        saveRecords(migrated);
    }
    localStorage.setItem('attendx_migrated', 'true');
}