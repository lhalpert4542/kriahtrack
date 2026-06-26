// ============================================================
// KriahTrack — Connected App Bootstrap
// Loads all data from SQLite via REST API
// ============================================================

// ---- GLOBAL STATE (loaded from server) ----
// DB object is populated from API on startup, then kept in sync
let currentPage = 'dashboard';
let profileTab = 'overview';
let chartInstances = {};

// ---- LOAD PROGRESS ----
function setLoadProgress(pct, msg) {
  const bar = document.getElementById('loadBar');
  const lbl = document.getElementById('loadMsg');
  if (bar) bar.style.width = pct + '%';
  if (lbl) lbl.textContent = msg;
}

// ---- BOOTSTRAP ----
async function bootstrap() {
  // Hard failsafe — always show app within 8 seconds no matter what
  const failsafe = setTimeout(() => {
    console.warn('Failsafe: showing app after timeout');
    showApp(false);
  }, 8000);

  try {
    setLoadProgress(10, 'בודק חיבור לשרת...');
    await API.health();

    setLoadProgress(25, 'טוען ספקים...');
    DB.providers = await API.getProviders();

    setLoadProgress(45, 'טוען תלמידים...');
    const rawStudents = await API.getStudents();
    DB.students = rawStudents.map(s => ({
      ...s,
      firstName:  s.first_name  || s.firstName  || '',
      lastName:   s.last_name   || s.lastName   || '',
      providerId: s.provider_id || s.providerId || '',
    }));

    setLoadProgress(65, 'טוען הערכות...');
    const rawAssessments = await API.getAssessments();
    DB.assessments = rawAssessments.map(normalizeAssessment);

    setLoadProgress(82, 'טוען לוגים...');
    try {
      DB.systemLog  = await API.getSystemLogs();
      const audit   = await API.getAuditLogs();
      DB.auditLog   = audit.map(r => ({
        ...r, entityName: r.entity_name || r.entityName || '',
        before: r.before_val || r.before || '',
        after:  r.after_val  || r.after  || '',
        user:   r.user_name  || r.user   || 'מנהל',
        timestamp: r.created_at || r.timestamp || '',
      }));
      DB.ocrImports = await API.getOCRImports();
    } catch(logErr) {
      console.warn('Logs load failed (non-fatal):', logErr);
    }

    setLoadProgress(100, 'מוכן!');
    clearTimeout(failsafe);
    updateServerStatus(true);
    setTimeout(() => showApp(true), 300);

  } catch (err) {
    console.error('Bootstrap error:', err);
    clearTimeout(failsafe);
    setLoadProgress(100, 'טוען נתוני דמו...');
    updateServerStatus(false);
    // Normalize existing in-memory data from data.js seed
    DB.students = DB.students.map(s => ({
      ...s,
      firstName:  s.first_name  || s.firstName  || '',
      lastName:   s.last_name   || s.lastName   || '',
      providerId: s.provider_id || s.providerId || '',
    }));
    DB.assessments = DB.assessments.map(a => a.categories ? a : normalizeAssessment(a));
    setTimeout(() => showApp(false), 600);
  }
}

function showApp(online) {
  const loading = document.getElementById('loadingScreen');
  const shell   = document.getElementById('appShell');
  if (loading) loading.style.display = 'none';
  if (shell)   shell.style.display   = 'flex';
  updateBadges();
  navigate('dashboard');
  setTimeout(() => {
    showToast(
      online ? 'KriahTrack — נתונים נטענו בהצלחה ✓' : 'מצב לא מקוון — נתוני דמו',
      online ? 'success' : 'warning'
    );
  }, 500);
}

function normalizeAssessment(a) {
  if (a.categories) return { ...a, studentId: a.student_id || a.studentId, providerId: a.provider_id || a.providerId };
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
  if (text) text.textContent = online ? 'מחובר לשרת' : 'לא מקוון';
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
    dashboard:'לוח בקרה', students:'תלמידים', student_profile:'פרופיל תלמיד',
    providers:'ספקים', provider_profile:'פרופיל ספק', worksheets:'גיליונות עבודה',
    reports:'דוחות חודשיים', ocr:'העלאת גיליון', analytics:'אנליטיקה', admin:'פאנל ניהול',
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
    else if (page === 'ocr')          renderOCR();
    else if (page === 'analytics')    renderAnalytics();
    else if (page === 'admin')        renderAdmin();

    updateBadges();
    content.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    content.style.opacity = '1';
    content.style.transform = 'translateY(0)';
    closeSidebar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 30);
}

// ---- CONNECTED SAVE STUDENT ----
async function saveNewStudent() {
  const firstName  = document.getElementById('newStudentFirst').value.trim();
  const lastName   = document.getElementById('newStudentLast').value.trim();
  const providerId = document.getElementById('newStudentProvider').value;
  const cls        = document.getElementById('newStudentClass').value;
  const year       = document.getElementById('newStudentYear').value.trim();
  const notes      = document.getElementById('newStudentNotes').value.trim();
  if (!firstName || !lastName || !providerId || !cls) { showToast('נא למלא את כל השדות הנדרשים', 'warning'); return; }

  try {
    const newStudent = await API.createStudent({ firstName, lastName, providerId, class: cls, year, notes });
    newStudent.firstName  = newStudent.first_name  || firstName;
    newStudent.lastName   = newStudent.last_name   || lastName;
    newStudent.providerId = newStudent.provider_id || providerId;
    DB.students.push(newStudent);
    updateBadges();
    closeModal('addStudentModal');
    showToast(`תלמיד ${firstName} ${lastName} נוסף בהצלחה`, 'success');
    if (currentPage === 'students') renderStudents();
  } catch (e) {
    showToast('שגיאה בשמירת תלמיד: ' + e.message, 'danger');
  }
}

// ---- CONNECTED SAVE PROVIDER ----
async function saveNewProvider() {
  const name     = document.getElementById('newProviderName').value.trim();
  const director = document.getElementById('newProviderDirector').value.trim();
  const email    = document.getElementById('newProviderEmail').value.trim();
  const city     = document.getElementById('newProviderCity').value.trim();
  const phone    = document.getElementById('newProviderPhone').value.trim();
  if (!name || !director || !email) { showToast('נא למלא שם, מנהל ואימייל', 'warning'); return; }

  try {
    const newProv = await API.createProvider({ name, director, email, city, phone, classes: ['א׳','ב׳'] });
    newProv.classes = newProv.classes || ['א׳','ב׳'];
    DB.providers.push(newProv);
    updateBadges();
    closeModal('addProviderModal');
    showToast(`ספק "${name}" נוסף בהצלחה`, 'success');
    if (currentPage === 'providers') renderProviders();
  } catch (e) {
    showToast('שגיאה בשמירת ספק: ' + e.message, 'danger');
  }
}

// ---- CONNECTED SAVE ASSESSMENT ----
let _currentAssessmentStudentId = null;

function openAddAssessmentModal(studentId) {
  _currentAssessmentStudentId = studentId;
  const student = getStudent(studentId);
  document.getElementById('assessmentModalTitle').textContent = `הוספת הערכה — ${getStudentName(student)}`;
  populateMonthSelect('assessmentMonth', CURRENT_HEBREW_MONTH);
  buildCategoryInputs('assessmentCategoryInputs', null);
  openModal('addAssessmentModal');
}

async function saveAssessment() {
  const studentId = _currentAssessmentStudentId;
  const month     = document.getElementById('assessmentMonth').value;
  const year      = document.getElementById('assessmentYear').value;
  if (!studentId || !month) { showToast('נא לבחור חודש', 'warning'); return; }

  const student    = getStudent(studentId);
  const categories = readCategoryInputs();

  try {
    const result = await API.saveAssessment({
      studentId, providerId: student.providerId,
      month, year, categories, source: 'manual',
      studentName: getStudentName(student),
    });

    // Update local DB
    const existing = DB.assessments.findIndex(a => a.studentId === studentId && a.month === month && a.year === year);
    const newA = { id: result.id, studentId, providerId: student.providerId, month, year, source: 'manual', createdAt: new Date().toISOString(), categories };
    if (existing >= 0) DB.assessments[existing] = newA;
    else DB.assessments.push(newA);

    closeModal('addAssessmentModal');
    showToast('הערכה נשמרה בהצלחה', 'success');
    if (currentPage === 'student_profile') renderStudentProfile(studentId);
  } catch (e) {
    showToast('שגיאה בשמירת הערכה: ' + e.message, 'danger');
  }
}

// ---- CONNECTED DELETE ASSESSMENT ----
async function deleteAssessment(assessmentId, studentId) {
  if (!confirm('האם למחוק הערכה זו?')) return;
  try {
    await API.deleteAssessment(assessmentId);
    DB.assessments = DB.assessments.filter(a => a.id !== assessmentId);
    showToast('הערכה נמחקה', 'warning');
    renderStudentProfile(studentId);
  } catch (e) {
    showToast('שגיאה במחיקה: ' + e.message, 'danger');
  }
}

// ---- CONNECTED OCR IMPORT ----
async function confirmOCRImport() {
  const prov = getProvider(ocrSelectedProvider);
  let imported = 0, skipped = 0, overwritten = 0;

  const rows = pendingOCRData.map(row => {
    const cleanCats = {};
    CATEGORIES.forEach(cat => {
      cleanCats[cat.id] = {
        correct:  row.categories[cat.id].correct,
        mistakes: row.categories[cat.id].mistakes,
      };
    });
    return {
      studentId:   row.student.id,
      providerId:  row.student.providerId,
      studentName: getStudentName(row.student),
      categories:  cleanCats,
      action:      row.action,
    };
  });

  try {
    const result = await API.importOCR({
      rows, providerId: ocrSelectedProvider,
      month: ocrSelectedMonth, year: CURRENT_HEBREW_YEAR,
      fileName: _ocrFile ? _ocrFile.name : 'demo',
    });

    // Refresh assessments from server
    DB.assessments = (await API.getAssessments()).map(normalizeAssessment);
    DB.ocrImports  = await API.getOCRImports();

    ocrStep = 1; pendingOCRData = []; _ocrFile = null;
    showToast(`✓ ${result.imported} הערכות נשמרו בשרת`, 'success');
    renderOCR();
  } catch (e) {
    // Fallback: save locally
    pendingOCRData.forEach(row => {
      if (row.action === 'skip') { skipped++; return; }
      const cleanCats = {};
      CATEGORIES.forEach(cat => {
        cleanCats[cat.id] = { correct: row.categories[cat.id].correct, mistakes: row.categories[cat.id].mistakes };
      });
      const existing = DB.assessments.findIndex(a => a.studentId === row.student.id && a.month === ocrSelectedMonth && a.year === CURRENT_HEBREW_YEAR);
      const newA = { id: generateId('a'), studentId: row.student.id, providerId: row.student.providerId, month: ocrSelectedMonth, year: CURRENT_HEBREW_YEAR, source: 'ocr', createdAt: new Date().toISOString(), categories: cleanCats };
      if (existing >= 0) { DB.assessments[existing] = newA; overwritten++; } else { DB.assessments.push(newA); imported++; }
    });
    ocrStep = 1; pendingOCRData = []; _ocrFile = null;
    showToast(`שמור מקומית — ${imported} הערכות (שרת לא זמין)`, 'warning');
    renderOCR();
  }
}

// ---- CONNECTED ADMIN LOGS ----
async function refreshAdminLogs() {
  try {
    DB.systemLog = await API.getSystemLogs();
    DB.auditLog  = (await API.getAuditLogs()).map(r => ({
      ...r, action: r.action, entity: r.entity, entityName: r.entity_name,
      field: r.field, before: r.before_val, after: r.after_val,
      user: r.user_name, timestamp: r.created_at,
    }));
    DB.ocrImports = await API.getOCRImports();
  } catch(e) { console.warn('Could not refresh logs:', e); }
}

// ---- NOTIFICATIONS ----
function showNotifications() {
  const alerts = getAlerts();
  document.getElementById('notificationsBody').innerHTML = alerts.length
    ? alerts.map(a => `
        <div class="alert alert-${a.type}" style="margin-bottom:10px;cursor:pointer" onclick="closeModal('notificationsPanel');navigate('student_profile',{studentId:'${a.studentId}'})">
          <div><div style="font-weight:700;margin-bottom:2px">${a.title}</div><div style="font-size:0.82rem">${a.message}</div></div>
        </div>`).join('')
    : '<div class="empty-state"><p>אין התראות פעילות</p></div>';
  openModal('notificationsPanel');
}

// ---- PROVIDER SELECT CLASS UPDATE ----
function updateClassOptions(providerId) {
  const prov = getProvider(providerId);
  const sel  = document.getElementById('newStudentClass');
  if (!sel) return;
  sel.innerHTML = '<option value="">בחר כיתה...</option>' +
    (prov ? (prov.classes||['א׳','ב׳']).map(c => `<option value="${c}">${c}</option>`).join('') : '');
}

// ---- OPEN ADD STUDENT MODAL ----
function openAddStudentModal() {
  const provSel = document.getElementById('newStudentProvider');
  provSel.innerHTML = '<option value="">בחר ספק...</option>' +
    DB.providers.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
  ['newStudentFirst','newStudentLast','newStudentNotes'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  document.getElementById('newStudentClass').innerHTML = '<option value="">בחר כיתה...</option>';
  openModal('addStudentModal');
}

function openAddProviderModal() {
  ['newProviderName','newProviderDirector','newProviderEmail','newProviderCity','newProviderPhone'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  openModal('addProviderModal');
}

// ---- KEYBOARD & MODAL CLOSE ----
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
  });

  // Ping server every 30s to update status indicator
  setInterval(async () => {
    try { await API.health(); updateServerStatus(true); }
    catch(e) { updateServerStatus(false); }
  }, 30000);

  bootstrap();
});