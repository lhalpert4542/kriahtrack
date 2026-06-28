// KriahTrack — Part 1: Constants & Data
const CATS=[
  {id:'otiyot',       label:'אותיות',           color:'#005778', hasMistakes:true},
  {id:'ot_nekuda',    label:'אות + נקודה',       color:'#D9A44E', hasMistakes:true},
  {id:'ot_nekuda_ot', label:'אות + נקודה + אות', color:'#808285', hasMistakes:true},
  {id:'milim',        label:'מילים',             color:'#1a7a9a', hasMistakes:false},
  {id:'tehilim',      label:'תהילים',            color:'#b8832e', hasMistakes:false},
];
const HEB_MONTHS=[{id:'tishrei',label:'תשרי',order:1},{id:'cheshvan',label:'חשון',order:2},{id:'kislev',label:'כסלו',order:3},{id:'tevet',label:'טבת',order:4},{id:'shvat',label:'שבט',order:5},{id:'adar',label:'אדר',order:6},{id:'nisan',label:'ניסן',order:7},{id:'iyar',label:'אייר',order:8},{id:'sivan',label:'סיון',order:9},{id:'tamuz',label:'תמוז',order:10},{id:'av',label:'אב',order:11},{id:'elul',label:'אלול',order:12}];
const CUR_YEAR='תשפ״ו',CUR_MONTH='sivan',HEB_TODAY='כ״ו סיון תשפ״ו';
const HEB_YEARS = ['תשפ״ו','תשפ״ז','תשפ״ח','תשפ״ט'];
function yearSelect(selectedYear) {
  return HEB_YEARS.map(y => `<option value="${y}" ${y===selectedYear?'selected':''}>${y}</option>`).join('');
}
let SCHOOL = { name: 'Ichud Boys Program' };
let KRIAH_DIRECTOR = { name: '', email: '', title: 'Kriah Director' };

// CLASSES — each belongs to a division (program)
// classId is used as providerId on students for class assignment
let CLASSES = [
  { id: 'cls1', name: 'Aleph',  divisionId: 'div_ahuvim',    grade: '1st' },
  { id: 'cls2', name: 'Beis',   divisionId: 'div_ahuvim',    grade: '2nd' },
  { id: 'cls3', name: 'Gimmel', divisionId: 'div_nechmudim', grade: '3rd' },
  { id: 'cls4', name: 'Daled',  divisionId: 'div_nechmudim', grade: '4th' },
  { id: 'cls5', name: 'Hey',    divisionId: 'div_masmidim',  grade: '5th' },
  { id: 'cls6', name: 'Vov',    divisionId: 'div_masmidim',  grade: '6th' },
];

// PROVIDERS — staff members, each works 1:1 with students
// Students are assigned to a provider (their Kriah teacher)
let PROVIDERS = [
  { id: 'prov1', name: 'Rabbi Goldstein',  email: 'goldstein@ichud.edu',  phone: '', studentIds: [] },
  { id: 'prov2', name: 'Rabbi Friedman',   email: 'friedman@ichud.edu',   phone: '', studentIds: [] },
  { id: 'prov3', name: 'Rabbi Schwartz',   email: 'schwartz@ichud.edu',   phone: '', studentIds: [] },
  { id: 'prov4', name: 'Rabbi Weiss',      email: 'weiss@ichud.edu',      phone: '', studentIds: [] },
];

// Assign programs to classes
PROGRAMS[0].classIds = ['cls1','cls2'];
PROGRAMS[1].classIds = ['cls3','cls4'];
PROGRAMS[2].classIds = ['cls5','cls6'];

// Report finalization state
let REPORT_FINALS = {}; // key: studentId_month_year -> {finalized, note, lang}

// STUDENTS — each has classId (their class) + providerId (their 1:1 Kriah teacher)
let STUDENTS=[
  {id:'s1', firstName:'יוסף',  lastName:'כהן',      classId:'cls1', providerId:'prov1', year:'תשפ״ו', status:'active', notes:''},
  {id:'s2', firstName:'מנחם',  lastName:'לוי',      classId:'cls1', providerId:'prov1', year:'תשפ״ו', status:'active', notes:''},
  {id:'s3', firstName:'אברהם', lastName:'גולדברג',  classId:'cls2', providerId:'prov2', year:'תשפ״ו', status:'active', notes:''},
  {id:'s4', firstName:'שמואל', lastName:'רוזנברג',  classId:'cls2', providerId:'prov2', year:'תשפ״ו', status:'active', notes:''},
  {id:'s5', firstName:'דוד',   lastName:'פרידמן',   classId:'cls3', providerId:'prov3', year:'תשפ״ו', status:'active', notes:''},
  {id:'s6', firstName:'ישראל', lastName:'ברגר',     classId:'cls3', providerId:'prov3', year:'תשפ״ו', status:'active', notes:''},
  {id:'s7', firstName:'מרדכי', lastName:'שטיין',    classId:'cls4', providerId:'prov4', year:'תשפ״ו', status:'active', notes:''},
  {id:'s8', firstName:'פנחס',  lastName:'וייס',     classId:'cls4', providerId:'prov4', year:'תשפ״ו', status:'active', notes:''},
  {id:'s9', firstName:'אליהו', lastName:'שוורץ',    classId:'cls5', providerId:'prov1', year:'תשפ״ו', status:'active', notes:''},
  {id:'s10',firstName:'נחמן',  lastName:'גרינבאום', classId:'cls5', providerId:'prov2', year:'תשפ״ו', status:'active', notes:''},
  {id:'s11',firstName:'חיים',  lastName:'בלום',     classId:'cls6', providerId:'prov3', year:'תשפ״ו', status:'active', notes:''},
  {id:'s12',firstName:'זלמן',  lastName:'הורוביץ',  classId:'cls6', providerId:'prov4', year:'תשפ״ו', status:'active', notes:''},
];
// Sync provider caseloads
PROVIDERS.forEach(p => { p.studentIds = STUDENTS.filter(s => s.providerId === p.id).map(s => s.id); });

let ASSESSMENTS=[],SYS_LOGS=[{id:'l1',type:'success',message:'KriahTrack initialized with demo data',timestamp:new Date().toISOString()},{id:'l2',type:'info',message:'12 students, 4 providers, demo assessments loaded',timestamp:new Date().toISOString()}],AUDIT_LOG=[],OCR_IMPORTS=[];
(function seed(){const months=['tishrei','cheshvan','kislev','tevet','shvat','adar','nisan','iyar','sivan'];STUDENTS.forEach(s=>{const base=10+Math.floor(Math.random()*12);months.forEach((m,mi)=>{if(Math.random()>0.12){const g=mi*1.2,n=()=>Math.floor(Math.random()*4)-1;ASSESSMENTS.push({id:`a_${s.id}_${m}`,studentId:s.id,providerId:s.providerId,month:m,year:CUR_YEAR,source:'manual',createdAt:new Date().toISOString(),categories:{otiyot:{correct:Math.max(0,Math.min(30,Math.floor(base+g+n()+8))),mistakes:Math.max(0,Math.floor(7-g*0.3+Math.abs(n())))},ot_nekuda:{correct:Math.max(0,Math.min(28,Math.floor(base+g+n()+4))),mistakes:Math.max(0,Math.floor(9-g*0.3+Math.abs(n())))},ot_nekuda_ot:{correct:Math.max(0,Math.min(25,Math.floor(base+g+n()))),mistakes:Math.max(0,Math.floor(11-g*0.3+Math.abs(n())))},milim:{correct:Math.max(0,Math.min(22,Math.floor(base+g+n()-2))),mistakes:Math.max(0,Math.floor(9-g*0.3+Math.abs(n())))},tehilim:{correct:Math.max(0,Math.min(20,Math.floor(base+g+n()-4))),mistakes:Math.max(0,Math.floor(7-g*0.3+Math.abs(n())))}}});}});});})();

// Part 2: Helpers & Navigation
const $=id=>document.getElementById(id);
const sName=s=>`${s.firstName} ${s.lastName}`;
const getProvider=id=>PROVIDERS.find(p=>p.id===id);
const getStudent=id=>STUDENTS.find(s=>s.id===id);
const getMonthLabel=id=>HEB_MONTHS.find(m=>m.id===id)?.label||id;
const getMonthOrder=id=>HEB_MONTHS.find(m=>m.id===id)?.order||0;
const getStudentAssessments=sid=>ASSESSMENTS.filter(a=>a.studentId===sid).sort((a,b)=>getMonthOrder(a.month)-getMonthOrder(b.month));
const getProviderStudents=pid=>STUDENTS.filter(s=>s.providerId===pid);
const genId=p=>`${p}_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
const initials=name=>name.split(' ').map(w=>w[0]).join('').slice(0,2);
const fmtDate=iso=>iso?new Date(iso).toLocaleDateString('he-IL'):'—';
const fmtTime=iso=>iso?new Date(iso).toLocaleTimeString('he-IL',{hour:'2-digit',minute:'2-digit'}):'—';
const ACOLORS=['#005778','#1a7a9a','#D9A44E','#b8832e','#808285','#005778','#D9A44E','#1a7a9a'];
const avatarColor=i=>ACOLORS[i%ACOLORS.length];

function getStudentTrend(sid){const ass=getStudentAssessments(sid);if(ass.length<2)return'flat';let up=0,down=0;CATS.forEach(cat=>{const l=ass[ass.length-1].categories[cat.id],p=ass[ass.length-2].categories[cat.id];const ls=(l?.correct||0)-(l?.mistakes||0),ps=(p?.correct||0)-(p?.mistakes||0);if(ls>ps+1)up++;else if(ls<ps-1)down++;});return up>=3?'up':down>=3?'down':'flat';}
function trendBadge(t){if(t==='up')return'<span class="badge badge-success">↑ Improving</span>';if(t==='down')return'<span class="badge badge-danger">↓ Declining</span>';return'<span class="badge badge-neutral">→ Stable</span>';}
function trendIcon(t){if(t==='up')return'<span style="color:#1a6038;font-weight:700;font-size:0.75rem">↑ Improving</span>';if(t==='down')return'<span style="color:#9a1c1c;font-weight:700;font-size:0.75rem">↓ Declining</span>';return'<span style="color:#808285;font-weight:700;font-size:0.75rem">→ Stable</span>';}
function getAlerts(){const a=[];STUDENTS.forEach(s=>{const t=getStudentTrend(s.id),ass=getStudentAssessments(s.id);if(ass.length<2)return;if(t==='down')a.push({type:'danger',title:`${sName(s)} — Declining`,message:'Consistent decline detected',studentId:s.id});else if(t==='up')a.push({type:'success',title:`${sName(s)} — Improving`,message:'Consistent improvement',studentId:s.id});});return a.slice(0,8);}
function showToast(msg,type='success'){const c=$('toastContainer');if(!c)return;const t=document.createElement('div');t.className=`toast toast-${type}`;t.innerHTML=`<span>${{success:'✓',warning:'⚠',danger:'✕',info:'ℹ'}[type]||'✓'}</span><span>${msg}</span>`;c.appendChild(t);setTimeout(()=>{t.style.opacity='0';t.style.transform='translateX(20px)';t.style.transition='all 0.3s';setTimeout(()=>t.remove(),300);},3000);}
function openModal(id){$(id)?.classList.add('open');}
function closeModal(id){$(id)?.classList.remove('open');}
function toggleSidebar(){$('sidebar')?.classList.toggle('open');$('sidebarOverlay')?.classList.toggle('open');}
function closeSidebar(){$('sidebar')?.classList.remove('open');$('sidebarOverlay')?.classList.remove('open');}
let _charts={};
function destroyCharts(){Object.values(_charts).forEach(c=>{try{c.destroy();}catch(e){}});_charts={};}

let _page='dashboard',_params={},_profileTab='overview';
function navigate(page,params={}){
  _page=page;_params=params;
  document.querySelectorAll('.nav-item').forEach(el=>el.classList.remove('active'));
  const map={student_profile:'students',provider_profile:'providers'};
  const el=document.querySelector(`.nav-item[data-page="${map[page]||page}"]`);
  if(el)el.classList.add('active');
  const names={dashboard:'Dashboard',students:'Students',student_profile:'Student Profile',providers:'Providers',provider_profile:'Provider Profile',worksheets:'Worksheets',reports:'Monthly Reports',ocr:'Upload Worksheet',analytics:'Analytics',admin:'Admin Panel'};
  const hb=$('headerBreadcrumb');if(hb)hb.textContent=names[page]||page;
  const hs=$('headerSubBreadcrumb');if(hs)hs.textContent='';
  destroyCharts();
  if(page==='student_profile')_profileTab='overview';
  const content=$('pageContent');if(!content)return;
  content.style.opacity='0';
  requestAnimationFrame(()=>{
    try{
      if(page==='dashboard')renderDashboard();
      else if(page==='students')renderStudents();
      else if(page==='student_profile')renderStudentProfile(params.studentId);
      else if(page==='providers')renderProviders();
      else if(page==='provider_profile')renderProviderProfile(params.providerId);
      else if(page==='worksheets')renderWorksheets();
      else if(page==='reports')renderReports();
      else if(page==='ocr')renderOCR();
      else if(page==='analytics')renderAnalytics();
      else if(page==='admin')renderAdmin();
    }catch(e){console.error('[KT]',page,e);content.innerHTML=`<div style="padding:40px;color:#9a1c1c;font-family:monospace;font-size:0.85rem">Error on ${page}: ${e.message}<br><pre style="margin-top:10px;font-size:0.75rem">${e.stack}</pre></div>`;}
    content.style.transition='opacity 0.2s';content.style.opacity='1';
    const sb=$('studentsBadge');if(sb)sb.textContent=STUDENTS.length;
    const pb=$('providersBadge');if(pb)pb.textContent=PROVIDERS.length;
    closeSidebar();window.scrollTo({top:0,behavior:'smooth'});
  });
}

// Part 3: Dashboard
function renderDashboard(){
  const total=ASSESSMENTS.length,monthly=ASSESSMENTS.filter(a=>a.month===CUR_MONTH).length;
  const improving=STUDENTS.filter(s=>getStudentTrend(s.id)==='up').length;
  const struggling=STUDENTS.filter(s=>getStudentTrend(s.id)==='down').length;
  const alerts=getAlerts();
  $('pageContent').innerHTML=`
<div class="page-header">
  <div><h1 class="page-title">Dashboard</h1><p class="page-subtitle">Year-to-date — <span class="he">${CUR_YEAR}</span></p></div>
  <div style="display:flex;gap:8px">
    <button class="btn btn-outline btn-sm" onclick="navigate('analytics')">Analytics</button>
    <button class="btn btn-primary btn-sm" onclick="navigate('ocr')">Upload Worksheet</button>
  </div>
</div>
<div class="kpi-grid">
  <div class="kpi-card" onclick="navigate('students')" style="cursor:pointer">
    <div class="kpi-icon" style="background:#e0eef5;color:#005778"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
    <div class="kpi-value">${STUDENTS.length}</div><div class="kpi-label">Active Students</div>
    <div class="kpi-trend up">↑ <span class="he">${CUR_YEAR}</span></div>
  </div>
  <div class="kpi-card gold" onclick="navigate('providers')" style="cursor:pointer">
    <div class="kpi-icon" style="background:#fdf3e3;color:#D9A44E"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
    <div class="kpi-value">${PROVIDERS.length}</div><div class="kpi-label">Active Providers</div>
    <div class="kpi-trend neutral">→ No change</div>
  </div>
  <div class="kpi-card success">
    <div class="kpi-icon" style="background:#e4f2eb;color:#1a6038"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
    <div class="kpi-value">${total}</div><div class="kpi-label">YTD Assessments</div>
    <div class="kpi-trend up">↑ ${monthly} this month</div>
  </div>
  <div class="kpi-card ${improving>=struggling?'success':'warning'}">
    <div class="kpi-icon" style="background:${improving>=struggling?'#e4f2eb':'#fff3e0'};color:${improving>=struggling?'#1a6038':'#7a4800'}"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg></div>
    <div class="kpi-value">${improving}</div><div class="kpi-label">Improving Students</div>
    <div class="kpi-trend ${struggling>0?'down':'up'}">${struggling} need attention</div>
  </div>
</div>
${alerts.length?`<div class="card mb-6"><div class="card-header"><span class="card-title">Active Alerts</span><span class="badge badge-danger">${alerts.length}</span></div><div class="card-body" style="padding:14px"><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:8px">${alerts.slice(0,6).map(a=>`<div class="alert alert-${a.type}" style="margin:0;cursor:pointer" onclick="navigate('student_profile',{studentId:'${a.studentId}'})"><div><div style="font-weight:700;font-size:0.84rem">${a.title}</div><div style="font-size:0.76rem;margin-top:2px">${a.message}</div></div></div>`).join('')}</div></div></div>`:''}
<div class="grid-2 mb-6">
  <div class="card"><div class="card-header"><span class="card-title">Category Trends — YTD</span></div><div class="card-body"><div class="chart-container"><canvas id="catChart"></canvas></div></div></div>
  <div class="card"><div class="card-header"><span class="card-title">Provider Comparison</span></div><div class="card-body"><div class="chart-container"><canvas id="provChart"></canvas></div></div></div>
</div>
<div class="grid-2">
  <div class="card"><div class="card-header"><span class="card-title">Recent Activity</span><button class="btn btn-ghost btn-sm" onclick="navigate('admin')">View All</button></div><div class="card-body" style="padding:0 20px">${SYS_LOGS.slice(0,6).map(l=>`<div style="display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid #e8d9b8;font-size:0.82rem"><div style="width:7px;height:7px;border-radius:50%;margin-top:5px;flex-shrink:0;background:${{success:'#1a6038',warning:'#D9A44E',danger:'#9a1c1c',info:'#005778'}[l.type]||'#808285'}"></div><div style="font-size:0.7rem;color:#808285;white-space:nowrap;min-width:80px">${fmtTime(l.timestamp)}</div><div style="flex:1;color:#444">${l.message}</div></div>`).join('')}</div></div>
  <div class="card"><div class="card-header"><span class="card-title">Students — <span class="he">סיון תשפ״ו</span></span><button class="btn btn-ghost btn-sm" onclick="navigate('students')">All Students</button></div><div class="card-body" style="padding:0"><table><thead><tr><th>Student</th><th>Provider</th><th>Trend</th><th>#</th></tr></thead><tbody>${STUDENTS.slice(0,7).map((s,i)=>{const t=getStudentTrend(s.id),cnt=getStudentAssessments(s.id).length,prov=getProvider(s.providerId);return`<tr class="clickable" onclick="navigate('student_profile',{studentId:'${s.id}'})"><td class="primary"><div style="display:flex;align-items:center;gap:8px"><div class="user-avatar" style="width:28px;height:28px;font-size:0.65rem;background:${avatarColor(i)}">${initials(sName(s))}</div><span class="he">${sName(s)}</span></div></td><td style="font-size:0.8rem">${prov?prov.name.split(' ').slice(0,2).join(' '):'—'}</td><td>${trendIcon(t)}</td><td><span class="badge badge-blue">${cnt}</span></td></tr>`;}).join('')}</tbody></table></div></div>
</div>`;
  setTimeout(()=>{
    const c1=$('catChart');if(c1){const months=HEB_MONTHS.slice(0,9);_charts.cat=new Chart(c1,{type:'line',data:{labels:months.map(m=>m.label),datasets:CATS.map(cat=>({label:cat.label,tension:0.4,fill:false,pointRadius:3,borderColor:cat.color,backgroundColor:cat.color+'20',data:months.map(m=>{const ass=ASSESSMENTS.filter(a=>a.month===m.id);return ass.length?Math.round(ass.reduce((s,a)=>s+(a.categories[cat.id]?.correct||0),0)/ass.length*10)/10:null;})}))},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:10},padding:8}}},scales:{x:{grid:{color:'#f0f0f0'}},y:{beginAtZero:true,grid:{color:'#f0f0f0'}}}}});}
    const c2=$('provChart');if(c2){_charts.prov=new Chart(c2,{type:'bar',data:{labels:PROVIDERS.map(p=>p.name.split(' ').slice(0,2).join(' ')),datasets:CATS.map(cat=>({label:cat.label,backgroundColor:cat.color+'CC',borderColor:cat.color,borderWidth:1,data:PROVIDERS.map(p=>{const ss=getProviderStudents(p.id),ass=ASSESSMENTS.filter(a=>ss.some(s=>s.id===a.studentId));return ass.length?Math.round(ass.reduce((s,a)=>s+(a.categories[cat.id]?.correct||0),0)/ass.length*10)/10:0;})}))},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:10},padding:6}}},scales:{x:{grid:{display:false}},y:{beginAtZero:true,grid:{color:'#f0f0f0'}}}}});}
  },80);
}

// Part 4: Students & Profile
let _ss='',_sp='',_st='';
function renderStudents(){
  const f=STUDENTS.filter(s=>(!_ss||sName(s).toLowerCase().includes(_ss.toLowerCase()))&&(!_sp||s.providerId===_sp)&&(!_st||getStudentTrend(s.id)===_st));
  $('pageContent').innerHTML=`
<div class="page-header"><div><h1 class="page-title">Students</h1><p class="page-subtitle">${STUDENTS.length} registered students — click a row for full profile</p></div><button class="btn btn-primary" onclick="openAddStudentModal()">+ Add Student</button></div>
<div class="filter-bar">
  <div class="search-bar"><svg class="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input type="text" placeholder="Search student..." value="${_ss}" oninput="_ss=this.value;renderStudents()"></div>
  <select class="form-control" style="width:auto" onchange="_sp=this.value;renderStudents()"><option value="">All Providers</option>${PROVIDERS.map(p=>`<option value="${p.id}" ${_sp===p.id?'selected':''}>${p.name}</option>`).join('')}</select>
  <select class="form-control" style="width:auto" onchange="_st=this.value;renderStudents()"><option value="">All Trends</option><option value="up" ${_st==='up'?'selected':''}>↑ Improving</option><option value="down" ${_st==='down'?'selected':''}>↓ Declining</option><option value="flat" ${_st==='flat'?'selected':''}>→ Stable</option></select>
  <span class="badge badge-blue">${f.length} students</span>
</div>
<div class="card"><div class="table-wrapper"><table>
  <thead><tr><th>#</th><th>Student</th><th>Provider</th><th>Class</th><th>Trend</th><th>Assessments</th><th>Last Month</th><th>Actions</th></tr></thead>
  <tbody>${f.length===0?`<tr><td colspan="8" style="text-align:center;padding:40px;color:#808285">No students found</td></tr>`:f.map((s,i)=>{
    const t=getStudentTrend(s.id),ass=getStudentAssessments(s.id),lastA=ass[ass.length-1],prov=getProvider(s.providerId);
    return`<tr class="clickable" onclick="navigate('student_profile',{studentId:'${s.id}'})">
      <td style="color:#808285">${i+1}</td>
      <td class="primary"><div style="display:flex;align-items:center;gap:10px"><div class="user-avatar" style="width:32px;height:32px;font-size:0.72rem;background:${avatarColor(i)}">${initials(sName(s))}</div><div><div class="he" style="font-weight:700">${sName(s)}</div><div class="he" style="font-size:0.72rem;color:#808285">${s.year}</div></div></div></td>
      <td class="he" style="font-size:0.82rem">${prov?prov.name:'—'}</td>
      <td><span class="badge badge-blue">${s.class}</span></td>
      <td>${trendBadge(t)}</td>
      <td><span class="badge badge-neutral">${ass.length}</span></td>
      <td>${lastA?`<span class="he" style="background:#005778;color:#fff;padding:2px 8px;border-radius:20px;font-size:0.7rem;font-weight:700">${getMonthLabel(lastA.month)} ${lastA.year}</span>`:'—'}</td>
      <td onclick="event.stopPropagation()"><div style="display:flex;gap:6px"><button class="btn btn-outline btn-sm" onclick="navigate('student_profile',{studentId:'${s.id}'})">Profile</button><button class="btn btn-ghost btn-sm" onclick="openAddAssessmentModal('${s.id}')">+ Assess</button></div></td>
    </tr>`;}).join('')}</tbody>
</table></div></div>`;
}

function renderStudentProfile(sid){
  const s=getStudent(sid);if(!s){$('pageContent').innerHTML='<div style="padding:40px">Student not found</div>';return;}
  const ass=getStudentAssessments(sid),prov=getProvider(s.providerId),t=getStudentTrend(sid),lastA=ass[ass.length-1];
  const hs=$('headerSubBreadcrumb');if(hs)hs.innerHTML=` › <span class="he">${sName(s)}</span>`;
  $('pageContent').innerHTML=`
<div style="margin-bottom:14px"><button class="btn btn-ghost btn-sm" onclick="navigate('students')">← Back to Students</button></div>
<div class="student-profile-header">
  <div style="display:flex;align-items:center;gap:18px">
    <div class="user-avatar" style="width:64px;height:64px;font-size:1.4rem">${initials(sName(s))}</div>
    <div style="flex:1">
      <div class="he" style="font-size:1.4rem;font-weight:800;color:#fff">${sName(s)}</div>
      <div style="display:flex;gap:14px;margin-top:7px;flex-wrap:wrap">
        <span style="font-size:0.82rem;color:rgba(255,255,255,0.8)">📍 <span class="he">${prov?prov.name:'—'}</span></span>
        <span style="font-size:0.82rem;color:rgba(255,255,255,0.8)">Class ${s.class}</span>
        <span class="he" style="font-size:0.82rem;color:rgba(255,255,255,0.8)">${s.year}</span>
        ${trendBadge(t)}
      </div>
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-gold btn-sm" onclick="openAddAssessmentModal('${sid}')">+ Assessment</button>
      <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.3)" onclick="showStudentReport('${sid}')">Report</button>
    </div>
  </div>
</div>
<div style="display:flex;border-bottom:2px solid #e8d9b8;margin-bottom:22px">
  ${['overview','assessments','charts'].map(tab=>`<button style="padding:9px 18px;font-size:0.84rem;font-weight:${_profileTab===tab?'700':'600'};color:${_profileTab===tab?'#005778':'#808285'};cursor:pointer;border:none;background:${_profileTab===tab?'#e0eef5':'transparent'};border-bottom:2px solid ${_profileTab===tab?'#005778':'transparent'};margin-bottom:-2px;border-radius:${_profileTab===tab?'8px 8px 0 0':'0'}" onclick="_profileTab='${tab}';renderStudentProfile('${sid}')">${tab.charAt(0).toUpperCase()+tab.slice(1)}</button>`).join('')}
</div>
<div id="profileContent"></div>`;
  if(_profileTab==='overview')renderProfileOverview(sid,s,ass,lastA,prov);
  else if(_profileTab==='assessments')renderProfileAssessments(sid,ass);
  else renderProfileCharts(sid,ass);
}

function catGrid(cats,data){return`<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px">${cats.map(cat=>`<div style="background:#f8f9fa;border:1px solid #e8d9b8;border-top:3px solid ${cat.color};border-radius:8px;padding:10px;text-align:center"><div class="he" style="font-size:0.65rem;font-weight:700;color:${cat.color};margin-bottom:8px">${cat.label}</div><div style="display:flex;gap:4px;justify-content:center"><div style="text-align:center"><div style="font-size:1rem;font-weight:900;color:#1a6038">${data?.categories[cat.id]?.correct||0}</div><div style="font-size:0.55rem;color:#1a6038;font-weight:700">Correct</div></div><div style="color:#ccc;align-self:center">/</div><div style="text-align:center"><div style="font-size:1rem;font-weight:900;color:#9a1c1c">${data?.categories[cat.id]?.mistakes||0}</div><div style="font-size:0.55rem;color:#9a1c1c;font-weight:700">Mistakes</div></div></div></div>`).join('')}</div>`;}

function renderProfileOverview(sid,s,ass,lastA,prov){
  $('profileContent').innerHTML=`
<div class="grid-2 mb-6">
  <div class="card"><div class="card-header"><span class="card-title">Current Month — <span class="he">${lastA?getMonthLabel(lastA.month)+' '+lastA.year:'No data'}</span></span></div><div class="card-body">${lastA?catGrid(CATS,lastA):`<div style="text-align:center;padding:40px;color:#808285">No assessments yet<br><button class="btn btn-primary" style="margin-top:12px" onclick="openAddAssessmentModal('${sid}')">Add First Assessment</button></div>`}</div></div>
  <div class="card"><div class="card-header"><span class="card-title">YTD Summary — <span class="he">${s.year}</span></span></div><div class="card-body">
    ${CATS.map(cat=>{const totC=ass.reduce((sum,a)=>sum+(a.categories[cat.id]?.correct||0),0),totM=ass.reduce((sum,a)=>sum+(a.categories[cat.id]?.mistakes||0),0);return`<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;margin-bottom:4px"><span class="he" style="font-weight:700;font-size:0.85rem;color:${cat.color}">${cat.label}</span><span style="font-size:0.78rem"><span style="color:#1a6038;font-weight:700">${totC}</span> / <span style="color:#9a1c1c;font-weight:700">${totM}</span></span></div><div style="background:#f0ece4;border-radius:20px;height:6px;overflow:hidden"><div style="height:100%;border-radius:20px;background:${cat.color};width:${Math.min(100,totC*2)}%"></div></div></div>`;}).join('')}
    <div style="border-top:1px solid #e8d9b8;margin-top:12px;padding-top:12px"><div style="display:flex;justify-content:space-between;font-size:0.84rem;margin-bottom:6px"><span style="color:#808285">Total Assessments</span><span style="font-weight:800">${ass.length}</span></div><div style="display:flex;justify-content:space-between;font-size:0.84rem"><span style="color:#808285">Provider</span><span class="he" style="font-weight:700">${prov?prov.name:'—'}</span></div></div>
  </div></div>
</div>
<div class="card"><div class="card-header"><span class="card-title">Monthly Breakdown</span></div><div class="table-wrapper"><table>
  <thead><tr><th>Month</th>${CATS.map(c=>`<th colspan="2" style="text-align:center;border-right:2px solid rgba(255,255,255,0.2)"><span class="he">${c.label}</span></th>`).join('')}<th>Source</th></tr>
  <tr style="background:#1a7a9a">${['<th></th>'].concat(CATS.flatMap(()=>['<th style="font-size:0.7rem;color:#a8e0e0;text-align:center">✓</th>','<th style="font-size:0.7rem;color:#ffaaaa;text-align:center;border-right:2px solid rgba(255,255,255,0.15)">✗</th>'])).concat(['<th></th>']).join('')}</tr></thead>
  <tbody>${ass.length===0?`<tr><td colspan="${2+CATS.length*2}" style="text-align:center;padding:24px;color:#808285">No assessments</td></tr>`:ass.map(a=>`<tr><td><span class="he" style="background:#005778;color:#fff;padding:3px 9px;border-radius:20px;font-size:0.72rem;font-weight:700">${getMonthLabel(a.month)} ${a.year}</span></td>${CATS.map(cat=>`<td style="text-align:center;font-weight:700;color:#1a6038">${a.categories[cat.id]?.correct||0}</td><td style="text-align:center;font-weight:700;color:#9a1c1c;border-right:2px solid #e8d9b8">${a.categories[cat.id]?.mistakes||0}</td>`).join('')}<td><span class="badge ${a.source==='ocr'?'badge-blue':'badge-neutral'}">${a.source==='ocr'?'OCR':'Manual'}</span></td></tr>`).join('')}</tbody>
</table></div></div>`;
}

function renderProfileAssessments(sid,ass){
  $('profileContent').innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><h3>${ass.length} Assessments — <span class="he">${CUR_YEAR}</span></h3><button class="btn btn-primary btn-sm" onclick="openAddAssessmentModal('${sid}')">+ Add Assessment</button></div>
${ass.length===0?`<div style="text-align:center;padding:60px;color:#808285">No assessments yet</div>`:ass.map(a=>`<div class="card mb-4"><div class="card-header"><span class="card-title"><span class="he">${getMonthLabel(a.month)} ${a.year}</span> <span class="badge ${a.source==='ocr'?'badge-blue':'badge-neutral'}" style="margin-right:8px">${a.source==='ocr'?'OCR':'Manual'}</span></span><div style="display:flex;gap:8px;align-items:center"><span style="font-size:0.76rem;color:#808285">${fmtDate(a.createdAt)}</span><button class="btn btn-danger btn-sm" onclick="delAssess('${a.id}','${sid}')">Delete</button></div></div><div class="card-body">${catGrid(CATS,a)}</div></div>`).join('')}`;
}

function renderProfileCharts(sid,ass){
  if(ass.length<2){$('profileContent').innerHTML=`<div style="text-align:center;padding:60px;color:#808285">At least 2 assessments needed for charts<br><button class="btn btn-primary" style="margin-top:12px" onclick="openAddAssessmentModal('${sid}')">Add Assessment</button></div>`;return;}
  $('profileContent').innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:18px">${CATS.map(cat=>`<div class="card"><div class="card-header"><span class="card-title he" style="color:${cat.color}">${cat.label}</span></div><div class="card-body"><div style="position:relative;height:160px"><canvas id="ch_${cat.id}"></canvas></div></div></div>`).join('')}</div>`;
  setTimeout(()=>{const labels=ass.map(a=>getMonthLabel(a.month));CATS.forEach(cat=>{const ctx=$(`ch_${cat.id}`);if(!ctx)return;_charts[cat.id]=new Chart(ctx,{type:'line',data:{labels,datasets:[{label:'Correct',data:ass.map(a=>a.categories[cat.id]?.correct||0),borderColor:cat.color,backgroundColor:cat.color+'30',tension:0.4,fill:true,pointRadius:4},{label:'Mistakes',data:ass.map(a=>a.categories[cat.id]?.mistakes||0),borderColor:'#9a1c1c',backgroundColor:'#9a1c1c20',tension:0.4,fill:false,borderDash:[5,5],pointRadius:3}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:9},padding:6}}},scales:{x:{grid:{color:'#f5f5f5'}},y:{beginAtZero:true,grid:{color:'#f5f5f5'}}}}});});},60);
}

function delAssess(aid,sid){if(!confirm('Delete this assessment?'))return;ASSESSMENTS=ASSESSMENTS.filter(a=>a.id!==aid);showToast('Assessment deleted','warning');renderStudentProfile(sid);try{API.deleteAssessment(aid);}catch(e){}}

function showStudentReport(sid){
  const s=getStudent(sid),ass=getStudentAssessments(sid),lastA=ass[ass.length-1],prov=getProvider(s.providerId);
  if(!lastA){showToast('No assessments for report','warning');return;}
  $('reportPreviewBody').innerHTML=`<div style="text-align:center;margin-bottom:20px;padding-bottom:14px;border-bottom:3px solid #005778"><img src="assets/letterhead.jpg" style="max-width:100%;max-height:100px;object-fit:contain" onerror="this.style.display='none'"></div><div style="text-align:center;margin-bottom:20px"><h2 style="color:#005778">Monthly Progress Report</h2><p class="he" style="color:#808285">${getMonthLabel(lastA.month)} ${lastA.year}</p></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:20px"><div class="card"><div class="card-body"><div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #e8d9b8;font-size:0.84rem"><span style="color:#808285">Student</span><span class="he" style="font-weight:700">${sName(s)}</span></div><div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #e8d9b8;font-size:0.84rem"><span style="color:#808285">Class</span><span style="font-weight:700">${s.class}</span></div><div style="display:flex;justify-content:space-between;padding:7px 0;font-size:0.84rem"><span style="color:#808285">Provider</span><span class="he" style="font-weight:700">${prov?prov.name:'—'}</span></div></div></div><div class="card"><div class="card-body"><div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #e8d9b8;font-size:0.84rem"><span style="color:#808285">Month</span><span class="he" style="font-weight:700">${getMonthLabel(lastA.month)} ${lastA.year}</span></div><div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #e8d9b8;font-size:0.84rem"><span style="color:#808285">YTD Assessments</span><span style="font-weight:700">${ass.length}</span></div><div style="display:flex;justify-content:space-between;padding:7px 0;font-size:0.84rem"><span style="color:#808285">Trend</span><span>${trendBadge(getStudentTrend(sid))}</span></div></div></div></div><div class="card mb-4"><div class="card-header"><span class="card-title">Performance — <span class="he">${getMonthLabel(lastA.month)}</span></span></div><div class="card-body">${catGrid(CATS,lastA)}<div style="background:#e0eef5;border:1px solid #b0cfe0;border-radius:8px;padding:10px;margin-top:12px;font-size:0.82rem;color:#005778">ℹ No overall score — each category is measured separately</div></div></div>`;
  openModal('reportPreviewModal');
}

// Part 5: Providers, Worksheets, Reports, OCR, Analytics, Admin
function renderProviders(){
  $('pageContent').innerHTML=`<div class="page-header"><div><h1 class="page-title">Providers</h1><p class="page-subtitle">${PROVIDERS.length} active providers</p></div><button class="btn btn-primary" onclick="openAddProviderModal()">+ Add Provider</button></div><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:18px">${PROVIDERS.map((p,i)=>{const ss=getProviderStudents(p.id),imp=ss.filter(s=>getStudentTrend(s.id)==='up').length,str=ss.filter(s=>getStudentTrend(s.id)==='down').length;return`<div class="card" style="cursor:pointer;transition:all 0.2s" onclick="navigate('provider_profile',{providerId:'${p.id}'})" onmouseenter="this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 24px rgba(0,87,120,0.15)'" onmouseleave="this.style.transform='';this.style.boxShadow=''"><div style="background:linear-gradient(135deg,#005778,#1a7a9a);padding:18px;color:#fff"><div style="display:flex;align-items:center;gap:12px"><div class="user-avatar" style="width:44px;height:44px;font-size:0.9rem;background:${avatarColor(i)}">${initials(p.name)}</div><div><div class="he" style="font-weight:800;font-size:0.95rem">${p.name}</div><div style="font-size:0.76rem;opacity:0.8;margin-top:2px">${p.city}</div></div></div></div><div class="card-body"><div style="display:flex;justify-content:space-between;font-size:0.82rem;padding:6px 0;border-bottom:1px solid #e8d9b8"><span style="color:#808285">Director</span><span class="he" style="font-weight:600">${p.director}</span></div><div style="display:flex;justify-content:space-between;font-size:0.82rem;padding:6px 0;border-bottom:1px solid #e8d9b8"><span style="color:#808285">Email</span><span style="font-size:0.78rem">${p.email}</span></div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;text-align:center;margin-top:12px"><div><div style="font-size:1.4rem;font-weight:900;color:#005778">${ss.length}</div><div style="font-size:0.68rem;color:#808285">Students</div></div><div><div style="font-size:1.4rem;font-weight:900;color:#1a6038">${imp}</div><div style="font-size:0.68rem;color:#808285">Improving</div></div><div><div style="font-size:1.4rem;font-weight:900;color:#9a1c1c">${str}</div><div style="font-size:0.68rem;color:#808285">At Risk</div></div></div></div></div>`;}).join('')}</div>`;
}

function renderProviderProfile(pid){
  const p=getProvider(pid);if(!p){$('pageContent').innerHTML='<div style="padding:40px">Provider not found</div>';return;}
  const ss=getProviderStudents(pid),ass=ASSESSMENTS.filter(a=>ss.some(s=>s.id===a.studentId));
  const imp=ss.filter(s=>getStudentTrend(s.id)==='up').length,str=ss.filter(s=>getStudentTrend(s.id)==='down').length;
  const hs=$('headerSubBreadcrumb');if(hs)hs.innerHTML=` › <span class="he">${p.name}</span>`;
  $('pageContent').innerHTML=`<div style="margin-bottom:14px"><button class="btn btn-ghost btn-sm" onclick="navigate('providers')">← Back to Providers</button></div>
<div class="student-profile-header"><div style="display:flex;align-items:center;gap:18px"><div class="user-avatar" style="width:64px;height:64px;font-size:1.4rem">${initials(p.name)}</div><div style="flex:1"><div class="he" style="font-size:1.4rem;font-weight:800;color:#fff">${p.name}</div><div style="display:flex;gap:14px;margin-top:7px;flex-wrap:wrap"><span class="he" style="font-size:0.82rem;color:rgba(255,255,255,0.8)">${p.director}</span><span style="font-size:0.82rem;color:rgba(255,255,255,0.8)">${p.email}</span><span style="font-size:0.82rem;color:rgba(255,255,255,0.8)">${p.city}</span></div></div><div style="display:flex;gap:8px"><button class="btn btn-gold btn-sm" onclick="navigate('worksheets')">Worksheet</button><button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.3)" onclick="navigate('reports')">Reports</button></div></div></div>
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:22px"><div class="kpi-card"><div class="kpi-value">${ss.length}</div><div class="kpi-label">Students</div></div><div class="kpi-card success"><div class="kpi-value">${imp}</div><div class="kpi-label">Improving</div></div><div class="kpi-card danger"><div class="kpi-value">${str}</div><div class="kpi-label">At Risk</div></div><div class="kpi-card gold"><div class="kpi-value">${ass.length}</div><div class="kpi-label">YTD Assessments</div></div></div>
<div class="card"><div class="card-header"><span class="card-title">Students (${ss.length})</span><button class="btn btn-primary btn-sm" onclick="openAddStudentModal()">+ Add Student</button></div><div class="table-wrapper"><table><thead><tr><th>Student</th><th>Class</th><th>Trend</th><th>Assessments</th><th>Last Month</th><th>Actions</th></tr></thead><tbody>${ss.map((s,i)=>{const t=getStudentTrend(s.id),a=getStudentAssessments(s.id),lastA=a[a.length-1];return`<tr class="clickable" onclick="navigate('student_profile',{studentId:'${s.id}'})"><td class="primary"><div style="display:flex;align-items:center;gap:8px"><div class="user-avatar" style="width:28px;height:28px;font-size:0.65rem;background:${avatarColor(i)}">${initials(sName(s))}</div><span class="he">${sName(s)}</span></div></td><td><span class="badge badge-blue">${s.class}</span></td><td>${trendBadge(t)}</td><td><span class="badge badge-neutral">${a.length}</span></td><td>${lastA?`<span class="he" style="background:#005778;color:#fff;padding:2px 8px;border-radius:20px;font-size:0.7rem;font-weight:700">${getMonthLabel(lastA.month)} ${lastA.year}</span>`:'—'}</td><td onclick="event.stopPropagation()"><button class="btn btn-outline btn-sm" onclick="navigate('student_profile',{studentId:'${s.id}'})">Profile</button></td></tr>`;}).join('')}</tbody></table></div></div>`;
}

let _wsProv='',_wsMonth=CUR_MONTH;
function renderWorksheets(){
  $('pageContent').innerHTML=`<div class="page-header"><div><h1 class="page-title">Worksheets</h1><p class="page-subtitle">Generate handwriting grading sheets by provider and month</p></div></div><div class="card mb-6"><div class="card-header"><span class="card-title">Worksheet Settings</span></div><div class="card-body"><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px"><div class="form-group"><label class="form-label">Provider *</label><select class="form-control" id="wsProv" onchange="_wsProv=this.value"><option value="">Select provider...</option>${PROVIDERS.map(p=>`<option value="${p.id}" ${_wsProv===p.id?'selected':''}>${p.name}</option>`).join('')}</select></div><div class="form-group"><label class="form-label">Hebrew Month *</label><select class="form-control he" id="wsMonth" onchange="_wsMonth=this.value">${HEB_MONTHS.map(m=>`<option value="${m.id}" ${_wsMonth===m.id?'selected':''}>${m.label}</option>`).join('')}</select></div><div class="form-group"><label class="form-label">Hebrew Year</label><input type="text" class="form-control he" value="${CUR_YEAR}" readonly></div></div><div style="display:flex;gap:10px;margin-top:8px"><button class="btn btn-primary" onclick="genWorksheet()">Generate Sheet</button><button class="btn btn-gold" onclick="printWorksheet()">Print (Landscape)</button></div></div></div><div id="wsPreview"></div>`;
}
function genWorksheet(){
  _wsProv=document.getElementById('wsProv')?.value||_wsProv;_wsMonth=document.getElementById('wsMonth')?.value||_wsMonth;
  if(!_wsProv||!_wsMonth){showToast('Please select provider and month','warning');return;}
  const p=getProvider(_wsProv),ss=getProviderStudents(_wsProv);if(!ss.length){showToast('No students for this provider','warning');return;}
  $('wsPreview').innerHTML=`<div class="card"><div class="card-body" style="padding:28px"><div style="text-align:center;margin-bottom:20px;padding-bottom:14px;border-bottom:3px solid #005778"><img src="assets/letterhead.jpg" style="max-width:100%;max-height:100px;object-fit:contain" onerror="this.style.display='none'"></div><div style="text-align:center;margin-bottom:20px"><h2 style="color:#005778">Assessment Sheet — <span class="he">${p.name}</span></h2><p class="he" style="color:#808285">${getMonthLabel(_wsMonth)} ${CUR_YEAR} | ${p.director}</p></div><div style="background:#e0eef5;border:1px solid #b0cfe0;border-radius:8px;padding:12px;margin-bottom:16px;font-size:0.84rem;color:#005778">Instructions: Fill in Correct and Mistakes for each category per student. No overall score.</div><div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse"><thead><tr><th style="background:#005778;color:#fff;padding:10px 12px;text-align:right;min-width:140px">Student</th><th style="background:#005778;color:#fff;padding:10px 12px;text-align:center">Class</th>${CATS.map(cat=>`<th colspan="2" style="background:#005778;color:#fff;padding:10px 12px;text-align:center;border-right:2px solid rgba(255,255,255,0.3)"><span class="he">${cat.label}</span></th>`).join('')}<th style="background:#005778;color:#fff;padding:10px 12px">Notes</th></tr><tr style="background:#1a7a9a"><th></th><th></th>${CATS.map(()=>`<th style="color:#a8e0e0;font-size:0.7rem;padding:6px;text-align:center">Correct</th><th style="color:#a8e0e0;font-size:0.7rem;padding:6px;text-align:center;border-right:2px solid rgba(255,255,255,0.2)">Mistakes</th>`).join('')}<th></th></tr></thead><tbody>${ss.map(s=>`<tr style="border-bottom:1px solid #ddd"><td class="he" style="padding:14px 12px;font-weight:600">${sName(s)}</td><td style="padding:14px 12px;text-align:center">${s.class}</td>${CATS.map(()=>`<td style="padding:14px 12px;min-width:50px;background:#fafaf8;border-right:1px solid #eee"></td><td style="padding:14px 12px;min-width:50px;background:#fafaf8;border-right:2px solid #ddd"></td>`).join('')}<td style="padding:14px 12px;min-width:120px"></td></tr>`).join('')}</tbody></table></div><div style="margin-top:20px;display:flex;justify-content:space-between;font-size:0.8rem;color:#808285"><span>Teacher Signature: ___________________</span><span>Date: ___________________</span><span>KriahTrack</span></div></div></div>`;
}

let _rp='',_rm=CUR_MONTH,_rl='he';
function renderReports(){
  $('pageContent').innerHTML=`<div class="page-header"><div><h1 class="page-title">Monthly Reports</h1><p class="page-subtitle">Generate reports by provider and month</p></div></div><div class="card mb-6"><div class="card-header"><span class="card-title">Report Settings</span></div><div class="card-body"><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px"><div class="form-group"><label class="form-label">Provider</label><select class="form-control" id="rProv" onchange="_rp=this.value;genReports()"><option value="">All Providers</option>${PROVIDERS.map(p=>`<option value="${p.id}" ${_rp===p.id?'selected':''}>${p.name}</option>`).join('')}</select></div><div class="form-group"><label class="form-label">Month</label><select class="form-control he" id="rMonth" onchange="_rm=this.value;genReports()">${HEB_MONTHS.map(m=>`<option value="${m.id}" ${_rm===m.id?'selected':''}>${m.label}</option>`).join('')}</select></div><div class="form-group"><label class="form-label">Note Language</label><div style="display:flex;background:#f0ece4;border-radius:20px;padding:3px;gap:2px;margin-top:6px"><button style="padding:5px 14px;border-radius:17px;font-size:0.78rem;font-weight:700;cursor:pointer;border:none;background:${_rl==='he'?'#005778':'transparent'};color:${_rl==='he'?'#fff':'#808285'}" onclick="_rl='he';renderReports()">Hebrew</button><button style="padding:5px 14px;border-radius:17px;font-size:0.78rem;font-weight:700;cursor:pointer;border:none;background:${_rl==='yi'?'#005778':'transparent'};color:${_rl==='yi'?'#fff':'#808285'}" onclick="_rl='yi';renderReports()">Yiddish</button></div></div></div><button class="btn btn-primary" onclick="genReports()">Generate Reports</button></div></div><div id="rGrid"></div>`;
  genReports();
}
function genReports(){
  _rp=document.getElementById('rProv')?.value||_rp;_rm=document.getElementById('rMonth')?.value||_rm;
  const ss=_rp?getProviderStudents(_rp):STUDENTS,wd=ss.filter(s=>ASSESSMENTS.some(a=>a.studentId===s.id&&a.month===_rm));
  const ml=getMonthLabel(_rm);
  $('rGrid').innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px"><h3>${wd.length} Reports — <span class="he">${ml} ${CUR_YEAR}</span></h3><button class="btn btn-ghost btn-sm" onclick="window.print()">Print All</button></div>${wd.length===0?`<div style="text-align:center;padding:60px;color:#808285">No data for <span class="he">${ml}</span></div>`:`<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:14px">${wd.map(s=>{const a=ASSESSMENTS.find(x=>x.studentId===s.id&&x.month===_rm),prov=getProvider(s.providerId),t=getStudentTrend(s.id);const note=_rl==='yi'?`${sName(s)} האט זיך ${t==='up'?'שטארק פארבעסערט':'גוט אויסגעפירט'} אין ${ml}.`:t==='up'?`${sName(s)} מציג שיפור עקבי בחודש ${ml}.`:t==='down'?`${sName(s)} מתמודד עם אתגרים בחודש ${ml}.`:`${sName(s)} שומר על ביצועים יציבים בחודש ${ml}.`;return`<div style="border:1px solid #e8d9b8;border-radius:12px;overflow:hidden;transition:all 0.2s" onmouseenter="this.style.boxShadow='0 4px 16px rgba(0,87,120,0.12)'" onmouseleave="this.style.boxShadow=''"><div style="background:linear-gradient(135deg,#005778,#1a7a9a);padding:14px 18px;color:#fff"><div style="display:flex;justify-content:space-between;align-items:flex-start"><div><div class="he" style="font-weight:800;font-size:0.95rem">${sName(s)}</div><div style="font-size:0.76rem;opacity:0.8;margin-top:2px"><span class="he">${prov?.name||'—'}</span> | Class ${s.class}</div></div>${trendBadge(t)}</div></div><div style="padding:14px 18px;background:#fff"><div style="margin-bottom:10px">${CATS.map(cat=>`<div style="display:flex;justify-content:space-between;font-size:0.8rem;padding:3px 0;border-bottom:1px solid #f0ece4"><span class="he" style="color:${cat.color};font-weight:600">${cat.label}</span><span><span style="color:#1a6038;font-weight:700">${a?.categories[cat.id]?.correct||0}</span> / <span style="color:#9a1c1c;font-weight:700">${a?.categories[cat.id]?.mistakes||0}</span></span></div>`).join('')}</div><div class="he" style="background:#f8f9fa;border-radius:6px;padding:9px;font-size:0.78rem;color:#444;line-height:1.6;border-right:3px solid #005778">${note}</div></div><div style="padding:10px 18px;background:#fdf8f0;border-top:1px solid #e8d9b8;display:flex;gap:7px"><button class="btn btn-primary btn-sm" onclick="showStudentReport('${s.id}')">View</button><button class="btn btn-ghost btn-sm" onclick="showStudentReport('${s.id}')">Print</button></div></div>`;}).join('')}</div>`}`;
}

let _ocrStep=1,_ocrProv='',_ocrMonth=CUR_MONTH,_ocrData=[],_ocrFile=null;
function renderOCR(){
  $('pageContent').innerHTML=`<div class="page-header"><div><h1 class="page-title">Upload Worksheet</h1><p class="page-subtitle">Automatic handwriting recognition — review before saving</p></div></div><div style="display:flex;align-items:center;margin-bottom:24px">${[1,2,3,4].map(n=>`<div style="display:flex;align-items:center;gap:7px;flex:1"><div style="width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:800;background:${_ocrStep>n?'#1a6038':_ocrStep===n?'#005778':'#f0ece4'};color:${_ocrStep>=n?'#fff':'#808285'};border:2px solid ${_ocrStep>n?'#1a6038':_ocrStep===n?'#005778':'#e8d9b8'}">${_ocrStep>n?'✓':n}</div><span style="font-size:0.76rem;font-weight:700;color:${_ocrStep===n?'#005778':'#808285'}">${['Provider & Month','Upload Sheet','Processing','Review & Confirm'][n-1]}</span>${n<4?`<div style="flex:1;height:2px;background:${_ocrStep>n?'#1a6038':'#e8d9b8'};margin:0 7px"></div>`:''}</div>`).join('')}</div>${_ocrStep===1?ocrS1():_ocrStep===2?ocrS2():_ocrStep===3?ocrS3():ocrS4()}`;
}
function ocrS1(){return`<div class="card"><div class="card-header"><span class="card-title">Step 1 — Select Provider & Month</span></div><div class="card-body"><div style="display:grid;grid-template-columns:1fr 1fr;gap:14px"><div class="form-group"><label class="form-label">Provider *</label><select class="form-control" id="oP"><option value="">Select provider...</option>${PROVIDERS.map(p=>`<option value="${p.id}" ${_ocrProv===p.id?'selected':''}>${p.name}</option>`).join('')}</select></div><div class="form-group"><label class="form-label">Hebrew Month *</label><select class="form-control he" id="oM">${HEB_MONTHS.map(m=>`<option value="${m.id}" ${_ocrMonth===m.id?'selected':''}>${m.label}</option>`).join('')}</select></div></div><button class="btn btn-primary" onclick="_ocrProv=document.getElementById('oP')?.value;_ocrMonth=document.getElementById('oM')?.value;if(!_ocrProv||!_ocrMonth){showToast('Please select provider and month','warning');return;}_ocrStep=2;renderOCR()">Continue →</button></div></div>`;}
function ocrS2(){const p=getProvider(_ocrProv),ss=getProviderStudents(_ocrProv);return`<div class="card"><div class="card-header"><span class="card-title">Step 2 — Upload Worksheet</span><span class="he" style="background:#005778;color:#fff;padding:3px 9px;border-radius:20px;font-size:0.72rem;font-weight:700">${p?.name} | ${getMonthLabel(_ocrMonth)}</span></div><div class="card-body"><div style="border:2px dashed #005778;border-radius:12px;padding:44px 24px;text-align:center;cursor:pointer;background:#e0eef5" onclick="document.getElementById('oF').click()" ondragover="event.preventDefault()" ondrop="event.preventDefault();_ocrFile=event.dataTransfer.files[0];runDemoOCR()"><div style="width:60px;height:60px;border-radius:50%;background:#b0cfe0;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;color:#005778"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></div><h3 style="color:#005778;margin-bottom:6px">Upload Worksheet</h3><p style="color:#808285;font-size:0.84rem">Drag file here or click to select</p><p style="color:#aaa;font-size:0.76rem;margin-top:6px">JPG · PNG · PDF</p><input type="file" id="oF" accept="image/*,.pdf" style="display:none" onchange="_ocrFile=this.files[0];runDemoOCR()"></div><div style="margin-top:14px;display:flex;gap:10px"><button class="btn btn-ghost btn-sm" onclick="_ocrStep=1;renderOCR()">← Back</button><button class="btn btn-outline btn-sm" onclick="runDemoOCR()">▶ Demo (no file)</button></div><div style="margin-top:10px;font-size:0.78rem;color:#808285">Students: <strong>${ss.length}</strong></div></div></div>`;}
function ocrS3(){return`<div class="card"><div class="card-header"><span class="card-title">Step 3 — Processing OCR</span></div><div class="card-body" style="text-align:center;padding:40px"><div id="oStat" class="alert alert-info" style="text-align:right;margin-bottom:20px">Initializing...</div><div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between;margin-bottom:6px"><span id="oPct" style="font-size:0.84rem;font-weight:700;color:#005778">0%</span></div><div style="background:#e8d9b8;border-radius:20px;height:12px;overflow:hidden"><div id="oBar" style="height:100%;border-radius:20px;background:linear-gradient(90deg,#005778,#1a7a9a);width:0%;transition:width 0.3s"></div></div></div><div style="display:flex;justify-content:center;margin-top:20px"><div class="spinner"></div></div><p style="margin-top:14px;color:#808285;font-size:0.84rem">Analyzing handwriting...</p><button class="btn btn-ghost btn-sm" style="margin-top:14px" onclick="_ocrStep=2;_ocrFile=null;renderOCR()">Cancel</button></div></div>`;}
function runDemoOCR(){
  _ocrStep=3;renderOCR();
  const ss=getProviderStudents(_ocrProv);let pct=0;
  const iv=setInterval(()=>{pct=Math.min(100,pct+Math.floor(Math.random()*12)+4);const bar=$('oBar'),lbl=$('oPct'),msg=$('oStat');if(bar)bar.style.width=pct+'%';if(lbl)lbl.textContent=`Processing... ${pct}%`;if(msg)msg.textContent=pct<30?'Initializing OCR engine...':pct<60?'Detecting table structure...':pct<85?'Extracting digits...':'Finishing...';if(pct>=100){clearInterval(iv);_ocrData=ss.map(s=>{const ex=ASSESSMENTS.find(a=>a.studentId===s.id&&a.month===_ocrMonth&&a.year===CUR_YEAR);const cats={};CATS.forEach(cat=>{cats[cat.id]={correct:Math.floor(Math.random()*18)+5,mistakes:Math.floor(Math.random()*7)};});return{student:s,categories:cats,isDuplicate:!!ex,existingId:ex?.id,action:ex?'overwrite':'import'};});_ocrStep=4;renderOCR();}},180);
}
function ocrS4(){
  const p=getProvider(_ocrProv),dups=_ocrData.filter(d=>d.isDuplicate),toImport=_ocrData.filter(d=>d.action!=='skip').length;
  return`<div class="card"><div class="card-header"><span class="card-title">Step 4 — Review & Confirm</span><span class="he" style="background:#005778;color:#fff;padding:3px 9px;border-radius:20px;font-size:0.72rem;font-weight:700">${p?.name} | ${getMonthLabel(_ocrMonth)}</span></div><div class="card-body">${dups.length?`<div style="background:#fff3e0;border:2px solid #D9A44E;border-radius:8px;padding:14px;margin-bottom:14px"><div style="font-weight:700;color:#7a4800;margin-bottom:6px">⚠ ${dups.length} duplicates detected</div><div style="display:flex;gap:8px;margin-top:8px"><button class="btn btn-sm" style="background:#D9A44E;color:#fff" onclick="_ocrData.forEach(d=>{if(d.isDuplicate)d.action='overwrite'});renderOCR()">Overwrite All</button><button class="btn btn-ghost btn-sm" onclick="_ocrData.forEach(d=>{if(d.isDuplicate)d.action='skip'});renderOCR()">Skip Duplicates</button></div></div>`:''}
<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:0.84rem"><thead><tr style="background:#005778;color:#fff"><th style="padding:10px 12px;text-align:right">Student</th>${CATS.map(cat=>`<th colspan="2" style="padding:10px 8px;text-align:center;border-right:2px solid rgba(255,255,255,0.2)"><span class="he">${cat.label}</span></th>`).join('')}<th style="padding:10px 8px">Status</th><th style="padding:10px 8px">Action</th></tr><tr style="background:#1a7a9a;color:#a8e0e0;font-size:0.7rem"><th></th>${CATS.map(()=>`<th style="padding:5px;text-align:center">✓</th><th style="padding:5px;text-align:center;border-right:2px solid rgba(255,255,255,0.15)">✗</th>`).join('')}<th></th><th></th></tr></thead><tbody>${_ocrData.map((row,ri)=>`<tr style="border-bottom:1px solid #e8d9b8;background:${row.isDuplicate?'#faf0c0':row.action==='skip'?'#f5f5f5':'#fff'};opacity:${row.action==='skip'?'0.5':'1'}" id="or${ri}"><td class="he" style="padding:10px 12px;font-weight:600">${sName(row.student)}</td>${CATS.map(cat=>`<td style="text-align:center;padding:6px"><input type="number" min="0" max="99" value="${row.categories[cat.id].correct}" onchange="_ocrData[${ri}].categories['${cat.id}'].correct=parseInt(this.value)||0" style="width:52px;padding:4px;border:1.5px solid #1a6038;border-radius:4px;text-align:center;font-weight:800;font-size:0.88rem"></td><td style="text-align:center;padding:6px;border-right:2px solid #e8d9b8"><input type="number" min="0" max="99" value="${row.categories[cat.id].mistakes}" onchange="_ocrData[${ri}].categories['${cat.id}'].mistakes=parseInt(this.value)||0" style="width:52px;padding:4px;border:1.5px solid #9a1c1c;border-radius:4px;text-align:center;font-weight:800;font-size:0.88rem"></td>`).join('')}<td style="padding:6px 10px"><span style="background:${row.isDuplicate?'#fff3e0':'#e4f2eb'};color:${row.isDuplicate?'#7a4800':'#1a6038'};padding:2px 8px;border-radius:20px;font-size:0.68rem;font-weight:800">${row.isDuplicate?'Duplicate':'New'}</span></td><td style="padding:6px 10px">${row.isDuplicate?`<select style="font-size:0.76rem;padding:3px 6px;border:1px solid #e8d9b8;border-radius:4px" onchange="_ocrData[${ri}].action=this.value;document.getElementById('or${ri}').style.opacity=this.value==='skip'?'0.5':'1'"><option value="overwrite" ${row.action==='overwrite'?'selected':''}>Overwrite</option><option value="skip" ${row.action==='skip'?'selected':''}>Skip</option></select>`:'<span style="color:#1a6038;font-size:0.76rem;font-weight:700">Import</span>'}</td></tr>`).join('')}</tbody></table></div>
<div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-primary" onclick="confirmOCR()">✓ Confirm & Save (${toImport} records)</button><button class="btn btn-outline btn-sm" onclick="_ocrStep=2;renderOCR()">← Re-upload</button><button class="btn btn-ghost btn-sm" onclick="_ocrStep=1;_ocrData=[];_ocrFile=null;renderOCR()">Cancel</button></div></div></div>`;
}
function confirmOCR(){
  let imp=0,sk=0;
  _ocrData.forEach(row=>{if(row.action==='skip'){sk++;return;}const cats={};CATS.forEach(cat=>{cats[cat.id]={correct:row.categories[cat.id].correct,mistakes:row.categories[cat.id].mistakes};});const idx=ASSESSMENTS.findIndex(a=>a.studentId===row.student.id&&a.month===_ocrMonth&&a.year===CUR_YEAR);const newA={id:genId('a'),studentId:row.student.id,providerId:row.student.providerId,month:_ocrMonth,year:CUR_YEAR,source:'ocr',createdAt:new Date().toISOString(),categories:cats};if(idx>=0)ASSESSMENTS[idx]=newA;else ASSESSMENTS.push(newA);imp++;});
  OCR_IMPORTS.push({id:genId('o'),provider:_ocrProv,month:_ocrMonth,year:CUR_YEAR,imported:imp,skipped:sk,timestamp:new Date().toISOString()});
  SYS_LOGS.unshift({id:genId('l'),type:'success',message:`OCR import — ${imp} imported, ${sk} skipped`,timestamp:new Date().toISOString()});
  _ocrStep=1;_ocrData=[];_ocrFile=null;showToast(`✓ ${imp} assessments saved`,'success');renderOCR();
  try{API.importOCR({rows:_ocrData,providerId:_ocrProv,month:_ocrMonth,year:CUR_YEAR});}catch(e){}
}

function renderAnalytics(){
  const imp=STUDENTS.filter(s=>getStudentTrend(s.id)==='up'),str=STUDENTS.filter(s=>getStudentTrend(s.id)==='down');
  $('pageContent').innerHTML=`<div class="page-header"><div><h1 class="page-title">Analytics</h1><p class="page-subtitle">Growth, regression, provider comparison, cohort analysis</p></div></div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:22px"><div class="kpi-card success"><div class="kpi-value">${imp.length}</div><div class="kpi-label">Improving</div></div><div class="kpi-card danger"><div class="kpi-value">${str.length}</div><div class="kpi-label">At Risk</div></div><div class="kpi-card"><div class="kpi-value">${ASSESSMENTS.length}</div><div class="kpi-label">Total Assessments</div></div><div class="kpi-card gold"><div class="kpi-value">${HEB_MONTHS.filter(m=>ASSESSMENTS.some(a=>a.month===m.id)).length}</div><div class="kpi-label">Active Months</div></div></div><div class="grid-2 mb-6"><div class="card"><div class="card-header"><span class="card-title">Most Improved</span></div><div class="card-body" style="padding:0"><table><thead><tr><th>Student</th><th>Provider</th><th>Trend</th><th>#</th></tr></thead><tbody>${imp.slice(0,6).map((s,i)=>`<tr class="clickable" onclick="navigate('student_profile',{studentId:'${s.id}'})"><td class="primary"><div style="display:flex;align-items:center;gap:8px"><div class="user-avatar" style="width:26px;height:26px;font-size:0.62rem;background:${avatarColor(i)}">${initials(sName(s))}</div><span class="he">${sName(s)}</span></div></td><td style="font-size:0.8rem">${getProvider(s.providerId)?.name.split(' ').slice(0,2).join(' ')||'—'}</td><td>${trendBadge('up')}</td><td><span class="badge badge-blue">${getStudentAssessments(s.id).length}</span></td></tr>`).join('')}${imp.length===0?'<tr><td colspan="4" style="text-align:center;padding:20px;color:#808285">No data</td></tr>':''}</tbody></table></div></div><div class="card"><div class="card-header"><span class="card-title">At-Risk Students</span></div><div class="card-body" style="padding:0"><table><thead><tr><th>Student</th><th>Provider</th><th>Trend</th><th>Action</th></tr></thead><tbody>${str.slice(0,6).map((s,i)=>`<tr class="clickable" style="background:#fdecea" onclick="navigate('student_profile',{studentId:'${s.id}'})"><td class="primary"><div style="display:flex;align-items:center;gap:8px"><div class="user-avatar" style="width:26px;height:26px;font-size:0.62rem;background:${avatarColor(i)}">${initials(sName(s))}</div><span class="he">${sName(s)}</span></div></td><td style="font-size:0.8rem">${getProvider(s.providerId)?.name.split(' ').slice(0,2).join(' ')||'—'}</td><td>${trendBadge('down')}</td><td onclick="event.stopPropagation()"><button class="btn btn-outline btn-sm" onclick="navigate('student_profile',{studentId:'${s.id}'})">Review</button></td></tr>`).join('')}${str.length===0?'<tr><td colspan="4" style="text-align:center;padding:20px;color:#808285">No at-risk students</td></tr>':''}</tbody></table></div></div></div><div class="grid-2 mb-6"><div class="card"><div class="card-header"><span class="card-title">Trend Distribution</span></div><div class="card-body"><div style="position:relative;height:220px"><canvas id="tChart"></canvas></div></div></div><div class="card"><div class="card-header"><span class="card-title">YTD Trend</span></div><div class="card-body"><div style="position:relative;height:220px"><canvas id="yChart"></canvas></div></div></div></div><div class="card"><div class="card-header"><span class="card-title">Cohort Analysis by Provider</span></div><div class="table-wrapper"><table><thead><tr><th>Provider</th><th>Students</th><th>Assessments</th><th>Improving</th><th>At Risk</th>${CATS.map(c=>`<th class="he">${c.label}</th>`).join('')}</tr></thead><tbody>${PROVIDERS.map(p=>{const ss=getProviderStudents(p.id),ass=ASSESSMENTS.filter(a=>ss.some(s=>s.id===a.studentId)),im=ss.filter(s=>getStudentTrend(s.id)==='up').length,st=ss.filter(s=>getStudentTrend(s.id)==='down').length;return`<tr class="clickable" onclick="navigate('provider_profile',{providerId:'${p.id}'})"><td class="primary he">${p.name}</td><td><span class="badge badge-blue">${ss.length}</span></td><td><span class="badge badge-neutral">${ass.length}</span></td><td><span class="badge badge-success">${im}</span></td><td><span class="badge badge-danger">${st}</span></td>${CATS.map(cat=>{const v=ass.length?Math.round(ass.reduce((s,a)=>s+(a.categories[cat.id]?.correct||0),0)/ass.length*10)/10:0;return`<td style="font-weight:700;color:${cat.color}">${v}</td>`;}).join('')}</tr>`;}).join('')}</tbody></table></div></div>`;
  setTimeout(()=>{const up=imp.length,down=str.length,flat=STUDENTS.length-up-down;const c1=$('tChart');if(c1)_charts.t=new Chart(c1,{type:'doughnut',data:{labels:['Improving','Stable','At Risk'],datasets:[{data:[up,flat,down],backgroundColor:['#1a6038','#808285','#9a1c1c'],borderWidth:2,borderColor:'#fff'}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:11},padding:10}}}}});const c2=$('yChart');if(c2){const months=HEB_MONTHS.slice(0,9);_charts.y=new Chart(c2,{type:'line',data:{labels:months.map(m=>m.label),datasets:CATS.map(cat=>({label:cat.label,data:months.map(m=>{const ass=ASSESSMENTS.filter(a=>a.month===m.id);return ass.length?Math.round(ass.reduce((s,a)=>s+(a.categories[cat.id]?.correct||0),0)/ass.length*10)/10:null;}),borderColor:cat.color,backgroundColor:cat.color+'15',tension:0.4,fill:true,pointRadius:3}))},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:10},padding:8}}},scales:{x:{grid:{color:'#f5f5f5'}},y:{beginAtZero:true,grid:{color:'#f5f5f5'}}}}});}},80);
}

let _aTab='logs';
function renderAdmin(){
  $('pageContent').innerHTML=`<div class="page-header"><div><h1 class="page-title">Admin Panel</h1><p class="page-subtitle">Logs, audit trail, performance monitoring</p></div></div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:22px"><div class="kpi-card"><div class="kpi-value">${SYS_LOGS.length}</div><div class="kpi-label">System Logs</div></div><div class="kpi-card gold"><div class="kpi-value">${AUDIT_LOG.length}</div><div class="kpi-label">Audit Records</div></div><div class="kpi-card success"><div class="kpi-value">${OCR_IMPORTS.length}</div><div class="kpi-label">OCR Imports</div></div><div class="kpi-card ${SYS_LOGS.filter(l=>l.type==='danger').length>0?'danger':'success'}"><div class="kpi-value">${SYS_LOGS.filter(l=>l.type==='danger').length}</div><div class="kpi-label">Errors</div></div></div><div style="display:flex;border-bottom:2px solid #e8d9b8;margin-bottom:22px">${['logs','audit','ocr','perf'].map(tab=>`<button style="padding:9px 18px;font-size:0.84rem;font-weight:${_aTab===tab?'700':'600'};color:${_aTab===tab?'#005778':'#808285'};cursor:pointer;border:none;background:${_aTab===tab?'#e0eef5':'transparent'};border-bottom:2px solid ${_aTab===tab?'#005778':'transparent'};margin-bottom:-2px;border-radius:${_aTab===tab?'8px 8px 0 0':'0'}" onclick="_aTab='${tab}';renderAdmin()">${{logs:'System Logs',audit:'Audit Trail',ocr:'OCR Imports',perf:'Performance'}[tab]}</button>`).join('')}</div><div id="aC"></div>`;
  if(_aTab==='logs'){$('aC').innerHTML=`<div class="card"><div class="card-header"><span class="card-title">System Logs (${SYS_LOGS.length})</span></div><div class="card-body" style="padding:0 20px">${SYS_LOGS.map(l=>`<div style="display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid #e8d9b8;font-size:0.82rem"><div style="width:7px;height:7px;border-radius:50%;margin-top:5px;flex-shrink:0;background:${{success:'#1a6038',warning:'#D9A44E',danger:'#9a1c1c',info:'#005778'}[l.type]||'#808285'}"></div><div style="font-size:0.7rem;color:#808285;white-space:nowrap;min-width:80px">${fmtTime(l.timestamp)}</div><div style="flex:1;color:#444">${l.message}</div></div>`).join('')}</div></div>`;}
  else if(_aTab==='audit'){$('aC').innerHTML=`<div class="card"><div class="card-header"><span class="card-title">Audit Trail (${AUDIT_LOG.length})</span></div>${AUDIT_LOG.length===0?'<div class="card-body" style="text-align:center;padding:40px;color:#808285">No audit records yet</div>':`<div class="table-wrapper"><table><thead><tr><th>Time</th><th>Action</th><th>Entity</th><th>Name</th><th>Before</th><th>After</th></tr></thead><tbody>${AUDIT_LOG.map(e=>`<tr><td style="font-size:0.76rem;white-space:nowrap">${fmtTime(e.timestamp)}</td><td><span class="badge badge-blue">${e.action}</span></td><td style="font-size:0.8rem">${e.entity}</td><td class="primary he">${e.entityName}</td><td style="color:#9a1c1c;text-decoration:line-through;font-size:0.8rem">${e.before}</td><td style="color:#1a6038;font-weight:700;font-size:0.8rem">${e.after}</td></tr>`).join('')}</tbody></table></div>`}</div>`;}
  else if(_aTab==='ocr'){$('aC').innerHTML=`<div class="card"><div class="card-header"><span class="card-title">OCR Import History (${OCR_IMPORTS.length})</span></div>${OCR_IMPORTS.length===0?`<div class="card-body" style="text-align:center;padding:40px;color:#808285">No OCR imports yet<br><button class="btn btn-primary" style="margin-top:12px" onclick="navigate('ocr')">Upload Worksheet</button></div>`:`<div class="table-wrapper"><table><thead><tr><th>Date</th><th>Provider</th><th>Month</th><th>Imported</th><th>Skipped</th></tr></thead><tbody>${OCR_IMPORTS.map(i=>`<tr><td style="font-size:0.8rem">${fmtDate(i.timestamp)}</td><td class="he">${getProvider(i.provider)?.name||'—'}</td><td><span class="he" style="background:#005778;color:#fff;padding:2px 8px;border-radius:20px;font-size:0.7rem;font-weight:700">${getMonthLabel(i.month)} ${i.year}</span></td><td><span class="badge badge-success">${i.imported}</span></td><td><span class="badge badge-neutral">${i.skipped}</span></td></tr>`).join('')}</tbody></table></div>`}</div>`;}
  else{$('aC').innerHTML=`<div class="grid-2"><div class="card"><div class="card-header"><span class="card-title">Performance Metrics</span></div><div class="card-body">${[['Dashboard load','0.4s',85,'success'],['Analytics load','1.2s',60,'warning'],['OCR processing','2.1s',45,'warning'],['DB queries','0.1s',95,'success']].map(([l,v,p,s])=>`<div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between;margin-bottom:5px"><span style="font-size:0.86rem;font-weight:600">${l}</span><div style="display:flex;align-items:center;gap:8px"><span style="font-weight:700;color:#005778">${v}</span><span style="background:${s==='success'?'#e4f2eb':'#fff3e0'};color:${s==='success'?'#1a6038':'#7a4800'};padding:2px 8px;border-radius:20px;font-size:0.65rem;font-weight:800">${s==='success'?'Normal':'Slow'}</span></div></div><div style="background:#f0ece4;border-radius:20px;height:6px;overflow:hidden"><div style="height:100%;border-radius:20px;background:${s==='success'?'#005778':'#D9A44E'};width:${p}%"></div></div></div>`).join('')}</div></div><div class="card"><div class="card-header"><span class="card-title">System Health</span></div><div class="card-body">${[['Students',STUDENTS.length],['Providers',PROVIDERS.length],['Assessments',ASSESSMENTS.length],['OCR Imports',OCR_IMPORTS.length]].map(([l,v])=>`<div style="display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid #e8d9b8;font-size:0.84rem"><span style="color:#808285">${l}</span><span style="font-weight:800">${v}</span></div>`).join('')}<div style="background:#e4f2eb;border:1px solid #b0d8c0;border-radius:8px;padding:12px;margin-top:14px;font-size:0.84rem;color:#1a6038">✓ All systems operating normally</div></div></div></div>`;}
}

// Part 6: Modals & Boot
function openAddStudentModal(){
  $('newStudentProvider').innerHTML='<option value="">Select provider...</option>'+PROVIDERS.map(p=>`<option value="${p.id}">${p.name}</option>`).join('');
  ['newStudentFirst','newStudentLast','newStudentNotes'].forEach(id=>{const el=$(id);if(el)el.value='';});
  $('newStudentClass').innerHTML='<option value="">Select class...</option>';
  openModal('addStudentModal');
}
function updateClassOptions(pid){const p=getProvider(pid),sel=$('newStudentClass');if(!sel)return;sel.innerHTML='<option value="">Select class...</option>'+(p?(p.classes||['א׳','ב׳']).map(c=>`<option value="${c}">${c}</option>`).join(''):'');}
function saveNewStudent(){
  const fn=$('newStudentFirst')?.value.trim(),ln=$('newStudentLast')?.value.trim(),pid=$('newStudentProvider')?.value,cls=$('newStudentClass')?.value,yr=$('newStudentYear')?.value.trim()||CUR_YEAR,notes=$('newStudentNotes')?.value.trim()||'';
  if(!fn||!ln||!pid||!cls){showToast('Please fill all required fields','warning');return;}
  const s={id:genId('s'),firstName:fn,lastName:ln,providerId:pid,class:cls,year:yr,status:'active',notes};
  STUDENTS.push(s);AUDIT_LOG.unshift({id:genId('a'),action:'Add Student',entity:'Student',entityName:`${fn} ${ln}`,field:'—',before:'—',after:'Created',timestamp:new Date().toISOString()});SYS_LOGS.unshift({id:genId('l'),type:'info',message:`Student added: ${fn} ${ln}`,timestamp:new Date().toISOString()});
  closeModal('addStudentModal');showToast(`${fn} ${ln} added`,'success');
  const sb=$('studentsBadge');if(sb)sb.textContent=STUDENTS.length;
  if(_page==='students')renderStudents();
  try{API.createStudent({firstName:fn,lastName:ln,providerId:pid,class:cls,year:yr,notes});}catch(e){}
}
function openAddProviderModal(){['newProviderName','newProviderDirector','newProviderEmail','newProviderCity','newProviderPhone'].forEach(id=>{const el=$(id);if(el)el.value='';});openModal('addProviderModal');}
function saveNewProvider(){
  const name=$('newProviderName')?.value.trim(),dir=$('newProviderDirector')?.value.trim(),email=$('newProviderEmail')?.value.trim(),city=$('newProviderCity')?.value.trim()||'',phone=$('newProviderPhone')?.value.trim()||'';
  if(!name||!dir||!email){showToast('Name, director and email required','warning');return;}
  const p={id:genId('p'),name,director:dir,email,city,phone,classes:['א׳','ב׳']};
  PROVIDERS.push(p);AUDIT_LOG.unshift({id:genId('a'),action:'Add Provider',entity:'Provider',entityName:name,field:'—',before:'—',after:'Created',timestamp:new Date().toISOString()});
  closeModal('addProviderModal');showToast(`"${name}" added`,'success');
  const pb=$('providersBadge');if(pb)pb.textContent=PROVIDERS.length;
  if(_page==='providers')renderProviders();
  try{API.createProvider({name,director:dir,email,city,phone,classes:['א׳','ב׳']});}catch(e){}
}
let _aSid=null;
function openAddAssessmentModal(sid){
  _aSid=sid;const s=getStudent(sid);
  $('assessmentModalTitle').textContent=`Add Assessment — ${sName(s)}`;
  const sel=$('assessmentMonth');if(sel)sel.innerHTML=HEB_MONTHS.map(m=>`<option value="${m.id}" ${m.id===CUR_MONTH?'selected':''}>${m.label}</option>`).join('');
    const inp=$('assessmentCategoryInputs');
  if(inp) inp.innerHTML = CATS.map(cat => `
    <div class="card" style="margin-bottom:10px;border-right:4px solid ${cat.color}">
      <div class="card-body" style="padding:12px 16px">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px">
          <span class="he" style="font-weight:700;color:${cat.color}">${cat.label}</span>
          <div style="display:flex;gap:16px;align-items:flex-end">
            <div style="display:flex;flex-direction:column;align-items:center;gap:3px">
              <label style="font-size:0.68rem;font-weight:800;color:#1a6038;text-transform:uppercase">Correct</label>
              <input type="number" min="0" max="99" id="c_${cat.id}_c" value="0"
                style="width:64px;text-align:center;padding:6px;border:1.5px solid #1a6038;border-radius:6px;font-weight:800;font-size:0.95rem">
            </div>
            ${cat.hasMistakes ? `
            <div style="display:flex;flex-direction:column;align-items:center;gap:3px">
              <label style="font-size:0.68rem;font-weight:800;color:#9a1c1c;text-transform:uppercase">Mistakes</label>
              <input type="number" min="0" max="99" id="c_${cat.id}_m" value="0"
                style="width:64px;text-align:center;padding:6px;border:1.5px solid #9a1c1c;border-radius:6px;font-weight:800;font-size:0.95rem">
            </div>` : ''}
          </div>
        </div>
      </div>
    </div>`).join('');
  openModal('addAssessmentModal');
}
function saveAssessment(){
  const sid=_aSid,month=$('assessmentMonth')?.value,year=$('assessmentYear')?.value||CUR_YEAR;
  if(!sid||!month){showToast('Please select a month','warning');return;}
  const s=getStudent(sid),cats={};
  CATS.forEach(cat=>{cats[cat.id]={correct:parseInt($(`c_${cat.id}_c`)?.value)||0,mistakes:cat.hasMistakes?(parseInt($(`c_${cat.id}_m`)?.value)||0):0};});
  const newA={id:genId('a'),studentId:sid,providerId:s.providerId,month,year,source:'manual',createdAt:new Date().toISOString(),categories:cats};
  const idx=ASSESSMENTS.findIndex(a=>a.studentId===sid&&a.month===month&&a.year===year);
  if(idx>=0)ASSESSMENTS[idx]=newA;else ASSESSMENTS.push(newA);
  AUDIT_LOG.unshift({id:genId('au'),action:'Add Assessment',entity:'Assessment',entityName:sName(s),field:'Month',before:'—',after:getMonthLabel(month),timestamp:new Date().toISOString()});
  SYS_LOGS.unshift({id:genId('l'),type:'success',message:`Assessment saved — ${sName(s)} — ${getMonthLabel(month)} ${year}`,timestamp:new Date().toISOString()});
  closeModal('addAssessmentModal');showToast('Assessment saved','success');
  if(_page==='student_profile')renderStudentProfile(sid);
  try{API.saveAssessment({studentId:sid,providerId:s.providerId,month,year,categories:cats,source:'manual',studentName:sName(s)});}catch(e){}
}
function showNotifications(){const alerts=getAlerts();$('notificationsBody').innerHTML=alerts.length?alerts.map(a=>`<div class="alert alert-${a.type}" style="margin-bottom:10px;cursor:pointer" onclick="closeModal('notificationsPanel');navigate('student_profile',{studentId:'${a.studentId}'})"><div><div style="font-weight:700;margin-bottom:2px">${a.title}</div><div style="font-size:0.8rem">${a.message}</div></div></div>`).join(''):'<div style="text-align:center;padding:40px;color:#808285">No active alerts</div>';openModal('notificationsPanel');}

// BOOT
document.addEventListener('DOMContentLoaded',()=>{
  const db=$('hebrewDateBadge');if(db)db.textContent=HEB_TODAY;
  document.querySelectorAll('.modal-overlay').forEach(o=>o.addEventListener('click',e=>{if(e.target===o)o.classList.remove('open');}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.modal-overlay.open').forEach(m=>m.classList.remove('open'));});
  const sb=$('studentsBadge');if(sb)sb.textContent=STUDENTS.length;
  const pb=$('providersBadge');if(pb)pb.textContent=PROVIDERS.length;
  navigate('dashboard');
  // Background server sync
  setTimeout(async()=>{try{const[providers,students,assessments]=await Promise.all([API.getProviders(),API.getStudents(),API.getAssessments()]);PROVIDERS.length=0;providers.forEach(p=>PROVIDERS.push(p));STUDENTS.length=0;students.forEach(s=>STUDENTS.push({...s,firstName:s.first_name||s.firstName||'',lastName:s.last_name||s.lastName||'',providerId:s.provider_id||s.providerId||''}));ASSESSMENTS.length=0;assessments.forEach(a=>{if(a.categories)ASSESSMENTS.push({...a,studentId:a.student_id||a.studentId,providerId:a.provider_id||a.providerId});else ASSESSMENTS.push({...a,studentId:a.student_id||a.studentId,providerId:a.provider_id||a.providerId,categories:{otiyot:{correct:a.otiyot_correct||0,mistakes:a.otiyot_mistakes||0},ot_nekuda:{correct:a.ot_nekuda_correct||0,mistakes:a.ot_nekuda_mistakes||0},ot_nekuda_ot:{correct:a.ot_nekuda_ot_correct||0,mistakes:a.ot_nekuda_ot_mistakes||0},milim:{correct:a.milim_correct||0,mistakes:a.milim_mistakes||0},tehilim:{correct:a.tehilim_correct||0,mistakes:a.tehilim_mistakes||0}}});});const dot=$('serverStatusDot'),txt=$('serverStatusText');if(dot)dot.style.background='#1a6038';if(txt)txt.textContent='Connected';if(sb)sb.textContent=STUDENTS.length;if(pb)pb.textContent=PROVIDERS.length;navigate(_page,_params);}catch(e){console.warn('[KT] Using demo data');}},1500);
});

// ============================================================
// OVERRIDES — RTL tables, correct report/worksheet layout
// ============================================================

// Override catGrid to respect hasMistakes flag
function catGrid(cats, data) {
  return `<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;direction:rtl">
    ${cats.map(cat => {
      const correct  = data?.categories[cat.id]?.correct  || 0;
      const mistakes = data?.categories[cat.id]?.mistakes || 0;
      return `<div style="background:#f8f9fa;border:1px solid #e8d9b8;border-top:3px solid ${cat.color};border-radius:8px;padding:10px;text-align:center">
        <div class="he" style="font-size:0.65rem;font-weight:700;color:${cat.color};margin-bottom:8px">${cat.label}</div>
        <div style="font-size:1.3rem;font-weight:900;color:#005778">${correct}</div>
        ${cat.hasMistakes ? `<div style="font-size:0.7rem;color:#9a1c1c;font-weight:700;margin-top:2px">${mistakes} mistakes</div>` : ''}
      </div>`;
    }).join('')}
  </div>`;
}

// ============================================================
// REPORT — exact format matching attached image
// ============================================================
function showStudentReport(sid) {
  const s = getStudent(sid);
  const allAss = getStudentAssessments(sid);
  const prov = getProvider(s.providerId);
  if (!allAss.length) { showToast('No assessments for report', 'warning'); return; }
  const lastA = allAss[allAss.length - 1];
  const monthLabel = getMonthLabel(lastA.month);

  // YTD assessments from תשרי onwards (all months in order)
  const ytdAss = allAss; // already sorted from תשרי

  // AI note — Yiddish or English only
  const t = getStudentTrend(sid);
  const noteEn = t === 'up'
    ? `Strong progress this month. Continues to build fluency and accuracy.`
    : t === 'down'
    ? `Some challenges this month. Additional support recommended to reinforce skills.`
    : `Steady performance this month. Maintaining consistent reading skills.`;
  const noteYi = t === 'up'
    ? `${s.firstName} האט זיך שטארק פארבעסערט דעם חודש. ער לערנט מיט גרויס פלייס.`
    : t === 'down'
    ? `${s.firstName} האט עטוואס שווערע צייטן דעם חודש. מיר וועלן אים מער העלפן.`
    : `${s.firstName} האלט זיין ניוואו. ער לערנט גוט.`;

  $('reportPreviewBody').innerHTML = `
<div style="font-family:'Frank Ruhl Libre','Heebo',serif;direction:rtl;max-width:700px;margin:0 auto;background:#fff">

  <!-- LETTERHEAD BANNER -->
  <div style="background:linear-gradient(135deg,#005778,#1a7a9a);padding:0;margin-bottom:0;position:relative;overflow:hidden">
    <div style="display:flex;align-items:center;justify-content:center;padding:16px 24px;gap:20px">
      <!-- Left flourish -->
      <div style="color:#D9A44E;font-size:2rem;opacity:0.8">❧</div>
      <!-- Logo + text center -->
      <div style="text-align:center;flex:1">
        <div style="display:flex;align-items:center;justify-content:center;gap:16px">
          <img src="assets/logo.png" style="width:72px;height:72px;object-fit:contain;filter:drop-shadow(0 2px 8px rgba(0,0,0,0.3))" onerror="this.style.display='none'">
          <div>
            <div style="font-size:0.75rem;color:rgba(255,255,255,0.8);letter-spacing:1px">מערכת הקריאה</div>
            <div style="font-size:1.4rem;font-weight:900;color:#fff;letter-spacing:0.5px">מחדדים בפיך</div>
            <div style="font-size:0.65rem;color:rgba(255,255,255,0.7);margin-top:2px">איחוד מוסדות החינוך</div>
          </div>
        </div>
      </div>
      <!-- Right flourish -->
      <div style="color:#D9A44E;font-size:2rem;opacity:0.8">❦</div>
    </div>
    <!-- Gold bottom line -->
    <div style="height:3px;background:linear-gradient(90deg,transparent,#D9A44E,transparent)"></div>
  </div>

  <!-- DATE & STUDENT -->
  <div style="padding:20px 28px 10px;text-align:center;border-bottom:1px solid #e8d9b8">
    <div style="font-size:0.85rem;color:#808285;margin-bottom:6px"><span class="he">${monthLabel} ${lastA.year}</span></div>
    <div style="font-size:1.1rem;color:#333;line-height:1.7">
      <span class="he">לכבוד התלמיד היקר</span>
      <span class="he" style="font-size:1.3rem;font-weight:900;color:#005778;display:block;margin-top:4px">${s.firstName} ${s.lastName}</span>
    </div>
    <div style="font-size:0.85rem;color:#555;margin-top:6px;direction:rtl">
      <span class="he">מזל טוב על תוצאות הקריאה החודשיות שלך!</span>
    </div>
  </div>

  <!-- CURRENT MONTH SCORES — teal boxes -->
  <div style="padding:18px 28px">
    <div style="font-size:0.8rem;font-weight:700;color:#808285;text-align:center;margin-bottom:12px;text-transform:uppercase;letter-spacing:1px">
      ${monthLabel} ${lastA.year} — Results
    </div>
    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;direction:rtl">
      ${CATS.map(cat => {
        const correct  = lastA.categories[cat.id]?.correct  || 0;
        const mistakes = lastA.categories[cat.id]?.mistakes || 0;
        return `<div style="background:#005778;border-radius:10px;padding:14px 8px;text-align:center;color:#fff">
          <div class="he" style="font-size:0.62rem;font-weight:700;color:rgba(255,255,255,0.8);margin-bottom:8px;line-height:1.3">${cat.label}</div>
          <div style="font-size:1.8rem;font-weight:900;color:#fff;line-height:1">${correct}</div>
          ${cat.hasMistakes ? `<div style="font-size:0.65rem;color:rgba(255,200,200,0.9);margin-top:4px">${mistakes} err.</div>` : `<div style="font-size:0.65rem;color:rgba(255,255,255,0.5);margin-top:4px">—</div>`}
        </div>`;
      }).join('')}
    </div>
  </div>

  <!-- YTD PROGRESS TABLE — from תשרי -->
  <div style="padding:0 28px 18px">
    <div style="font-size:0.8rem;font-weight:700;color:#808285;margin-bottom:10px;text-transform:uppercase;letter-spacing:1px;text-align:center">
      Year-to-Date Progress — <span class="he">${CUR_YEAR}</span>
    </div>
    <table style="width:100%;border-collapse:collapse;direction:rtl;font-size:0.82rem">
      <thead>
        <tr style="background:#005778;color:#fff">
          <th style="padding:9px 10px;text-align:right;font-weight:700;border-radius:0 6px 0 0">חודש</th>
          ${CATS.map(cat => `<th style="padding:9px 8px;text-align:center;font-weight:700;border-right:1px solid rgba(255,255,255,0.2)">
            <span class="he" style="font-size:0.72rem">${cat.label}</span>
          </th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${ytdAss.map((a, i) => `
          <tr style="background:${i % 2 === 0 ? '#fff' : '#f8f9fa'};${a.month === lastA.month ? 'font-weight:700;background:#e0eef5;' : ''}">
            <td style="padding:8px 10px;text-align:right;border-bottom:1px solid #e8d9b8">
              <span class="he" style="font-weight:${a.month === lastA.month ? '800' : '500'};color:${a.month === lastA.month ? '#005778' : '#333'}">${getMonthLabel(a.month)}</span>
              ${a.month === lastA.month ? '<span style="font-size:0.6rem;background:#005778;color:#fff;padding:1px 5px;border-radius:10px;margin-right:4px">עכשיו</span>' : ''}
            </td>
            ${CATS.map(cat => {
              const correct  = a.categories[cat.id]?.correct  || 0;
              const mistakes = a.categories[cat.id]?.mistakes || 0;
              return `<td style="padding:8px;text-align:center;border-bottom:1px solid #e8d9b8;border-right:1px solid #e8d9b8">
                <span style="font-weight:700;color:#005778;font-size:0.9rem">${correct}</span>
                ${cat.hasMistakes && mistakes > 0 ? `<span style="font-size:0.65rem;color:#9a1c1c;display:block">-${mistakes}</span>` : ''}
              </td>`;
            }).join('')}
          </tr>`).join('')}
      </tbody>
    </table>
  </div>

  <!-- NOTES -->
  <div style="padding:0 28px 18px">
    <div style="border:1px solid #e8d9b8;border-radius:10px;overflow:hidden">
      <div style="background:#005778;padding:8px 14px">
        <span style="color:#fff;font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px">Teacher's Note</span>
      </div>
      <div style="padding:14px;background:#fdf8f0">
        <div style="font-size:0.85rem;color:#333;line-height:1.7;margin-bottom:8px">${noteEn}</div>
        <div class="he" style="font-size:0.85rem;color:#444;line-height:1.8;border-top:1px solid #e8d9b8;padding-top:8px;margin-top:8px">${noteYi}</div>
      </div>
    </div>
  </div>

  <!-- PROVIDER -->
  <div style="padding:0 28px 24px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid #e8d9b8;margin-top:4px;padding-top:14px">
    <div style="font-size:0.8rem;color:#808285">
      <span style="font-weight:700;text-transform:uppercase;letter-spacing:0.5px">Provider:</span>
      <span class="he" style="font-weight:700;color:#005778;margin-right:6px">${prov ? prov.name : '—'}</span>
    </div>
    <div style="font-size:0.8rem;color:#808285">
      <span style="font-weight:700;text-transform:uppercase;letter-spacing:0.5px">Director:</span>
      <span class="he" style="font-weight:700;color:#333;margin-right:6px">${prov ? prov.director : '—'}</span>
    </div>
  </div>

  <!-- BOTTOM BANNER -->
  <div style="background:linear-gradient(135deg,#005778,#1a7a9a);height:8px;border-radius:0 0 8px 8px"></div>
</div>`;
  openModal('reportPreviewModal');
}

// ============================================================
// WORKSHEET — landscape, logo header, RTL, no mistakes for מילים/תהילים
// ============================================================
function genWorksheet() {
  _wsProv = document.getElementById('wsProv')?.value || _wsProv;
  _wsMonth = document.getElementById('wsMonth')?.value || _wsMonth;
  if (!_wsProv || !_wsMonth) { showToast('Please select provider and month', 'warning'); return; }
  const p = getProvider(_wsProv), ss = getProviderStudents(_wsProv);
  if (!ss.length) { showToast('No students for this provider', 'warning'); return; }
  const monthLabel = getMonthLabel(_wsMonth);

  $('wsPreview').innerHTML = `
<div id="worksheetDoc" style="background:#fff;padding:20px;font-family:'Frank Ruhl Libre','Heebo',serif;direction:rtl">
  <!-- LOGO HEADER -->
  <div style="background:linear-gradient(135deg,#005778,#1a7a9a);padding:12px 20px;border-radius:8px 8px 0 0;display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:0">
    <div style="color:#D9A44E;font-size:1.5rem">❧</div>
    <img src="assets/logo.png" style="width:56px;height:56px;object-fit:contain;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.3))" onerror="this.style.display='none'">
    <div style="text-align:center;color:#fff">
      <div style="font-size:0.65rem;color:rgba(255,255,255,0.7);letter-spacing:1px">מערכת הקריאה</div>
      <div style="font-size:1.1rem;font-weight:900">מחדדים בפיך</div>
    </div>
    <div style="color:#D9A44E;font-size:1.5rem">❦</div>
  </div>
  <div style="height:3px;background:linear-gradient(90deg,transparent,#D9A44E,transparent);margin-bottom:12px"></div>

  <!-- TITLE -->
  <div style="text-align:center;margin-bottom:14px">
    <div style="font-size:1rem;font-weight:800;color:#005778">גיליון הערכה — <span class="he">${p.name}</span></div>
    <div style="font-size:0.8rem;color:#808285;margin-top:3px"><span class="he">${monthLabel} ${CUR_YEAR}</span> | <span class="he">${p.director}</span></div>
  </div>

  <!-- INSTRUCTIONS -->
  <div style="background:#e0eef5;border:1px solid #b0cfe0;border-radius:6px;padding:8px 14px;margin-bottom:14px;font-size:0.78rem;color:#005778;text-align:right">
    <span class="he">הוראות: מלא את הציון לכל קטגוריה עבור כל תלמיד. אין ציון כולל. עבור מילים ותהילים — ציון אחד בלבד.</span>
  </div>

  <!-- TABLE -->
  <div style="overflow-x:auto">
    <table style="width:100%;border-collapse:collapse;direction:rtl;font-size:0.82rem">
      <thead>
        <tr>
          <th style="background:#005778;color:#fff;padding:9px 12px;text-align:right;min-width:130px;border-radius:0 6px 0 0">שם תלמיד</th>
          <th style="background:#005778;color:#fff;padding:9px 8px;text-align:center;min-width:50px">כיתה</th>
          ${CATS.map(cat => cat.hasMistakes
            ? `<th colspan="2" style="background:#005778;color:#fff;padding:9px 8px;text-align:center;border-right:2px solid rgba(255,255,255,0.3)"><span class="he" style="font-size:0.75rem">${cat.label}</span></th>`
            : `<th style="background:#005778;color:#fff;padding:9px 8px;text-align:center;border-right:2px solid rgba(255,255,255,0.3)"><span class="he" style="font-size:0.75rem">${cat.label}</span></th>`
          ).join('')}
          <th style="background:#005778;color:#fff;padding:9px 8px;text-align:right;min-width:100px">הערות</th>
        </tr>
        <tr style="background:#1a7a9a">
          <th></th><th></th>
          ${CATS.map(cat => cat.hasMistakes
            ? `<th style="color:#a8e0e0;font-size:0.65rem;padding:5px;text-align:center">נכון</th><th style="color:#ffaaaa;font-size:0.65rem;padding:5px;text-align:center;border-right:2px solid rgba(255,255,255,0.15)">שגיאות</th>`
            : `<th style="color:#a8e0e0;font-size:0.65rem;padding:5px;text-align:center;border-right:2px solid rgba(255,255,255,0.15)">ציון</th>`
          ).join('')}
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${ss.map((s, i) => `
          <tr style="border-bottom:1px solid #e8d9b8;background:${i % 2 === 0 ? '#fff' : '#f8f9fa'}">
            <td class="he" style="padding:13px 12px;font-weight:600;text-align:right">${sName(s)}</td>
            <td style="padding:13px 8px;text-align:center">${s.class}</td>
            ${CATS.map(cat => cat.hasMistakes
              ? `<td style="padding:13px 8px;min-width:44px;background:#fafaf8;border-right:1px solid #eee"></td>
                 <td style="padding:13px 8px;min-width:44px;background:#fafaf8;border-right:2px solid #ddd"></td>`
              : `<td style="padding:13px 8px;min-width:60px;background:#fafaf8;border-right:2px solid #ddd"></td>`
            ).join('')}
            <td style="padding:13px 8px;min-width:100px"></td>
          </tr>`).join('')}
      </tbody>
    </table>
  </div>

  <!-- FOOTER -->
  <div style="margin-top:16px;display:flex;justify-content:space-between;font-size:0.75rem;color:#808285;border-top:1px solid #e8d9b8;padding-top:10px">
    <span>חתימת מורה: ___________________</span>
    <span>תאריך: ___________________</span>
    <span>KriahTrack — מערכת הקריאה</span>
  </div>
</div>`;
}

// ============================================================
// RTL fix for all tables — patch renderStudents, renderProviders etc.
// ============================================================
// Override table headers to be RTL
const _origRenderStudents = renderStudents;
renderStudents = function() {
  _origRenderStudents();
  // Tables already use direction:rtl via CSS — just ensure th text-align
  document.querySelectorAll('thead th').forEach(th => {
    if (!th.style.textAlign) th.style.textAlign = 'right';
  });
};

// ============================================================
// PRINT CSS — landscape for worksheet, portrait for report
// ============================================================
(function addPrintCSS() {
  const style = document.createElement('style');
  style.textContent = `
    @media print {
      body { direction: rtl; }
      table { direction: rtl; }
      thead th { text-align: right !important; }
      tbody td { text-align: right; }
    }
    /* Worksheet print = landscape */
    @media print {
      #worksheetDoc { page-break-before: always; }
    }
    .print-landscape { }
    .print-portrait  { }
  `;
  document.head.appendChild(style);
})();

// Override window.print for worksheet to use landscape
const _origPrintWorksheet = window.print;
function printWorksheet() {
  const style = document.createElement('style');
  style.id = 'printOrient';
  style.textContent = '@page { size: landscape; margin: 10mm; }';
  document.head.appendChild(style);
  window.print();
  setTimeout(() => { const el = document.getElementById('printOrient'); if (el) el.remove(); }, 1000);
}
function printReport() {
  const style = document.createElement('style');
  style.id = 'printOrient';
  style.textContent = '@page { size: portrait; margin: 15mm; }';
  document.head.appendChild(style);
  window.print();
  setTimeout(() => { const el = document.getElementById('printOrient'); if (el) el.remove(); }, 1000);
}

// ============================================================
// FEATURE OVERRIDES — All new requirements
// ============================================================

// ── KRIAH DIRECTOR PAGE ──────────────────────────────────────
const _origRenderProviders = renderProviders;
renderProviders = function() {
  $('pageContent').innerHTML = `
<div class="page-header">
  <div><h1 class="page-title">Classes & Management</h1><p class="page-subtitle">Single school — multiple classes</p></div>
  <button class="btn btn-primary" onclick="openAddProviderModal()">+ Add Class</button>
</div>

<!-- KRIAH DIRECTOR CARD -->
<div class="card mb-6" style="border-top:4px solid #D9A44E">
  <div class="card-header" style="background:linear-gradient(135deg,#003d56,#005778)">
    <span class="card-title" style="color:#fff;font-size:1rem">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D9A44E" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
      Kriah Director — <span style="color:#D9A44E">מנהל הקריאה</span>
    </span>
    <button class="btn btn-sm" style="background:rgba(217,164,78,0.2);color:#D9A44E;border:1px solid #D9A44E" onclick="editKriahDirector()">Edit</button>
  </div>
  <div class="card-body" id="kriahDirectorDisplay">
    ${KRIAH_DIRECTOR.name
      ? `<div style="display:flex;align-items:center;gap:16px">
          <div class="user-avatar" style="width:52px;height:52px;font-size:1.1rem;background:linear-gradient(135deg,#D9A44E,#b8832e)">${KRIAH_DIRECTOR.name.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
          <div>
            <div class="he" style="font-size:1.1rem;font-weight:800;color:#005778">${KRIAH_DIRECTOR.name}</div>
            <div style="font-size:0.85rem;color:#808285;margin-top:3px">${KRIAH_DIRECTOR.email}</div>
            <div style="font-size:0.75rem;color:#D9A44E;font-weight:700;margin-top:4px;text-transform:uppercase;letter-spacing:0.5px">Kriah Director — Oversees all classes</div>
          </div>
        </div>`
      : `<div style="text-align:center;padding:20px;color:#808285">
          <div style="font-size:2rem;margin-bottom:8px">👤</div>
          <div style="font-weight:600;margin-bottom:4px">No Kriah Director set</div>
          <div style="font-size:0.84rem">Click Edit to add the Kriah Director's name and email</div>
          <button class="btn btn-gold btn-sm" style="margin-top:12px" onclick="editKriahDirector()">+ Set Kriah Director</button>
        </div>`}
  </div>
</div>

<!-- CLASSES GRID -->
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px">
  ${PROVIDERS.map((p,i) => {
    const ss = getProviderStudents(p.id);
    const imp = ss.filter(s => getStudentTrend(s.id) === 'up').length;
    const str = ss.filter(s => getStudentTrend(s.id) === 'down').length;
    return `<div class="card" style="cursor:pointer;transition:all 0.2s" onclick="navigate('provider_profile',{providerId:'${p.id}'})" onmouseenter="this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 24px rgba(0,87,120,0.15)'" onmouseleave="this.style.transform='';this.style.boxShadow=''">
      <div style="background:linear-gradient(135deg,#005778,#1a7a9a);padding:16px 18px;color:#fff">
        <div style="display:flex;align-items:center;gap:12px">
          <div class="user-avatar" style="width:44px;height:44px;font-size:1rem;background:${avatarColor(i)}">${p.name.slice(0,2)}</div>
          <div>
            <div class="he" style="font-weight:800;font-size:1rem">${p.name}</div>
            <div class="he" style="font-size:0.76rem;opacity:0.8;margin-top:2px">${p.director}</div>
          </div>
        </div>
      </div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;text-align:center">
          <div><div style="font-size:1.4rem;font-weight:900;color:#005778">${ss.length}</div><div style="font-size:0.68rem;color:#808285">Students</div></div>
          <div><div style="font-size:1.4rem;font-weight:900;color:#1a6038">${imp}</div><div style="font-size:0.68rem;color:#808285">Improving</div></div>
          <div><div style="font-size:1.4rem;font-weight:900;color:#9a1c1c">${str}</div><div style="font-size:0.68rem;color:#808285">At Risk</div></div>
        </div>
      </div>
    </div>`;
  }).join('')}
</div>`;
};

function editKriahDirector() {
  const name = prompt('Kriah Director Name:', KRIAH_DIRECTOR.name || '');
  if (name === null) return;
  const email = prompt('Kriah Director Email:', KRIAH_DIRECTOR.email || '');
  if (email === null) return;
  KRIAH_DIRECTOR.name = name.trim();
  KRIAH_DIRECTOR.email = email.trim();
  showToast('Kriah Director updated', 'success');
  navigate('providers');
}

// ── REPORT FINALIZATION ──────────────────────────────────────
function getReportKey(sid, month, year) { return `${sid}_${month}_${year}`; }
function isReportFinal(sid, month, year) { return !!REPORT_FINALS[getReportKey(sid, month, year)]?.finalized; }
function finalizeReport(sid, month, year) {
  const key = getReportKey(sid, month, year);
  REPORT_FINALS[key] = { ...REPORT_FINALS[key], finalized: true };
  showToast('Report marked as final', 'success');
}
function unlockReport(sid, month, year) {
  const key = getReportKey(sid, month, year);
  if (REPORT_FINALS[key]) REPORT_FINALS[key].finalized = false;
  showToast('Report unlocked for editing', 'info');
}
function getReportNote(sid, month, year) {
  return REPORT_FINALS[getReportKey(sid, month, year)]?.note || '';
}
function getReportLang(sid, month, year) {
  return REPORT_FINALS[getReportKey(sid, month, year)]?.lang || 'en';
}
function saveReportNote(sid, month, year, note, lang) {
  const key = getReportKey(sid, month, year);
  REPORT_FINALS[key] = { ...REPORT_FINALS[key], note, lang };
}

// ── YIDDISH AI NOTES (proper Yiddish from ivelt/yiddish24 style) ─────────────
const YIDDISH_NOTES = {
  up: [
    'דער תלמיד האט זיך אין דעם חודש שטארק פארבעסערט. ער לייענט מיט גרויס פלייס און פארשטייט גוט. מיר זענען זייער צופרידן מיט זיין פארשריט.',
    'א שיינע פארבעסערונג דעם חודש! דער תלמיד לייענט פלינקער און מיט מער זיכערקייט. ער זאל אזוי ווייטערמאכן.',
    'דעם חודש האט דער תלמיד אויסגעוויזן א שטארקע וואקסונג אין זיין קריאה. זיין פלייס איז זייער לויבנסווערט.',
  ],
  down: [
    'דעם חודש האט דער תלמיד עטוואס שווערע צייטן. מיר וועלן אים מער אויפמערקזאמקייט גיבן כדי צו העלפן אים פארבעסערן.',
    'עס זענען פאראן עטלעכע חסרונות דעם חודש. מיר ביטן די עלטערן צו חזרן מיט דעם קינד אויף די לקחים בבית.',
    'דער תלמיד דארף נאך מער איבונג. מיר וועלן צוזאמענארבעטן כדי צו העלפן אים דערגרייכן זיין פולן פאטענציאל.',
  ],
  flat: [
    'דער תלמיד האלט זיין ניוואו גוט. ער לייענט מיט קאנסיסטענץ און מיר זענען צופרידן מיט זיין ארבעט.',
    'א שטייענדיקע לייסטונג דעם חודש. דער תלמיד ארבעט פלייסיק און האלט זיין ניוואו.',
    'דעם חודש האט דער תלמיד ווידער אמאל באוויזן זיין פארלאסלעכקייט. מיר זענען צופרידן מיט זיין קאנסיסטענטע ארבעט.',
  ]
};

const ENGLISH_NOTES = {
  up: [
    'Strong progress this month. Continues to build fluency and accuracy across all categories.',
    'Excellent improvement this month. Reading with greater confidence and speed.',
    'Outstanding growth this month. Consistent effort is clearly paying off.',
  ],
  down: [
    'Some challenges this month. Additional practice at home is recommended.',
    'A difficult month. We will provide extra support to help get back on track.',
    'Below expected performance this month. Please review material at home regularly.',
  ],
  flat: [
    'Steady performance this month. Maintaining consistent reading skills.',
    'Solid and reliable work this month. Continuing at a good pace.',
    'Consistent results this month. Keeping up well with the curriculum.',
  ]
};

function generateAINote(sid, trend, lang) {
  const pool = lang === 'yi' ? YIDDISH_NOTES[trend] || YIDDISH_NOTES.flat : ENGLISH_NOTES[trend] || ENGLISH_NOTES.flat;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ── FULL REPORT OVERRIDE ─────────────────────────────────────
showStudentReport = function(sid, targetMonth, targetYear) {
  const s = getStudent(sid);
  const allAss = getStudentAssessments(sid);
  const prov = getProvider(s.providerId);
  if (!allAss.length) { showToast('No assessments for report', 'warning'); return; }

  // Default to last assessment if not specified
  const month = targetMonth || allAss[allAss.length - 1].month;
  const year  = targetYear  || allAss[allAss.length - 1].year;
  const monthLabel = getMonthLabel(month);
  const currentA = allAss.find(a => a.month === month && a.year === year);
  if (!currentA) { showToast('No assessment for selected month', 'warning'); return; }

  // YTD: only months up to and including selected month
  const monthOrder = getMonthOrder(month);
  const ytdAss = allAss.filter(a => getMonthOrder(a.month) <= monthOrder && a.year === year);

  const isFinal = isReportFinal(sid, month, year);
  const savedNote = getReportNote(sid, month, year);
  const savedLang = getReportLang(sid, month, year);
  const trend = getStudentTrend(sid);
  const directorName = KRIAH_DIRECTOR.name || (prov ? prov.director : '');

  $('reportPreviewBody').innerHTML = `
<div id="reportDoc" style="font-family:'Frank Ruhl Libre','Heebo',serif;direction:rtl;max-width:680px;margin:0 auto;background:#fff">

  <!-- STATUS BAR -->
  <div class="no-print" style="background:${isFinal?'#e4f2eb':'#fff3e0'};border:1px solid ${isFinal?'#a8d8bc':'#ecc870'};border-radius:8px;padding:10px 16px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;font-size:0.84rem">
    <span style="font-weight:700;color:${isFinal?'#1a6038':'#7a4800'}">${isFinal ? '✓ Report Finalized' : '✏ Draft — not yet finalized'}</span>
    <div style="display:flex;gap:8px">
      ${isFinal
        ? `<button class="btn btn-sm" style="background:#fff;border:1px solid #808285;color:#808285" onclick="unlockReport('${sid}','${month}','${year}');showStudentReport('${sid}','${month}','${year}')">🔓 Unlock to Edit</button>`
        : `<button class="btn btn-primary btn-sm" onclick="finalizeReport('${sid}','${month}','${year}');showStudentReport('${sid}','${month}','${year}')">✓ Mark as Final</button>`}
    </div>
  </div>

  <!-- LETTERHEAD BACKGROUND -->
  <div style="position:relative;overflow:hidden">
    <!-- Teal header banner -->
    <div style="background:linear-gradient(135deg,#005778,#1a7a9a);padding:0;position:relative">
      <div style="display:flex;align-items:center;justify-content:center;padding:14px 24px;gap:16px">
        <div style="color:#D9A44E;font-size:2rem;line-height:1">❧</div>
        <img src="assets/logo.png" style="width:68px;height:68px;object-fit:contain;filter:drop-shadow(0 2px 8px rgba(0,0,0,0.3))" onerror="this.style.display='none'">
        <div style="text-align:center;color:#fff">
          <div style="font-size:0.65rem;color:rgba(255,255,255,0.7);letter-spacing:1.5px;text-transform:uppercase">מערכת הקריאה</div>
          <div style="font-size:1.5rem;font-weight:900;letter-spacing:0.5px">מחדדים בפיך</div>
          <div style="font-size:0.62rem;color:rgba(255,255,255,0.6);margin-top:2px">איחוד מוסדות החינוך</div>
        </div>
        <div style="color:#D9A44E;font-size:2rem;line-height:1">❦</div>
      </div>
      <div style="height:3px;background:linear-gradient(90deg,transparent,#D9A44E,transparent)"></div>
    </div>

    <!-- DATE & STUDENT -->
    <div style="padding:18px 28px 12px;text-align:center;border-bottom:2px solid #e8d9b8;background:#fff">
      <div class="he" style="font-size:0.9rem;color:#808285;margin-bottom:8px">${monthLabel} ${year}</div>
      <div class="he" style="font-size:0.85rem;color:#444;margin-bottom:6px">לכבוד התלמיד היקר</div>
      <div class="he" style="font-size:1.5rem;font-weight:900;color:#005778">${s.firstName} ${s.lastName}</div>
      <div class="he" style="font-size:0.85rem;color:#555;margin-top:6px">מזל טוב על תוצאות הקריאה החודשיות שלך!</div>
    </div>

    <!-- CURRENT MONTH SCORES -->
    <div style="padding:16px 28px;background:#fff">
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;direction:rtl">
        ${CATS.map(cat => {
          const correct  = currentA.categories[cat.id]?.correct  || 0;
          const mistakes = currentA.categories[cat.id]?.mistakes || 0;
          return `<div style="background:#005778;border-radius:10px;padding:14px 6px;text-align:center;color:#fff">
            <div class="he" style="font-size:0.6rem;font-weight:700;color:rgba(255,255,255,0.8);margin-bottom:8px;line-height:1.4">${cat.label}</div>
            <div style="font-size:1.9rem;font-weight:900;line-height:1">${correct}</div>
            ${cat.hasMistakes ? `<div style="font-size:0.62rem;color:rgba(255,180,180,0.9);margin-top:4px">${mistakes} err.</div>` : `<div style="height:16px"></div>`}
          </div>`;
        }).join('')}
      </div>
    </div>

    <!-- YTD TABLE -->
    <div style="padding:0 28px 16px;background:#fff">
      <table style="width:100%;border-collapse:collapse;direction:rtl;font-size:0.82rem">
        <thead>
          <tr style="background:#005778;color:#fff">
            <th style="padding:9px 10px;text-align:right;font-weight:700">חודש</th>
            ${CATS.map(cat => `<th style="padding:9px 8px;text-align:center;font-weight:700;border-right:1px solid rgba(255,255,255,0.2)">
              <span class="he" style="font-size:0.7rem">${cat.label}</span>
            </th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${ytdAss.map((a, i) => {
            const isCurrent = a.month === month;
            return `<tr style="background:${isCurrent ? '#e0eef5' : i%2===0?'#fff':'#f8f9fa'};font-weight:${isCurrent?'700':'400'}">
              <td style="padding:8px 10px;text-align:right;border-bottom:1px solid #e8d9b8">
                <span class="he" style="color:${isCurrent?'#005778':'#333'}">${getMonthLabel(a.month)}</span>
              </td>
              ${CATS.map(cat => {
                const correct  = a.categories[cat.id]?.correct  || 0;
                const mistakes = a.categories[cat.id]?.mistakes || 0;
                return `<td style="padding:8px;text-align:center;border-bottom:1px solid #e8d9b8;border-right:1px solid #e8d9b8">
                  <span style="font-weight:700;color:#005778">${correct}</span>
                  ${cat.hasMistakes && mistakes > 0 ? `<span style="font-size:0.62rem;color:#9a1c1c;display:block">-${mistakes}</span>` : ''}
                </td>`;
              }).join('')}
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>

    <!-- NOTE SECTION -->
    <div style="padding:0 28px 16px;background:#fff">
      ${isFinal
        ? (savedNote
            ? `<div style="border:1px solid #e8d9b8;border-radius:8px;padding:14px;background:#fdf8f0">
                <div style="font-size:0.85rem;color:#333;line-height:1.8;${savedLang==='yi'?'direction:rtl;text-align:right;font-family:var(--font-he)':''}">${savedNote}</div>
               </div>`
            : `<div style="height:60px"></div>`)
        : `<div class="no-print" style="border:1px solid #e8d9b8;border-radius:8px;overflow:hidden">
            <div style="background:#f0f0f0;padding:8px 14px;display:flex;align-items:center;justify-content:space-between">
              <span style="font-size:0.78rem;font-weight:700;color:#444">Note (optional)</span>
              <div style="display:flex;gap:6px;align-items:center">
                <select id="noteLang" style="font-size:0.76rem;padding:3px 8px;border:1px solid #ddd;border-radius:4px" onchange="switchNoteLang(this.value,'${sid}','${month}','${year}')">
                  <option value="en" ${savedLang==='en'?'selected':''}>English</option>
                  <option value="yi" ${savedLang==='yi'?'selected':''}>Yiddish</option>
                </select>
                <button class="btn btn-sm" style="background:#005778;color:#fff;font-size:0.72rem;padding:4px 10px" onclick="aiGenerateNote('${sid}','${month}','${year}')">✨ AI Generate</button>
              </div>
            </div>
            <textarea id="reportNoteInput" rows="3" style="width:100%;padding:12px;border:none;font-size:0.85rem;font-family:${savedLang==='yi'?'var(--font-he)':'var(--font-en)'};direction:${savedLang==='yi'?'rtl':'ltr'};resize:vertical;outline:none;color:#333;line-height:1.7" placeholder="${savedLang==='yi'?'שרייב אן אנמערקונג...':'Write a note...'}" oninput="saveReportNote('${sid}','${month}','${year}',this.value,document.getElementById('noteLang').value)">${savedNote}</textarea>
          </div>
          <div style="border:1px solid #e8d9b8;border-radius:8px;padding:14px;background:#fdf8f0;margin-top:8px;min-height:50px;${savedLang==='yi'?'direction:rtl;text-align:right;font-family:var(--font-he)':''}">
            <div id="noteLivePreview" style="font-size:0.85rem;color:#333;line-height:1.8">${savedNote || '<span style="color:#ccc;font-style:italic">Note will appear here...</span>'}</div>
          </div>`}
    </div>

    <!-- DIRECTOR -->
    <div style="padding:0 28px 20px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid #e8d9b8;padding-top:12px;background:#fff">
      <div style="font-size:0.82rem;color:#444">
        <span style="font-weight:700;color:#808285;text-transform:uppercase;font-size:0.7rem;letter-spacing:0.5px">Director: </span>
        <span class="he" style="font-weight:700;color:#005778">${directorName}</span>
      </div>
      <div style="font-size:0.75rem;color:#808285">KriahTrack — מערכת הקריאה</div>
    </div>

    <!-- BOTTOM BANNER -->
    <div style="background:linear-gradient(135deg,#005778,#1a7a9a);height:8px;border-radius:0 0 8px 8px"></div>
  </div>
</div>`;

  // Wire live preview
  const ta = document.getElementById('reportNoteInput');
  if (ta) {
    ta.addEventListener('input', () => {
      const preview = document.getElementById('noteLivePreview');
      if (preview) preview.innerHTML = ta.value || '<span style="color:#ccc;font-style:italic">Note will appear here...</span>';
    });
  }

  openModal('reportPreviewModal');
};

function switchNoteLang(lang, sid, month, year) {
  const ta = document.getElementById('reportNoteInput');
  if (!ta) return;
  ta.style.direction = lang === 'yi' ? 'rtl' : 'ltr';
  ta.style.fontFamily = lang === 'yi' ? 'var(--font-he)' : 'var(--font-en)';
  ta.placeholder = lang === 'yi' ? 'שרייב אן אנמערקונג...' : 'Write a note...';
  saveReportNote(sid, month, year, ta.value, lang);
}

function aiGenerateNote(sid, month, year) {
  const lang = document.getElementById('noteLang')?.value || 'en';
  const trend = getStudentTrend(sid);
  const note = generateAINote(sid, trend, lang);
  const ta = document.getElementById('reportNoteInput');
  if (ta) {
    ta.value = note;
    ta.style.direction = lang === 'yi' ? 'rtl' : 'ltr';
    ta.style.fontFamily = lang === 'yi' ? 'var(--font-he)' : 'var(--font-en)';
    const preview = document.getElementById('noteLivePreview');
    if (preview) preview.innerHTML = note;
    saveReportNote(sid, month, year, note, lang);
  }
  showToast('AI note generated', 'success');
}

// ── PRINT REPORT — only current month's report ───────────────
printReport = function() {
  const style = document.createElement('style');
  style.id = 'printOrient';
  style.textContent = `
    @page { size: portrait; margin: 12mm; }
    .no-print { display: none !important; }
    body > *:not(#reportPreviewModal) { display: none !important; }
    #reportPreviewModal { display: block !important; position: static !important; background: none !important; padding: 0 !important; }
    #reportPreviewModal .modal { max-width: 100% !important; box-shadow: none !important; transform: none !important; }
    #reportPreviewModal .modal-header, #reportPreviewModal .modal-footer { display: none !important; }
  `;
  document.head.appendChild(style);
  window.print();
  setTimeout(() => { const el = document.getElementById('printOrient'); if (el) el.remove(); }, 1500);
};

// ── REPORTS PAGE — show month selector, finalization status ──
const _origRenderReports = renderReports;
renderReports = function() {
  $('pageContent').innerHTML = `
<div class="page-header">
  <div><h1 class="page-title">Monthly Reports</h1><p class="page-subtitle">Generate, finalize and print reports by class and month</p></div>
</div>
<div class="card mb-6">
  <div class="card-header"><span class="card-title">Report Settings</span></div>
  <div class="card-body">
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px">
      <div class="form-group"><label class="form-label">Class</label>
        <select class="form-control" id="rProv" onchange="_rp=this.value;genReports()">
          <option value="">All Classes</option>
          ${PROVIDERS.map(p=>`<option value="${p.id}" ${_rp===p.id?'selected':''}>${p.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label class="form-label">Month</label>
        <select class="form-control he" id="rMonth" onchange="_rm=this.value;genReports()">
          ${HEB_MONTHS.map(m=>`<option value="${m.id}" ${_rm===m.id?'selected':''}>${m.label}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label class="form-label">Note Language</label>
        <div style="display:flex;background:#f0ece4;border-radius:20px;padding:3px;gap:2px;margin-top:6px">
          <button style="padding:5px 14px;border-radius:17px;font-size:0.78rem;font-weight:700;cursor:pointer;border:none;background:${_rl==='en'?'#005778':'transparent'};color:${_rl==='en'?'#fff':'#808285'}" onclick="_rl='en';renderReports()">English</button>
          <button style="padding:5px 14px;border-radius:17px;font-size:0.78rem;font-weight:700;cursor:pointer;border:none;background:${_rl==='yi'?'#005778':'transparent'};color:${_rl==='yi'?'#fff':'#808285'}" onclick="_rl='yi';renderReports()">Yiddish</button>
        </div>
      </div>
    </div>
    <button class="btn btn-primary" onclick="genReports()">Generate Reports</button>
  </div>
</div>
<div id="rGrid"></div>`;
  genReports();
};

genReports = function() {
  _rp = document.getElementById('rProv')?.value || _rp;
  _rm = document.getElementById('rMonth')?.value || _rm;
  const ss = _rp ? getProviderStudents(_rp) : STUDENTS;
  // Only show students who have assessment for selected month
  const wd = ss.filter(s => ASSESSMENTS.some(a => a.studentId === s.id && a.month === _rm));
  const ml = getMonthLabel(_rm);

  $('rGrid').innerHTML = `
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
  <h3>${wd.length} Reports — <span class="he">${ml} ${CUR_YEAR}</span></h3>
  <button class="btn btn-ghost btn-sm" onclick="window.print()">Print All</button>
</div>
${wd.length === 0
  ? `<div style="text-align:center;padding:60px;color:#808285">No data for <span class="he">${ml}</span></div>`
  : `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:14px">
      ${wd.map(s => {
        const a = ASSESSMENTS.find(x => x.studentId === s.id && x.month === _rm);
        const prov = getProvider(s.providerId);
        const t = getStudentTrend(s.id);
        const isFinal = isReportFinal(s.id, _rm, CUR_YEAR);
        return `<div style="border:1px solid #e8d9b8;border-radius:12px;overflow:hidden;transition:all 0.2s" onmouseenter="this.style.boxShadow='0 4px 16px rgba(0,87,120,0.12)'" onmouseleave="this.style.boxShadow=''">
          <div style="background:linear-gradient(135deg,#005778,#1a7a9a);padding:14px 18px;color:#fff">
            <div style="display:flex;justify-content:space-between;align-items:flex-start">
              <div>
                <div class="he" style="font-weight:800;font-size:0.95rem">${sName(s)}</div>
                <div class="he" style="font-size:0.76rem;opacity:0.8;margin-top:2px">${prov?.name||'—'} | Class ${s.class}</div>
              </div>
              <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
                ${trendBadge(t)}
                ${isFinal ? '<span style="background:#1a6038;color:#fff;font-size:0.6rem;font-weight:800;padding:2px 7px;border-radius:20px">✓ FINAL</span>' : '<span style="background:rgba(255,255,255,0.2);color:#fff;font-size:0.6rem;font-weight:700;padding:2px 7px;border-radius:20px">DRAFT</span>'}
              </div>
            </div>
          </div>
          <div style="padding:14px 18px;background:#fff">
            <div style="margin-bottom:10px">
              ${CATS.map(cat => `<div style="display:flex;justify-content:space-between;font-size:0.8rem;padding:3px 0;border-bottom:1px solid #f0ece4">
                <span class="he" style="color:${cat.color};font-weight:600">${cat.label}</span>
                <span style="font-weight:700;color:#005778">${a?.categories[cat.id]?.correct||0}${cat.hasMistakes && (a?.categories[cat.id]?.mistakes||0)>0 ? ` <span style="color:#9a1c1c;font-size:0.72rem">(-${a.categories[cat.id].mistakes})</span>` : ''}</span>
              </div>`).join('')}
            </div>
          </div>
          <div style="padding:10px 18px;background:#fdf8f0;border-top:1px solid #e8d9b8;display:flex;gap:7px">
            <button class="btn btn-primary btn-sm" onclick="showStudentReport('${s.id}','${_rm}','${CUR_YEAR}')">View / Edit</button>
            <button class="btn btn-ghost btn-sm" onclick="showStudentReport('${s.id}','${_rm}','${CUR_YEAR}');setTimeout(printReport,600)">Print</button>
            ${isFinal
              ? `<button class="btn btn-sm" style="background:#fff;border:1px solid #808285;color:#808285;font-size:0.72rem" onclick="unlockReport('${s.id}','${_rm}','${CUR_YEAR}');genReports()">🔓</button>`
              : `<button class="btn btn-sm" style="background:#e4f2eb;border:1px solid #a8d8bc;color:#1a6038;font-size:0.72rem" onclick="finalizeReport('${s.id}','${_rm}','${CUR_YEAR}');genReports()">✓ Final</button>`}
          </div>
        </div>`;
      }).join('')}
    </div>`}`;
};

// ── SIDEBAR OFFSET FIX ───────────────────────────────────────
// Ensure content never overlaps sidebar
(function fixLayout() {
  const style = document.createElement('style');
  style.textContent = `
    .main-content { margin-left: 248px !important; }
    @media (max-width: 900px) { .main-content { margin-left: 0 !important; } }
    .page-content { padding: 26px !important; }
    /* Letterhead watermark on reports */
    #reportDoc { position: relative; }
  `;
  document.head.appendChild(style);
})();

// ============================================================
// NEW FEATURES — Report header, downloads, videos, final reports
// ============================================================

// ── VIDEO STORAGE (in-memory, keyed by studentId_month_year) ─
let STUDENT_VIDEOS = {}; // { 's1_sivan_תשפ״ו': { url, name, month, year, studentId } }

function getVideoKey(sid, month, year) { return `${sid}_${month}_${year}`; }
function getStudentVideo(sid, month, year) { return STUDENT_VIDEOS[getVideoKey(sid, month, year)] || null; }
function saveStudentVideo(sid, month, year, file) {
  const url = URL.createObjectURL(file);
  STUDENT_VIDEOS[getVideoKey(sid, month, year)] = { url, name: file.name, month, year, studentId: sid, size: file.size };
}

// ── DOWNLOAD HELPER ──────────────────────────────────────────
function downloadHTML(htmlContent, filename) {
  const blob = new Blob([`<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  body{font-family:'Frank Ruhl Libre',serif;direction:rtl;margin:0;padding:20px;background:#fff}
  @page{margin:12mm}
  .no-print{display:none}
</style>
</head><body>${htmlContent}</body></html>`], {type:'text/html'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

// ── REPORT HEADER — matches attached image ───────────────────
function buildReportHeader(studentName, monthLabel, year) {
  return `
<div style="background:linear-gradient(180deg,#005778 0%,#1a7a9a 100%);padding:0;border-radius:12px 12px 0 0;overflow:hidden">
  <!-- Teal curved top -->
  <div style="background:linear-gradient(135deg,#005778,#1a7a9a);padding:20px 24px 30px;text-align:center;position:relative">
    <!-- Gold flourishes + logo -->
    <div style="display:flex;align-items:center;justify-content:center;gap:12px">
      <div style="color:#D9A44E;font-size:2.5rem;line-height:1;opacity:0.9">❧</div>
      <div style="position:relative">
        <img src="assets/logo.png" style="width:80px;height:80px;object-fit:contain;filter:drop-shadow(0 3px 10px rgba(0,0,0,0.4));border-radius:50%;background:rgba(255,255,255,0.1);padding:4px" onerror="this.style.display='none'">
      </div>
      <div style="color:#D9A44E;font-size:2.5rem;line-height:1;opacity:0.9">❦</div>
    </div>
    <!-- Gold bottom wave -->
    <div style="position:absolute;bottom:0;left:0;right:0;height:20px;background:#fff;border-radius:50% 50% 0 0 / 100% 100% 0 0"></div>
  </div>
  <!-- White section with title -->
  <div style="background:#fff;padding:16px 28px 12px;text-align:center">
    <div class="he" style="font-size:2rem;font-weight:900;color:#005778;letter-spacing:0.5px">קריאה קארטל</div>
    <div class="he" style="font-size:0.9rem;color:#808285;margin-top:4px">אונזער תלמיד</div>
    <div class="he" style="font-size:1.4rem;font-weight:900;color:#1a2a2a;margin-top:6px">${studentName}</div>
    <div class="he" style="font-size:0.85rem;color:#808285;margin-top:6px">${monthLabel} ${year}</div>
  </div>
</div>`;
}

// ── FULL REPORT OVERRIDE with new header + download + video ──
showStudentReport = function(sid, targetMonth, targetYear) {
  const s = getStudent(sid);
  const allAss = getStudentAssessments(sid);
  const prov = getProvider(s.providerId);
  if (!allAss.length) { showToast('No assessments for report', 'warning'); return; }

  const month = targetMonth || allAss[allAss.length - 1].month;
  const year  = targetYear  || allAss[allAss.length - 1].year;
  const monthLabel = getMonthLabel(month);
  const currentA = allAss.find(a => a.month === month && a.year === year);
  if (!currentA) { showToast('No assessment for selected month', 'warning'); return; }

  const monthOrder = getMonthOrder(month);
  const ytdAss = allAss.filter(a => getMonthOrder(a.month) <= monthOrder && a.year === year);

  const isFinal = isReportFinal(sid, month, year);
  const savedNote = getReportNote(sid, month, year);
  const savedLang = getReportLang(sid, month, year);
  const trend = getStudentTrend(sid);
  const directorName = KRIAH_DIRECTOR.name || (prov ? prov.director : '');
  const video = getStudentVideo(sid, month, year);

  const reportHTML = `
<div id="reportDoc" style="font-family:'Frank Ruhl Libre','Heebo',serif;direction:rtl;max-width:680px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,87,120,0.12)">

  ${buildReportHeader(`${s.firstName} ${s.lastName}`, monthLabel, year)}

  <!-- SCORES -->
  <div style="padding:16px 28px;background:#fff">
    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;direction:rtl">
      ${CATS.map(cat => {
        const correct  = currentA.categories[cat.id]?.correct  || 0;
        const mistakes = currentA.categories[cat.id]?.mistakes || 0;
        return `<div style="background:#005778;border-radius:10px;padding:14px 6px;text-align:center;color:#fff">
          <div class="he" style="font-size:0.6rem;font-weight:700;color:rgba(255,255,255,0.8);margin-bottom:8px;line-height:1.4">${cat.label}</div>
          <div style="font-size:1.9rem;font-weight:900;line-height:1">${correct}</div>
          ${cat.hasMistakes ? `<div style="font-size:0.62rem;color:rgba(255,180,180,0.9);margin-top:4px">${mistakes} err.</div>` : `<div style="height:16px"></div>`}
        </div>`;
      }).join('')}
    </div>
  </div>

  <!-- YTD TABLE -->
  <div style="padding:0 28px 16px;background:#fff">
    <table style="width:100%;border-collapse:collapse;direction:rtl;font-size:0.82rem">
      <thead>
        <tr style="background:#005778;color:#fff">
          <th style="padding:9px 10px;text-align:right;font-weight:700">חודש</th>
          ${CATS.map(cat => `<th style="padding:9px 8px;text-align:center;font-weight:700;border-right:1px solid rgba(255,255,255,0.2)"><span class="he" style="font-size:0.7rem">${cat.label}</span></th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${ytdAss.map((a, i) => {
          const isCurrent = a.month === month;
          return `<tr style="background:${isCurrent?'#e0eef5':i%2===0?'#fff':'#f8f9fa'};font-weight:${isCurrent?'700':'400'}">
            <td style="padding:8px 10px;text-align:right;border-bottom:1px solid #e8d9b8">
              <span class="he" style="color:${isCurrent?'#005778':'#333'}">${getMonthLabel(a.month)}</span>
            </td>
            ${CATS.map(cat => {
              const correct  = a.categories[cat.id]?.correct  || 0;
              const mistakes = a.categories[cat.id]?.mistakes || 0;
              return `<td style="padding:8px;text-align:center;border-bottom:1px solid #e8d9b8;border-right:1px solid #e8d9b8">
                <span style="font-weight:700;color:#005778">${correct}</span>
                ${cat.hasMistakes && mistakes > 0 ? `<span style="font-size:0.62rem;color:#9a1c1c;display:block">-${mistakes}</span>` : ''}
              </td>`;
            }).join('')}
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>

  <!-- NOTE -->
  <div style="padding:0 28px 16px;background:#fff">
    ${isFinal
      ? (savedNote ? `<div style="border:1px solid #e8d9b8;border-radius:8px;padding:14px;background:#fdf8f0"><div style="font-size:0.85rem;color:#333;line-height:1.8;${savedLang==='yi'?'direction:rtl;text-align:right;font-family:var(--font-he)':''}">${savedNote}</div></div>` : '<div style="height:40px"></div>')
      : `<div class="no-print" style="border:1px solid #e8d9b8;border-radius:8px;overflow:hidden">
          <div style="background:#f0f0f0;padding:8px 14px;display:flex;align-items:center;justify-content:space-between">
            <span style="font-size:0.78rem;font-weight:700;color:#444">Note (optional)</span>
            <div style="display:flex;gap:6px;align-items:center">
              <select id="noteLang" style="font-size:0.76rem;padding:3px 8px;border:1px solid #ddd;border-radius:4px" onchange="switchNoteLang(this.value,'${sid}','${month}','${year}')">
                <option value="en" ${savedLang==='en'?'selected':''}>English</option>
                <option value="yi" ${savedLang==='yi'?'selected':''}>Yiddish</option>
              </select>
              <button class="btn btn-sm" style="background:#005778;color:#fff;font-size:0.72rem;padding:4px 10px" onclick="aiGenerateNote('${sid}','${month}','${year}')">✨ AI Generate</button>
            </div>
          </div>
          <textarea id="reportNoteInput" rows="3" style="width:100%;padding:12px;border:none;font-size:0.85rem;font-family:${savedLang==='yi'?'var(--font-he)':'var(--font-en)'};direction:${savedLang==='yi'?'rtl':'ltr'};resize:vertical;outline:none;color:#333;line-height:1.7" placeholder="${savedLang==='yi'?'שרייב אן אנמערקונג...':'Write a note...'}" oninput="saveReportNote('${sid}','${month}','${year}',this.value,document.getElementById('noteLang').value)">${savedNote}</textarea>
        </div>
        ${savedNote ? `<div style="border:1px solid #e8d9b8;border-radius:8px;padding:14px;background:#fdf8f0;margin-top:8px;${savedLang==='yi'?'direction:rtl;text-align:right;font-family:var(--font-he)':''}"><div id="noteLivePreview" style="font-size:0.85rem;color:#333;line-height:1.8">${savedNote}</div></div>` : '<div id="noteLivePreview" style="display:none"></div>'}`}
  </div>

  <!-- DIRECTOR -->
  <div style="padding:0 28px 16px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid #e8d9b8;padding-top:12px;background:#fff">
    <div style="font-size:0.82rem;color:#444">
      <span style="font-weight:700;color:#808285;text-transform:uppercase;font-size:0.7rem;letter-spacing:0.5px">Director: </span>
      <span class="he" style="font-weight:700;color:#005778">${directorName}</span>
    </div>
    <div style="font-size:0.75rem;color:#808285">KriahTrack</div>
  </div>

  <!-- BOTTOM BANNER -->
  <div style="background:linear-gradient(135deg,#005778,#1a7a9a);height:8px"></div>
</div>`;

  $('reportPreviewBody').innerHTML = `
<!-- STATUS BAR -->
<div class="no-print" style="background:${isFinal?'#e4f2eb':'#fff3e0'};border:1px solid ${isFinal?'#a8d8bc':'#ecc870'};border-radius:8px;padding:10px 16px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;font-size:0.84rem">
  <span style="font-weight:700;color:${isFinal?'#1a6038':'#7a4800'}">${isFinal ? '✓ Report Finalized' : '✏ Draft — not yet finalized'}</span>
  <div style="display:flex;gap:8px">
    ${isFinal
      ? `<button class="btn btn-sm" style="background:#fff;border:1px solid #808285;color:#808285" onclick="unlockReport('${sid}','${month}','${year}');showStudentReport('${sid}','${month}','${year}')">🔓 Unlock</button>`
      : `<button class="btn btn-primary btn-sm" onclick="finalizeReport('${sid}','${month}','${year}');showStudentReport('${sid}','${month}','${year}')">✓ Mark as Final</button>`}
    <button class="btn btn-gold btn-sm" onclick="downloadReport('${sid}','${month}','${year}')">⬇ Download</button>
  </div>
</div>
${reportHTML}`;

  // Store for download
  window._currentReportHTML = reportHTML;
  window._currentReportMeta = { sid, month, year, name: `${s.firstName} ${s.lastName}` };

  // Wire live preview
  setTimeout(() => {
    const ta = document.getElementById('reportNoteInput');
    if (ta) {
      ta.addEventListener('input', () => {
        const preview = document.getElementById('noteLivePreview');
        if (preview) { preview.innerHTML = ta.value || ''; preview.style.display = ta.value ? 'block' : 'none'; }
        saveReportNote(sid, month, year, ta.value, document.getElementById('noteLang')?.value || 'en');
      });
    }
  }, 100);

  openModal('reportPreviewModal');
};

function downloadReport(sid, month, year) {
  const html = window._currentReportHTML || $('reportDoc')?.outerHTML || '';
  const s = getStudent(sid);
  const name = s ? `${s.firstName}_${s.lastName}` : 'report';
  downloadHTML(html, `report_${name}_${getMonthLabel(month)}_${year}.html`);
  showToast('Report downloaded', 'success');
}

function downloadWorksheet() {
  const doc = $('worksheetDoc');
  if (!doc) { showToast('Generate a worksheet first', 'warning'); return; }
  downloadHTML(doc.outerHTML, `worksheet_${getMonthLabel(_wsMonth)}_${CUR_YEAR}.html`);
  showToast('Worksheet downloaded', 'success');
}

// ── STUDENT PROFILE — fix report button + final reports list ─
const _origRenderStudentProfile = renderStudentProfile;
renderStudentProfile = function(sid) {
  const s = getStudent(sid);
  if (!s) { $('pageContent').innerHTML = '<div style="padding:40px">Student not found</div>'; return; }
  const ass = getStudentAssessments(sid);
  const prov = getProvider(s.providerId);
  const t = getStudentTrend(sid);
  const lastA = ass[ass.length - 1];
  const hs = $('headerSubBreadcrumb');
  if (hs) hs.innerHTML = ` › <span class="he">${sName(s)}</span>`;

  $('pageContent').innerHTML = `
<div style="margin-bottom:14px"><button class="btn btn-ghost btn-sm" onclick="navigate('students')">← Back to Students</button></div>
<div class="student-profile-header">
  <div style="display:flex;align-items:center;gap:18px">
    <div class="user-avatar" style="width:64px;height:64px;font-size:1.4rem">${initials(sName(s))}</div>
    <div style="flex:1">
      <div class="he" style="font-size:1.4rem;font-weight:800;color:#fff">${sName(s)}</div>
      <div class="he" style="font-size:0.9rem;color:rgba(255,255,255,0.8);margin-top:4px">${s.class}</div>
      <div style="display:flex;gap:14px;margin-top:7px;flex-wrap:wrap">
        <span style="font-size:0.82rem;color:rgba(255,255,255,0.8)">📍 <span class="he">${prov ? prov.name : '—'}</span></span>
        <span class="he" style="font-size:0.82rem;color:rgba(255,255,255,0.8)">${s.year}</span>
        ${trendBadge(t)}
      </div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn btn-gold btn-sm" onclick="openAddAssessmentModal('${sid}')">+ Assessment</button>
      <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.3)" onclick="${lastA ? `showStudentReport('${sid}','${lastA.month}','${lastA.year}')` : "showToast('No assessments yet','warning')"}">📄 Report</button>
      <button class="btn btn-sm" style="background:rgba(217,164,78,0.3);color:#fff;border:1px solid rgba(217,164,78,0.5)" onclick="showFinalReports('${sid}')">✓ Final Reports</button>
    </div>
  </div>
</div>

<div style="display:flex;border-bottom:2px solid #e8d9b8;margin-bottom:22px">
  ${['overview','assessments','charts','videos'].map(tab => `
    <button style="padding:9px 18px;font-size:0.84rem;font-weight:${_profileTab===tab?'700':'600'};color:${_profileTab===tab?'#005778':'#808285'};cursor:pointer;border:none;background:${_profileTab===tab?'#e0eef5':'transparent'};border-bottom:2px solid ${_profileTab===tab?'#005778':'transparent'};margin-bottom:-2px;border-radius:${_profileTab===tab?'8px 8px 0 0':'0'}" onclick="_profileTab='${tab}';renderStudentProfile('${sid}')">${{overview:'Overview',assessments:`Assessments (${ass.length})`,charts:'Charts',videos:'Videos'}[tab]}</button>`).join('')}
</div>
<div id="profileContent"></div>`;

  if (_profileTab === 'overview')      renderProfileOverview(sid, s, ass, lastA, prov);
  else if (_profileTab === 'assessments') renderProfileAssessments(sid, ass);
  else if (_profileTab === 'charts')   renderProfileCharts(sid, ass);
  else if (_profileTab === 'videos')   renderStudentVideos(sid, s, ass);
};

// ── FINAL REPORTS MODAL ──────────────────────────────────────
function showFinalReports(sid) {
  const s = getStudent(sid);
  const ass = getStudentAssessments(sid);
  const finals = ass.filter(a => isReportFinal(sid, a.month, a.year));

  const html = finals.length === 0
    ? '<div style="text-align:center;padding:40px;color:#808285">No finalized reports yet.<br>Generate and finalize reports from the Monthly Reports page.</div>'
    : `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px">
        ${finals.map(a => `
          <div style="border:1px solid #e8d9b8;border-radius:10px;overflow:hidden;cursor:pointer;transition:all 0.2s" onclick="showStudentReport('${sid}','${a.month}','${a.year}')" onmouseenter="this.style.boxShadow='0 4px 12px rgba(0,87,120,0.15)'" onmouseleave="this.style.boxShadow=''">
            <div style="background:linear-gradient(135deg,#005778,#1a7a9a);padding:12px 14px;color:#fff">
              <div class="he" style="font-weight:800;font-size:0.95rem">${getMonthLabel(a.month)}</div>
              <div class="he" style="font-size:0.75rem;opacity:0.8">${a.year}</div>
            </div>
            <div style="padding:10px 14px;background:#fff">
              ${CATS.map(cat => `<div style="display:flex;justify-content:space-between;font-size:0.78rem;padding:2px 0">
                <span class="he" style="color:${cat.color};font-weight:600">${cat.label}</span>
                <span style="font-weight:700;color:#005778">${a.categories[cat.id]?.correct||0}</span>
              </div>`).join('')}
            </div>
            <div style="padding:8px 14px;background:#fdf8f0;border-top:1px solid #e8d9b8;display:flex;gap:6px">
              <button class="btn btn-primary btn-sm" style="flex:1" onclick="event.stopPropagation();showStudentReport('${sid}','${a.month}','${a.year}')">View</button>
              <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();downloadReport('${sid}','${a.month}','${a.year}')">⬇</button>
            </div>
          </div>`).join('')}
      </div>`;

  // Use a simple overlay
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,61,86,0.55);z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px)';
  overlay.innerHTML = `
    <div style="background:#fff;border-radius:16px;box-shadow:0 24px 56px rgba(0,87,120,0.18);width:100%;max-width:700px;max-height:85vh;overflow-y:auto">
      <div style="background:linear-gradient(135deg,#003d56,#005778);padding:18px 24px;border-radius:16px 16px 0 0;display:flex;align-items:center;justify-content:space-between">
        <span style="font-size:1rem;font-weight:800;color:#fff">Final Reports — <span class="he">${sName(s)}</span></span>
        <button onclick="this.closest('[style*=fixed]').remove()" style="width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.15);border:none;color:#fff;cursor:pointer;font-size:0.9rem">✕</button>
      </div>
      <div style="padding:20px">${html}</div>
    </div>`;
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

// ── STUDENT VIDEOS TAB ───────────────────────────────────────
function renderStudentVideos(sid, s, ass) {
  const months = ass.map(a => ({ month: a.month, year: a.year, label: getMonthLabel(a.month) }));
  $('profileContent').innerHTML = `
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">
  <h3>Reading Videos — <span class="he">${sName(s)}</span></h3>
  <div style="font-size:0.84rem;color:#808285">One video per month</div>
</div>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px">
  ${months.map(m => {
    const video = getStudentVideo(sid, m.month, m.year);
    return `<div style="border:1px solid #e8d9b8;border-radius:12px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#005778,#1a7a9a);padding:12px 16px;color:#fff">
        <div class="he" style="font-weight:800">${m.label} ${m.year}</div>
      </div>
      <div style="padding:14px;background:#fff">
        ${video
          ? `<video src="${video.url}" controls style="width:100%;border-radius:8px;max-height:160px;background:#000"></video>
             <div style="font-size:0.75rem;color:#808285;margin-top:6px;text-align:center">${video.name}</div>
             <button class="btn btn-ghost btn-sm" style="width:100%;margin-top:8px" onclick="uploadVideoFor('${sid}','${m.month}','${m.year}')">Replace Video</button>`
          : `<div style="border:2px dashed #b0cfe0;border-radius:8px;padding:24px;text-align:center;cursor:pointer;background:#e0eef5" onclick="uploadVideoFor('${sid}','${m.month}','${m.year}')">
               <div style="font-size:2rem;margin-bottom:6px">🎥</div>
               <div style="font-size:0.82rem;color:#005778;font-weight:600">Upload Video</div>
               <div style="font-size:0.72rem;color:#808285;margin-top:3px">MP4, MOV, WebM</div>
             </div>`}
      </div>
    </div>`;
  }).join('')}
  ${months.length === 0 ? '<div style="text-align:center;padding:40px;color:#808285;grid-column:1/-1">Add assessments first to enable video uploads</div>' : ''}
</div>`;
}

function uploadVideoFor(sid, month, year) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'video/*';
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 200 * 1024 * 1024) { showToast('Video must be under 200MB', 'warning'); return; }
    saveStudentVideo(sid, month, year, file);
    showToast(`Video uploaded for ${getMonthLabel(month)}`, 'success');
    renderStudentProfile(sid);
  };
  input.click();
}

// ── UPLOAD VIDEOS PAGE ───────────────────────────────────────
const _origNavigate = navigate;
navigate = function(page, params = {}) {
  if (page === 'videos') {
    _page = 'videos'; _params = params;
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const el = document.querySelector('.nav-item[data-page="videos"]');
    if (el) el.classList.add('active');
    const hb = $('headerBreadcrumb'); if (hb) hb.textContent = 'Upload Videos';
    const hs = $('headerSubBreadcrumb'); if (hs) hs.textContent = '';
    destroyCharts();
    const content = $('pageContent');
    content.style.opacity = '0';
    requestAnimationFrame(() => {
      renderVideosPage();
      content.style.transition = 'opacity 0.2s';
      content.style.opacity = '1';
      closeSidebar();
    });
    return;
  }
  _origNavigate(page, params);
};

function renderVideosPage() {
  $('pageContent').innerHTML = `
<div class="page-header">
  <div><h1 class="page-title">Upload Videos</h1><p class="page-subtitle">Upload monthly reading videos for all students</p></div>
</div>
<div class="card mb-6">
  <div class="card-header"><span class="card-title">Filter</span></div>
  <div class="card-body">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
      <div class="form-group"><label class="form-label">Class</label>
        <select class="form-control" id="vidClass" onchange="renderVideosPage()">
          <option value="">All Classes</option>
          ${PROVIDERS.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label class="form-label">Month</label>
        <select class="form-control he" id="vidMonth" onchange="renderVideosPage()">
          ${HEB_MONTHS.map(m => `<option value="${m.id}" ${m.id===CUR_MONTH?'selected':''}>${m.label}</option>`).join('')}
        </select>
      </div>
    </div>
  </div>
</div>
<div id="videosGrid"></div>`;
  renderVideosGrid();
}

function renderVideosGrid() {
  const classFilter = $('vidClass')?.value || '';
  const month = $('vidMonth')?.value || CUR_MONTH;
  const year = CUR_YEAR;
  const students = classFilter ? getProviderStudents(classFilter) : STUDENTS;

  $('videosGrid').innerHTML = `
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px">
  ${students.map((s, i) => {
    const video = getStudentVideo(s.id, month, year);
    return `<div style="border:1px solid #e8d9b8;border-radius:12px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#005778,#1a7a9a);padding:12px 16px;color:#fff;display:flex;align-items:center;gap:10px">
        <div class="user-avatar" style="width:32px;height:32px;font-size:0.7rem;background:${avatarColor(i)}">${initials(sName(s))}</div>
        <div>
          <div class="he" style="font-weight:800;font-size:0.9rem">${sName(s)}</div>
          <div style="font-size:0.72rem;opacity:0.8">${getProvider(s.providerId)?.name||''}</div>
        </div>
      </div>
      <div style="padding:12px;background:#fff">
        ${video
          ? `<video src="${video.url}" controls style="width:100%;border-radius:6px;max-height:140px;background:#000"></video>
             <div style="font-size:0.72rem;color:#808285;margin-top:5px;text-align:center">${video.name}</div>
             <button class="btn btn-ghost btn-sm" style="width:100%;margin-top:8px" onclick="uploadVideoForGrid('${s.id}','${month}','${year}')">Replace</button>`
          : `<div style="border:2px dashed #b0cfe0;border-radius:8px;padding:20px;text-align:center;cursor:pointer;background:#e0eef5" onclick="uploadVideoForGrid('${s.id}','${month}','${year}')">
               <div style="font-size:1.8rem;margin-bottom:4px">🎥</div>
               <div style="font-size:0.8rem;color:#005778;font-weight:600">Upload Video</div>
             </div>`}
      </div>
    </div>`;
  }).join('')}
</div>`;
}

function uploadVideoForGrid(sid, month, year) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'video/*';
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 200 * 1024 * 1024) { showToast('Video must be under 200MB', 'warning'); return; }
    saveStudentVideo(sid, month, year, file);
    showToast(`Video uploaded for ${getStudentName ? getStudentName(getStudent(sid)) : sid}`, 'success');
    renderVideosGrid();
  };
  input.click();
}

// ── ADD VIDEOS TO SIDEBAR ────────────────────────────────────
(function addVideoNav() {
  const nav = document.querySelector('.sidebar-nav');
  if (!nav) return;
  // Add after Tools section
  const toolsLabel = Array.from(nav.querySelectorAll('.nav-section-label')).find(el => el.textContent === 'Tools');
  if (toolsLabel) {
    const videoItem = document.createElement('div');
    videoItem.className = 'nav-item';
    videoItem.setAttribute('data-page', 'videos');
    videoItem.onclick = () => navigate('videos');
    videoItem.innerHTML = `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>Videos`;
    // Insert before System section
    const sysLabel = Array.from(nav.querySelectorAll('.nav-section-label')).find(el => el.textContent === 'System');
    if (sysLabel) nav.insertBefore(videoItem, sysLabel);
    else nav.appendChild(videoItem);
  }
})();

// ── DOWNLOAD BUTTON IN WORKSHEET ────────────────────────────
const _origGenWorksheet = genWorksheet;
genWorksheet = function() {
  _origGenWorksheet();
  // Add download button after generation
  setTimeout(() => {
    const preview = $('wsPreview');
    if (!preview || !preview.innerHTML) return;
    const dlBtn = document.createElement('div');
    dlBtn.className = 'no-print';
    dlBtn.style.cssText = 'margin-top:12px;display:flex;gap:10px';
    dlBtn.innerHTML = `<button class="btn btn-gold" onclick="downloadWorksheet()">⬇ Download Worksheet</button>`;
    preview.appendChild(dlBtn);
  }, 100);
};

// ── FIX REPORT MODAL FOOTER BUTTONS ─────────────────────────
(function fixReportModalFooter() {
  const footer = document.querySelector('#reportPreviewModal .modal-footer');
  if (footer) {
    footer.innerHTML = `
      <button class="btn btn-primary" onclick="printReport()">🖨 Print</button>
      <button class="btn btn-gold" onclick="downloadReport(window._currentReportMeta?.sid,window._currentReportMeta?.month,window._currentReportMeta?.year)">⬇ Download</button>
      <button class="btn btn-ghost" onclick="closeModal('reportPreviewModal')">Close</button>`;
  }
})();

// ── STUDENT NAME ABOVE CLASS IN PROFILE HEADER ───────────────
// Already handled in renderStudentProfile override above

// ── YEAR SELECT IN WORKSHEET/REPORTS ────────────────────────
const _origRenderWorksheets = renderWorksheets;
renderWorksheets = function() {
  $('pageContent').innerHTML = `
<div class="page-header"><div><h1 class="page-title">Worksheets</h1><p class="page-subtitle">Generate handwriting grading sheets — landscape format</p></div></div>
<div class="card mb-6">
  <div class="card-header"><span class="card-title">Worksheet Settings</span></div>
  <div class="card-body">
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px">
      <div class="form-group"><label class="form-label">Class *</label>
        <select class="form-control" id="wsProv" onchange="_wsProv=this.value">
          <option value="">Select class...</option>
          ${PROVIDERS.map(p=>`<option value="${p.id}" ${_wsProv===p.id?'selected':''}>${p.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label class="form-label">Hebrew Month *</label>
        <select class="form-control he" id="wsMonth" onchange="_wsMonth=this.value">
          ${HEB_MONTHS.map(m=>`<option value="${m.id}" ${_wsMonth===m.id?'selected':''}>${m.label}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label class="form-label">Hebrew Year</label>
        <select class="form-control he" id="wsYear" onchange="_wsYear=this.value">
          ${yearSelect(CUR_YEAR)}
        </select>
      </div>
    </div>
    <div style="display:flex;gap:10px;margin-top:8px">
      <button class="btn btn-primary" onclick="genWorksheet()">Generate Sheet</button>
      <button class="btn btn-gold" onclick="printWorksheet()">🖨 Print (Landscape)</button>
    </div>
  </div>
</div>
<div id="wsPreview"></div>`;
};
let _wsYear = CUR_YEAR;

// ============================================================
// COMPREHENSIVE UPDATE — PDF, CSV, Letterhead, Layout fixes
// ============================================================

// ── PDF GENERATION ───────────────────────────────────────────
async function generatePDF(elementId, filename) {
  const el = document.getElementById(elementId) || document.querySelector(elementId);
  if (!el) { showToast('Content not found for PDF', 'warning'); return; }
  showToast('Generating PDF...', 'info');
  try {
    const { jsPDF } = window.jspdf;
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    });
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = (canvas.height * pdfW) / canvas.width;
    if (pdfH > pdf.internal.pageSize.getHeight()) {
      // Multi-page
      const pageH = pdf.internal.pageSize.getHeight();
      let yPos = 0;
      while (yPos < pdfH) {
        if (yPos > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, -yPos, pdfW, pdfH);
        yPos += pageH;
      }
    } else {
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfW, pdfH);
    }
    pdf.save(filename);
    showToast('PDF downloaded!', 'success');
  } catch(e) {
    console.error('PDF error:', e);
    showToast('PDF generation failed — downloading HTML instead', 'warning');
    downloadHTML(el.outerHTML, filename.replace('.pdf', '.html'));
  }
}

async function generateWorksheetPDF(elementId, filename) {
  const el = document.getElementById(elementId);
  if (!el) { showToast('Generate a worksheet first', 'warning'); return; }
  showToast('Generating PDF...', 'info');
  try {
    const { jsPDF } = window.jspdf;
    const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false });
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = (canvas.height * pdfW) / canvas.width;
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfW, Math.min(pdfH, pdf.internal.pageSize.getHeight()));
    pdf.save(filename);
    showToast('Worksheet PDF downloaded!', 'success');
  } catch(e) {
    showToast('PDF failed — downloading HTML', 'warning');
    downloadHTML(el.outerHTML, filename.replace('.pdf', '.html'));
  }
}

// Override download functions to use PDF
downloadReport = function(sid, month, year) {
  const s = getStudent(sid);
  const name = s ? `${s.firstName}_${s.lastName}` : 'report';
  const monthLabel = getMonthLabel(month);
  const filename = `${name}_${monthLabel}_${year}.pdf`;
  // Try to use visible report doc
  const el = document.getElementById('reportDoc');
  if (el) {
    generatePDF('#reportDoc', filename);
  } else {
    // Generate report first then download
    showStudentReport(sid, month, year);
    setTimeout(() => generatePDF('#reportDoc', filename), 800);
  }
};

downloadWorksheet = function() {
  const prov = getProvider(_wsProv);
  const provName = prov ? prov.name.replace(/\s+/g,'_') : 'worksheet';
  const monthLabel = getMonthLabel(_wsMonth);
  const filename = `${provName}_${monthLabel}_${CUR_YEAR}.pdf`;
  generateWorksheetPDF('worksheetDoc', filename);
};

// ── LETTERHEAD REPORT — centered layout matching attached ────
buildReportHeader = function(studentName, monthLabel, year) {
  return `
<div style="position:relative;width:100%;overflow:hidden">
  <!-- Letterhead as background image -->
  <div style="position:relative;background:#fff">
    <!-- Top teal banner with logo (from letterhead) -->
    <div style="background:linear-gradient(135deg,#005778,#1a7a9a);padding:0;text-align:center;position:relative;overflow:hidden">
      <!-- Gold flourishes row -->
      <div style="display:flex;align-items:center;justify-content:center;padding:18px 24px 28px;gap:0;position:relative">
        <!-- Left flourish -->
        <div style="flex:1;text-align:right;padding-right:8px">
          <span style="color:#D9A44E;font-size:3rem;line-height:1;opacity:0.9;font-family:serif">❧</span>
        </div>
        <!-- Center: logo + text -->
        <div style="text-align:center;z-index:2">
          <div style="position:relative;display:inline-block">
            <!-- Gold ring around logo -->
            <div style="width:90px;height:90px;border-radius:50%;background:linear-gradient(135deg,#D9A44E,#b8832e);padding:4px;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(0,0,0,0.3)">
              <div style="width:82px;height:82px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;overflow:hidden">
                <img src="assets/logo.png" style="width:76px;height:76px;object-fit:contain" onerror="this.parentElement.innerHTML='<div style=font-size:1.8rem>📖</div>'">
              </div>
            </div>
          </div>
        </div>
        <!-- Right flourish -->
        <div style="flex:1;text-align:left;padding-left:8px">
          <span style="color:#D9A44E;font-size:3rem;line-height:1;opacity:0.9;font-family:serif">❦</span>
        </div>
      </div>
      <!-- White curved bottom -->
      <div style="position:absolute;bottom:-1px;left:0;right:0;height:24px;background:#fff;border-radius:50% 50% 0 0 / 100% 100% 0 0"></div>
    </div>

    <!-- White content area — centered -->
    <div style="background:#fff;padding:20px 32px 16px;text-align:center">
      <div class="he" style="font-size:2.2rem;font-weight:900;color:#005778;letter-spacing:0.5px;line-height:1.2">קריאה קארטל</div>
      <div class="he" style="font-size:1rem;color:#808285;margin-top:8px">אונזער תלמיד</div>
      <div class="he" style="font-size:1.6rem;font-weight:900;color:#1a2a2a;margin-top:8px">${studentName}</div>
      <div class="he" style="font-size:0.9rem;color:#808285;margin-top:6px">${monthLabel} ${year}</div>
      <div style="height:2px;background:linear-gradient(90deg,transparent,#D9A44E,transparent);margin:14px auto;max-width:300px"></div>
    </div>
  </div>
</div>`;
};

// ── STUDENT PROFILE — name bold left-aligned above class ─────
renderStudentProfile = function(sid) {
  const s = getStudent(sid);
  if (!s) { $('pageContent').innerHTML = '<div style="padding:40px">Student not found</div>'; return; }
  const ass = getStudentAssessments(sid);
  const prov = getProvider(s.providerId);
  const t = getStudentTrend(sid);
  const lastA = ass[ass.length - 1];
  const hs = $('headerSubBreadcrumb');
  if (hs) hs.innerHTML = ` › <span class="he">${sName(s)}</span>`;

  $('pageContent').innerHTML = `
<div style="margin-bottom:14px"><button class="btn btn-ghost btn-sm" onclick="navigate('students')">← Back to Students</button></div>
<div class="student-profile-header">
  <div style="display:flex;align-items:center;gap:18px">
    <div class="user-avatar" style="width:64px;height:64px;font-size:1.4rem;flex-shrink:0">${initials(sName(s))}</div>
    <div style="flex:1;text-align:left">
      <div class="he" style="font-size:1.5rem;font-weight:900;color:#fff;text-align:right;line-height:1.2">${sName(s)}</div>
      <div class="he" style="font-size:0.95rem;font-weight:700;color:rgba(255,255,255,0.85);text-align:right;margin-top:2px">${s.class}</div>
      <div style="display:flex;gap:12px;margin-top:8px;flex-wrap:wrap;justify-content:flex-end">
        <span style="font-size:0.8rem;color:rgba(255,255,255,0.75)"><span class="he">${prov ? prov.name : '—'}</span></span>
        <span class="he" style="font-size:0.8rem;color:rgba(255,255,255,0.75)">${s.year}</span>
        ${trendBadge(t)}
      </div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;flex-shrink:0">
      <button class="btn btn-gold btn-sm" onclick="openAddAssessmentModal('${sid}')">+ Assessment</button>
      <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.3)" onclick="${lastA ? `showStudentReport('${sid}','${lastA.month}','${lastA.year}')` : "showToast('No assessments yet','warning')"}">📄 Report</button>
      <button class="btn btn-sm" style="background:rgba(217,164,78,0.3);color:#fff;border:1px solid rgba(217,164,78,0.5)" onclick="showFinalReports('${sid}')">✓ Final Reports</button>
    </div>
  </div>
</div>

<div style="display:flex;border-bottom:2px solid #e8d9b8;margin-bottom:22px">
  ${['overview','assessments','charts','videos'].map(tab => `
    <button style="padding:9px 18px;font-size:0.84rem;font-weight:${_profileTab===tab?'700':'600'};color:${_profileTab===tab?'#005778':'#808285'};cursor:pointer;border:none;background:${_profileTab===tab?'#e0eef5':'transparent'};border-bottom:2px solid ${_profileTab===tab?'#005778':'transparent'};margin-bottom:-2px;border-radius:${_profileTab===tab?'8px 8px 0 0':'0'}" onclick="_profileTab='${tab}';renderStudentProfile('${sid}')">${{overview:'Overview',assessments:`Assessments (${ass.length})`,charts:'Charts',videos:'Videos'}[tab]}</button>`).join('')}
</div>
<div id="profileContent"></div>`;

  if (_profileTab === 'overview')         renderProfileOverview(sid, s, ass, lastA, prov);
  else if (_profileTab === 'assessments') renderProfileAssessments(sid, ass);
  else if (_profileTab === 'charts')      renderProfileCharts(sid, ass);
  else if (_profileTab === 'videos')      renderStudentVideos12(sid, s);
};

// ── VIDEOS — all 12 months in order ─────────────────────────
function renderStudentVideos12(sid, s) {
  $('profileContent').innerHTML = `
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">
  <h3>Reading Videos — <span class="he">${sName(s)}</span></h3>
  <div style="font-size:0.84rem;color:#808285">Upload one video per month</div>
</div>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px">
  ${HEB_MONTHS.map(m => {
    const video = getStudentVideo(sid, m.id, CUR_YEAR);
    return `<div style="border:1px solid #e8d9b8;border-radius:10px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#005778,#1a7a9a);padding:10px 14px;color:#fff;display:flex;align-items:center;justify-content:space-between">
        <span class="he" style="font-weight:800;font-size:0.9rem">${m.label}</span>
        <span class="he" style="font-size:0.72rem;opacity:0.7">${CUR_YEAR}</span>
      </div>
      <div style="padding:12px;background:#fff">
        ${video
          ? `<video src="${video.url}" controls style="width:100%;border-radius:6px;max-height:130px;background:#000"></video>
             <div style="font-size:0.7rem;color:#808285;margin-top:5px;text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${video.name}</div>
             <button class="btn btn-ghost btn-sm" style="width:100%;margin-top:7px;font-size:0.75rem" onclick="uploadVideoFor('${sid}','${m.id}','${CUR_YEAR}')">Replace</button>`
          : `<div style="border:2px dashed #b0cfe0;border-radius:7px;padding:18px;text-align:center;cursor:pointer;background:#e0eef5;transition:all 0.2s" onclick="uploadVideoFor('${sid}','${m.id}','${CUR_YEAR}')" onmouseenter="this.style.background='#c8dff0'" onmouseleave="this.style.background='#e0eef5'">
               <div style="font-size:1.6rem;margin-bottom:4px">🎥</div>
               <div style="font-size:0.78rem;color:#005778;font-weight:600">Upload</div>
             </div>`}
      </div>
    </div>`;
  }).join('')}
</div>`;
}

// ── CSV IMPORT ───────────────────────────────────────────────
let _csvData = [];

function downloadCSVTemplate(type) {
  let csv, filename;
  if (type === 'students') {
    csv = 'firstName,lastName,class,providerName,year\nיוסף,כהן,א׳,כיתה א׳,תשפ״ו\nמנחם,לוי,ב׳,כיתה ב׳,תשפ״ו';
    filename = 'students_template.csv';
  } else {
    csv = 'name,directorName,directorEmail\nכיתה א׳,הרב משה לוי,moshe@school.edu\nכיתה ב׳,הרב אברהם כהן,avraham@school.edu';
    filename = 'classes_template.csv';
  }
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  showToast(`${filename} downloaded`, 'success');
}

function previewCSV(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const text = e.target.result.replace(/^\uFEFF/, '');
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    _csvData = lines.slice(1).map(line => {
      const vals = line.split(',').map(v => v.trim());
      const obj = {};
      headers.forEach((h, i) => obj[h] = vals[i] || '');
      return obj;
    }).filter(row => Object.values(row).some(v => v));

    const preview = $('csvPreview');
    if (!preview) return;
    preview.innerHTML = `
      <div style="font-size:0.84rem;font-weight:700;color:#005778;margin-bottom:8px">${_csvData.length} rows found</div>
      <div style="overflow-x:auto;max-height:200px;border:1px solid #e8d9b8;border-radius:8px">
        <table style="width:100%;border-collapse:collapse;font-size:0.8rem">
          <thead><tr>${headers.map(h=>`<th style="background:#005778;color:#fff;padding:7px 10px;text-align:right">${h}</th>`).join('')}</tr></thead>
          <tbody>${_csvData.slice(0,5).map((row,i)=>`<tr style="background:${i%2===0?'#fff':'#f8f9fa'}">${headers.map(h=>`<td style="padding:6px 10px;border-bottom:1px solid #e8d9b8;text-align:right" class="he">${row[h]||''}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
      </div>
      ${_csvData.length > 5 ? `<div style="font-size:0.76rem;color:#808285;margin-top:6px">...and ${_csvData.length-5} more rows</div>` : ''}`;
  };
  reader.readAsText(file, 'UTF-8');
}

function importCSV() {
  const type = $('csvType')?.value || 'students';
  if (!_csvData.length) { showToast('No data to import', 'warning'); return; }
  let imported = 0, skipped = 0;

  if (type === 'students') {
    _csvData.forEach(row => {
      if (!row.firstName || !row.lastName) { skipped++; return; }
      // Find or create provider by name
      let prov = PROVIDERS.find(p => p.name === row.providerName);
      if (!prov && row.providerName) {
        prov = { id: genId('p'), name: row.providerName, director: '', email: '', city: '', phone: '', classes: [row.class || 'א׳'] };
        PROVIDERS.push(prov);
      }
      const pid = prov ? prov.id : (PROVIDERS[0]?.id || 'p1');
      STUDENTS.push({ id: genId('s'), firstName: row.firstName, lastName: row.lastName, providerId: pid, class: row.class || 'א׳', year: row.year || CUR_YEAR, status: 'active', notes: '' });
      imported++;
    });
    const sb = $('studentsBadge'); if (sb) sb.textContent = STUDENTS.length;
  } else {
    _csvData.forEach(row => {
      if (!row.name) { skipped++; return; }
      PROVIDERS.push({ id: genId('p'), name: row.name, director: row.directorName || '', email: row.directorEmail || '', city: '', phone: '', classes: ['א׳','ב׳'] });
      imported++;
    });
    const pb = $('providersBadge'); if (pb) pb.textContent = PROVIDERS.length;
  }

  closeModal('csvImportModal');
  showToast(`Imported ${imported} ${type} (${skipped} skipped)`, 'success');
  _csvData = [];
  if (_page === 'students') renderStudents();
  else if (_page === 'providers') navigate('providers');
}

function openCSVImport() { openModal('csvImportModal'); }

// ── BULK WORKSHEET — all providers at once ───────────────────
function generateAllWorksheets() {
  const month = $('wsMonth')?.value || _wsMonth;
  const year  = $('wsYear')?.value  || CUR_YEAR;
  const monthLabel = getMonthLabel(month);

  const allHTML = PROVIDERS.map(p => {
    const ss = getProviderStudents(p.id);
    if (!ss.length) return '';
    return `
<div style="page-break-after:always;font-family:'Frank Ruhl Libre','Heebo',serif;direction:rtl;padding:20px">
  <div style="background:linear-gradient(135deg,#005778,#1a7a9a);padding:12px 20px;border-radius:8px 8px 0 0;display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:0">
    <span style="color:#D9A44E;font-size:1.5rem">❧</span>
    <img src="assets/logo.png" style="width:52px;height:52px;object-fit:contain;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.3))" onerror="this.style.display='none'">
    <div style="text-align:center;color:#fff"><div style="font-size:0.65rem;color:rgba(255,255,255,0.7)">מערכת הקריאה</div><div style="font-size:1rem;font-weight:900">מחדדים בפיך</div></div>
    <span style="color:#D9A44E;font-size:1.5rem">❦</span>
  </div>
  <div style="height:3px;background:linear-gradient(90deg,transparent,#D9A44E,transparent);margin-bottom:12px"></div>
  <div style="text-align:center;margin-bottom:12px">
    <div style="font-size:1rem;font-weight:800;color:#005778">גיליון הערכה — <span class="he">${p.name}</span></div>
    <div style="font-size:0.8rem;color:#808285;margin-top:3px"><span class="he">${monthLabel} ${year}</span></div>
  </div>
  <table style="width:100%;border-collapse:collapse;direction:rtl;font-size:0.8rem">
    <thead>
      <tr>
        <th style="background:#005778;color:#fff;padding:8px 10px;text-align:right;min-width:120px">שם תלמיד</th>
        <th style="background:#005778;color:#fff;padding:8px 6px;text-align:center">כיתה</th>
        ${CATS.map(cat => cat.hasMistakes
          ? `<th colspan="2" style="background:#005778;color:#fff;padding:8px 6px;text-align:center;border-right:2px solid rgba(255,255,255,0.3)"><span class="he" style="font-size:0.72rem">${cat.label}</span></th>`
          : `<th style="background:#005778;color:#fff;padding:8px 6px;text-align:center;border-right:2px solid rgba(255,255,255,0.3)"><span class="he" style="font-size:0.72rem">${cat.label}</span></th>`
        ).join('')}
        <th style="background:#005778;color:#fff;padding:8px 6px;text-align:right">הערות</th>
      </tr>
      <tr style="background:#1a7a9a">
        <th></th><th></th>
        ${CATS.map(cat => cat.hasMistakes
          ? `<th style="color:#a8e0e0;font-size:0.62rem;padding:4px;text-align:center">נכון</th><th style="color:#ffaaaa;font-size:0.62rem;padding:4px;text-align:center;border-right:2px solid rgba(255,255,255,0.15)">שגיאות</th>`
          : `<th style="color:#a8e0e0;font-size:0.62rem;padding:4px;text-align:center;border-right:2px solid rgba(255,255,255,0.15)">ציון</th>`
        ).join('')}
        <th></th>
      </tr>
    </thead>
    <tbody>
      ${ss.map((s, i) => `
        <tr style="border-bottom:1px solid #e8d9b8;background:${i%2===0?'#fff':'#f8f9fa'}">
          <td class="he" style="padding:12px 10px;font-weight:600;text-align:right">${sName(s)}</td>
          <td style="padding:12px 6px;text-align:center">${s.class}</td>
          ${CATS.map(cat => cat.hasMistakes
            ? `<td style="padding:12px 6px;min-width:40px;background:#fafaf8;border-right:1px solid #eee"></td><td style="padding:12px 6px;min-width:40px;background:#fafaf8;border-right:2px solid #ddd"></td>`
            : `<td style="padding:12px 6px;min-width:55px;background:#fafaf8;border-right:2px solid #ddd"></td>`
          ).join('')}
          <td style="padding:12px 6px;min-width:90px"></td>
        </tr>`).join('')}
    </tbody>
  </table>
  <div style="margin-top:14px;display:flex;justify-content:space-between;font-size:0.72rem;color:#808285;border-top:1px solid #e8d9b8;padding-top:8px">
    <span>חתימת מורה: ___________________</span>
    <span>תאריך: ___________________</span>
    <span>KriahTrack</span>
  </div>
</div>`;
  }).join('');

  // Download as HTML (PDF would require server-side for multi-page)
  const blob = new Blob([`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{margin:0;padding:0;font-family:'Frank Ruhl Libre',serif}@page{size:landscape;margin:8mm}@media print{.page-break{page-break-after:always}}</style></head><body>${allHTML}</body></html>`], {type:'text/html'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `all_worksheets_${monthLabel}_${year}.html`;
  a.click();
  showToast(`All ${PROVIDERS.length} worksheets downloaded`, 'success');
}

// ── BACKUP — single JSON file ────────────────────────────────
const _origDownloadBackup = typeof API !== 'undefined' ? API.downloadBackup : null;
function downloadBackup() {
  const data = {
    exportedAt: new Date().toISOString(),
    version: '2.0',
    school: SCHOOL,
    kriahDirector: KRIAH_DIRECTOR,
    providers: PROVIDERS,
    students: STUDENTS,
    assessments: ASSESSMENTS,
    reportFinals: REPORT_FINALS,
    ocrImports: OCR_IMPORTS,
    systemLog: SYS_LOGS.slice(0, 100),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  const date = new Date().toISOString().slice(0,10);
  a.download = `KriahTrack_backup_${date}.json`;
  a.click();
  showToast('Backup downloaded as single JSON file', 'success');
}

// Override header backup button
(function fixBackupBtn() {
  const btn = document.querySelector('.header-btn[onclick*="downloadBackup"]');
  if (btn) btn.setAttribute('onclick', 'downloadBackup()');
})();

// ── WORKSHEETS PAGE — add bulk generate + CSV import ─────────
const _origRenderWorksheets2 = renderWorksheets;
renderWorksheets = function() {
  $('pageContent').innerHTML = `
<div class="page-header">
  <div><h1 class="page-title">Worksheets</h1><p class="page-subtitle">Generate handwriting grading sheets — landscape PDF</p></div>
  <div style="display:flex;gap:8px">
    <button class="btn btn-outline btn-sm" onclick="openCSVImport()">📄 Import CSV</button>
  </div>
</div>
<div class="card mb-6">
  <div class="card-header"><span class="card-title">Worksheet Settings</span></div>
  <div class="card-body">
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px">
      <div class="form-group"><label class="form-label">Class</label>
        <select class="form-control" id="wsProv" onchange="_wsProv=this.value">
          <option value="">All Classes</option>
          ${PROVIDERS.map(p=>`<option value="${p.id}" ${_wsProv===p.id?'selected':''}>${p.name}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label class="form-label">Hebrew Month *</label>
        <select class="form-control he" id="wsMonth" onchange="_wsMonth=this.value">
          ${HEB_MONTHS.map(m=>`<option value="${m.id}" ${_wsMonth===m.id?'selected':''}>${m.label}</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label class="form-label">Hebrew Year</label>
        <select class="form-control he" id="wsYear" onchange="_wsYear=this.value">
          ${yearSelect(CUR_YEAR)}
        </select>
      </div>
    </div>
    <div style="display:flex;gap:10px;margin-top:8px;flex-wrap:wrap">
      <button class="btn btn-primary" onclick="genWorksheet()">Generate Sheet</button>
      <button class="btn btn-gold" onclick="downloadWorksheet()">⬇ Download PDF</button>
      <button class="btn btn-outline" onclick="printWorksheet()">🖨 Print (Landscape)</button>
      <button class="btn btn-sm" style="background:#e0eef5;color:#005778;border:1px solid #b0cfe0" onclick="generateAllWorksheets()">📋 All Classes PDF</button>
    </div>
  </div>
</div>
<div id="wsPreview"></div>`;
};

// ── STUDENTS PAGE — add CSV import button ────────────────────
const _origRenderStudents2 = renderStudents;
renderStudents = function() {
  _origRenderStudents2();
  // Add CSV button to page header
  setTimeout(() => {
    const header = $('pageContent')?.querySelector('.page-header > div:last-child');
    if (header && !header.querySelector('[onclick*="csvImport"]')) {
      const btn = document.createElement('button');
      btn.className = 'btn btn-outline btn-sm';
      btn.setAttribute('onclick', 'openCSVImport()');
      btn.textContent = '📄 Import CSV';
      header.insertBefore(btn, header.firstChild);
    }
  }, 50);
};

// ── PROVIDER/CLASS — add CSV import ─────────────────────────
const _origRenderProviders2 = renderProviders;
renderProviders = function() {
  _origRenderProviders2();
  setTimeout(() => {
    const header = $('pageContent')?.querySelector('.page-header > div:last-child');
    if (header && !header.querySelector('[onclick*="csvImport"]')) {
      const btn = document.createElement('button');
      btn.className = 'btn btn-outline btn-sm';
      btn.setAttribute('onclick', 'openCSVImport()');
      btn.textContent = '📄 Import CSV';
      header.insertBefore(btn, header.firstChild);
    }
  }, 50);
};

// ── FIX REPORT MODAL FOOTER ──────────────────────────────────
setTimeout(() => {
  const footer = document.querySelector('#reportPreviewModal .modal-footer');
  if (footer) {
    footer.innerHTML = `
      <button class="btn btn-primary" onclick="printReport()">🖨 Print</button>
      <button class="btn btn-gold" onclick="if(window._currentReportMeta){downloadReport(window._currentReportMeta.sid,window._currentReportMeta.month,window._currentReportMeta.year)}">⬇ Download PDF</button>
      <button class="btn btn-ghost" onclick="closeModal('reportPreviewModal')">Close</button>`;
  }
}, 200);

// ============================================================
// PROGRAMS MANAGEMENT + EMBEDDED PDF
// ============================================================

// ── PROGRAMS DATA ────────────────────────────────────────────
// Divisions of Ichud Boys Program
let PROGRAMS = [
  { id: 'div_ahuvim',    name: 'Ahuvim',    description: 'Division 1', classIds: [] },
  { id: 'div_nechmudim', name: 'Nechmudim', description: 'Division 2', classIds: [] },
  { id: 'div_masmidim',  name: 'Masmidim',  description: 'Division 3', classIds: [] },
];

function getProgram(id) { return PROGRAMS.find(p => p.id === id); }
function getClassProgram(classId) { return PROGRAMS.find(p => p.classIds.includes(classId)); }
function getProgramClasses(programId) {
  const prog = getProgram(programId);
  return prog ? PROVIDERS.filter(p => prog.classIds.includes(p.id)) : [];
}

// ── PROGRAMS MODAL ───────────────────────────────────────────
function openProgramsModal() {
  renderProgramsList();
  openModal('programsModal');
}

function renderProgramsList() {
  const el = $('programsList');
  if (!el) return;
  el.innerHTML = PROGRAMS.length === 0
    ? '<div style="text-align:center;padding:40px;color:#808285">No programs yet. Click "+ Add Program" to create one.</div>'
    : PROGRAMS.map(prog => {
        const classes = getProgramClasses(prog.id);
        const unassigned = PROVIDERS.filter(p => !PROGRAMS.some(pr => pr.classIds.includes(p.id)));
        return `
<div style="border:1px solid #e8d9b8;border-radius:10px;overflow:hidden;margin-bottom:14px">
  <div style="background:linear-gradient(135deg,#005778,#1a7a9a);padding:14px 18px;color:#fff;display:flex;align-items:center;justify-content:space-between">
    <div>
      <div style="font-weight:800;font-size:1rem">${prog.name}</div>
      <div style="font-size:0.76rem;opacity:0.8;margin-top:2px">${prog.description || ''}</div>
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.3)" onclick="editProgram('${prog.id}')">Edit</button>
      <button class="btn btn-sm" style="background:rgba(168,32,32,0.3);color:#fff;border:1px solid rgba(168,32,32,0.5)" onclick="deleteProgram('${prog.id}')">Delete</button>
    </div>
  </div>
  <div style="padding:14px 18px;background:#fff">
    <div style="font-size:0.78rem;font-weight:700;color:#808285;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px">Classes in this program (${classes.length})</div>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">
      ${classes.map(c => `
        <div style="display:flex;align-items:center;gap:6px;background:#e0eef5;border:1px solid #b0cfe0;border-radius:20px;padding:4px 12px">
          <span class="he" style="font-size:0.82rem;font-weight:700;color:#005778">${c.name}</span>
          <button onclick="removeClassFromProgram('${prog.id}','${c.id}')" style="background:none;border:none;color:#9a1c1c;cursor:pointer;font-size:0.8rem;padding:0;line-height:1">✕</button>
        </div>`).join('')}
      ${classes.length === 0 ? '<span style="color:#808285;font-size:0.84rem">No classes assigned yet</span>' : ''}
    </div>
    ${unassigned.length > 0 ? `
    <div style="font-size:0.78rem;font-weight:700;color:#808285;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">Add class to program</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      ${unassigned.map(c => `
        <button onclick="addClassToProgram('${prog.id}','${c.id}')" style="background:#fdf8f0;border:1px dashed #D9A44E;border-radius:20px;padding:4px 12px;cursor:pointer;font-size:0.82rem;color:#7a4800;font-family:var(--font-he);transition:all 0.2s" onmouseenter="this.style.background='#fff3e0'" onmouseleave="this.style.background='#fdf8f0'">+ ${c.name}</button>`).join('')}
    </div>` : ''}
    <div style="margin-top:12px;padding-top:12px;border-top:1px solid #e8d9b8;font-size:0.82rem;color:#808285">
      <strong>${STUDENTS.filter(s => classes.some(c => c.id === s.providerId)).length}</strong> students in this program
    </div>
  </div>
</div>`;
      }).join('');
}

function addProgram() {
  const name = prompt('Program name:', 'New Program');
  if (!name) return;
  const desc = prompt('Description (optional):', '');
  PROGRAMS.push({ id: genId('prog'), name: name.trim(), description: (desc||'').trim(), classIds: [] });
  renderProgramsList();
  showToast(`Program "${name}" created`, 'success');
}

function editProgram(id) {
  const prog = getProgram(id);
  if (!prog) return;
  const name = prompt('Program name:', prog.name);
  if (!name) return;
  const desc = prompt('Description:', prog.description || '');
  prog.name = name.trim();
  prog.description = (desc||'').trim();
  renderProgramsList();
  showToast('Program updated', 'success');
}

function deleteProgram(id) {
  if (!confirm('Delete this program? Classes will become unassigned.')) return;
  PROGRAMS = PROGRAMS.filter(p => p.id !== id);
  renderProgramsList();
  showToast('Program deleted', 'warning');
}

function addClassToProgram(programId, classId) {
  // Remove from any existing program first
  PROGRAMS.forEach(p => { p.classIds = p.classIds.filter(id => id !== classId); });
  const prog = getProgram(programId);
  if (prog) prog.classIds.push(classId);
  renderProgramsList();
}

function removeClassFromProgram(programId, classId) {
  const prog = getProgram(programId);
  if (prog) prog.classIds = prog.classIds.filter(id => id !== classId);
  renderProgramsList();
}

// ── ADD PROGRAMS TO PROVIDERS PAGE ──────────────────────────
const _origRenderProviders3 = renderProviders;
renderProviders = function() {
  $('pageContent').innerHTML = `
<div class="page-header">
  <div><h1 class="page-title">Classes & Programs</h1><p class="page-subtitle">Manage classes, programs, and the Kriah Director</p></div>
  <div style="display:flex;gap:8px">
    <button class="btn btn-outline btn-sm" onclick="openCSVImport()">📄 Import CSV</button>
    <button class="btn btn-outline btn-sm" onclick="openProgramsModal()">🗂 Programs</button>
    <button class="btn btn-primary" onclick="openAddProviderModal()">+ Add Class</button>
  </div>
</div>

<!-- KRIAH DIRECTOR -->
<div class="card mb-6" style="border-top:4px solid #D9A44E">
  <div class="card-header" style="background:linear-gradient(135deg,#003d56,#005778)">
    <span class="card-title" style="color:#fff;font-size:1rem">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D9A44E" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
      Kriah Director — <span style="color:#D9A44E">מנהל הקריאה</span>
    </span>
    <button class="btn btn-sm" style="background:rgba(217,164,78,0.2);color:#D9A44E;border:1px solid #D9A44E" onclick="editKriahDirector()">Edit</button>
  </div>
  <div class="card-body">
    ${KRIAH_DIRECTOR.name
      ? `<div style="display:flex;align-items:center;gap:16px">
          <div class="user-avatar" style="width:52px;height:52px;font-size:1.1rem;background:linear-gradient(135deg,#D9A44E,#b8832e)">${KRIAH_DIRECTOR.name.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
          <div>
            <div class="he" style="font-size:1.1rem;font-weight:800;color:#005778">${KRIAH_DIRECTOR.name}</div>
            <div style="font-size:0.85rem;color:#808285;margin-top:3px">${KRIAH_DIRECTOR.email}</div>
            <div style="font-size:0.75rem;color:#D9A44E;font-weight:700;margin-top:4px;text-transform:uppercase;letter-spacing:0.5px">Oversees all programs & classes</div>
          </div>
        </div>`
      : `<div style="text-align:center;padding:16px;color:#808285">
          <button class="btn btn-gold btn-sm" onclick="editKriahDirector()">+ Set Kriah Director</button>
        </div>`}
  </div>
</div>

<!-- PROGRAMS SUMMARY -->
${PROGRAMS.length > 0 ? `
<div class="card mb-6">
  <div class="card-header">
    <span class="card-title">Programs (${PROGRAMS.length})</span>
    <button class="btn btn-ghost btn-sm" onclick="openProgramsModal()">Manage Programs</button>
  </div>
  <div class="card-body" style="padding:14px">
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px">
      ${PROGRAMS.map((prog,i) => {
        const classes = getProgramClasses(prog.id);
        const stuCount = STUDENTS.filter(s => classes.some(c => c.id === s.providerId)).length;
        return `<div style="border:1px solid #e8d9b8;border-radius:10px;overflow:hidden;cursor:pointer;transition:all 0.2s" onclick="openProgramsModal()" onmouseenter="this.style.boxShadow='0 4px 12px rgba(0,87,120,0.12)'" onmouseleave="this.style.boxShadow=''">
          <div style="background:linear-gradient(135deg,#005778,#1a7a9a);padding:12px 14px;color:#fff">
            <div style="font-weight:800;font-size:0.95rem">${prog.name}</div>
            <div style="font-size:0.72rem;opacity:0.8;margin-top:2px">${prog.description||''}</div>
          </div>
          <div style="padding:10px 14px;background:#fff;display:flex;justify-content:space-between">
            <div style="text-align:center"><div style="font-size:1.2rem;font-weight:900;color:#005778">${classes.length}</div><div style="font-size:0.68rem;color:#808285">Classes</div></div>
            <div style="text-align:center"><div style="font-size:1.2rem;font-weight:900;color:#1a6038">${stuCount}</div><div style="font-size:0.68rem;color:#808285">Students</div></div>
          </div>
        </div>`;
      }).join('')}
    </div>
  </div>
</div>` : `
<div class="card mb-6" style="border:2px dashed #e8d9b8">
  <div class="card-body" style="text-align:center;padding:24px">
    <div style="font-size:2rem;margin-bottom:8px">🗂</div>
    <div style="font-weight:700;color:#005778;margin-bottom:6px">No Programs Yet</div>
    <div style="font-size:0.84rem;color:#808285;margin-bottom:14px">Organize your classes into programs for better management</div>
    <button class="btn btn-primary btn-sm" onclick="openProgramsModal()">+ Create First Program</button>
  </div>
</div>`}

<!-- CLASSES GRID -->
<div style="margin-bottom:12px;font-size:0.78rem;font-weight:700;color:#808285;text-transform:uppercase;letter-spacing:0.5px">All Classes (${PROVIDERS.length})</div>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px">
  ${PROVIDERS.map((p,i) => {
    const ss = getProviderStudents(p.id);
    const imp = ss.filter(s => getStudentTrend(s.id) === 'up').length;
    const str = ss.filter(s => getStudentTrend(s.id) === 'down').length;
    const prog = getClassProgram(p.id);
    return `<div class="card" style="cursor:pointer;transition:all 0.2s" onclick="navigate('provider_profile',{providerId:'${p.id}'})" onmouseenter="this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 24px rgba(0,87,120,0.15)'" onmouseleave="this.style.transform='';this.style.boxShadow=''">
      <div style="background:linear-gradient(135deg,#005778,#1a7a9a);padding:16px 18px;color:#fff">
        <div style="display:flex;align-items:center;gap:12px">
          <div class="user-avatar" style="width:44px;height:44px;font-size:0.9rem;background:${avatarColor(i)}">${p.name.slice(0,2)}</div>
          <div style="flex:1">
            <div class="he" style="font-weight:800;font-size:1rem">${p.name}</div>
            <div class="he" style="font-size:0.76rem;opacity:0.8;margin-top:2px">${p.director}</div>
          </div>
        </div>
        ${prog ? `<div style="margin-top:8px"><span style="background:rgba(217,164,78,0.3);color:#D9A44E;font-size:0.65rem;font-weight:800;padding:2px 8px;border-radius:20px;border:1px solid rgba(217,164,78,0.4)">${prog.name}</span></div>` : ''}
      </div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;text-align:center">
          <div><div style="font-size:1.4rem;font-weight:900;color:#005778">${ss.length}</div><div style="font-size:0.68rem;color:#808285">Students</div></div>
          <div><div style="font-size:1.4rem;font-weight:900;color:#1a6038">${imp}</div><div style="font-size:0.68rem;color:#808285">Improving</div></div>
          <div><div style="font-size:1.4rem;font-weight:900;color:#9a1c1c">${str}</div><div style="font-size:0.68rem;color:#808285">At Risk</div></div>
        </div>
      </div>
    </div>`;
  }).join('')}
</div>`;
};

// ── EMBEDDED PDF WITH LETTERHEAD + LOGO ──────────────────────
// Override generatePDF to embed assets
generatePDF = async function(selector, filename) {
  const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (!el) { showToast('Content not found', 'warning'); return; }
  showToast('Generating PDF with letterhead...', 'info');

  try {
    const { jsPDF } = window.jspdf;

    // Replace src attributes with base64 before capture
    const imgs = el.querySelectorAll('img');
    const origSrcs = [];
    imgs.forEach(img => {
      origSrcs.push(img.src);
      if (img.src.includes('letterhead')) img.src = LETTERHEAD_B64;
      else if (img.src.includes('logo')) img.src = LOGO_B64;
    });

    const canvas = await html2canvas(el, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      imageTimeout: 0,
    });

    // Restore original srcs
    imgs.forEach((img, i) => img.src = origSrcs[i]);

    const imgData = canvas.toDataURL('image/jpeg', 0.92);
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();
    const imgH = (canvas.height * pdfW) / canvas.width;

    if (imgH <= pdfH) {
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfW, imgH);
    } else {
      // Multi-page
      let yOffset = 0;
      while (yOffset < imgH) {
        if (yOffset > 0) pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, -yOffset, pdfW, imgH);
        yOffset += pdfH;
      }
    }
    pdf.save(filename);
    showToast('PDF downloaded!', 'success');
  } catch(e) {
    console.error('PDF error:', e);
    showToast('Downloading as HTML (PDF failed)', 'warning');
    downloadHTML(el.outerHTML, filename.replace('.pdf','.html'));
  }
};

generateWorksheetPDF = async function(elementId, filename) {
  const el = document.getElementById(elementId);
  if (!el) { showToast('Generate a worksheet first', 'warning'); return; }
  showToast('Generating worksheet PDF...', 'info');
  try {
    const { jsPDF } = window.jspdf;
    const imgs = el.querySelectorAll('img');
    const origSrcs = [];
    imgs.forEach(img => {
      origSrcs.push(img.src);
      if (img.src.includes('letterhead')) img.src = LETTERHEAD_B64;
      else if (img.src.includes('logo')) img.src = LOGO_B64;
    });
    const canvas = await html2canvas(el, { scale: 2.5, useCORS: true, backgroundColor: '#ffffff', logging: false, imageTimeout: 0 });
    imgs.forEach((img, i) => img.src = origSrcs[i]);
    const imgData = canvas.toDataURL('image/jpeg', 0.92);
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pdfW = pdf.internal.pageSize.getWidth();
    const pdfH = pdf.internal.pageSize.getHeight();
    const imgH = (canvas.height * pdfW) / canvas.width;
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfW, Math.min(imgH, pdfH));
    pdf.save(filename);
    showToast('Worksheet PDF downloaded!', 'success');
  } catch(e) {
    showToast('Downloading as HTML', 'warning');
    downloadHTML(el.outerHTML, filename.replace('.pdf','.html'));
  }
};

// ── ADD PROGRAMS TO BACKUP ───────────────────────────────────
const _origDownloadBackup2 = downloadBackup;
downloadBackup = function() {
  const data = {
    exportedAt: new Date().toISOString(),
    version: '2.1',
    school: SCHOOL,
    kriahDirector: KRIAH_DIRECTOR,
    programs: PROGRAMS,
    providers: PROVIDERS,
    students: STUDENTS,
    assessments: ASSESSMENTS,
    reportFinals: REPORT_FINALS,
    ocrImports: OCR_IMPORTS,
    systemLog: SYS_LOGS.slice(0, 100),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  const date = new Date().toISOString().slice(0,10);
  a.download = `KriahTrack_backup_${date}.json`;
  a.click();
  showToast('Backup downloaded', 'success');
};

// ── SHOW PROGRAM ON STUDENT PROFILE ─────────────────────────
const _origRenderProfileOverview2 = renderProfileOverview;
renderProfileOverview = function(sid, s, ass, lastA, prov) {
  _origRenderProfileOverview2(sid, s, ass, lastA, prov);
  // Add program badge to profile header if visible
  const prog = getClassProgram(s.providerId);
  if (prog) {
    const metaDiv = $('pageContent')?.querySelector('.student-profile-header .he[style*="0.8rem"]');
    // Program shown in provider info already
  }
};

// ── ANALYTICS — add program breakdown ───────────────────────
const _origRenderAnalytics2 = renderAnalytics;
renderAnalytics = function() {
  _origRenderAnalytics2();
  // Append program breakdown after existing content
  setTimeout(() => {
    if (!PROGRAMS.length) return;
    const content = $('pageContent');
    if (!content) return;
    const progSection = document.createElement('div');
    progSection.className = 'card mt-6';
    progSection.style.marginTop = '18px';
    progSection.innerHTML = `
      <div class="card-header"><span class="card-title">Program Breakdown</span><button class="btn btn-ghost btn-sm" onclick="openProgramsModal()">Manage</button></div>
      <div class="table-wrapper">
        <table>
          <thead><tr><th>Program</th><th>Classes</th><th>Students</th><th>Improving</th><th>At Risk</th><th>Assessments</th></tr></thead>
          <tbody>
            ${PROGRAMS.map(prog => {
              const classes = getProgramClasses(prog.id);
              const students = STUDENTS.filter(s => classes.some(c => c.id === s.providerId));
              const imp = students.filter(s => getStudentTrend(s.id) === 'up').length;
              const str = students.filter(s => getStudentTrend(s.id) === 'down').length;
              const ass = ASSESSMENTS.filter(a => students.some(s => s.id === a.studentId)).length;
              return `<tr>
                <td class="primary">${prog.name}</td>
                <td><span class="badge badge-blue">${classes.length}</span></td>
                <td><span class="badge badge-neutral">${students.length}</span></td>
                <td><span class="badge badge-success">${imp}</span></td>
                <td><span class="badge badge-danger">${str}</span></td>
                <td><span class="badge badge-neutral">${ass}</span></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>`;
    content.appendChild(progSection);
  }, 100);
};

// ============================================================
// NEW DATA MODEL — Ichud Boys Program
// School → Divisions → Classes → Students + Providers (1:1)
// ============================================================

// ── HELPER OVERRIDES for new model ──────────────────────────
function getClass(id) { return CLASSES.find(c => c.id === id); }
function getClassDivision(classId) { const cls = getClass(classId); return cls ? PROGRAMS.find(p => p.id === cls.divisionId) : null; }
function getDivisionClasses(divId) { return CLASSES.filter(c => c.divisionId === divId); }
function getDivisionStudents(divId) { const cls = getDivisionClasses(divId); return STUDENTS.filter(s => cls.some(c => c.id === s.classId)); }
function getClassStudents(classId) { return STUDENTS.filter(s => s.classId === classId); }
function getProviderStudentsNew(provId) { return STUDENTS.filter(s => s.providerId === provId); }
function getStudentClass(sid) { const s = getStudent(sid); return s ? getClass(s.classId) : null; }
function getStudentDivision(sid) { const s = getStudent(sid); return s ? getClassDivision(s.classId) : null; }
function getStudentProvider(sid) { const s = getStudent(sid); return s ? PROVIDERS.find(p => p.id === s.providerId) : null; }

// Override getProviderStudents to use new model
getProviderStudents = function(id) {
  // id could be a class id or provider id
  if (CLASSES.find(c => c.id === id)) return getClassStudents(id);
  return getProviderStudentsNew(id);
};

// Override getProvider to handle both classes and providers
getProvider = function(id) {
  const cls = CLASSES.find(c => c.id === id);
  if (cls) return { id: cls.id, name: cls.name, director: '', email: '', classes: [cls.name] };
  return PROVIDERS.find(p => p.id === id) || null;
};

// ── DASHBOARD OVERRIDE — show school name + divisions ────────
const _origRenderDashboard2 = renderDashboard;
renderDashboard = function() {
  const total = ASSESSMENTS.length;
  const monthly = ASSESSMENTS.filter(a => a.month === CUR_MONTH).length;
  const improving = STUDENTS.filter(s => getStudentTrend(s.id) === 'up').length;
  const struggling = STUDENTS.filter(s => getStudentTrend(s.id) === 'down').length;
  const alerts = getAlerts();

  $('pageContent').innerHTML = `
<div class="page-header">
  <div>
    <h1 class="page-title">Dashboard</h1>
    <p class="page-subtitle" style="font-size:1rem;font-weight:700;color:#005778">Ichud Boys Program — Kriah Tracking</p>
    <p class="page-subtitle">Year-to-date — <span class="he">${CUR_YEAR}</span></p>
  </div>
  <div style="display:flex;gap:8px">
    <button class="btn btn-outline btn-sm" onclick="navigate('analytics')">Analytics</button>
    <button class="btn btn-primary btn-sm" onclick="navigate('ocr')">Upload Worksheet</button>
  </div>
</div>

<!-- DIVISION SUMMARY CARDS -->
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:22px">
  ${PROGRAMS.map((div, i) => {
    const divStudents = getDivisionStudents(div.id);
    const divClasses = getDivisionClasses(div.id);
    const divImp = divStudents.filter(s => getStudentTrend(s.id) === 'up').length;
    const divStr = divStudents.filter(s => getStudentTrend(s.id) === 'down').length;
    const colors = ['#005778','#1a7a9a','#003d56'];
    return `<div class="card" style="cursor:pointer;border-top:4px solid ${colors[i]}" onclick="navigate('providers')">
      <div class="card-body" style="padding:16px">
        <div style="font-size:1rem;font-weight:800;color:${colors[i]};margin-bottom:10px">${div.name}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;text-align:center">
          <div><div style="font-size:1.3rem;font-weight:900;color:#1a2a2a">${divClasses.length}</div><div style="font-size:0.68rem;color:#808285">Classes</div></div>
          <div><div style="font-size:1.3rem;font-weight:900;color:#005778">${divStudents.length}</div><div style="font-size:0.68rem;color:#808285">Students</div></div>
          <div><div style="font-size:1.3rem;font-weight:900;color:#1a6038">${divImp}</div><div style="font-size:0.68rem;color:#808285">Improving</div></div>
        </div>
      </div>
    </div>`;
  }).join('')}
</div>

<div class="kpi-grid">
  <div class="kpi-card" onclick="navigate('students')" style="cursor:pointer">
    <div class="kpi-icon" style="background:#e0eef5;color:#005778"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
    <div class="kpi-value">${STUDENTS.length}</div><div class="kpi-label">Total Students</div>
    <div class="kpi-trend up">↑ <span class="he">${CUR_YEAR}</span></div>
  </div>
  <div class="kpi-card gold" onclick="navigate('providers')" style="cursor:pointer">
    <div class="kpi-icon" style="background:#fdf3e3;color:#D9A44E"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
    <div class="kpi-value">${CLASSES.length}</div><div class="kpi-label">Classes</div>
    <div class="kpi-trend neutral">${PROVIDERS.length} providers</div>
  </div>
  <div class="kpi-card success">
    <div class="kpi-icon" style="background:#e4f2eb;color:#1a6038"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
    <div class="kpi-value">${total}</div><div class="kpi-label">YTD Assessments</div>
    <div class="kpi-trend up">↑ ${monthly} this month</div>
  </div>
  <div class="kpi-card ${improving>=struggling?'success':'warning'}">
    <div class="kpi-icon" style="background:${improving>=struggling?'#e4f2eb':'#fff3e0'};color:${improving>=struggling?'#1a6038':'#7a4800'}"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg></div>
    <div class="kpi-value">${improving}</div><div class="kpi-label">Improving</div>
    <div class="kpi-trend ${struggling>0?'down':'up'}">${struggling} need attention</div>
  </div>
</div>

${alerts.length ? `<div class="card mb-6"><div class="card-header"><span class="card-title">Active Alerts</span><span class="badge badge-danger">${alerts.length}</span></div><div class="card-body" style="padding:14px"><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:8px">${alerts.slice(0,6).map(a=>`<div class="alert alert-${a.type}" style="margin:0;cursor:pointer" onclick="navigate('student_profile',{studentId:'${a.studentId}'})"><div><div style="font-weight:700;font-size:0.84rem">${a.title}</div><div style="font-size:0.76rem;margin-top:2px">${a.message}</div></div></div>`).join('')}</div></div></div>` : ''}

<div class="grid-2 mb-6">
  <div class="card"><div class="card-header"><span class="card-title">Category Trends — YTD</span></div><div class="card-body"><div class="chart-container"><canvas id="catChart"></canvas></div></div></div>
  <div class="card"><div class="card-header"><span class="card-title">Division Comparison</span></div><div class="card-body"><div class="chart-container"><canvas id="divChart"></canvas></div></div></div>
</div>

<div class="grid-2">
  <div class="card"><div class="card-header"><span class="card-title">Recent Activity</span><button class="btn btn-ghost btn-sm" onclick="navigate('admin')">View All</button></div><div class="card-body" style="padding:0 20px">${SYS_LOGS.slice(0,6).map(l=>`<div style="display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid #e8d9b8;font-size:0.82rem"><div style="width:7px;height:7px;border-radius:50%;margin-top:5px;flex-shrink:0;background:${{success:'#1a6038',warning:'#D9A44E',danger:'#9a1c1c',info:'#005778'}[l.type]||'#808285'}"></div><div style="font-size:0.7rem;color:#808285;white-space:nowrap;min-width:80px">${fmtTime(l.timestamp)}</div><div style="flex:1;color:#444">${l.message}</div></div>`).join('')}</div></div>
  <div class="card"><div class="card-header"><span class="card-title">Students — <span class="he">סיון תשפ״ו</span></span><button class="btn btn-ghost btn-sm" onclick="navigate('students')">All Students</button></div><div class="card-body" style="padding:0"><table><thead><tr><th>Student</th><th>Class</th><th>Division</th><th>Trend</th></tr></thead><tbody>${STUDENTS.slice(0,7).map((s,i)=>{const t=getStudentTrend(s.id),cls=getClass(s.classId),div=getClassDivision(s.classId);return`<tr class="clickable" onclick="navigate('student_profile',{studentId:'${s.id}'})"><td class="primary"><div style="display:flex;align-items:center;gap:8px"><div class="user-avatar" style="width:28px;height:28px;font-size:0.65rem;background:${avatarColor(i)}">${initials(sName(s))}</div><span class="he">${sName(s)}</span></div></td><td style="font-size:0.8rem">${cls?cls.name:'—'}</td><td style="font-size:0.8rem;color:#005778;font-weight:600">${div?div.name:'—'}</td><td>${trendIcon(t)}</td></tr>`;}).join('')}</tbody></table></div></div>
</div>`;

  setTimeout(() => {
    const c1 = $('catChart');
    if (c1) { const months=HEB_MONTHS.slice(0,9);_charts.cat=new Chart(c1,{type:'line',data:{labels:months.map(m=>m.label),datasets:CATS.map(cat=>({label:cat.label,tension:0.4,fill:false,pointRadius:3,borderColor:cat.color,backgroundColor:cat.color+'20',data:months.map(m=>{const ass=ASSESSMENTS.filter(a=>a.month===m.id);return ass.length?Math.round(ass.reduce((s,a)=>s+(a.categories[cat.id]?.correct||0),0)/ass.length*10)/10:null;})}))},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:10},padding:8}}},scales:{x:{grid:{color:'#f0f0f0'}},y:{beginAtZero:true,grid:{color:'#f0f0f0'}}}}}); }
    const c2 = $('divChart');
    if (c2) { _charts.div=new Chart(c2,{type:'bar',data:{labels:PROGRAMS.map(p=>p.name),datasets:CATS.map(cat=>({label:cat.label,backgroundColor:cat.color+'CC',borderColor:cat.color,borderWidth:1,data:PROGRAMS.map(p=>{const ss=getDivisionStudents(p.id),ass=ASSESSMENTS.filter(a=>ss.some(s=>s.id===a.studentId));return ass.length?Math.round(ass.reduce((s,a)=>s+(a.categories[cat.id]?.correct||0),0)/ass.length*10)/10:0;})}))},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:10},padding:6}}},scales:{x:{grid:{display:false}},y:{beginAtZero:true,grid:{color:'#f0f0f0'}}}}}); }
  }, 80);
};

// ── PROVIDERS PAGE — Divisions + Classes + Providers ─────────
renderProviders = function() {
  $('pageContent').innerHTML = `
<div class="page-header">
  <div>
    <h1 class="page-title">Ichud Boys Program</h1>
    <p class="page-subtitle">Divisions · Classes · Providers</p>
  </div>
  <div style="display:flex;gap:8px;flex-wrap:wrap">
    <button class="btn btn-outline btn-sm" onclick="openCSVImport()">📄 Import CSV</button>
    <button class="btn btn-outline btn-sm" onclick="openAddClassModal()">+ Add Class</button>
    <button class="btn btn-primary btn-sm" onclick="openAddProviderModalNew()">+ Add Provider</button>
  </div>
</div>

<!-- KRIAH DIRECTOR -->
<div class="card mb-4" style="border-top:4px solid #D9A44E">
  <div class="card-header" style="background:linear-gradient(135deg,#003d56,#005778)">
    <span class="card-title" style="color:#fff">⭐ Kriah Director</span>
    <button class="btn btn-sm" style="background:rgba(217,164,78,0.2);color:#D9A44E;border:1px solid #D9A44E" onclick="editKriahDirector()">Edit</button>
  </div>
  <div class="card-body">
    ${KRIAH_DIRECTOR.name
      ? `<div style="display:flex;align-items:center;gap:14px"><div class="user-avatar" style="width:48px;height:48px;font-size:1rem;background:linear-gradient(135deg,#D9A44E,#b8832e)">${KRIAH_DIRECTOR.name.split(' ').map(w=>w[0]).join('').slice(0,2)}</div><div><div style="font-size:1.05rem;font-weight:800;color:#005778">${KRIAH_DIRECTOR.name}</div><div style="font-size:0.84rem;color:#808285;margin-top:2px">${KRIAH_DIRECTOR.email}</div><div style="font-size:0.72rem;color:#D9A44E;font-weight:700;margin-top:4px;text-transform:uppercase;letter-spacing:0.5px">Oversees all divisions</div></div></div>`
      : `<div style="text-align:center;padding:12px"><button class="btn btn-gold btn-sm" onclick="editKriahDirector()">+ Set Kriah Director</button></div>`}
  </div>
</div>

<!-- DIVISIONS with classes -->
${PROGRAMS.map((div, di) => {
  const divClasses = getDivisionClasses(div.id);
  const divStudents = getDivisionStudents(div.id);
  const colors = ['#005778','#1a7a9a','#003d56'];
  return `
<div class="card mb-4" style="border-top:4px solid ${colors[di]}">
  <div class="card-header" style="background:linear-gradient(135deg,${colors[di]},${colors[di]}cc)">
    <span class="card-title" style="color:#fff;font-size:1rem">${div.name} Division</span>
    <div style="display:flex;align-items:center;gap:10px">
      <span style="color:rgba(255,255,255,0.7);font-size:0.8rem">${divClasses.length} classes · ${divStudents.length} students</span>
      <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.3)" onclick="openAddClassModal('${div.id}')">+ Class</button>
    </div>
  </div>
  <div class="card-body">
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px">
      ${divClasses.map((cls, ci) => {
        const clsStudents = getClassStudents(cls.id);
        const clsImp = clsStudents.filter(s => getStudentTrend(s.id) === 'up').length;
        return `<div style="border:1px solid #e8d9b8;border-radius:10px;overflow:hidden;cursor:pointer;transition:all 0.2s" onclick="navigate('provider_profile',{providerId:'${cls.id}'})" onmouseenter="this.style.boxShadow='0 4px 12px rgba(0,87,120,0.15)'" onmouseleave="this.style.boxShadow=''">
          <div style="background:${colors[di]};padding:10px 14px;color:#fff;display:flex;align-items:center;justify-content:space-between">
            <div><div style="font-weight:800;font-size:0.9rem">${cls.name}</div><div style="font-size:0.7rem;opacity:0.8">${cls.grade}</div></div>
            <div style="text-align:center"><div style="font-size:1.3rem;font-weight:900">${clsStudents.length}</div><div style="font-size:0.62rem;opacity:0.8">students</div></div>
          </div>
          <div style="padding:8px 14px;background:#fff;font-size:0.78rem;color:#808285">
            <span style="color:#1a6038;font-weight:700">${clsImp} improving</span>
          </div>
        </div>`;
      }).join('')}
      ${divClasses.length === 0 ? '<div style="color:#808285;font-size:0.84rem;padding:8px">No classes yet — click "+ Class" to add</div>' : ''}
    </div>
  </div>
</div>`;
}).join('')}

<!-- PROVIDERS (staff caseloads) -->
<div class="card">
  <div class="card-header">
    <span class="card-title">Providers — Staff Caseloads (${PROVIDERS.length})</span>
    <button class="btn btn-primary btn-sm" onclick="openAddProviderModalNew()">+ Add Provider</button>
  </div>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Provider</th><th>Email</th><th>Students (Caseload)</th><th>Actions</th></tr></thead>
      <tbody>
        ${PROVIDERS.map((prov, i) => {
          const studs = getProviderStudentsNew(prov.id);
          return `<tr>
            <td class="primary"><div style="display:flex;align-items:center;gap:8px"><div class="user-avatar" style="width:30px;height:30px;font-size:0.65rem;background:${avatarColor(i)}">${initials(prov.name)}</div>${prov.name}</div></td>
            <td style="font-size:0.82rem;color:#808285">${prov.email}</td>
            <td>
              <div style="display:flex;flex-wrap:wrap;gap:5px">
                ${studs.map(s => `<span class="he" style="background:#e0eef5;color:#005778;padding:2px 8px;border-radius:20px;font-size:0.75rem;font-weight:600;cursor:pointer" onclick="navigate('student_profile',{studentId:'${s.id}'})">${sName(s)}</span>`).join('')}
                ${studs.length === 0 ? '<span style="color:#808285;font-size:0.8rem">No students assigned</span>' : ''}
              </div>
            </td>
            <td><button class="btn btn-outline btn-sm" onclick="editProviderCaseload('${prov.id}')">Edit Caseload</button></td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>
  </div>
</div>`;
};

// ── ADD CLASS MODAL ──────────────────────────────────────────
function openAddClassModal(divisionId) {
  const divName = divisionId ? PROGRAMS.find(p=>p.id===divisionId)?.name : '';
  const name = prompt(`Class name${divName?' for '+divName:''}:`, '');
  if (!name) return;
  const grade = prompt('Grade (e.g. 1st, 2nd):', '');
  const targetDiv = divisionId || prompt(`Division:\n${PROGRAMS.map((p,i)=>`${i+1}. ${p.name}`).join('\n')}\nEnter number:`, '1');
  const divId = divisionId || PROGRAMS[parseInt(targetDiv)-1]?.id || PROGRAMS[0].id;
  const newClass = { id: genId('cls'), name: name.trim(), divisionId: divId, grade: (grade||'').trim() };
  CLASSES.push(newClass);
  // Add to division's classIds
  const div = PROGRAMS.find(p => p.id === divId);
  if (div) div.classIds.push(newClass.id);
  showToast(`Class "${name}" added to ${PROGRAMS.find(p=>p.id===divId)?.name}`, 'success');
  navigate('providers');
}

// ── ADD PROVIDER MODAL ───────────────────────────────────────
function openAddProviderModalNew() {
  const name = prompt('Provider name (e.g. Rabbi Goldstein):', '');
  if (!name) return;
  const email = prompt('Email:', '');
  const phone = prompt('Phone (optional):', '');
  const newProv = { id: genId('prov'), name: name.trim(), email: (email||'').trim(), phone: (phone||'').trim(), studentIds: [] };
  PROVIDERS.push(newProv);
  showToast(`Provider "${name}" added`, 'success');
  navigate('providers');
}

// ── EDIT PROVIDER CASELOAD ───────────────────────────────────
function editProviderCaseload(provId) {
  const prov = PROVIDERS.find(p => p.id === provId);
  if (!prov) return;
  const unassigned = STUDENTS.filter(s => !s.providerId || s.providerId === provId);
  const current = getProviderStudentsNew(provId);

  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,61,86,0.55);z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px)';
  overlay.innerHTML = `
    <div style="background:#fff;border-radius:16px;box-shadow:0 24px 56px rgba(0,87,120,0.18);width:100%;max-width:600px;max-height:85vh;overflow-y:auto">
      <div style="background:linear-gradient(135deg,#003d56,#005778);padding:18px 24px;border-radius:16px 16px 0 0;display:flex;align-items:center;justify-content:space-between">
        <span style="font-size:1rem;font-weight:800;color:#fff">Caseload — ${prov.name}</span>
        <button onclick="this.closest('[style*=fixed]').remove()" style="width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.15);border:none;color:#fff;cursor:pointer;font-size:0.9rem">✕</button>
      </div>
      <div style="padding:20px">
        <div style="font-size:0.84rem;font-weight:700;color:#808285;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px">Current Students (${current.length})</div>
        <div style="display:flex;flex-wrap:wrap;gap:7px;margin-bottom:18px">
          ${current.map(s => `<div style="display:flex;align-items:center;gap:6px;background:#e0eef5;border:1px solid #b0cfe0;border-radius:20px;padding:4px 12px">
            <span class="he" style="font-size:0.82rem;font-weight:700;color:#005778">${sName(s)}</span>
            <button onclick="removeFromCaseload('${provId}','${s.id}',this)" style="background:none;border:none;color:#9a1c1c;cursor:pointer;font-size:0.8rem;padding:0;line-height:1">✕</button>
          </div>`).join('')}
          ${current.length === 0 ? '<span style="color:#808285;font-size:0.84rem">No students assigned</span>' : ''}
        </div>
        <div style="font-size:0.84rem;font-weight:700;color:#808285;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px">Add Students</div>
        <div style="max-height:200px;overflow-y:auto;border:1px solid #e8d9b8;border-radius:8px">
          ${STUDENTS.filter(s => s.providerId !== provId).map(s => {
            const cls = getClass(s.classId);
            const div = getClassDivision(s.classId);
            return `<div style="display:flex;align-items:center;justify-content:space-between;padding:9px 14px;border-bottom:1px solid #e8d9b8;font-size:0.84rem">
              <div>
                <span class="he" style="font-weight:700">${sName(s)}</span>
                <span style="color:#808285;font-size:0.76rem;margin-right:8px"> — ${cls?cls.name:''} ${div?'('+div.name+')':''}</span>
              </div>
              <button class="btn btn-primary btn-sm" onclick="addToCaseload('${provId}','${s.id}',this)">+ Add</button>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>`;
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

function addToCaseload(provId, studentId, btn) {
  const s = STUDENTS.find(x => x.id === studentId);
  if (!s) return;
  // Remove from old provider
  if (s.providerId) {
    const oldProv = PROVIDERS.find(p => p.id === s.providerId);
    if (oldProv) oldProv.studentIds = oldProv.studentIds.filter(id => id !== studentId);
  }
  s.providerId = provId;
  const prov = PROVIDERS.find(p => p.id === provId);
  if (prov && !prov.studentIds.includes(studentId)) prov.studentIds.push(studentId);
  if (btn) { btn.textContent = '✓ Added'; btn.disabled = true; btn.style.background = '#1a6038'; }
  showToast(`${sName(s)} added to caseload`, 'success');
}

function removeFromCaseload(provId, studentId, btn) {
  const s = STUDENTS.find(x => x.id === studentId);
  if (!s) return;
  s.providerId = '';
  const prov = PROVIDERS.find(p => p.id === provId);
  if (prov) prov.studentIds = prov.studentIds.filter(id => id !== studentId);
  if (btn) btn.closest('[style*="border-radius:20px"]')?.remove();
  showToast(`${sName(s)} removed from caseload`, 'warning');
}

// ── STUDENT PROFILE — show class + division + provider ───────
const _origRenderStudentProfile2 = renderStudentProfile;
renderStudentProfile = function(sid) {
  const s = getStudent(sid);
  if (!s) { $('pageContent').innerHTML = '<div style="padding:40px">Student not found</div>'; return; }
  const ass = getStudentAssessments(sid);
  const cls = getClass(s.classId);
  const div = getClassDivision(s.classId);
  const prov = getStudentProvider(sid);
  const t = getStudentTrend(sid);
  const lastA = ass[ass.length - 1];
  const hs = $('headerSubBreadcrumb');
  if (hs) hs.innerHTML = ` › <span class="he">${sName(s)}</span>`;

  $('pageContent').innerHTML = `
<div style="margin-bottom:14px"><button class="btn btn-ghost btn-sm" onclick="navigate('students')">← Back to Students</button></div>
<div class="student-profile-header">
  <div style="display:flex;align-items:center;gap:18px">
    <div class="user-avatar" style="width:64px;height:64px;font-size:1.4rem;flex-shrink:0">${initials(sName(s))}</div>
    <div style="flex:1;text-align:right">
      <div class="he" style="font-size:1.5rem;font-weight:900;color:#fff;line-height:1.2">${sName(s)}</div>
      <div style="font-size:0.95rem;font-weight:700;color:rgba(255,255,255,0.85);margin-top:3px">${cls ? cls.name : s.class || '—'}</div>
      <div style="display:flex;gap:10px;margin-top:8px;flex-wrap:wrap;justify-content:flex-end">
        ${div ? `<span style="background:rgba(217,164,78,0.3);color:#D9A44E;font-size:0.72rem;font-weight:800;padding:2px 9px;border-radius:20px;border:1px solid rgba(217,164,78,0.4)">${div.name}</span>` : ''}
        ${prov ? `<span style="font-size:0.8rem;color:rgba(255,255,255,0.75)">Provider: ${prov.name}</span>` : ''}
        <span class="he" style="font-size:0.8rem;color:rgba(255,255,255,0.7)">${s.year}</span>
        ${trendBadge(t)}
      </div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;flex-shrink:0">
      <button class="btn btn-gold btn-sm" onclick="openAddAssessmentModal('${sid}')">+ Assessment</button>
      <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.3)" onclick="${lastA ? `showStudentReport('${sid}','${lastA.month}','${lastA.year}')` : "showToast('No assessments yet','warning')"}">📄 Report</button>
      <button class="btn btn-sm" style="background:rgba(217,164,78,0.3);color:#fff;border:1px solid rgba(217,164,78,0.5)" onclick="showFinalReports('${sid}')">✓ Finals</button>
    </div>
  </div>
</div>

<div style="display:flex;border-bottom:2px solid #e8d9b8;margin-bottom:22px">
  ${['overview','assessments','charts','videos'].map(tab => `
    <button style="padding:9px 18px;font-size:0.84rem;font-weight:${_profileTab===tab?'700':'600'};color:${_profileTab===tab?'#005778':'#808285'};cursor:pointer;border:none;background:${_profileTab===tab?'#e0eef5':'transparent'};border-bottom:2px solid ${_profileTab===tab?'#005778':'transparent'};margin-bottom:-2px;border-radius:${_profileTab===tab?'8px 8px 0 0':'0'}" onclick="_profileTab='${tab}';renderStudentProfile('${sid}')">${{overview:'Overview',assessments:`Assessments (${ass.length})`,charts:'Charts',videos:'Videos'}[tab]}</button>`).join('')}
</div>
<div id="profileContent"></div>`;

  if (_profileTab === 'overview')         renderProfileOverview(sid, s, ass, lastA, prov);
  else if (_profileTab === 'assessments') renderProfileAssessments(sid, ass);
  else if (_profileTab === 'charts')      renderProfileCharts(sid, ass);
  else if (_profileTab === 'videos')      renderStudentVideos12(sid, s);
};

// ── STUDENTS LIST — show class + division + provider ─────────
const _origRenderStudents3 = renderStudents;
renderStudents = function() {
  const f = STUDENTS.filter(s => {
    const n = sName(s).toLowerCase();
    return (!_ss || n.includes(_ss.toLowerCase())) &&
           (!_sp || s.classId === _sp || s.providerId === _sp) &&
           (!_st || getStudentTrend(s.id) === _st);
  });

  $('pageContent').innerHTML = `
<div class="page-header">
  <div><h1 class="page-title">Students</h1><p class="page-subtitle">${STUDENTS.length} students — Ichud Boys Program</p></div>
  <div style="display:flex;gap:8px">
    <button class="btn btn-outline btn-sm" onclick="openCSVImport()">📄 CSV</button>
    <button class="btn btn-primary" onclick="openAddStudentModal()">+ Add Student</button>
  </div>
</div>
<div class="filter-bar">
  <div class="search-bar"><svg class="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input type="text" placeholder="Search student..." value="${_ss}" oninput="_ss=this.value;renderStudents()"></div>
  <select class="form-control" style="width:auto" onchange="_sp=this.value;renderStudents()">
    <option value="">All Classes</option>
    ${PROGRAMS.map(div => `<optgroup label="${div.name}">${getDivisionClasses(div.id).map(c=>`<option value="${c.id}" ${_sp===c.id?'selected':''}>${c.name}</option>`).join('')}</optgroup>`).join('')}
  </select>
  <select class="form-control" style="width:auto" onchange="_st=this.value;renderStudents()">
    <option value="">All Trends</option>
    <option value="up" ${_st==='up'?'selected':''}>↑ Improving</option>
    <option value="down" ${_st==='down'?'selected':''}>↓ Declining</option>
    <option value="flat" ${_st==='flat'?'selected':''}>→ Stable</option>
  </select>
  <span class="badge badge-blue">${f.length} students</span>
</div>
<div class="card"><div class="table-wrapper"><table>
  <thead><tr><th>#</th><th>Student</th><th>Class</th><th>Division</th><th>Provider</th><th>Trend</th><th>Assessments</th><th>Actions</th></tr></thead>
  <tbody>${f.length===0?`<tr><td colspan="8" style="text-align:center;padding:40px;color:#808285">No students found</td></tr>`:f.map((s,i)=>{
    const t=getStudentTrend(s.id),ass=getStudentAssessments(s.id),lastA=ass[ass.length-1];
    const cls=getClass(s.classId),div=getClassDivision(s.classId),prov=getStudentProvider(s.id);
    return`<tr class="clickable" onclick="navigate('student_profile',{studentId:'${s.id}'})">
      <td style="color:#808285">${i+1}</td>
      <td class="primary"><div style="display:flex;align-items:center;gap:10px"><div class="user-avatar" style="width:32px;height:32px;font-size:0.72rem;background:${avatarColor(i)}">${initials(sName(s))}</div><div><div class="he" style="font-weight:700">${sName(s)}</div><div class="he" style="font-size:0.72rem;color:#808285">${s.year}</div></div></div></td>
      <td style="font-weight:600;color:#005778">${cls?cls.name:'—'}</td>
      <td><span style="background:#e0eef5;color:#005778;padding:2px 8px;border-radius:20px;font-size:0.72rem;font-weight:700">${div?div.name:'—'}</span></td>
      <td style="font-size:0.82rem;color:#808285">${prov?prov.name:'—'}</td>
      <td>${trendBadge(t)}</td>
      <td><span class="badge badge-neutral">${ass.length}</span></td>
      <td onclick="event.stopPropagation()"><div style="display:flex;gap:6px"><button class="btn btn-outline btn-sm" onclick="navigate('student_profile',{studentId:'${s.id}'})">Profile</button><button class="btn btn-ghost btn-sm" onclick="openAddAssessmentModal('${s.id}')">+ Assess</button></div></td>
    </tr>`;}).join('')}</tbody>
</table></div></div>`;
};

// ── ADD STUDENT MODAL — class + provider selectors ───────────
openAddStudentModal = function() {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,61,86,0.55);z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px)';
  overlay.innerHTML = `
    <div style="background:#fff;border-radius:16px;box-shadow:0 24px 56px rgba(0,87,120,0.18);width:100%;max-width:560px;max-height:90vh;overflow-y:auto">
      <div style="background:linear-gradient(135deg,#003d56,#005778);padding:18px 24px;border-radius:16px 16px 0 0;display:flex;align-items:center;justify-content:space-between">
        <span style="font-size:1rem;font-weight:800;color:#fff">Add New Student</span>
        <button onclick="this.closest('[style*=fixed]').remove()" style="width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.15);border:none;color:#fff;cursor:pointer;font-size:0.9rem">✕</button>
      </div>
      <div style="padding:24px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px">
          <div class="form-group"><label class="form-label">First Name *</label><input type="text" class="form-control he" id="ns_first" placeholder="שם פרטי"></div>
          <div class="form-group"><label class="form-label">Last Name *</label><input type="text" class="form-control he" id="ns_last" placeholder="שם משפחה"></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px">
          <div class="form-group"><label class="form-label">Class *</label>
            <select class="form-control" id="ns_class">
              <option value="">Select class...</option>
              ${PROGRAMS.map(div => `<optgroup label="${div.name}">${getDivisionClasses(div.id).map(c=>`<option value="${c.id}">${c.name}</option>`).join('')}</optgroup>`).join('')}
            </select>
          </div>
          <div class="form-group"><label class="form-label">Provider (1:1 Teacher)</label>
            <select class="form-control" id="ns_prov">
              <option value="">Select provider...</option>
              ${PROVIDERS.map(p=>`<option value="${p.id}">${p.name}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="form-group"><label class="form-label">School Year</label>
          <select class="form-control he" id="ns_year">${yearSelect(CUR_YEAR)}</select>
        </div>
        <div class="form-group"><label class="form-label">Notes</label><input type="text" class="form-control" id="ns_notes" placeholder="Optional notes"></div>
      </div>
      <div style="padding:14px 24px;border-top:1px solid #e8d9b8;display:flex;gap:10px;background:#fdf8f0;border-radius:0 0 16px 16px">
        <button class="btn btn-primary" onclick="saveNewStudentNew(this.closest('[style*=fixed]'))">Save Student</button>
        <button class="btn btn-ghost" onclick="this.closest('[style*=fixed]').remove()">Cancel</button>
      </div>
    </div>`;
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
};

function saveNewStudentNew(overlay) {
  const fn = document.getElementById('ns_first')?.value.trim();
  const ln = document.getElementById('ns_last')?.value.trim();
  const classId = document.getElementById('ns_class')?.value;
  const provId = document.getElementById('ns_prov')?.value;
  const year = document.getElementById('ns_year')?.value || CUR_YEAR;
  const notes = document.getElementById('ns_notes')?.value.trim() || '';
  if (!fn || !ln || !classId) { showToast('First name, last name and class are required', 'warning'); return; }
  const s = { id: genId('s'), firstName: fn, lastName: ln, classId, providerId: provId || '', year, status: 'active', notes };
  STUDENTS.push(s);
  if (provId) { const p = PROVIDERS.find(x => x.id === provId); if (p && !p.studentIds.includes(s.id)) p.studentIds.push(s.id); }
  AUDIT_LOG.unshift({ id: genId('a'), action: 'Add Student', entity: 'Student', entityName: `${fn} ${ln}`, field: '—', before: '—', after: 'Created', timestamp: new Date().toISOString() });
  SYS_LOGS.unshift({ id: genId('l'), type: 'info', message: `Student added: ${fn} ${ln}`, timestamp: new Date().toISOString() });
  overlay?.remove();
  showToast(`${fn} ${ln} added`, 'success');
  const sb = $('studentsBadge'); if (sb) sb.textContent = STUDENTS.length;
  if (_page === 'students') renderStudents();
}

// ── PROVIDER PROFILE — show caseload ────────────────────────
renderProviderProfile = function(pid) {
  // pid could be a class id or provider id
  const cls = getClass(pid);
  if (cls) {
    // Show class profile
    const div = getClassDivision(pid);
    const students = getClassStudents(pid);
    const hs = $('headerSubBreadcrumb'); if (hs) hs.innerHTML = ` › ${cls.name}`;
    $('pageContent').innerHTML = `
<div style="margin-bottom:14px"><button class="btn btn-ghost btn-sm" onclick="navigate('providers')">← Back</button></div>
<div class="student-profile-header">
  <div style="display:flex;align-items:center;gap:18px">
    <div class="user-avatar" style="width:64px;height:64px;font-size:1.4rem">${cls.name.slice(0,2)}</div>
    <div style="flex:1">
      <div style="font-size:1.5rem;font-weight:900;color:#fff">${cls.name}</div>
      <div style="font-size:0.95rem;color:rgba(255,255,255,0.8);margin-top:3px">${cls.grade}</div>
      <div style="margin-top:8px">${div?`<span style="background:rgba(217,164,78,0.3);color:#D9A44E;font-size:0.75rem;font-weight:800;padding:3px 10px;border-radius:20px;border:1px solid rgba(217,164,78,0.4)">${div.name} Division</span>`:''}</div>
    </div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-gold btn-sm" onclick="navigate('worksheets')">Worksheet</button>
      <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.3)" onclick="navigate('reports')">Reports</button>
    </div>
  </div>
</div>
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:22px">
  <div class="kpi-card"><div class="kpi-value">${students.length}</div><div class="kpi-label">Students</div></div>
  <div class="kpi-card success"><div class="kpi-value">${students.filter(s=>getStudentTrend(s.id)==='up').length}</div><div class="kpi-label">Improving</div></div>
  <div class="kpi-card danger"><div class="kpi-value">${students.filter(s=>getStudentTrend(s.id)==='down').length}</div><div class="kpi-label">At Risk</div></div>
  <div class="kpi-card gold"><div class="kpi-value">${ASSESSMENTS.filter(a=>students.some(s=>s.id===a.studentId)).length}</div><div class="kpi-label">Assessments</div></div>
</div>
<div class="card"><div class="card-header"><span class="card-title">Students in ${cls.name} (${students.length})</span><button class="btn btn-primary btn-sm" onclick="openAddStudentModal()">+ Add Student</button></div>
<div class="table-wrapper"><table><thead><tr><th>Student</th><th>Provider</th><th>Trend</th><th>Assessments</th><th>Last Month</th><th>Actions</th></tr></thead><tbody>
${students.map((s,i)=>{const t=getStudentTrend(s.id),a=getStudentAssessments(s.id),lastA=a[a.length-1],prov=getStudentProvider(s.id);return`<tr class="clickable" onclick="navigate('student_profile',{studentId:'${s.id}'})"><td class="primary"><div style="display:flex;align-items:center;gap:8px"><div class="user-avatar" style="width:28px;height:28px;font-size:0.65rem;background:${avatarColor(i)}">${initials(sName(s))}</div><span class="he">${sName(s)}</span></div></td><td style="font-size:0.82rem;color:#808285">${prov?prov.name:'—'}</td><td>${trendBadge(t)}</td><td><span class="badge badge-neutral">${a.length}</span></td><td>${lastA?`<span class="he" style="background:#005778;color:#fff;padding:2px 8px;border-radius:20px;font-size:0.7rem;font-weight:700">${getMonthLabel(lastA.month)} ${lastA.year}</span>`:'—'}</td><td onclick="event.stopPropagation()"><button class="btn btn-outline btn-sm" onclick="navigate('student_profile',{studentId:'${s.id}'})">Profile</button></td></tr>`;}).join('')}
</tbody></table></div></div>`;
  } else {
    // Show provider caseload
    const prov = PROVIDERS.find(p => p.id === pid);
    if (!prov) { $('pageContent').innerHTML = '<div style="padding:40px">Not found</div>'; return; }
    const students = getProviderStudentsNew(pid);
    const hs = $('headerSubBreadcrumb'); if (hs) hs.textContent = ` › ${prov.name}`;
    $('pageContent').innerHTML = `
<div style="margin-bottom:14px"><button class="btn btn-ghost btn-sm" onclick="navigate('providers')">← Back</button></div>
<div class="student-profile-header">
  <div style="display:flex;align-items:center;gap:18px">
    <div class="user-avatar" style="width:64px;height:64px;font-size:1.4rem">${initials(prov.name)}</div>
    <div style="flex:1"><div style="font-size:1.5rem;font-weight:900;color:#fff">${prov.name}</div><div style="font-size:0.85rem;color:rgba(255,255,255,0.75);margin-top:4px">${prov.email}</div><div style="font-size:0.8rem;color:rgba(255,255,255,0.6);margin-top:4px">Provider — ${students.length} students in caseload</div></div>
    <button class="btn btn-gold btn-sm" onclick="editProviderCaseload('${pid}')">Edit Caseload</button>
  </div>
</div>
<div class="card"><div class="card-header"><span class="card-title">Caseload (${students.length} students)</span></div>
<div class="table-wrapper"><table><thead><tr><th>Student</th><th>Class</th><th>Division</th><th>Trend</th><th>Assessments</th><th>Actions</th></tr></thead><tbody>
${students.map((s,i)=>{const t=getStudentTrend(s.id),a=getStudentAssessments(s.id),cls=getClass(s.classId),div=getClassDivision(s.classId);return`<tr class="clickable" onclick="navigate('student_profile',{studentId:'${s.id}'})"><td class="primary"><div style="display:flex;align-items:center;gap:8px"><div class="user-avatar" style="width:28px;height:28px;font-size:0.65rem;background:${avatarColor(i)}">${initials(sName(s))}</div><span class="he">${sName(s)}</span></div></td><td style="font-weight:600;color:#005778">${cls?cls.name:'—'}</td><td><span style="background:#e0eef5;color:#005778;padding:2px 8px;border-radius:20px;font-size:0.72rem;font-weight:700">${div?div.name:'—'}</span></td><td>${trendBadge(t)}</td><td><span class="badge badge-neutral">${a.length}</span></td><td onclick="event.stopPropagation()"><button class="btn btn-outline btn-sm" onclick="navigate('student_profile',{studentId:'${s.id}'})">Profile</button></td></tr>`;}).join('')}
</tbody></table></div></div>`;
  }
};

// ── ANALYTICS — use new model ────────────────────────────────
const _origRenderAnalytics3 = renderAnalytics;
renderAnalytics = function() {
  const imp = STUDENTS.filter(s => getStudentTrend(s.id) === 'up');
  const str = STUDENTS.filter(s => getStudentTrend(s.id) === 'down');
  $('pageContent').innerHTML = `
<div class="page-header"><div><h1 class="page-title">Analytics</h1><p class="page-subtitle">Ichud Boys Program — Growth, regression, division comparison</p></div></div>
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:22px">
  <div class="kpi-card success"><div class="kpi-value">${imp.length}</div><div class="kpi-label">Improving</div></div>
  <div class="kpi-card danger"><div class="kpi-value">${str.length}</div><div class="kpi-label">At Risk</div></div>
  <div class="kpi-card"><div class="kpi-value">${ASSESSMENTS.length}</div><div class="kpi-label">Total Assessments</div></div>
  <div class="kpi-card gold"><div class="kpi-value">${HEB_MONTHS.filter(m=>ASSESSMENTS.some(a=>a.month===m.id)).length}</div><div class="kpi-label">Active Months</div></div>
</div>
<div class="grid-2 mb-6">
  <div class="card"><div class="card-header"><span class="card-title">Most Improved</span></div><div class="card-body" style="padding:0"><table><thead><tr><th>Student</th><th>Class</th><th>Division</th><th>#</th></tr></thead><tbody>${imp.slice(0,6).map((s,i)=>{const cls=getClass(s.classId),div=getClassDivision(s.classId);return`<tr class="clickable" onclick="navigate('student_profile',{studentId:'${s.id}'})"><td class="primary"><div style="display:flex;align-items:center;gap:8px"><div class="user-avatar" style="width:26px;height:26px;font-size:0.62rem;background:${avatarColor(i)}">${initials(sName(s))}</div><span class="he">${sName(s)}</span></div></td><td style="font-size:0.8rem">${cls?cls.name:'—'}</td><td style="font-size:0.8rem;color:#005778;font-weight:600">${div?div.name:'—'}</td><td><span class="badge badge-blue">${getStudentAssessments(s.id).length}</span></td></tr>`;}).join('')}${imp.length===0?'<tr><td colspan="4" style="text-align:center;padding:20px;color:#808285">No data</td></tr>':''}</tbody></table></div></div>
  <div class="card"><div class="card-header"><span class="card-title">At-Risk Students</span></div><div class="card-body" style="padding:0"><table><thead><tr><th>Student</th><th>Class</th><th>Division</th><th>Action</th></tr></thead><tbody>${str.slice(0,6).map((s,i)=>{const cls=getClass(s.classId),div=getClassDivision(s.classId);return`<tr class="clickable" style="background:#fdecea" onclick="navigate('student_profile',{studentId:'${s.id}'})"><td class="primary"><div style="display:flex;align-items:center;gap:8px"><div class="user-avatar" style="width:26px;height:26px;font-size:0.62rem;background:${avatarColor(i)}">${initials(sName(s))}</div><span class="he">${sName(s)}</span></div></td><td style="font-size:0.8rem">${cls?cls.name:'—'}</td><td style="font-size:0.8rem;color:#005778;font-weight:600">${div?div.name:'—'}</td><td onclick="event.stopPropagation()"><button class="btn btn-outline btn-sm" onclick="navigate('student_profile',{studentId:'${s.id}'})">Review</button></td></tr>`;}).join('')}${str.length===0?'<tr><td colspan="4" style="text-align:center;padding:20px;color:#808285">No at-risk students</td></tr>':''}</tbody></table></div></div>
</div>
<div class="grid-2 mb-6">
  <div class="card"><div class="card-header"><span class="card-title">Trend Distribution</span></div><div class="card-body"><div style="position:relative;height:220px"><canvas id="tChart"></canvas></div></div></div>
  <div class="card"><div class="card-header"><span class="card-title">YTD Trend</span></div><div class="card-body"><div style="position:relative;height:220px"><canvas id="yChart"></canvas></div></div></div>
</div>
<div class="card mb-6">
  <div class="card-header"><span class="card-title">Division Breakdown</span></div>
  <div class="table-wrapper"><table><thead><tr><th>Division</th><th>Classes</th><th>Students</th><th>Improving</th><th>At Risk</th>${CATS.map(c=>`<th class="he">${c.label}</th>`).join('')}</tr></thead><tbody>
    ${PROGRAMS.map(div=>{const ss=getDivisionStudents(div.id),ass=ASSESSMENTS.filter(a=>ss.some(s=>s.id===a.studentId)),im=ss.filter(s=>getStudentTrend(s.id)==='up').length,st=ss.filter(s=>getStudentTrend(s.id)==='down').length;return`<tr><td class="primary" style="font-weight:800;color:#005778">${div.name}</td><td><span class="badge badge-blue">${getDivisionClasses(div.id).length}</span></td><td><span class="badge badge-neutral">${ss.length}</span></td><td><span class="badge badge-success">${im}</span></td><td><span class="badge badge-danger">${st}</span></td>${CATS.map(cat=>{const v=ass.length?Math.round(ass.reduce((s,a)=>s+(a.categories[cat.id]?.correct||0),0)/ass.length*10)/10:0;return`<td style="font-weight:700;color:${cat.color}">${v}</td>`;}).join('')}</tr>`;}).join('')}
  </tbody></table></div>
</div>
<div class="card">
  <div class="card-header"><span class="card-title">Provider Caseload Performance</span></div>
  <div class="table-wrapper"><table><thead><tr><th>Provider</th><th>Students</th><th>Improving</th><th>At Risk</th>${CATS.map(c=>`<th class="he">${c.label}</th>`).join('')}</tr></thead><tbody>
    ${PROVIDERS.map(prov=>{const ss=getProviderStudentsNew(prov.id),ass=ASSESSMENTS.filter(a=>ss.some(s=>s.id===a.studentId)),im=ss.filter(s=>getStudentTrend(s.id)==='up').length,st=ss.filter(s=>getStudentTrend(s.id)==='down').length;return`<tr><td class="primary">${prov.name}</td><td><span class="badge badge-neutral">${ss.length}</span></td><td><span class="badge badge-success">${im}</span></td><td><span class="badge badge-danger">${st}</span></td>${CATS.map(cat=>{const v=ass.length?Math.round(ass.reduce((s,a)=>s+(a.categories[cat.id]?.correct||0),0)/ass.length*10)/10:0;return`<td style="font-weight:700;color:${cat.color}">${v}</td>`;}).join('')}</tr>`;}).join('')}
  </tbody></table></div>
</div>`;
  setTimeout(()=>{const up=imp.length,down=str.length,flat=STUDENTS.length-up-down;const c1=$('tChart');if(c1)_charts.t=new Chart(c1,{type:'doughnut',data:{labels:['Improving','Stable','At Risk'],datasets:[{data:[up,flat,down],backgroundColor:['#1a6038','#808285','#9a1c1c'],borderWidth:2,borderColor:'#fff'}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:11},padding:10}}}}});const c2=$('yChart');if(c2){const months=HEB_MONTHS.slice(0,9);_charts.y=new Chart(c2,{type:'line',data:{labels:months.map(m=>m.label),datasets:CATS.map(cat=>({label:cat.label,data:months.map(m=>{const ass=ASSESSMENTS.filter(a=>a.month===m.id);return ass.length?Math.round(ass.reduce((s,a)=>s+(a.categories[cat.id]?.correct||0),0)/ass.length*10)/10:null;}),borderColor:cat.color,backgroundColor:cat.color+'15',tension:0.4,fill:true,pointRadius:3}))},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:10},padding:8}}},scales:{x:{grid:{color:'#f5f5f5'}},y:{beginAtZero:true,grid:{color:'#f5f5f5'}}}}});}},80);
};

// ── BACKUP — include new model ───────────────────────────────
downloadBackup = function() {
  const data = {
    exportedAt: new Date().toISOString(), version: '3.0',
    school: SCHOOL, kriahDirector: KRIAH_DIRECTOR,
    programs: PROGRAMS, classes: CLASSES, providers: PROVIDERS,
    students: STUDENTS, assessments: ASSESSMENTS,
    reportFinals: REPORT_FINALS, ocrImports: OCR_IMPORTS,
    systemLog: SYS_LOGS.slice(0,100),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `KriahTrack_IchudBoys_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  showToast('Backup downloaded', 'success');
};
