const API = (() => {
  const BASE = '/api';
  async function request(method, path, body) {
    const opts = { method, headers: { 'Content-Type': 'application/json' } };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(BASE + path, opts);
    if (!res.ok) { const err = await res.json().catch(() => ({ error: res.statusText })); throw new Error(err.error || res.statusText); }
    return res.json();
  }
  const get  = p     => request('GET',    p);
  const post = (p,b) => request('POST',   p, b);
  const put  = (p,b) => request('PUT',    p, b);
  const del  = p     => request('DELETE', p);
  return {
    health:          ()      => get('/health'),
    getProviders:    ()      => get('/providers'),
    getProvider:     id      => get(`/providers/${id}`),
    createProvider:  data    => post('/providers', data),
    updateProvider:  (id,d)  => put(`/providers/${id}`, d),
    getStudents:     pid     => get('/students' + (pid ? `?providerId=${pid}` : '')),
    getStudent:      id      => get(`/students/${id}`),
    createStudent:   data    => post('/students', data),
    updateStudent:   (id,d)  => put(`/students/${id}`, d),
    deleteStudent:   id      => del(`/students/${id}`),
    getAssessments:  params  => { const q = new URLSearchParams(params||{}).toString(); return get('/assessments' + (q?'?'+q:'')); },
    saveAssessment:  data    => post('/assessments', data),
    deleteAssessment:id      => del(`/assessments/${id}`),
    importOCR:       data    => post('/ocr/import', data),
    getOCRImports:   ()      => get('/ocr/imports'),
    getSystemLogs:   ()      => get('/logs/system'),
    getAuditLogs:    ()      => get('/logs/audit'),
    addSystemLog:    (t,m)   => post('/logs/system', { type:t, message:m }),
    getSummary:      ()      => get('/analytics/summary'),
    downloadBackup:  ()      => { window.location.href = BASE + '/backup'; },
    sendEmail:       (data)  => post('/email/send', data),
    testEmail:       ()      => post('/email/test', {}),
    getEmailConfig:  ()      => get('/email/config'),
  };
})();
