// ============================================================
// KriahTrack — Instant Boot, Mock Data, Background Sync
// ============================================================
let currentPage    = 'dashboard';
let profileTab     = 'overview';
let chartInstances = {};
let _currentParams = {};

// Hebrew date (today: 26 June 2026 = כ״ו סיון תשפ״ו)
const HEBREW_DATE_TODAY = 'כ״ו סיון תשפ״ו';

document.addEventListener('DOMContentLoaded', () => {
  // Set Hebrew date in header
  const dateBadge = document.getElementById('hebrewDateBadge');
  if (dateBadge) dateBadge.textContent = HEBREW_DATE_TODAY;

  // Modal close handlers
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
  });

  // Normalize demo data immediately — no waiting
  DB.students    = DB.students.map(normalizeStudent);
  DB.assessments = DB.assessments.map(a => a.categories ? a : normalizeAssessment(a));

  // Update badges
  updateBadges();

  // Render dashboard RIGHT NOW with mock data
  renderDashboard();
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const dash = document.querySelector('.nav-item[data-page="dashboard"]');
  if (dash) dash.classList.add('active');

  // Update server status dot to show demo mode
  updateServerStatus(false);

  // Sync server data silently after 1.5s
  setTimeout(syncFromServer, 1500);
  setInterval(pingServer, 30000);
});

// ---- NORMALIZE ----
function normalizeStudent(s) {
  return { ...s, firstName: s.first_name||s.firstName||'', lastName: s.last_name||s.lastName||'', providerId: s.provider_id||s.providerId||'' };
}
function normalizeAssessment(a) {
  if (a.categories) return { ...a, studentId: a.student_id||a.studentId, providerId: a.provider_id||a.providerId, createdAt: a.created_at||a.createdAt };
  return { ...a, studentId: a.student_id||a.studentId, providerId: a.provider_id||a.providerId, createdAt: a.created_at||a.createdAt,
    categories: {
      otiyot:       { correct: a.otiyot_correct||0,       mistakes: a.otiyot_mistakes||0 },
      ot_nekuda:    { correct: a.ot_nekuda_correct||0,    mistakes: a.ot_nekuda_mistakes||0 },
      ot_nekuda_ot: { correct: a.ot_nekuda_ot_correct||0, mistakes: a.ot_nekuda_ot_mistakes||0 },
      milim:        { correct: a.milim_correct||0,        mistakes: a.milim_mistakes||0 },
      tehilim:      { correct: a.tehilim_correct||0,      mistakes: a.tehilim_mistakes||0 },
    }
  };
}
function normalizeAuditRow(r) {
  return { ...r, entityName: r.entity_name||r.entityName||'', before: r.before_val||r.before||'', after: r.after_val||r.after||'', user: r.user_name||r.user||'Admin', timestamp: r.created_at||r.timestamp||'' };
}

// ---- STATUS ----
function updateServerStatus(online) {
  const dot  = document.getElementById('serverStatusDot');
  const text = document.getElementById('serverStatusText');
  if (dot)  dot.style.background = online ? 'var(--success)' : 'var(--gold-400)';
  if (text) text.textContent     = online ? 'Connected'      : 'Demo mode';
}
function updateBadges() {
  const sb = document.getElementById('studentsBadge');
  const pb = document.getElementById('providersBadge');
  if (sb) sb.textContent = DB.students.length;
  if (pb) pb.textContent = DB.providers.length;
}

// ---- BACKGROUND SYNC ----
async function syncFromServer() {
  try {
    await API.health();
    const [providers, students, assessments, sysLogs, auditLogs, ocrImports] = await Promise.all([
      API.getProviders(), API.getStudents(), API.getAssessments(),
      API.getSystemLogs().catch(()=>[]), API.getAuditLogs().catch(()=>[]), API.getOCRImports().catch(()=>[]),
    ]);
    DB.providers   = providers;
    DB.students    = students.map(normalizeStudent);
    DB.assessments = assessments.map(normalizeAssessment);
    DB.systemLog   = sysLogs;
    DB.auditLog    = auditLogs.map(normalizeAuditRow);
    DB.ocrImports  = ocrImports;
    updateServerStatus(true);
    updateBadges();
    // Silently refresh current page with real data
    navigate(currentPage, _currentParams);
  } catch(err) {
    console.warn('[KT] Using demo data:', err.message);
    updateServerStatus(false);
  }
}
async function pingServer() {
  try { await API.health(); updateServerStatus(true); } catch(e) { updateServerStatus(false); }
}

// ---- NAVIGATION ----
function navigate(page, params = {}) {
  currentPage    = page;
  _currentParams = params;

  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const navMap = { student_profile:'students', provider_profile:'providers' };
  const navEl  = document.querySelector(`.nav-item[data-page="${navMap[page]||page}"]`);
  if (navEl) navEl.classList.add('active');

  const pageNames = { dashboard:'Dashboard', students:'Students', student_profile:'Student Profile', providers:'Providers', provider_profile:'Provider Profile', worksheets:'Worksheets', reports:'Monthly Reports', ocr:'Upload Worksheet', analytics:'Analytics', admin:'Admin Panel' };
  document.getElementById('headerBreadcrumb').textContent = pageNames[page] || page;
  document.getElementById('headerSubBreadcrumb').textContent = '';

  destroyCharts();
  if (page === 'student_profile') profileTab = 'overview';

  const content = document.getElementById('pageContent');
  content.style.opacity = '0'; content.style.transform = 'translateY(6px)';

  requestAnimationFrame(() => {
    if      (page==='dashboard')        renderDashboard();
    else if (page==='students')         renderStudents();
    else if (page==='student_profile')  renderStudentProfile(params.studentId);
    else if (page==='providers')        renderProviders();
    else if (page==='provider_profile') renderProviderProfile(params.providerId);
    else if (page==='worksheets')       renderWorksheets();
    else if (page==='reports')          renderReports();
    else if (page==='ocr')             { loadTesseractLazy(); renderOCR(); }
    else if (page==='analytics')        renderAnalytics();
    else if (page==='admin')           { refreshAdminLogs(); renderAdmin(); }
    updateBadges();
    content.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    content.style.opacity = '1'; content.style.transform = 'translateY(0)';
    closeSidebar();
    window.scrollTo({ top:0, behavior:'smooth' });
  });
}

// ---- LAZY TESSERACT ----
let _tesseractLoaded = false;
function loadTesseractLazy() {
  if (_tesseractLoaded || typeof Tesseract !== 'undefined') { _tesseractLoaded=true; return; }
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
  s.onload = () => { _tesseractLoaded=true; };
  document.head.appendChild(s);
}

// ---- SAVE STUDENT ----
async function saveNewStudent() {
  const firstName=document.getElementById('newStudentFirst').value.trim(), lastName=document.getElementById('newStudentLast').value.trim();
  const providerId=document.getElementById('newStudentProvider').value, cls=document.getElementById('newStudentClass').value;
  const year=document.getElementById('newStudentYear').value.trim(), notes=document.getElementById('newStudentNotes')?.value.trim()||'';
  if (!firstName||!lastName||!providerId||!cls) { showToast('Please fill all required fields','warning'); return; }
  const local = { id:generateId('s'), firstName, lastName, providerId, class:cls, year, status:'active', notes };
  DB.students.push(local); updateBadges(); closeModal('addStudentModal');
  showToast(`${firstName} ${lastName} added`,'success');
  if (currentPage==='students') renderStudents();
  try { const s=await API.createStudent({firstName,lastName,providerId,class:cls,year,notes}); local.id=s.id||local.id; } catch(e){}
}

// ---- SAVE PROVIDER ----
async function saveNewProvider() {
  const name=document.getElementById('newProviderName').value.trim(), director=document.getElementById('newProviderDirector').value.trim();
  const email=document.getElementById('newProviderEmail').value.trim(), city=document.getElementById('newProviderCity').value.trim();
  const phone=document.getElementById('newProviderPhone').value.trim();
  if (!name||!director||!email) { showToast('Name, director and email are required','warning'); return; }
  const local = { id:generateId('p'), name, director, email, city, phone, classes:['א׳','ב׳'] };
  DB.providers.push(local); updateBadges(); closeModal('addProviderModal');
  showToast(`"${name}" added`,'success');
  if (currentPage==='providers') renderProviders();
  try { const p=await API.createProvider({name,director,email,city,phone,classes:['א׳','ב׳']}); local.id=p.id||local.id; } catch(e){}
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
  const studentId=_currentAssessmentStudentId, month=document.getElementById('assessmentMonth').value, year=document.getElementById('assessmentYear').value;
  if (!studentId||!month) { showToast('Please select a month','warning'); return; }
  const student=getStudent(studentId), categories=readCategoryInputs();
  const newA={id:generateId('a'),studentId,providerId:student.providerId,month,year,source:'manual',createdAt:new Date().toISOString(),categories};
  const idx=DB.assessments.findIndex(a=>a.studentId===studentId&&a.month===month&&a.year===year);
  if (idx>=0) DB.assessments[idx]=newA; else DB.assessments.push(newA);
  closeModal('addAssessmentModal'); showToast('Assessment saved','success');
  if (currentPage==='student_profile') renderStudentProfile(studentId);
  try { const r=await API.saveAssessment({studentId,providerId:student.providerId,month,year,categories,source:'manual',studentName:getStudentName(student)}); newA.id=r.id||newA.id; } catch(e){}
}

// ---- DELETE ASSESSMENT ----
async function deleteAssessment(assessmentId, studentId) {
  if (!confirm('Delete this assessment?')) return;
  DB.assessments=DB.assessments.filter(a=>a.id!==assessmentId);
  showToast('Assessment deleted','warning'); renderStudentProfile(studentId);
  try { await API.deleteAssessment(assessmentId); } catch(e){}
}

// ---- OCR IMPORT ----
async function confirmOCRImport() {
  const rows=pendingOCRData.map(row=>{
    const cats={}; CATEGORIES.forEach(cat=>{cats[cat.id]={correct:row.categories[cat.id].correct,mistakes:row.categories[cat.id].mistakes};});
    return {studentId:row.student.id,providerId:row.student.providerId,studentName:getStudentName(row.student),categories:cats,action:row.action};
  });
  let saved=0;
  rows.forEach(row=>{
    if (row.action==='skip') return;
    const idx=DB.assessments.findIndex(a=>a.studentId===row.studentId&&a.month===ocrSelectedMonth&&a.year===CURRENT_HEBREW_YEAR);
    const newA={id:generateId('a'),studentId:row.studentId,providerId:row.providerId,month:ocrSelectedMonth,year:CURRENT_HEBREW_YEAR,source:'ocr',createdAt:new Date().toISOString(),categories:row.categories};
    if (idx>=0) DB.assessments[idx]=newA; else DB.assessments.push(newA); saved++;
  });
  showToast(`${saved} assessments saved`,'success');
  ocrStep=1; pendingOCRData=[]; _ocrFile=null; renderOCR();
  try { await API.importOCR({rows,providerId:ocrSelectedProvider,month:ocrSelectedMonth,year:CURRENT_HEBREW_YEAR,fileName:_ocrFile?_ocrFile.name:'demo'}); } catch(e){}
}

// ---- ADMIN LOGS ----
async function refreshAdminLogs() {
  try { DB.systemLog=await API.getSystemLogs(); DB.auditLog=(await API.getAuditLogs()).map(normalizeAuditRow); DB.ocrImports=await API.getOCRImports(); } catch(e){}
}

// ---- NOTIFICATIONS ----
function showNotifications() {
  const alerts=getAlerts();
  document.getElementById('notificationsBody').innerHTML=alerts.length
    ?alerts.map(a=>`<div class="alert alert-${a.type}" style="margin-bottom:10px;cursor:pointer" onclick="closeModal('notificationsPanel');navigate('student_profile',{studentId:'${a.studentId}'})"><div><div style="font-weight:700;margin-bottom:2px">${a.title}</div><div style="font-size:0.82rem">${a.message}</div></div></div>`).join('')
    :'<div class="empty-state"><p>No active alerts</p></div>';
  openModal('notificationsPanel');
}

// ---- MODALS ----
function openAddStudentModal() {
  document.getElementById('newStudentProvider').innerHTML='<option value="">Select provider...</option>'+DB.providers.map(p=>`<option value="${p.id}">${p.name}</option>`).join('');
  ['newStudentFirst','newStudentLast'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  const n=document.getElementById('newStudentNotes');if(n)n.value='';
  document.getElementById('newStudentClass').innerHTML='<option value="">Select class...</option>';
  openModal('addStudentModal');
}
function openAddProviderModal() {
  ['newProviderName','newProviderDirector','newProviderEmail','newProviderCity','newProviderPhone'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  openModal('addProviderModal');
}
function updateClassOptions(providerId) {
  const prov=getProvider(providerId), sel=document.getElementById('newStudentClass');
  if (!sel) return;
  sel.innerHTML='<option value="">Select class...</option>'+(prov?(prov.classes||['א׳','ב׳']).map(c=>`<option value="${c}">${c}</option>`).join(''):'');
}
