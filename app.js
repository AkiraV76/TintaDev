/* =============================================
   TINTA DEV — app.js
   ============================================= */

// ── ESTADO GLOBAL ──
const state = {
  elements: [],          // { id, img, x, y, rotation, scale, opacity, name, tint }
  selectedId: null,
  isDragging: false,
  dragOffsetX: 0,
  dragOffsetY: 0,
  isRotating: false,
  rotStartAngle: 0,
  rotStartElAngle: 0,
  canvasBg: '#0d0010',
  glowColor: '#9b30ff',
  showGrid: false,
  nextId: 1,
};

// ── CATÁLOGOS DE ELEMENTOS BUILT-IN ──
// Usamos SVG inline codificados como data URLs para funcionar sin archivos extra
const ELEMENTS = {
  anillos: [
    { name: 'Círculo Simple', svg: circleSimple() },
    { name: 'Círculo Doble', svg: circleDouble() },
    { name: 'Anillo Ornamental', svg: circleOrnamental() },
    { name: 'Círculo Punteado', svg: circleDotted() },
    { name: 'Pentagrama', svg: pentagram() },
    { name: 'Hexagrama', svg: hexagram() },
    { name: 'Círculo Rúnico', svg: circleRunic() },
    { name: 'Espiral', svg: spiral() },
  ],
  runas: [
    { name: 'Runa Fehu', svg: runaFehu() },
    { name: 'Runa Uruz', svg: runaUruz() },
    { name: 'Runa Thurisaz', svg: runaThurisaz() },
    { name: 'Runa Ansuz', svg: runaAnsuz() },
    { name: 'Runa Raidho', svg: runaRaidho() },
    { name: 'Runa Kenaz', svg: runaKenaz() },
    { name: 'Cruz Arcana', svg: arcCross() },
    { name: 'Sigilo Ojo', svg: eyeSigil() },
  ],
  flechas: [
    { name: 'Flecha Arriba', svg: arrowUp() },
    { name: 'Flecha Abajo', svg: arrowDown() },
    { name: 'Flecha Izq', svg: arrowLeft() },
    { name: 'Flecha Der', svg: arrowRight() },
    { name: 'Flecha T-Arr', svg: arrowTUp() },
    { name: 'Flecha T-Ab', svg: arrowTDown() },
    { name: 'Flecha Doble V', svg: arrowDoubleV() },
    { name: 'Flecha Doble H', svg: arrowDoubleH() },
  ],
};

// ── GENERADORES DE SVG ──
function svgWrap(content, viewBox='0 0 100 100') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${content}</svg>`;
}
function toDataUrl(svg) {
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function circleSimple()     { return toDataUrl(svgWrap('<circle cx="50" cy="50" r="44"/>')); }
function circleDouble()     { return toDataUrl(svgWrap('<circle cx="50" cy="50" r="44"/><circle cx="50" cy="50" r="34"/>')); }
function circleOrnamental() { return toDataUrl(svgWrap('<circle cx="50" cy="50" r="44"/><circle cx="50" cy="50" r="38" stroke-dasharray="4 6"/>')); }
function circleDotted()     { return toDataUrl(svgWrap('<circle cx="50" cy="50" r="44" stroke-dasharray="2 8"/>')); }
function pentagram() {
  const pts = Array.from({length:5}, (_,i) => {
    const a = (i*4*Math.PI/5) - Math.PI/2;
    return [50+44*Math.cos(a), 50+44*Math.sin(a)];
  });
  const d = pts.map((p,i) => (i===0?'M':'L')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ')+'Z';
  return toDataUrl(svgWrap(`<circle cx="50" cy="50" r="44"/><path d="${d}"/>`));
}
function hexagram() {
  const tri = (offset) => {
    const pts = Array.from({length:3}, (_,i) => {
      const a = (i*2*Math.PI/3) + offset;
      return [50+40*Math.cos(a), 50+40*Math.sin(a)];
    });
    return pts.map((p,i) => (i===0?'M':'L')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ')+'Z';
  };
  return toDataUrl(svgWrap(`<circle cx="50" cy="50" r="44"/><path d="${tri(-Math.PI/2)}"/><path d="${tri(Math.PI/6)}"/>`));
}
function circleRunic() {
  let ticks = '';
  for(let i=0;i<12;i++){const a=i*Math.PI/6;const r1=40,r2=44;ticks+=`<line x1="${(50+r1*Math.cos(a)).toFixed(1)}" y1="${(50+r1*Math.sin(a)).toFixed(1)}" x2="${(50+r2*Math.cos(a)).toFixed(1)}" y2="${(50+r2*Math.sin(a)).toFixed(1)}"/>`;}
  return toDataUrl(svgWrap(`<circle cx="50" cy="50" r="44"/><circle cx="50" cy="50" r="30"/>${ticks}`));
}
function spiral() {
  let d = 'M 50 50 ';
  for(let i=0;i<360*3;i+=5){const a=i*Math.PI/180;const r=i/24;d+=`L ${(50+r*Math.cos(a)).toFixed(1)} ${(50+r*Math.sin(a)).toFixed(1)} `;}
  return toDataUrl(svgWrap(`<path d="${d}" fill="none"/>`));
}

function runaFehu()    { return toDataUrl(svgWrap('<line x1="50" y1="10" x2="50" y2="90"/><line x1="50" y1="25" x2="80" y2="10"/><line x1="50" y1="45" x2="80" y2="30"/>')); }
function runaUruz()    { return toDataUrl(svgWrap('<line x1="30" y1="10" x2="30" y2="80"/><line x1="70" y1="30" x2="70" y2="90"/><path d="M30 80 Q50 95 70 90"/>')); }
function runaThurisaz(){ return toDataUrl(svgWrap('<line x1="50" y1="10" x2="50" y2="90"/><path d="M50 30 L80 50 L50 70"/>')); }
function runaAnsuz()   { return toDataUrl(svgWrap('<line x1="50" y1="10" x2="50" y2="90"/><line x1="50" y1="30" x2="80" y2="20"/><line x1="50" y1="45" x2="80" y2="35"/><line x1="80" y1="20" x2="80" y2="45"/>')); }
function runaRaidho()  { return toDataUrl(svgWrap('<line x1="40" y1="10" x2="40" y2="90"/><path d="M40 10 L70 10 Q85 25 70 50 L40 50"/><line x1="65" y1="50" x2="80" y2="90"/>')); }
function runaKenaz()   { return toDataUrl(svgWrap('<line x1="40" y1="10" x2="40" y2="90"/><line x1="40" y1="50" x2="75" y2="20"/>')); }
function arcCross()    { return toDataUrl(svgWrap('<line x1="50" y1="10" x2="50" y2="90"/><line x1="10" y1="50" x2="90" y2="50"/><circle cx="50" cy="50" r="15"/>')); }
function eyeSigil()    { return toDataUrl(svgWrap('<path d="M10 50 Q50 10 90 50 Q50 90 10 50Z"/><circle cx="50" cy="50" r="12"/><circle cx="50" cy="50" r="4" fill="currentColor"/>')); }

function arrowUp()     { return toDataUrl(svgWrap('<line x1="50" y1="80" x2="50" y2="20"/><polyline points="30,40 50,15 70,40"/>')); }
function arrowDown()   { return toDataUrl(svgWrap('<line x1="50" y1="20" x2="50" y2="80"/><polyline points="30,60 50,85 70,60"/>')); }
function arrowLeft()   { return toDataUrl(svgWrap('<line x1="80" y1="50" x2="20" y2="50"/><polyline points="40,30 15,50 40,70"/>')); }
function arrowRight()  { return toDataUrl(svgWrap('<line x1="20" y1="50" x2="80" y2="50"/><polyline points="60,30 85,50 60,70"/>')); }
function arrowTUp()    { return toDataUrl(svgWrap('<line x1="50" y1="80" x2="50" y2="20"/><polyline points="30,40 50,15 70,40"/><line x1="30" y1="80" x2="70" y2="80"/>')); }
function arrowTDown()  { return toDataUrl(svgWrap('<line x1="50" y1="20" x2="50" y2="80"/><polyline points="30,60 50,85 70,60"/><line x1="30" y1="20" x2="70" y2="20"/>')); }
function arrowDoubleV(){ return toDataUrl(svgWrap('<line x1="50" y1="85" x2="50" y2="15"/><polyline points="30,35 50,10 70,35"/><polyline points="30,65 50,90 70,65"/>')); }
function arrowDoubleH(){ return toDataUrl(svgWrap('<line x1="15" y1="50" x2="85" y2="50"/><polyline points="35,30 10,50 35,70"/><polyline points="65,30 90,50 65,70"/>')); }

// ── CANVAS ──
const canvas = document.getElementById('spellCanvas');
const ctx = canvas.getContext('2d');
const CW = canvas.width, CH = canvas.height;
const CX = CW / 2, CY = CH / 2;
const BASE_SIZE = 200; // tamaño base en px al 100% de escala

// ── IMAGE CACHE ──
const imgCache = {};
function loadImg(src) {
  if (imgCache[src]) return Promise.resolve(imgCache[src]);
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => { imgCache[src] = img; res(img); };
    img.onerror = rej;
    img.src = src;
  });
}

// ── RENDER ──
async function render() {
  ctx.clearRect(0, 0, CW, CH);

  // Fondo
  ctx.fillStyle = state.canvasBg;
  ctx.fillRect(0, 0, CW, CH);

  // Glow radial central
  const grad = ctx.createRadialGradient(CX, CY, 0, CX, CY, CW * 0.5);
  grad.addColorStop(0, hexToRgba(state.glowColor, 0.08));
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CW, CH);

  // Guías
  if (state.showGrid) drawGuides();

  // Elementos
  for (const el of state.elements) {
    try {
      const img = await loadImg(el.src);
      const s = (el.scale / 100) * BASE_SIZE;

      ctx.save();
      ctx.globalAlpha = el.opacity;
      ctx.translate(el.x, el.y);
      ctx.rotate(el.rotation * Math.PI / 180);

      // Dibujar en offscreen canvas para aplicar color
      const off = document.createElement('canvas');
      off.width = s; off.height = s;
      const offCtx = off.getContext('2d');
      offCtx.drawImage(img, 0, 0, s, s);
      // Tinta: multiplicar los píxeles oscuros → color claro deseado
      offCtx.globalCompositeOperation = 'source-in';
      offCtx.fillStyle = el.tint || '#e8d5ff';
      offCtx.fillRect(0, 0, s, s);

      ctx.drawImage(off, -s/2, -s/2);
      ctx.restore();

      // Resaltado si seleccionado
      if (el.id === state.selectedId) {
        ctx.save();
        ctx.translate(el.x, el.y);
        ctx.rotate(el.rotation * Math.PI / 180);
        const hs = s / 2 + 6;
        ctx.strokeStyle = state.glowColor;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = state.glowColor;
        ctx.shadowBlur = 12;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(-hs, -hs, hs*2, hs*2);
        ctx.setLineDash([]);
        ctx.shadowBlur = 0;
        // Línea al handle de rotación
        ctx.strokeStyle = hexToRgba(state.glowColor, 0.5);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -hs);
        ctx.lineTo(0, -hs - 22);
        ctx.stroke();
        // Handle de rotación (círculo)
        ctx.beginPath();
        ctx.arc(0, -hs - 30, 8, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(state.glowColor, 0.25);
        ctx.fill();
        ctx.strokeStyle = state.glowColor;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = state.glowColor;
        ctx.shadowBlur = 10;
        ctx.stroke();
        // Icono de rotación dentro del handle
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowBlur = 0;
        ctx.fillText('↻', 0, -hs - 30);
        ctx.restore();
      }
    } catch(e) { /* imagen no cargada */ }
  }
}

function drawGuides() {
  ctx.save();
  ctx.strokeStyle = hexToRgba(state.glowColor, 0.18);
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 8]);
  [60, 120, 180, 240].forEach(r => {
    ctx.beginPath();
    ctx.arc(CX, CY, r, 0, Math.PI * 2);
    ctx.stroke();
  });
  // Cruz central
  ctx.beginPath();
  ctx.moveTo(CX - 250, CY); ctx.lineTo(CX + 250, CY);
  ctx.moveTo(CX, CY - 250); ctx.lineTo(CX, CY + 250);
  ctx.stroke();
  ctx.restore();
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ── AÑADIR ELEMENTO ──
function addElement(name, src) {
  const el = {
    id: state.nextId++,
    name,
    src,
    x: CX + (Math.random()*60 - 30),
    y: CY + (Math.random()*60 - 30),
    rotation: 0,
    scale: 100,
    opacity: 1,
  };
  state.elements.push(el);
  selectElement(el.id);
  render();
  hideHint();
}

function hideHint() {
  document.getElementById('canvasHint').classList.add('hidden');
}

// ── SELECCIÓN ──
function selectElement(id) {
  state.selectedId = id;
  updateSelectionPanel();
  render();
}

function deselectAll() {
  state.selectedId = null;
  updateSelectionPanel();
  render();
}

function getElementAt(x, y) {
  for (let i = state.elements.length - 1; i >= 0; i--) {
    const el = state.elements[i];
    const hs = (el.scale / 100) * 80 / 2 + 6;
    const dx = x - el.x, dy = y - el.y;
    const cos = Math.cos(-el.rotation * Math.PI / 180);
    const sin = Math.sin(-el.rotation * Math.PI / 180);
    const lx = dx * cos - dy * sin;
    const ly = dx * sin + dy * cos;
    if (Math.abs(lx) <= hs && Math.abs(ly) <= hs) return el;
  }
  return null;
}

// ── PANEL SELECCIÓN ──
function updateSelectionPanel() {
  const el = state.elements.find(e => e.id === state.selectedId);
  const empty = document.getElementById('no-selection');
  const controls = document.getElementById('selection-controls');
  if (!el) {
    empty.classList.remove('hidden');
    controls.classList.add('hidden');
    return;
  }
  empty.classList.add('hidden');
  controls.classList.remove('hidden');
  document.getElementById('selectedName').textContent = el.name;
  document.getElementById('rotSlider').value = el.rotation;
  document.getElementById('rotValue').textContent = Math.round(el.rotation) + '°';
  document.getElementById('scaleSlider').value = el.scale;
  document.getElementById('scaleValue').textContent = el.scale + '%';
  document.getElementById('scaleInput').value = el.scale;
  document.getElementById('opacitySlider').value = Math.round(el.opacity * 100);
  document.getElementById('opacityValue').textContent = Math.round(el.opacity * 100) + '%';
  document.getElementById('posX').value = Math.round(el.x);
  document.getElementById('posY').value = Math.round(el.y);
}


// ── ROTATE HANDLE HIT TEST ──
function getRotateHandlePos(el) {
  const s = (el.scale / 100) * BASE_SIZE;
  const hs = s / 2 + 6;
  const handleLocalY = -(hs + 30);
  const cos = Math.cos(el.rotation * Math.PI / 180);
  const sin = Math.sin(el.rotation * Math.PI / 180);
  return {
    hx: el.x + cos * 0 - sin * handleLocalY,
    hy: el.y + sin * 0 + cos * handleLocalY,
  };
}

function isOnRotateHandle(mx, my, el) {
  const { hx, hy } = getRotateHandlePos(el);
  const dist = Math.hypot(mx - hx, my - hy);
  return dist <= 12;
}

// ── DRAG & ROTATE ──
canvas.addEventListener('mousedown', e => {
  if (e.button !== 0) return;
  const rect = canvas.getBoundingClientRect();
  const scaleX = CW / rect.width, scaleY = CH / rect.height;
  const mx = (e.clientX - rect.left) * scaleX;
  const my = (e.clientY - rect.top) * scaleY;

  // Comprobar si hay un elemento seleccionado y hacemos click en su handle
  if (state.selectedId) {
    const sel = state.elements.find(e => e.id === state.selectedId);
    if (sel && isOnRotateHandle(mx, my, sel)) {
      state.isRotating = true;
      state.rotStartAngle = Math.atan2(my - sel.y, mx - sel.x) * 180 / Math.PI;
      state.rotStartElAngle = sel.rotation;
      canvas.style.cursor = 'crosshair';
      return;
    }
  }

  const el = getElementAt(mx, my);
  if (el) {
    selectElement(el.id);
    state.isDragging = true;
    state.dragOffsetX = mx - el.x;
    state.dragOffsetY = my - el.y;
    canvas.style.cursor = 'grabbing';
  } else {
    deselectAll();
  }
});

canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = CW / rect.width, scaleY = CH / rect.height;
  const mx = (e.clientX - rect.left) * scaleX;
  const my = (e.clientY - rect.top) * scaleY;

  // Rotar
  if (state.isRotating && state.selectedId) {
    const el = state.elements.find(e => e.id === state.selectedId);
    if (el) {
      const currentAngle = Math.atan2(my - el.y, mx - el.x) * 180 / Math.PI;
      let newRot = (state.rotStartElAngle + (currentAngle - state.rotStartAngle)) % 360;
      if (newRot < 0) newRot += 360;
      // Snap a 15° si se mantiene Shift
      if (e.shiftKey) newRot = Math.round(newRot / 15) * 15;
      el.rotation = newRot;
      document.getElementById('rotSlider').value = Math.round(newRot);
      document.getElementById('rotValue').textContent = Math.round(newRot) + '°';
      render();
    }
    return;
  }

  // Mover
  if (state.isDragging && state.selectedId) {
    const el = state.elements.find(e => e.id === state.selectedId);
    if (el) {
      el.x = mx - state.dragOffsetX;
      el.y = my - state.dragOffsetY;
      render();
    }
    return;
  }

  // Cambiar cursor al pasar sobre handle de rotación
  if (state.selectedId) {
    const sel = state.elements.find(e => e.id === state.selectedId);
    if (sel && isOnRotateHandle(mx, my, sel)) {
      canvas.style.cursor = 'crosshair';
      return;
    }
  }
  canvas.style.cursor = getElementAt(mx, my) ? 'grab' : 'crosshair';
});

canvas.addEventListener('mouseup', () => {
  state.isDragging = false;
  state.isRotating = false;
  canvas.style.cursor = 'crosshair';
});

canvas.addEventListener('mouseleave', () => {
  state.isDragging = false;
  state.isRotating = false;
  canvas.style.cursor = 'crosshair';
});

// ── CLICK DERECHO ──
canvas.addEventListener('contextmenu', e => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const scaleX = CW / rect.width, scaleY = CH / rect.height;
  const mx = (e.clientX - rect.left) * scaleX;
  const my = (e.clientY - rect.top) * scaleY;
  const el = getElementAt(mx, my);
  if (el) {
    selectElement(el.id);
    showContextMenu(e.clientX, e.clientY);
  }
});

// ── CONTEXT MENU ──
const ctxMenu = document.getElementById('contextMenu');

function showContextMenu(x, y) {
  ctxMenu.style.left = x + 'px';
  ctxMenu.style.top = y + 'px';
  ctxMenu.classList.remove('hidden');
}

function hideContextMenu() {
  ctxMenu.classList.add('hidden');
}

document.addEventListener('click', e => {
  if (!ctxMenu.contains(e.target)) hideContextMenu();
});

document.getElementById('ctx-delete').addEventListener('click', () => {
  deleteSelected();
  hideContextMenu();
});

document.getElementById('ctx-duplicate').addEventListener('click', () => {
  duplicateSelected();
  hideContextMenu();
});

document.getElementById('ctx-front').addEventListener('click', () => {
  bringToFront();
  hideContextMenu();
});

document.getElementById('ctx-back').addEventListener('click', () => {
  sendToBack();
  hideContextMenu();
});

function deleteSelected() {
  state.elements = state.elements.filter(e => e.id !== state.selectedId);
  state.selectedId = null;
  updateSelectionPanel();
  render();
}

function duplicateSelected() {
  const el = state.elements.find(e => e.id === state.selectedId);
  if (!el) return;
  const copy = { ...el, id: state.nextId++, x: el.x + 20, y: el.y + 20 };
  state.elements.push(copy);
  selectElement(copy.id);
  render();
}

function bringToFront() {
  const idx = state.elements.findIndex(e => e.id === state.selectedId);
  if (idx < 0) return;
  const [el] = state.elements.splice(idx, 1);
  state.elements.push(el);
  render();
}

function sendToBack() {
  const idx = state.elements.findIndex(e => e.id === state.selectedId);
  if (idx < 0) return;
  const [el] = state.elements.splice(idx, 1);
  state.elements.unshift(el);
  render();
}

// ── CONTROLES DE SELECCIÓN ──
document.getElementById('rotSlider').addEventListener('input', e => {
  const el = state.elements.find(el => el.id === state.selectedId);
  if (!el) return;
  el.rotation = +e.target.value;
  document.getElementById('rotValue').textContent = e.target.value + '°';
  render();
});

document.getElementById('scaleSlider').addEventListener('input', e => {
  const el = state.elements.find(el => el.id === state.selectedId);
  if (!el) return;
  el.scale = +e.target.value;
  document.getElementById('scaleValue').textContent = e.target.value + '%';
  document.getElementById('scaleInput').value = e.target.value;
  render();
});

document.getElementById('scaleInput').addEventListener('change', e => {
  const el = state.elements.find(el => el.id === state.selectedId);
  if (!el) return;
  const v = Math.max(5, Math.min(500, +e.target.value));
  el.scale = v;
  document.getElementById('scaleSlider').value = v;
  document.getElementById('scaleValue').textContent = v + '%';
  document.getElementById('scaleInput').value = v;
  render();
});

[25, 50, 100, 200].forEach(pct => {
  document.getElementById('scalePreset' + pct).addEventListener('click', () => {
    const el = state.elements.find(el => el.id === state.selectedId);
    if (!el) return;
    el.scale = pct;
    document.getElementById('scaleSlider').value = pct;
    document.getElementById('scaleInput').value = pct;
    document.getElementById('scaleValue').textContent = pct + '%';
    render();
  });
});

document.getElementById('opacitySlider').addEventListener('input', e => {
  const el = state.elements.find(el => el.id === state.selectedId);
  if (!el) return;
  el.opacity = +e.target.value / 100;
  document.getElementById('opacityValue').textContent = e.target.value + '%';
  render();
});

// Tinte
document.getElementById('applyTint').addEventListener('click', () => {
  const el = state.elements.find(el => el.id === state.selectedId);
  if (!el) return;
  el.tint = document.getElementById('tintColor').value;
  render();
  showToast('Color aplicado');
});

document.getElementById('resetTint').addEventListener('click', () => {
  const el = state.elements.find(el => el.id === state.selectedId);
  if (!el) return;
  el.tint = '#e8d5ff';
  document.getElementById('tintColor').value = '#e8d5ff';
  render();
  showToast('Color restaurado');
});

// Órbita
document.getElementById('applyOrbit').addEventListener('click', () => {
  const el = state.elements.find(el => el.id === state.selectedId);
  if (!el) return;
  const deg = +document.getElementById('orbitAngle').value;
  const radius = +document.getElementById('orbitRadius').value;
  const rad = (deg - 90) * Math.PI / 180;
  el.x = CX + radius * Math.cos(rad);
  el.y = CY + radius * Math.sin(rad);
  render();
  showToast('Elemento colocado en órbita');
});

// Eliminar seleccionado
document.getElementById('btnDeleteSelected').addEventListener('click', deleteSelected);

// ── TABS PRINCIPALES ──
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

// ── CATEGORÍAS ──
document.querySelectorAll('.cat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.gallery').forEach(g => g.classList.add('hidden'));
    document.getElementById('gallery-' + btn.dataset.cat).classList.remove('hidden');
  });
});

// ── GALERÍA: POBLAR ──
function buildGallery(cat, items) {
  const container = document.getElementById('gallery-' + cat);
  container.innerHTML = '';
  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.title = item.name;
    const img = document.createElement('img');
    img.src = item.svg;
    img.alt = item.name;
    const label = document.createElement('span');
    label.className = 'item-label';
    label.textContent = item.name;
    div.appendChild(img);
    div.appendChild(label);
    div.addEventListener('click', () => {
      addElement(item.name, item.svg);
      showToast('«' + item.name + '» añadido');
    });
    container.appendChild(div);
  });
}

// ── UPLOAD PERSONALIZADO ──
document.getElementById('fileUpload').addEventListener('change', e => {
  const files = Array.from(e.target.files);
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = ev => {
      const src = ev.target.result;
      const name = file.name.replace(/\.[^/.]+$/, '');
      // Añadir a galería de anillos como custom
      const cat = document.querySelector('.cat-btn.active')?.dataset.cat || 'anillos';
      addCustomToGallery(cat, name, src);
      addElement(name, src);
      showToast('«' + name + '» importado');
    };
    reader.readAsDataURL(file);
  });
  e.target.value = '';
});

function addCustomToGallery(cat, name, src) {
  const container = document.getElementById('gallery-' + cat);
  const div = document.createElement('div');
  div.className = 'gallery-item';
  div.title = name;
  const img = document.createElement('img');
  img.src = src;
  img.style.filter = 'none'; // imágenes custom sin filtro de color
  const label = document.createElement('span');
  label.className = 'item-label';
  label.textContent = name;
  div.appendChild(img);
  div.appendChild(label);
  div.addEventListener('click', () => { addElement(name, src); showToast('«' + name + '» añadido'); });
  container.appendChild(div);
  // Activar esa categoría
  document.querySelectorAll('.cat-btn').forEach(b => {
    if (b.dataset.cat === cat) b.click();
  });
}

// ── ACCIONES GLOBALES ──
document.getElementById('btnDeselect').addEventListener('click', deselectAll);

document.getElementById('btnClear').addEventListener('click', () => {
  if (state.elements.length === 0) return;
  if (confirm('¿Seguro que quieres eliminar todos los elementos del lienzo?')) {
    state.elements = [];
    state.selectedId = null;
    updateSelectionPanel();
    render();
    document.getElementById('canvasHint').classList.remove('hidden');
    showToast('Lienzo limpiado');
  }
});

document.getElementById('btnCopy').addEventListener('click', async () => {
  // Desseleccionar para no incluir el borde de selección
  const prevSel = state.selectedId;
  state.selectedId = null;
  await render();

  canvas.toBlob(async blob => {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      showToast('¡Imagen copiada al portapapeles!');
    } catch (err) {
      // Fallback: descargar
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sello-tintadev.png';
      a.click();
      URL.revokeObjectURL(url);
      showToast('Guardado como archivo (portapapeles no disponible)');
    }
    // Restaurar selección
    state.selectedId = prevSel;
    render();
  }, 'image/png');
});

// ── TAB SELLO ──
document.getElementById('applyBg').addEventListener('click', () => {
  state.canvasBg = document.getElementById('canvasBg').value;
  render();
});

document.getElementById('applyGlow').addEventListener('click', () => {
  state.glowColor = document.getElementById('glowColor').value;
  render();
});

document.getElementById('showGrid').addEventListener('change', e => {
  state.showGrid = e.target.checked;
  render();
});

// ── THEME TOGGLE ──
let isDarkMode = true;
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeLabel = document.getElementById('themeLabel');

themeToggle.addEventListener('click', () => {
  isDarkMode = !isDarkMode;
  if (isDarkMode) {
    document.documentElement.classList.remove('light-mode');
    themeIcon.textContent = '🌙';
    themeLabel.textContent = 'Oscuro';
  } else {
    document.documentElement.classList.add('light-mode');
    themeIcon.textContent = '☀️';
    themeLabel.textContent = 'Claro';
  }
});

// ── NUDGE (posición fina) ──
let nudgeStep = 1;

document.querySelectorAll('.nudge-step-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nudge-step-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    nudgeStep = +btn.dataset.step;
  });
});

function nudgeSelected(dx, dy) {
  const el = state.elements.find(e => e.id === state.selectedId);
  if (!el) return;
  el.x += dx;
  el.y += dy;
  updatePosInputs(el);
  render();
}

document.getElementById('nudgeUp').addEventListener('click',    () => nudgeSelected(0, -nudgeStep));
document.getElementById('nudgeDown').addEventListener('click',  () => nudgeSelected(0, +nudgeStep));
document.getElementById('nudgeLeft').addEventListener('click',  () => nudgeSelected(-nudgeStep, 0));
document.getElementById('nudgeRight').addEventListener('click', () => nudgeSelected(+nudgeStep, 0));
document.getElementById('nudgeCenter').addEventListener('click', () => {
  const el = state.elements.find(e => e.id === state.selectedId);
  if (!el) return;
  el.x = CX; el.y = CY;
  updatePosInputs(el);
  render();
  showToast('Centrado en el lienzo');
});

// Posición directa XY
document.getElementById('applyPos').addEventListener('click', () => {
  const el = state.elements.find(e => e.id === state.selectedId);
  if (!el) return;
  const nx = +document.getElementById('posX').value;
  const ny = +document.getElementById('posY').value;
  if (!isNaN(nx)) el.x = nx;
  if (!isNaN(ny)) el.y = ny;
  render();
  showToast('Posición aplicada');
});

function updatePosInputs(el) {
  document.getElementById('posX').value = Math.round(el.x);
  document.getElementById('posY').value = Math.round(el.y);
}

// Keyboard nudge con teclas de flecha cuando hay selección
document.addEventListener('keydown', e => {
  if (!state.selectedId) return;
  if (['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) return;
  const step = e.shiftKey ? 10 : nudgeStep;
  switch(e.key) {
    case 'ArrowUp':    e.preventDefault(); nudgeSelected(0, -step); break;
    case 'ArrowDown':  e.preventDefault(); nudgeSelected(0, +step); break;
    case 'ArrowLeft':  e.preventDefault(); nudgeSelected(-step, 0); break;
    case 'ArrowRight': e.preventDefault(); nudgeSelected(+step, 0); break;
  }
});

// ── TOAST ──
let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2500);
}

// ── PARTÍCULAS DE FONDO ──
function createParticles() {
  const container = document.getElementById('bgParticles');
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + 'vw';
    p.style.top = Math.random() * 100 + 'vh';
    p.style.setProperty('--dur', (4 + Math.random() * 8) + 's');
    p.style.setProperty('--delay', (-Math.random() * 10) + 's');
    p.style.width = p.style.height = (Math.random() < 0.3 ? 3 : 2) + 'px';
    if (Math.random() < 0.2) {
      p.style.background = '#d4a843';
    }
    container.appendChild(p);
  }
}

// ── INIT ──
buildGallery('anillos', ELEMENTS.anillos);
buildGallery('runas', ELEMENTS.runas);
buildGallery('flechas', ELEMENTS.flechas);
createParticles();
render();