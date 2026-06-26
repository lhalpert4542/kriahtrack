// ============================================================
// KriahTrack — Connected App Bootstrap
// Real data only — no demo data fallback
// ============================================================

let currentPage = 'dashboard';
let profileTab = 'overview';
let chartInstances = {};

function setLoadProgress(pct, msg) {
  const bar = document.getElementById('loadBar');
  const lbl = document.getElementById('loadMsg');
  if (bar) bar.style.width = pct + '%';
  if (lbl) lbl.textContent = msg;
}

async function bootstrap() {
  const failsafe = setTimeout(() => {
    showError('Connection timeout. Please refresh the page.');
  }, 12000);

  try {
    setLoadProgress(15, 'Connecting to server...');
    await API.health();

    setLoadProgress(30, 'Loading providers...');
    DB.providers = await API.getProviders();

    setLoadProgress(50, 'Loading students...');
    const rawStudents = await API.getStudents();
    DB.students = rawStudents.map(s => ({
      ...s,
      firstName:  s.first_name  || s.firstName  || '',
      lastName:   s.last_name   || s.lastName   || '',
      providerId: s.provider_id || s.providerId || '',
    }));

    setLoadProgress(70, 'Loading assessments...');
    const rawAssessments = await API.getAssessments();
    DB.assessments = rawAssessments.map(normalizeAssessment);

    setLoadProgress(85, 'Loading logs...');
    try {
      DB.systemLog  = await API.getSystemLogs();
      const audit   = await API.getAuditLogs();
      DB.auditLog   = audit.map(r => ({
        ...r,
        entityName: r.entity_name || r.entityName || '',
        before:     r.before_val  || r.before     || '',
        after:      r.after_val   || r.after       || '',
        user:       r.user_name   || r.user        || 'Admin',
        timestamp:  r.created_at  || r.timestamp   || '',
      }));
      DB.ocrImports = await API.getOCRImports();
    } catch(logErr) {
      console.warn('Logs load failed (non-fatal):', logErr);
    }

    setLoadProgress(100, 'Ready!');
    clearTimeout(failsafe);
    updateServerStatus(true);
    setTimeout(() => showApp(), 300);

  } catch (err) {
    clearTimeout(failsafe);
    console.error('Bootstrap failed:', err);
    showError('Could not connect to server. Please check your connection and refresh.');
  }
}

function showApp() {
  const loading = document.getElementById('loadingScreen');
  const shell   = document.getElementById('appShell');
  if (loading) loading.style.display = 'none';
  if (shell)   shell.style.display   = 'flex';
  updateBadges();
  navigate('dashboard');
  setTimeout(() => showToast('KriahTrack loaded successfully', 'success'), 500);
}

function showError(message) {
  const loading = document.getElementById('loadingScreen');
  if (loading) {
    loading.innerHTML = `
      <img src="assets/logo.png" style="width:80px;height:80px;object-fit:contain;margin-bottom:20px;filter:drop-shadow(0 4px 12px rgba(0,0,0,0.4))" onerror="this.style.display='none'">
      <div style="font-size:1.5rem;font-weight:800;margin-bottom:8px;color:#fff">KriahTrack</div>
      <div style="font-size:0.9rem;color:rgba(255,255,255,0.6);margin-bottom:28px">Connection Error</div>
      <div style="background:rgba(168,32,32,0.3);border:1px solid rgba(168,32,32,0.6);border-radius:10px;padding:16px 24px;max-width:380px;text-align:center;color:#ffaaaa;font-size:0.88rem;margin-bottom:20px">${message}</div>
      <button onclick="location.reload()" style="background:linear-gradient(135deg,#1a5f5f,#1e7070);color:#fff;border:none;padding:10px 24px;border-radius:8px;font-size:0.9rem;font-weight:600;cursor:pointer">Retry</button>
    `;
  }
}

function normalizeAssessment(a) {
  if (a.categories) return {
    ...a,
    studentId:  a.student_id  || a.studentId,
    providerId: a.provider_id || a.providerId,
    createdAt:  a.created_at  || a.createdAt,
  };
  return {
    ...a,
    studentId:  a.student_id  || a.studentId,
    providerId: a.provider_id || a.providerId,
    createdAt:  a.created_at  || a.createdAt,
    categories: {
      otiyot:       { correct: a.otiyot_correct||0,       mistakes: a.otiyot_mistakes||0 },
      ot_nekuda:    { correct: a.ot_nekuda_correct||0,    mistakes: a.ot_nekuda_mistakes||0 },
      ot_nekuda_ot: { correct: a.ot_nekuda_ot_correct||0, mistakes: a.ot_nekuda_ot_mistakes||0 },
      milim:        { correct: a.milim_correct||0,        mistakes: a.milim_mistakes||0 },
      tehilim:      { correct: a.tehilim_correct||0,      mistakes: a.tehilim_mistakes||0 },
    }
  };
}

function updateServerStatus(online) {
  const dot  = document.getElementById('serverStatusDot');
  const text = document.getElementById('serverStatusText');
  if (dot)  dot.style.background  = online ? 'var(--success)' : 'var(--danger)';
  if (text) text.textContent = online ? 'Connected' : 'Offline';
}

function updateBadges() {
  const sb = document.getElementById('studentsBadge');
  const pb = document.getElementById('providersBadge');
  if (sb) sb.textContent = DB.students.length;
  if (pb) pb.textContent = DB.providers.length;
}

// ---- NAVIGATION ----
function navigate(page, params = {}) {
  currentPage = page;
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const navMap = { student_profile:'students', provider_profile:'providers' };
  const navPage = navMap[page] || page;
  const navEl = document.querySelector(`.nav-item[data-page="${navPage}"]`);
  if (navEl) navEl.classList.add('active');

  const pageNames = {
    dashboard:'Dashboard', students:'Students', student_profile:'Student Profile',
    providers:'Providers', provider_profile:'Provider Profile',
    worksheets:'Worksheets', reports:'Monthly Reports',
    ocr:'Upload Worksheet', analytics:'Analytics', admin:'Admin Panel',
  };
  document.getElementById('headerBreadcrumb').textContent = pageNames[page] || page;
  document.getElementById('headerSubBreadcrumb').textContent = '';

  destroyCharts();
  if (page === 'student_profile') profileTab = 'overview';

  const content = document.getElementById('pageContent');
  content.style.opacity = '0';
  content.style.transform = 'translateY(8px)';

  setTimeout(() => {
    if (page === 'dashboard')         renderDashboard();
    else if (page === 'students')     renderStudents();
    else if (page === 'student_profile') renderStudentProfile(params.studentId);
    else if (page === 'providers')    renderProviders();
    else if (page === 'provider_profile') renderProviderProfile(params.providerId);
    else if (page === 'worksheets')   renderWorksheets();
    else if (page === 'reports')      renderReports();
    else if (page === 'ocr')          { loadTesseractLazy(); renderOCR(); }
    else if (page === 'analytics')    renderAnalytics();
    else if (page === 'admin')        { refreshAdminLogs(); renderAdmin(); }

    updateBadges();
    content.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    content.style.opacity = '1';
    content.style.transform = 'translateY(0)';
    closeSidebar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 30);
}

// ---- LAZY TESSERACT LOAD ----
let _tesseractLoaded = false;
function loadTesseractLazy() {
  if (_tesseractLoaded || typeof Tesseract !== 'undefined') return;
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
  script.onload = () => { _tesseractLoaded = true; console.log('Tesseract loaded'); };
  document.head.appendChild(script);
}

// ---- SAVE STUDENT ----
async function saveNewStudent() {
  const firstName  = document.getElementById('newStudentFirst').value.trim();
  const lastName   = document.getElementById('newStudentLast').value.trim();
  const providerId = document.getElementById('newStudentProvider').value;
  const cls        = document.getElementById('newStudentClass').value;
  const year       = document.getElementById('newStudentYear').value.trim();
  const notes      = document.getElementById('newStudentNotes')?.value.trim() || '';
  if (!firstName || !lastName || !providerId || !cls) { showToast('Please fill all required fields', 'warning'); return; }
  try {
    const s = await API.createStudent({ firstName, lastName, providerId, class: cls, year, notes });
    s.firstName  = s.first_name  || firstName;
    s.lastName   = s.last_name   || lastName;
    s.providerId = s.provider_id || providerId;
    DB.students.push(s);
    updateBadges();
    closeModal('addStudentModal');
    showToast(`Student ${firstName} ${lastName} added`, 'success');
    if (currentPage === 'students') renderStudents();
  } catch(e) { showToast('Error saving student: ' + e.message, 'danger'); }
}

// ---- SAVE PROVIDER ----
async function saveNewProvider() {
  const name     = document.getElementById('newProviderName').value.trim();
  const director = document.getElementById('newProviderDirector').value.trim();
  const email    = document.getElementById('newProviderEmail').value.trim();
  const city     = document.getElementById('newProviderCity').value.trim();
  const phone    = document.getElementById('newProviderPhone').value.trim();
  if (!name || !director || !email) { showToast('Name, director and email are required', 'warning'); return; }
  try {
    const p = await API.createProvider({ name, director, email, city, phone, classes: ['א׳','ב׳'] });
    p.classes = p.classes || ['א׳','ב׳'];
    DB.providers.push(p);
    updateBadges();
    closeModal('addProviderModal');
    showToast(`Provider "${name}" added`, 'success');
    if (currentPage === 'providers') renderProviders();
  } catch(e) { showToast('Error saving provider: ' + e.message, 'danger'); }
}

// ---- ASSESSMENT MODAL ----
let _currentAssessmentStudentId = null;

function openAddAssessmentModal(studentId) {
  _currentAssessmentStudentId = studentId;
  const student = getStudent(studentId);
  document.getElementById('assessmentModalTitle').textContent = `Add Assessment — ${getStudentName(student)}`;
  populateMonthSelect('assessmentMonth', CURRENT_HEBREW_MONTH);
  buildCategoryInputs('assessmentCategoryInputs', null);
  openModal('addAssessmentModal');
}

async function saveAssessment() {
  const studentId  = _currentAssessmentStudentId;
  const month      = document.getElementById('assessmentMonth').value;
  const year       = document.getElementById('assessmentYear').value;
  if (!studentId || !month) { showToast('Please select a month', 'warning'); return; }
  const student    = getStudent(studentId);
  const categories = readCategoryInputs();
  try {
    const result = await API.saveAssessment({
      studentId, providerId: student.providerId,
      month, year, categories, source: 'manual',
      studentName: getStudentName(student),
    });
    const idx = DB.assessments.findIndex(a => a.studentId === studentId && a.month === month && a.year === year);
    const newA = { id: result.id, studentId, providerId: student.providerId, month, year, source: 'manual', createdAt: new Date().toISOString(), categories };
    if (idx >= 0) DB.assessments[idx] = newA; else DB.assessments.push(newA);
    closeModal('addAssessmentModal');
    showToast('Assessment saved', 'success');
    if (currentPage === 'student_profile') renderStudentProfile(studentId);
  } catch(e) { showToast('Error saving assessment: ' + e.message, 'danger'); }
}

// ---- DELETE ASSESSMENT ----
async function deleteAssessment(assessmentId, studentId) {
  if (!confirm('Delete this assessment?')) return;
  try {
    await API.deleteAssessment(assessmentId);
    DB.assessments = DB.assessments.filter(a => a.id !== assessmentId);
    showToast('Assessment deleted', 'warning');
    renderStudentProfile(studentId);
  } catch(e) { showToast('Error deleting: ' + e.message, 'danger'); }
}

// ---- OCR IMPORT ----
async function confirmOCRImport() {
  const rows = pendingOCRData.map(row => {
    const cleanCats = {};
    CATEGORIES.forEach(cat => {
      cleanCats[cat.id] = { correct: row.categories[cat.id].correct, mistakes: row.categories[cat.id].mistakes };
    });
    return { studentId: row.student.id, providerId: row.student.providerId, studentName: getStudentName(row.student), categories: cleanCats, action: row.action };
  });
  try {
    const result = await API.importOCR({ rows, providerId: ocrSelectedProvider, month: ocrSelectedMonth, year: CURRENT_HEBREW_YEAR, fileName: _ocrFile ? _ocrFile.name : 'demo' });
    DB.assessments = (await API.getAssessments()).map(normalizeAssessment);
    DB.ocrImports  = await API.getOCRImports();
    ocrStep = 1; pendingOCRData = []; _ocrFile = null;
    showToast(`${result.imported} assessments saved to server`, 'success');
    renderOCR();
  } catch(e) {
    showToast('Server error — please retry: ' + e.message, 'danger');
  }
}

// ---- REFRESH ADMIN LOGS ----
async function refreshAdminLogs() {
  try {
    DB.systemLog  = await API.getSystemLogs();
    const audit   = await API.getAuditLogs();
    DB.auditLog   = audit.map(r => ({ ...r, entityName: r.entity_name||'', before: r.before_val||'', after: r.after_val||'', user: r.user_name||'Admin', timestamp: r.created_at||'' }));
    DB.ocrImports = await API.getOCRImports();
  } catch(e) { console.warn('Could not refresh logs:', e); }
}

// ---- NOTIFICATIONS ----
function showNotifications() {
  const alerts = getAlerts();
  document.getElementById('notificationsBody').innerHTML = alerts.length
    ? alerts.map(a => `<div class="alert alert-${a.type}" style="margin-bottom:10px;cursor:pointer" onclick="closeModal('notificationsPanel');navigate('student_profile',{studentId:'${a.studentId}'})"><div><div style="font-weight:700;margin-bottom:2px">${a.title}</div><div style="font-size:0.82rem">${a.message}</div></div></div>`).join('')
    : '<div class="empty-state"><p>No active alerts</p></div>';
  openModal('notificationsPanel');
}

// ---- PROVIDER CLASS UPDATE ----
function updateClassOptions(providerId) {
  const prov = getProvider(providerId);
  const sel  = document.getElementById('newStudentClass');
  if (!sel) return;
  sel.innerHTML = '<option value="">Select class...</option>' +
    (prov ? (prov.classes||['א׳','ב׳']).map(c => `<option value="${c}">${c}</option>`).join('') : '');
}

// ---- OPEN MODALS ----
function openAddStudentModal() {
  const provSel = document.getElementById('newStudentProvider');
  provSel.innerHTML = '<option value="">Select provider...</option>' +
    DB.providers.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
  ['newStudentFirst','newStudentLast'].forEach(id => { const el = document.getElementById(id); if(el) el.value=''; });
  const notesEl = document.getElementById('newStudentNotes'); if(notesEl) notesEl.value='';
  document.getElementById('newStudentClass').innerHTML = '<option value="">Select class...</option>';
  openModal('addStudentModal');
}

function openAddProviderModal() {
  ['newProviderName','newProviderDirector','newProviderEmail','newProviderCity','newProviderPhone'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
  openModal('addProviderModal');
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
  });
  setInterval(async () => {
    try { await API.health(); updateServerStatus(true); } catch(e) { updateServerStatus(false); }
  }, 30000);
  bootstrap();
});
