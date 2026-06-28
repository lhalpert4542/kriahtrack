// ============================================================
// KriahTrack — Ichud Boys Program
// Clean single-file app, no override conflicts
// ============================================================

// ── CONSTANTS ────────────────────────────────────────────────
const CATS = [
  {id:'otiyot',       label:'אותיות',           color:'#005778', hasMistakes:true},
  {id:'ot_nekuda',    label:'אות + נקודה',       color:'#D9A44E', hasMistakes:true},
  {id:'ot_nekuda_ot', label:'אות + נקודה + אות', color:'#808285', hasMistakes:true},
  {id:'milim',        label:'מילים',             color:'#1a7a9a', hasMistakes:false},
  {id:'tehilim',      label:'תהילים',            color:'#b8832e', hasMistakes:false},
];
const HEB_MONTHS = [
  {id:'tishrei',label:'תשרי',order:1},{id:'cheshvan',label:'חשון',order:2},
  {id:'kislev',label:'כסלו',order:3},{id:'tevet',label:'טבת',order:4},
  {id:'shvat',label:'שבט',order:5},{id:'adar',label:'אדר',order:6},
  {id:'nisan',label:'ניסן',order:7},{id:'iyar',label:'אייר',order:8},
  {id:'sivan',label:'סיון',order:9},{id:'tamuz',label:'תמוז',order:10},
  {id:'av',label:'אב',order:11},{id:'elul',label:'אלול',order:12},
];
const HEB_YEARS = ['תשפ״ו','תשפ״ז','תשפ״ח','תשפ״ט'];
const CUR_YEAR = 'תשפ״ו', CUR_MONTH = 'sivan', HEB_TODAY = 'כ״ו סיון תשפ״ו';

// ── SCHOOL DATA MODEL ────────────────────────────────────────
// School → Divisions → Classes → Students
// Providers = 1:1 staff assigned to students

let SCHOOL = { name: 'Ichud Boys Program' };
let KRIAH_DIRECTOR = { name: '', email: '' };

// Divisions (Programs)
let DIVISIONS = [
  { id: 'div_ahuvim',    name: 'Ahuvim',    color: '#005778' },
  { id: 'div_nechmudim', name: 'Nechmudim', color: '#1a7a9a' },
  { id: 'div_masmidim',  name: 'Masmidim',  color: '#003d56' },
];

// Classes — each belongs to a division
let CLASSES = [
  { id: 'cls1', name: 'Aleph',  divisionId: 'div_ahuvim',    grade: '1st' },
  { id: 'cls2', name: 'Beis',   divisionId: 'div_ahuvim',    grade: '2nd' },
  { id: 'cls3', name: 'Gimmel', divisionId: 'div_nechmudim', grade: '3rd' },
  { id: 'cls4', name: 'Daled',  divisionId: 'div_nechmudim', grade: '4th' },
  { id: 'cls5', name: 'Hey',    divisionId: 'div_masmidim',  grade: '5th' },
  { id: 'cls6', name: 'Vov',    divisionId: 'div_masmidim',  grade: '6th' },
];

// Providers — 1:1 Kriah teachers
let PROVIDERS = [
  { id: 'prov1', name: 'Rabbi Goldstein', email: 'goldstein@ichud.edu', phone: '' },
  { id: 'prov2', name: 'Rabbi Friedman',  email: 'friedman@ichud.edu',  phone: '' },
  { id: 'prov3', name: 'Rabbi Schwartz',  email: 'schwartz@ichud.edu',  phone: '' },
  { id: 'prov4', name: 'Rabbi Weiss',     email: 'weiss@ichud.edu',     phone: '' },
];

// Students — classId = their class, providerId = their 1:1 teacher
// emails = up to 2 parent email addresses
let STUDENTS = [
  {id:'s1', firstName:'יוסף',  lastName:'כהן',      classId:'cls1', providerId:'prov1', year:'תשפ״ו', status:'active', notes:'', emails:[]},
  {id:'s2', firstName:'מנחם',  lastName:'לוי',      classId:'cls1', providerId:'prov1', year:'תשפ״ו', status:'active', notes:'', emails:[]},
  {id:'s3', firstName:'אברהם', lastName:'גולדברג',  classId:'cls2', providerId:'prov2', year:'תשפ״ו', status:'active', notes:'', emails:[]},
  {id:'s4', firstName:'שמואל', lastName:'רוזנברג',  classId:'cls2', providerId:'prov2', year:'תשפ״ו', status:'active', notes:'', emails:[]},
  {id:'s5', firstName:'דוד',   lastName:'פרידמן',   classId:'cls3', providerId:'prov3', year:'תשפ״ו', status:'active', notes:'', emails:[]},
  {id:'s6', firstName:'ישראל', lastName:'ברגר',     classId:'cls3', providerId:'prov3', year:'תשפ״ו', status:'active', notes:'', emails:[]},
  {id:'s7', firstName:'מרדכי', lastName:'שטיין',    classId:'cls4', providerId:'prov4', year:'תשפ״ו', status:'active', notes:'', emails:[]},
  {id:'s8', firstName:'פנחס',  lastName:'וייס',     classId:'cls4', providerId:'prov4', year:'תשפ״ו', status:'active', notes:'', emails:[]},
  {id:'s9', firstName:'אליהו', lastName:'שוורץ',    classId:'cls5', providerId:'prov1', year:'תשפ״ו', status:'active', notes:'', emails:[]},
  {id:'s10',firstName:'נחמן',  lastName:'גרינבאום', classId:'cls5', providerId:'prov2', year:'תשפ״ו', status:'active', notes:'', emails:[]},
  {id:'s11',firstName:'חיים',  lastName:'בלום',     classId:'cls6', providerId:'prov3', year:'תשפ״ו', status:'active', notes:'', emails:[]},
  {id:'s12',firstName:'זלמן',  lastName:'הורוביץ',  classId:'cls6', providerId:'prov4', year:'תשפ״ו', status:'active', notes:'', emails:[]},
];

let ASSESSMENTS = [], SYS_LOGS = [], AUDIT_LOG = [], OCR_IMPORTS = [];
let REPORT_FINALS = {}, STUDENT_VIDEOS = {};
let _ocrFile = null, ocrStep = 1, ocrSelectedProvider = '', ocrSelectedMonth = CUR_MONTH;
let pendingOCRData = [], _wsProv = '', _wsMonth = CUR_MONTH, _wsYear = CUR_YEAR;
let _rp = '', _rm = CUR_MONTH, _rl = 'en';

// Seed assessments
(function seed(){
  const months=['tishrei','cheshvan','kislev','tevet','shvat','adar','nisan','iyar','sivan'];
  STUDENTS.forEach(s=>{
    const base=10+Math.floor(Math.random()*12);
    months.forEach((m,mi)=>{
      if(Math.random()>0.12){
        const g=mi*1.2,n=()=>Math.floor(Math.random()*4)-1;
        ASSESSMENTS.push({id:`a_${s.id}_${m}`,studentId:s.id,classId:s.classId,providerId:s.providerId,month:m,year:CUR_YEAR,source:'manual',createdAt:new Date().toISOString(),categories:{
          otiyot:{correct:Math.max(0,Math.min(30,Math.floor(base+g+n()+8))),mistakes:Math.max(0,Math.floor(7-g*0.3+Math.abs(n())))},
          ot_nekuda:{correct:Math.max(0,Math.min(28,Math.floor(base+g+n()+4))),mistakes:Math.max(0,Math.floor(9-g*0.3+Math.abs(n())))},
          ot_nekuda_ot:{correct:Math.max(0,Math.min(25,Math.floor(base+g+n()))),mistakes:Math.max(0,Math.floor(11-g*0.3+Math.abs(n())))},
          milim:{correct:Math.max(0,Math.min(22,Math.floor(base+g+n()-2))),mistakes:0},
          tehilim:{correct:Math.max(0,Math.min(20,Math.floor(base+g+n()-4))),mistakes:0},
        }});
      }
    });
  });
  SYS_LOGS.push({id:'l1',type:'success',message:'KriahTrack — Ichud Boys Program initialized',timestamp:new Date().toISOString()});
  SYS_LOGS.push({id:'l2',type:'info',message:'Demo data loaded: 12 students, 3 divisions, 6 classes',timestamp:new Date().toISOString()});
})();

// ── HELPERS ──────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const sName = s => `${s.firstName} ${s.lastName}`;
const getStudent = id => STUDENTS.find(s => s.id === id);
const getClass = id => CLASSES.find(c => c.id === id);
const getDivision = id => DIVISIONS.find(d => d.id === id);
const getProvider = id => PROVIDERS.find(p => p.id === id);
const getClassDivision = classId => { const c=getClass(classId); return c?getDivision(c.divisionId):null; };
const getDivisionClasses = divId => CLASSES.filter(c => c.divisionId === divId);
const getDivisionStudents = divId => { const cls=getDivisionClasses(divId); return STUDENTS.filter(s=>cls.some(c=>c.id===s.classId)); };
const getClassStudents = classId => STUDENTS.filter(s => s.classId === classId);
const getProviderStudents = provId => STUDENTS.filter(s => s.providerId === provId);
const getStudentAssessments = sid => ASSESSMENTS.filter(a=>a.studentId===sid).sort((a,b)=>getMonthOrder(a.month)-getMonthOrder(b.month));
const getMonthLabel = id => HEB_MONTHS.find(m=>m.id===id)?.label||id;
const getMonthOrder = id => HEB_MONTHS.find(m=>m.id===id)?.order||0;
const genId = p => `${p}_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
const initials = name => name.split(' ').map(w=>w[0]).join('').slice(0,2);
const fmtDate = iso => iso?new Date(iso).toLocaleDateString('he-IL'):'—';
const fmtTime = iso => iso?new Date(iso).toLocaleTimeString('he-IL',{hour:'2-digit',minute:'2-digit'}):'—';
const ACOLORS = ['#005778','#1a7a9a','#D9A44E','#b8832e','#808285','#003d56','#D9A44E','#1a7a9a'];
const avatarColor = i => ACOLORS[i%ACOLORS.length];
const yearSelect = sel => HEB_YEARS.map(y=>`<option value="${y}" ${y===sel?'selected':''}>${y}</option>`).join('');

function getStudentTrend(sid){
  const ass=getStudentAssessments(sid);
  if(ass.length<2)return'flat';
  let up=0,down=0;
  CATS.forEach(cat=>{
    const l=ass[ass.length-1].categories[cat.id],p=ass[ass.length-2].categories[cat.id];
    const ls=(l?.correct||0)-(l?.mistakes||0),ps=(p?.correct||0)-(p?.mistakes||0);
    if(ls>ps+1)up++;else if(ls<ps-1)down++;
  });
  return up>=3?'up':down>=3?'down':'flat';
}
function trendBadge(t){
  if(t==='up')return'<span class="badge badge-success">↑ Improving</span>';
  if(t==='down')return'<span class="badge badge-danger">↓ Declining</span>';
  return'<span class="badge badge-neutral">→ Stable</span>';
}
function trendIcon(t){
  if(t==='up')return'<span style="color:#1a6038;font-weight:700;font-size:0.75rem">↑ Improving</span>';
  if(t==='down')return'<span style="color:#9a1c1c;font-weight:700;font-size:0.75rem">↓ Declining</span>';
  return'<span style="color:#808285;font-weight:700;font-size:0.75rem">→ Stable</span>';
}
function getAlerts(){
  const a=[];
  STUDENTS.forEach(s=>{
    const t=getStudentTrend(s.id),ass=getStudentAssessments(s.id);
    if(ass.length<2)return;
    if(t==='down')a.push({type:'danger',title:`${sName(s)} — Declining`,message:'Consistent decline detected',studentId:s.id});
    else if(t==='up')a.push({type:'success',title:`${sName(s)} — Improving`,message:'Consistent improvement',studentId:s.id});
  });
  return a.slice(0,8);
}
function showToast(msg,type='success'){
  const c=$('toastContainer');if(!c)return;
  const t=document.createElement('div');
  t.className=`toast toast-${type}`;
  t.innerHTML=`<span>${{success:'✓',warning:'⚠',danger:'✕',info:'ℹ'}[type]||'✓'}</span><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(()=>{t.style.opacity='0';t.style.transform='translateX(20px)';t.style.transition='all 0.3s';setTimeout(()=>t.remove(),300);},3000);
}
function openModal(id){$(id)?.classList.add('open');}
function closeModal(id){$(id)?.classList.remove('open');}
function toggleSidebar(){$('sidebar')?.classList.toggle('open');$('sidebarOverlay')?.classList.toggle('open');}
function closeSidebar(){$('sidebar')?.classList.remove('open');$('sidebarOverlay')?.classList.remove('open');}
let _charts={};
function destroyCharts(){Object.values(_charts).forEach(c=>{try{c.destroy();}catch(e){}});_charts={};}

// Report helpers
function getReportKey(sid,month,year){return`${sid}_${month}_${year}`;}
function isReportFinal(sid,month,year){return!!REPORT_FINALS[getReportKey(sid,month,year)]?.finalized;}
function finalizeReport(sid,month,year){REPORT_FINALS[getReportKey(sid,month,year)]={...REPORT_FINALS[getReportKey(sid,month,year)],finalized:true};showToast('Report finalized','success');}
function unlockReport(sid,month,year){if(REPORT_FINALS[getReportKey(sid,month,year)])REPORT_FINALS[getReportKey(sid,month,year)].finalized=false;showToast('Report unlocked','info');}
function getReportNote(sid,month,year){return REPORT_FINALS[getReportKey(sid,month,year)]?.note||'';}
function getReportLang(sid,month,year){return REPORT_FINALS[getReportKey(sid,month,year)]?.lang||'en';}
function saveReportNote(sid,month,year,note,lang){REPORT_FINALS[getReportKey(sid,month,year)]={...REPORT_FINALS[getReportKey(sid,month,year)],note,lang};}

// Video helpers
function getVideoKey(sid,month,year){return`${sid}_${month}_${year}`;}
function getStudentVideo(sid,month,year){return STUDENT_VIDEOS[getVideoKey(sid,month,year)]||null;}
function saveStudentVideo(sid,month,year,file){STUDENT_VIDEOS[getVideoKey(sid,month,year)]={url:URL.createObjectURL(file),name:file.name,month,year,studentId:sid};}

// AI notes
const YIDDISH_NOTES={up:['דער תלמיד האט זיך אין דעם חודש שטארק פארבעסערט. ער לייענט מיט גרויס פלייס און פארשטייט גוט. מיר זענען זייער צופרידן מיט זיין פארשריט.','א שיינע פארבעסערונג דעם חודש! דער תלמיד לייענט פלינקער און מיט מער זיכערקייט.'],down:['דעם חודש האט דער תלמיד עטוואס שווערע צייטן. מיר וועלן אים מער אויפמערקזאמקייט גיבן.','עס זענען פאראן עטלעכע חסרונות דעם חודש. מיר ביטן די עלטערן צו חזרן מיט דעם קינד בבית.'],flat:['דער תלמיד האלט זיין ניוואו גוט. ער לייענט מיט קאנסיסטענץ.','א שטייענדיקע לייסטונג דעם חודש. דער תלמיד ארבעט פלייסיק.']};
const ENGLISH_NOTES={up:['Strong progress this month. Continues to build fluency and accuracy across all categories.','Excellent improvement this month. Reading with greater confidence and speed.'],down:['Some challenges this month. Additional practice at home is recommended.','A difficult month. We will provide extra support to help get back on track.'],flat:['Steady performance this month. Maintaining consistent reading skills.','Solid and reliable work this month. Continuing at a good pace.']};
function generateAINote(sid,trend,lang){const pool=lang==='yi'?YIDDISH_NOTES[trend]||YIDDISH_NOTES.flat:ENGLISH_NOTES[trend]||ENGLISH_NOTES.flat;return pool[Math.floor(Math.random()*pool.length)];}

// Download helper
function downloadHTML(htmlContent,filename){
  const blob=new Blob([`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{margin:0;padding:20px;font-family:'Frank Ruhl Libre',serif;direction:rtl;background:#fff}</style></head><body>${htmlContent}</body></html>`],{type:'text/html'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename;a.click();URL.revokeObjectURL(a.href);
}

// PDF generation with embedded assets
async function generatePDF(el,filename,landscape=false){
  if(!el){showToast('Content not found','warning');return;}
  showToast('Generating PDF...','info');
  try{
    const{jsPDF}=window.jspdf;
    // Swap img srcs to base64
    const imgs=el.querySelectorAll('img');const origSrcs=[];
    imgs.forEach(img=>{origSrcs.push(img.src);if(img.src.includes('letterhead'))img.src=LETTERHEAD_B64;else if(img.src.includes('logo'))img.src=LOGO_B64;});
    const canvas=await html2canvas(el,{scale:2.5,useCORS:true,allowTaint:true,backgroundColor:'#ffffff',logging:false,imageTimeout:0});
    imgs.forEach((img,i)=>img.src=origSrcs[i]);
    const imgData=canvas.toDataURL('image/jpeg',0.92);
    const pdf=new jsPDF({orientation:landscape?'landscape':'portrait',unit:'mm',format:'a4'});
    const pdfW=pdf.internal.pageSize.getWidth(),pdfH=pdf.internal.pageSize.getHeight();
    const imgH=(canvas.height*pdfW)/canvas.width;
    if(imgH<=pdfH){pdf.addImage(imgData,'JPEG',0,0,pdfW,imgH);}
    else{let y=0;while(y<imgH){if(y>0)pdf.addPage();pdf.addImage(imgData,'JPEG',0,-y,pdfW,imgH);y+=pdfH;}}
    pdf.save(filename);showToast('PDF downloaded!','success');
  }catch(e){console.error(e);showToast('Downloading as HTML','warning');downloadHTML(el.outerHTML,filename.replace('.pdf','.html'));}
}

// ── NAVIGATION ───────────────────────────────────────────────
let _page='dashboard',_params={},_profileTab='overview';
let _ss='',_sp='',_st='';

function navigate(page,params={}){
  _page=page;_params=params;
  document.querySelectorAll('.nav-item').forEach(el=>el.classList.remove('active'));
  const navMap={student_profile:'students',class_profile:'programs',provider_profile:'programs'};
  const navEl=document.querySelector(`.nav-item[data-page="${navMap[page]||page}"]`);
  if(navEl)navEl.classList.add('active');
  const names={dashboard:'Dashboard',students:'Students',student_profile:'Student Profile',programs:'Programs & Classes',reports:'Monthly Reports',worksheets:'Worksheets',ocr:'Upload Worksheet',analytics:'Analytics',admin:'Admin Panel',videos:'Upload Videos'};
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
      else if(page==='programs')renderPrograms();
      else if(page==='class_profile')renderClassProfile(params.classId);
      else if(page==='provider_profile')renderProviderProfile(params.providerId);
      else if(page==='worksheets')renderWorksheets();
      else if(page==='reports')renderReports();
      else if(page==='ocr')renderOCR();
      else if(page==='analytics')renderAnalytics();
      else if(page==='admin')renderAdmin();
      else if(page==='videos')renderVideosPage();
    }catch(e){
      console.error('[KT]',page,e);
      content.innerHTML=`<div style="padding:40px;color:#9a1c1c;font-family:monospace;font-size:0.85rem"><strong>Error on ${page}:</strong><br>${e.message}<br><pre style="margin-top:10px;font-size:0.72rem;overflow:auto">${e.stack}</pre></div>`;
    }
    content.style.transition='opacity 0.2s';content.style.opacity='1';
    $('studentsBadge')&&($('studentsBadge').textContent=STUDENTS.length);
    closeSidebar();window.scrollTo({top:0,behavior:'smooth'});
  });
}

// ── DASHBOARD ────────────────────────────────────────────────
function renderDashboard(){
  const total=ASSESSMENTS.length,monthly=ASSESSMENTS.filter(a=>a.month===CUR_MONTH).length;
  const improving=STUDENTS.filter(s=>getStudentTrend(s.id)==='up').length;
  const struggling=STUDENTS.filter(s=>getStudentTrend(s.id)==='down').length;
  const alerts=getAlerts();
  $('pageContent').innerHTML=`
<div class="page-header">
  <div><h1 class="page-title">Dashboard</h1><p class="page-subtitle" style="font-size:0.95rem;font-weight:700;color:#005778">Ichud Boys Program — Kriah Tracking</p><p class="page-subtitle">Year-to-date — <span class="he">${CUR_YEAR}</span></p></div>
  <div style="display:flex;gap:8px"><button class="btn btn-outline btn-sm" onclick="navigate('analytics')">Analytics</button><button class="btn btn-primary btn-sm" onclick="navigate('ocr')">Upload Worksheet</button></div>
</div>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:22px">
  ${DIVISIONS.map(div=>{const ss=getDivisionStudents(div.id),cls=getDivisionClasses(div.id),imp=ss.filter(s=>getStudentTrend(s.id)==='up').length;return`<div class="card" style="cursor:pointer;border-top:4px solid ${div.color}" onclick="navigate('programs')"><div class="card-body" style="padding:16px"><div style="font-size:1rem;font-weight:800;color:${div.color};margin-bottom:10px">${div.name}</div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;text-align:center"><div><div style="font-size:1.3rem;font-weight:900;color:#1a2a2a">${cls.length}</div><div style="font-size:0.68rem;color:#808285">Classes</div></div><div><div style="font-size:1.3rem;font-weight:900;color:#005778">${ss.length}</div><div style="font-size:0.68rem;color:#808285">Students</div></div><div><div style="font-size:1.3rem;font-weight:900;color:#1a6038">${imp}</div><div style="font-size:0.68rem;color:#808285">Improving</div></div></div></div></div>`;}).join('')}
</div>
<div class="kpi-grid">
  <div class="kpi-card" onclick="navigate('students')" style="cursor:pointer"><div class="kpi-icon" style="background:#e0eef5;color:#005778"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div><div class="kpi-value">${STUDENTS.length}</div><div class="kpi-label">Total Students</div><div class="kpi-trend up">↑ <span class="he">${CUR_YEAR}</span></div></div>
  <div class="kpi-card gold" onclick="navigate('programs')" style="cursor:pointer"><div class="kpi-icon" style="background:#fdf3e3;color:#D9A44E"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div><div class="kpi-value">${CLASSES.length}</div><div class="kpi-label">Classes</div><div class="kpi-trend neutral">${PROVIDERS.length} providers</div></div>
  <div class="kpi-card success"><div class="kpi-icon" style="background:#e4f2eb;color:#1a6038"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div><div class="kpi-value">${total}</div><div class="kpi-label">YTD Assessments</div><div class="kpi-trend up">↑ ${monthly} this month</div></div>
  <div class="kpi-card ${improving>=struggling?'success':'warning'}"><div class="kpi-icon" style="background:${improving>=struggling?'#e4f2eb':'#fff3e0'};color:${improving>=struggling?'#1a6038':'#7a4800'}"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg></div><div class="kpi-value">${improving}</div><div class="kpi-label">Improving</div><div class="kpi-trend ${struggling>0?'down':'up'}">${struggling} need attention</div></div>
</div>
${alerts.length?`<div class="card mb-6"><div class="card-header"><span class="card-title">Active Alerts</span><span class="badge badge-danger">${alerts.length}</span></div><div class="card-body" style="padding:14px"><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:8px">${alerts.slice(0,6).map(a=>`<div class="alert alert-${a.type}" style="margin:0;cursor:pointer" onclick="navigate('student_profile',{studentId:'${a.studentId}'})"><div><div style="font-weight:700;font-size:0.84rem">${a.title}</div><div style="font-size:0.76rem;margin-top:2px">${a.message}</div></div></div>`).join('')}</div></div></div>`:''}
<div class="grid-2 mb-6">
  <div class="card"><div class="card-header"><span class="card-title">Category Trends — YTD</span></div><div class="card-body"><div class="chart-container"><canvas id="catChart"></canvas></div></div></div>
  <div class="card"><div class="card-header"><span class="card-title">Division Comparison</span></div><div class="card-body"><div class="chart-container"><canvas id="divChart"></canvas></div></div></div>
</div>
<div class="grid-2">
  <div class="card"><div class="card-header"><span class="card-title">Recent Activity</span><button class="btn btn-ghost btn-sm" onclick="navigate('admin')">View All</button></div><div class="card-body" style="padding:0 20px">${SYS_LOGS.slice(0,6).map(l=>`<div style="display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid #e8d9b8;font-size:0.82rem"><div style="width:7px;height:7px;border-radius:50%;margin-top:5px;flex-shrink:0;background:${{success:'#1a6038',warning:'#D9A44E',danger:'#9a1c1c',info:'#005778'}[l.type]||'#808285'}"></div><div style="font-size:0.7rem;color:#808285;white-space:nowrap;min-width:80px">${fmtTime(l.timestamp)}</div><div style="flex:1;color:#444">${l.message}</div></div>`).join('')}</div></div>
  <div class="card"><div class="card-header"><span class="card-title">Students — <span class="he">סיון תשפ״ו</span></span><button class="btn btn-ghost btn-sm" onclick="navigate('students')">All Students</button></div><div class="card-body" style="padding:0"><table><thead><tr><th>Student</th><th>Class</th><th>Division</th><th>Trend</th></tr></thead><tbody>${STUDENTS.slice(0,7).map((s,i)=>{const t=getStudentTrend(s.id),cls=getClass(s.classId),div=getClassDivision(s.classId);return`<tr class="clickable" onclick="navigate('student_profile',{studentId:'${s.id}'})"><td class="primary"><div style="display:flex;align-items:center;gap:8px"><div class="user-avatar" style="width:28px;height:28px;font-size:0.65rem;background:${avatarColor(i)}">${initials(sName(s))}</div><span class="he">${sName(s)}</span></div></td><td style="font-size:0.8rem">${cls?cls.name:'—'}</td><td style="font-size:0.8rem;color:#005778;font-weight:600">${div?div.name:'—'}</td><td>${trendIcon(t)}</td></tr>`;}).join('')}</tbody></table></div></div>
</div>`;
  setTimeout(()=>{
    const c1=$('catChart');if(c1){const months=HEB_MONTHS.slice(0,9);_charts.cat=new Chart(c1,{type:'line',data:{labels:months.map(m=>m.label),datasets:CATS.map(cat=>({label:cat.label,tension:0.4,fill:false,pointRadius:3,borderColor:cat.color,backgroundColor:cat.color+'20',data:months.map(m=>{const ass=ASSESSMENTS.filter(a=>a.month===m.id);return ass.length?Math.round(ass.reduce((s,a)=>s+(a.categories[cat.id]?.correct||0),0)/ass.length*10)/10:null;})}))},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:10},padding:8}}},scales:{x:{grid:{color:'#f0f0f0'}},y:{beginAtZero:true,grid:{color:'#f0f0f0'}}}}});}
    const c2=$('divChart');if(c2){_charts.div=new Chart(c2,{type:'bar',data:{labels:DIVISIONS.map(d=>d.name),datasets:CATS.map(cat=>({label:cat.label,backgroundColor:cat.color+'CC',borderColor:cat.color,borderWidth:1,data:DIVISIONS.map(div=>{const ss=getDivisionStudents(div.id),ass=ASSESSMENTS.filter(a=>ss.some(s=>s.id===a.studentId));return ass.length?Math.round(ass.reduce((s,a)=>s+(a.categories[cat.id]?.correct||0),0)/ass.length*10)/10:0;})}))},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:10},padding:6}}},scales:{x:{grid:{display:false}},y:{beginAtZero:true,grid:{color:'#f0f0f0'}}}}});}
  },80);
}

// ── PROGRAMS & CLASSES PAGE ──────────────────────────────────
function renderPrograms(){
  $('pageContent').innerHTML=`
<div class="page-header">
  <div><h1 class="page-title">Programs & Classes</h1><p class="page-subtitle">Ichud Boys Program — Divisions, Classes, Providers</p></div>
  <div style="display:flex;gap:8px;flex-wrap:wrap">
    <button class="btn btn-outline btn-sm" onclick="openAddClassModal()">+ Add Class</button>
    <button class="btn btn-primary btn-sm" onclick="openAddProviderModal()">+ Add Provider</button>
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
      ?`<div style="display:flex;align-items:center;gap:14px"><div class="user-avatar" style="width:48px;height:48px;font-size:1rem;background:linear-gradient(135deg,#D9A44E,#b8832e)">${KRIAH_DIRECTOR.name.split(' ').map(w=>w[0]).join('').slice(0,2)}</div><div><div style="font-size:1.05rem;font-weight:800;color:#005778">${KRIAH_DIRECTOR.name}</div><div style="font-size:0.84rem;color:#808285;margin-top:2px">${KRIAH_DIRECTOR.email}</div><div style="font-size:0.72rem;color:#D9A44E;font-weight:700;margin-top:4px;text-transform:uppercase;letter-spacing:0.5px">Oversees all divisions</div></div></div>`
      :`<div style="text-align:center;padding:12px"><button class="btn btn-gold btn-sm" onclick="editKriahDirector()">+ Set Kriah Director</button></div>`}
  </div>
</div>

<!-- DIVISIONS with classes -->
${DIVISIONS.map(div=>{
  const divClasses=getDivisionClasses(div.id);
  const divStudents=getDivisionStudents(div.id);
  return`<div class="card mb-4" style="border-top:4px solid ${div.color}">
    <div class="card-header" style="background:linear-gradient(135deg,${div.color},${div.color}cc)">
      <span class="card-title" style="color:#fff;font-size:1rem">${div.name} Division</span>
      <div style="display:flex;align-items:center;gap:10px">
        <span style="color:rgba(255,255,255,0.7);font-size:0.8rem">${divClasses.length} classes · ${divStudents.length} students</span>
        <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.3)" onclick="openAddClassModal('${div.id}')">+ Class</button>
      </div>
    </div>
    <div class="card-body">
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px">
        ${divClasses.map((cls,ci)=>{
          const clsStudents=getClassStudents(cls.id);
          const clsImp=clsStudents.filter(s=>getStudentTrend(s.id)==='up').length;
          return`<div style="border:1px solid #e8d9b8;border-radius:10px;overflow:hidden;cursor:pointer;transition:all 0.2s" onclick="navigate('class_profile',{classId:'${cls.id}'})" onmouseenter="this.style.boxShadow='0 4px 12px rgba(0,87,120,0.15)'" onmouseleave="this.style.boxShadow=''">
            <div style="background:${div.color};padding:10px 14px;color:#fff;display:flex;align-items:center;justify-content:space-between">
              <div><div style="font-weight:800;font-size:0.9rem">${cls.name}</div><div style="font-size:0.7rem;opacity:0.8">${cls.grade}</div></div>
              <div style="text-align:center"><div style="font-size:1.3rem;font-weight:900">${clsStudents.length}</div><div style="font-size:0.62rem;opacity:0.8">students</div></div>
            </div>
            <div style="padding:8px 14px;background:#fff;font-size:0.78rem;color:#808285"><span style="color:#1a6038;font-weight:700">${clsImp} improving</span></div>
          </div>`;
        }).join('')}
        ${divClasses.length===0?'<div style="color:#808285;font-size:0.84rem;padding:8px">No classes yet</div>':''}
      </div>
    </div>
  </div>`;
}).join('')}

<!-- PROVIDERS -->
<div class="card">
  <div class="card-header"><span class="card-title">Providers — Staff Caseloads (${PROVIDERS.length})</span><button class="btn btn-primary btn-sm" onclick="openAddProviderModal()">+ Add Provider</button></div>
  <div class="table-wrapper"><table>
    <thead><tr><th>Provider</th><th>Email</th><th>Caseload</th><th>Actions</th></tr></thead>
    <tbody>${PROVIDERS.map((prov,i)=>{
      const studs=getProviderStudents(prov.id);
      return`<tr>
        <td class="primary"><div style="display:flex;align-items:center;gap:8px"><div class="user-avatar" style="width:30px;height:30px;font-size:0.65rem;background:${avatarColor(i)}">${initials(prov.name)}</div>${prov.name}</div></td>
        <td style="font-size:0.82rem;color:#808285">${prov.email}</td>
        <td><div style="display:flex;flex-wrap:wrap;gap:5px">${studs.map(s=>`<span class="he" style="background:#e0eef5;color:#005778;padding:2px 8px;border-radius:20px;font-size:0.75rem;font-weight:600;cursor:pointer" onclick="navigate('student_profile',{studentId:'${s.id}'})">${sName(s)}</span>`).join('')}${studs.length===0?'<span style="color:#808285;font-size:0.8rem">No students</span>':''}</div></td>
        <td><button class="btn btn-outline btn-sm" onclick="navigate('provider_profile',{providerId:'${prov.id}'})">View</button></td>
      </tr>`;
    }).join('')}</tbody>
  </table></div>
</div>`;
}

function editKriahDirector(){
  const name=prompt('Kriah Director Name:',KRIAH_DIRECTOR.name||'');if(name===null)return;
  const email=prompt('Email:',KRIAH_DIRECTOR.email||'');if(email===null)return;
  KRIAH_DIRECTOR.name=name.trim();KRIAH_DIRECTOR.email=email.trim();
  showToast('Kriah Director updated','success');navigate('programs');
}

function openAddClassModal(divId){
  const name=prompt('Class name:','');if(!name)return;
  const grade=prompt('Grade (e.g. 1st):','');
  let targetDivId=divId;
  if(!targetDivId){
    const choice=prompt(`Division:\n${DIVISIONS.map((d,i)=>`${i+1}. ${d.name}`).join('\n')}\nEnter number:`,'1');
    targetDivId=DIVISIONS[parseInt(choice)-1]?.id||DIVISIONS[0].id;
  }
  CLASSES.push({id:genId('cls'),name:name.trim(),divisionId:targetDivId,grade:(grade||'').trim()});
  showToast(`Class "${name}" added`,'success');navigate('programs');
}

function openAddProviderModal(){
  const name=prompt('Provider name (e.g. Rabbi Goldstein):','');if(!name)return;
  const email=prompt('Email:','');
  const phone=prompt('Phone (optional):','');
  PROVIDERS.push({id:genId('prov'),name:name.trim(),email:(email||'').trim(),phone:(phone||'').trim()});
  showToast(`Provider "${name}" added`,'success');navigate('programs');
}

// ── CLASS PROFILE ────────────────────────────────────────────
function renderClassProfile(classId){
  const cls=getClass(classId);if(!cls){$('pageContent').innerHTML='<div style="padding:40px">Class not found</div>';return;}
  const div=getClassDivision(classId);
  const students=getClassStudents(classId);
  const hs=$('headerSubBreadcrumb');if(hs)hs.textContent=` › ${cls.name}`;
  $('pageContent').innerHTML=`
<div style="margin-bottom:14px"><button class="btn btn-ghost btn-sm" onclick="navigate('programs')">← Back</button></div>
<div class="student-profile-header">
  <div style="display:flex;align-items:center;gap:18px">
    <div class="user-avatar" style="width:64px;height:64px;font-size:1.4rem">${cls.name.slice(0,2)}</div>
    <div style="flex:1"><div style="font-size:1.5rem;font-weight:900;color:#fff">${cls.name}</div><div style="font-size:0.95rem;color:rgba(255,255,255,0.8);margin-top:3px">${cls.grade}</div>${div?`<div style="margin-top:8px"><span style="background:rgba(217,164,78,0.3);color:#D9A44E;font-size:0.75rem;font-weight:800;padding:3px 10px;border-radius:20px;border:1px solid rgba(217,164,78,0.4)">${div.name} Division</span></div>`:''}</div>
    <div style="display:flex;gap:8px"><button class="btn btn-gold btn-sm" onclick="navigate('worksheets')">Worksheet</button><button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.3)" onclick="navigate('reports')">Reports</button></div>
  </div>
</div>
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:22px">
  <div class="kpi-card"><div class="kpi-value">${students.length}</div><div class="kpi-label">Students</div></div>
  <div class="kpi-card success"><div class="kpi-value">${students.filter(s=>getStudentTrend(s.id)==='up').length}</div><div class="kpi-label">Improving</div></div>
  <div class="kpi-card danger"><div class="kpi-value">${students.filter(s=>getStudentTrend(s.id)==='down').length}</div><div class="kpi-label">At Risk</div></div>
  <div class="kpi-card gold"><div class="kpi-value">${ASSESSMENTS.filter(a=>students.some(s=>s.id===a.studentId)).length}</div><div class="kpi-label">Assessments</div></div>
</div>
<div class="card"><div class="card-header"><span class="card-title">Students in ${cls.name} (${students.length})</span><button class="btn btn-primary btn-sm" onclick="openAddStudentModal()">+ Add Student</button></div>
<div class="table-wrapper"><table><thead><tr><th>Student</th><th>Provider</th><th>Trend</th><th>Assessments</th><th>Actions</th></tr></thead><tbody>
${students.map((s,i)=>{const t=getStudentTrend(s.id),a=getStudentAssessments(s.id),prov=getProvider(s.providerId);return`<tr class="clickable" onclick="navigate('student_profile',{studentId:'${s.id}'})"><td class="primary"><div style="display:flex;align-items:center;gap:8px"><div class="user-avatar" style="width:28px;height:28px;font-size:0.65rem;background:${avatarColor(i)}">${initials(sName(s))}</div><span class="he">${sName(s)}</span></div></td><td style="font-size:0.82rem;color:#808285">${prov?prov.name:'—'}</td><td>${trendBadge(t)}</td><td><span class="badge badge-neutral">${a.length}</span></td><td onclick="event.stopPropagation()"><button class="btn btn-outline btn-sm" onclick="navigate('student_profile',{studentId:'${s.id}'})">Profile</button></td></tr>`;}).join('')}
</tbody></table></div></div>`;
}

// ── PROVIDER PROFILE ─────────────────────────────────────────
function renderProviderProfile(provId){
  const prov=getProvider(provId);if(!prov){$('pageContent').innerHTML='<div style="padding:40px">Provider not found</div>';return;}
  const students=getProviderStudents(provId);
  const hs=$('headerSubBreadcrumb');if(hs)hs.textContent=` › ${prov.name}`;
  $('pageContent').innerHTML=`
<div style="margin-bottom:14px"><button class="btn btn-ghost btn-sm" onclick="navigate('programs')">← Back</button></div>
<div class="student-profile-header">
  <div style="display:flex;align-items:center;gap:18px">
    <div class="user-avatar" style="width:64px;height:64px;font-size:1.4rem">${initials(prov.name)}</div>
    <div style="flex:1"><div style="font-size:1.5rem;font-weight:900;color:#fff">${prov.name}</div><div style="font-size:0.85rem;color:rgba(255,255,255,0.75);margin-top:4px">${prov.email}</div><div style="font-size:0.8rem;color:rgba(255,255,255,0.6);margin-top:4px">Provider — ${students.length} students in caseload</div></div>
    <button class="btn btn-gold btn-sm" onclick="editCaseload('${provId}')">Edit Caseload</button>
  </div>
</div>
<div class="card"><div class="card-header"><span class="card-title">Caseload (${students.length} students)</span></div>
<div class="table-wrapper"><table><thead><tr><th>Student</th><th>Class</th><th>Division</th><th>Trend</th><th>Assessments</th><th>Actions</th></tr></thead><tbody>
${students.map((s,i)=>{const t=getStudentTrend(s.id),a=getStudentAssessments(s.id),cls=getClass(s.classId),div=getClassDivision(s.classId);return`<tr class="clickable" onclick="navigate('student_profile',{studentId:'${s.id}'})"><td class="primary"><div style="display:flex;align-items:center;gap:8px"><div class="user-avatar" style="width:28px;height:28px;font-size:0.65rem;background:${avatarColor(i)}">${initials(sName(s))}</div><span class="he">${sName(s)}</span></div></td><td style="font-weight:600;color:#005778">${cls?cls.name:'—'}</td><td><span style="background:#e0eef5;color:#005778;padding:2px 8px;border-radius:20px;font-size:0.72rem;font-weight:700">${div?div.name:'—'}</span></td><td>${trendBadge(t)}</td><td><span class="badge badge-neutral">${a.length}</span></td><td onclick="event.stopPropagation()"><button class="btn btn-outline btn-sm" onclick="navigate('student_profile',{studentId:'${s.id}'})">Profile</button></td></tr>`;}).join('')}
</tbody></table></div></div>`;
}

function editCaseload(provId){
  const prov=getProvider(provId);if(!prov)return;
  const current=getProviderStudents(provId);
  const overlay=document.createElement('div');
  overlay.style.cssText='position:fixed;inset:0;background:rgba(0,61,86,0.55);z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px)';
  overlay.innerHTML=`<div style="background:#fff;border-radius:16px;box-shadow:0 24px 56px rgba(0,87,120,0.18);width:100%;max-width:600px;max-height:85vh;overflow-y:auto">
    <div style="background:linear-gradient(135deg,#003d56,#005778);padding:18px 24px;border-radius:16px 16px 0 0;display:flex;align-items:center;justify-content:space-between">
      <span style="font-size:1rem;font-weight:800;color:#fff">Caseload — ${prov.name}</span>
      <button onclick="this.closest('[style*=fixed]').remove()" style="width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.15);border:none;color:#fff;cursor:pointer;font-size:0.9rem">✕</button>
    </div>
    <div style="padding:20px">
      <div style="font-size:0.84rem;font-weight:700;color:#808285;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px">Current Students (${current.length})</div>
      <div style="display:flex;flex-wrap:wrap;gap:7px;margin-bottom:18px" id="caseloadCurrent">
        ${current.map(s=>`<div style="display:flex;align-items:center;gap:6px;background:#e0eef5;border:1px solid #b0cfe0;border-radius:20px;padding:4px 12px"><span class="he" style="font-size:0.82rem;font-weight:700;color:#005778">${sName(s)}</span><button onclick="removeFromCaseload('${provId}','${s.id}',this)" style="background:none;border:none;color:#9a1c1c;cursor:pointer;font-size:0.8rem;padding:0;line-height:1">✕</button></div>`).join('')}
        ${current.length===0?'<span style="color:#808285;font-size:0.84rem">No students assigned</span>':''}
      </div>
      <div style="font-size:0.84rem;font-weight:700;color:#808285;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:10px">Add Students</div>
      <div style="max-height:220px;overflow-y:auto;border:1px solid #e8d9b8;border-radius:8px">
        ${STUDENTS.filter(s=>s.providerId!==provId).map(s=>{const cls=getClass(s.classId),div=getClassDivision(s.classId);return`<div style="display:flex;align-items:center;justify-content:space-between;padding:9px 14px;border-bottom:1px solid #e8d9b8;font-size:0.84rem"><div><span class="he" style="font-weight:700">${sName(s)}</span><span style="color:#808285;font-size:0.76rem;margin-right:8px"> — ${cls?cls.name:''} ${div?'('+div.name+')':''}</span></div><button class="btn btn-primary btn-sm" onclick="addToCaseload('${provId}','${s.id}',this)">+ Add</button></div>`;}).join('')}
      </div>
    </div>
  </div>`;
  overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.remove();});
  document.body.appendChild(overlay);
}

function addToCaseload(provId,studentId,btn){
  const s=STUDENTS.find(x=>x.id===studentId);if(!s)return;
  s.providerId=provId;
  if(btn){btn.textContent='✓ Added';btn.disabled=true;btn.style.background='#1a6038';}
  showToast(`${sName(s)} added to caseload`,'success');
}
function removeFromCaseload(provId,studentId,btn){
  const s=STUDENTS.find(x=>x.id===studentId);if(!s)return;
  s.providerId='';
  btn?.closest('[style*="border-radius:20px"]')?.remove();
  showToast(`${sName(s)} removed from caseload`,'warning');
}

// ── STUDENTS LIST ────────────────────────────────────────────
function renderStudents(){
  const f=STUDENTS.filter(s=>{
    const n=sName(s).toLowerCase();
    return(!_ss||n.includes(_ss.toLowerCase()))&&(!_sp||s.classId===_sp)&&(!_st||getStudentTrend(s.id)===_st);
  });
  $('pageContent').innerHTML=`
<div class="page-header">
  <div><h1 class="page-title">Students</h1><p class="page-subtitle">${STUDENTS.length} students — Ichud Boys Program</p></div>
  <div style="display:flex;gap:8px"><button class="btn btn-outline btn-sm" onclick="openCSVImport()">📄 CSV</button><button class="btn btn-primary" onclick="openAddStudentModal()">+ Add Student</button></div>
</div>
<div class="filter-bar">
  <div class="search-bar"><svg class="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><input type="text" placeholder="Search student..." value="${_ss}" oninput="_ss=this.value;renderStudents()"></div>
  <select class="form-control" style="width:auto" onchange="_sp=this.value;renderStudents()">
    <option value="">All Classes</option>
    ${DIVISIONS.map(div=>`<optgroup label="${div.name}">${getDivisionClasses(div.id).map(c=>`<option value="${c.id}" ${_sp===c.id?'selected':''}>${c.name}</option>`).join('')}</optgroup>`).join('')}
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
    const t=getStudentTrend(s.id),ass=getStudentAssessments(s.id),cls=getClass(s.classId),div=getClassDivision(s.classId),prov=getProvider(s.providerId);
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
}

// ── ADD STUDENT MODAL ────────────────────────────────────────
function openAddStudentModal(){
  const overlay=document.createElement('div');
  overlay.style.cssText='position:fixed;inset:0;background:rgba(0,61,86,0.55);z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px)';
  overlay.innerHTML=`<div style="background:#fff;border-radius:16px;box-shadow:0 24px 56px rgba(0,87,120,0.18);width:100%;max-width:560px;max-height:90vh;overflow-y:auto">
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
            ${DIVISIONS.map(div=>`<optgroup label="${div.name}">${getDivisionClasses(div.id).map(c=>`<option value="${c.id}">${c.name}</option>`).join('')}</optgroup>`).join('')}
          </select>
        </div>
        <div class="form-group"><label class="form-label">Provider (1:1 Teacher)</label>
          <select class="form-control" id="ns_prov">
            <option value="">Select provider...</option>
            ${PROVIDERS.map(p=>`<option value="${p.id}">${p.name}</option>`).join('')}
          </select>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px">
        <div class="form-group"><label class="form-label">Parent Email 1</label><input type="email" class="form-control" id="ns_email1" placeholder="parent@email.com"></div>
        <div class="form-group"><label class="form-label">Parent Email 2</label><input type="email" class="form-control" id="ns_email2" placeholder="parent2@email.com"></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px">
        <div class="form-group"><label class="form-label">School Year</label><select class="form-control he" id="ns_year">${yearSelect(CUR_YEAR)}</select></div>
        <div class="form-group"><label class="form-label">Notes</label><input type="text" class="form-control" id="ns_notes" placeholder="Optional notes"></div>
      </div>
    </div>
    <div style="padding:14px 24px;border-top:1px solid #e8d9b8;display:flex;gap:10px;background:#fdf8f0;border-radius:0 0 16px 16px">
      <button class="btn btn-primary" onclick="saveNewStudent(this.closest('[style*=fixed]'))">Save Student</button>
      <button class="btn btn-ghost" onclick="this.closest('[style*=fixed]').remove()">Cancel</button>
    </div>
  </div>`;
  overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.remove();});
  document.body.appendChild(overlay);
}

function saveNewStudent(overlay){
  const fn=$('ns_first')?.value.trim(),ln=$('ns_last')?.value.trim();
  const classId=$('ns_class')?.value,provId=$('ns_prov')?.value;
  const email1=$('ns_email1')?.value.trim(),email2=$('ns_email2')?.value.trim();
  const year=$('ns_year')?.value||CUR_YEAR,notes=$('ns_notes')?.value.trim()||'';
  if(!fn||!ln||!classId){showToast('First name, last name and class are required','warning');return;}
  const emails=[];if(email1)emails.push(email1);if(email2)emails.push(email2);
  const s={id:genId('s'),firstName:fn,lastName:ln,classId,providerId:provId||'',year,status:'active',notes,emails};
  STUDENTS.push(s);
  AUDIT_LOG.unshift({id:genId('a'),action:'Add Student',entity:'Student',entityName:`${fn} ${ln}`,field:'—',before:'—',after:'Created',timestamp:new Date().toISOString()});
  SYS_LOGS.unshift({id:genId('l'),type:'info',message:`Student added: ${fn} ${ln}`,timestamp:new Date().toISOString()});
  overlay?.remove();showToast(`${fn} ${ln} added`,'success');
  $('studentsBadge')&&($('studentsBadge').textContent=STUDENTS.length);
  if(_page==='students')renderStudents();
}

// ── STUDENT PROFILE ──────────────────────────────────────────
function renderStudentProfile(sid){
  const s=getStudent(sid);if(!s){$('pageContent').innerHTML='<div style="padding:40px">Student not found</div>';return;}
  const ass=getStudentAssessments(sid),cls=getClass(s.classId),div=getClassDivision(s.classId),prov=getProvider(s.providerId),t=getStudentTrend(sid),lastA=ass[ass.length-1];
  const hs=$('headerSubBreadcrumb');if(hs)hs.innerHTML=` › <span class="he">${sName(s)}</span>`;
  $('pageContent').innerHTML=`
<div style="margin-bottom:14px"><button class="btn btn-ghost btn-sm" onclick="navigate('students')">← Back to Students</button></div>
<div class="student-profile-header">
  <div style="display:flex;align-items:center;gap:18px">
    <div class="user-avatar" style="width:64px;height:64px;font-size:1.4rem;flex-shrink:0">${initials(sName(s))}</div>
    <div style="flex:1;text-align:right">
      <div class="he" style="font-size:1.5rem;font-weight:900;color:#fff;line-height:1.2">${sName(s)}</div>
      <div style="font-size:0.95rem;font-weight:700;color:rgba(255,255,255,0.85);margin-top:3px">${cls?cls.name:'—'}</div>
      <div style="display:flex;gap:10px;margin-top:8px;flex-wrap:wrap;justify-content:flex-end">
        ${div?`<span style="background:rgba(217,164,78,0.3);color:#D9A44E;font-size:0.72rem;font-weight:800;padding:2px 9px;border-radius:20px;border:1px solid rgba(217,164,78,0.4)">${div.name}</span>`:''}
        ${prov?`<span style="font-size:0.8rem;color:rgba(255,255,255,0.75)">Provider: ${prov.name}</span>`:''}
        <span class="he" style="font-size:0.8rem;color:rgba(255,255,255,0.7)">${s.year}</span>
        ${trendBadge(t)}
      </div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;flex-shrink:0">
      <button class="btn btn-gold btn-sm" onclick="openAddAssessmentModal('${sid}')">+ Assessment</button>
      <button class="btn btn-sm" style="background:rgba(255,255,255,0.15);color:#fff;border:1px solid rgba(255,255,255,0.3)" onclick="${lastA?`showStudentReport('${sid}','${lastA.month}','${lastA.year}')`:"showToast('No assessments yet','warning')"}">📄 Report</button>
      <button class="btn btn-sm" style="background:rgba(217,164,78,0.3);color:#fff;border:1px solid rgba(217,164,78,0.5)" onclick="showFinalReports('${sid}')">✓ Finals</button>
      <button class="btn btn-sm" style="background:rgba(255,255,255,0.1);color:#fff;border:1px solid rgba(255,255,255,0.2)" onclick="openEditStudentModal('${sid}')">✏ Edit</button>
    </div>
  </div>
</div>
<div style="display:flex;border-bottom:2px solid #e8d9b8;margin-bottom:22px">
  ${['overview','assessments','charts','videos'].map(tab=>`<button style="padding:9px 18px;font-size:0.84rem;font-weight:${_profileTab===tab?'700':'600'};color:${_profileTab===tab?'#005778':'#808285'};cursor:pointer;border:none;background:${_profileTab===tab?'#e0eef5':'transparent'};border-bottom:2px solid ${_profileTab===tab?'#005778':'transparent'};margin-bottom:-2px;border-radius:${_profileTab===tab?'8px 8px 0 0':'0'}" onclick="_profileTab='${tab}';renderStudentProfile('${sid}')">${{overview:'Overview',assessments:`Assessments (${ass.length})`,charts:'Charts',videos:'Videos'}[tab]}</button>`).join('')}
</div>
<div id="profileContent"></div>`;
  if(_profileTab==='overview')renderProfileOverview(sid,s,ass,lastA,prov);
  else if(_profileTab==='assessments')renderProfileAssessments(sid,ass);
  else if(_profileTab==='charts')renderProfileCharts(sid,ass);
  else if(_profileTab==='videos')renderStudentVideos12(sid,s);
}

function openEditStudentModal(sid){
  const s=getStudent(sid);if(!s)return;
  const overlay=document.createElement('div');
  overlay.style.cssText='position:fixed;inset:0;background:rgba(0,61,86,0.55);z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px)';
  overlay.innerHTML=`<div style="background:#fff;border-radius:16px;box-shadow:0 24px 56px rgba(0,87,120,0.18);width:100%;max-width:560px;max-height:90vh;overflow-y:auto">
    <div style="background:linear-gradient(135deg,#003d56,#005778);padding:18px 24px;border-radius:16px 16px 0 0;display:flex;align-items:center;justify-content:space-between">
      <span style="font-size:1rem;font-weight:800;color:#fff">Edit Student</span>
      <button onclick="this.closest('[style*=fixed]').remove()" style="width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.15);border:none;color:#fff;cursor:pointer;font-size:0.9rem">✕</button>
    </div>
    <div style="padding:24px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px">
        <div class="form-group"><label class="form-label">First Name</label><input type="text" class="form-control he" id="es_first" value="${s.firstName}"></div>
        <div class="form-group"><label class="form-label">Last Name</label><input type="text" class="form-control he" id="es_last" value="${s.lastName}"></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px">
        <div class="form-group"><label class="form-label">Class</label>
          <select class="form-control" id="es_class">
            ${DIVISIONS.map(div=>`<optgroup label="${div.name}">${getDivisionClasses(div.id).map(c=>`<option value="${c.id}" ${c.id===s.classId?'selected':''}>${c.name}</option>`).join('')}</optgroup>`).join('')}
          </select>
        </div>
        <div class="form-group"><label class="form-label">Provider</label>
          <select class="form-control" id="es_prov">
            <option value="">None</option>
            ${PROVIDERS.map(p=>`<option value="${p.id}" ${p.id===s.providerId?'selected':''}>${p.name}</option>`).join('')}
          </select>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px">
        <div class="form-group"><label class="form-label">Parent Email 1</label><input type="email" class="form-control" id="es_email1" value="${(s.emails||[])[0]||''}"></div>
        <div class="form-group"><label class="form-label">Parent Email 2</label><input type="email" class="form-control" id="es_email2" value="${(s.emails||[])[1]||''}"></div>
      </div>
      <div class="form-group"><label class="form-label">Notes</label><input type="text" class="form-control" id="es_notes" value="${s.notes||''}"></div>
    </div>
    <div style="padding:14px 24px;border-top:1px solid #e8d9b8;display:flex;gap:10px;background:#fdf8f0;border-radius:0 0 16px 16px">
      <button class="btn btn-primary" onclick="saveEditStudent('${sid}',this.closest('[style*=fixed]'))">Save Changes</button>
      <button class="btn btn-ghost" onclick="this.closest('[style*=fixed]').remove()">Cancel</button>
    </div>
  </div>`;
  overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.remove();});
  document.body.appendChild(overlay);
}

function saveEditStudent(sid,overlay){
  const s=getStudent(sid);if(!s)return;
  s.firstName=$('es_first')?.value.trim()||s.firstName;
  s.lastName=$('es_last')?.value.trim()||s.lastName;
  s.classId=$('es_class')?.value||s.classId;
  s.providerId=$('es_prov')?.value||'';
  s.notes=$('es_notes')?.value.trim()||'';
  const e1=$('es_email1')?.value.trim(),e2=$('es_email2')?.value.trim();
  s.emails=[];if(e1)s.emails.push(e1);if(e2)s.emails.push(e2);
  overlay?.remove();showToast('Student updated','success');renderStudentProfile(sid);
}

function renderProfileOverview(sid,s,ass,lastA,prov){
  $('profileContent').innerHTML=`
<div class="grid-2 mb-6">
  <div class="card"><div class="card-header"><span class="card-title">Current Month — <span class="he">${lastA?getMonthLabel(lastA.month)+' '+lastA.year:'No data'}</span></span></div>
    <div class="card-body">${lastA?`<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;direction:rtl">${CATS.map(cat=>{const correct=lastA.categories[cat.id]?.correct||0,mistakes=lastA.categories[cat.id]?.mistakes||0;return`<div style="background:#f8f9fa;border:1px solid #e8d9b8;border-top:3px solid ${cat.color};border-radius:8px;padding:10px;text-align:center"><div class="he" style="font-size:0.65rem;font-weight:700;color:${cat.color};margin-bottom:8px">${cat.label}</div><div style="font-size:1.3rem;font-weight:900;color:#005778">${correct}</div>${cat.hasMistakes?`<div style="font-size:0.62rem;color:#9a1c1c;margin-top:2px">${mistakes} err.</div>`:''}</div>`;}).join('')}</div>`:`<div style="text-align:center;padding:40px;color:#808285">No assessments yet<br><button class="btn btn-primary" style="margin-top:12px" onclick="openAddAssessmentModal('${sid}')">Add First Assessment</button></div>`}</div>
  </div>
  <div class="card"><div class="card-header"><span class="card-title">YTD Summary — <span class="he">${s.year}</span></span></div>
    <div class="card-body">
      ${CATS.map(cat=>{const totC=ass.reduce((sum,a)=>sum+(a.categories[cat.id]?.correct||0),0),totM=ass.reduce((sum,a)=>sum+(a.categories[cat.id]?.mistakes||0),0);return`<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;margin-bottom:4px"><span class="he" style="font-weight:700;font-size:0.85rem;color:${cat.color}">${cat.label}</span><span style="font-size:0.78rem"><span style="color:#1a6038;font-weight:700">${totC}</span>${cat.hasMistakes?` / <span style="color:#9a1c1c;font-weight:700">${totM}</span>`:''}</span></div><div style="background:#f0ece4;border-radius:20px;height:6px;overflow:hidden"><div style="height:100%;border-radius:20px;background:${cat.color};width:${Math.min(100,totC*2)}%"></div></div></div>`;}).join('')}
      <div style="border-top:1px solid #e8d9b8;margin-top:12px;padding-top:12px">
        <div style="display:flex;justify-content:space-between;font-size:0.84rem;margin-bottom:6px"><span style="color:#808285">Total Assessments</span><span style="font-weight:800">${ass.length}</span></div>
        <div style="display:flex;justify-content:space-between;font-size:0.84rem;margin-bottom:6px"><span style="color:#808285">Provider</span><span style="font-weight:700">${prov?prov.name:'—'}</span></div>
        ${(s.emails||[]).length>0?`<div style="display:flex;justify-content:space-between;font-size:0.84rem"><span style="color:#808285">Parent Email(s)</span><div style="text-align:right">${s.emails.map(e=>`<div style="font-size:0.8rem">${e}</div>`).join('')}</div></div>`:''}
      </div>
    </div>
  </div>
</div>
<div class="card"><div class="card-header"><span class="card-title">Monthly Breakdown</span></div>
  <div class="table-wrapper"><table>
    <thead><tr><th>Month</th>${CATS.map(c=>`<th colspan="${c.hasMistakes?2:1}" style="text-align:center;border-right:2px solid rgba(255,255,255,0.2)"><span class="he" style="font-size:0.7rem">${c.label}</span></th>`).join('')}<th>Source</th></tr>
    <tr style="background:#1a7a9a">${['<th></th>'].concat(CATS.flatMap(c=>c.hasMistakes?['<th style="font-size:0.7rem;color:#a8e0e0;text-align:center">✓</th>','<th style="font-size:0.7rem;color:#ffaaaa;text-align:center;border-right:2px solid rgba(255,255,255,0.15)">✗</th>']:['<th style="font-size:0.7rem;color:#a8e0e0;text-align:center;border-right:2px solid rgba(255,255,255,0.15)">✓</th>'])).concat(['<th></th>']).join('')}</tr></thead>
    <tbody>${ass.length===0?`<tr><td colspan="${2+CATS.reduce((s,c)=>s+(c.hasMistakes?2:1),0)}" style="text-align:center;padding:24px;color:#808285">No assessments</td></tr>`:ass.map(a=>`<tr><td><span class="he" style="background:#005778;color:#fff;padding:3px 9px;border-radius:20px;font-size:0.72rem;font-weight:700">${getMonthLabel(a.month)} ${a.year}</span></td>${CATS.map(cat=>{const c=a.categories[cat.id]?.correct||0,m=a.categories[cat.id]?.mistakes||0;return cat.hasMistakes?`<td style="text-align:center;font-weight:700;color:#1a6038">${c}</td><td style="text-align:center;font-weight:700;color:#9a1c1c;border-right:2px solid #e8d9b8">${m}</td>`:`<td style="text-align:center;font-weight:700;color:#1a6038;border-right:2px solid #e8d9b8">${c}</td>`;}).join('')}<td><span class="badge ${a.source==='ocr'?'badge-blue':'badge-neutral'}">${a.source==='ocr'?'OCR':'Manual'}</span></td></tr>`).join('')}</tbody>
  </table></div>
</div>`;
}

function renderProfileAssessments(sid,ass){
  $('profileContent').innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><h3>${ass.length} Assessments — <span class="he">${CUR_YEAR}</span></h3><button class="btn btn-primary btn-sm" onclick="openAddAssessmentModal('${sid}')">+ Add Assessment</button></div>
${ass.length===0?`<div style="text-align:center;padding:60px;color:#808285">No assessments yet</div>`:ass.map(a=>`<div class="card mb-4"><div class="card-header"><span class="card-title"><span class="he">${getMonthLabel(a.month)} ${a.year}</span> <span class="badge ${a.source==='ocr'?'badge-blue':'badge-neutral'}" style="margin-right:8px">${a.source==='ocr'?'OCR':'Manual'}</span></span><div style="display:flex;gap:8px;align-items:center"><span style="font-size:0.76rem;color:#808285">${fmtDate(a.createdAt)}</span><button class="btn btn-danger btn-sm" onclick="delAssess('${a.id}','${sid}')">Delete</button></div></div><div class="card-body"><div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;direction:rtl">${CATS.map(cat=>{const c=a.categories[cat.id]?.correct||0,m=a.categories[cat.id]?.mistakes||0;return`<div style="background:#f8f9fa;border:1px solid #e8d9b8;border-top:3px solid ${cat.color};border-radius:8px;padding:10px;text-align:center"><div class="he" style="font-size:0.65rem;font-weight:700;color:${cat.color};margin-bottom:8px">${cat.label}</div><div style="font-size:1.3rem;font-weight:900;color:#005778">${c}</div>${cat.hasMistakes?`<div style="font-size:0.62rem;color:#9a1c1c;margin-top:2px">${m} err.</div>`:''}</div>`;}).join('')}</div></div></div>`).join('')}`;
}

function renderProfileCharts(sid,ass){
  if(ass.length<2){$('profileContent').innerHTML=`<div style="text-align:center;padding:60px;color:#808285">At least 2 assessments needed for charts<br><button class="btn btn-primary" style="margin-top:12px" onclick="openAddAssessmentModal('${sid}')">Add Assessment</button></div>`;return;}
  $('profileContent').innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:18px">${CATS.map(cat=>`<div class="card"><div class="card-header"><span class="card-title he" style="color:${cat.color}">${cat.label}</span></div><div class="card-body"><div style="position:relative;height:160px"><canvas id="ch_${cat.id}"></canvas></div></div></div>`).join('')}</div>`;
  setTimeout(()=>{const labels=ass.map(a=>getMonthLabel(a.month));CATS.forEach(cat=>{const ctx=$(`ch_${cat.id}`);if(!ctx)return;_charts[cat.id]=new Chart(ctx,{type:'line',data:{labels,datasets:[{label:'Correct',data:ass.map(a=>a.categories[cat.id]?.correct||0),borderColor:cat.color,backgroundColor:cat.color+'30',tension:0.4,fill:true,pointRadius:4},{label:'Mistakes',data:ass.map(a=>a.categories[cat.id]?.mistakes||0),borderColor:'#9a1c1c',backgroundColor:'#9a1c1c20',tension:0.4,fill:false,borderDash:[5,5],pointRadius:3}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:9},padding:6}}},scales:{x:{grid:{color:'#f5f5f5'}},y:{beginAtZero:true,grid:{color:'#f5f5f5'}}}}});});},60);
}

function delAssess(aid,sid){if(!confirm('Delete this assessment?'))return;ASSESSMENTS=ASSESSMENTS.filter(a=>a.id!==aid);showToast('Assessment deleted','warning');renderStudentProfile(sid);}

function renderStudentVideos12(sid,s){
  $('profileContent').innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px"><h3>Reading Videos — <span class="he">${sName(s)}</span></h3><div style="font-size:0.84rem;color:#808285">One video per month</div></div>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px">
  ${HEB_MONTHS.map(m=>{const video=getStudentVideo(sid,m.id,CUR_YEAR);return`<div style="border:1px solid #e8d9b8;border-radius:10px;overflow:hidden"><div style="background:linear-gradient(135deg,#005778,#1a7a9a);padding:10px 14px;color:#fff;display:flex;align-items:center;justify-content:space-between"><span class="he" style="font-weight:800;font-size:0.9rem">${m.label}</span><span class="he" style="font-size:0.72rem;opacity:0.7">${CUR_YEAR}</span></div><div style="padding:12px;background:#fff">${video?`<video src="${video.url}" controls style="width:100%;border-radius:6px;max-height:130px;background:#000"></video><div style="font-size:0.7rem;color:#808285;margin-top:5px;text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${video.name}</div><button class="btn btn-ghost btn-sm" style="width:100%;margin-top:7px;font-size:0.75rem" onclick="uploadVideoFor('${sid}','${m.id}','${CUR_YEAR}')">Replace</button>`:`<div style="border:2px dashed #b0cfe0;border-radius:7px;padding:18px;text-align:center;cursor:pointer;background:#e0eef5;transition:all 0.2s" onclick="uploadVideoFor('${sid}','${m.id}','${CUR_YEAR}')" onmouseenter="this.style.background='#c8dff0'" onmouseleave="this.style.background='#e0eef5'"><div style="font-size:1.6rem;margin-bottom:4px">🎥</div><div style="font-size:0.78rem;color:#005778;font-weight:600">Upload</div></div>`}</div></div>`;}).join('')}
</div>`;
}

function uploadVideoFor(sid,month,year){
  const input=document.createElement('input');input.type='file';input.accept='video/*';
  input.onchange=e=>{const file=e.target.files[0];if(!file)return;if(file.size>200*1024*1024){showToast('Video must be under 200MB','warning');return;}saveStudentVideo(sid,month,year,file);showToast(`Video uploaded for ${getMonthLabel(month)}`,'success');renderStudentProfile(sid);};
  input.click();
}

function showFinalReports(sid){
  const s=getStudent(sid),ass=getStudentAssessments(sid);
  const finals=ass.filter(a=>isReportFinal(sid,a.month,a.year));
  const overlay=document.createElement('div');
  overlay.style.cssText='position:fixed;inset:0;background:rgba(0,61,86,0.55);z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px)';
  overlay.innerHTML=`<div style="background:#fff;border-radius:16px;box-shadow:0 24px 56px rgba(0,87,120,0.18);width:100%;max-width:700px;max-height:85vh;overflow-y:auto">
    <div style="background:linear-gradient(135deg,#003d56,#005778);padding:18px 24px;border-radius:16px 16px 0 0;display:flex;align-items:center;justify-content:space-between">
      <span style="font-size:1rem;font-weight:800;color:#fff">Final Reports — <span class="he">${sName(s)}</span></span>
      <button onclick="this.closest('[style*=fixed]').remove()" style="width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.15);border:none;color:#fff;cursor:pointer;font-size:0.9rem">✕</button>
    </div>
    <div style="padding:20px">${finals.length===0?'<div style="text-align:center;padding:40px;color:#808285">No finalized reports yet</div>':`<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px">${finals.map(a=>`<div style="border:1px solid #e8d9b8;border-radius:10px;overflow:hidden;cursor:pointer" onclick="showStudentReport('${sid}','${a.month}','${a.year}')"><div style="background:linear-gradient(135deg,#005778,#1a7a9a);padding:12px 14px;color:#fff"><div class="he" style="font-weight:800;font-size:0.95rem">${getMonthLabel(a.month)}</div><div class="he" style="font-size:0.75rem;opacity:0.8">${a.year}</div></div><div style="padding:10px 14px;background:#fff">${CATS.map(cat=>`<div style="display:flex;justify-content:space-between;font-size:0.78rem;padding:2px 0"><span class="he" style="color:${cat.color};font-weight:600">${cat.label}</span><span style="font-weight:700;color:#005778">${a.categories[cat.id]?.correct||0}</span></div>`).join('')}</div><div style="padding:8px 14px;background:#fdf8f0;border-top:1px solid #e8d9b8;display:flex;gap:6px"><button class="btn btn-primary btn-sm" style="flex:1" onclick="event.stopPropagation();showStudentReport('${sid}','${a.month}','${a.year}')">View</button></div></div>`).join('')}</div>`}</div>
  </div>`;
  overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.remove();});
  document.body.appendChild(overlay);
}

// ── ASSESSMENT MODAL ─────────────────────────────────────────
let _assessSid=null;
function openAddAssessmentModal(sid){
  _assessSid=sid;const s=getStudent(sid);
  const overlay=document.createElement('div');
  overlay.style.cssText='position:fixed;inset:0;background:rgba(0,61,86,0.55);z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px)';
  overlay.innerHTML=`<div style="background:#fff;border-radius:16px;box-shadow:0 24px 56px rgba(0,87,120,0.18);width:100%;max-width:680px;max-height:90vh;overflow-y:auto">
    <div style="background:linear-gradient(135deg,#003d56,#005778);padding:18px 24px;border-radius:16px 16px 0 0;display:flex;align-items:center;justify-content:space-between">
      <span style="font-size:1rem;font-weight:800;color:#fff">Add Assessment — <span class="he">${sName(s)}</span></span>
      <button onclick="this.closest('[style*=fixed]').remove()" style="width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.15);border:none;color:#fff;cursor:pointer;font-size:0.9rem">✕</button>
    </div>
    <div style="padding:24px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px">
        <div class="form-group"><label class="form-label">Hebrew Month *</label><select class="form-control he" id="am_month">${HEB_MONTHS.map(m=>`<option value="${m.id}" ${m.id===CUR_MONTH?'selected':''}>${m.label}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Hebrew Year</label><select class="form-control he" id="am_year">${yearSelect(CUR_YEAR)}</select></div>
      </div>
      <div style="height:1px;background:#e8d9b8;margin-bottom:16px"></div>
      <h4 style="margin-bottom:12px;color:#005778;font-size:0.9rem;text-transform:uppercase;letter-spacing:0.5px">Category Scores — No overall score</h4>
      ${CATS.map(cat=>`<div style="border:1px solid #e8d9b8;border-right:4px solid ${cat.color};border-radius:8px;padding:12px 16px;margin-bottom:10px"><div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px"><span class="he" style="font-weight:700;color:${cat.color}">${cat.label}</span><div style="display:flex;gap:16px;align-items:flex-end"><div style="display:flex;flex-direction:column;align-items:center;gap:3px"><label style="font-size:0.68rem;font-weight:800;color:#1a6038;text-transform:uppercase">Correct</label><input type="number" min="0" max="99" id="am_${cat.id}_c" value="0" style="width:64px;text-align:center;padding:6px;border:1.5px solid #1a6038;border-radius:6px;font-weight:800;font-size:0.95rem"></div>${cat.hasMistakes?`<div style="display:flex;flex-direction:column;align-items:center;gap:3px"><label style="font-size:0.68rem;font-weight:800;color:#9a1c1c;text-transform:uppercase">Mistakes</label><input type="number" min="0" max="99" id="am_${cat.id}_m" value="0" style="width:64px;text-align:center;padding:6px;border:1.5px solid #9a1c1c;border-radius:6px;font-weight:800;font-size:0.95rem"></div>`:''}</div></div></div>`).join('')}
    </div>
    <div style="padding:14px 24px;border-top:1px solid #e8d9b8;display:flex;gap:10px;background:#fdf8f0;border-radius:0 0 16px 16px">
      <button class="btn btn-primary" onclick="saveAssessment(this.closest('[style*=fixed]'))">Save Assessment</button>
      <button class="btn btn-ghost" onclick="this.closest('[style*=fixed]').remove()">Cancel</button>
    </div>
  </div>`;
  overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.remove();});
  document.body.appendChild(overlay);
}

function saveAssessment(overlay){
  const sid=_assessSid,month=$('am_month')?.value,year=$('am_year')?.value||CUR_YEAR;
  if(!sid||!month){showToast('Please select a month','warning');return;}
  const s=getStudent(sid),cats={};
  CATS.forEach(cat=>{cats[cat.id]={correct:parseInt($(`am_${cat.id}_c`)?.value)||0,mistakes:cat.hasMistakes?(parseInt($(`am_${cat.id}_m`)?.value)||0):0};});
  const newA={id:genId('a'),studentId:sid,classId:s.classId,providerId:s.providerId,month,year,source:'manual',createdAt:new Date().toISOString(),categories:cats};
  const idx=ASSESSMENTS.findIndex(a=>a.studentId===sid&&a.month===month&&a.year===year);
  if(idx>=0)ASSESSMENTS[idx]=newA;else ASSESSMENTS.push(newA);
  AUDIT_LOG.unshift({id:genId('au'),action:'Add Assessment',entity:'Assessment',entityName:sName(s),field:'Month',before:'—',after:getMonthLabel(month),timestamp:new Date().toISOString()});
  SYS_LOGS.unshift({id:genId('l'),type:'success',message:`Assessment saved — ${sName(s)} — ${getMonthLabel(month)} ${year}`,timestamp:new Date().toISOString()});
  overlay?.remove();showToast('Assessment saved','success');
  if(_page==='student_profile')renderStudentProfile(sid);
  try{API.saveAssessment({studentId:sid,providerId:s.providerId,month,year,categories:cats,source:'manual',studentName:sName(s)});}catch(e){}
}

// ── REPORT ───────────────────────────────────────────────────
function showStudentReport(sid,targetMonth,targetYear){
  const s=getStudent(sid),allAss=getStudentAssessments(sid);
  if(!allAss.length){showToast('No assessments for report','warning');return;}
  const month=targetMonth||allAss[allAss.length-1].month,year=targetYear||allAss[allAss.length-1].year;
  const monthLabel=getMonthLabel(month),currentA=allAss.find(a=>a.month===month&&a.year===year);
  if(!currentA){showToast('No assessment for selected month','warning');return;}
  const monthOrder=getMonthOrder(month),ytdAss=allAss.filter(a=>getMonthOrder(a.month)<=monthOrder&&a.year===year);
  const isFinal=isReportFinal(sid,month,year),savedNote=getReportNote(sid,month,year),savedLang=getReportLang(sid,month,year);
  const trend=getStudentTrend(sid),directorName=KRIAH_DIRECTOR.name||'';
  window._currentReportMeta={sid,month,year,name:`${s.firstName}_${s.lastName}`};

  const reportHTML=`<div id="reportDoc" style="font-family:'Frank Ruhl Libre','Heebo',serif;direction:rtl;max-width:680px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,87,120,0.12)">
  <div style="background:linear-gradient(135deg,#005778,#1a7a9a);padding:0;position:relative">
    <div style="display:flex;align-items:center;justify-content:center;padding:18px 24px 28px;gap:0;position:relative">
      <div style="flex:1;text-align:right;padding-right:8px"><span style="color:#D9A44E;font-size:3rem;line-height:1;opacity:0.9;font-family:serif">❧</span></div>
      <div style="text-align:center;z-index:2"><div style="width:90px;height:90px;border-radius:50%;background:linear-gradient(135deg,#D9A44E,#b8832e);padding:4px;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(0,0,0,0.3)"><div style="width:82px;height:82px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;overflow:hidden"><img src="assets/logo.png" style="width:76px;height:76px;object-fit:contain" onerror="this.parentElement.innerHTML='<div style=font-size:1.8rem>📖</div>'"></div></div></div>
      <div style="flex:1;text-align:left;padding-left:8px"><span style="color:#D9A44E;font-size:3rem;line-height:1;opacity:0.9;font-family:serif">❦</span></div>
    </div>
    <div style="position:absolute;bottom:-1px;left:0;right:0;height:24px;background:#fff;border-radius:50% 50% 0 0 / 100% 100% 0 0"></div>
  </div>
  <div style="background:#fff;padding:20px 32px 16px;text-align:center">
    <div class="he" style="font-size:2.2rem;font-weight:900;color:#005778;letter-spacing:0.5px;line-height:1.2">קריאה קארטל</div>
    <div class="he" style="font-size:1rem;color:#808285;margin-top:8px">אונזער תלמיד</div>
    <div class="he" style="font-size:1.6rem;font-weight:900;color:#1a2a2a;margin-top:8px">${s.firstName} ${s.lastName}</div>
    <div class="he" style="font-size:0.9rem;color:#808285;margin-top:6px">${monthLabel} ${year}</div>
    <div style="height:2px;background:linear-gradient(90deg,transparent,#D9A44E,transparent);margin:14px auto;max-width:300px"></div>
  </div>
  <div style="padding:0 28px 16px;background:#fff">
    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;direction:rtl">
      ${CATS.map(cat=>{const c=currentA.categories[cat.id]?.correct||0,m=currentA.categories[cat.id]?.mistakes||0;return`<div style="background:#005778;border-radius:10px;padding:14px 6px;text-align:center;color:#fff"><div class="he" style="font-size:0.6rem;font-weight:700;color:rgba(255,255,255,0.8);margin-bottom:8px;line-height:1.4">${cat.label}</div><div style="font-size:1.9rem;font-weight:900;line-height:1">${c}</div>${cat.hasMistakes?`<div style="font-size:0.62rem;color:rgba(255,180,180,0.9);margin-top:4px">${m} err.</div>`:`<div style="height:16px"></div>`}</div>`;}).join('')}
    </div>
  </div>
  <div style="padding:0 28px 16px;background:#fff">
    <table style="width:100%;border-collapse:collapse;direction:rtl;font-size:0.82rem">
      <thead><tr style="background:#005778;color:#fff"><th style="padding:9px 10px;text-align:right;font-weight:700">חודש</th>${CATS.map(cat=>`<th style="padding:9px 8px;text-align:center;font-weight:700;border-right:1px solid rgba(255,255,255,0.2)"><span class="he" style="font-size:0.7rem">${cat.label}</span></th>`).join('')}</tr></thead>
      <tbody>${ytdAss.map((a,i)=>{const isCur=a.month===month;return`<tr style="background:${isCur?'#e0eef5':i%2===0?'#fff':'#f8f9fa'};font-weight:${isCur?'700':'400'}"><td style="padding:8px 10px;text-align:right;border-bottom:1px solid #e8d9b8"><span class="he" style="color:${isCur?'#005778':'#333'}">${getMonthLabel(a.month)}</span></td>${CATS.map(cat=>{const c=a.categories[cat.id]?.correct||0,m=a.categories[cat.id]?.mistakes||0;return`<td style="padding:8px;text-align:center;border-bottom:1px solid #e8d9b8;border-right:1px solid #e8d9b8"><span style="font-weight:700;color:#005778">${c}</span>${cat.hasMistakes&&m>0?`<span style="font-size:0.62rem;color:#9a1c1c;display:block">-${m}</span>`:''}</td>`;}).join('')}</tr>`;}).join('')}</tbody>
    </table>
  </div>
  <div style="padding:0 28px 16px;background:#fff">
    ${isFinal?(savedNote?`<div style="border:1px solid #e8d9b8;border-radius:8px;padding:14px;background:#fdf8f0"><div style="font-size:0.85rem;color:#333;line-height:1.8;${savedLang==='yi'?'direction:rtl;text-align:right;font-family:var(--font-he)':''}">${savedNote}</div></div>`:'<div style="height:40px"></div>')
    :`<div style="border:1px solid #e8d9b8;border-radius:8px;overflow:hidden"><div style="background:#f0f0f0;padding:8px 14px;display:flex;align-items:center;justify-content:space-between"><span style="font-size:0.78rem;font-weight:700;color:#444">Note (optional)</span><div style="display:flex;gap:6px;align-items:center"><select id="noteLang" style="font-size:0.76rem;padding:3px 8px;border:1px solid #ddd;border-radius:4px" onchange="switchNoteLang(this.value,'${sid}','${month}','${year}')"><option value="en" ${savedLang==='en'?'selected':''}>English</option><option value="yi" ${savedLang==='yi'?'selected':''}>Yiddish</option></select><button class="btn btn-sm" style="background:#005778;color:#fff;font-size:0.72rem;padding:4px 10px" onclick="aiGenerateNote('${sid}','${month}','${year}')">✨ AI Generate</button></div></div><textarea id="reportNoteInput" rows="3" style="width:100%;padding:12px;border:none;font-size:0.85rem;font-family:${savedLang==='yi'?'var(--font-he)':'var(--font-en)'};direction:${savedLang==='yi'?'rtl':'ltr'};resize:vertical;outline:none;color:#333;line-height:1.7" placeholder="${savedLang==='yi'?'שרייב אן אנמערקונג...':'Write a note...'}" oninput="saveReportNote('${sid}','${month}','${year}',this.value,document.getElementById('noteLang').value)">${savedNote}</textarea></div>`}
  </div>
  <div style="padding:0 28px 16px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid #e8d9b8;padding-top:12px;background:#fff">
    <div style="font-size:0.82rem;color:#444"><span style="font-weight:700;color:#808285;text-transform:uppercase;font-size:0.7rem;letter-spacing:0.5px">Director: </span><span class="he" style="font-weight:700;color:#005778">${directorName}</span></div>
    <div style="font-size:0.75rem;color:#808285">KriahTrack — Ichud Boys Program</div>
  </div>
  <div style="background:linear-gradient(135deg,#005778,#1a7a9a);height:8px"></div>
</div>`;

  const modal=$('reportPreviewModal');
  if(modal){
    $('reportPreviewBody').innerHTML=`
<div class="no-print" style="background:${isFinal?'#e4f2eb':'#fff3e0'};border:1px solid ${isFinal?'#a8d8bc':'#ecc870'};border-radius:8px;padding:10px 16px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;font-size:0.84rem">
  <span style="font-weight:700;color:${isFinal?'#1a6038':'#7a4800'}">${isFinal?'✓ Report Finalized':'✏ Draft'}</span>
  <div style="display:flex;gap:8px">
    ${isFinal?`<button class="btn btn-sm" style="background:#fff;border:1px solid #808285;color:#808285" onclick="unlockReport('${sid}','${month}','${year}');showStudentReport('${sid}','${month}','${year}')">🔓 Unlock</button>`:`<button class="btn btn-primary btn-sm" onclick="finalizeReport('${sid}','${month}','${year}');showStudentReport('${sid}','${month}','${year}')">✓ Finalize</button>`}
    <button class="btn btn-gold btn-sm" onclick="downloadReportPDF('${sid}','${month}','${year}')">⬇ PDF</button>
    <button class="btn btn-outline btn-sm" onclick="sendReportByEmail('${sid}','${month}','${year}')">📧 Send</button>
  </div>
</div>
${reportHTML}`;
    openModal('reportPreviewModal');
    const footer=modal.querySelector('.modal-footer');
    if(footer)footer.innerHTML=`<button class="btn btn-primary" onclick="printReport()">🖨 Print</button><button class="btn btn-gold" onclick="downloadReportPDF('${sid}','${month}','${year}')">⬇ PDF</button><button class="btn btn-ghost" onclick="closeModal('reportPreviewModal')">Close</button>`;
  }
}

function switchNoteLang(lang,sid,month,year){const ta=$('reportNoteInput');if(!ta)return;ta.style.direction=lang==='yi'?'rtl':'ltr';ta.style.fontFamily=lang==='yi'?'var(--font-he)':'var(--font-en)';ta.placeholder=lang==='yi'?'שרייב אן אנמערקונג...':'Write a note...';saveReportNote(sid,month,year,ta.value,lang);}
function aiGenerateNote(sid,month,year){const lang=$('noteLang')?.value||'en',trend=getStudentTrend(sid),note=generateAINote(sid,trend,lang);const ta=$('reportNoteInput');if(ta){ta.value=note;ta.style.direction=lang==='yi'?'rtl':'ltr';ta.style.fontFamily=lang==='yi'?'var(--font-he)':'var(--font-en)';saveReportNote(sid,month,year,note,lang);}showToast('AI note generated','success');}

async function downloadReportPDF(sid,month,year){
  const s=getStudent(sid);
  const filename=`${s?s.firstName+'_'+s.lastName:'report'}_${getMonthLabel(month)}_${year}.pdf`;
  const el=$('reportDoc');
  if(!el){showStudentReport(sid,month,year);setTimeout(()=>downloadReportPDF(sid,month,year),800);return;}
  await generatePDF(el,filename,false);
}

function printReport(){
  const style=document.createElement('style');style.id='printOrient';
  style.textContent='@page{size:portrait;margin:12mm}.no-print{display:none!important}';
  document.head.appendChild(style);window.print();
  setTimeout(()=>{const el=$('printOrient');if(el)el.remove();},1500);
}

// ── EMAIL SENDING ─────────────────────────────────────────────
function sendReportByEmail(sid,month,year){
  const s=getStudent(sid);
  const emails=(s?.emails||[]).filter(e=>e);
  if(!emails.length){
    showToast('No parent emails on file for this student','warning');
    const add=confirm('No parent emails found. Would you like to add them now?');
    if(add)openEditStudentModal(sid);
    return;
  }
  const monthLabel=getMonthLabel(month);
  const subject=encodeURIComponent(`Kriah Report — ${sName(s)} — ${monthLabel} ${year}`);
  const body=encodeURIComponent(`Dear Parent,\n\nPlease find attached the Kriah progress report for ${sName(s)} for ${monthLabel} ${year}.\n\nBest regards,\nIchud Boys Program — Kriah Department`);
  const mailto=`mailto:${emails.join(',')}?subject=${subject}&body=${body}`;
  window.open(mailto,'_blank');
  showToast(`Email client opened for ${emails.join(', ')}`,'success');
  SYS_LOGS.unshift({id:genId('l'),type:'info',message:`Report email sent — ${sName(s)} — ${monthLabel} ${year}`,timestamp:new Date().toISOString()});
}

function sendVideoByEmail(sid,month,year){
  const s=getStudent(sid);
  const emails=(s?.emails||[]).filter(e=>e);
  const video=getStudentVideo(sid,month,year);
  if(!emails.length){showToast('No parent emails on file','warning');return;}
  if(!video){showToast('No video uploaded for this month','warning');return;}
  const monthLabel=getMonthLabel(month);
  const subject=encodeURIComponent(`Kriah Video — ${sName(s)} — ${monthLabel} ${year}`);
  const body=encodeURIComponent(`Dear Parent,\n\nPlease find the Kriah reading video for ${sName(s)} for ${monthLabel} ${year}.\n\nNote: The video file needs to be attached manually from your device.\n\nBest regards,\nIchud Boys Program`);
  window.open(`mailto:${emails.join(',')}?subject=${subject}&body=${body}`,'_blank');
  showToast('Email client opened','success');
}

// ── REPORTS PAGE ─────────────────────────────────────────────
function renderReports(){
  $('pageContent').innerHTML=`
<div class="page-header"><div><h1 class="page-title">Monthly Reports</h1><p class="page-subtitle">Generate, finalize and send reports by class and month</p></div></div>
<div class="card mb-6"><div class="card-header"><span class="card-title">Report Settings</span></div><div class="card-body">
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px">
    <div class="form-group"><label class="form-label">Class</label>
      <select class="form-control" id="rProv" onchange="_rp=this.value;genReports()">
        <option value="">All Classes</option>
        ${DIVISIONS.map(div=>`<optgroup label="${div.name}">${getDivisionClasses(div.id).map(c=>`<option value="${c.id}" ${_rp===c.id?'selected':''}>${c.name}</option>`).join('')}</optgroup>`).join('')}
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
</div></div>
<div id="rGrid"></div>`;
  genReports();
}

function genReports(){
  _rp=document.getElementById('rProv')?.value||_rp;
  _rm=document.getElementById('rMonth')?.value||_rm;
  const ss=_rp?getClassStudents(_rp):STUDENTS;
  const wd=ss.filter(s=>ASSESSMENTS.some(a=>a.studentId===s.id&&a.month===_rm));
  const ml=getMonthLabel(_rm);
  $('rGrid').innerHTML=`
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
  <h3>${wd.length} Reports — <span class="he">${ml} ${CUR_YEAR}</span></h3>
  <div style="display:flex;gap:8px">
    <button class="btn btn-ghost btn-sm" onclick="sendBulkReports()">📧 Send All</button>
    <button class="btn btn-ghost btn-sm" onclick="window.print()">Print All</button>
  </div>
</div>
${wd.length===0?`<div style="text-align:center;padding:60px;color:#808285">No data for <span class="he">${ml}</span></div>`:`<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:14px">
${wd.map(s=>{
  const a=ASSESSMENTS.find(x=>x.studentId===s.id&&x.month===_rm);
  const cls=getClass(s.classId),div=getClassDivision(s.classId),t=getStudentTrend(s.id);
  const isFinal=isReportFinal(s.id,_rm,CUR_YEAR);
  const hasEmails=(s.emails||[]).length>0;
  return`<div style="border:1px solid #e8d9b8;border-radius:12px;overflow:hidden;transition:all 0.2s" onmouseenter="this.style.boxShadow='0 4px 16px rgba(0,87,120,0.12)'" onmouseleave="this.style.boxShadow=''">
    <div style="background:linear-gradient(135deg,#005778,#1a7a9a);padding:14px 18px;color:#fff">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div><div class="he" style="font-weight:800;font-size:0.95rem">${sName(s)}</div><div style="font-size:0.76rem;opacity:0.8;margin-top:2px">${cls?cls.name:''} ${div?'· '+div.name:''}</div></div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
          ${trendBadge(t)}
          ${isFinal?'<span style="background:#1a6038;color:#fff;font-size:0.6rem;font-weight:800;padding:2px 7px;border-radius:20px">✓ FINAL</span>':'<span style="background:rgba(255,255,255,0.2);color:#fff;font-size:0.6rem;font-weight:700;padding:2px 7px;border-radius:20px">DRAFT</span>'}
        </div>
      </div>
    </div>
    <div style="padding:14px 18px;background:#fff">
      <div style="margin-bottom:10px">${CATS.map(cat=>`<div style="display:flex;justify-content:space-between;font-size:0.8rem;padding:3px 0;border-bottom:1px solid #f0ece4"><span class="he" style="color:${cat.color};font-weight:600">${cat.label}</span><span style="font-weight:700;color:#005778">${a?.categories[cat.id]?.correct||0}${cat.hasMistakes&&(a?.categories[cat.id]?.mistakes||0)>0?` <span style="color:#9a1c1c;font-size:0.72rem">(-${a.categories[cat.id].mistakes})</span>`:''}</span></div>`).join('')}</div>
      ${hasEmails?`<div style="font-size:0.75rem;color:#1a6038;margin-top:6px">📧 ${(s.emails||[]).join(', ')}</div>`:'<div style="font-size:0.75rem;color:#9a1c1c;margin-top:6px">⚠ No parent email</div>'}
    </div>
    <div style="padding:10px 18px;background:#fdf8f0;border-top:1px solid #e8d9b8;display:flex;gap:6px;flex-wrap:wrap">
      <button class="btn btn-primary btn-sm" onclick="showStudentReport('${s.id}','${_rm}','${CUR_YEAR}')">View</button>
      <button class="btn btn-ghost btn-sm" onclick="downloadReportPDF('${s.id}','${_rm}','${CUR_YEAR}')">⬇ PDF</button>
      <button class="btn btn-outline btn-sm" onclick="sendReportByEmail('${s.id}','${_rm}','${CUR_YEAR}')">📧 Send</button>
      ${isFinal?`<button class="btn btn-sm" style="background:#fff;border:1px solid #808285;color:#808285;font-size:0.72rem" onclick="unlockReport('${s.id}','${_rm}','${CUR_YEAR}');genReports()">🔓</button>`:`<button class="btn btn-sm" style="background:#e4f2eb;border:1px solid #a8d8bc;color:#1a6038;font-size:0.72rem" onclick="finalizeReport('${s.id}','${_rm}','${CUR_YEAR}');genReports()">✓ Final</button>`}
    </div>
  </div>`;}).join('')}</div>`}`;
}

function sendBulkReports(){
  _rp=document.getElementById('rProv')?.value||_rp;
  _rm=document.getElementById('rMonth')?.value||_rm;
  const ss=_rp?getClassStudents(_rp):STUDENTS;
  const wd=ss.filter(s=>ASSESSMENTS.some(a=>a.studentId===s.id&&a.month===_rm));
  const withEmail=wd.filter(s=>(s.emails||[]).length>0);
  const noEmail=wd.filter(s=>(s.emails||[]).length===0);
  if(!withEmail.length){showToast('No students with parent emails in this selection','warning');return;}
  const ml=getMonthLabel(_rm);
  const allEmails=[...new Set(withEmail.flatMap(s=>s.emails||[]))];
  const subject=encodeURIComponent(`Kriah Reports — ${ml} ${CUR_YEAR}`);
  const body=encodeURIComponent(`Dear Parents,\n\nPlease find the Kriah progress reports for ${ml} ${CUR_YEAR}.\n\nStudents: ${withEmail.map(s=>sName(s)).join(', ')}\n\nBest regards,\nIchud Boys Program — Kriah Department`);
  window.open(`mailto:${allEmails.join(',')}?subject=${subject}&body=${body}`,'_blank');
  showToast(`Email opened for ${withEmail.length} students${noEmail.length>0?` (${noEmail.length} missing emails)`:''}`, 'success');
}

// ── WORKSHEETS ───────────────────────────────────────────────
function renderWorksheets(){
  $('pageContent').innerHTML=`
<div class="page-header"><div><h1 class="page-title">Worksheets</h1><p class="page-subtitle">Generate handwriting grading sheets — landscape PDF</p></div><button class="btn btn-outline btn-sm" onclick="openCSVImport()">📄 Import CSV</button></div>
<div class="card mb-6"><div class="card-header"><span class="card-title">Worksheet Settings</span></div><div class="card-body">
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px">
    <div class="form-group"><label class="form-label">Class</label>
      <select class="form-control" id="wsProv" onchange="_wsProv=this.value">
        <option value="">All Classes</option>
        ${DIVISIONS.map(div=>`<optgroup label="${div.name}">${getDivisionClasses(div.id).map(c=>`<option value="${c.id}" ${_wsProv===c.id?'selected':''}>${c.name}</option>`).join('')}</optgroup>`).join('')}
      </select>
    </div>
    <div class="form-group"><label class="form-label">Hebrew Month *</label><select class="form-control he" id="wsMonth" onchange="_wsMonth=this.value">${HEB_MONTHS.map(m=>`<option value="${m.id}" ${_wsMonth===m.id?'selected':''}>${m.label}</option>`).join('')}</select></div>
    <div class="form-group"><label class="form-label">Hebrew Year</label><select class="form-control he" id="wsYear" onchange="_wsYear=this.value">${yearSelect(_wsYear)}</select></div>
  </div>
  <div style="display:flex;gap:10px;margin-top:8px;flex-wrap:wrap">
    <button class="btn btn-primary" onclick="genWorksheet()">Generate Sheet</button>
    <button class="btn btn-gold" onclick="downloadWorksheetPDF()">⬇ Download PDF</button>
    <button class="btn btn-outline" onclick="printWorksheet()">🖨 Print (Landscape)</button>
    <button class="btn btn-sm" style="background:#e0eef5;color:#005778;border:1px solid #b0cfe0" onclick="genAllWorksheets()">📋 All Classes</button>
  </div>
</div></div>
<div id="wsPreview"></div>`;
}

function genWorksheet(){
  _wsProv=document.getElementById('wsProv')?.value||_wsProv;
  _wsMonth=document.getElementById('wsMonth')?.value||_wsMonth;
  _wsYear=document.getElementById('wsYear')?.value||_wsYear;
  const students=_wsProv?getClassStudents(_wsProv):STUDENTS;
  if(!students.length){showToast('No students found','warning');return;}
  const cls=_wsProv?getClass(_wsProv):null;
  const ml=getMonthLabel(_wsMonth);
  $('wsPreview').innerHTML=`<div id="worksheetDoc" style="background:#fff;padding:20px;font-family:'Frank Ruhl Libre','Heebo',serif;direction:rtl">
  <div style="background:linear-gradient(135deg,#005778,#1a7a9a);padding:12px 20px;border-radius:8px 8px 0 0;display:flex;align-items:center;justify-content:center;gap:16px">
    <span style="color:#D9A44E;font-size:1.5rem">❧</span>
    <img src="assets/logo.png" style="width:52px;height:52px;object-fit:contain;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.3))" onerror="this.style.display='none'">
    <div style="text-align:center;color:#fff"><div style="font-size:0.65rem;color:rgba(255,255,255,0.7)">מערכת הקריאה</div><div style="font-size:1rem;font-weight:900">מחדדים בפיך</div></div>
    <span style="color:#D9A44E;font-size:1.5rem">❦</span>
  </div>
  <div style="height:3px;background:linear-gradient(90deg,transparent,#D9A44E,transparent);margin-bottom:12px"></div>
  <div style="text-align:center;margin-bottom:12px">
    <div style="font-size:1rem;font-weight:800;color:#005778">גיליון הערכה${cls?' — '+cls.name:''}</div>
    <div style="font-size:0.8rem;color:#808285;margin-top:3px"><span class="he">${ml} ${_wsYear}</span></div>
  </div>
  <div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;direction:rtl;font-size:0.8rem">
    <thead>
      <tr><th style="background:#005778;color:#fff;padding:8px 10px;text-align:right;min-width:120px">שם תלמיד</th><th style="background:#005778;color:#fff;padding:8px 6px;text-align:center">כיתה</th>
      ${CATS.map(cat=>cat.hasMistakes?`<th colspan="2" style="background:#005778;color:#fff;padding:8px 6px;text-align:center;border-right:2px solid rgba(255,255,255,0.3)"><span class="he" style="font-size:0.72rem">${cat.label}</span></th>`:`<th style="background:#005778;color:#fff;padding:8px 6px;text-align:center;border-right:2px solid rgba(255,255,255,0.3)"><span class="he" style="font-size:0.72rem">${cat.label}</span></th>`).join('')}
      <th style="background:#005778;color:#fff;padding:8px 6px;text-align:right">הערות</th></tr>
      <tr style="background:#1a7a9a"><th></th><th></th>${CATS.map(cat=>cat.hasMistakes?`<th style="color:#a8e0e0;font-size:0.62rem;padding:4px;text-align:center">נכון</th><th style="color:#ffaaaa;font-size:0.62rem;padding:4px;text-align:center;border-right:2px solid rgba(255,255,255,0.15)">שגיאות</th>`:`<th style="color:#a8e0e0;font-size:0.62rem;padding:4px;text-align:center;border-right:2px solid rgba(255,255,255,0.15)">ציון</th>`).join('')}<th></th></tr>
    </thead>
    <tbody>${students.map((s,i)=>{const c=getClass(s.classId);return`<tr style="border-bottom:1px solid #e8d9b8;background:${i%2===0?'#fff':'#f8f9fa'}"><td class="he" style="padding:12px 10px;font-weight:600;text-align:right">${sName(s)}</td><td style="padding:12px 6px;text-align:center">${c?c.name:''}</td>${CATS.map(cat=>cat.hasMistakes?`<td style="padding:12px 6px;min-width:40px;background:#fafaf8;border-right:1px solid #eee"></td><td style="padding:12px 6px;min-width:40px;background:#fafaf8;border-right:2px solid #ddd"></td>`:`<td style="padding:12px 6px;min-width:55px;background:#fafaf8;border-right:2px solid #ddd"></td>`).join('')}<td style="padding:12px 6px;min-width:90px"></td></tr>`;}).join('')}</tbody>
  </table></div>
  <div style="margin-top:14px;display:flex;justify-content:space-between;font-size:0.72rem;color:#808285;border-top:1px solid #e8d9b8;padding-top:8px">
    <span>חתימת מורה: ___________________</span><span>תאריך: ___________________</span><span>KriahTrack — Ichud Boys Program</span>
  </div>
</div>`;
}

async function downloadWorksheetPDF(){
  const el=$('worksheetDoc');if(!el){showToast('Generate a worksheet first','warning');return;}
  const cls=_wsProv?getClass(_wsProv):null;
  const name=(cls?cls.name:'All').replace(/\s+/g,'_');
  await generatePDF(el,`${name}_${getMonthLabel(_wsMonth)}_${_wsYear}.pdf`,true);
}
function printWorksheet(){const style=document.createElement('style');style.id='po';style.textContent='@page{size:landscape;margin:8mm}';document.head.appendChild(style);window.print();setTimeout(()=>{const e=$('po');if(e)e.remove();},1000);}

function genAllWorksheets(){
  _wsMonth=document.getElementById('wsMonth')?.value||_wsMonth;
  _wsYear=document.getElementById('wsYear')?.value||_wsYear;
  const ml=getMonthLabel(_wsMonth);
  const allHTML=CLASSES.map(cls=>{
    const ss=getClassStudents(cls.id);if(!ss.length)return'';
    return`<div style="page-break-after:always;font-family:'Frank Ruhl Libre','Heebo',serif;direction:rtl;padding:20px"><div style="background:linear-gradient(135deg,#005778,#1a7a9a);padding:10px 20px;border-radius:8px 8px 0 0;display:flex;align-items:center;justify-content:center;gap:12px"><span style="color:#D9A44E;font-size:1.2rem">❧</span><div style="text-align:center;color:#fff"><div style="font-size:0.65rem;opacity:0.7">מערכת הקריאה</div><div style="font-size:0.9rem;font-weight:900">מחדדים בפיך</div></div><span style="color:#D9A44E;font-size:1.2rem">❦</span></div><div style="height:2px;background:linear-gradient(90deg,transparent,#D9A44E,transparent);margin-bottom:10px"></div><div style="text-align:center;margin-bottom:10px"><div style="font-size:0.95rem;font-weight:800;color:#005778">גיליון הערכה — ${cls.name}</div><div style="font-size:0.78rem;color:#808285;margin-top:2px">${ml} ${_wsYear}</div></div><table style="width:100%;border-collapse:collapse;direction:rtl;font-size:0.78rem"><thead><tr><th style="background:#005778;color:#fff;padding:7px 8px;text-align:right;min-width:110px">שם תלמיד</th>${CATS.map(cat=>cat.hasMistakes?`<th colspan="2" style="background:#005778;color:#fff;padding:7px 6px;text-align:center;border-right:2px solid rgba(255,255,255,0.3)"><span style="font-size:0.68rem">${cat.label}</span></th>`:`<th style="background:#005778;color:#fff;padding:7px 6px;text-align:center;border-right:2px solid rgba(255,255,255,0.3)"><span style="font-size:0.68rem">${cat.label}</span></th>`).join('')}<th style="background:#005778;color:#fff;padding:7px 6px">הערות</th></tr></thead><tbody>${ss.map((s,i)=>`<tr style="border-bottom:1px solid #e8d9b8;background:${i%2===0?'#fff':'#f8f9fa'}"><td style="padding:11px 8px;font-weight:600;text-align:right">${sName(s)}</td>${CATS.map(cat=>cat.hasMistakes?`<td style="padding:11px 6px;min-width:36px;background:#fafaf8;border-right:1px solid #eee"></td><td style="padding:11px 6px;min-width:36px;background:#fafaf8;border-right:2px solid #ddd"></td>`:`<td style="padding:11px 6px;min-width:50px;background:#fafaf8;border-right:2px solid #ddd"></td>`).join('')}<td style="padding:11px 6px;min-width:80px"></td></tr>`).join('')}</tbody></table></div>`;
  }).join('');
  const blob=new Blob([`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{margin:0;padding:0;font-family:'Frank Ruhl Libre',serif}@page{size:landscape;margin:8mm}</style></head><body>${allHTML}</body></html>`],{type:'text/html'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`All_Worksheets_${ml}_${_wsYear}.html`;a.click();
  showToast(`All ${CLASSES.length} class worksheets downloaded`,'success');
}

// ── OCR ──────────────────────────────────────────────────────
function renderOCR(){
  $('pageContent').innerHTML=`
<div class="page-header"><div><h1 class="page-title">Upload Worksheet</h1><p class="page-subtitle">Automatic handwriting recognition — review before saving</p></div></div>
<div style="display:flex;align-items:center;margin-bottom:24px">${[1,2,3,4].map(n=>`<div style="display:flex;align-items:center;gap:7px;flex:1"><div style="width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:800;background:${ocrStep>n?'#1a6038':ocrStep===n?'#005778':'#f0ece4'};color:${ocrStep>=n?'#fff':'#808285'};border:2px solid ${ocrStep>n?'#1a6038':ocrStep===n?'#005778':'#e8d9b8'}">${ocrStep>n?'✓':n}</div><span style="font-size:0.76rem;font-weight:700;color:${ocrStep===n?'#005778':'#808285'}">${['Class & Month','Upload Sheet','Processing','Review & Confirm'][n-1]}</span>${n<4?`<div style="flex:1;height:2px;background:${ocrStep>n?'#1a6038':'#e8d9b8'};margin:0 7px"></div>`:''}</div>`).join('')}</div>
${ocrStep===1?renderOCRS1():ocrStep===2?renderOCRS2():ocrStep===3?renderOCRS3():renderOCRS4()}`;
}
function renderOCRS1(){return`<div class="card"><div class="card-header"><span class="card-title">Step 1 — Select Class & Month</span></div><div class="card-body"><div style="display:grid;grid-template-columns:1fr 1fr;gap:14px"><div class="form-group"><label class="form-label">Class *</label><select class="form-control" id="oP"><option value="">Select class...</option>${DIVISIONS.map(div=>`<optgroup label="${div.name}">${getDivisionClasses(div.id).map(c=>`<option value="${c.id}" ${ocrSelectedProvider===c.id?'selected':''}>${c.name}</option>`).join('')}</optgroup>`).join('')}</select></div><div class="form-group"><label class="form-label">Hebrew Month *</label><select class="form-control he" id="oM">${HEB_MONTHS.map(m=>`<option value="${m.id}" ${ocrSelectedMonth===m.id?'selected':''}>${m.label}</option>`).join('')}</select></div></div><button class="btn btn-primary" onclick="ocrSelectedProvider=document.getElementById('oP')?.value;ocrSelectedMonth=document.getElementById('oM')?.value;if(!ocrSelectedProvider||!ocrSelectedMonth){showToast('Please select class and month','warning');return;}ocrStep=2;renderOCR()">Continue →</button></div></div>`;}
function renderOCRS2(){const cls=getClass(ocrSelectedProvider),ss=getClassStudents(ocrSelectedProvider);return`<div class="card"><div class="card-header"><span class="card-title">Step 2 — Upload Worksheet</span><span class="he" style="background:#005778;color:#fff;padding:3px 9px;border-radius:20px;font-size:0.72rem;font-weight:700">${cls?cls.name:''} | ${getMonthLabel(ocrSelectedMonth)}</span></div><div class="card-body"><div style="border:2px dashed #005778;border-radius:12px;padding:44px 24px;text-align:center;cursor:pointer;background:#e0eef5" onclick="document.getElementById('oF').click()" ondragover="event.preventDefault()" ondrop="event.preventDefault();_ocrFile=event.dataTransfer.files[0];runDemoOCR()"><div style="width:60px;height:60px;border-radius:50%;background:#b0cfe0;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;color:#005778"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></div><h3 style="color:#005778;margin-bottom:6px">Upload Worksheet</h3><p style="color:#808285;font-size:0.84rem">Drag file here or click to select</p><p style="color:#aaa;font-size:0.76rem;margin-top:6px">JPG · PNG · PDF</p><input type="file" id="oF" accept="image/*,.pdf" style="display:none" onchange="_ocrFile=this.files[0];runDemoOCR()"></div><div style="margin-top:14px;display:flex;gap:10px"><button class="btn btn-ghost btn-sm" onclick="ocrStep=1;renderOCR()">← Back</button><button class="btn btn-outline btn-sm" onclick="runDemoOCR()">▶ Demo</button></div><div style="margin-top:10px;font-size:0.78rem;color:#808285">Students: <strong>${ss.length}</strong></div></div></div>`;}
function renderOCRS3(){return`<div class="card"><div class="card-header"><span class="card-title">Step 3 — Processing OCR</span></div><div class="card-body" style="text-align:center;padding:40px"><div id="oStat" class="alert alert-info" style="text-align:right;margin-bottom:20px">Initializing...</div><div style="margin-bottom:14px"><span id="oPct" style="font-size:0.84rem;font-weight:700;color:#005778">0%</span><div style="background:#e8d9b8;border-radius:20px;height:12px;overflow:hidden;margin-top:6px"><div id="oBar" style="height:100%;border-radius:20px;background:linear-gradient(90deg,#005778,#1a7a9a);width:0%;transition:width 0.3s"></div></div></div><div style="display:flex;justify-content:center;margin-top:20px"><div class="spinner"></div></div><p style="margin-top:14px;color:#808285;font-size:0.84rem">Analyzing handwriting...</p><button class="btn btn-ghost btn-sm" style="margin-top:14px" onclick="ocrStep=2;_ocrFile=null;renderOCR()">Cancel</button></div></div>`;}
function runDemoOCR(){ocrStep=3;renderOCR();const ss=getClassStudents(ocrSelectedProvider);let pct=0;const iv=setInterval(()=>{pct=Math.min(100,pct+Math.floor(Math.random()*12)+4);const bar=$('oBar'),lbl=$('oPct'),msg=$('oStat');if(bar)bar.style.width=pct+'%';if(lbl)lbl.textContent=`Processing... ${pct}%`;if(msg)msg.textContent=pct<30?'Initializing OCR engine...':pct<60?'Detecting table structure...':pct<85?'Extracting digits...':'Finishing...';if(pct>=100){clearInterval(iv);pendingOCRData=ss.map(s=>{const ex=ASSESSMENTS.find(a=>a.studentId===s.id&&a.month===ocrSelectedMonth&&a.year===CUR_YEAR);const cats={};CATS.forEach(cat=>{cats[cat.id]={correct:Math.floor(Math.random()*18)+5,mistakes:cat.hasMistakes?Math.floor(Math.random()*7):0};});return{student:s,categories:cats,isDuplicate:!!ex,existingId:ex?.id,action:ex?'overwrite':'import'};});ocrStep=4;renderOCR();}},180);}
function renderOCRS4(){const cls=getClass(ocrSelectedProvider),dups=pendingOCRData.filter(d=>d.isDuplicate),toImport=pendingOCRData.filter(d=>d.action!=='skip').length;return`<div class="card"><div class="card-header"><span class="card-title">Step 4 — Review & Confirm</span><span class="he" style="background:#005778;color:#fff;padding:3px 9px;border-radius:20px;font-size:0.72rem;font-weight:700">${cls?cls.name:''} | ${getMonthLabel(ocrSelectedMonth)}</span></div><div class="card-body">${dups.length?`<div style="background:#fff3e0;border:2px solid #D9A44E;border-radius:8px;padding:14px;margin-bottom:14px"><div style="font-weight:700;color:#7a4800;margin-bottom:6px">⚠ ${dups.length} duplicates detected</div><div style="display:flex;gap:8px;margin-top:8px"><button class="btn btn-sm" style="background:#D9A44E;color:#fff" onclick="pendingOCRData.forEach(d=>{if(d.isDuplicate)d.action='overwrite'});renderOCR()">Overwrite All</button><button class="btn btn-ghost btn-sm" onclick="pendingOCRData.forEach(d=>{if(d.isDuplicate)d.action='skip'});renderOCR()">Skip Duplicates</button></div></div>`:''}
<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:0.84rem"><thead><tr style="background:#005778;color:#fff"><th style="padding:10px 12px;text-align:right">Student</th>${CATS.map(cat=>cat.hasMistakes?`<th colspan="2" style="padding:10px 8px;text-align:center;border-right:2px solid rgba(255,255,255,0.2)"><span class="he">${cat.label}</span></th>`:`<th style="padding:10px 8px;text-align:center;border-right:2px solid rgba(255,255,255,0.2)"><span class="he">${cat.label}</span></th>`).join('')}<th style="padding:10px 8px">Status</th><th style="padding:10px 8px">Action</th></tr><tr style="background:#1a7a9a;color:#a8e0e0;font-size:0.7rem"><th></th>${CATS.map(cat=>cat.hasMistakes?`<th style="padding:5px;text-align:center">✓</th><th style="padding:5px;text-align:center;border-right:2px solid rgba(255,255,255,0.15)">✗</th>`:`<th style="padding:5px;text-align:center;border-right:2px solid rgba(255,255,255,0.15)">✓</th>`).join('')}<th></th><th></th></tr></thead>
<tbody>${pendingOCRData.map((row,ri)=>`<tr style="border-bottom:1px solid #e8d9b8;background:${row.isDuplicate?'#faf0c0':row.action==='skip'?'#f5f5f5':'#fff'};opacity:${row.action==='skip'?'0.5':'1'}" id="or${ri}"><td class="he" style="padding:10px 12px;font-weight:600;text-align:right">${sName(row.student)}</td>${CATS.map(cat=>cat.hasMistakes?`<td style="text-align:center;padding:6px"><input type="number" min="0" max="99" value="${row.categories[cat.id].correct}" onchange="pendingOCRData[${ri}].categories['${cat.id}'].correct=parseInt(this.value)||0" style="width:52px;padding:4px;border:1.5px solid #1a6038;border-radius:4px;text-align:center;font-weight:800;font-size:0.88rem"></td><td style="text-align:center;padding:6px;border-right:2px solid #e8d9b8"><input type="number" min="0" max="99" value="${row.categories[cat.id].mistakes}" onchange="pendingOCRData[${ri}].categories['${cat.id}'].mistakes=parseInt(this.value)||0" style="width:52px;padding:4px;border:1.5px solid #9a1c1c;border-radius:4px;text-align:center;font-weight:800;font-size:0.88rem"></td>`:`<td style="text-align:center;padding:6px;border-right:2px solid #e8d9b8"><input type="number" min="0" max="99" value="${row.categories[cat.id].correct}" onchange="pendingOCRData[${ri}].categories['${cat.id}'].correct=parseInt(this.value)||0" style="width:52px;padding:4px;border:1.5px solid #1a6038;border-radius:4px;text-align:center;font-weight:800;font-size:0.88rem"></td>`).join('')}<td style="padding:6px 10px"><span style="background:${row.isDuplicate?'#fff3e0':'#e4f2eb'};color:${row.isDuplicate?'#7a4800':'#1a6038'};padding:2px 8px;border-radius:20px;font-size:0.68rem;font-weight:800">${row.isDuplicate?'Duplicate':'New'}</span></td><td style="padding:6px 10px">${row.isDuplicate?`<select style="font-size:0.76rem;padding:3px 6px;border:1px solid #e8d9b8;border-radius:4px" onchange="pendingOCRData[${ri}].action=this.value;document.getElementById('or${ri}').style.opacity=this.value==='skip'?'0.5':'1'"><option value="overwrite" ${row.action==='overwrite'?'selected':''}>Overwrite</option><option value="skip" ${row.action==='skip'?'selected':''}>Skip</option></select>`:'<span style="color:#1a6038;font-size:0.76rem;font-weight:700">Import</span>'}</td></tr>`).join('')}</tbody></table></div>
<div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-primary" onclick="confirmOCR()">✓ Confirm & Save (${toImport} records)</button><button class="btn btn-outline btn-sm" onclick="ocrStep=2;renderOCR()">← Re-upload</button><button class="btn btn-ghost btn-sm" onclick="ocrStep=1;pendingOCRData=[];_ocrFile=null;renderOCR()">Cancel</button></div></div></div>`;}
function confirmOCR(){let imp=0,sk=0;pendingOCRData.forEach(row=>{if(row.action==='skip'){sk++;return;}const cats={};CATS.forEach(cat=>{cats[cat.id]={correct:row.categories[cat.id].correct,mistakes:row.categories[cat.id].mistakes};});const idx=ASSESSMENTS.findIndex(a=>a.studentId===row.student.id&&a.month===ocrSelectedMonth&&a.year===CUR_YEAR);const newA={id:genId('a'),studentId:row.student.id,classId:row.student.classId,providerId:row.student.providerId,month:ocrSelectedMonth,year:CUR_YEAR,source:'ocr',createdAt:new Date().toISOString(),categories:cats};if(idx>=0)ASSESSMENTS[idx]=newA;else ASSESSMENTS.push(newA);imp++;});OCR_IMPORTS.push({id:genId('o'),classId:ocrSelectedProvider,month:ocrSelectedMonth,year:CUR_YEAR,imported:imp,skipped:sk,timestamp:new Date().toISOString()});SYS_LOGS.unshift({id:genId('l'),type:'success',message:`OCR import — ${imp} imported, ${sk} skipped`,timestamp:new Date().toISOString()});ocrStep=1;pendingOCRData=[];_ocrFile=null;showToast(`✓ ${imp} assessments saved`,'success');renderOCR();}

// ── ANALYTICS ────────────────────────────────────────────────
function renderAnalytics(){
  const imp=STUDENTS.filter(s=>getStudentTrend(s.id)==='up'),str=STUDENTS.filter(s=>getStudentTrend(s.id)==='down');
  $('pageContent').innerHTML=`
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
<div class="card mb-6"><div class="card-header"><span class="card-title">Division Breakdown</span></div><div class="table-wrapper"><table><thead><tr><th>Division</th><th>Classes</th><th>Students</th><th>Improving</th><th>At Risk</th>${CATS.map(c=>`<th class="he">${c.label}</th>`).join('')}</tr></thead><tbody>${DIVISIONS.map(div=>{const ss=getDivisionStudents(div.id),ass=ASSESSMENTS.filter(a=>ss.some(s=>s.id===a.studentId)),im=ss.filter(s=>getStudentTrend(s.id)==='up').length,st=ss.filter(s=>getStudentTrend(s.id)==='down').length;return`<tr><td class="primary" style="font-weight:800;color:${div.color}">${div.name}</td><td><span class="badge badge-blue">${getDivisionClasses(div.id).length}</span></td><td><span class="badge badge-neutral">${ss.length}</span></td><td><span class="badge badge-success">${im}</span></td><td><span class="badge badge-danger">${st}</span></td>${CATS.map(cat=>{const v=ass.length?Math.round(ass.reduce((s,a)=>s+(a.categories[cat.id]?.correct||0),0)/ass.length*10)/10:0;return`<td style="font-weight:700;color:${cat.color}">${v}</td>`;}).join('')}</tr>`;}).join('')}</tbody></table></div></div>
<div class="card"><div class="card-header"><span class="card-title">Provider Caseload Performance</span></div><div class="table-wrapper"><table><thead><tr><th>Provider</th><th>Students</th><th>Improving</th><th>At Risk</th>${CATS.map(c=>`<th class="he">${c.label}</th>`).join('')}</tr></thead><tbody>${PROVIDERS.map(prov=>{const ss=getProviderStudents(prov.id),ass=ASSESSMENTS.filter(a=>ss.some(s=>s.id===a.studentId)),im=ss.filter(s=>getStudentTrend(s.id)==='up').length,st=ss.filter(s=>getStudentTrend(s.id)==='down').length;return`<tr><td class="primary">${prov.name}</td><td><span class="badge badge-neutral">${ss.length}</span></td><td><span class="badge badge-success">${im}</span></td><td><span class="badge badge-danger">${st}</span></td>${CATS.map(cat=>{const v=ass.length?Math.round(ass.reduce((s,a)=>s+(a.categories[cat.id]?.correct||0),0)/ass.length*10)/10:0;return`<td style="font-weight:700;color:${cat.color}">${v}</td>`;}).join('')}</tr>`;}).join('')}</tbody></table></div></div>`;
  setTimeout(()=>{const up=imp.length,down=str.length,flat=STUDENTS.length-up-down;const c1=$('tChart');if(c1)_charts.t=new Chart(c1,{type:'doughnut',data:{labels:['Improving','Stable','At Risk'],datasets:[{data:[up,flat,down],backgroundColor:['#1a6038','#808285','#9a1c1c'],borderWidth:2,borderColor:'#fff'}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:11},padding:10}}}}});const c2=$('yChart');if(c2){const months=HEB_MONTHS.slice(0,9);_charts.y=new Chart(c2,{type:'line',data:{labels:months.map(m=>m.label),datasets:CATS.map(cat=>({label:cat.label,data:months.map(m=>{const ass=ASSESSMENTS.filter(a=>a.month===m.id);return ass.length?Math.round(ass.reduce((s,a)=>s+(a.categories[cat.id]?.correct||0),0)/ass.length*10)/10:null;}),borderColor:cat.color,backgroundColor:cat.color+'15',tension:0.4,fill:true,pointRadius:3}))},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{font:{size:10},padding:8}}},scales:{x:{grid:{color:'#f5f5f5'}},y:{beginAtZero:true,grid:{color:'#f5f5f5'}}}}});}},80);
}

// ── ADMIN ────────────────────────────────────────────────────
let _aTab='logs';
function renderAdmin(){
  $('pageContent').innerHTML=`
<div class="page-header"><div><h1 class="page-title">Admin Panel</h1><p class="page-subtitle">Logs, audit trail, performance monitoring</p></div></div>
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:22px">
  <div class="kpi-card"><div class="kpi-value">${SYS_LOGS.length}</div><div class="kpi-label">System Logs</div></div>
  <div class="kpi-card gold"><div class="kpi-value">${AUDIT_LOG.length}</div><div class="kpi-label">Audit Records</div></div>
  <div class="kpi-card success"><div class="kpi-value">${OCR_IMPORTS.length}</div><div class="kpi-label">OCR Imports</div></div>
  <div class="kpi-card ${SYS_LOGS.filter(l=>l.type==='danger').length>0?'danger':'success'}"><div class="kpi-value">${SYS_LOGS.filter(l=>l.type==='danger').length}</div><div class="kpi-label">Errors</div></div>
</div>
<div style="display:flex;border-bottom:2px solid #e8d9b8;margin-bottom:22px">${['logs','audit','ocr','perf'].map(tab=>`<button style="padding:9px 18px;font-size:0.84rem;font-weight:${_aTab===tab?'700':'600'};color:${_aTab===tab?'#005778':'#808285'};cursor:pointer;border:none;background:${_aTab===tab?'#e0eef5':'transparent'};border-bottom:2px solid ${_aTab===tab?'#005778':'transparent'};margin-bottom:-2px;border-radius:${_aTab===tab?'8px 8px 0 0':'0'}" onclick="_aTab='${tab}';renderAdmin()">${{logs:'System Logs',audit:'Audit Trail',ocr:'OCR Imports',perf:'Performance'}[tab]}</button>`).join('')}</div>
<div id="aC"></div>`;
  if(_aTab==='logs'){$('aC').innerHTML=`<div class="card"><div class="card-header"><span class="card-title">System Logs (${SYS_LOGS.length})</span></div><div class="card-body" style="padding:0 20px">${SYS_LOGS.map(l=>`<div style="display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid #e8d9b8;font-size:0.82rem"><div style="width:7px;height:7px;border-radius:50%;margin-top:5px;flex-shrink:0;background:${{success:'#1a6038',warning:'#D9A44E',danger:'#9a1c1c',info:'#005778'}[l.type]||'#808285'}"></div><div style="font-size:0.7rem;color:#808285;white-space:nowrap;min-width:80px">${fmtTime(l.timestamp)}</div><div style="flex:1;color:#444">${l.message}</div></div>`).join('')}</div></div>`;}
  else if(_aTab==='audit'){$('aC').innerHTML=`<div class="card"><div class="card-header"><span class="card-title">Audit Trail (${AUDIT_LOG.length})</span></div>${AUDIT_LOG.length===0?'<div class="card-body" style="text-align:center;padding:40px;color:#808285">No audit records yet</div>':`<div class="table-wrapper"><table><thead><tr><th>Time</th><th>Action</th><th>Entity</th><th>Name</th><th>Before</th><th>After</th></tr></thead><tbody>${AUDIT_LOG.map(e=>`<tr><td style="font-size:0.76rem;white-space:nowrap">${fmtTime(e.timestamp)}</td><td><span class="badge badge-blue">${e.action}</span></td><td style="font-size:0.8rem">${e.entity}</td><td class="primary he">${e.entityName}</td><td style="color:#9a1c1c;text-decoration:line-through;font-size:0.8rem">${e.before}</td><td style="color:#1a6038;font-weight:700;font-size:0.8rem">${e.after}</td></tr>`).join('')}</tbody></table></div>`}</div>`;}
  else if(_aTab==='ocr'){$('aC').innerHTML=`<div class="card"><div class="card-header"><span class="card-title">OCR Import History (${OCR_IMPORTS.length})</span></div>${OCR_IMPORTS.length===0?`<div class="card-body" style="text-align:center;padding:40px;color:#808285">No OCR imports yet<br><button class="btn btn-primary" style="margin-top:12px" onclick="navigate('ocr')">Upload Worksheet</button></div>`:`<div class="table-wrapper"><table><thead><tr><th>Date</th><th>Class</th><th>Month</th><th>Imported</th><th>Skipped</th></tr></thead><tbody>${OCR_IMPORTS.map(i=>{const cls=getClass(i.classId);return`<tr><td style="font-size:0.8rem">${fmtDate(i.timestamp)}</td><td>${cls?cls.name:'—'}</td><td><span class="he" style="background:#005778;color:#fff;padding:2px 8px;border-radius:20px;font-size:0.7rem;font-weight:700">${getMonthLabel(i.month)} ${i.year}</span></td><td><span class="badge badge-success">${i.imported}</span></td><td><span class="badge badge-neutral">${i.skipped}</span></td></tr>`;}).join('')}</tbody></table></div>`}</div>`;}
  else{$('aC').innerHTML=`<div class="grid-2"><div class="card"><div class="card-header"><span class="card-title">Performance Metrics</span></div><div class="card-body">${[['Dashboard load','0.4s',85,'success'],['Analytics load','1.2s',60,'warning'],['OCR processing','2.1s',45,'warning'],['DB queries','0.1s',95,'success']].map(([l,v,p,s])=>`<div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between;margin-bottom:5px"><span style="font-size:0.86rem;font-weight:600">${l}</span><div style="display:flex;align-items:center;gap:8px"><span style="font-weight:700;color:#005778">${v}</span><span style="background:${s==='success'?'#e4f2eb':'#fff3e0'};color:${s==='success'?'#1a6038':'#7a4800'};padding:2px 8px;border-radius:20px;font-size:0.65rem;font-weight:800">${s==='success'?'Normal':'Slow'}</span></div></div><div style="background:#f0ece4;border-radius:20px;height:6px;overflow:hidden"><div style="height:100%;border-radius:20px;background:${s==='success'?'#005778':'#D9A44E'};width:${p}%"></div></div></div>`).join('')}</div></div><div class="card"><div class="card-header"><span class="card-title">System Health</span></div><div class="card-body">${[['Students',STUDENTS.length],['Classes',CLASSES.length],['Divisions',DIVISIONS.length],['Providers',PROVIDERS.length],['Assessments',ASSESSMENTS.length],['OCR Imports',OCR_IMPORTS.length]].map(([l,v])=>`<div style="display:flex;justify-content:space-between;padding:9px 0;border-bottom:1px solid #e8d9b8;font-size:0.84rem"><span style="color:#808285">${l}</span><span style="font-weight:800">${v}</span></div>`).join('')}<div style="background:#e4f2eb;border:1px solid #b0d8c0;border-radius:8px;padding:12px;margin-top:14px;font-size:0.84rem;color:#1a6038">✓ All systems operating normally</div></div></div></div>`;}
}

// ── VIDEOS PAGE ──────────────────────────────────────────────
function renderVideosPage(){
  $('pageContent').innerHTML=`
<div class="page-header"><div><h1 class="page-title">Upload Videos</h1><p class="page-subtitle">Upload monthly reading videos for all students</p></div></div>
<div class="card mb-6"><div class="card-header"><span class="card-title">Filter</span></div><div class="card-body"><div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
  <div class="form-group"><label class="form-label">Class</label><select class="form-control" id="vidClass" onchange="renderVideosGrid()"><option value="">All Classes</option>${DIVISIONS.map(div=>`<optgroup label="${div.name}">${getDivisionClasses(div.id).map(c=>`<option value="${c.id}">${c.name}</option>`).join('')}</optgroup>`).join('')}</select></div>
  <div class="form-group"><label class="form-label">Month</label><select class="form-control he" id="vidMonth" onchange="renderVideosGrid()">${HEB_MONTHS.map(m=>`<option value="${m.id}" ${m.id===CUR_MONTH?'selected':''}>${m.label}</option>`).join('')}</select></div>
</div></div></div>
<div id="videosGrid"></div>`;
  renderVideosGrid();
}
function renderVideosGrid(){
  const classFilter=$('vidClass')?.value||'',month=$('vidMonth')?.value||CUR_MONTH;
  const students=classFilter?getClassStudents(classFilter):STUDENTS;
  $('videosGrid').innerHTML=`<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px">${students.map((s,i)=>{const video=getStudentVideo(s.id,month,CUR_YEAR),cls=getClass(s.classId);return`<div style="border:1px solid #e8d9b8;border-radius:12px;overflow:hidden"><div style="background:linear-gradient(135deg,#005778,#1a7a9a);padding:12px 16px;color:#fff;display:flex;align-items:center;gap:10px"><div class="user-avatar" style="width:32px;height:32px;font-size:0.7rem;background:${avatarColor(i)}">${initials(sName(s))}</div><div><div class="he" style="font-weight:800;font-size:0.9rem">${sName(s)}</div><div style="font-size:0.72rem;opacity:0.8">${cls?cls.name:''}</div></div></div><div style="padding:12px;background:#fff">${video?`<video src="${video.url}" controls style="width:100%;border-radius:6px;max-height:140px;background:#000"></video><div style="font-size:0.72rem;color:#808285;margin-top:5px;text-align:center">${video.name}</div><div style="display:flex;gap:6px;margin-top:8px"><button class="btn btn-ghost btn-sm" style="flex:1" onclick="uploadVideoForGrid('${s.id}','${month}','${CUR_YEAR}')">Replace</button><button class="btn btn-outline btn-sm" onclick="sendVideoByEmail('${s.id}','${month}','${CUR_YEAR}')">📧</button></div>`:`<div style="border:2px dashed #b0cfe0;border-radius:8px;padding:20px;text-align:center;cursor:pointer;background:#e0eef5;transition:all 0.2s" onclick="uploadVideoForGrid('${s.id}','${month}','${CUR_YEAR}')" onmouseenter="this.style.background='#c8dff0'" onmouseleave="this.style.background='#e0eef5'"><div style="font-size:1.8rem;margin-bottom:4px">🎥</div><div style="font-size:0.8rem;color:#005778;font-weight:600">Upload Video</div></div>`}</div></div>`;}).join('')}</div>`;
}
function uploadVideoForGrid(sid,month,year){const input=document.createElement('input');input.type='file';input.accept='video/*';input.onchange=e=>{const file=e.target.files[0];if(!file)return;if(file.size>200*1024*1024){showToast('Video must be under 200MB','warning');return;}saveStudentVideo(sid,month,year,file);showToast(`Video uploaded for ${sName(getStudent(sid))}`,'success');renderVideosGrid();};input.click();}

// ── CSV IMPORT ───────────────────────────────────────────────
let _csvData=[];
function openCSVImport(){openModal('csvImportModal');}
function downloadCSVTemplate(type){
  let csv,filename;
  if(type==='students'){csv='firstName,lastName,className,providerName,year\nיוסף,כהן,Aleph,Rabbi Goldstein,תשפ״ו\nמנחם,לוי,Beis,Rabbi Friedman,תשפ״ו';filename='students_template.csv';}
  else{csv='name,directorName,directorEmail\nAleph,Rabbi Goldstein,goldstein@ichud.edu\nBeis,Rabbi Friedman,friedman@ichud.edu';filename='classes_template.csv';}
  const blob=new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=filename;a.click();
  showToast(`${filename} downloaded`,'success');
}
function previewCSV(input){
  const file=input.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=e=>{
    const text=e.target.result.replace(/^\uFEFF/,'');
    const lines=text.trim().split('\n');
    const headers=lines[0].split(',').map(h=>h.trim());
    _csvData=lines.slice(1).map(line=>{const vals=line.split(',').map(v=>v.trim());const obj={};headers.forEach((h,i)=>obj[h]=vals[i]||'');return obj;}).filter(row=>Object.values(row).some(v=>v));
    const preview=$('csvPreview');if(!preview)return;
    preview.innerHTML=`<div style="font-size:0.84rem;font-weight:700;color:#005778;margin-bottom:8px">${_csvData.length} rows found</div><div style="overflow-x:auto;max-height:200px;border:1px solid #e8d9b8;border-radius:8px"><table style="width:100%;border-collapse:collapse;font-size:0.8rem"><thead><tr>${headers.map(h=>`<th style="background:#005778;color:#fff;padding:7px 10px;text-align:right">${h}</th>`).join('')}</tr></thead><tbody>${_csvData.slice(0,5).map((row,i)=>`<tr style="background:${i%2===0?'#fff':'#f8f9fa'}">${headers.map(h=>`<td style="padding:6px 10px;border-bottom:1px solid #e8d9b8;text-align:right" class="he">${row[h]||''}</td>`).join('')}</tr>`).join('')}</tbody></table></div>${_csvData.length>5?`<div style="font-size:0.76rem;color:#808285;margin-top:6px">...and ${_csvData.length-5} more rows</div>`:''}`;
  };
  reader.readAsText(file,'UTF-8');
}
function importCSV(){
  const type=$('csvType')?.value||'students';
  if(!_csvData.length){showToast('No data to import','warning');return;}
  let imported=0,skipped=0;
  if(type==='students'){
    _csvData.forEach(row=>{
      if(!row.firstName||!row.lastName){skipped++;return;}
      const cls=CLASSES.find(c=>c.name===row.className)||CLASSES[0];
      const prov=PROVIDERS.find(p=>p.name===row.providerName)||null;
      STUDENTS.push({id:genId('s'),firstName:row.firstName,lastName:row.lastName,classId:cls?cls.id:'cls1',providerId:prov?prov.id:'',year:row.year||CUR_YEAR,status:'active',notes:'',emails:[]});
      imported++;
    });
    $('studentsBadge')&&($('studentsBadge').textContent=STUDENTS.length);
  }else{
    _csvData.forEach(row=>{
      if(!row.name){skipped++;return;}
      CLASSES.push({id:genId('cls'),name:row.name,divisionId:DIVISIONS[0].id,grade:''});
      imported++;
    });
  }
  closeModal('csvImportModal');showToast(`Imported ${imported} ${type} (${skipped} skipped)`,'success');_csvData=[];
  if(_page==='students')renderStudents();else if(_page==='programs')renderPrograms();
}

// ── BACKUP ───────────────────────────────────────────────────
function downloadBackup(){
  const data={exportedAt:new Date().toISOString(),version:'3.0',school:SCHOOL,kriahDirector:KRIAH_DIRECTOR,divisions:DIVISIONS,classes:CLASSES,providers:PROVIDERS,students:STUDENTS,assessments:ASSESSMENTS,reportFinals:REPORT_FINALS,ocrImports:OCR_IMPORTS,systemLog:SYS_LOGS.slice(0,100)};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);
  a.download=`KriahTrack_IchudBoys_${new Date().toISOString().slice(0,10)}.json`;a.click();
  showToast('Backup downloaded','success');
}

// ── BOOT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded',()=>{
  $('hebrewDateBadge')&&($('hebrewDateBadge').textContent=HEB_TODAY);
  document.querySelectorAll('.modal-overlay').forEach(o=>o.addEventListener('click',e=>{if(e.target===o)o.classList.remove('open');}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.modal-overlay.open').forEach(m=>m.classList.remove('open'));});
  $('studentsBadge')&&($('studentsBadge').textContent=STUDENTS.length);
  navigate('dashboard');
  // Background server sync
  setTimeout(async()=>{
    try{
      const[providers,students,assessments]=await Promise.all([API.getProviders(),API.getStudents(),API.getAssessments()]);
      // Only replace if server has real data (not just demo)
      if(students.length>0){
        STUDENTS.length=0;
        students.forEach(s=>STUDENTS.push({...s,firstName:s.first_name||s.firstName||'',lastName:s.last_name||s.lastName||'',classId:s.class_id||s.classId||s.providerId||'cls1',providerId:s.provider_id||s.providerId||'',emails:s.emails||[]}));
      }
      if(assessments.length>0){
        ASSESSMENTS.length=0;
        assessments.forEach(a=>{if(a.categories)ASSESSMENTS.push({...a,studentId:a.student_id||a.studentId,classId:a.class_id||a.classId||a.providerId,providerId:a.provider_id||a.providerId});else ASSESSMENTS.push({...a,studentId:a.student_id||a.studentId,classId:a.class_id||a.classId||a.providerId,providerId:a.provider_id||a.providerId,categories:{otiyot:{correct:a.otiyot_correct||0,mistakes:a.otiyot_mistakes||0},ot_nekuda:{correct:a.ot_nekuda_correct||0,mistakes:a.ot_nekuda_mistakes||0},ot_nekuda_ot:{correct:a.ot_nekuda_ot_correct||0,mistakes:a.ot_nekuda_ot_mistakes||0},milim:{correct:a.milim_correct||0,mistakes:0},tehilim:{correct:a.tehilim_correct||0,mistakes:0}}});});
      }
      const dot=$('serverStatusDot'),txt=$('serverStatusText');
      if(dot)dot.style.background='#1a6038';if(txt)txt.textContent='Connected';
      $('studentsBadge')&&($('studentsBadge').textContent=STUDENTS.length);
      navigate(_page,_params);
    }catch(e){console.warn('[KT] Using demo data');}
  },1500);
});

// ============================================================
// FEATURE ADDITIONS — All new requirements
// ============================================================

// ── RICH MOCK DATA with emails, providers, allocations ───────
(function enrichMockData() {
  // Add emails to existing students
  const emailData = [
    {id:'s1',  emails:['cohen.father@gmail.com','cohen.mother@gmail.com']},
    {id:'s2',  emails:['levi.dad@gmail.com']},
    {id:'s3',  emails:['goldberg.parents@gmail.com','goldberg.mom@yahoo.com']},
    {id:'s4',  emails:['rosenberg.family@gmail.com']},
    {id:'s5',  emails:['friedman.dad@gmail.com','friedman.mom@gmail.com']},
    {id:'s6',  emails:['berger.parents@gmail.com']},
    {id:'s7',  emails:['stein.father@gmail.com','stein.mother@gmail.com']},
    {id:'s8',  emails:['weiss.dad@gmail.com']},
    {id:'s9',  emails:['schwartz.parents@gmail.com','schwartz.mom@gmail.com']},
    {id:'s10', emails:['greenbaum.family@gmail.com']},
    {id:'s11', emails:['bloom.dad@gmail.com','bloom.mom@gmail.com']},
    {id:'s12', emails:['horowitz.parents@gmail.com']},
  ];
  emailData.forEach(ed => {
    const s = STUDENTS.find(x => x.id === ed.id);
    if (s) s.emails = ed.emails;
  });

  // Ensure providers have proper data
  PROVIDERS[0].phone = '718-555-0101';
  PROVIDERS[1].phone = '718-555-0102';
  PROVIDERS[2].phone = '718-555-0103';
  PROVIDERS[3].phone = '718-555-0104';
})();

// ── EMAIL TRACKING SYSTEM ────────────────────────────────────
let EMAIL_LOG = []; // { id, studentId, month, year, type, emails, sentAt, status, subject }

function logEmail(studentId, month, year, type, emails, subject) {
  const entry = {
    id: genId('email'),
    studentId, month, year, type, // 'report' | 'video' | 'combined'
    emails: Array.isArray(emails) ? emails : [emails],
    sentAt: new Date().toISOString(),
    status: 'sent', // 'sent' | 'failed' | 'pending'
    subject,
  };
  EMAIL_LOG.unshift(entry);
  SYS_LOGS.unshift({ id: genId('l'), type: 'info', message: `Email sent: ${type} — ${getStudent(studentId) ? sName(getStudent(studentId)) : studentId} — ${getMonthLabel(month)}`, timestamp: new Date().toISOString() });
  return entry;
}

function getStudentEmailLog(studentId) {
  return EMAIL_LOG.filter(e => e.studentId === studentId);
}

function resendEmail(emailId) {
  const entry = EMAIL_LOG.find(e => e.id === emailId);
  if (!entry) return;
  const s = getStudent(entry.studentId);
  if (!s) return;
  sendCombinedEmail(entry.studentId, entry.month, entry.year, true);
}

// ── COMBINED EMAIL (report + video in 1 email) ───────────────
function sendCombinedEmail(sid, month, year, isResend = false) {
  const s = getStudent(sid);
  if (!s) return;
  const emails = (s.emails || []).filter(e => e);
  if (!emails.length) {
    showToast('No parent emails on file — please add emails first', 'warning');
    openEditStudentEmailModal(sid);
    return;
  }
  const monthLabel = getMonthLabel(month);
  const video = getStudentVideo(sid, month, year);
  const hasVideo = !!video;
  const isFinal = isReportFinal(sid, month, year);
  const note = getReportNote(sid, month, year);

  // Build email body
  const subject = `Kriah ${hasVideo ? 'Report & Video' : 'Report'} — ${sName(s)} — ${monthLabel} ${year}`;
  const body = `Dear Parent,

Please find the Kriah progress ${hasVideo ? 'report and reading video' : 'report'} for ${sName(s)} for ${monthLabel} ${year}.

${note ? `Teacher's Note:\n${note}\n` : ''}
${isFinal ? '✓ This report has been finalized by the Kriah Director.' : ''}

${hasVideo ? `📹 Reading Video: A video of ${sName(s)}'s reading session is attached.\n` : ''}
Best regards,
Ichud Boys Program — Kriah Department
${KRIAH_DIRECTOR.name ? `Kriah Director: ${KRIAH_DIRECTOR.name}` : ''}`;

  const mailto = `mailto:${emails.join(',')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(mailto, '_blank');

  // Log the email
  logEmail(sid, month, year, hasVideo ? 'combined' : 'report', emails, subject);
  showToast(`Email opened for ${emails.length} address${emails.length > 1 ? 'es' : ''}${isResend ? ' (resend)' : ''}`, 'success');
}

// ── EDIT STUDENT EMAILS MODAL ────────────────────────────────
function openEditStudentEmailModal(sid) {
  const s = getStudent(sid);
  if (!s) return;
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,61,86,0.55);z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px)';
  overlay.innerHTML = `
    <div style="background:#fff;border-radius:16px;box-shadow:0 24px 56px rgba(0,87,120,0.18);width:100%;max-width:480px">
      <div style="background:linear-gradient(135deg,#003d56,#005778);padding:18px 24px;border-radius:16px 16px 0 0;display:flex;align-items:center;justify-content:space-between">
        <span style="font-size:1rem;font-weight:800;color:#fff">Parent Emails — <span class="he">${sName(s)}</span></span>
        <button onclick="this.closest('[style*=fixed]').remove()" style="width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.15);border:none;color:#fff;cursor:pointer;font-size:0.9rem">✕</button>
      </div>
      <div style="padding:24px">
        <div class="form-group">
          <label class="form-label">Parent Email 1</label>
          <input type="email" class="form-control" id="em_email1" value="${(s.emails||[])[0]||''}" placeholder="parent@email.com">
        </div>
        <div class="form-group">
          <label class="form-label">Parent Email 2</label>
          <input type="email" class="form-control" id="em_email2" value="${(s.emails||[])[1]||''}" placeholder="parent2@email.com">
        </div>
        <div style="background:#e0eef5;border-radius:8px;padding:12px;font-size:0.82rem;color:#005778">
          ℹ Reports and videos will be sent to both email addresses
        </div>
      </div>
      <div style="padding:14px 24px;border-top:1px solid #e8d9b8;display:flex;gap:10px;background:#fdf8f0;border-radius:0 0 16px 16px">
        <button class="btn btn-primary" onclick="saveStudentEmails('${sid}',this.closest('[style*=fixed]'))">Save Emails</button>
        <button class="btn btn-ghost" onclick="this.closest('[style*=fixed]').remove()">Cancel</button>
      </div>
    </div>`;
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

function saveStudentEmails(sid, overlay) {
  const s = getStudent(sid);
  if (!s) return;
  const e1 = document.getElementById('em_email1')?.value.trim();
  const e2 = document.getElementById('em_email2')?.value.trim();
  s.emails = [];
  if (e1) s.emails.push(e1);
  if (e2) s.emails.push(e2);
  overlay?.remove();
  showToast('Emails saved', 'success');
  if (_page === 'student_profile') renderStudentProfile(sid);
}

// ── PROGRAMS & CLASSES ANALYTICS ────────────────────────────
function renderProgramsAnalytics() {
  $('pageContent').innerHTML = `
<div class="page-header">
  <div><h1 class="page-title">Programs & Classes Analytics</h1><p class="page-subtitle">Ahuvim · Nechmudim · Masmidim — Side-by-side comparison</p></div>
  <button class="btn btn-ghost btn-sm" onclick="navigate('analytics')">← Full Analytics</button>
</div>

<!-- DIVISION COMPARISON CARDS -->
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-bottom:24px">
  ${DIVISIONS.map(div => {
    const ss = getDivisionStudents(div.id);
    const cls = getDivisionClasses(div.id);
    const ass = ASSESSMENTS.filter(a => ss.some(s => s.id === a.studentId));
    const imp = ss.filter(s => getStudentTrend(s.id) === 'up').length;
    const str = ss.filter(s => getStudentTrend(s.id) === 'down').length;
    const flat = ss.length - imp - str;
    const catAvgs = CATS.map(cat => {
      const v = ass.length ? Math.round(ass.reduce((s,a) => s+(a.categories[cat.id]?.correct||0),0)/ass.length*10)/10 : 0;
      return { cat, v };
    });
    return `
    <div class="card" style="border-top:4px solid ${div.color}">
      <div class="card-header" style="background:linear-gradient(135deg,${div.color},${div.color}cc)">
        <span class="card-title" style="color:#fff;font-size:1.05rem">${div.name}</span>
        <span style="color:rgba(255,255,255,0.7);font-size:0.8rem">${cls.length} classes · ${ss.length} students</span>
      </div>
      <div class="card-body">
        <!-- Trend pills -->
        <div style="display:flex;gap:8px;margin-bottom:14px">
          <div style="flex:1;text-align:center;background:#e4f2eb;border-radius:8px;padding:8px"><div style="font-size:1.4rem;font-weight:900;color:#1a6038">${imp}</div><div style="font-size:0.68rem;color:#1a6038;font-weight:700">↑ Improving</div></div>
          <div style="flex:1;text-align:center;background:#f5f5f5;border-radius:8px;padding:8px"><div style="font-size:1.4rem;font-weight:900;color:#808285">${flat}</div><div style="font-size:0.68rem;color:#808285;font-weight:700">→ Stable</div></div>
          <div style="flex:1;text-align:center;background:#fdecea;border-radius:8px;padding:8px"><div style="font-size:1.4rem;font-weight:900;color:#9a1c1c">${str}</div><div style="font-size:0.68rem;color:#9a1c1c;font-weight:700">↓ At Risk</div></div>
        </div>
        <!-- Category averages -->
        ${catAvgs.map(({cat,v}) => `
          <div style="margin-bottom:8px">
            <div style="display:flex;justify-content:space-between;margin-bottom:3px">
              <span class="he" style="font-size:0.78rem;font-weight:700;color:${cat.color}">${cat.label}</span>
              <span style="font-size:0.78rem;font-weight:800;color:#005778">${v}</span>
            </div>
            <div style="background:#f0ece4;border-radius:20px;height:5px;overflow:hidden">
              <div style="height:100%;border-radius:20px;background:${cat.color};width:${Math.min(100,v*4)}%;transition:width 0.6s"></div>
            </div>
          </div>`).join('')}
        <div style="border-top:1px solid #e8d9b8;margin-top:10px;padding-top:10px;font-size:0.78rem;color:#808285">
          ${ass.length} total assessments
        </div>
      </div>
    </div>`;
  }).join('')}
</div>

<!-- FASTEST IMPROVING CLASSES -->
<div class="grid-2 mb-6">
  <div class="card">
    <div class="card-header"><span class="card-title">🚀 Fastest Improving Classes</span></div>
    <div class="card-body" style="padding:0">
      <table>
        <thead><tr><th>Class</th><th>Division</th><th>Improving</th><th>Avg Score</th><th>Trend</th></tr></thead>
        <tbody>
          ${CLASSES.map(cls => {
            const ss = getClassStudents(cls.id);
            const div = getClassDivision(cls.id);
            const ass = ASSESSMENTS.filter(a => ss.some(s => s.id === a.studentId));
            const imp = ss.filter(s => getStudentTrend(s.id) === 'up').length;
            const avgScore = ass.length ? Math.round(CATS.reduce((sum,cat) => sum + ass.reduce((s,a) => s+(a.categories[cat.id]?.correct||0),0)/ass.length,0)/CATS.length*10)/10 : 0;
            const impPct = ss.length ? Math.round(imp/ss.length*100) : 0;
            return { cls, div, ss, imp, avgScore, impPct };
          }).sort((a,b) => b.impPct - a.impPct).map(({cls,div,ss,imp,avgScore,impPct}) => `
            <tr class="clickable" onclick="navigate('class_profile',{classId:'${cls.id}'})">
              <td class="primary">${cls.name}</td>
              <td><span style="background:#e0eef5;color:#005778;padding:2px 8px;border-radius:20px;font-size:0.72rem;font-weight:700">${div?div.name:'—'}</span></td>
              <td><span class="badge badge-success">${imp}/${ss.length}</span></td>
              <td style="font-weight:800;color:#005778">${avgScore}</td>
              <td><div style="background:#f0ece4;border-radius:20px;height:6px;width:80px;overflow:hidden"><div style="height:100%;border-radius:20px;background:#1a6038;width:${impPct}%"></div></div></td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <div class="card">
    <div class="card-header"><span class="card-title">⚠ Classes Needing Attention</span></div>
    <div class="card-body" style="padding:0">
      <table>
        <thead><tr><th>Class</th><th>Division</th><th>At Risk</th><th>Avg Score</th><th>Action</th></tr></thead>
        <tbody>
          ${CLASSES.map(cls => {
            const ss = getClassStudents(cls.id);
            const div = getClassDivision(cls.id);
            const ass = ASSESSMENTS.filter(a => ss.some(s => s.id === a.studentId));
            const str = ss.filter(s => getStudentTrend(s.id) === 'down').length;
            const avgScore = ass.length ? Math.round(CATS.reduce((sum,cat) => sum + ass.reduce((s,a) => s+(a.categories[cat.id]?.correct||0),0)/ass.length,0)/CATS.length*10)/10 : 0;
            return { cls, div, ss, str, avgScore };
          }).sort((a,b) => b.str - a.str).map(({cls,div,ss,str,avgScore}) => `
            <tr class="${str > 0 ? 'danger-row' : ''} clickable" onclick="navigate('class_profile',{classId:'${cls.id}'})">
              <td class="primary">${cls.name}</td>
              <td><span style="background:#e0eef5;color:#005778;padding:2px 8px;border-radius:20px;font-size:0.72rem;font-weight:700">${div?div.name:'—'}</span></td>
              <td><span class="badge ${str>0?'badge-danger':'badge-success'}">${str}/${ss.length}</span></td>
              <td style="font-weight:800;color:${avgScore<15?'#9a1c1c':'#005778'}">${avgScore}</td>
              <td onclick="event.stopPropagation()"><button class="btn btn-outline btn-sm" onclick="navigate('class_profile',{classId:'${cls.id}'})">View</button></td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>
</div>

<!-- SIDE BY SIDE CHART -->
<div class="card mb-6">
  <div class="card-header"><span class="card-title">Category Averages — Division Comparison</span></div>
  <div class="card-body"><div class="chart-container"><canvas id="divCompChart"></canvas></div></div>
</div>

<!-- YTD TREND BY DIVISION -->
<div class="card mb-6">
  <div class="card-header"><span class="card-title">YTD Progress — All Divisions</span></div>
  <div class="card-body"><div class="chart-container"><canvas id="ytdDivChart"></canvas></div></div>
</div>

<!-- EMAIL DELIVERY TRACKER -->
<div class="card">
  <div class="card-header">
    <span class="card-title">📧 Email Delivery Tracker</span>
    <span class="badge badge-blue">${EMAIL_LOG.length} sent</span>
  </div>
  <div class="card-body" style="padding:0">
    ${EMAIL_LOG.length === 0
      ? '<div style="text-align:center;padding:40px;color:#808285">No emails sent yet. Send reports from the Monthly Reports page.</div>'
      : `<table>
          <thead><tr><th>Student</th><th>Month</th><th>Type</th><th>Sent To</th><th>Sent At</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            ${EMAIL_LOG.slice(0,20).map(e => {
              const s = getStudent(e.studentId);
              return `<tr>
                <td class="primary he">${s ? sName(s) : '—'}</td>
                <td><span class="he" style="background:#005778;color:#fff;padding:2px 8px;border-radius:20px;font-size:0.7rem;font-weight:700">${getMonthLabel(e.month)}</span></td>
                <td><span class="badge ${e.type==='combined'?'badge-gold':e.type==='report'?'badge-blue':'badge-teal'}">${e.type}</span></td>
                <td style="font-size:0.78rem;color:#808285">${e.emails.join(', ')}</td>
                <td style="font-size:0.76rem;color:#808285">${fmtTime(e.sentAt)}</td>
                <td><span class="badge badge-success">✓ Sent</span></td>
                <td><button class="btn btn-ghost btn-sm" onclick="resendEmail('${e.id}')">Resend</button></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>`}
  </div>
</div>`;

  setTimeout(() => {
    // Division comparison radar/bar chart
    const ctx1 = $('divCompChart');
    if (ctx1) {
      _charts.divComp = new Chart(ctx1, {
        type: 'bar',
        data: {
          labels: CATS.map(c => c.label),
          datasets: DIVISIONS.map(div => {
            const ss = getDivisionStudents(div.id);
            const ass = ASSESSMENTS.filter(a => ss.some(s => s.id === a.studentId));
            return {
              label: div.name,
              backgroundColor: div.color + 'CC',
              borderColor: div.color,
              borderWidth: 2,
              data: CATS.map(cat => ass.length ? Math.round(ass.reduce((s,a) => s+(a.categories[cat.id]?.correct||0),0)/ass.length*10)/10 : 0),
            };
          }),
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 10 } } }, scales: { x: { grid: { display: false } }, y: { beginAtZero: true, grid: { color: '#f0f0f0' } } } }
      });
    }

    // YTD trend by division
    const ctx2 = $('ytdDivChart');
    if (ctx2) {
      const months = HEB_MONTHS.slice(0, 9);
      _charts.ytdDiv = new Chart(ctx2, {
        type: 'line',
        data: {
          labels: months.map(m => m.label),
          datasets: DIVISIONS.map(div => {
            const ss = getDivisionStudents(div.id);
            return {
              label: div.name,
              borderColor: div.color,
              backgroundColor: div.color + '20',
              tension: 0.4, fill: false, pointRadius: 4,
              data: months.map(m => {
                const ass = ASSESSMENTS.filter(a => ss.some(s => s.id === a.studentId) && a.month === m.id);
                if (!ass.length) return null;
                const total = CATS.reduce((sum, cat) => sum + ass.reduce((s,a) => s+(a.categories[cat.id]?.correct||0),0)/ass.length, 0);
                return Math.round(total / CATS.length * 10) / 10;
              }),
            };
          }),
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 10 } } }, scales: { x: { grid: { color: '#f5f5f5' } }, y: { beginAtZero: true, grid: { color: '#f5f5f5' } } } }
      });
    }
  }, 80);
}

// ── BULK CSV IMPORT — STUDENTS ───────────────────────────────
function downloadStudentTemplate() {
  window.open('/students_template.csv', '_blank');
  showToast('Student template downloaded', 'success');
}

function downloadProviderTemplate() {
  window.open('/providers_template.csv', '_blank');
  showToast('Provider template downloaded', 'success');
}

function openStudentCSVImport() {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,61,86,0.55);z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px)';
  overlay.innerHTML = `
    <div style="background:#fff;border-radius:16px;box-shadow:0 24px 56px rgba(0,87,120,0.18);width:100%;max-width:680px;max-height:90vh;overflow-y:auto">
      <div style="background:linear-gradient(135deg,#003d56,#005778);padding:18px 24px;border-radius:16px 16px 0 0;display:flex;align-items:center;justify-content:space-between">
        <span style="font-size:1rem;font-weight:800;color:#fff">Bulk Import Students</span>
        <button onclick="this.closest('[style*=fixed]').remove()" style="width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.15);border:none;color:#fff;cursor:pointer;font-size:0.9rem">✕</button>
      </div>
      <div style="padding:24px">
        <div style="display:flex;gap:10px;margin-bottom:16px">
          <button class="btn btn-gold btn-sm" onclick="downloadStudentTemplate()">⬇ Download Excel Template</button>
          <div style="font-size:0.82rem;color:#808285;align-self:center">Fill in the template, save as CSV, then upload below</div>
        </div>
        <div style="background:#e0eef5;border-radius:8px;padding:12px;margin-bottom:16px;font-size:0.82rem;color:#005778">
          <strong>Columns:</strong> firstName, lastName, className, divisionName, providerName, parentEmail1, parentEmail2, year, notes
        </div>
        <div style="border:2px dashed #b0cfe0;border-radius:8px;padding:28px;text-align:center;cursor:pointer;background:#e0eef5" onclick="document.getElementById('stuCSVInput').click()">
          <div style="font-size:2rem;margin-bottom:8px">📄</div>
          <div style="font-weight:700;color:#005778">Click to select CSV file</div>
          <div style="font-size:0.8rem;color:#808285;margin-top:4px">or drag and drop</div>
          <input type="file" id="stuCSVInput" accept=".csv,.xlsx" style="display:none" onchange="previewStudentCSV(this)">
        </div>
        <div id="stuCSVPreview" style="margin-top:14px"></div>
      </div>
      <div style="padding:14px 24px;border-top:1px solid #e8d9b8;display:flex;gap:10px;background:#fdf8f0;border-radius:0 0 16px 16px">
        <button class="btn btn-primary" onclick="importStudentCSV(this.closest('[style*=fixed]'))">Import Students</button>
        <button class="btn btn-ghost" onclick="this.closest('[style*=fixed]').remove()">Cancel</button>
      </div>
    </div>`;
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

let _stuCSVData = [];
function previewStudentCSV(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const text = e.target.result.replace(/^\uFEFF/, '');
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g,''));
    _stuCSVData = lines.slice(1).map(line => {
      const vals = line.split(',').map(v => v.trim().replace(/"/g,''));
      const obj = {}; headers.forEach((h,i) => obj[h] = vals[i]||'');
      return obj;
    }).filter(row => row.firstName || row.lastName);

    const preview = document.getElementById('stuCSVPreview');
    if (!preview) return;
    preview.innerHTML = `
      <div style="font-size:0.84rem;font-weight:700;color:#005778;margin-bottom:8px">${_stuCSVData.length} students found</div>
      <div style="overflow-x:auto;max-height:200px;border:1px solid #e8d9b8;border-radius:8px">
        <table style="width:100%;border-collapse:collapse;font-size:0.78rem">
          <thead><tr>${headers.slice(0,6).map(h=>`<th style="background:#005778;color:#fff;padding:6px 10px;text-align:right">${h}</th>`).join('')}</tr></thead>
          <tbody>${_stuCSVData.slice(0,5).map((row,i)=>`<tr style="background:${i%2===0?'#fff':'#f8f9fa'}">${headers.slice(0,6).map(h=>`<td style="padding:5px 10px;border-bottom:1px solid #e8d9b8;text-align:right" class="he">${row[h]||''}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
      </div>
      ${_stuCSVData.length > 5 ? `<div style="font-size:0.76rem;color:#808285;margin-top:6px">...and ${_stuCSVData.length-5} more rows</div>` : ''}`;
  };
  reader.readAsText(file, 'UTF-8');
}

function importStudentCSV(overlay) {
  if (!_stuCSVData.length) { showToast('No data to import', 'warning'); return; }
  let imported = 0, skipped = 0;
  _stuCSVData.forEach(row => {
    if (!row.firstName || !row.lastName) { skipped++; return; }
    // Find class by name
    const cls = CLASSES.find(c => c.name.toLowerCase() === (row.className||'').toLowerCase()) || CLASSES[0];
    // Find provider by name
    const prov = PROVIDERS.find(p => p.name.toLowerCase().includes((row.providerName||'').toLowerCase().split(' ').pop())) || null;
    const emails = [];
    if (row.parentEmail1) emails.push(row.parentEmail1);
    if (row.parentEmail2) emails.push(row.parentEmail2);
    STUDENTS.push({
      id: genId('s'), firstName: row.firstName, lastName: row.lastName,
      classId: cls ? cls.id : 'cls1', providerId: prov ? prov.id : '',
      year: row.year || CUR_YEAR, status: 'active',
      notes: row.notes || '', emails,
    });
    imported++;
  });
  $('studentsBadge') && ($('studentsBadge').textContent = STUDENTS.length);
  overlay?.remove();
  showToast(`✓ Imported ${imported} students${skipped > 0 ? ` (${skipped} skipped)` : ''}`, 'success');
  _stuCSVData = [];
  if (_page === 'students') renderStudents();
}

// ── BULK CSV IMPORT — PROVIDERS ──────────────────────────────
function openProviderCSVImport() {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,61,86,0.55);z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px)';
  overlay.innerHTML = `
    <div style="background:#fff;border-radius:16px;box-shadow:0 24px 56px rgba(0,87,120,0.18);width:100%;max-width:580px;max-height:90vh;overflow-y:auto">
      <div style="background:linear-gradient(135deg,#003d56,#005778);padding:18px 24px;border-radius:16px 16px 0 0;display:flex;align-items:center;justify-content:space-between">
        <span style="font-size:1rem;font-weight:800;color:#fff">Bulk Import Providers</span>
        <button onclick="this.closest('[style*=fixed]').remove()" style="width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.15);border:none;color:#fff;cursor:pointer;font-size:0.9rem">✕</button>
      </div>
      <div style="padding:24px">
        <div style="display:flex;gap:10px;margin-bottom:16px">
          <button class="btn btn-gold btn-sm" onclick="downloadProviderTemplate()">⬇ Download Template</button>
        </div>
        <div style="background:#e0eef5;border-radius:8px;padding:12px;margin-bottom:16px;font-size:0.82rem;color:#005778">
          <strong>Columns:</strong> name, email, phone
        </div>
        <div style="border:2px dashed #b0cfe0;border-radius:8px;padding:28px;text-align:center;cursor:pointer;background:#e0eef5" onclick="document.getElementById('provCSVInput').click()">
          <div style="font-size:2rem;margin-bottom:8px">📄</div>
          <div style="font-weight:700;color:#005778">Click to select CSV file</div>
          <input type="file" id="provCSVInput" accept=".csv" style="display:none" onchange="previewProviderCSV(this)">
        </div>
        <div id="provCSVPreview" style="margin-top:14px"></div>
      </div>
      <div style="padding:14px 24px;border-top:1px solid #e8d9b8;display:flex;gap:10px;background:#fdf8f0;border-radius:0 0 16px 16px">
        <button class="btn btn-primary" onclick="importProviderCSV(this.closest('[style*=fixed]'))">Import Providers</button>
        <button class="btn btn-ghost" onclick="this.closest('[style*=fixed]').remove()">Cancel</button>
      </div>
    </div>`;
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

let _provCSVData = [];
function previewProviderCSV(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const text = e.target.result.replace(/^\uFEFF/, '');
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g,''));
    _provCSVData = lines.slice(1).map(line => {
      const vals = line.split(',').map(v => v.trim().replace(/"/g,''));
      const obj = {}; headers.forEach((h,i) => obj[h] = vals[i]||'');
      return obj;
    }).filter(row => row.name);
    const preview = document.getElementById('provCSVPreview');
    if (preview) preview.innerHTML = `<div style="font-size:0.84rem;font-weight:700;color:#005778;margin-bottom:8px">${_provCSVData.length} providers found</div><div style="font-size:0.82rem;color:#444">${_provCSVData.map(r=>`${r.name} — ${r.email}`).join('<br>')}</div>`;
  };
  reader.readAsText(file, 'UTF-8');
}

function importProviderCSV(overlay) {
  if (!_provCSVData.length) { showToast('No data to import', 'warning'); return; }
  let imported = 0;
  _provCSVData.forEach(row => {
    if (!row.name) return;
    PROVIDERS.push({ id: genId('prov'), name: row.name, email: row.email||'', phone: row.phone||'' });
    imported++;
  });
  overlay?.remove();
  showToast(`✓ Imported ${imported} providers`, 'success');
  _provCSVData = [];
  if (_page === 'programs') renderPrograms();
}

// ── PATCH NAVIGATE to include programs-analytics ─────────────
const _origNavigate2 = navigate;
navigate = function(page, params = {}) {
  if (page === 'programs-analytics') {
    _page = 'programs-analytics'; _params = params;
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const navEl = document.querySelector('.nav-item[data-page="analytics"]');
    if (navEl) navEl.classList.add('active');
    const hb = $('headerBreadcrumb'); if (hb) hb.textContent = 'Programs Analytics';
    const hs = $('headerSubBreadcrumb'); if (hs) hs.textContent = '';
    destroyCharts();
    const content = $('pageContent');
    content.style.opacity = '0';
    requestAnimationFrame(() => {
      renderProgramsAnalytics();
      content.style.transition = 'opacity 0.2s'; content.style.opacity = '1';
      closeSidebar(); window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    return;
  }
  _origNavigate2(page, params);
};

// ── PATCH STUDENTS PAGE to add CSV import button ─────────────
const _origRenderStudents4 = renderStudents;
renderStudents = function() {
  _origRenderStudents4();
  // Add CSV import button to page header
  setTimeout(() => {
    const header = $('pageContent')?.querySelector('.page-header > div:last-child');
    if (header && !header.querySelector('[onclick*="StudentCSV"]')) {
      const btn = document.createElement('button');
      btn.className = 'btn btn-outline btn-sm';
      btn.setAttribute('onclick', 'openStudentCSVImport()');
      btn.innerHTML = '📄 Bulk Import CSV';
      header.insertBefore(btn, header.firstChild);
    }
  }, 50);
};

// ── PATCH PROGRAMS PAGE to add provider CSV import ───────────
const _origRenderPrograms2 = renderPrograms;
renderPrograms = function() {
  _origRenderPrograms2();
  // Add provider CSV import button
  setTimeout(() => {
    const header = $('pageContent')?.querySelector('.page-header > div:last-child');
    if (header && !header.querySelector('[onclick*="ProviderCSV"]')) {
      const btn = document.createElement('button');
      btn.className = 'btn btn-outline btn-sm';
      btn.setAttribute('onclick', 'openProviderCSVImport()');
      btn.innerHTML = '📄 Import Providers CSV';
      header.insertBefore(btn, header.firstChild);
    }
  }, 50);
};

// ── PATCH ANALYTICS PAGE to add Programs Analytics link ──────
const _origRenderAnalytics4 = renderAnalytics;
renderAnalytics = function() {
  _origRenderAnalytics4();
  // Add Programs Analytics button at top
  setTimeout(() => {
    const header = $('pageContent')?.querySelector('.page-header');
    if (header && !header.querySelector('[onclick*="programs-analytics"]')) {
      const btn = document.createElement('button');
      btn.className = 'btn btn-gold btn-sm';
      btn.setAttribute('onclick', "navigate('programs-analytics')");
      btn.innerHTML = '🏫 Programs & Classes Analytics';
      btn.style.marginBottom = '0';
      const actions = header.querySelector('div:last-child') || header;
      actions.appendChild(btn);
    }
  }, 50);
};

// ── PATCH REPORT SEND BUTTON to use combined email ───────────
sendReportByEmail = function(sid, month, year) {
  sendCombinedEmail(sid, month, year);
};

// ── PATCH STUDENT PROFILE to add email button ────────────────
const _origRenderProfileOverview3 = renderProfileOverview;
renderProfileOverview = function(sid, s, ass, lastA, prov) {
  _origRenderProfileOverview3(sid, s, ass, lastA, prov);
  // Add email management section
  setTimeout(() => {
    const profileContent = $('profileContent');
    if (!profileContent) return;
    const emailSection = document.createElement('div');
    emailSection.className = 'card mt-6';
    emailSection.style.marginTop = '18px';
    const emails = s.emails || [];
    emailSection.innerHTML = `
      <div class="card-header">
        <span class="card-title">📧 Parent Emails</span>
        <button class="btn btn-outline btn-sm" onclick="openEditStudentEmailModal('${sid}')">Edit Emails</button>
      </div>
      <div class="card-body">
        ${emails.length > 0
          ? `<div style="display:flex;flex-direction:column;gap:8px">
              ${emails.map(e => `<div style="display:flex;align-items:center;gap:10px;background:#e0eef5;border-radius:8px;padding:10px 14px"><span style="font-size:1rem">📧</span><span style="font-weight:600;color:#005778">${e}</span></div>`).join('')}
             </div>
             <div style="margin-top:12px;display:flex;gap:8px">
               ${lastA ? `<button class="btn btn-primary btn-sm" onclick="sendCombinedEmail('${sid}','${lastA.month}','${lastA.year}')">📧 Send Latest Report + Video</button>` : ''}
             </div>`
          : `<div style="text-align:center;padding:20px;color:#808285">
               <div style="font-size:1.5rem;margin-bottom:8px">📧</div>
               <div style="font-weight:600;margin-bottom:6px">No parent emails on file</div>
               <button class="btn btn-primary btn-sm" onclick="openEditStudentEmailModal('${sid}')">+ Add Parent Emails</button>
             </div>`}
      </div>`;
    profileContent.appendChild(emailSection);
  }, 100);
};

// ── SIDEBAR OFFSET — ensure content never overlaps ───────────
(function fixSidebarOffset() {
  const style = document.createElement('style');
  style.textContent = `
    .main-content { margin-left: 248px !important; }
    .page-content { padding: 26px !important; }
    @media (max-width: 900px) {
      .main-content { margin-left: 0 !important; }
    }
  `;
  document.head.appendChild(style);
})();
