// ============================================================
// KriahTrack — sql.js Database Layer (pure JS SQLite)
// Data persists to disk as a binary file
// ============================================================
const path = require('path');
const fs   = require('fs');
const { v4: uuidv4 } = require('uuid');

const DB_PATH  = path.join(__dirname, '../db/kriahtrack.db');
const SQL_WASM = path.join(__dirname, '../node_modules/sql.js/dist/sql-wasm.js');

let _db   = null;
let _SQL  = null;
let _dirty = false;

// Persist to disk every 5 seconds if dirty
function startAutosave() {
  setInterval(() => {
    if (_dirty && _db) {
      const data = _db.export();
      fs.writeFileSync(DB_PATH, Buffer.from(data));
      _dirty = false;
    }
  }, 5000);
}

function save() {
  _dirty = true;
}

async function initDb() {
  // Load sql.js
  const initSqlJs = require(SQL_WASM);
  _SQL = await initSqlJs();

  // Load existing DB or create new
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    _db = new _SQL.Database(fileBuffer);
  } else {
    _db = new _SQL.Database();
  }

  // Create schema
  _db.run(`PRAGMA foreign_keys = ON;`);
  _db.run(`
    CREATE TABLE IF NOT EXISTS providers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      director TEXT NOT NULL,
      email TEXT NOT NULL,
      city TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      classes TEXT DEFAULT '["א׳","ב׳"]',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      provider_id TEXT NOT NULL,
      class TEXT NOT NULL,
      year TEXT DEFAULT 'תשפ״ו',
      status TEXT DEFAULT 'active',
      notes TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS assessments (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      provider_id TEXT NOT NULL,
      month TEXT NOT NULL,
      year TEXT NOT NULL DEFAULT 'תשפ״ו',
      source TEXT DEFAULT 'manual',
      otiyot_correct INTEGER DEFAULT 0,
      otiyot_mistakes INTEGER DEFAULT 0,
      ot_nekuda_correct INTEGER DEFAULT 0,
      ot_nekuda_mistakes INTEGER DEFAULT 0,
      ot_nekuda_ot_correct INTEGER DEFAULT 0,
      ot_nekuda_ot_mistakes INTEGER DEFAULT 0,
      milim_correct INTEGER DEFAULT 0,
      milim_mistakes INTEGER DEFAULT 0,
      tehilim_correct INTEGER DEFAULT 0,
      tehilim_mistakes INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
    CREATE UNIQUE INDEX IF NOT EXISTS idx_assess_unique ON assessments(student_id, month, year);
    CREATE TABLE IF NOT EXISTS ocr_imports (
      id TEXT PRIMARY KEY,
      provider_id TEXT NOT NULL,
      month TEXT NOT NULL,
      year TEXT NOT NULL,
      file_name TEXT DEFAULT '',
      imported INTEGER DEFAULT 0,
      skipped INTEGER DEFAULT 0,
      overwritten INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS audit_log (
      id TEXT PRIMARY KEY,
      action TEXT NOT NULL,
      entity TEXT NOT NULL,
      entity_name TEXT NOT NULL,
      field TEXT DEFAULT '',
      before_val TEXT DEFAULT '',
      after_val TEXT DEFAULT '',
      user_name TEXT DEFAULT 'מנהל',
      created_at TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS system_log (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      message TEXT NOT NULL,
      user_name TEXT DEFAULT 'מנהל',
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // Seed if empty
  const count = queryOne('SELECT COUNT(*) as c FROM providers');
  if (!count || count.c === 0) seedData();

  // Save initial state
  const data = _db.export();
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, Buffer.from(data));

  startAutosave();
  return _db;
}

// ---- QUERY HELPERS ----
function query(sql, params = []) {
  const stmt = _db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

function queryOne(sql, params = []) {
  const rows = query(sql, params);
  return rows[0] || null;
}

function run(sql, params = []) {
  _db.run(sql, params);
  save();
}

// ---- SEED DATA ----
function seedData() {
  const providers = [
    { id:'p1', name:'בית ספר אהבת תורה',    director:'הרב משה לוי',    email:'moshe@ahavatorah.edu',  city:'בני ברק',  phone:'03-555-1234', classes:['א׳','ב׳','ג׳'] },
    { id:'p2', name:'תלמוד תורה אור החיים',  director:'הרב אברהם כהן',  email:'avraham@orchaim.edu',   city:'ירושלים',  phone:'02-555-5678', classes:['א׳','ב׳'] },
    { id:'p3', name:'ישיבה קטנה בית יעקב',   director:'הרב יצחק שפירא', email:'yitzchak@beitya.edu',   city:'אשדוד',    phone:'08-555-9012', classes:['א׳','ב׳','ג׳','ד׳'] },
    { id:'p4', name:'חדר מרכזי ברסלב',       director:'הרב נחמן גרין',  email:'nachman@breslov.edu',   city:'צפת',      phone:'04-555-3456', classes:['א׳','ב׳'] },
  ];
  providers.forEach(p => run(
    'INSERT INTO providers (id,name,director,email,city,phone,classes) VALUES (?,?,?,?,?,?,?)',
    [p.id, p.name, p.director, p.email, p.city, p.phone, JSON.stringify(p.classes)]
  ));

  const students = [
    {id:'s1', fn:'יוסף',  ln:'כהן',      pid:'p1', cls:'א׳'},
    {id:'s2', fn:'מנחם',  ln:'לוי',      pid:'p1', cls:'א׳'},
    {id:'s3', fn:'אברהם', ln:'גולדברג',  pid:'p1', cls:'ב׳'},
    {id:'s4', fn:'שמואל', ln:'רוזנברג',  pid:'p2', cls:'א׳'},
    {id:'s5', fn:'דוד',   ln:'פרידמן',   pid:'p2', cls:'ב׳'},
    {id:'s6', fn:'ישראל', ln:'ברגר',     pid:'p3', cls:'א׳'},
    {id:'s7', fn:'מרדכי', ln:'שטיין',    pid:'p3', cls:'ב׳'},
    {id:'s8', fn:'פנחס',  ln:'וייס',     pid:'p3', cls:'ג׳'},
    {id:'s9', fn:'אליהו', ln:'שוורץ',    pid:'p4', cls:'א׳'},
    {id:'s10',fn:'נחמן',  ln:'גרינבאום', pid:'p4', cls:'ב׳'},
    {id:'s11',fn:'חיים',  ln:'בלום',     pid:'p1', cls:'ג׳'},
    {id:'s12',fn:'זלמן',  ln:'הורוביץ',  pid:'p2', cls:'א׳'},
  ];
  students.forEach(s => run(
    'INSERT INTO students (id,first_name,last_name,provider_id,class,year) VALUES (?,?,?,?,?,?)',
    [s.id, s.fn, s.ln, s.pid, s.cls, 'תשפ״ו']
  ));

  const months = ['tishrei','cheshvan','kislev','tevet','shvat','adar','nisan','iyar','sivan'];
  students.forEach(s => {
    const base = 10 + Math.floor(Math.random()*12);
    months.forEach((month, mi) => {
      if (Math.random() > 0.12) {
        const g = mi * 1.2;
        const n = () => Math.floor(Math.random()*4)-1;
        try {
          run(`INSERT OR IGNORE INTO assessments
            (id,student_id,provider_id,month,year,source,
             otiyot_correct,otiyot_mistakes,ot_nekuda_correct,ot_nekuda_mistakes,
             ot_nekuda_ot_correct,ot_nekuda_ot_mistakes,milim_correct,milim_mistakes,
             tehilim_correct,tehilim_mistakes)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [`a_${s.id}_${month}`, s.id, s.pid, month, 'תשפ״ו', 'manual',
             Math.max(0,Math.min(30,Math.floor(base+g+n()+8))), Math.max(0,Math.floor(7-g*0.3+Math.abs(n()))),
             Math.max(0,Math.min(28,Math.floor(base+g+n()+4))), Math.max(0,Math.floor(9-g*0.3+Math.abs(n()))),
             Math.max(0,Math.min(25,Math.floor(base+g+n()))),   Math.max(0,Math.floor(11-g*0.3+Math.abs(n()))),
             Math.max(0,Math.min(22,Math.floor(base+g+n()-2))), Math.max(0,Math.floor(9-g*0.3+Math.abs(n()))),
             Math.max(0,Math.min(20,Math.floor(base+g+n()-4))), Math.max(0,Math.floor(7-g*0.3+Math.abs(n())))
            ]);
        } catch(e) {}
      }
    });
  });

  run('INSERT INTO system_log (id,type,message,user_name) VALUES (?,?,?,?)',
    [uuidv4(),'success','מערכת KriahTrack אותחלה בהצלחה','מערכת']);
  run('INSERT INTO system_log (id,type,message,user_name) VALUES (?,?,?,?)',
    [uuidv4(),'info','נתוני דמו נטענו — 12 תלמידים, 4 ספקים','מערכת']);
}

// ---- ROW NORMALIZER ----
function rowToAssessment(row) {
  if (!row) return null;
  return {
    ...row,
    categories: {
      otiyot:       { correct: row.otiyot_correct||0,       mistakes: row.otiyot_mistakes||0 },
      ot_nekuda:    { correct: row.ot_nekuda_correct||0,    mistakes: row.ot_nekuda_mistakes||0 },
      ot_nekuda_ot: { correct: row.ot_nekuda_ot_correct||0, mistakes: row.ot_nekuda_ot_mistakes||0 },
      milim:        { correct: row.milim_correct||0,        mistakes: row.milim_mistakes||0 },
      tehilim:      { correct: row.tehilim_correct||0,      mistakes: row.tehilim_mistakes||0 },
    }
  };
}

const MONTH_ORDER = 'CASE month WHEN "tishrei" THEN 1 WHEN "cheshvan" THEN 2 WHEN "kislev" THEN 3 WHEN "tevet" THEN 4 WHEN "shvat" THEN 5 WHEN "adar" THEN 6 WHEN "nisan" THEN 7 WHEN "iyar" THEN 8 WHEN "sivan" THEN 9 WHEN "tamuz" THEN 10 WHEN "av" THEN 11 WHEN "elul" THEN 12 END';

// ---- PROVIDERS ----
function getAllProviders() {
  return query('SELECT * FROM providers ORDER BY name').map(p => ({ ...p, classes: JSON.parse(p.classes||'[]') }));
}
function getProviderById(id) {
  const p = queryOne('SELECT * FROM providers WHERE id=?', [id]);
  if (p) p.classes = JSON.parse(p.classes||'[]');
  return p;
}
function createProvider(data) {
  const id = uuidv4();
  run('INSERT INTO providers (id,name,director,email,city,phone,classes) VALUES (?,?,?,?,?,?,?)',
    [id, data.name, data.director, data.email, data.city||'', data.phone||'', JSON.stringify(data.classes||['א׳','ב׳'])]);
  addAuditLog('הוספת ספק','ספק',data.name,'—','—','נוצר');
  addSystemLog('info',`ספק חדש נוסף: ${data.name}`);
  return getProviderById(id);
}
function updateProvider(id, data) {
  run('UPDATE providers SET name=?,director=?,email=?,city=?,phone=?,updated_at=datetime("now") WHERE id=?',
    [data.name, data.director, data.email, data.city||'', data.phone||'', id]);
  return getProviderById(id);
}

// ---- STUDENTS ----
function getAllStudents() {
  return query('SELECT * FROM students ORDER BY last_name, first_name');
}
function getStudentById(id) {
  return queryOne('SELECT * FROM students WHERE id=?', [id]);
}
function getStudentsByProvider(providerId) {
  return query('SELECT * FROM students WHERE provider_id=? ORDER BY last_name,first_name', [providerId]);
}
function createStudent(data) {
  const id = uuidv4();
  run('INSERT INTO students (id,first_name,last_name,provider_id,class,year,notes) VALUES (?,?,?,?,?,?,?)',
    [id, data.firstName, data.lastName, data.providerId, data.class, data.year||'תשפ״ו', data.notes||'']);
  addAuditLog('הוספת תלמיד','תלמיד',`${data.firstName} ${data.lastName}`,'—','—','נוצר');
  addSystemLog('info',`תלמיד חדש נוסף: ${data.firstName} ${data.lastName}`);
  return getStudentById(id);
}
function updateStudent(id, data) {
  run('UPDATE students SET first_name=?,last_name=?,provider_id=?,class=?,notes=?,updated_at=datetime("now") WHERE id=?',
    [data.firstName, data.lastName, data.providerId, data.class, data.notes||'', id]);
  return getStudentById(id);
}
function deleteStudent(id) {
  const s = getStudentById(id);
  run('DELETE FROM assessments WHERE student_id=?', [id]);
  run('DELETE FROM students WHERE id=?', [id]);
  if (s) addAuditLog('מחיקת תלמיד','תלמיד',`${s.first_name} ${s.last_name}`,'—','קיים','נמחק');
}

// ---- ASSESSMENTS ----
function getAssessmentsByStudent(studentId) {
  return query(`SELECT * FROM assessments WHERE student_id=? ORDER BY ${MONTH_ORDER}`, [studentId]).map(rowToAssessment);
}
function getAssessmentsByProvider(providerId) {
  return query('SELECT * FROM assessments WHERE provider_id=?', [providerId]).map(rowToAssessment);
}
function getAllAssessments() {
  return query('SELECT * FROM assessments').map(rowToAssessment);
}
function getAssessmentsByMonth(month, year) {
  return query('SELECT * FROM assessments WHERE month=? AND year=?', [month, year]).map(rowToAssessment);
}
function upsertAssessment(data) {
  const cats = data.categories;
  const existing = queryOne('SELECT id FROM assessments WHERE student_id=? AND month=? AND year=?',
    [data.studentId, data.month, data.year||'תשפ״ו']);
  if (existing) {
    run(`UPDATE assessments SET source=?,
      otiyot_correct=?,otiyot_mistakes=?,ot_nekuda_correct=?,ot_nekuda_mistakes=?,
      ot_nekuda_ot_correct=?,ot_nekuda_ot_mistakes=?,milim_correct=?,milim_mistakes=?,
      tehilim_correct=?,tehilim_mistakes=?,updated_at=datetime('now') WHERE id=?`,
      [data.source||'manual',
       cats.otiyot.correct, cats.otiyot.mistakes,
       cats.ot_nekuda.correct, cats.ot_nekuda.mistakes,
       cats.ot_nekuda_ot.correct, cats.ot_nekuda_ot.mistakes,
       cats.milim.correct, cats.milim.mistakes,
       cats.tehilim.correct, cats.tehilim.mistakes,
       existing.id]);
    addAuditLog('עדכון הערכה','הערכה',data.studentName||'תלמיד','חודש',data.month,'עודכן');
    return { id: existing.id, updated: true };
  } else {
    const id = uuidv4();
    run(`INSERT INTO assessments
      (id,student_id,provider_id,month,year,source,
       otiyot_correct,otiyot_mistakes,ot_nekuda_correct,ot_nekuda_mistakes,
       ot_nekuda_ot_correct,ot_nekuda_ot_mistakes,milim_correct,milim_mistakes,
       tehilim_correct,tehilim_mistakes)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [id, data.studentId, data.providerId||'', data.month, data.year||'תשפ״ו', data.source||'manual',
       cats.otiyot.correct, cats.otiyot.mistakes,
       cats.ot_nekuda.correct, cats.ot_nekuda.mistakes,
       cats.ot_nekuda_ot.correct, cats.ot_nekuda_ot.mistakes,
       cats.milim.correct, cats.milim.mistakes,
       cats.tehilim.correct, cats.tehilim.mistakes]);
    addAuditLog('הוספת הערכה','הערכה',data.studentName||'תלמיד','חודש','—',data.month);
    return { id, updated: false };
  }
}
function deleteAssessment(id) {
  const a = queryOne('SELECT * FROM assessments WHERE id=?', [id]);
  run('DELETE FROM assessments WHERE id=?', [id]);
  if (a) addAuditLog('מחיקת הערכה','הערכה',a.student_id,'חודש',a.month,'נמחק');
}

// ---- OCR IMPORTS ----
function saveOCRImport(data) {
  const id = uuidv4();
  run('INSERT INTO ocr_imports (id,provider_id,month,year,file_name,imported,skipped,overwritten) VALUES (?,?,?,?,?,?,?,?)',
    [id, data.providerId, data.month, data.year||'תשפ״ו', data.fileName||'', data.imported||0, data.skipped||0, data.overwritten||0]);
  return id;
}
function getAllOCRImports() {
  return query('SELECT * FROM ocr_imports ORDER BY created_at DESC');
}

// ---- LOGS ----
function addAuditLog(action, entity, entityName, field, before, after) {
  run('INSERT INTO audit_log (id,action,entity,entity_name,field,before_val,after_val) VALUES (?,?,?,?,?,?,?)',
    [uuidv4(), action, entity, entityName, field||'', String(before||''), String(after||'')]);
}
function addSystemLog(type, message, user) {
  run('INSERT INTO system_log (id,type,message,user_name) VALUES (?,?,?,?)',
    [uuidv4(), type, message, user||'מנהל']);
}
function getSystemLogs(limit=100) {
  return query('SELECT * FROM system_log ORDER BY created_at DESC LIMIT ?', [limit]);
}
function getAuditLogs(limit=100) {
  return query('SELECT * FROM audit_log ORDER BY created_at DESC LIMIT ?', [limit]);
}

// ---- BACKUP ----
function exportAll() {
  return {
    exportedAt: new Date().toISOString(),
    providers:   getAllProviders(),
    students:    getAllStudents(),
    assessments: getAllAssessments(),
  };
}

module.exports = {
  initDb,
  getAllProviders, getProviderById, createProvider, updateProvider,
  getAllStudents, getStudentById, getStudentsByProvider, createStudent, updateStudent, deleteStudent,
  getAssessmentsByStudent, getAssessmentsByProvider, getAllAssessments, getAssessmentsByMonth,
  upsertAssessment, deleteAssessment,
  saveOCRImport, getAllOCRImports,
  addAuditLog, addSystemLog, getSystemLogs, getAuditLogs,
  exportAll,
};