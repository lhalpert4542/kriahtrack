// ============================================================
// KriahTrack — JSON File Database (lowdb v1)
// Zero native dependencies — works on any platform
// Data persists to db/kriahtrack.json
// ============================================================
const path = require('path');
const fs   = require('fs');
const { v4: uuidv4 } = require('uuid');

const DB_PATH = path.join(__dirname, '../db/kriahtrack.json');

let _db = null;

function getDb() { return _db; }

function saveDb() {
  fs.writeFileSync(DB_PATH, JSON.stringify(_db, null, 2), 'utf8');
}

function initDb() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

  if (fs.existsSync(DB_PATH)) {
    try {
      _db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    } catch(e) {
      console.warn('DB file corrupt, recreating...');
      _db = null;
    }
  }

  if (!_db || !_db.providers) {
    _db = { providers: [], students: [], assessments: [], ocrImports: [], auditLog: [], systemLog: [] };
    seedData();
    saveDb();
  }

  // Auto-save every 10 seconds
  setInterval(saveDb, 10000);
  return _db;
}

// ---- SEED DATA ----
function seedData() {
  const providers = [
    { id:'p1', name:'בית ספר אהבת תורה',    director:'הרב משה לוי',    email:'moshe@ahavatorah.edu',  city:'בני ברק',  phone:'03-555-1234', classes:['א׳','ב׳','ג׳'],  createdAt: new Date().toISOString() },
    { id:'p2', name:'תלמוד תורה אור החיים',  director:'הרב אברהם כהן',  email:'avraham@orchaim.edu',   city:'ירושלים',  phone:'02-555-5678', classes:['א׳','ב׳'],       createdAt: new Date().toISOString() },
    { id:'p3', name:'ישיבה קטנה בית יעקב',   director:'הרב יצחק שפירא', email:'yitzchak@beitya.edu',   city:'אשדוד',    phone:'08-555-9012', classes:['א׳','ב׳','ג׳','ד׳'], createdAt: new Date().toISOString() },
    { id:'p4', name:'חדר מרכזי ברסלב',       director:'הרב נחמן גרין',  email:'nachman@breslov.edu',   city:'צפת',      phone:'04-555-3456', classes:['א׳','ב׳'],       createdAt: new Date().toISOString() },
  ];
  _db.providers = providers;

  const students = [
    {id:'s1', firstName:'יוסף',  lastName:'כהן',      providerId:'p1', class:'א׳', year:'תשפ״ו', status:'active', notes:''},
    {id:'s2', firstName:'מנחם',  lastName:'לוי',      providerId:'p1', class:'א׳', year:'תשפ״ו', status:'active', notes:''},
    {id:'s3', firstName:'אברהם', lastName:'גולדברג',  providerId:'p1', class:'ב׳', year:'תשפ״ו', status:'active', notes:''},
    {id:'s4', firstName:'שמואל', lastName:'רוזנברג',  providerId:'p2', class:'א׳', year:'תשפ״ו', status:'active', notes:''},
    {id:'s5', firstName:'דוד',   lastName:'פרידמן',   providerId:'p2', class:'ב׳', year:'תשפ״ו', status:'active', notes:''},
    {id:'s6', firstName:'ישראל', lastName:'ברגר',     providerId:'p3', class:'א׳', year:'תשפ״ו', status:'active', notes:''},
    {id:'s7', firstName:'מרדכי', lastName:'שטיין',    providerId:'p3', class:'ב׳', year:'תשפ״ו', status:'active', notes:''},
    {id:'s8', firstName:'פנחס',  lastName:'וייס',     providerId:'p3', class:'ג׳', year:'תשפ״ו', status:'active', notes:''},
    {id:'s9', firstName:'אליהו', lastName:'שוורץ',    providerId:'p4', class:'א׳', year:'תשפ״ו', status:'active', notes:''},
    {id:'s10',firstName:'נחמן',  lastName:'גרינבאום', providerId:'p4', class:'ב׳', year:'תשפ״ו', status:'active', notes:''},
    {id:'s11',firstName:'חיים',  lastName:'בלום',     providerId:'p1', class:'ג׳', year:'תשפ״ו', status:'active', notes:''},
    {id:'s12',firstName:'זלמן',  lastName:'הורוביץ',  providerId:'p2', class:'א׳', year:'תשפ״ו', status:'active', notes:''},
  ];
  _db.students = students;

  const MONTH_ORDER = ['tishrei','cheshvan','kislev','tevet','shvat','adar','nisan','iyar','sivan'];
  _db.assessments = [];
  students.forEach(s => {
    const base = 10 + Math.floor(Math.random()*12);
    MONTH_ORDER.forEach((month, mi) => {
      if (Math.random() > 0.12) {
        const g = mi * 1.2;
        const n = () => Math.floor(Math.random()*4)-1;
        _db.assessments.push({
          id: `a_${s.id}_${month}`,
          studentId: s.id, providerId: s.providerId,
          month, year: 'תשפ״ו', source: 'manual',
          createdAt: new Date().toISOString(),
          categories: {
            otiyot:       { correct: Math.max(0,Math.min(30,Math.floor(base+g+n()+8))), mistakes: Math.max(0,Math.floor(7-g*0.3+Math.abs(n()))) },
            ot_nekuda:    { correct: Math.max(0,Math.min(28,Math.floor(base+g+n()+4))), mistakes: Math.max(0,Math.floor(9-g*0.3+Math.abs(n()))) },
            ot_nekuda_ot: { correct: Math.max(0,Math.min(25,Math.floor(base+g+n()))),   mistakes: Math.max(0,Math.floor(11-g*0.3+Math.abs(n()))) },
            milim:        { correct: Math.max(0,Math.min(22,Math.floor(base+g+n()-2))), mistakes: Math.max(0,Math.floor(9-g*0.3+Math.abs(n()))) },
            tehilim:      { correct: Math.max(0,Math.min(20,Math.floor(base+g+n()-4))), mistakes: Math.max(0,Math.floor(7-g*0.3+Math.abs(n()))) },
          }
        });
      }
    });
  });

  _db.systemLog = [
    { id: uuidv4(), type:'success', message:'מערכת KriahTrack אותחלה בהצלחה', user_name:'מערכת', created_at: new Date().toISOString() },
    { id: uuidv4(), type:'info',    message:'נתוני דמו נטענו — 12 תלמידים, 4 ספקים', user_name:'מערכת', created_at: new Date().toISOString() },
  ];
  _db.auditLog = [];
  _db.ocrImports = [];
}

// ---- HELPERS ----
function addAuditLog(action, entity, entityName, field, before, after) {
  _db.auditLog.unshift({ id:uuidv4(), action, entity, entity_name:entityName, field:field||'', before_val:String(before||''), after_val:String(after||''), user_name:'מנהל', created_at:new Date().toISOString() });
  if (_db.auditLog.length > 500) _db.auditLog = _db.auditLog.slice(0,500);
  saveDb();
}
function addSystemLog(type, message, user) {
  _db.systemLog.unshift({ id:uuidv4(), type, message, user_name:user||'מנהל', created_at:new Date().toISOString() });
  if (_db.systemLog.length > 500) _db.systemLog = _db.systemLog.slice(0,500);
  saveDb();
}
function getSystemLogs(limit=100) { return _db.systemLog.slice(0,limit); }
function getAuditLogs(limit=100)  { return _db.auditLog.slice(0,limit); }

// ---- PROVIDERS ----
function getAllProviders() { return [..._db.providers].sort((a,b)=>a.name.localeCompare(b.name)); }
function getProviderById(id) { return _db.providers.find(p=>p.id===id)||null; }
function createProvider(data) {
  const p = { id:uuidv4(), name:data.name, director:data.director, email:data.email, city:data.city||'', phone:data.phone||'', classes:data.classes||['א׳','ב׳'], createdAt:new Date().toISOString() };
  _db.providers.push(p);
  addAuditLog('הוספת ספק','ספק',data.name,'—','—','נוצר');
  addSystemLog('info',`ספק חדש נוסף: ${data.name}`);
  saveDb(); return p;
}
function updateProvider(id, data) {
  const idx = _db.providers.findIndex(p=>p.id===id);
  if (idx<0) return null;
  _db.providers[idx] = { ..._db.providers[idx], ...data, id, updatedAt:new Date().toISOString() };
  saveDb(); return _db.providers[idx];
}

// ---- STUDENTS ----
function getAllStudents() { return [..._db.students].sort((a,b)=>a.lastName.localeCompare(b.lastName)); }
function getStudentById(id) { return _db.students.find(s=>s.id===id)||null; }
function getStudentsByProvider(providerId) { return _db.students.filter(s=>s.providerId===providerId); }
function createStudent(data) {
  const s = { id:uuidv4(), firstName:data.firstName, lastName:data.lastName, providerId:data.providerId, class:data.class, year:data.year||'תשפ״ו', status:'active', notes:data.notes||'', createdAt:new Date().toISOString() };
  _db.students.push(s);
  addAuditLog('הוספת תלמיד','תלמיד',`${data.firstName} ${data.lastName}`,'—','—','נוצר');
  addSystemLog('info',`תלמיד חדש נוסף: ${data.firstName} ${data.lastName}`);
  saveDb(); return s;
}
function updateStudent(id, data) {
  const idx = _db.students.findIndex(s=>s.id===id);
  if (idx<0) return null;
  _db.students[idx] = { ..._db.students[idx], ...data, id, updatedAt:new Date().toISOString() };
  saveDb(); return _db.students[idx];
}
function deleteStudent(id) {
  const s = getStudentById(id);
  _db.students = _db.students.filter(x=>x.id!==id);
  _db.assessments = _db.assessments.filter(a=>a.studentId!==id);
  if (s) addAuditLog('מחיקת תלמיד','תלמיד',`${s.firstName} ${s.lastName}`,'—','קיים','נמחק');
  saveDb();
}

// ---- ASSESSMENTS ----
const MONTH_ORDER_MAP = {tishrei:1,cheshvan:2,kislev:3,tevet:4,shvat:5,adar:6,nisan:7,iyar:8,sivan:9,tamuz:10,av:11,elul:12};
function getAssessmentsByStudent(studentId) {
  return _db.assessments.filter(a=>a.studentId===studentId).sort((a,b)=>(MONTH_ORDER_MAP[a.month]||0)-(MONTH_ORDER_MAP[b.month]||0));
}
function getAssessmentsByProvider(providerId) { return _db.assessments.filter(a=>a.providerId===providerId); }
function getAllAssessments() { return _db.assessments; }
function getAssessmentsByMonth(month,year) { return _db.assessments.filter(a=>a.month===month&&a.year===year); }
function upsertAssessment(data) {
  const idx = _db.assessments.findIndex(a=>a.studentId===data.studentId&&a.month===data.month&&a.year===(data.year||'תשפ״ו'));
  if (idx>=0) {
    _db.assessments[idx] = { ..._db.assessments[idx], categories:data.categories, source:data.source||'manual', updatedAt:new Date().toISOString() };
    addAuditLog('עדכון הערכה','הערכה',data.studentName||'תלמיד','חודש',data.month,'עודכן');
    saveDb(); return { id:_db.assessments[idx].id, updated:true };
  } else {
    const a = { id:uuidv4(), studentId:data.studentId, providerId:data.providerId||'', month:data.month, year:data.year||'תשפ״ו', source:data.source||'manual', createdAt:new Date().toISOString(), categories:data.categories };
    _db.assessments.push(a);
    addAuditLog('הוספת הערכה','הערכה',data.studentName||'תלמיד','חודש','—',data.month);
    saveDb(); return { id:a.id, updated:false };
  }
}
function deleteAssessment(id) {
  const a = _db.assessments.find(x=>x.id===id);
  _db.assessments = _db.assessments.filter(x=>x.id!==id);
  if (a) addAuditLog('מחיקת הערכה','הערכה',a.studentId,'חודש',a.month,'נמחק');
  saveDb();
}

// ---- OCR IMPORTS ----
function saveOCRImport(data) {
  const imp = { id:uuidv4(), provider_id:data.providerId, month:data.month, year:data.year||'תשפ״ו', file_name:data.fileName||'', imported:data.imported||0, skipped:data.skipped||0, overwritten:data.overwritten||0, created_at:new Date().toISOString() };
  _db.ocrImports.unshift(imp);
  addSystemLog('success',`OCR ייבוא — ${data.imported} יובאו, ${data.skipped} דולגו`);
  saveDb(); return imp.id;
}
function getAllOCRImports() { return _db.ocrImports; }

// ---- BACKUP ----
function exportAll() {
  return { exportedAt:new Date().toISOString(), providers:getAllProviders(), students:getAllStudents(), assessments:getAllAssessments() };
}

module.exports = {
  initDb, getDb,
  getAllProviders, getProviderById, createProvider, updateProvider,
  getAllStudents, getStudentById, getStudentsByProvider, createStudent, updateStudent, deleteStudent,
  getAssessmentsByStudent, getAssessmentsByProvider, getAllAssessments, getAssessmentsByMonth,
  upsertAssessment, deleteAssessment,
  saveOCRImport, getAllOCRImports,
  addAuditLog, addSystemLog, getSystemLogs, getAuditLogs,
  exportAll,
};