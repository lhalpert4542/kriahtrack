// ============================================================
// KriahTrack — API Client
// Talks to the Express/SQLite backend
// Falls back to localStorage if server unreachable
// ============================================================

const API = (() => {
  const BASE = '/api';
  let _serverAvailable = true;

  async function request(method, path, body) {
    try {
      const opts = {
        method,
        headers: { 'Content-Type': 'application/json' },
      };
      if (body) opts.body = JSON.stringify(body);
      const res = await fetch(BASE + path, opts);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || res.statusText);
      }
      _serverAvailable = true;
      return res.json();
    } catch (e) {
      _serverAvailable = false;
      throw e;
    }
  }

  const get  = (path)        => request('GET',    path);
  const post = (path, body)  => request('POST',   path, body);
  const put  = (path, body)  => request('PUT',    path, body);
  const del  = (path)        => request('DELETE', path);

  return {
    isServerAvailable: () => _serverAvailable,

    // Providers
    getProviders:      ()     => get('/providers'),
    getProvider:       (id)   => get(`/providers/${id}`),
    createProvider:    (data) => post('/providers', data),
    updateProvider:    (id, data) => put(`/providers/${id}`, data),

    // Students
    getStudents:       (providerId) => get('/students' + (providerId ? `?providerId=${providerId}` : '')),
    getStudent:        (id)   => get(`/students/${id}`),
    createStudent:     (data) => post('/students', data),
    updateStudent:     (id, data) => put(`/students/${id}`, data),
    deleteStudent:     (id)   => del(`/students/${id}`),

    // Assessments
    getAssessments:    (params) => {
      const q = new URLSearchParams(params || {}).toString();
      return get('/assessments' + (q ? '?' + q : ''));
    },
    saveAssessment:    (data) => post('/assessments', data),
    deleteAssessment:  (id)   => del(`/assessments/${id}`),

    // OCR
    uploadOCRFile:     (formData) => fetch(BASE + '/ocr/upload', { method: 'POST', body: formData }).then(r => r.json()),
    importOCR:         (data) => post('/ocr/import', data),
    getOCRImports:     ()     => get('/ocr/imports'),

    // Logs
    getSystemLogs:     ()     => get('/logs/system'),
    getAuditLogs:      ()     => get('/logs/audit'),
    addSystemLog:      (type, message) => post('/logs/system', { type, message }),

    // Analytics
    getSummary:        ()     => get('/analytics/summary'),

    // Backup
    downloadBackup:    ()     => { window.location.href = BASE + '/backup'; },

    // Health
    health:            ()     => get('/health'),
  };
})();