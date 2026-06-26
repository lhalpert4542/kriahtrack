// ============================================================
// KriahTrack — Utility Functions
// ============================================================

function getStudentName(s) { return `${s.firstName} ${s.lastName}`; }
function getProvider(id) { return DB.providers.find(p => p.id === id); }
function getStudent(id) { return DB.students.find(s => s.id === id); }
function getMonthOrder(monthId) { const m = HEBREW_MONTHS_FULL.find(m => m.id === monthId); return m ? m.order : 0; }
function getMonthLabel(monthId) { const m = HEBREW_MONTHS_FULL.find(m => m.id === monthId); return m ? m.label : monthId; }
function getProviderStudents(providerId) { return DB.students.filter(s => s.providerId === providerId); }
function formatDate(iso) { if (!iso) return '—'; return new Date(iso).toLocaleDateString('he-IL', { day:'2-digit', month:'2-digit', year:'numeric' }); }
function formatDateTime(iso) { if (!iso) return '—'; const d = new Date(iso); return d.toLocaleDateString('he-IL',{day:'2-digit',month:'2-digit',year:'numeric'}) + ' ' + d.toLocaleTimeString('he-IL',{hour:'2-digit',minute:'2-digit'}); }
function formatTime(iso) { if (!iso) return '—'; return new Date(iso).toLocaleTimeString('he-IL', { hour:'2-digit', minute:'2-digit' }); }
function getInitials(name) { return name.split(' ').map(w => w[0]).join('').slice(0,2); }
function generateId(prefix) { return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2,7)}`; }

function getStudentAssessments(studentId) {
  return DB.assessments
    .filter(a => a.studentId === studentId)
    .sort((a, b) => getMonthOrder(a.month) - getMonthOrder(b.month));
}

function getCategoryTrend(assessments, catId) {
  if (assessments.length < 2) return 'flat';
  const last = assessments[assessments.length - 1];
  const prev = assessments[assessments.length - 2];
  const lastScore = (last.categories[catId]?.correct || 0) - (last.categories[catId]?.mistakes || 0);
  const prevScore = (prev.categories[catId]?.correct || 0) - (prev.categories[catId]?.mistakes || 0);
  if (lastScore > prevScore + 1) return 'up';
  if (lastScore < prevScore - 1) return 'down';
  return 'flat';
}

function getStudentTrend(studentId) {
  const assessments = getStudentAssessments(studentId);
  if (assessments.length < 2) return 'flat';
  let up = 0, down = 0;
  CATEGORIES.forEach(cat => {
    const t = getCategoryTrend(assessments, cat.id);
    if (t === 'up') up++;
    if (t === 'down') down++;
  });
  if (up >= 3) return 'up';
  if (down >= 3) return 'down';
  return 'flat';
}

function trendIcon(trend) {
  if (trend === 'up')   return '<span class="trend-indicator up">↑ שיפור</span>';
  if (trend === 'down') return '<span class="trend-indicator down">↓ ירידה</span>';
  return '<span class="trend-indicator flat">→ יציב</span>';
}

function trendBadge(trend) {
  if (trend === 'up')   return '<span class="badge badge-success">↑ שיפור</span>';
  if (trend === 'down') return '<span class="badge badge-danger">↓ ירידה</span>';
  return '<span class="badge badge-neutral">→ יציב</span>';
}

function checkDuplicate(studentId, month, year) {
  return DB.assessments.find(a => a.studentId === studentId && a.month === month && a.year === year);
}

function addAuditEntry(action, entity, entityName, field, before, after) {
  DB.auditLog.unshift({
    id: generateId('audit'), action, entity, entityName, field,
    before: String(before), after: String(after),
    user: 'מנהל', timestamp: new Date().toISOString(),
  });
}

function addSystemLog(type, message) {
  DB.systemLog.unshift({
    id: generateId('log'), type, message,
    user: 'מנהל', timestamp: new Date().toISOString(),
  });
}

function getAlerts() {
  const alerts = [];
  DB.students.forEach(s => {
    const trend = getStudentTrend(s.id);
    const assessments = getStudentAssessments(s.id);
    if (trend === 'down' && assessments.length >= 2) {
      alerts.push({ type: 'danger', title: `${getStudentName(s)} — ירידה בביצועים`, message: 'זוהתה ירידה עקבית בחודשים האחרונים — מומלץ לבדוק', studentId: s.id });
    } else if (trend === 'up' && assessments.length >= 2) {
      alerts.push({ type: 'success', title: `${getStudentName(s)} — שיפור מרשים`, message: 'שיפור עקבי בביצועים בחודשים האחרונים', studentId: s.id });
    }
  });
  return alerts.slice(0, 10);
}

function getProviderStats(providerId) {
  const students = getProviderStudents(providerId);
  const assessments = DB.assessments.filter(a => students.some(s => s.id === a.studentId));
  const improving = students.filter(s => getStudentTrend(s.id) === 'up').length;
  const struggling = students.filter(s => getStudentTrend(s.id) === 'down').length;
  const catAvgs = {};
  CATEGORIES.forEach(cat => {
    const vals = assessments.map(a => a.categories[cat.id]?.correct || 0);
    catAvgs[cat.id] = vals.length ? Math.round(vals.reduce((a,b)=>a+b,0)/vals.length*10)/10 : 0;
  });
  return { students: students.length, assessments: assessments.length, improving, struggling, catAvgs };
}

function getStudentYTDSummary(studentId) {
  const assessments = getStudentAssessments(studentId);
  const summary = {};
  CATEGORIES.forEach(cat => {
    const totCorrect = assessments.reduce((s,a) => s + (a.categories[cat.id]?.correct || 0), 0);
    const totMistakes = assessments.reduce((s,a) => s + (a.categories[cat.id]?.mistakes || 0), 0);
    const trend = getCategoryTrend(assessments, cat.id);
    summary[cat.id] = { correct: totCorrect, mistakes: totMistakes, trend, sessions: assessments.length };
  });
  return summary;
}

function getAINote(student, assessments, lang = 'he') {
  const trend = getStudentTrend(student.id);
  const name = getStudentName(student);
  const lastAssessment = assessments[assessments.length - 1];
  const monthLabel = lastAssessment ? getMonthLabel(lastAssessment.month) : 'האחרון';

  const bestCat = CATEGORIES.reduce((best, cat) => {
    const score = lastAssessment ? (lastAssessment.categories[cat.id]?.correct || 0) : 0;
    return score > (best.score || 0) ? { cat, score } : best;
  }, {});

  const weakCat = CATEGORIES.reduce((weak, cat) => {
    const mistakes = lastAssessment ? (lastAssessment.categories[cat.id]?.mistakes || 0) : 0;
    return mistakes > (weak.mistakes || -1) ? { cat, mistakes } : weak;
  }, {});

  if (lang === 'yi') {
    // Yiddish notes
    if (trend === 'up') {
      return `${name} האט זיך שטארק פארבעסערט אין ${monthLabel}. ער האט באזונדערס גוט אויסגעפירט אין ${bestCat.cat?.label || ''}. מיר זענען זייער צופרידן מיט זיין פארשריט. ער זאל ווייטער אזוי לערנען.`;
    } else if (trend === 'down') {
      return `${name} האט אין ${monthLabel} עטוואס שווערע צייטן. מיר דארפן מער אויפמערקזאמקייט אויף ${weakCat.cat?.label || ''}. מיר האפן אז ער וועט זיך פארבעסערן אין קומענדיקן חודש.`;
    } else {
      return `${name} האט אין ${monthLabel} גוט אויסגעפירט. ער האלט זיין ניוואו. מיר זענען צופרידן מיט זיין לערנען.`;
    }
  }

  // Hebrew notes
  if (trend === 'up') {
    return `${name} מציג שיפור עקבי ומרשים בחודש ${monthLabel}. הביצועים הטובים ביותר נרשמו בקטגוריית ${bestCat.cat?.label || ''}. ממליצים להמשיך בקצב הנוכחי ולחזק את הקטגוריות הנותרות. ביצועי שנה"ל מראים מגמה חיובית ברורה.`;
  } else if (trend === 'down') {
    return `${name} מתמודד עם אתגרים בחודש ${monthLabel}. יש לשים דגש מיוחד על קטגוריית ${weakCat.cat?.label || ''} בה נרשמו מספר שגיאות. מומלץ לקיים מפגש תמיכה נוסף ולעקוב מקרוב בחודש הבא.`;
  } else {
    return `${name} שומר על ביצועים יציבים בחודש ${monthLabel}. הקטגוריה החזקה ביותר היא ${bestCat.cat?.label || ''}. ממשיכים לעקוב ולתמוך בהתקדמות לאורך שנת הלימודים.`;
  }
}

// ---- MODAL HELPERS ----
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// ---- TOAST ----
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: '✓', warning: '⚠', danger: '✕', info: 'ℹ' };
  toast.innerHTML = `<span style="font-size:1.1rem">${icons[type]||'✓'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-20px)';
    toast.style.transition = 'all 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ---- SIDEBAR ----
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('open');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
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

// ---- CHART DESTROY HELPER ----
let chartInstances = {};
function destroyCharts() {
  Object.values(chartInstances).forEach(c => { try { c.destroy(); } catch(e){} });
  chartInstances = {};
}

// ---- AVATAR COLOR ----
function avatarColor(index) {
  const colors = [
    'linear-gradient(135deg,#2196F3,#1565C0)',
    'linear-gradient(135deg,#9C27B0,#6A1B9A)',
    'linear-gradient(135deg,#FF9800,#E65100)',
    'linear-gradient(135deg,#4CAF50,#2E7D32)',
    'linear-gradient(135deg,#F44336,#B71C1C)',
    'linear-gradient(135deg,#00BCD4,#006064)',
    'linear-gradient(135deg,#FF5722,#BF360C)',
    'linear-gradient(135deg,#607D8B,#263238)',
  ];
  return colors[index % colors.length];
}

// ---- PRINT REPORT ----
function printCurrentReport() {
  window.print();
}

// ---- CATEGORY INPUT BUILDER ----
function buildCategoryInputs(containerId, existingData) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = CATEGORIES.map(cat => {
    const existing = existingData ? existingData[cat.id] : null;
    return `
      <div class="card" style="margin-bottom:12px;border-right:4px solid ${cat.color}">
        <div class="card-body" style="padding:14px 18px">
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
            <span style="font-weight:700;color:var(--text-primary);font-size:0.95rem">${cat.label}</span>
            <div style="display:flex;gap:20px;align-items:center">
              <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
                <label style="font-size:0.72rem;font-weight:700;color:var(--success);text-transform:uppercase;letter-spacing:0.5px">נכון</label>
                <input type="number" min="0" max="99" class="form-control" style="width:70px;text-align:center;font-family:var(--font-en);font-weight:700;font-size:1rem;border-color:var(--success)"
                  id="cat_${cat.id}_correct" value="${existing ? existing.correct : 0}">
              </div>
              <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
                <label style="font-size:0.72rem;font-weight:700;color:var(--danger);text-transform:uppercase;letter-spacing:0.5px">שגיאות</label>
                <input type="number" min="0" max="99" class="form-control" style="width:70px;text-align:center;font-family:var(--font-en);font-weight:700;font-size:1rem;border-color:var(--danger)"
                  id="cat_${cat.id}_mistakes" value="${existing ? existing.mistakes : 0}">
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }).join('');
}

// ---- READ CATEGORY INPUTS ----
function readCategoryInputs() {
  const cats = {};
  CATEGORIES.forEach(cat => {
    const c = parseInt(document.getElementById(`cat_${cat.id}_correct`)?.value || 0);
    const m = parseInt(document.getElementById(`cat_${cat.id}_mistakes`)?.value || 0);
    cats[cat.id] = { correct: isNaN(c) ? 0 : c, mistakes: isNaN(m) ? 0 : m };
  });
  return cats;
}

// ---- POPULATE MONTH SELECT ----
function populateMonthSelect(selectId, selectedMonth) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  sel.innerHTML = '<option value="">בחר חודש...</option>' +
    HEBREW_MONTHS_FULL.map(m => `<option value="${m.id}" ${m.id === selectedMonth ? 'selected' : ''}>${m.label}</option>`).join('');
}

// ---- POPULATE PROVIDER SELECT ----
function populateProviderSelect(selectId, selectedId) {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  sel.innerHTML = '<option value="">כל הספקים</option>' +
    DB.providers.map(p => `<option value="${p.id}" ${p.id === selectedId ? 'selected' : ''}>${p.name}</option>`).join('');
}

// ---- LETTERHEAD HTML ----
function getLetterheadHTML() {
  return `
    <div style="text-align:center;margin-bottom:24px;padding-bottom:16px;border-bottom:3px solid #1a6060">
      <img src="assets/letterhead.jpg" alt="מערכת הקריאה" style="max-width:100%;max-height:120px;object-fit:contain" onerror="this.style.display='none'">
    </div>`;
}

// ---- CATEGORY MINI CHART DATA ----
function getCategoryChartData(assessments, catId) {
  return {
    labels: assessments.map(a => getMonthLabel(a.month)),
    correct: assessments.map(a => a.categories[catId]?.correct || 0),
    mistakes: assessments.map(a => a.categories[catId]?.mistakes || 0),
  };
}

// ---- CURRENT STUDENT (for assessment modal) ----
let _currentAssessmentStudentId = null;

function openAddAssessmentModal(studentId) {
  _currentAssessmentStudentId = studentId;
  const student = getStudent(studentId);
  document.getElementById('assessmentModalTitle').textContent = `הוספת הערכה — ${getStudentName(student)}`;
  populateMonthSelect('assessmentMonth', CURRENT_HEBREW_MONTH);
  buildCategoryInputs('assessmentCategoryInputs', null);
  openModal('addAssessmentModal');
}

function saveAssessment() {
  const studentId = _currentAssessmentStudentId;
  const month = document.getElementById('assessmentMonth').value;
  const year = document.getElementById('assessmentYear').value;
  if (!studentId || !month) { showToast('נא לבחור חודש', 'warning'); return; }

  const dup = checkDuplicate(studentId, month, year);
  if (dup) {
    if (!confirm(`קיימת כבר הערכה לחודש ${getMonthLabel(month)}. האם לדרוס?`)) return;
    DB.assessments = DB.assessments.filter(a => a.id !== dup.id);
    addAuditEntry('דריסת הערכה', 'הערכה', getStudentName(getStudent(studentId)), 'חודש', getMonthLabel(month), 'עודכן');
  }

  const categories = readCategoryInputs();
  const newAssessment = {
    id: generateId('a'),
    studentId, providerId: getStudent(studentId).providerId,
    month, year, source: 'manual',
    createdAt: new Date().toISOString(),
    categories,
  };
  DB.assessments.push(newAssessment);
  addAuditEntry('הוספת הערכה', 'תלמיד', getStudentName(getStudent(studentId)), 'חודש', '—', getMonthLabel(month));
  addSystemLog('success', `הערכה נוספה — ${getStudentName(getStudent(studentId))} — ${getMonthLabel(month)}`);
  closeModal('addAssessmentModal');
  showToast('הערכה נשמרה בהצלחה', 'success');
  if (currentPage === 'student_profile') navigate('student_profile', { studentId });
}

// ---- ADD STUDENT ----
function openAddStudentModal() {
  const provSel = document.getElementById('newStudentProvider');
  provSel.innerHTML = '<option value="">בחר ספק...</option>' +
    DB.providers.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
  document.getElementById('newStudentFirst').value = '';
  document.getElementById('newStudentLast').value = '';
  openModal('addStudentModal');
}

document.addEventListener('change', function(e) {
  if (e.target.id === 'newStudentProvider') {
    const prov = getProvider(e.target.value);
    const classSel = document.getElementById('newStudentClass');
    classSel.innerHTML = '<option value="">בחר כיתה...</option>' +
      (prov ? prov.classes.map(c => `<option value="${c}">${c}</option>`).join('') : '');
  }
});

function saveNewStudent() {
  const first = document.getElementById('newStudentFirst').value.trim();
  const last = document.getElementById('newStudentLast').value.trim();
  const providerId = document.getElementById('newStudentProvider').value;
  const cls = document.getElementById('newStudentClass').value;
  if (!first || !last || !providerId || !cls) { showToast('נא למלא את כל השדות הנדרשים', 'warning'); return; }
  const newStudent = { id: generateId('s'), firstName: first, lastName: last, providerId, class: cls, year: 'תשפ״ו', status: 'active' };
  DB.students.push(newStudent);
  addAuditEntry('הוספת תלמיד', 'תלמיד', `${first} ${last}`, '—', '—', 'נוצר');
  addSystemLog('info', `תלמיד חדש נוסף: ${first} ${last}`);
  document.getElementById('studentsBadge').textContent = DB.students.length;
  closeModal('addStudentModal');
  showToast(`תלמיד ${first} ${last} נוסף בהצלחה`, 'success');
  if (currentPage === 'students') renderStudents();
}

// ---- ADD PROVIDER ----
function openAddProviderModal() {
  ['newProviderName','newProviderDirector','newProviderEmail','newProviderCity','newProviderPhone'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  openModal('addProviderModal');
}

function saveNewProvider() {
  const name = document.getElementById('newProviderName').value.trim();
  const director = document.getElementById('newProviderDirector').value.trim();
  const email = document.getElementById('newProviderEmail').value.trim();
  const city = document.getElementById('newProviderCity').value.trim();
  const phone = document.getElementById('newProviderPhone').value.trim();
  if (!name || !director || !email) { showToast('נא למלא שם, מנהל ואימייל', 'warning'); return; }
  const newProvider = { id: generateId('p'), name, director, email, city, phone, classes: ['א׳','ב׳'] };
  DB.providers.push(newProvider);
  addAuditEntry('הוספת ספק', 'ספק', name, '—', '—', 'נוצר');
  addSystemLog('info', `ספק חדש נוסף: ${name}`);
  document.getElementById('providersBadge').textContent = DB.providers.length;
  closeModal('addProviderModal');
  showToast(`ספק "${name}" נוסף בהצלחה`, 'success');
  if (currentPage === 'providers') renderProviders();
}

// ---- DELETE ASSESSMENT ----
function deleteAssessment(assessmentId, studentId) {
  if (!confirm('האם למחוק הערכה זו?')) return;
  const a = DB.assessments.find(x => x.id === assessmentId);
  if (!a) return;
  addAuditEntry('מחיקת הערכה', 'הערכה', getStudentName(getStudent(a.studentId)), 'חודש', getMonthLabel(a.month), 'נמחק');
  DB.assessments = DB.assessments.filter(x => x.id !== assessmentId);
  addSystemLog('warning', `הערכה נמחקה — ${getStudentName(getStudent(studentId))} — ${getMonthLabel(a.month)}`);
  showToast('הערכה נמחקה', 'warning');
  navigate('student_profile', { studentId });
}
// ---- HEBREW DATE DISPLAY ----
function hebrewYear() { return CURRENT_HEBREW_YEAR; }
function hebrewMonthLabel(monthId) { return getMonthLabel(monthId); }
function formatHebrewMonthYear(monthId, year) {
  return getMonthLabel(monthId) + ' ' + (year || CURRENT_HEBREW_YEAR);
}
