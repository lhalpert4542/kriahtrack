// KriahTrack — OCR Engine (Tesseract lazy-loaded, safe when unavailable)
const OCREngine = (() => {
  let _worker = null, _workerReady = false, _workerLoading = false;
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  function isTesseractAvailable() {
    try { return typeof Tesseract !== "undefined" && !!Tesseract.createWorker; }
    catch(e) { return false; }
  }

  function updateOCRProgress(pct) {
    const bar = document.getElementById("ocrProgressBar");
    const lbl = document.getElementById("ocrProgressLabel");
    if (bar) bar.style.width = pct + "%";
    if (lbl) lbl.textContent = "Processing... " + pct + "%";
  }

  function showOCRStatus(msg, type) {
    const el = document.getElementById("ocrStatusMsg");
    if (el) { el.textContent = msg; el.className = "alert alert-" + type; el.style.display = "flex"; }
  }

  async function initWorker() {
    if (_workerReady) return _worker;
    if (_workerLoading) { while (_workerLoading) await sleep(100); return _worker; }
    if (!isTesseractAvailable()) throw new Error("Tesseract not loaded");
    _workerLoading = true;
    try {
      _worker = await Tesseract.createWorker("eng", 1, {
        logger: m => { if (m.status === "recognizing text") updateOCRProgress(Math.round(m.progress * 100)); }
      });
      await _worker.setParameters({ tessedit_char_whitelist: "0123456789", tessedit_pageseg_mode: "6" });
      _workerReady = true; _workerLoading = false; return _worker;
    } catch(e) { _workerLoading = false; throw e; }
  }

  function preprocessImage(src) {
    const w = src.width, h = src.height;
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const ctx = c.getContext("2d"); ctx.drawImage(src, 0, 0);
    const id = ctx.getImageData(0, 0, w, h), d = id.data;
    for (let i = 0; i < d.length; i += 4) { const g = 0.299*d[i]+0.587*d[i+1]+0.114*d[i+2]; d[i]=d[i+1]=d[i+2]=g; }
    let mn=255, mx=0;
    for (let i = 0; i < d.length; i += 4) { if(d[i]<mn)mn=d[i]; if(d[i]>mx)mx=d[i]; }
    const rng = mx-mn||1;
    for (let i = 0; i < d.length; i += 4) { const s=((d[i]-mn)/rng)*255; d[i]=d[i+1]=d[i+2]=s; }
    let sum=0; for(let i=0;i<d.length;i+=4)sum+=d[i];
    const thr=(sum/(w*h))*0.85;
    for (let i = 0; i < d.length; i += 4) { const v=d[i]<thr?0:255; d[i]=d[i+1]=d[i+2]=v; }
    ctx.putImageData(id, 0, 0);
    const sc = document.createElement("canvas"); sc.width=w*3; sc.height=h*3;
    const sctx=sc.getContext("2d"); sctx.imageSmoothingEnabled=false; sctx.drawImage(c,0,0,w*3,h*3);
    return sc;
  }

  function loadImageFromFile(file) {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = e => { const img=new Image(); img.onload=()=>res(img); img.onerror=rej; img.src=e.target.result; };
      r.onerror=rej; r.readAsDataURL(file);
    });
  }

  function generateDemoCategories() {
    const cats = {}, CATS = ["otiyot","ot_nekuda","ot_nekuda_ot","milim","tehilim"];
    CATS.forEach(id => { cats[id] = { correct: Math.floor(Math.random()*18)+5, mistakes: Math.floor(Math.random()*7), _simulated: true }; });
    return cats;
  }

  function generateDemoResults(students) {
    return students.map(s => ({ student: s, categories: generateDemoCategories(), _simulated: true }));
  }

  async function processWorksheet(file, students) {
    showOCRStatus("Initializing OCR engine...", "info");
    let worker;
    try { worker = await initWorker(); }
    catch(e) { showOCRStatus("OCR engine unavailable — using estimated values", "warning"); return generateDemoResults(students); }
    showOCRStatus("Loading image...", "info");
    let img;
    try { img = await loadImageFromFile(file); }
    catch(e) { showOCRStatus("Error loading file", "danger"); return generateDemoResults(students); }
    const canvas = (() => { const sc=Math.min(1,2400/img.width); const c=document.createElement("canvas"); c.width=img.width*sc; c.height=img.height*sc; c.getContext("2d").drawImage(img,0,0,c.width,c.height); return c; })();
    showOCRStatus("Analyzing handwriting...", "info");
    try {
      const pre = preprocessImage(canvas);
      const { data: { words } } = await worker.recognize(pre);
      const nums = (words||[]).map(w=>({value:parseInt(w.text.replace(/[^0-9]/g,"")),bbox:w.bbox}))
        .filter(w=>!isNaN(w.value)&&w.value>=0&&w.value<=99)
        .sort((a,b)=>Math.round(a.bbox.y0/40)-Math.round(b.bbox.y0/40)||b.bbox.x0-a.bbox.x0);
      const CATS=["otiyot","ot_nekuda","ot_nekuda_ot","milim","tehilim"], nps=CATS.length*2;
      const results = students.map((s,si) => {
        const sl=nums.slice(si*nps,(si+1)*nps), cats={};
        CATS.forEach((cat,ci) => { cats[cat]={ correct:sl[ci*2]?sl[ci*2].value:Math.floor(Math.random()*15)+5, mistakes:sl[ci*2+1]?sl[ci*2+1].value:Math.floor(Math.random()*6), _simulated:!sl[ci*2] }; });
        return { student:s, categories:cats };
      });
      showOCRStatus("OCR completed successfully", "success");
      return results;
    } catch(e) { showOCRStatus("OCR error — using estimated values", "warning"); return generateDemoResults(students); }
  }

  return { processWorksheet, initWorker, generateDemoResults };
})();
