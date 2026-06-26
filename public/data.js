// ============================================================
// KriahTrack — Data Layer & Seed Data
// ============================================================

const CATEGORIES = [
  { id: 'otiyot',       label: 'אותיות',            color: '#2196F3', colorLight: '#E3F2FD' },
  { id: 'ot_nekuda',    label: 'אות + נקודה',        color: '#9C27B0', colorLight: '#F3E5F5' },
  { id: 'ot_nekuda_ot', label: 'אות + נקודה + אות',  color: '#FF9800', colorLight: '#FFF3E0' },
  { id: 'milim',        label: 'מילים',              color: '#4CAF50', colorLight: '#E8F5E9' },
  { id: 'tehilim',      label: 'תהילים',             color: '#F44336', colorLight: '#FFEBEE' },
];

const HEBREW_MONTHS_FULL = [
  { id: 'tishrei',  label: 'תשרי',  order: 1 },
  { id: 'cheshvan', label: 'חשון',  order: 2 },
  { id: 'kislev',   label: 'כסלו',  order: 3 },
  { id: 'tevet',    label: 'טבת',   order: 4 },
  { id: 'shvat',    label: 'שבט',   order: 5 },
  { id: 'adar',     label: 'אדר',   order: 6 },
  { id: 'nisan',    label: 'ניסן',  order: 7 },
  { id: 'iyar',     label: 'אייר',  order: 8 },
  { id: 'sivan',    label: 'סיון',  order: 9 },
  { id: 'tamuz',    label: 'תמוז',  order: 10 },
  { id: 'av',       label: 'אב',    order: 11 },
  { id: 'elul',     label: 'אלול',  order: 12 },
];

const CURRENT_HEBREW_YEAR = 'תשפ״ו';
const CURRENT_HEBREW_MONTH = 'sivan';

let DB = {
  providers: [
    { id: 'p1', name: 'בית ספר אהבת תורה',       director: 'הרב משה לוי',       email: 'moshe@ahavatorah.edu',  city: 'בני ברק',  phone: '03-555-1234', classes: ['א׳','ב׳','ג׳'] },
    { id: 'p2', name: 'תלמוד תורה אור החיים',     director: 'הרב אברהם כהן',     email: 'avraham@orchaim.edu',   city: 'ירושלים',  phone: '02-555-5678', classes: ['א׳','ב׳'] },
    { id: 'p3', name: 'ישיבה קטנה בית יעקב',      director: 'הרב יצחק שפירא',    email: 'yitzchak@beitya.edu',   city: 'אשדוד',    phone: '08-555-9012', classes: ['א׳','ב׳','ג׳','ד׳'] },
    { id: 'p4', name: 'חדר מרכזי ברסלב',          director: 'הרב נחמן גרין',     email: 'nachman@breslov.edu',   city: 'צפת',      phone: '04-555-3456', classes: ['א׳','ב׳'] },
  ],

  students: [
    { id: 's1',  firstName: 'יוסף',    lastName: 'כהן',       providerId: 'p1', class: 'א׳', year: 'תשפ״ו', status: 'active' },
    { id: 's2',  firstName: 'מנחם',    lastName: 'לוי',       providerId: 'p1', class: 'א׳', year: 'תשפ״ו', status: 'active' },
    { id: 's3',  firstName: 'אברהם',   lastName: 'גולדברג',   providerId: 'p1', class: 'ב׳', year: 'תשפ״ו', status: 'active' },
    { id: 's4',  firstName: 'שמואל',   lastName: 'רוזנברג',   providerId: 'p2', class: 'א׳', year: 'תשפ״ו', status: 'active' },
    { id: 's5',  firstName: 'דוד',     lastName: 'פרידמן',    providerId: 'p2', class: 'ב׳', year: 'תשפ״ו', status: 'active' },
    { id: 's6',  firstName: 'ישראל',   lastName: 'ברגר',      providerId: 'p3', class: 'א׳', year: 'תשפ״ו', status: 'active' },
    { id: 's7',  firstName: 'מרדכי',   lastName: 'שטיין',     providerId: 'p3', class: 'ב׳', year: 'תשפ״ו', status: 'active' },
    { id: 's8',  firstName: 'פנחס',    lastName: 'וייס',      providerId: 'p3', class: 'ג׳', year: 'תשפ״ו', status: 'active' },
    { id: 's9',  firstName: 'אליהו',   lastName: 'שוורץ',     providerId: 'p4', class: 'א׳', year: 'תשפ״ו', status: 'active' },
    { id: 's10', firstName: 'נחמן',    lastName: 'גרינבאום',  providerId: 'p4', class: 'ב׳', year: 'תשפ״ו', status: 'active' },
    { id: 's11', firstName: 'חיים',    lastName: 'בלום',      providerId: 'p1', class: 'ג׳', year: 'תשפ״ו', status: 'active' },
    { id: 's12', firstName: 'זלמן',    lastName: 'הורוביץ',   providerId: 'p2', class: 'א׳', year: 'תשפ״ו', status: 'active' },
  ],

  assessments: [],
  ocrImports: [],
  auditLog: [],
  systemLog: [],
  pendingOCR: null,
};

// ---- SEED ASSESSMENTS ----
(function seedAssessments() {
  const months = ['tishrei','cheshvan','kislev','tevet','shvat','adar','nisan','iyar','sivan'];
  DB.students.forEach(student => {
    // Each student gets a unique base performance level
    const basePerf = 10 + Math.floor(Math.random() * 15);
    months.forEach((month, mi) => {
      if (Math.random() > 0.12) {
        const growth = mi * 1.2;
        const noise = () => Math.floor(Math.random() * 5) - 2;
        DB.assessments.push({
          id: `a_${student.id}_${month}`,
          studentId: student.id,
          providerId: student.providerId,
          month: month,
          year: 'תשפ״ו',
          createdAt: new Date(2025, 8 + mi, 8 + Math.floor(Math.random() * 12)).toISOString(),
          source: Math.random() > 0.55 ? 'ocr' : 'manual',
          categories: {
            otiyot:       { correct: Math.max(0, Math.min(30, Math.floor(basePerf + growth + noise() + 8))), mistakes: Math.max(0, Math.floor(8 - growth * 0.4 + Math.abs(noise()))) },
            ot_nekuda:    { correct: Math.max(0, Math.min(28, Math.floor(basePerf + growth + noise() + 4))), mistakes: Math.max(0, Math.floor(10 - growth * 0.4 + Math.abs(noise()))) },
            ot_nekuda_ot: { correct: Math.max(0, Math.min(25, Math.floor(basePerf + growth + noise()))),     mistakes: Math.max(0, Math.floor(12 - growth * 0.4 + Math.abs(noise()))) },
            milim:        { correct: Math.max(0, Math.min(22, Math.floor(basePerf + growth + noise() - 2))), mistakes: Math.max(0, Math.floor(10 - growth * 0.4 + Math.abs(noise()))) },
            tehilim:      { correct: Math.max(0, Math.min(20, Math.floor(basePerf + growth + noise() - 4))), mistakes: Math.max(0, Math.floor(8  - growth * 0.4 + Math.abs(noise()))) },
          }
        });
      }
    });
  });
})();

// ---- SEED SYSTEM LOGS ----
(function seedLogs() {
  const entries = [
    { type: 'success', msg: 'OCR הושלם בהצלחה — גיליון ספק "אהבת תורה"',       user: 'מנהל' },
    { type: 'info',    msg: 'תלמיד חדש נוסף: יוסף כהן',                          user: 'מנהל' },
    { type: 'success', msg: 'דוח חודשי נוצר — חשון תשפ״ו',                       user: 'מנהל' },
    { type: 'warning', msg: 'כפילות זוהתה ב-OCR — דולגה',                        user: 'מערכת' },
    { type: 'info',    msg: 'גיליון עבודה הודפס — ניסן תשפ״ו',                   user: 'מנהל' },
    { type: 'danger',  msg: 'שגיאת OCR — קובץ לא נקרא כראוי',                    user: 'מערכת' },
    { type: 'success', msg: 'הערכה עודכנה — שמואל רוזנברג',                       user: 'מנהל' },
    { type: 'info',    msg: 'ספק חדש נוסף: ישיבה קטנה בית יעקב',                 user: 'מנהל' },
    { type: 'success', msg: 'ייצוא PDF הושלם — 12 דוחות',                        user: 'מנהל' },
    { type: 'warning', msg: 'ביצועים איטיים — עמוד אנליטיקה (1.8s)',             user: 'מערכת' },
    { type: 'success', msg: 'גיבוי מסד נתונים הושלם',                            user: 'מערכת' },
    { type: 'info',    msg: 'כניסה למערכת: מנהל',                                user: 'מנהל' },
  ];
  const now = new Date();
  entries.forEach((e, i) => {
    DB.systemLog.push({ id: `log_${i}`, type: e.type, message: e.msg, user: e.user, timestamp: new Date(now - i * 7200000).toISOString() });
  });
})();

// ---- SEED AUDIT LOG ----
(function seedAudit() {
  const entries = [
    { action: 'עדכון הערכה',  entity: 'תלמיד',  entityName: 'יוסף כהן',       field: 'אותיות — נכון',  before: '18', after: '22' },
    { action: 'הוספת תלמיד', entity: 'תלמיד',  entityName: 'נחמן גרינבאום',  field: '—',              before: '—',  after: 'נוצר' },
    { action: 'עדכון ספק',   entity: 'ספק',    entityName: 'אהבת תורה',      field: 'אימייל',         before: 'old@email.com', after: 'moshe@ahavatorah.edu' },
    { action: 'ייבוא OCR',   entity: 'הערכה',  entityName: 'גיליון ניסן',    field: 'מקור',           before: '—',  after: 'OCR' },
    { action: 'מחיקת הערכה', entity: 'הערכה',  entityName: 'מנחם לוי — אדר', field: '—',              before: 'קיים', after: 'נמחק' },
    { action: 'עדכון הערכה', entity: 'תלמיד',  entityName: 'שמואל רוזנברג',  field: 'מילים — שגיאות', before: '7',  after: '4' },
  ];
  const now = new Date();
  entries.forEach((e, i) => {
    DB.auditLog.push({ id: `audit_${i}`, ...e, user: 'מנהל', timestamp: new Date(now - i * 5400000).toISOString() });
  });
})();