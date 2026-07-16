/* ===== Toast Notifications ===== */
function showToast(message, type) {
    type = type || 'success';
    var container = document.getElementById('toastContainer');
    if (!container) return;
    var icons = { success: 'fa-check-circle', error: 'fa-circle-xmark', info: 'fa-circle-info' };
    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.innerHTML = '<i class="fa-solid ' + (icons[type] || icons.info) + '"></i><span>' + message + '</span>';
    container.appendChild(toast);
    setTimeout(function() { if (toast.parentNode) toast.remove(); }, 3100);
}

/* ===== Date Helpers ===== */
function formatDate(dateStr) {
    var d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateShort(dateStr) {
    var d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function todayStr() {
    return new Date().toISOString().split('T')[0];
}

function todayDisplay() {
    return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

/* ===== String Helpers ===== */
function getInitials(name) {
    return name.split(' ').map(function(w) { return w[0]; }).join('').toUpperCase();
}

function pctColor(pct) {
    if (pct >= 85) return 'var(--accent)';
    if (pct >= 75) return 'var(--warning)';
    return 'var(--danger)';
}

function pctColorHex(pct) {
    if (pct >= 85) return '#10B981';
    if (pct >= 75) return '#F59E0B';
    return '#EF4444';
}

/* ===== Modal ===== */
var _modalCallback = null;

function openModal(bodyHTML, onConfirm) {
    document.getElementById('modalBody').innerHTML = bodyHTML;
    document.getElementById('confirmModal').classList.remove('hidden');
    _modalCallback = onConfirm || null;
}

function closeModal() {
    document.getElementById('confirmModal').classList.add('hidden');
    _modalCallback = null;
}

function confirmModalAction() {
    if (_modalCallback) _modalCallback();
    closeModal();
}

/* Escape key closes modal */
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
});