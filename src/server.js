const express = require('express');
const cors    = require('cors');
const path    = require('path');
const multer  = require('multer');
const db      = require('./database');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20*1024*1024 } });

db.initDb();
console.log('✅ Database initialized');

app.get('/api/health', (req,res) => res.json({ status:'ok', timestamp:new Date().toISOString(), version:'2.0.0' }));

app.get('/api/providers', (req,res) => { try { res.json(db.getAllProviders()); } catch(e) { res.status(500).json({error:e.message}); } });
app.get('/api/providers/:id', (req,res) => { try { const p=db.getProviderById(req.params.id); if(!p) return res.status(404).json({error:'Not found'}); res.json(p); } catch(e) { res.status(500).json({error:e.message}); } });
app.post('/api/providers', (req,res) => { try { const {name,director,email,city,phone,classes}=req.body; if(!name||!director||!email) return res.status(400).json({error:'name,director,email required'}); res.status(201).json(db.createProvider({name,director,email,city,phone,classes})); } catch(e) { res.status(500).json({error:e.message}); } });
app.put('/api/providers/:id', (req,res) => { try { res.json(db.updateProvider(req.params.id,req.body)); } catch(e) { res.status(500).json({error:e.message}); } });

app.get('/api/students', (req,res) => { try { const {providerId}=req.query; res.json(providerId ? db.getStudentsByProvider(providerId) : db.getAllStudents()); } catch(e) { res.status(500).json({error:e.message}); } });
app.get('/api/students/:id', (req,res) => { try { const s=db.getStudentById(req.params.id); if(!s) return res.status(404).json({error:'Not found'}); res.json(s); } catch(e) { res.status(500).json({error:e.message}); } });
app.post('/api/students', (req,res) => { try { const {firstName,lastName,providerId,class:cls,year,notes}=req.body; if(!firstName||!lastName||!providerId||!cls) return res.status(400).json({error:'firstName,lastName,providerId,class required'}); res.status(201).json(db.createStudent({firstName,lastName,providerId,class:cls,year,notes})); } catch(e) { res.status(500).json({error:e.message}); } });
app.put('/api/students/:id', (req,res) => { try { res.json(db.updateStudent(req.params.id,req.body)); } catch(e) { res.status(500).json({error:e.message}); } });
app.delete('/api/students/:id', (req,res) => { try { db.deleteStudent(req.params.id); res.json({success:true}); } catch(e) { res.status(500).json({error:e.message}); } });

app.get('/api/assessments', (req,res) => { try { const {studentId,providerId,month,year}=req.query; let a; if(studentId) a=db.getAssessmentsByStudent(studentId); else if(providerId) a=db.getAssessmentsByProvider(providerId); else if(month) a=db.getAssessmentsByMonth(month,year||'תשפ״ו'); else a=db.getAllAssessments(); res.json(a); } catch(e) { res.status(500).json({error:e.message}); } });
app.post('/api/assessments', (req,res) => { try { const {studentId,providerId,month,year,categories,source,studentName}=req.body; if(!studentId||!month||!categories) return res.status(400).json({error:'studentId,month,categories required'}); const r=db.upsertAssessment({studentId,providerId,month,year,categories,source,studentName}); res.status(r.updated?200:201).json(r); } catch(e) { res.status(500).json({error:e.message}); } });
app.delete('/api/assessments/:id', (req,res) => { try { db.deleteAssessment(req.params.id); res.json({success:true}); } catch(e) { res.status(500).json({error:e.message}); } });

app.post('/api/ocr/import', (req,res) => { try { const {rows,providerId,month,year,fileName}=req.body; if(!rows||!Array.isArray(rows)) return res.status(400).json({error:'rows array required'}); let imported=0,skipped=0,overwritten=0; rows.forEach(row => { if(row.action==='skip'){skipped++;return;} const r=db.upsertAssessment({studentId:row.studentId,providerId:row.providerId||providerId,month,year:year||'תשפ״ו',categories:row.categories,source:'ocr',studentName:row.studentName}); if(r.updated)overwritten++;else imported++; }); db.saveOCRImport({providerId,month,year,fileName,imported,skipped,overwritten}); res.json({success:true,imported,skipped,overwritten}); } catch(e) { res.status(500).json({error:e.message}); } });
app.get('/api/ocr/imports', (req,res) => { try { res.json(db.getAllOCRImports()); } catch(e) { res.status(500).json({error:e.message}); } });
app.post('/api/ocr/upload', upload.single('worksheet'), (req,res) => { try { if(!req.file) return res.status(400).json({error:'No file'}); db.addSystemLog('info',`OCR file uploaded: ${req.file.originalname}`); res.json({success:true,fileName:req.file.originalname,mimeType:req.file.mimetype,size:req.file.size,data:req.file.buffer.toString('base64')}); } catch(e) { res.status(500).json({error:e.message}); } });

app.get('/api/logs/system', (req,res) => { try { res.json(db.getSystemLogs(200)); } catch(e) { res.status(500).json({error:e.message}); } });
app.get('/api/logs/audit',  (req,res) => { try { res.json(db.getAuditLogs(200));  } catch(e) { res.status(500).json({error:e.message}); } });
app.post('/api/logs/system', (req,res) => { try { db.addSystemLog(req.body.type||'info',req.body.message||''); res.json({success:true}); } catch(e) { res.status(500).json({error:e.message}); } });

app.get('/api/analytics/summary', (req,res) => { try { res.json({totalStudents:db.getAllStudents().length,totalProviders:db.getAllProviders().length,totalAssessments:db.getAllAssessments().length,totalOCRImports:db.getAllOCRImports().length}); } catch(e) { res.status(500).json({error:e.message}); } });

app.get('/api/backup', (req,res) => { try { const data=db.exportAll(); res.setHeader('Content-Disposition',`attachment; filename="kriahtrack-backup-${Date.now()}.json"`); res.setHeader('Content-Type','application/json'); res.json(data); db.addSystemLog('success','Data backup downloaded'); } catch(e) { res.status(500).json({error:e.message}); } });

app.get('*', (req,res) => res.sendFile(path.join(__dirname,'../public/index.html')));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 KriahTrack running at http://localhost:${PORT}`);
  console.log(`📁 Data: kriahtrack-server/db/kriahtrack.json\n`);
});
