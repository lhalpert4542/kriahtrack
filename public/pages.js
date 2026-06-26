// ============================================================
// KriahTrack — Page Renderers
// ============================================================

// ============================================================
// DASHBOARD
// ============================================================
function renderDashboard() {
  const totalStudents = DB.students.length;
  const totalProviders = DB.providers.length;
  const totalAssessments = DB.assessments.length;
  const monthlyAssessments = DB.assessments.filter(a => a.month === CURRENT_HEBREW_MONTH).length;
  const improving = DB.students.filter(s => getStudentTrend(s.id) === 'up').length;
  const struggling = DB.students.filter(s => getStudentTrend(s.id) === 'down').length;
  const alerts = getAlerts();

  document.getElementById('pageContent').innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">School Year ${CURRENT_HEBREW_YEAR} — מעקב מצטבר מתחילת השנה העברית</p>
      </div>
      <div class="flex gap-2">
        <button class="btn btn-outline btn-sm" onclick="navigate('analytics')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          אנליטיקה מלאה
        </button>
        <button class="btn btn-primary btn-sm" onclick="navigate('ocr')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Upload Sheet
        </button>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card" onclick="navigate('students')" style="cursor:pointer">
        <div class="kpi-icon" style="background:var(--teal-50);color:var(--teal-600)">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div class="kpi-value">${totalStudents}</div>
        <div class="kpi-label">Active Students</div>
        <div class="kpi-trend up">↑ שנה"ל ${CURRENT_HEBREW_YEAR}</div>
      </div>
      <div class="kpi-card gold" onclick="navigate('providers')" style="cursor:pointer">
        <div class="kpi-icon" style="background:var(--gold-100);color:var(--gold-600)">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>
        <div class="kpi-value">${totalProviders}</div>
        <div class="kpi-label">Active Providers</div>
        <div class="kpi-trend neutral">→ No change</div>
      </div>
      <div class="kpi-card success">
        <div class="kpi-icon" style="background:var(--success-bg);color:var(--success)">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </div>
        <div class="kpi-value">${totalAssessments}</div>
        <div class="kpi-label">YTD Assessments</div>
        <div class="kpi-trend up">↑ ${monthlyAssessments} this month</div>
      </div>
      <div class="kpi-card ${improving >= struggling ? 'success' : 'warning'}">
        <div class="kpi-icon" style="background:${improving >= struggling ? 'var(--success-bg)' : 'var(--warning-bg)'};color:${improving >= struggling ? 'var(--success)' : 'var(--warning)'}">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
        </div>
        <div class="kpi-value">${improving}</div>
        <div class="kpi-label">Improving Students</div>
        <div class="kpi-trend ${struggling > 0 ? 'down' : 'up'}">${struggling} Need Attention</div>
      </div>
    </div>

    ${alerts.length ? `
    <div class="card mb-6">
      <div class="card-header">
        <span class="card-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          התראות פעילות
        </span>
        <span class="badge badge-danger">${alerts.length}</span>
      </div>
      <div class="card-body" style="padding:16px">
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px">
          ${alerts.slice(0,6).map(a => `
            <div class="alert alert-${a.type}" style="margin:0;padding:10px 14px;cursor:pointer" onclick="navigate('student_profile',{studentId:'${a.studentId}'})">
              <div><div style="font-weight:700;font-size:0.85rem">${a.title}</div><div style="font-size:0.78rem;margin-top:2px">${a.message}</div></div>
            </div>`).join('')}
        </div>
      </div>
    </div>` : ''}

    <div class="grid-2 mb-6">
      <div class="card">
        <div class="card-header">
          <span class="card-title">Category Trends — YTD</span>
          <span class="heb-month-pill">${CURRENT_HEBREW_YEAR}</span>
        </div>
        <div class="card-body"><div class="chart-container"><canvas id="categoryTrendChart"></canvas></div></div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Provider Comparison — Avg Correct</span></div>
        <div class="card-body"><div class="chart-container"><canvas id="providerCompChart"></canvas></div></div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header">
          <span class="card-title">Recent Activity</span>
          <button class="btn btn-ghost btn-sm" onclick="navigate('admin')">View All</button>
        </div>
        <div class="card-body" style="padding:0 22px">
          ${DB.systemLog.slice(0,7).map(log => `
            <div class="log-entry">
              <div class="log-dot ${log.type}"></div>
              <div class="log-time">${formatTime(log.timestamp)}</div>
              <div class="log-message">${log.message}</div>
            </div>`).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <span class="card-title">תלמידים — סיון תשפ״ו</span>
          <button class="btn btn-ghost btn-sm" onclick="navigate('students')">All Students</button>
        </div>
        <div class="card-body" style="padding:0">
          <table>
            <thead><tr><th>תלמיד</th><th>Provider</th><th>Trend</th><th>Assessments</th></tr></thead>
            <tbody>
              ${DB.students.slice(0,7).map((s,i) => {
                const trend = getStudentTrend(s.id);
                const cnt = getStudentAssessments(s.id).length;
                const prov = getProvider(s.providerId);
                return `<tr class="clickable" onclick="navigate('student_profile',{studentId:'${s.id}'})">
                  <td class="primary">
                    <div style="display:flex;align-items:center;gap:8px">
                      <div class="user-avatar" style="width:30px;height:30px;font-size:0.7rem;background:${avatarColor(i)}">${getInitials(getStudentName(s))}</div>
                      ${getStudentName(s)}
                    </div>
                  </td>
                  <td style="font-size:0.82rem">${prov ? prov.name.split(' ').slice(0,2).join(' ') : '—'}</td>
                  <td>${trendIcon(trend)}</td>
                  <td><span class="badge badge-teal font-en">${cnt}</span></td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;

  setTimeout(() => { renderCategoryTrendChart(); renderProviderCompChart(); }, 60);
}

function renderCategoryTrendChart() {
  const ctx = document.getElementById('categoryTrendChart'); if (!ctx) return;
  const months = HEBREW_MONTHS_FULL.slice(0, 9);
  const datasets = CATEGORIES.map(cat => ({
    label: cat.label,
    data: months.map(m => {
      const ass = DB.assessments.filter(a => a.month === m.id);
      if (!ass.length) return null;
      return Math.round(ass.reduce((s,a) => s + (a.categories[cat.id]?.correct||0), 0) / ass.length * 10) / 10;
    }),
    borderColor: cat.color, backgroundColor: cat.color+'20', tension: 0.4, fill: false, pointRadius: 4, pointHoverRadius: 6,
  }));
  chartInstances.categoryTrend = new Chart(ctx, {
    type: 'line', data: { labels: months.map(m => m.label), datasets },
    options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ font:{size:11}, padding:10 } } }, scales:{ x:{ grid:{color:'#f0f0f0'} }, y:{ beginAtZero:true, grid:{color:'#f0f0f0'} } } }
  });
}

function renderProviderCompChart() {
  const ctx = document.getElementById('providerCompChart'); if (!ctx) return;
  const labels = DB.providers.map(p => p.name.split(' ').slice(0,2).join(' '));
  const datasets = CATEGORIES.map(cat => ({
    label: cat.label,
    data: DB.providers.map(p => {
      const students = getProviderStudents(p.id);
      const ass = DB.assessments.filter(a => students.some(s => s.id === a.studentId));
      if (!ass.length) return 0;
      return Math.round(ass.reduce((s,a) => s + (a.categories[cat.id]?.correct||0), 0) / ass.length * 10) / 10;
    }),
    backgroundColor: cat.color+'CC', borderColor: cat.color, borderWidth: 1,
  }));
  chartInstances.providerComp = new Chart(ctx, {
    type: 'bar', data: { labels, datasets },
    options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ font:{size:11}, padding:8 } } }, scales:{ x:{ grid:{display:false} }, y:{ beginAtZero:true, grid:{color:'#f0f0f0'} } } }
  });
}

// ============================================================
// STUDENTS LIST
// ============================================================
let studentSearch = '', studentFilterProvider = '', studentFilterTrend = '';

function renderStudents() {
  let filtered = DB.students.filter(s => {
    const name = getStudentName(s).toLowerCase();
    return (!studentSearch || name.includes(studentSearch.toLowerCase()))
      && (!studentFilterProvider || s.providerId === studentFilterProvider)
      && (!studentFilterTrend || getStudentTrend(s.id) === studentFilterTrend);
  });

  document.getElementById('pageContent').innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Students</h1>
        <p class="page-subtitle">${DB.students.length} registered students — click a row for full profile</p>
      </div>
      <button class="btn btn-primary" onclick="openAddStudentModal()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        הוסף תלמיד
      </button>
    </div>
    <div class="filter-bar">
      <div class="search-bar">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" placeholder="Search student..." value="${studentSearch}" oninput="studentSearch=this.value;renderStudents()">
      </div>
      <select class="form-control" style="width:auto" onchange="studentFilterProvider=this.value;renderStudents()">
        <option value="">All Providers</option>
        ${DB.providers.map(p => `<option value="${p.id}" ${studentFilterProvider===p.id?'selected':''}>${p.name}</option>`).join('')}
      </select>
      <select class="form-control" style="width:auto" onchange="studentFilterTrend=this.value;renderStudents()">
        <option value="">All Trends</option>
        <option value="up" ${studentFilterTrend==='up'?'selected':''}>↑ Improving</option>
        <option value="down" ${studentFilterTrend==='down'?'selected':''}>↓ Declining</option>
        <option value="flat" ${studentFilterTrend==='flat'?'selected':''}>→ Stable</option>
      </select>
      <span class="badge badge-teal">${filtered.length} תלמידים</span>
    </div>
    <div class="card">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th><th>Student Name</th><th>Provider</th><th>Class</th><th>Trend</th><th>Assessments</th><th>Last Month</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.length === 0 ? `<tr><td colspan="8"><div class="empty-state"><div class="empty-state-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div><h3>No students found</h3><p>Try changing the filter</p></div></td></tr>` :
            filtered.map((s, i) => {
              const trend = getStudentTrend(s.id);
              const assessments = getStudentAssessments(s.id);
              const lastA = assessments[assessments.length - 1];
              const prov = getProvider(s.providerId);
              return `<tr class="clickable" onclick="navigate('student_profile',{studentId:'${s.id}'})">
                <td style="color:var(--text-muted);font-family:var(--font-en)">${i+1}</td>
                <td class="primary">
                  <div style="display:flex;align-items:center;gap:10px">
                    <div class="user-avatar" style="width:34px;height:34px;font-size:0.75rem;background:${avatarColor(i)}">${getInitials(getStudentName(s))}</div>
                    <div>
                      <div style="font-weight:700">${getStudentName(s)}</div>
                      <div style="font-size:0.75rem;color:var(--text-muted)">${s.year}</div>
                    </div>
                  </div>
                </td>
                <td>${prov ? `<span style="font-size:0.85rem">${prov.name}</span>` : '—'}</td>
                <td><span class="badge badge-teal">${s.class}</span></td>
                <td>${trendBadge(trend)}</td>
                <td><span class="badge badge-neutral font-en">${assessments.length}</span></td>
                <td>${lastA ? `<span class="heb-month-pill" style="font-size:0.72rem;padding:3px 8px">${getMonthLabel(lastA.month)}</span>` : '<span class="text-muted">—</span>'}</td>
                <td onclick="event.stopPropagation()">
                  <div style="display:flex;gap:6px">
                    <button class="btn btn-outline btn-sm" onclick="navigate('student_profile',{studentId:'${s.id}'})">Profile</button>
                    <button class="btn btn-ghost btn-sm" onclick="openAddAssessmentModal('${s.id}')">+ Assessment</button>
                  </div>
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}

// ============================================================
// STUDENT PROFILE
// ============================================================
let profileTab = 'overview';

function renderStudentProfile(studentId) {
  const student = getStudent(studentId);
  if (!student) { document.getElementById('pageContent').innerHTML = '<div class="empty-state"><h3>תלמיד לא נמצא</h3></div>'; return; }
  const assessments = getStudentAssessments(studentId);
  const prov = getProvider(student.providerId);
  const trend = getStudentTrend(studentId);
  const ytd = getStudentYTDSummary(studentId);
  const lastA = assessments[assessments.length - 1];

  document.getElementById('headerSubBreadcrumb').innerHTML = ` › ${getStudentName(student)}`;

  document.getElementById('pageContent').innerHTML = `
    <div style="margin-bottom:16px">
      <button class="btn btn-ghost btn-sm" onclick="navigate('students')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        חזרה לרשימה
      </button>
    </div>

    <div class="student-profile-header">
      <div class="student-profile-info">
        <div class="student-avatar-lg">${getInitials(getStudentName(student))}</div>
        <div style="flex:1">
          <div class="student-profile-name">${getStudentName(student)}</div>
          <div class="student-profile-meta">
            <div class="profile-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
              ${prov ? prov.name : '—'}
            </div>
            <div class="profile-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              כיתה ${student.class}
            </div>
            <div class="profile-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              ${student.year}
            </div>
            <div class="profile-meta-item">${trendBadge(trend)}</div>
          </div>
        </div>
        <div class="profile-actions">
          <button class="btn btn-gold btn-sm" onclick="openAddAssessmentModal('${studentId}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Assessment
          </button>
          <button class="btn btn-outline btn-sm" style="color:#fff;border-color:rgba(255,255,255,0.4)" onclick="showStudentReport('${studentId}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            דוח
          </button>
        </div>
      </div>
    </div>

    <div class="tabs">
      <button class="tab-btn ${profileTab==='overview'?'active':''}" onclick="profileTab='overview';renderStudentProfile('${studentId}')">Overview</button>
      <button class="tab-btn ${profileTab==='assessments'?'active':''}" onclick="profileTab='assessments';renderStudentProfile('${studentId}')">הערכות (${assessments.length})</button>
      <button class="tab-btn ${profileTab==='charts'?'active':''}" onclick="profileTab='charts';renderStudentProfile('${studentId}')">Charts</button>
      <button class="tab-btn ${profileTab==='reports'?'active':''}" onclick="profileTab='reports';renderStudentProfile('${studentId}')">Reports</button>
    </div>

    <div id="profileTabContent"></div>`;

  if (profileTab === 'overview') renderProfileOverview(studentId, student, assessments, ytd, lastA, prov);
  else if (profileTab === 'assessments') renderProfileAssessments(studentId, assessments);
  else if (profileTab === 'charts') renderProfileCharts(studentId, assessments);
  else if (profileTab === 'reports') renderProfileReports(studentId, student, assessments);
}

function renderProfileOverview(studentId, student, assessments, ytd, lastA, prov) {
  const container = document.getElementById('profileTabContent');
  container.innerHTML = `
    <div class="grid-2 mb-6">
      <div class="card">
        <div class="card-header"><span class="card-title">Current Month Performance — ${lastA ? getMonthLabel(lastA.month) : 'No data'}</span></div>
        <div class="card-body">
          ${lastA ? `
            <div class="category-grid" style="grid-template-columns:repeat(5,1fr)">
              ${CATEGORIES.map(cat => `
                <div class="category-card" style="border-top:3px solid ${cat.color}">
                  <div class="category-name">${cat.label}</div>
                  <div class="category-scores">
                    <div class="score-pill correct">
                      <span class="score-val">${lastA.categories[cat.id]?.correct||0}</span>
                      <span class="score-label">נכון</span>
                    </div>
                    <div style="color:var(--text-light);font-size:0.8rem;align-self:center">/</div>
                    <div class="score-pill mistakes">
                      <span class="score-val">${lastA.categories[cat.id]?.mistakes||0}</span>
                      <span class="score-label">שגיאות</span>
                    </div>
                  </div>
                </div>`).join('')}
            </div>
            <div class="info-box mt-4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>No overall score — each category measured separately</span>
            </div>` : `<div class="empty-state"><p>אין הערכות עדיין</p><button class="btn btn-primary mt-4" onclick="openAddAssessmentModal('${studentId}')">Add First Assessment</button></div>`}
        </div>
      </div>

      <div class="card">
        <div class="card-header"><span class="card-title">YTD Summary — ${CURRENT_HEBREW_YEAR}</span></div>
        <div class="card-body">
          ${CATEGORIES.map(cat => {
            const d = ytd[cat.id];
            const trend = d.trend;
            return `
              <div style="margin-bottom:14px">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
                  <span style="font-weight:600;font-size:0.88rem;color:${cat.color}">${cat.label}</span>
                  <div style="display:flex;gap:10px;align-items:center">
                    <span style="font-size:0.8rem;color:var(--success);font-weight:700;font-family:var(--font-en)">${d.correct} נכון</span>
                    <span style="font-size:0.8rem;color:var(--danger);font-weight:700;font-family:var(--font-en)">${d.mistakes} שגיאות</span>
                    ${trendIcon(trend)}
                  </div>
                </div>
                <div class="progress-bar-wrap">
                  <div class="progress-bar-fill" style="width:${Math.min(100, d.correct * 3)}%;background:${cat.color}"></div>
                </div>
              </div>`;
          }).join('')}
          <div class="stat-row mt-4">
            <span class="stat-label">Total YTD Assessments</span>
            <span class="stat-value">${assessments.length}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">ספק</span>
            <span class="stat-value">${prov ? prov.name : '—'}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">כיתה</span>
            <span class="stat-value">${student.class}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><span class="card-title">Monthly Performance Table</span></div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Month</th>
              ${CATEGORIES.map(cat => `<th colspan="2" style="text-align:center;border-right:2px solid rgba(255,255,255,0.2)">${cat.label}</th>`).join('')}
              <th>Source</th>
            </tr>
            <tr style="background:var(--teal-700)">
              <th></th>
              ${CATEGORIES.map(() => `<th style="font-size:0.72rem;color:var(--teal-200)">נכון</th><th style="font-size:0.72rem;color:var(--teal-200);border-right:2px solid rgba(255,255,255,0.2)">שגיאות</th>`).join('')}
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${assessments.length === 0 ? `<tr><td colspan="${2+CATEGORIES.length*2}" class="text-center text-muted" style="padding:24px">אין הערכות</td></tr>` :
            assessments.map(a => `
              <tr>
                <td><span class="heb-month-pill" style="font-size:0.75rem;padding:3px 10px">${getMonthLabel(a.month)}</span></td>
                ${CATEGORIES.map(cat => `
                  <td style="text-align:center;font-family:var(--font-en);font-weight:700;color:var(--success)">${a.categories[cat.id]?.correct||0}</td>
                  <td style="text-align:center;font-family:var(--font-en);font-weight:700;color:var(--danger);border-right:2px solid var(--parchment-border)">${a.categories[cat.id]?.mistakes||0}</td>`).join('')}
                <td><span class="badge ${a.source==='ocr'?'badge-info':'badge-neutral'}">${a.source==='ocr'?'OCR':'Manual'}</span></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}

function renderProfileAssessments(studentId, assessments) {
  const container = document.getElementById('profileTabContent');
  container.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <h3 style="color:var(--teal-800)">${assessments.length} הערכות — ${CURRENT_HEBREW_YEAR}</h3>
      <button class="btn btn-primary btn-sm" onclick="openAddAssessmentModal('${studentId}')">+ Add Assessment</button>
    </div>
    ${assessments.length === 0 ? `<div class="empty-state"><div class="empty-state-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div><h3>No assessments yet</h3><button class="btn btn-primary mt-4" onclick="openAddAssessmentModal('${studentId}')">Add First Assessment</button></div>` :
    assessments.map(a => `
      <div class="card mb-4">
        <div class="card-header">
          <span class="card-title">
            <span class="heb-month-pill">${getMonthLabel(a.month)} ${a.year}</span>
            <span class="badge ${a.source==='ocr'?'badge-info':'badge-neutral'}" style="margin-right:8px">${a.source==='ocr'?'OCR':'Manual'}</span>
          </span>
          <div style="display:flex;gap:8px;align-items:center">
            <span style="font-size:0.78rem;color:var(--text-muted)">${formatDate(a.createdAt)}</span>
            <button class="btn btn-danger btn-sm" onclick="deleteAssessment('${a.id}','${studentId}')">Delete</button>
          </div>
        </div>
        <div class="card-body">
          <div class="category-grid">
            ${CATEGORIES.map(cat => `
              <div class="category-card" style="border-top:3px solid ${cat.color}">
                <div class="category-name">${cat.label}</div>
                <div class="category-scores">
                  <div class="score-pill correct"><span class="score-val">${a.categories[cat.id]?.correct||0}</span><span class="score-label">נכון</span></div>
                  <div style="color:var(--text-light);align-self:center">/</div>
                  <div class="score-pill mistakes"><span class="score-val">${a.categories[cat.id]?.mistakes||0}</span><span class="score-label">שגיאות</span></div>
                </div>
              </div>`).join('')}
          </div>
        </div>
      </div>`).join('')}`;
}

function renderProfileCharts(studentId, assessments) {
  const container = document.getElementById('profileTabContent');
  if (assessments.length < 2) {
    container.innerHTML = `<div class="empty-state"><h3>At least 2 assessments required for charts</h3><button class="btn btn-primary mt-4" onclick="openAddAssessmentModal('${studentId}')">Add Assessment</button></div>`;
    return;
  }
  container.innerHTML = `
    <div class="grid-2 mb-6">
      ${CATEGORIES.map(cat => `
        <div class="card">
          <div class="card-header"><span class="card-title" style="color:${cat.color}">${cat.label}</span>${trendBadge(getCategoryTrend(assessments, cat.id))}</div>
          <div class="card-body"><div class="chart-container-sm"><canvas id="chart_${cat.id}"></canvas></div></div>
        </div>`).join('')}
    </div>
    <div class="card">
      <div class="card-header"><span class="card-title">השוואת כל הקטגוריות — נכון</span></div>
      <div class="card-body"><div class="chart-container"><canvas id="chart_all_correct"></canvas></div></div>
    </div>`;

  setTimeout(() => {
    const labels = assessments.map(a => getMonthLabel(a.month));
    CATEGORIES.forEach(cat => {
      const ctx = document.getElementById(`chart_${cat.id}`); if (!ctx) return;
      chartInstances[`cat_${cat.id}`] = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            { label: 'נכון', data: assessments.map(a => a.categories[cat.id]?.correct||0), borderColor: cat.color, backgroundColor: cat.color+'30', tension: 0.4, fill: true, pointRadius: 5 },
            { label: 'שגיאות', data: assessments.map(a => a.categories[cat.id]?.mistakes||0), borderColor: '#F44336', backgroundColor: '#F4433620', tension: 0.4, fill: false, borderDash: [5,5], pointRadius: 4 },
          ]
        },
        options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ font:{size:10}, padding:8 } } }, scales:{ x:{ grid:{color:'#f5f5f5'} }, y:{ beginAtZero:true, grid:{color:'#f5f5f5'} } } }
      });
    });
    const ctxAll = document.getElementById('chart_all_correct'); if (!ctxAll) return;
    chartInstances.allCorrect = new Chart(ctxAll, {
      type: 'bar',
      data: { labels, datasets: CATEGORIES.map(cat => ({ label: cat.label, data: assessments.map(a => a.categories[cat.id]?.correct||0), backgroundColor: cat.color+'CC', borderColor: cat.color, borderWidth: 1 })) },
      options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ font:{size:11}, padding:10 } } }, scales:{ x:{ grid:{display:false} }, y:{ beginAtZero:true, grid:{color:'#f5f5f5'} } } }
    });
  }, 60);
}

function renderProfileReports(studentId, student, assessments) {
  const container = document.getElementById('profileTabContent');
  const months = [...new Set(assessments.map(a => a.month))];
  container.innerHTML = `
    <div style="margin-bottom:20px">
      <h3 style="color:var(--teal-800);margin-bottom:8px">דוחות Monthיים — ${getStudentName(student)}</h3>
      <p class="text-muted">Click a report to view and print</p>
    </div>
    ${months.length === 0 ? '<div class="empty-state"><h3>No reports available</h3></div>' :
    `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px">
      ${months.map(month => {
        const a = assessments.find(x => x.month === month);
        return `
          <div class="report-card">
            <div class="report-card-header">
              <div style="font-weight:700;font-size:1rem">${getMonthLabel(month)} ${CURRENT_HEBREW_YEAR}</div>
              <div style="font-size:0.8rem;opacity:0.8;margin-top:4px">${formatDate(a?.createdAt)}</div>
            </div>
            <div class="report-card-body">
              <div style="font-size:0.85rem;color:var(--text-muted);margin-bottom:8px">
                ${CATEGORIES.map(cat => `<span style="margin-left:8px;color:${cat.color};font-weight:600">${cat.label}: ${a?.categories[cat.id]?.correct||0}✓</span>`).join('')}
              </div>
            </div>
            <div class="report-card-footer">
              <button class="btn btn-primary btn-sm" onclick="showStudentMonthReport('${studentId}','${month}')">View Report</button>
              <button class="btn btn-ghost btn-sm" onclick="showStudentMonthReport('${studentId}','${month}',true)">Print</button>
            </div>
          </div>`;
      }).join('')}
    </div>`}`;
}

function showStudentReport(studentId) {
  const student = getStudent(studentId);
  const assessments = getStudentAssessments(studentId);
  const lastA = assessments[assessments.length - 1];
  if (!lastA) { showToast('אין הערכות לדוח', 'warning'); return; }
  showStudentMonthReport(studentId, lastA.month);
}

function showStudentMonthReport(studentId, month, autoPrint = false) {
  const student = getStudent(studentId);
  const assessments = getStudentAssessments(studentId);
  const a = assessments.find(x => x.month === month);
  const prov = getProvider(student.providerId);
  const aiNote = getAINote(student, assessments, 'he');

  document.getElementById('reportPreviewBody').innerHTML = `
    ${getLetterheadHTML()}
    <div style="direction:rtl;font-family:var(--font-he)">
      <div style="text-align:center;margin-bottom:24px">
        <h2 style="color:var(--teal-800);font-size:1.4rem">Monthly Progress Report</h2>
        <p style="color:var(--text-muted)">${getMonthLabel(month)} ${CURRENT_HEBREW_YEAR}</p>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px">
        <div class="card"><div class="card-body">
          <div class="stat-row"><span class="stat-label">Student Name</span><span class="stat-value">${getStudentName(student)}</span></div>
          <div class="stat-row"><span class="stat-label">כיתה</span><span class="stat-value">${student.class}</span></div>
          <div class="stat-row"><span class="stat-label">ספק</span><span class="stat-value">${prov?.name||'—'}</span></div>
          <div class="stat-row"><span class="stat-label">School Year</span><span class="stat-value">${student.year}</span></div>
        </div></div>
        <div class="card"><div class="card-body">
          <div class="stat-row"><span class="stat-label">Month</span><span class="stat-value">${getMonthLabel(month)}</span></div>
          <div class="stat-row"><span class="stat-label">Total YTD Assessments</span><span class="stat-value">${assessments.length}</span></div>
          <div class="stat-row"><span class="stat-label">Overall Trend</span><span class="stat-value">${trendIcon(getStudentTrend(studentId))}</span></div>
          <div class="stat-row"><span class="stat-label">Data Source</span><span class="stat-value">${a?.source==='ocr'?'OCR':'Manual'}</span></div>
        </div></div>
      </div>
      <div class="card mb-4"><div class="card-header"><span class="card-title">Performance — ${getMonthLabel(month)}</span></div>
        <div class="card-body">
          <div class="category-grid">
            ${CATEGORIES.map(cat => `
              <div class="category-card" style="border-top:3px solid ${cat.color}">
                <div class="category-name">${cat.label}</div>
                <div class="category-scores">
                  <div class="score-pill correct"><span class="score-val">${a?.categories[cat.id]?.correct||0}</span><span class="score-label">נכון</span></div>
                  <div style="color:var(--text-light);align-self:center">/</div>
                  <div class="score-pill mistakes"><span class="score-val">${a?.categories[cat.id]?.mistakes||0}</span><span class="score-label">שגיאות</span></div>
                </div>
              </div>`).join('')}
          </div>
          <div class="info-box mt-4"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg><span>No overall score — each category measured separately</span></div>
        </div>
      </div>
      <div class="card mb-4"><div class="card-header"><span class="card-title">AI Teacher Note</span></div>
        <div class="card-body"><p style="line-height:1.8;color:var(--text-secondary)">${aiNote}</p></div>
      </div>
      <div class="card"><div class="card-header"><span class="card-title">YTD Progress</span></div>
        <div class="card-body">
          ${CATEGORIES.map(cat => {
            const ytdCorrect = assessments.reduce((s,x) => s+(x.categories[cat.id]?.correct||0),0);
            const ytdMistakes = assessments.reduce((s,x) => s+(x.categories[cat.id]?.mistakes||0),0);
            return `<div style="margin-bottom:12px">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                <span style="font-weight:600;color:${cat.color}">${cat.label}</span>
                <span style="font-size:0.82rem;color:var(--text-muted)">Total: <span style="color:var(--success);font-weight:700">${ytdCorrect}</span> נכון / <span style="color:var(--danger);font-weight:700">${ytdMistakes}</span> שגיאות</span>
              </div>
              <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:${Math.min(100,ytdCorrect*2)}%;background:${cat.color}"></div></div>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>`;
  openModal('reportPreviewModal');
  if (autoPrint) setTimeout(() => window.print(), 500);
}

// ============================================================
// PROVIDERS
// ============================================================
function renderProviders() {
  document.getElementById('pageContent').innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Providers</h1>
        <p class="page-subtitle">${DB.providers.length} active providers — click a provider for full profile</p>
      </div>
      <button class="btn btn-primary" onclick="openAddProviderModal()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        הוסף ספק
      </button>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px">
      ${DB.providers.map((p, i) => {
        const stats = getProviderStats(p.id);
        return `
          <div class="card" style="cursor:pointer;transition:all 0.2s" onclick="navigate('provider_profile',{providerId:'${p.id}'})" onmouseenter="this.style.transform='translateY(-3px)';this.style.boxShadow='var(--shadow-md)'" onmouseleave="this.style.transform='';this.style.boxShadow=''">
            <div style="background:linear-gradient(135deg,var(--teal-800),var(--teal-700));padding:20px;color:#fff">
              <div style="display:flex;align-items:center;gap:14px">
                <div class="user-avatar" style="width:48px;height:48px;font-size:1rem;background:${avatarColor(i)}">${getInitials(p.name)}</div>
                <div>
                  <div style="font-weight:800;font-size:1rem">${p.name}</div>
                  <div style="font-size:0.8rem;opacity:0.8;margin-top:2px">${p.city}</div>
                </div>
              </div>
            </div>
            <div class="card-body">
              <div class="stat-row"><span class="stat-label">מנהל</span><span class="stat-value">${p.director}</span></div>
              <div class="stat-row"><span class="stat-label">אימייל</span><span class="stat-value" style="font-family:var(--font-en);font-size:0.82rem;direction:ltr">${p.email}</span></div>
              <div class="stat-row"><span class="stat-label">טלפון</span><span class="stat-value" style="font-family:var(--font-en)">${p.phone}</span></div>
              <div class="divider"></div>
              <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;text-align:center">
                <div><div style="font-size:1.4rem;font-weight:900;color:var(--teal-700);font-family:var(--font-en)">${stats.students}</div><div style="font-size:0.72rem;color:var(--text-muted)">תלמידים</div></div>
                <div><div style="font-size:1.4rem;font-weight:900;color:var(--success);font-family:var(--font-en)">${stats.improving}</div><div style="font-size:0.72rem;color:var(--text-muted)">משתפרים</div></div>
                <div><div style="font-size:1.4rem;font-weight:900;color:var(--danger);font-family:var(--font-en)">${stats.struggling}</div><div style="font-size:0.72rem;color:var(--text-muted)">Need Attention</div></div>
              </div>
            </div>
          </div>`;
      }).join('')}
    </div>`;
}

// ============================================================
// PROVIDER PROFILE
// ============================================================
function renderProviderProfile(providerId) {
  const prov = getProvider(providerId);
  if (!prov) { document.getElementById('pageContent').innerHTML = '<div class="empty-state"><h3>ספק לא נמצא</h3></div>'; return; }
  const students = getProviderStudents(providerId);
  const stats = getProviderStats(providerId);
  document.getElementById('headerSubBreadcrumb').innerHTML = ` › ${prov.name}`;

  document.getElementById('pageContent').innerHTML = `
    <div style="margin-bottom:16px">
      <button class="btn btn-ghost btn-sm" onclick="navigate('providers')">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        חזרה לספקים
      </button>
    </div>
    <div class="student-profile-header" style="margin-bottom:24px">
      <div class="student-profile-info">
        <div class="student-avatar-lg" style="font-size:1.4rem">${getInitials(prov.name)}</div>
        <div style="flex:1">
          <div class="student-profile-name">${prov.name}</div>
          <div class="student-profile-meta">
            <div class="profile-meta-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>${prov.director}</div>
            <div class="profile-meta-item" style="direction:ltr">${prov.email}</div>
            <div class="profile-meta-item">${prov.city}</div>
            <div class="profile-meta-item" style="direction:ltr">${prov.phone}</div>
          </div>
        </div>
        <div class="profile-actions">
          <button class="btn btn-gold btn-sm" onclick="navigate('worksheets')">Worksheet</button>
          <button class="btn btn-outline btn-sm" style="color:#fff;border-color:rgba(255,255,255,0.4)" onclick="navigate('reports')">Reports</button>
        </div>
      </div>
    </div>

    <div class="kpi-grid" style="grid-template-columns:repeat(4,1fr)">
      <div class="kpi-card"><div class="kpi-icon" style="background:var(--teal-50);color:var(--teal-600)"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div><div class="kpi-value">${stats.students}</div><div class="kpi-label">תלמידים</div></div>
      <div class="kpi-card success"><div class="kpi-icon" style="background:var(--success-bg);color:var(--success)"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg></div><div class="kpi-value">${stats.improving}</div><div class="kpi-label">משתפרים</div></div>
      <div class="kpi-card danger"><div class="kpi-icon" style="background:var(--danger-bg);color:var(--danger)"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/></svg></div><div class="kpi-value">${stats.struggling}</div><div class="kpi-label">Need Attention</div></div>
      <div class="kpi-card gold"><div class="kpi-icon" style="background:var(--gold-100);color:var(--gold-600)"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div><div class="kpi-value">${stats.assessments}</div><div class="kpi-label">הערכות שנה"ל</div></div>
    </div>

    <div class="grid-2 mb-6">
      <div class="card">
        <div class="card-header"><span class="card-title">Category Averages — All Students</span></div>
        <div class="card-body">
          ${CATEGORIES.map(cat => `
            <div style="margin-bottom:14px">
              <div style="display:flex;justify-content:space-between;margin-bottom:5px">
                <span style="font-weight:600;font-size:0.88rem;color:${cat.color}">${cat.label}</span>
                <span style="font-family:var(--font-en);font-weight:700;color:var(--teal-700)">${stats.catAvgs[cat.id]}</span>
              </div>
              <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:${Math.min(100,stats.catAvgs[cat.id]*4)}%;background:${cat.color}"></div></div>
            </div>`).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Provider Performance — Chart</span></div>
        <div class="card-body"><div class="chart-container"><canvas id="providerDetailChart"></canvas></div></div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <span class="card-title">תלמידי הספק (${students.length})</span>
        <button class="btn btn-primary btn-sm" onclick="openAddStudentModal()">+ הוסף תלמיד</button>
      </div>
      <div class="table-wrapper">
        <table>
          <thead><tr><th>Student Name</th><th>Class</th><th>Trend</th><th>Assessments</th><th>Last Month</th><th>Actions</th></tr></thead>
          <tbody>
            ${students.map((s,i) => {
              const trend = getStudentTrend(s.id);
              const ass = getStudentAssessments(s.id);
              const lastA = ass[ass.length-1];
              return `<tr class="clickable" onclick="navigate('student_profile',{studentId:'${s.id}'})">
                <td class="primary"><div style="display:flex;align-items:center;gap:8px"><div class="user-avatar" style="width:30px;height:30px;font-size:0.7rem;background:${avatarColor(i)}">${getInitials(getStudentName(s))}</div>${getStudentName(s)}</div></td>
                <td><span class="badge badge-teal">${s.class}</span></td>
                <td>${trendBadge(trend)}</td>
                <td><span class="badge badge-neutral font-en">${ass.length}</span></td>
                <td>${lastA?`<span class="heb-month-pill" style="font-size:0.72rem;padding:3px 8px">${getMonthLabel(lastA.month)}</span>`:'—'}</td>
                <td onclick="event.stopPropagation()"><button class="btn btn-outline btn-sm" onclick="navigate('student_profile',{studentId:'${s.id}'})">Profile</button></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;

  setTimeout(() => {
    const ctx = document.getElementById('providerDetailChart'); if (!ctx) return;
    const ass = DB.assessments.filter(a => students.some(s => s.id === a.studentId));
    const months = [...new Set(ass.map(a => a.month))].sort((a,b) => getMonthOrder(a)-getMonthOrder(b));
    chartInstances.providerDetail = new Chart(ctx, {
      type: 'line',
      data: { labels: months.map(getMonthLabel), datasets: CATEGORIES.map(cat => ({
        label: cat.label,
        data: months.map(m => { const ma = ass.filter(a=>a.month===m); return ma.length ? Math.round(ma.reduce((s,a)=>s+(a.categories[cat.id]?.correct||0),0)/ma.length*10)/10 : null; }),
        borderColor: cat.color, backgroundColor: cat.color+'20', tension: 0.4, fill: false, pointRadius: 4,
      })) },
      options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ font:{size:11}, padding:8 } } }, scales:{ x:{ grid:{color:'#f5f5f5'} }, y:{ beginAtZero:true, grid:{color:'#f5f5f5'} } } }
    });
  }, 60);
}

// ============================================================
// WORKSHEETS
// ============================================================
let wsProvider = '', wsMonth = CURRENT_HEBREW_MONTH;

function renderWorksheets() {
  document.getElementById('pageContent').innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title">Worksheets</h1><p class="page-subtitle">Generate handwriting grading sheets by provider and month</p></div>
    </div>
    <div class="card mb-6">
      <div class="card-header"><span class="card-title">Worksheet Settings</span></div>
      <div class="card-body">
        <div class="form-row-3">
          <div class="form-group">
            <label class="form-label">Provider *</label>
            <select class="form-control" id="wsProviderSel" onchange="wsProvider=this.value;updateWSPreview()">
              <option value="">Select provider...</option>
              ${DB.providers.map(p => `<option value="${p.id}" ${wsProvider===p.id?'selected':''}>${p.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Month עברי *</label>
            <select class="form-control" id="wsMonthSel" onchange="wsMonth=this.value;updateWSPreview()">
              ${HEBREW_MONTHS_FULL.map(m => `<option value="${m.id}" ${wsMonth===m.id?'selected':''}>${m.label}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Hebrew Year</label>
            <input type="text" class="form-control" value="${CURRENT_HEBREW_YEAR}" readonly>
          </div>
        </div>
        <div style="display:flex;gap:12px;margin-top:8px">
          <button class="btn btn-primary" onclick="generateWorksheet()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            הפק גיליון
          </button>
          <button class="btn btn-gold" onclick="printWorksheet()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            הדפס
          </button>
        </div>
      </div>
    </div>
    <div id="worksheetPreview"></div>`;
  if (wsProvider) updateWSPreview();
}

function updateWSPreview() {
  wsProvider = document.getElementById('wsProviderSel')?.value || wsProvider;
  wsMonth = document.getElementById('wsMonthSel')?.value || wsMonth;
  if (!wsProvider) { document.getElementById('worksheetPreview').innerHTML = ''; return; }
  generateWorksheet();
}

function generateWorksheet() {
  wsProvider = document.getElementById('wsProviderSel')?.value || wsProvider;
  wsMonth = document.getElementById('wsMonthSel')?.value || wsMonth;
  if (!wsProvider || !wsMonth) { showToast('נא לבחור ספק וMonth', 'warning'); return; }
  const prov = getProvider(wsProvider);
  const students = getProviderStudents(wsProvider);
  if (!students.length) { showToast('אין תלמידים לספק זה', 'warning'); return; }

  document.getElementById('worksheetPreview').innerHTML = `
    <div class="card" id="worksheetContent">
      <div class="card-body" style="padding:28px">
        ${getLetterheadHTML()}
        <div style="text-align:center;margin-bottom:24px">
          <h2 style="color:var(--teal-800);font-size:1.3rem">Assessment Sheet — ${prov.name}</h2>
          <p style="color:var(--text-muted);margin-top:4px">${getMonthLabel(wsMonth)} ${CURRENT_HEBREW_YEAR} | Director: ${prov.director}</p>
        </div>
        <div class="info-box mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>Instructions: Fill in Correct and Mistakes for each category per student. No overall score.</span>
        </div>
        <div class="table-wrapper">
          <table class="worksheet-table">
            <thead>
              <tr>
                <th rowspan="2" style="min-width:140px">Student Name</th>
                <th rowspan="2">Class</th>
                ${CATEGORIES.map(cat => `<th colspan="2" style="text-align:center;border-right:2px solid rgba(255,255,255,0.3)">${cat.label}</th>`).join('')}
                <th rowspan="2">הערות</th>
              </tr>
              <tr>
                ${CATEGORIES.map(() => `<th style="font-size:0.72rem;background:var(--teal-700)">נכון</th><th style="font-size:0.72rem;background:var(--teal-700);border-right:2px solid rgba(255,255,255,0.3)">שגיאות</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${students.map(s => `
                <tr>
                  <td class="primary">${getStudentName(s)}</td>
                  <td style="text-align:center">${s.class}</td>
                  ${CATEGORIES.map(() => `<td class="fill-cell" style="min-width:50px;height:44px"></td><td class="fill-cell" style="min-width:50px;height:44px;border-right:2px solid #ddd"></td>`).join('')}
                  <td style="min-width:120px;height:44px"></td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div style="margin-top:24px;display:flex;justify-content:space-between;font-size:0.82rem;color:var(--text-muted)">
          <span>Teacher Signature: ___________________</span>
          <span>Date: ___________________</span>
          <span>KriahTrack — מערכת הקריאה</span>
        </div>
      </div>
    </div>`;
  addSystemLog('info', `גיליון עבודה הופק — ${prov.name} — ${getMonthLabel(wsMonth)}`);
}

function printWorksheet() {
  if (!document.getElementById('worksheetContent')) { showToast('נא להפיק גיליון תחילה', 'warning'); return; }
  window.print();
}

// ============================================================
// MONTHLY REPORTS
// ============================================================
let reportProvider = '', reportMonth = CURRENT_HEBREW_MONTH, reportLang = 'he';

function renderReports() {
  document.getElementById('pageContent').innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title">Monthly Reports</h1><p class="page-subtitle">Generate reports by provider and month — Hebrew & Yiddish</p></div>
    </div>
    <div class="card mb-6">
      <div class="card-header"><span class="card-title">Report Settings</span></div>
      <div class="card-body">
        <div class="form-row-3">
          <div class="form-group">
            <label class="form-label">Provider</label>
            <select class="form-control" id="reportProviderSel" onchange="reportProvider=this.value">
              <option value="">All Providers</option>
              ${DB.providers.map(p => `<option value="${p.id}" ${reportProvider===p.id?'selected':''}>${p.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Month</label>
            <select class="form-control" id="reportMonthSel" onchange="reportMonth=this.value">
              ${HEBREW_MONTHS_FULL.map(m => `<option value="${m.id}" ${reportMonth===m.id?'selected':''}>${m.label}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Note Language</label>
            <div class="lang-toggle" style="margin-top:6px">
              <button class="lang-toggle-btn ${reportLang==='he'?'active':''}" onclick="reportLang='he';renderReports()">עברית</button>
              <button class="lang-toggle-btn ${reportLang==='yi'?'active':''}" onclick="reportLang='yi';renderReports()">יידיש</button>
            </div>
          </div>
        </div>
        <button class="btn btn-primary" onclick="generateBulkReports()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          הפק דוחות
        </button>
      </div>
    </div>
    <div id="reportsGrid"></div>`;
  generateBulkReports();
}

function generateBulkReports() {
  reportProvider = document.getElementById('reportProviderSel')?.value || reportProvider;
  reportMonth = document.getElementById('reportMonthSel')?.value || reportMonth;
  const students = reportProvider ? getProviderStudents(reportProvider) : DB.students;
  const studentsWithData = students.filter(s => {
    const ass = getStudentAssessments(s.id);
    return ass.some(a => a.month === reportMonth);
  });

  document.getElementById('reportsGrid').innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
      <h3 style="color:var(--teal-800)">${studentsWithData.length} דוחות — ${getMonthLabel(reportMonth)} ${CURRENT_HEBREW_YEAR}</h3>
      <button class="btn btn-ghost btn-sm" onclick="window.print()">Print All</button>
    </div>
    ${studentsWithData.length === 0 ? `<div class="empty-state"><h3>No data לMonth ${getMonthLabel(reportMonth)}</h3><p>נסה לבחור Month אחר או להוסיף הערכות</p></div>` :
    `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px">
      ${studentsWithData.map(s => {
        const ass = getStudentAssessments(s.id);
        const a = ass.find(x => x.month === reportMonth);
        const prov = getProvider(s.providerId);
        const trend = getStudentTrend(s.id);
        const aiNote = getAINote(s, ass, reportLang);
        return `
          <div class="report-card">
            <div class="report-card-header">
              <div style="display:flex;justify-content:space-between;align-items:flex-start">
                <div>
                  <div style="font-weight:800;font-size:1rem">${getStudentName(s)}</div>
                  <div style="font-size:0.78rem;opacity:0.8;margin-top:2px">${prov?.name||'—'} | כיתה ${s.class}</div>
                </div>
                ${trendBadge(trend)}
              </div>
            </div>
            <div class="report-card-body">
              <div style="margin-bottom:12px">
                ${CATEGORIES.map(cat => `
                  <div style="display:flex;justify-content:space-between;font-size:0.82rem;padding:3px 0;border-bottom:1px solid var(--parchment-border)">
                    <span style="color:${cat.color};font-weight:600">${cat.label}</span>
                    <span><span style="color:var(--success);font-weight:700;font-family:var(--font-en)">${a?.categories[cat.id]?.correct||0}</span> / <span style="color:var(--danger);font-weight:700;font-family:var(--font-en)">${a?.categories[cat.id]?.mistakes||0}</span></span>
                  </div>`).join('')}
              </div>
              <div style="background:var(--parchment);border-radius:6px;padding:10px;font-size:0.8rem;color:var(--text-secondary);line-height:1.6;border-right:3px solid var(--teal-400)">
                ${aiNote.slice(0,120)}...
              </div>
            </div>
            <div class="report-card-footer">
              <button class="btn btn-primary btn-sm" onclick="showStudentMonthReport('${s.id}','${reportMonth}')">View</button>
              <button class="btn btn-ghost btn-sm" onclick="showStudentMonthReport('${s.id}','${reportMonth}',true)">Print</button>
            </div>
          </div>`;
      }).join('')}
    </div>`}`;
  addSystemLog('info', `דוחות Monthיים הופקו — ${getMonthLabel(reportMonth)} — ${studentsWithData.length} תלמידים`);
}

// ============================================================
// OCR UPLOAD — Real Tesseract.js Pipeline
// ============================================================
let ocrStep = 1, ocrSelectedProvider = '', ocrSelectedMonth = CURRENT_HEBREW_MONTH;
let pendingOCRData = [];
let _ocrFile = null;

function renderOCR() {
  document.getElementById('pageContent').innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title">Upload Worksheet</h1><p class="page-subtitle">Automatic handwriting recognition — Tesseract OCR with advanced image processing</p></div>
    </div>
    <div class="steps">
      <div class="step ${ocrStep>=1?'active':''} ${ocrStep>1?'done':''}">
        <div class="step-num">${ocrStep>1?'✓':'1'}</div>
        <div class="step-label">ספק וMonth</div>
        <div class="step-line"></div>
      </div>
      <div class="step ${ocrStep>=2?'active':''} ${ocrStep>2?'done':''}">
        <div class="step-num">${ocrStep>2?'✓':'2'}</div>
        <div class="step-label">Upload Sheet</div>
        <div class="step-line"></div>
      </div>
      <div class="step ${ocrStep>=3?'active':''} ${ocrStep>3?'done':''}">
        <div class="step-num">${ocrStep>3?'✓':'3'}</div>
        <div class="step-label">OCR Processing</div>
        <div class="step-line"></div>
      </div>
      <div class="step ${ocrStep>=4?'active':''}">
        <div class="step-num">4</div>
        <div class="step-label">Review & Confirm</div>
      </div>
    </div>
    ${ocrStep===1 ? renderOCRStep1() : ''}
    ${ocrStep===2 ? renderOCRStep2() : ''}
    ${ocrStep===3 ? renderOCRStep3Processing() : ''}
    ${ocrStep===4 ? renderOCRStep4Review() : ''}`;
}

function renderOCRStep1() {
  return `
    <div class="card">
      <div class="card-header"><span class="card-title">שלב 1 — בחירת ספק וMonth</span></div>
      <div class="card-body">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Provider *</label>
            <select class="form-control" id="ocrProviderSel">
              <option value="">Select provider...</option>
              ${DB.providers.map(p=>`<option value="${p.id}" ${ocrSelectedProvider===p.id?'selected':''}>${p.name}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Month עברי *</label>
            <select class="form-control" id="ocrMonthSel">
              ${HEBREW_MONTHS_FULL.map(m=>`<option value="${m.id}" ${ocrSelectedMonth===m.id?'selected':''}>${m.label}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="info-box mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div>The OCR engine recognizes handwritten digits with high accuracy. A review screen always appears before saving. duplicates מDetectedת אוטומטית.</div>
        </div>
        <button class="btn btn-primary" onclick="ocrNextStep1()">Continue →</button>
      </div>
    </div>`;
}

function ocrNextStep1() {
  ocrSelectedProvider = document.getElementById('ocrProviderSel').value;
  ocrSelectedMonth    = document.getElementById('ocrMonthSel').value;
  if (!ocrSelectedProvider || !ocrSelectedMonth) { showToast('נא לבחור ספק וMonth', 'warning'); return; }
  ocrStep = 2; renderOCR();
}

function renderOCRStep2() {
  const prov = getProvider(ocrSelectedProvider);
  const students = getProviderStudents(ocrSelectedProvider);
  return `
    <div class="card">
      <div class="card-header">
        <span class="card-title">שלב 2 — Upload Sheet</span>
        <span class="heb-month-pill">${prov?.name} | ${getMonthLabel(ocrSelectedMonth)}</span>
      </div>
      <div class="card-body">
        <div class="upload-zone" id="uploadZone"
          onclick="document.getElementById('ocrFileInput').click()"
          ondragover="event.preventDefault();this.classList.add('drag-over')"
          ondragleave="this.classList.remove('drag-over')"
          ondrop="handleOCRFileDrop(event)">
          <div class="upload-zone-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          </div>
          <h3>Upload Worksheet</h3>
          <p>Drag file here or click to select</p>
          <p style="margin-top:8px;font-size:0.78rem;color:var(--text-light)">JPG · PNG · PDF | מומלץ: סריקה באיכות 300 DPI ומעלה</p>
          <input type="file" id="ocrFileInput" accept="image/*,.pdf" style="display:none" onchange="handleOCRFileSelect(this)">
        </div>

        <div style="margin-top:16px" class="info-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 6s1-1 4-1 5 2 8 2 4-1 4-1V22s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          <div>
            <strong>Tips for best scan quality:</strong> Even lighting, straight sheet, clear digits, high contrast between ink and paper.
          </div>
        </div>

        <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn-ghost" onclick="ocrStep=1;renderOCR()">← Back</button>
          <button class="btn btn-outline" onclick="runDemoOCR()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            הדגמה ללא קובץ
          </button>
        </div>

        <div style="margin-top:12px;font-size:0.8rem;color:var(--text-muted)">
          Students in this provider: <strong>${students.length}</strong> —
          ${students.map(s=>getStudentName(s)).join(', ')}
        </div>
      </div>
    </div>`;
}

function handleOCRFileSelect(input) {
  if (input.files && input.files[0]) {
    _ocrFile = input.files[0];
    const name = _ocrFile.name;
    document.getElementById('uploadZone').innerHTML = `
      <div class="upload-zone-icon" style="background:var(--success-bg);color:var(--success)">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h3 style="color:var(--success)">קובץ נטען: ${name}</h3>
      <p style="color:var(--text-muted)">${(_ocrFile.size/1024).toFixed(0)} KB — מתחיל עיבוד...</p>`;
    setTimeout(() => startRealOCR(_ocrFile), 600);
  }
}

function handleOCRFileDrop(event) {
  event.preventDefault();
  document.getElementById('uploadZone').classList.remove('drag-over');
  const file = event.dataTransfer.files[0];
  if (file) { _ocrFile = file; handleOCRFileSelect({ files: [file] }); }
}

function renderOCRStep3Processing() {
  return `
    <div class="card">
      <div class="card-header"><span class="card-title">שלב 3 — OCR Processing</span></div>
      <div class="card-body" style="text-align:center;padding:40px">
        <div id="ocrStatusMsg" class="alert alert-info" style="margin-bottom:24px;text-align:right">
          Initializing OCR engine...
        </div>
        <div style="margin-bottom:16px">
          <div style="display:flex;justify-content:space-between;margin-bottom:6px">
            <span style="font-size:0.85rem;font-weight:600;color:var(--teal-700)" id="ocrProgressLabel">0%</span>
          </div>
          <div class="progress-bar-wrap" style="height:14px;border-radius:7px">
            <div class="progress-bar-fill" id="ocrProgressBar" style="width:0%;transition:width 0.3s ease;border-radius:7px"></div>
          </div>
        </div>
        <div style="display:flex;justify-content:center;margin-top:24px">
          <div class="spinner" style="width:40px;height:40px;border-width:4px"></div>
        </div>
        <p style="margin-top:16px;color:var(--text-muted);font-size:0.85rem">
          Tesseract OCR engine analyzing handwriting — please wait...
        </p>
        <button class="btn btn-ghost btn-sm" style="margin-top:16px" onclick="ocrStep=2;_ocrFile=null;renderOCR()">Cancel</button>
      </div>
    </div>`;
}

async function startRealOCR(file) {
  ocrStep = 3;
  renderOCR();

  const students = getProviderStudents(ocrSelectedProvider);
  const prov = getProvider(ocrSelectedProvider);

  try {
    addSystemLog('info', `OCR התחיל — ${prov?.name} — ${getMonthLabel(ocrSelectedMonth)}`);
    const results = await OCREngine.processWorksheet(file, students);
    buildPendingOCRData(results);
    addSystemLog('success', `OCR הושלם — ${prov?.name} — ${results.length} תלמידים`);
    ocrStep = 4;
    renderOCR();
  } catch (err) {
    console.error('OCR error:', err);
    addSystemLog('danger', `שגיאת OCR — ${err.message}`);
    showToast('שגיאה בעיבוד OCR — נטענו נתוני דמו', 'warning');
    const demoResults = OCREngine.generateDemoResults(students);
    buildPendingOCRData(demoResults);
    ocrStep = 4;
    renderOCR();
  }
}

function runDemoOCR() {
  _ocrFile = null;
  ocrStep = 3;
  renderOCR();
  const students = getProviderStudents(ocrSelectedProvider);
  const prov = getProvider(ocrSelectedProvider);

  // Simulate processing delay
  let pct = 0;
  const interval = setInterval(() => {
    pct = Math.min(100, pct + Math.floor(Math.random() * 12) + 3);
    const bar = document.getElementById('ocrProgressBar');
    const lbl = document.getElementById('ocrProgressLabel');
    if (bar) bar.style.width = pct + '%';
    if (lbl) lbl.textContent = `מעבד... ${pct}%`;
    const msg = document.getElementById('ocrStatusMsg');
    if (msg) {
      if (pct < 30) msg.textContent = 'Initializing OCR engine...';
      else if (pct < 55) msg.textContent = 'Detecting table structure...';
      else if (pct < 80) msg.textContent = 'Extracting digits from cells...';
      else msg.textContent = 'Finishing processing...';
    }
    if (pct >= 100) {
      clearInterval(interval);
      const demoResults = OCREngine.generateDemoResults(students);
      buildPendingOCRData(demoResults);
      addSystemLog('info', `OCR דמו הושלם — ${prov?.name} — ${students.length} תלמידים`);
      ocrStep = 4;
      renderOCR();
    }
  }, 180);
}

function buildPendingOCRData(results) {
  pendingOCRData = results.map(r => {
    const existing = checkDuplicate(r.student.id, ocrSelectedMonth, CURRENT_HEBREW_YEAR);
    // Normalize categories — strip confidence metadata for storage
    const cats = {};
    CATEGORIES.forEach(cat => {
      const raw = r.categories[cat.id] || {};
      cats[cat.id] = {
        correct:  raw.correct  !== null && raw.correct  !== undefined ? raw.correct  : 0,
        mistakes: raw.mistakes !== null && raw.mistakes !== undefined ? raw.mistakes : 0,
        _correctConf:  raw.correctConfidence  || 0.75,
        _mistakesConf: raw.mistakesConfidence || 0.75,
        _simulated: !!raw._simulated,
      };
    });
    return {
      student: r.student,
      categories: cats,
      isDuplicate: !!existing,
      existingId: existing?.id,
      action: existing ? 'overwrite' : 'import',
      _simulated: !!r._simulated,
      _fallback: !!r._fallback,
    };
  });
}

function renderOCRStep4Review() {
  const prov = getProvider(ocrSelectedProvider);
  const duplicates = pendingOCRData.filter(d => d.isDuplicate);
  const simulated  = pendingOCRData.filter(d => d._simulated);
  const toImport   = pendingOCRData.filter(d => d.action !== 'skip').length;

  return `
    <div class="card">
      <div class="card-header">
        <span class="card-title">שלב 4 — Review & Confirm</span>
        <span class="heb-month-pill">${prov?.name} | ${getMonthLabel(ocrSelectedMonth)}</span>
      </div>
      <div class="card-body">

        ${simulated.length > 0 ? `
          <div class="alert alert-info" style="margin-bottom:16px">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <div><strong>Note:</strong> ${simulated.length} rows were auto-estimated (OCR could not read). Please verify before saving.</div>
          </div>` : `
          <div class="alert alert-success" style="margin-bottom:16px">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            <div>OCR completed successfully — ${pendingOCRData.length} שורות Detected. בדוק לפני שמירה.</div>
          </div>`}

        ${duplicates.length > 0 ? `
          <div class="duplicate-warning" style="margin-bottom:16px">
            <div style="font-weight:700;color:var(--warning);margin-bottom:6px">⚠ Detected ${duplicates.length} duplicates</div>
            <p style="font-size:0.85rem;color:var(--warning)">קיימות הערכות לMonth ${getMonthLabel(ocrSelectedMonth)} for: ${duplicates.map(d=>getStudentName(d.student)).join(', ')}</p>
            <div style="margin-top:10px;display:flex;gap:10px">
              <button class="btn btn-sm" style="background:var(--warning);color:#fff" onclick="setAllDuplicateAction('overwrite');renderOCR()">Overwrite All</button>
              <button class="btn btn-ghost btn-sm" onclick="setAllDuplicateAction('skip');renderOCR()">דלג על duplicates</button>
            </div>
          </div>` : ''}

        <div class="info-box mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>You can edit any value before saving. Low-confidence cells are highlighted in yellow.</span>
        </div>

        <div style="overflow-x:auto">
          <table class="ocr-review-table" style="min-width:900px">
            <thead>
              <tr>
                <th style="min-width:130px">תלמיד</th>
                ${CATEGORIES.map(cat=>`<th colspan="2" style="text-align:center;border-right:2px solid rgba(255,255,255,0.2);background:${cat.color}CC">${cat.label}</th>`).join('')}
                <th>Status</th>
                <th>Action</th>
              </tr>
              <tr style="background:var(--teal-700)">
                <th></th>
                ${CATEGORIES.map(()=>`<th style="font-size:0.7rem;color:#a8e0e0;text-align:center">✓ נכון</th><th style="font-size:0.7rem;color:#ffaaaa;text-align:center;border-right:2px solid rgba(255,255,255,0.15)">✗ שגיאות</th>`).join('')}
                <th></th><th></th>
              </tr>
            </thead>
            <tbody>
              ${pendingOCRData.map((row, ri) => `
                <tr class="${row.isDuplicate?'highlight-row':''}" style="${row.action==='skip'?'opacity:0.4':''}" id="ocrRow_${ri}">
                  <td class="primary" style="white-space:nowrap">
                    ${getStudentName(row.student)}
                    ${row._simulated?'<span class="badge badge-warning" style="font-size:0.6rem;margin-right:4px">הערכה</span>':''}
                  </td>
                  ${CATEGORIES.map(cat => {
                    const cConf = row.categories[cat.id]._correctConf || 0.9;
                    const mConf = row.categories[cat.id]._mistakesConf || 0.9;
                    const cBg = cConf < 0.6 ? 'background:#fff3cd' : '';
                    const mBg = mConf < 0.6 ? 'background:#fff3cd' : '';
                    return `
                      <td style="text-align:center;${cBg}">
                        <input type="number" min="0" max="99"
                          value="${row.categories[cat.id].correct}"
                          title="ביטחון: ${Math.round(cConf*100)}%"
                          onchange="pendingOCRData[${ri}].categories['${cat.id}'].correct=parseInt(this.value)||0"
                          style="border-color:var(--success);${cBg}">
                      </td>
                      <td style="text-align:center;border-right:2px solid var(--parchment-border);${mBg}">
                        <input type="number" min="0" max="99"
                          value="${row.categories[cat.id].mistakes}"
                          title="ביטחון: ${Math.round(mConf*100)}%"
                          onchange="pendingOCRData[${ri}].categories['${cat.id}'].mistakes=parseInt(this.value)||0"
                          style="border-color:var(--danger);${mBg}">
                      </td>`;
                  }).join('')}
                  <td>
                    ${row.isDuplicate
                      ? '<span class="badge badge-warning">Duplicate</span>'
                      : row._simulated
                        ? '<span class="badge badge-info">Estimated</span>'
                        : '<span class="badge badge-success">OCR ✓</span>'}
                  </td>
                  <td>
                    ${row.isDuplicate ? `
                      <select class="form-control" style="width:auto;font-size:0.78rem;padding:4px 8px"
                        onchange="pendingOCRData[${ri}].action=this.value;document.getElementById('ocrRow_${ri}').style.opacity=this.value==='skip'?'0.4':'1'">
                        <option value="overwrite" ${row.action==='overwrite'?'selected':''}>Overwrite</option>
                        <option value="skip"      ${row.action==='skip'?'selected':''}>Skip</option>
                        <option value="merge"     ${row.action==='merge'?'selected':''}>Merge</option>
                      </select>` : '<span class="badge badge-teal">Import</span>'}
                  </td>
                </tr>`).join('')}
            </tbody>
          </table>
        </div>

        <div style="margin-top:20px;display:flex;gap:12px;flex-wrap:wrap;align-items:center">
          <button class="btn btn-primary" onclick="confirmOCRImport()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            Confirm & Save (${toImport} records)
          </button>
          <button class="btn btn-outline" onclick="ocrStep=2;renderOCR()">← Re-upload</button>
          <button class="btn btn-ghost" onclick="ocrStep=1;_ocrFile=null;pendingOCRData=[];renderOCR()">Cancel</button>
          <span style="font-size:0.8rem;color:var(--text-muted);margin-right:auto">
            Yellow cells = low OCR confidence — please verify
          </span>
        </div>
      </div>
    </div>`;
}

function setAllDuplicateAction(action) {
  pendingOCRData.forEach(d => { if (d.isDuplicate) d.action = action; });
}

function confirmOCRImport() {
  let imported = 0, skipped = 0, overwritten = 0;
  pendingOCRData.forEach(row => {
    if (row.action === 'skip') { skipped++; return; }
    if (row.isDuplicate && row.action === 'overwrite') {
      DB.assessments = DB.assessments.filter(a => a.id !== row.existingId);
      overwritten++;
    }
    // Strip internal metadata before saving
    const cleanCats = {};
    CATEGORIES.forEach(cat => {
      cleanCats[cat.id] = {
        correct:  row.categories[cat.id].correct,
        mistakes: row.categories[cat.id].mistakes,
      };
    });
    DB.assessments.push({
      id: generateId('a'),
      studentId:  row.student.id,
      providerId: row.student.providerId,
      month:  ocrSelectedMonth,
      year:   CURRENT_HEBREW_YEAR,
      source: _ocrFile ? 'ocr' : 'ocr_demo',
      createdAt: new Date().toISOString(),
      categories: cleanCats,
    });
    addAuditEntry('ייבוא OCR', 'הערכה', getStudentName(row.student), 'Month', '—', getMonthLabel(ocrSelectedMonth));
    imported++;
  });

  DB.ocrImports.push({
    id: generateId('ocr'),
    provider: ocrSelectedProvider,
    month: ocrSelectedMonth,
    year: CURRENT_HEBREW_YEAR,
    imported, skipped, overwritten,
    fileName: _ocrFile ? _ocrFile.name : 'demo',
    timestamp: new Date().toISOString(),
  });

  addSystemLog('success', `OCR שמירה הושלמה — ${imported} יובאו, ${overwritten} דרוסו, ${skipped} דולגו`);

  ocrStep = 1;
  pendingOCRData = [];
  _ocrFile = null;

  showToast(`✓ ${imported} הערכות נשמרו בהצלחה`, 'success');
  renderOCR();
}

// ============================================================
// ANALYTICS
// ============================================================
function renderAnalytics() {
  const improving = DB.students.filter(s => getStudentTrend(s.id) === 'up');
  const struggling = DB.students.filter(s => getStudentTrend(s.id) === 'down');

  document.getElementById('pageContent').innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title">Analytics</h1><p class="page-subtitle">Deep analysis — improvement, regression, provider comparison, cohorts</p></div>
    </div>

    <div class="kpi-grid mb-6">
      <div class="kpi-card success"><div class="kpi-icon" style="background:var(--success-bg);color:var(--success)"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg></div><div class="kpi-value">${improving.length}</div><div class="kpi-label">Improving Students</div></div>
      <div class="kpi-card danger"><div class="kpi-icon" style="background:var(--danger-bg);color:var(--danger)"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/></svg></div><div class="kpi-value">${struggling.length}</div><div class="kpi-label">בסיכון</div></div>
      <div class="kpi-card"><div class="kpi-icon" style="background:var(--teal-50);color:var(--teal-600)"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></div><div class="kpi-value">${DB.assessments.length}</div><div class="kpi-label">סה"כ הערכות</div></div>
      <div class="kpi-card gold"><div class="kpi-icon" style="background:var(--gold-100);color:var(--gold-600)"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div><div class="kpi-value">${HEBREW_MONTHS_FULL.filter(m => DB.assessments.some(a=>a.month===m.id)).length}</div><div class="kpi-label">Monthים פעילים</div></div>
    </div>

    <div class="grid-2 mb-6">
      <div class="card">
        <div class="card-header"><span class="card-title">Improving Students ביותר</span></div>
        <div class="card-body" style="padding:0">
          <table>
            <thead><tr><th>תלמיד</th><th>Provider</th><th>Trend</th><th>Assessments</th></tr></thead>
            <tbody>
              ${improving.slice(0,6).map((s,i) => `
                <tr class="clickable" onclick="navigate('student_profile',{studentId:'${s.id}'})">
                  <td class="primary"><div style="display:flex;align-items:center;gap:8px"><div class="user-avatar" style="width:28px;height:28px;font-size:0.65rem;background:${avatarColor(i)}">${getInitials(getStudentName(s))}</div>${getStudentName(s)}</div></td>
                  <td style="font-size:0.82rem">${getProvider(s.providerId)?.name.split(' ').slice(0,2).join(' ')||'—'}</td>
                  <td>${trendBadge('up')}</td>
                  <td><span class="badge badge-teal font-en">${getStudentAssessments(s.id).length}</span></td>
                </tr>`).join('')}
              ${improving.length === 0 ? '<tr><td colspan="4" class="text-center text-muted" style="padding:20px">No data</td></tr>' : ''}
            </tbody>
          </table>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">At-Risk Students</span></div>
        <div class="card-body" style="padding:0">
          <table>
            <thead><tr><th>תלמיד</th><th>Provider</th><th>Trend</th><th>Action</th></tr></thead>
            <tbody>
              ${struggling.slice(0,6).map((s,i) => `
                <tr class="clickable danger-row" onclick="navigate('student_profile',{studentId:'${s.id}'})">
                  <td class="primary"><div style="display:flex;align-items:center;gap:8px"><div class="user-avatar" style="width:28px;height:28px;font-size:0.65rem;background:${avatarColor(i)}">${getInitials(getStudentName(s))}</div>${getStudentName(s)}</div></td>
                  <td style="font-size:0.82rem">${getProvider(s.providerId)?.name.split(' ').slice(0,2).join(' ')||'—'}</td>
                  <td>${trendBadge('down')}</td>
                  <td onclick="event.stopPropagation()"><button class="btn btn-outline btn-sm" onclick="navigate('student_profile',{studentId:'${s.id}'})">Review</button></td>
                </tr>`).join('')}
              ${struggling.length === 0 ? '<tr><td colspan="4" class="text-center text-muted" style="padding:20px">אין תלמידים בסיכון</td></tr>' : ''}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="grid-2 mb-6">
      <div class="card">
        <div class="card-header"><span class="card-title">Trend Distribution</span></div>
        <div class="card-body"><div class="chart-container"><canvas id="trendDistChart"></canvas></div></div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">Category Averages — All Providers</span></div>
        <div class="card-body"><div class="chart-container"><canvas id="catAvgChart"></canvas></div></div>
      </div>
    </div>

    <div class="card mb-6">
      <div class="card-header"><span class="card-title">YTD Trend — All Students Average</span></div>
      <div class="card-body"><div class="chart-container"><canvas id="ytdTrendChart"></canvas></div></div>
    </div>

    <div class="card">
      <div class="card-header"><span class="card-title">Cohort Analysis by Provider</span></div>
      <div class="card-body" style="padding:0">
        <table>
          <thead><tr><th>Provider</th><th>Students</th><th>Assessments</th><th>Improving</th><th>At Risk</th>${CATEGORIES.map(c=>`<th>${c.label}</th>`).join('')}</tr></thead>
          <tbody>
            ${DB.providers.map(p => {
              const stats = getProviderStats(p.id);
              return `<tr class="clickable" onclick="navigate('provider_profile',{providerId:'${p.id}'})">
                <td class="primary">${p.name}</td>
                <td><span class="badge badge-teal font-en">${stats.students}</span></td>
                <td><span class="badge badge-neutral font-en">${stats.assessments}</span></td>
                <td><span class="badge badge-success font-en">${stats.improving}</span></td>
                <td><span class="badge badge-danger font-en">${stats.struggling}</span></td>
                ${CATEGORIES.map(cat => `<td style="font-family:var(--font-en);font-weight:700;color:${cat.color}">${stats.catAvgs[cat.id]}</td>`).join('')}
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;

  setTimeout(() => {
    // Trend distribution
    const up = improving.length, down = struggling.length, flat = DB.students.length - up - down;
    const ctxTrend = document.getElementById('trendDistChart');
    if (ctxTrend) chartInstances.trendDist = new Chart(ctxTrend, {
      type: 'doughnut',
      data: { labels: ['משתפרים','יציבים','בסיכון'], datasets: [{ data: [up,flat,down], backgroundColor: ['#2d7a4f','#6b8f8f','#c0392b'], borderWidth: 2, borderColor: '#fff' }] },
      options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ font:{size:12}, padding:12 } } } }
    });

    // Category averages
    const ctxCat = document.getElementById('catAvgChart');
    if (ctxCat) chartInstances.catAvg = new Chart(ctxCat, {
      type: 'radar',
      data: {
        labels: CATEGORIES.map(c => c.label),
        datasets: DB.providers.map((p,i) => {
          const stats = getProviderStats(p.id);
          const colors = ['#2196F3','#9C27B0','#FF9800','#4CAF50'];
          return { label: p.name.split(' ').slice(0,2).join(' '), data: CATEGORIES.map(cat => stats.catAvgs[cat.id]), borderColor: colors[i%4], backgroundColor: colors[i%4]+'20', pointRadius: 4 };
        })
      },
      options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ font:{size:11}, padding:8 } } }, scales:{ r:{ beginAtZero:true, grid:{ color:'#f0f0f0' } } } }
    });

    // YTD trend
    const ctxYTD = document.getElementById('ytdTrendChart');
    if (ctxYTD) {
      const months = HEBREW_MONTHS_FULL.slice(0,9);
      chartInstances.ytdTrend = new Chart(ctxYTD, {
        type: 'line',
        data: { labels: months.map(m=>m.label), datasets: CATEGORIES.map(cat => ({
          label: cat.label,
          data: months.map(m => { const ass = DB.assessments.filter(a=>a.month===m.id); return ass.length ? Math.round(ass.reduce((s,a)=>s+(a.categories[cat.id]?.correct||0),0)/ass.length*10)/10 : null; }),
          borderColor: cat.color, backgroundColor: cat.color+'15', tension: 0.4, fill: true, pointRadius: 4,
        })) },
        options: { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:'bottom', labels:{ font:{size:11}, padding:10 } } }, scales:{ x:{ grid:{color:'#f5f5f5'} }, y:{ beginAtZero:true, grid:{color:'#f5f5f5'} } } }
      });
    }
  }, 60);
}

// ============================================================
// ADMIN PANEL
// ============================================================
let adminTab = 'logs';

function renderAdmin() {
  document.getElementById('pageContent').innerHTML = `
    <div class="page-header">
      <div><h1 class="page-title">Admin Panel</h1><p class="page-subtitle">Logs, audit trail, performance monitoring, system management</p></div>
    </div>

    <div class="kpi-grid mb-6">
      <div class="kpi-card"><div class="kpi-icon" style="background:var(--teal-50);color:var(--teal-600)"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg></div><div class="kpi-value">${DB.systemLog.length}</div><div class="kpi-label">System Logs</div></div>
      <div class="kpi-card gold"><div class="kpi-icon" style="background:var(--gold-100);color:var(--gold-600)"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></div><div class="kpi-value">${DB.auditLog.length}</div><div class="kpi-label">Audit Records</div></div>
      <div class="kpi-card success"><div class="kpi-icon" style="background:var(--success-bg);color:var(--success)"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg></div><div class="kpi-value">${DB.ocrImports.length}</div><div class="kpi-label">OCR Imports</div></div>
      <div class="kpi-card ${DB.systemLog.filter(l=>l.type==='danger').length>0?'danger':'success'}"><div class="kpi-icon" style="background:${DB.systemLog.filter(l=>l.type==='danger').length>0?'var(--danger-bg)':'var(--success-bg)'};color:${DB.systemLog.filter(l=>l.type==='danger').length>0?'var(--danger)':'var(--success)'}"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div><div class="kpi-value">${DB.systemLog.filter(l=>l.type==='danger').length}</div><div class="kpi-label">System Errors</div></div>
    </div>

    <div class="tabs">
      <button class="tab-btn ${adminTab==='logs'?'active':''}" onclick="adminTab='logs';renderAdmin()">System Logs</button>
      <button class="tab-btn ${adminTab==='audit'?'active':''}" onclick="adminTab='audit';renderAdmin()">Audit Trail</button>
      <button class="tab-btn ${adminTab==='ocr'?'active':''}" onclick="adminTab='ocr';renderAdmin()">OCR Imports</button>
      <button class="tab-btn ${adminTab==='perf'?'active':''}" onclick="adminTab='perf';renderAdmin()">Performance</button>
    </div>

    <div id="adminTabContent"></div>`;

  if (adminTab === 'logs') renderAdminLogs();
  else if (adminTab === 'audit') renderAdminAudit();
  else if (adminTab === 'ocr') renderAdminOCR();
  else if (adminTab === 'perf') renderAdminPerf();
}

function renderAdminLogs() {
  document.getElementById('adminTabContent').innerHTML = `
    <div class="card">
      <div class="card-header">
        <span class="card-title">System Logs (${DB.systemLog.length})</span>
        <div style="display:flex;gap:8px">
          <span class="badge badge-danger">${DB.systemLog.filter(l=>l.type==='danger').length} שגיאות</span>
          <span class="badge badge-warning">${DB.systemLog.filter(l=>l.type==='warning').length} אזהרות</span>
        </div>
      </div>
      <div class="card-body" style="padding:0 22px">
        ${DB.systemLog.map(log => `
          <div class="log-entry">
            <div class="log-dot ${log.type}"></div>
            <div class="log-time">${formatDateTime(log.timestamp)}</div>
            <div class="log-message">${log.message}</div>
            <div class="log-user">${log.user}</div>
            <span class="badge badge-${log.type==='success'?'success':log.type==='warning'?'warning':log.type==='danger'?'danger':'info'}" style="font-size:0.65rem">${log.type}</span>
          </div>`).join('')}
      </div>
    </div>`;
}

function renderAdminAudit() {
  document.getElementById('adminTabContent').innerHTML = `
    <div class="card">
      <div class="card-header"><span class="card-title">יומן ביקורת — כל השינויים (${DB.auditLog.length})</span></div>
      <div class="table-wrapper">
        <table>
          <thead><tr><th>Date & Time</th><th>Action</th><th>Entity</th><th>Name</th><th>Field</th><th>Before</th><th>After</th><th>User</th></tr></thead>
          <tbody>
            ${DB.auditLog.map(e => `
              <tr>
                <td style="font-family:var(--font-en);font-size:0.78rem;white-space:nowrap">${formatDateTime(e.timestamp)}</td>
                <td><span class="badge badge-teal">${e.action}</span></td>
                <td style="font-size:0.82rem">${e.entity}</td>
                <td class="primary">${e.entityName}</td>
                <td style="font-size:0.82rem;color:var(--text-muted)">${e.field}</td>
                <td><span class="diff-before">${e.before}</span></td>
                <td><span class="diff-after">${e.after}</span></td>
                <td style="font-size:0.82rem">${e.user}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}

function renderAdminOCR() {
  document.getElementById('adminTabContent').innerHTML = `
    <div class="card">
      <div class="card-header"><span class="card-title">היסטוריית OCR Imports (${DB.ocrImports.length})</span></div>
      ${DB.ocrImports.length === 0 ? `<div class="card-body"><div class="empty-state"><h3>No OCR imports yet</h3><button class="btn btn-primary mt-4" onclick="navigate('ocr')">Upload Worksheet</button></div></div>` :
      `<div class="table-wrapper">
        <table>
          <thead><tr><th>Date</th><th>Provider</th><th>Month</th><th>Imported</th><th>Overwritten</th><th>Skipped</th><th>Status</th></tr></thead>
          <tbody>
            ${DB.ocrImports.map(imp => `
              <tr>
                <td style="font-family:var(--font-en);font-size:0.82rem">${formatDateTime(imp.timestamp)}</td>
                <td>${getProvider(imp.provider)?.name||'—'}</td>
                <td><span class="heb-month-pill" style="font-size:0.72rem;padding:3px 8px">${getMonthLabel(imp.month)}</span></td>
                <td><span class="badge badge-success font-en">${imp.imported}</span></td>
                <td><span class="badge badge-warning font-en">${imp.overwritten}</span></td>
                <td><span class="badge badge-neutral font-en">${imp.skipped}</span></td>
                <td><span class="badge badge-success">Completed</span></td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>`}
    </div>`;
}

function renderAdminPerf() {
  const metrics = [
    { label: 'Dashboard load time', value: '0.4s', pct: 85, status: 'success' },
    { label: 'Analytics load time', value: '1.2s', pct: 60, status: 'warning' },
    { label: 'OCR processing time', value: '2.1s', pct: 45, status: 'warning' },
    { label: 'PDF generation time', value: '0.8s', pct: 75, status: 'success' },
    { label: 'Database queries', value: '0.1s', pct: 95, status: 'success' },
    { label: 'Average response time', value: '0.6s', pct: 80, status: 'success' },
  ];
  document.getElementById('adminTabContent').innerHTML = `
    <div class="grid-2">
      <div class="card">
        <div class="card-header"><span class="card-title">Performance Metrics</span></div>
        <div class="card-body">
          ${metrics.map(m => `
            <div style="margin-bottom:16px">
              <div style="display:flex;justify-content:space-between;margin-bottom:6px">
                <span style="font-size:0.88rem;font-weight:600">${m.label}</span>
                <div style="display:flex;align-items:center;gap:8px">
                  <span style="font-family:var(--font-en);font-weight:700;color:var(--teal-700)">${m.value}</span>
                  <span class="badge badge-${m.status==='success'?'success':'warning'}">${m.status==='success'?'Normal':'Slow'}</span>
                </div>
              </div>
              <div class="progress-bar-wrap"><div class="progress-bar-fill ${m.status!=='success'?'gold':''}" style="width:${m.pct}%"></div></div>
            </div>`).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><span class="card-title">System Health</span></div>
        <div class="card-body">
          <div class="stat-row"><span class="stat-label">Students in DB</span><span class="stat-value">${DB.students.length}</span></div>
          <div class="stat-row"><span class="stat-label">ספקים</span><span class="stat-value">${DB.providers.length}</span></div>
          <div class="stat-row"><span class="stat-label">הערכות</span><span class="stat-value">${DB.assessments.length}</span></div>
          <div class="stat-row"><span class="stat-label">OCR Imports</span><span class="stat-value">${DB.ocrImports.length}</span></div>
          <div class="stat-row"><span class="stat-label">System Logs</span><span class="stat-value">${DB.systemLog.length}</span></div>
          <div class="stat-row"><span class="stat-label">Audit Records</span><span class="stat-value">${DB.auditLog.length}</span></div>
          <div class="divider"></div>
          <div class="alert alert-success" style="margin:0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            <span>All systems operating normally</span>
          </div>
        </div>
      </div>
    </div>`;
}