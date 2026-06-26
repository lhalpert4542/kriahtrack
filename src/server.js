// ============================================================
// KriahTrack — Express API Server
// ============================================================
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../public')));

// File upload (OCR worksheets)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg','image/png','image/gif','image/webp','application/pdf'];
    cb(null, allowed.includes(file.mimetype));
  }
});

// Init DB (async with sql.js)
(async () => {
  await db.initDb();
  console.log('✅ Database initialized');
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 KriahTrack running at http://localhost:${PORT}`);
    console.log(`📁 Database: kriahtrack-server/db/kriahtrack.db`);
    console.log(`🌐 Open in browser: http://localhost:${PORT}\n`);
  });
})();

// ============================================================
// API ROUTES
// ============================================================

// ---- HEALTH ----
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '2.0.0' });
});

// ---- PROVIDERS ----
app.get('/api/providers', (req, res) => {
  try { res.json(db.getAllProviders()); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/providers/:id', (req, res) => {
  try {
    const p = db.getProviderById(req.params.id);
    if (!p) return res.status(404).json({ error: 'Provider not found' });
    res.json(p);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/providers', (req, res) => {
  try {
    const { name, director, email, city, phone, classes } = req.body;
    if (!name || !director || !email) return res.status(400).json({ error: 'name, director, email required' });
    res.status(201).json(db.createProvider({ name, director, email, city, phone, classes }));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/providers/:id', (req, res) => {
  try {
    const p = db.getProviderById(req.params.id);
    if (!p) return res.status(404).json({ error: 'Provider not found' });
    res.json(db.updateProvider(req.params.id, req.body));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ---- STUDENTS ----
app.get('/api/students', (req, res) => {
  try {
    const { providerId } = req.query;
    const students = providerId ? db.getStudentsByProvider(providerId) : db.getAllStudents();
    res.json(students);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/students/:id', (req, res) => {
  try {
    const s = db.getStudentById(req.params.id);
    if (!s) return res.status(404).json({ error: 'Student not found' });
    res.json(s);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/students', (req, res) => {
  try {
    const { firstName, lastName, providerId, class: cls, year, notes } = req.body;
    if (!firstName || !lastName || !providerId || !cls) return res.status(400).json({ error: 'firstName, lastName, providerId, class required' });
    res.status(201).json(db.createStudent({ firstName, lastName, providerId, class: cls, year, notes }));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/students/:id', (req, res) => {
  try {
    const s = db.getStudentById(req.params.id);
    if (!s) return res.status(404).json({ error: 'Student not found' });
    res.json(db.updateStudent(req.params.id, req.body));
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/students/:id', (req, res) => {
  try {
    db.deleteStudent(req.params.id);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ---- ASSESSMENTS ----
app.get('/api/assessments', (req, res) => {
  try {
    const { studentId, providerId, month, year } = req.query;
    let assessments;
    if (studentId)        assessments = db.getAssessmentsByStudent(studentId);
    else if (providerId)  assessments = db.getAssessmentsByProvider(providerId);
    else if (month)       assessments = db.getAssessmentsByMonth(month, year || 'תשפ״ו');
    else                  assessments = db.getAllAssessments();
    res.json(assessments);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/assessments', (req, res) => {
  try {
    const { studentId, providerId, month, year, categories, source, studentName } = req.body;
    if (!studentId || !month || !categories) return res.status(400).json({ error: 'studentId, month, categories required' });
    const result = db.upsertAssessment({ studentId, providerId, month, year, categories, source, studentName });
    res.status(result.updated ? 200 : 201).json(result);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/assessments/:id', (req, res) => {
  try {
    db.deleteAssessment(req.params.id);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ---- OCR IMPORT (bulk) ----
app.post('/api/ocr/import', (req, res) => {
  try {
    const { rows, providerId, month, year, fileName } = req.body;
    if (!rows || !Array.isArray(rows)) return res.status(400).json({ error: 'rows array required' });

    let imported = 0, skipped = 0, overwritten = 0;
    const importTx = db.getDb().transaction(() => {
      rows.forEach(row => {
        if (row.action === 'skip') { skipped++; return; }
        const result = db.upsertAssessment({
          studentId: row.studentId,
          providerId: row.providerId || providerId,
          month, year: year || 'תשפ״ו',
          categories: row.categories,
          source: 'ocr',
          studentName: row.studentName,
        });
        if (result.updated) overwritten++; else imported++;
      });
    });
    importTx();

    const importId = db.saveOCRImport({ providerId, month, year, fileName, imported, skipped, overwritten });
    db.addSystemLog('success', `OCR ייבוא — ${imported} יובאו, ${overwritten} דרוסו, ${skipped} דולגו`);
    res.json({ success: true, imported, skipped, overwritten, importId });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ---- OCR FILE UPLOAD ----
app.post('/api/ocr/upload', upload.single('worksheet'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    db.addSystemLog('info', `קובץ OCR הועלה: ${req.file.originalname} (${Math.round(req.file.size/1024)}KB)`);
    // Return file as base64 for client-side Tesseract processing
    res.json({
      success: true,
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      data: req.file.buffer.toString('base64'),
    });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ---- OCR IMPORTS HISTORY ----
app.get('/api/ocr/imports', (req, res) => {
  try { res.json(db.getAllOCRImports()); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

// ---- LOGS ----
app.get('/api/logs/system', (req, res) => {
  try { res.json(db.getSystemLogs(200)); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/logs/audit', (req, res) => {
  try { res.json(db.getAuditLogs(200)); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/logs/system', (req, res) => {
  try {
    const { type, message } = req.body;
    db.addSystemLog(type || 'info', message || '');
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ---- ANALYTICS ----
app.get('/api/analytics/summary', (req, res) => {
  try {
    const students   = db.getAllStudents();
    const providers  = db.getAllProviders();
    const assessments = db.getAllAssessments();
    const ocrImports = db.getAllOCRImports();
    res.json({
      totalStudents:    students.length,
      totalProviders:   providers.length,
      totalAssessments: assessments.length,
      totalOCRImports:  ocrImports.length,
    });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ---- BACKUP ----
app.get('/api/backup', (req, res) => {
  try {
    const data = db.exportAll();
    res.setHeader('Content-Disposition', `attachment; filename="kriahtrack-backup-${Date.now()}.json"`);
    res.setHeader('Content-Type', 'application/json');
    res.json(data);
    db.addSystemLog('success', 'גיבוי נתונים הורד');
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ---- CATCH-ALL: serve frontend ----
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = app;