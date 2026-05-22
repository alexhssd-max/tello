/**
 * BubbleSort — Interfaz de Usuario
 * Programación Tradicional I
 */

/* ═══════════════ Estado global ═══════════════ */
let currentArray = [];
let newItemIndices = new Set(); // índices de elementos recién agregados
let lastSearch = null;
let lastAsc = null;
let lastDesc = null;

/* ═══════════════ Helpers DOM ═══════════════ */
const $ = id => document.getElementById(id);
const show = id => $( id).classList.remove('hidden');
const hide = id => $( id).classList.add('hidden');
const setErr = (id, msg) => $(id).textContent = msg;
const clearErr = id => $(id).textContent = '';

/* ═══════════════ Render burbujas ═══════════════ */
function renderBubbles(containerId, arr, highlightIndex = -1, highlightClass = 'found') {
  const container = $(containerId);
  container.innerHTML = '';
  arr.forEach((num, i) => {
    const b = document.createElement('div');
    b.className = 'bubble';
    b.textContent = num;
    b.style.animationDelay = `${i * 0.04}s`;

    if (i === highlightIndex) {
      b.classList.add(highlightClass);
    } else if (newItemIndices.has(i) && containerId === 'bubbles-display') {
      b.classList.add('new-item');
    }

    container.appendChild(b);
  });
}

/* ═══════════════ SECCIÓN 01 — Confirmar array inicial ═══════════════ */
$('btn-confirm').addEventListener('click', () => {
  clearErr('err-input');
  const n = parseInt($('inp-n').value, 10);

  if (isNaN(n) || n < 1) {
    setErr('err-input', '⚠ Ingresa una cantidad válida de números (mínimo 1).');
    return;
  }

  const inputs = document.querySelectorAll('#dynamic-inputs .bubble-input');
  const nums = [];
  for (let inp of inputs) {
    const val = parseInt(inp.value, 10);
    if (isNaN(val)) {
      setErr('err-input', '⚠ Por favor llena todas las burbujas con números válidos.');
      return;
    }
    nums.push(val);
  }

  currentArray = nums;
  newItemIndices.clear();

  $('array-count').textContent = currentArray.length;
  renderBubbles('bubbles-display', currentArray);

  show('sec-array');
  show('sec-search');
  show('sec-sort');
  show('sec-report');

  // Resetear resultados previos
  hide('search-result');
  hide('sort-results');
  hide('add-more-panel');
  hide('report-results');
  lastSearch = null;
  lastAsc = null;
  lastDesc = null;

  $('sec-array').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* ═══════════════ SECCIÓN 02 — Agregar más números ═══════════════ */
$('btn-show-add').addEventListener('click', () => {
  const panel = $('add-more-panel');
  panel.classList.toggle('hidden');
});

$('btn-add-confirm').addEventListener('click', () => {
  clearErr('err-add');
  const n = parseInt($('add-n').value, 10);

  if (isNaN(n) || n < 1) {
    setErr('err-add', '⚠ Ingresa una cantidad válida (mínimo 1).');
    return;
  }

  const inputs = document.querySelectorAll('#dynamic-add-inputs .bubble-input');
  const nums = [];
  for (let inp of inputs) {
    const val = parseInt(inp.value, 10);
    if (isNaN(val)) {
      setErr('err-add', '⚠ Por favor llena todas las burbujas con números válidos.');
      return;
    }
    nums.push(val);
  }

  // Marcar los índices nuevos
  const startIdx = currentArray.length;
  currentArray = [...currentArray, ...nums];
  newItemIndices.clear();
  for (let i = startIdx; i < currentArray.length; i++) {
    newItemIndices.add(i);
  }

  $('array-count').textContent = currentArray.length;
  renderBubbles('bubbles-display', currentArray);

  // Limpiar campos
  $('add-n').value = '';
  $('add-nums').value = '';
  hide('add-more-panel');

  // Resetear resultados anteriores (el array cambió)
  hide('search-result');
  hide('sort-results');
  hide('report-results');
  lastSearch = null;
  lastAsc = null;
  lastDesc = null;
});

/* ═══════════════ SECCIÓN 03 — Búsqueda ═══════════════ */
$('btn-search').addEventListener('click', () => {
  const val = $('inp-search').value.trim();
  if (val === '') return;

  const target = parseInt(val, 10);
  if (isNaN(target)) return;

  if (currentArray.length === 0) return;

  const { found, index, steps } = linearSearch(currentArray, target);
  lastSearch = { target, found, index, steps };

  // Mostrar burbujas con highlight
  renderBubbles('search-bubbles', currentArray, found ? index : -1, 'found');

  // Si no encontrado, marcar todos con not-found visually
  if (!found) {
    document.querySelectorAll('#search-bubbles .bubble').forEach(b => {
      b.classList.add('not-found');
    });
  }

  const stats = $('search-stats');
  stats.className = 'result-stats' + (found ? '' : ' not-found-stats');

  if (found) {
    stats.innerHTML =
      `<strong style="color:var(--green)">✓ ENCONTRADO</strong><br>` +
      `Número <strong>${target}</strong> hallado en la posición <strong>[${index}]</strong><br>` +
      `Pasos realizados: <strong>${steps}</strong>`;
  } else {
    stats.innerHTML =
      `<strong style="color:var(--red)">✗ NO ENCONTRADO</strong><br>` +
      `El número <strong>${target}</strong> no existe en el array.<br>` +
      `Pasos recorridos: <strong>${steps}</strong> (todo el array)`;
  }

  show('search-result');
});

/* ═══════════════ SECCIÓN 04 — Ordenamiento ═══════════════ */
$('btn-sort').addEventListener('click', () => {
  if (currentArray.length === 0) return;

  const asc  = bubbleSortAsc(currentArray);
  const desc = bubbleSortDesc(currentArray);
  
  lastAsc = asc;
  lastDesc = desc;

  // Ascendente
  renderBubbles('asc-bubbles', asc.sorted);
  $('asc-comparisons').textContent =
    `comparaciones realizadas: ${asc.comparisons}`;

  // Descendente
  renderBubbles('desc-bubbles', desc.sorted);
  $('desc-comparisons').textContent =
    `comparaciones realizadas: ${desc.comparisons}`;

  show('sort-results');
  $('sec-sort').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* ═══════════════ SECCIÓN 05 — Reporte Final ═══════════════ */
$('btn-report').addEventListener('click', () => {
  if (!lastAsc || !lastDesc) {
    alert("Por favor, ejecuta el ordenamiento primero para generar el reporte.");
    return;
  }

  let html = `
    <div style="margin-bottom: 15px;">
      <strong style="color:var(--green)">a. Ordenamiento:</strong><br>
      <span style="color:#a5b4fc;">Ascendente:</span> [ ${lastAsc.sorted.join(', ')} ]<br>
      <span style="color:#a5b4fc;">Descendente:</span> [ ${lastDesc.sorted.join(', ')} ]
    </div>
    <div style="margin-bottom: 15px;">
      <strong style="color:var(--green)">b. Comparaciones realizadas:</strong><br>
      <span style="color:#a5b4fc;">Ascendente:</span> ${lastAsc.comparisons}<br>
      <span style="color:#a5b4fc;">Descendente:</span> ${lastDesc.comparisons}
    </div>
    <div>
      <strong style="color:var(--green)">c. Búsqueda:</strong><br>
  `;

  if (lastSearch) {
    html += `
      <span style="color:#a5b4fc;">Número buscado:</span> ${lastSearch.target}<br>
      <span style="color:#a5b4fc;">Resultado:</span> ${lastSearch.found ? 'ENCONTRADO' : 'NO ENCONTRADO'}<br>
      <span style="color:#a5b4fc;">Pasos requeridos:</span> ${lastSearch.steps}
    `;
  } else {
    html += `<span style="color:#a5b4fc;">No se realizó ninguna búsqueda en el array actual.</span>`;
  }

  html += `</div>`;

  $('report-content').innerHTML = html;
  show('report-results');
  $('sec-report').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* ═══════════════ DIAGRAMA DE FLUJO ═══════════════ */
function buildFlowchart() {
  const svg = `
<svg viewBox="0 0 760 1660" xmlns="http://www.w3.org/2000/svg"
     font-family="'JetBrains Mono', monospace" font-size="13">

  <defs>
    <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#4f7cff"/>
    </marker>
  </defs>

  <!-- fondo -->
  <rect width="760" height="1660" fill="#0b0d12" rx="12"/>

  <!-- ── Título ── -->
  <text x="380" y="40" text-anchor="middle" fill="#e8eaf6"
        font-family="'Syne',sans-serif" font-size="15" font-weight="700"
        letter-spacing="2">DIAGRAMA DE FLUJO — BUBBLE SORT</text>
  <text x="380" y="58" text-anchor="middle" fill="#6b7280" font-size="11">
    Ascendente y Descendente
  </text>

  <!-- ════════════════════════════════════════
       LADO IZQUIERDO — ASCENDENTE
  ════════════════════════════════════════ -->

  <!-- columna label -->
  <rect x="30" y="70" width="130" height="24" rx="4" fill="#1a2040"/>
  <text x="95" y="87" text-anchor="middle" fill="#4f7cff" font-size="11"
        letter-spacing="1">ASCENDENTE ↑</text>

  <!-- INICIO -->
  <ellipse cx="95" cy="135" rx="60" ry="22" fill="#1a2040" stroke="#4f7cff" stroke-width="1.5"/>
  <text x="95" y="140" text-anchor="middle" fill="#a5b4fc" font-size="13">INICIO</text>

  <!-- flecha -->
  <line x1="95" y1="157" x2="95" y2="185" stroke="#4f7cff" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- leer array -->
  <rect x="25" y="185" width="140" height="44" rx="8" fill="#111827" stroke="#2e3450" stroke-width="1"/>
  <text x="95" y="204" text-anchor="middle" fill="#e8eaf6" font-size="12">Leer array[]</text>
  <text x="95" y="220" text-anchor="middle" fill="#6b7280" font-size="11">n = arr.length</text>

  <line x1="95" y1="229" x2="95" y2="257" stroke="#4f7cff" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- i = 0 -->
  <rect x="25" y="257" width="140" height="36" rx="8" fill="#111827" stroke="#2e3450" stroke-width="1"/>
  <text x="95" y="272" text-anchor="middle" fill="#e8eaf6" font-size="12">i = 0</text>
  <text x="95" y="287" text-anchor="middle" fill="#6b7280" font-size="11">(pasada exterior)</text>

  <line x1="95" y1="293" x2="95" y2="321" stroke="#4f7cff" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- ¿i < n-1? -->
  <polygon points="95,321 165,361 95,401 25,361" fill="#161c2e" stroke="#4f7cff" stroke-width="1.5"/>
  <text x="95" y="357" text-anchor="middle" fill="#a5b4fc" font-size="12">i &lt; n-1 ?</text>

  <!-- NO → FIN -->
  <line x1="165" y1="361" x2="200" y2="361" stroke="#4f7cff" stroke-width="1.5" marker-end="url(#arr)"/>
  <text x="178" y="354" text-anchor="middle" fill="#f7b731" font-size="11">NO</text>

  <!-- SI → -->
  <text x="70" y="412" text-anchor="middle" fill="#39d98a" font-size="11">SI</text>
  <line x1="95" y1="401" x2="95" y2="430" stroke="#4f7cff" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- j = 0 -->
  <rect x="25" y="430" width="140" height="36" rx="8" fill="#111827" stroke="#2e3450" stroke-width="1"/>
  <text x="95" y="445" text-anchor="middle" fill="#e8eaf6" font-size="12">j = 0</text>
  <text x="95" y="461" text-anchor="middle" fill="#6b7280" font-size="11">(pasada interior)</text>

  <line x1="95" y1="466" x2="95" y2="494" stroke="#4f7cff" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- ¿j < n-1-i? -->
  <polygon points="95,494 165,534 95,574 25,534" fill="#161c2e" stroke="#4f7cff" stroke-width="1.5"/>
  <text x="95" y="527" text-anchor="middle" fill="#a5b4fc" font-size="12">j &lt; n-1-i ?</text>
  <text x="95" y="543" text-anchor="middle" fill="#6b7280" font-size="10">comparaciones++</text>

  <!-- SI → -->
  <text x="70" y="585" text-anchor="middle" fill="#39d98a" font-size="11">SI</text>
  <line x1="95" y1="574" x2="95" y2="602" stroke="#4f7cff" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- ¿arr[j] > arr[j+1]? -->
  <polygon points="95,602 165,642 95,682 25,642" fill="#161c2e" stroke="#7c5cfc" stroke-width="1.5"/>
  <text x="95" y="635" text-anchor="middle" fill="#c4b5fd" font-size="11">arr[j] &gt;</text>
  <text x="95" y="651" text-anchor="middle" fill="#c4b5fd" font-size="11">arr[j+1] ?</text>

  <!-- SI → SWAP -->
  <text x="70" y="693" text-anchor="middle" fill="#39d98a" font-size="11">SI</text>
  <line x1="95" y1="682" x2="95" y2="710" stroke="#4f7cff" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- SWAP -->
  <rect x="25" y="710" width="140" height="52" rx="8" fill="#0f1a2e" stroke="#7c5cfc" stroke-width="1.5"/>
  <text x="95" y="730" text-anchor="middle" fill="#c4b5fd" font-size="12">SWAP</text>
  <text x="95" y="746" text-anchor="middle" fill="#6b7280" font-size="11">temp = arr[j]</text>
  <text x="95" y="758" text-anchor="middle" fill="#6b7280" font-size="11">arr[j] = arr[j+1]</text>

  <!-- NO → saltar swap (línea derecha) -->
  <line x1="165" y1="642" x2="190" y2="642" stroke="#4f7cff" stroke-width="1.5"/>
  <text x="178" y="635" text-anchor="middle" fill="#f7b731" font-size="11">NO</text>
  <line x1="190" y1="642" x2="190" y2="762" stroke="#4f7cff" stroke-width="1.5"/>
  <line x1="190" y1="762" x2="165" y2="762" stroke="#4f7cff" stroke-width="1.5" marker-end="url(#arr)"/>

  <line x1="95" y1="762" x2="95" y2="790" stroke="#4f7cff" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- j++ -->
  <rect x="25" y="790" width="140" height="36" rx="8" fill="#111827" stroke="#2e3450" stroke-width="1"/>
  <text x="95" y="812" text-anchor="middle" fill="#e8eaf6" font-size="12">j = j + 1</text>

  <!-- vuelve a ¿j < n-1-i? -->
  <line x1="25" y1="808" x2="5" y2="808" stroke="#4f7cff" stroke-width="1.5"/>
  <line x1="5" y1="808" x2="5" y2="534" stroke="#4f7cff" stroke-width="1.5"/>
  <line x1="5" y1="534" x2="25" y2="534" stroke="#4f7cff" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- NO de j < n-1-i → i++ -->
  <line x1="165" y1="534" x2="200" y2="534" stroke="#4f7cff" stroke-width="1.5"/>
  <text x="183" y="527" text-anchor="middle" fill="#f7b731" font-size="11">NO</text>
  <line x1="200" y1="534" x2="200" y2="856" stroke="#4f7cff" stroke-width="1.5"/>
  <line x1="200" y1="856" x2="165" y2="856" stroke="#4f7cff" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- i++ -->
  <rect x="25" y="838" width="140" height="36" rx="8" fill="#111827" stroke="#2e3450" stroke-width="1"/>
  <text x="95" y="860" text-anchor="middle" fill="#e8eaf6" font-size="12">i = i + 1</text>

  <!-- vuelve a ¿i < n-1? -->
  <line x1="25" y1="856" x2="0" y2="856" stroke="#4f7cff" stroke-width="1.5"/>
  <line x1="0" y1="856" x2="0" y2="361" stroke="#4f7cff" stroke-width="1.5"/>
  <line x1="0" y1="361" x2="25" y2="361" stroke="#4f7cff" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- FIN asc -->
  <ellipse cx="230" cy="361" rx="55" ry="22" fill="#1a2040" stroke="#39d98a" stroke-width="1.5"/>
  <text x="230" y="366" text-anchor="middle" fill="#39d98a" font-size="12">FIN ASC</text>

  <!-- mostrar array ordenado -->
  <line x1="230" y1="383" x2="230" y2="411" stroke="#4f7cff" stroke-width="1.5" marker-end="url(#arr)"/>
  <rect x="165" y="411" width="130" height="36" rx="8" fill="#0f1f17" stroke="#39d98a" stroke-width="1.5"/>
  <text x="230" y="428" text-anchor="middle" fill="#39d98a" font-size="12">Mostrar arr[]</text>
  <text x="230" y="442" text-anchor="middle" fill="#6b7280" font-size="10">ascendente</text>

  <!-- ════════════════════════════════════════
       LADO DERECHO — DESCENDENTE
  ════════════════════════════════════════ -->

  <!-- columna label -->
  <rect x="590" y="70" width="140" height="24" rx="4" fill="#1f1a40"/>
  <text x="660" y="87" text-anchor="middle" fill="#7c5cfc" font-size="11"
        letter-spacing="1">DESCENDENTE ↓</text>

  <!-- INICIO -->
  <ellipse cx="660" cy="135" rx="60" ry="22" fill="#1f1a40" stroke="#7c5cfc" stroke-width="1.5"/>
  <text x="660" y="140" text-anchor="middle" fill="#c4b5fd" font-size="13">INICIO</text>

  <line x1="660" y1="157" x2="660" y2="185" stroke="#7c5cfc" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- leer array -->
  <rect x="590" y="185" width="140" height="44" rx="8" fill="#12101f" stroke="#3d3460" stroke-width="1"/>
  <text x="660" y="204" text-anchor="middle" fill="#e8eaf6" font-size="12">Leer array[]</text>
  <text x="660" y="220" text-anchor="middle" fill="#6b7280" font-size="11">n = arr.length</text>

  <line x1="660" y1="229" x2="660" y2="257" stroke="#7c5cfc" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- i = 0 -->
  <rect x="590" y="257" width="140" height="36" rx="8" fill="#12101f" stroke="#3d3460" stroke-width="1"/>
  <text x="660" y="272" text-anchor="middle" fill="#e8eaf6" font-size="12">i = 0</text>
  <text x="660" y="287" text-anchor="middle" fill="#6b7280" font-size="11">(pasada exterior)</text>

  <line x1="660" y1="293" x2="660" y2="321" stroke="#7c5cfc" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- ¿i < n-1? -->
  <polygon points="660,321 730,361 660,401 590,361" fill="#161025" stroke="#7c5cfc" stroke-width="1.5"/>
  <text x="660" y="357" text-anchor="middle" fill="#c4b5fd" font-size="12">i &lt; n-1 ?</text>

  <!-- NO → FIN -->
  <line x1="590" y1="361" x2="555" y2="361" stroke="#7c5cfc" stroke-width="1.5" marker-end="url(#arr)"/>
  <text x="572" y="354" text-anchor="middle" fill="#f7b731" font-size="11">NO</text>

  <!-- SI → -->
  <text x="690" y="412" text-anchor="middle" fill="#39d98a" font-size="11">SI</text>
  <line x1="660" y1="401" x2="660" y2="430" stroke="#7c5cfc" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- j = 0 -->
  <rect x="590" y="430" width="140" height="36" rx="8" fill="#12101f" stroke="#3d3460" stroke-width="1"/>
  <text x="660" y="445" text-anchor="middle" fill="#e8eaf6" font-size="12">j = 0</text>
  <text x="660" y="461" text-anchor="middle" fill="#6b7280" font-size="11">(pasada interior)</text>

  <line x1="660" y1="466" x2="660" y2="494" stroke="#7c5cfc" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- ¿j < n-1-i? -->
  <polygon points="660,494 730,534 660,574 590,534" fill="#161025" stroke="#7c5cfc" stroke-width="1.5"/>
  <text x="660" y="527" text-anchor="middle" fill="#c4b5fd" font-size="12">j &lt; n-1-i ?</text>
  <text x="660" y="543" text-anchor="middle" fill="#6b7280" font-size="10">comparaciones++</text>

  <!-- SI → -->
  <text x="690" y="585" text-anchor="middle" fill="#39d98a" font-size="11">SI</text>
  <line x1="660" y1="574" x2="660" y2="602" stroke="#7c5cfc" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- ¿arr[j] < arr[j+1]? -->
  <polygon points="660,602 730,642 660,682 590,642" fill="#161025" stroke="#4f7cff" stroke-width="1.5"/>
  <text x="660" y="635" text-anchor="middle" fill="#a5b4fc" font-size="11">arr[j] &lt;</text>
  <text x="660" y="651" text-anchor="middle" fill="#a5b4fc" font-size="11">arr[j+1] ?</text>

  <!-- SI → SWAP -->
  <text x="690" y="693" text-anchor="middle" fill="#39d98a" font-size="11">SI</text>
  <line x1="660" y1="682" x2="660" y2="710" stroke="#7c5cfc" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- SWAP -->
  <rect x="590" y="710" width="140" height="52" rx="8" fill="#12101f" stroke="#4f7cff" stroke-width="1.5"/>
  <text x="660" y="730" text-anchor="middle" fill="#c4b5fd" font-size="12">SWAP</text>
  <text x="660" y="746" text-anchor="middle" fill="#6b7280" font-size="11">temp = arr[j]</text>
  <text x="660" y="758" text-anchor="middle" fill="#6b7280" font-size="11">arr[j] = arr[j+1]</text>

  <!-- NO → saltar swap -->
  <line x1="590" y1="642" x2="555" y2="642" stroke="#7c5cfc" stroke-width="1.5"/>
  <text x="572" y="635" text-anchor="middle" fill="#f7b731" font-size="11">NO</text>
  <line x1="555" y1="642" x2="555" y2="762" stroke="#7c5cfc" stroke-width="1.5"/>
  <line x1="555" y1="762" x2="590" y2="762" stroke="#7c5cfc" stroke-width="1.5" marker-end="url(#arr)"/>

  <line x1="660" y1="762" x2="660" y2="790" stroke="#7c5cfc" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- j++ -->
  <rect x="590" y="790" width="140" height="36" rx="8" fill="#12101f" stroke="#3d3460" stroke-width="1"/>
  <text x="660" y="812" text-anchor="middle" fill="#e8eaf6" font-size="12">j = j + 1</text>

  <!-- vuelve a ¿j < n-1-i? -->
  <line x1="730" y1="808" x2="755" y2="808" stroke="#7c5cfc" stroke-width="1.5"/>
  <line x1="755" y1="808" x2="755" y2="534" stroke="#7c5cfc" stroke-width="1.5"/>
  <line x1="755" y1="534" x2="730" y2="534" stroke="#7c5cfc" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- NO de j < n-1-i → i++ -->
  <line x1="590" y1="534" x2="555" y2="534" stroke="#7c5cfc" stroke-width="1.5"/>
  <text x="572" y="527" text-anchor="middle" fill="#f7b731" font-size="11">NO</text>
  <line x1="555" y1="534" x2="555" y2="856" stroke="#7c5cfc" stroke-width="1.5"/>
  <line x1="555" y1="856" x2="590" y2="856" stroke="#7c5cfc" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- i++ -->
  <rect x="590" y="838" width="140" height="36" rx="8" fill="#12101f" stroke="#3d3460" stroke-width="1"/>
  <text x="660" y="860" text-anchor="middle" fill="#e8eaf6" font-size="12">i = i + 1</text>

  <!-- vuelve a ¿i < n-1? -->
  <line x1="730" y1="856" x2="760" y2="856" stroke="#7c5cfc" stroke-width="1.5"/>
  <line x1="760" y1="856" x2="760" y2="361" stroke="#7c5cfc" stroke-width="1.5"/>
  <line x1="760" y1="361" x2="730" y2="361" stroke="#7c5cfc" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- FIN desc -->
  <ellipse cx="525" cy="361" rx="55" ry="22" fill="#1f1a40" stroke="#7c5cfc" stroke-width="1.5"/>
  <text x="525" y="366" text-anchor="middle" fill="#c4b5fd" font-size="12">FIN DESC</text>

  <!-- mostrar array ordenado desc -->
  <line x1="525" y1="383" x2="525" y2="411" stroke="#7c5cfc" stroke-width="1.5" marker-end="url(#arr)"/>
  <rect x="460" y="411" width="130" height="36" rx="8" fill="#12101f" stroke="#7c5cfc" stroke-width="1.5"/>
  <text x="525" y="428" text-anchor="middle" fill="#c4b5fd" font-size="12">Mostrar arr[]</text>
  <text x="525" y="442" text-anchor="middle" fill="#6b7280" font-size="10">descendente</text>

  <!-- ════════════════════════════════════════
       LEYENDA
  ════════════════════════════════════════ -->
  <rect x="240" y="960" width="280" height="160" rx="10" fill="#111318" stroke="#1f2330" stroke-width="1"/>
  <text x="380" y="984" text-anchor="middle" fill="#6b7280" font-size="11" letter-spacing="1">LEYENDA</text>

  <!-- elipse = inicio/fin -->
  <ellipse cx="270" cy="1010" rx="22" ry="12" fill="#1a2040" stroke="#4f7cff" stroke-width="1.5"/>
  <text x="300" y="1014" fill="#e8eaf6" font-size="11">Inicio / Fin</text>

  <!-- rect = proceso -->
  <rect x="250" y="1032" width="40" height="20" rx="4" fill="#111827" stroke="#2e3450" stroke-width="1"/>
  <text x="300" y="1046" fill="#e8eaf6" font-size="11">Proceso / Instrucción</text>

  <!-- rombo = decisión -->
  <polygon points="270,1068 290,1078 270,1088 250,1078" fill="#161c2e" stroke="#4f7cff" stroke-width="1.5"/>
  <text x="300" y="1082" fill="#e8eaf6" font-size="11">Decisión (condición)</text>

  <!-- swap box -->
  <rect x="250" y="1100" width="40" height="20" rx="4" fill="#0f1a2e" stroke="#7c5cfc" stroke-width="1.5"/>
  <text x="300" y="1114" fill="#e8eaf6" font-size="11">Intercambio (SWAP)</text>

  <!-- resultado -->
  <rect x="250" y="1130" width="40" height="20" rx="4" fill="#0f1f17" stroke="#39d98a" stroke-width="1.5"/>
  <text x="300" y="1144" fill="#e8eaf6" font-size="11">Resultado / Salida</text>

  <!-- ════════════════════════════════════════
       COMPLEJIDAD
  ════════════════════════════════════════ -->
  <rect x="30" y="960" width="185" height="125" rx="10" fill="#111318" stroke="#1f2330" stroke-width="1"/>
  <text x="122" y="984" text-anchor="middle" fill="#6b7280" font-size="11" letter-spacing="1">COMPLEJIDAD</text>

  <text x="45" y="1008" fill="#a5b4fc" font-size="12">Peor caso:</text>
  <text x="45" y="1026" fill="#e8eaf6" font-size="13" font-weight="600">O(n²)</text>

  <text x="45" y="1050" fill="#a5b4fc" font-size="12">Comparaciones:</text>
  <text x="45" y="1068" fill="#e8eaf6" font-size="12">n(n-1) / 2</text>

  <text x="45" y="1090" fill="#a5b4fc" font-size="12">Pasadas:</text>
  <text x="45" y="1108" fill="#e8eaf6" font-size="12">n - 1</text>

  <!-- ════════════════════════════════════════
       DIAGRAMA BÚSQUEDA LINEAL
  ════════════════════════════════════════ -->
  <g transform="translate(0, 40)">
    <rect x="30" y="1110" width="700" height="20" rx="4" fill="#111827"/>
    <text x="380" y="1124" text-anchor="middle" fill="#4f7cff" font-size="11"
          letter-spacing="2">BÚSQUEDA LINEAL (array original)</text>

    <!-- INICIO búsqueda -->
    <ellipse cx="380" cy="1165" rx="60" ry="22" fill="#1a2040" stroke="#f7b731" stroke-width="1.5"/>
    <text x="380" y="1170" text-anchor="middle" fill="#fcd34d" font-size="13">INICIO</text>

    <line x1="380" y1="1187" x2="380" y2="1212" stroke="#f7b731" stroke-width="1.5" marker-end="url(#arr)"/>

    <!-- i = 0 -->
    <rect x="310" y="1212" width="140" height="36" rx="8" fill="#111827" stroke="#3d3620" stroke-width="1"/>
    <text x="380" y="1228" text-anchor="middle" fill="#e8eaf6" font-size="12">i = 0</text>
    <text x="380" y="1244" text-anchor="middle" fill="#6b7280" font-size="11">pasos = 0</text>

    <line x1="380" y1="1248" x2="380" y2="1274" stroke="#f7b731" stroke-width="1.5" marker-end="url(#arr)"/>

    <!-- ¿i < n? -->
    <polygon points="380,1274 450,1314 380,1354 310,1314" fill="#1a1810" stroke="#f7b731" stroke-width="1.5"/>
    <text x="380" y="1307" text-anchor="middle" fill="#fcd34d" font-size="12">i &lt; n ?</text>
    <text x="380" y="1323" text-anchor="middle" fill="#6b7280" font-size="10">pasos++</text>

    <!-- SI → -->
    <text x="352" y="1365" text-anchor="middle" fill="#39d98a" font-size="11">SI</text>
    <line x1="380" y1="1354" x2="380" y2="1378" stroke="#f7b731" stroke-width="1.5" marker-end="url(#arr)"/>

    <!-- ¿arr[i] == target? -->
    <polygon points="380,1378 465,1415 380,1452 295,1415" fill="#1a1810" stroke="#f7b731" stroke-width="1.5"/>
    <text x="380" y="1408" text-anchor="middle" fill="#fcd34d" font-size="11">arr[i] ==</text>
    <text x="380" y="1424" text-anchor="middle" fill="#fcd34d" font-size="11">target ?</text>

    <!-- SI → ENCONTRADO -->
    <line x1="465" y1="1415" x2="505" y2="1415" stroke="#f7b731" stroke-width="1.5" marker-end="url(#arr)"/>
    <text x="483" y="1408" text-anchor="middle" fill="#39d98a" font-size="11">SI</text>
    <rect x="505" y="1398" width="145" height="36" rx="8" fill="#0f1f17" stroke="#39d98a" stroke-width="1.5"/>
    <text x="577" y="1415" text-anchor="middle" fill="#39d98a" font-size="12">ENCONTRADO</text>
    <text x="577" y="1430" text-anchor="middle" fill="#6b7280" font-size="10">retornar i, pasos</text>

    <!-- NO → i++ -->
    <text x="357" y="1463" text-anchor="middle" fill="#f7b731" font-size="11">NO</text>
    <line x1="380" y1="1452" x2="380" y2="1478" stroke="#f7b731" stroke-width="1.5" marker-end="url(#arr)"/>

    <!-- i++ -->
    <rect x="310" y="1478" width="140" height="32" rx="8" fill="#111827" stroke="#3d3620" stroke-width="1"/>
    <text x="380" y="1498" text-anchor="middle" fill="#e8eaf6" font-size="12">i = i + 1</text>

    <!-- vuelve a ¿i < n? -->
    <line x1="310" y1="1494" x2="280" y2="1494" stroke="#f7b731" stroke-width="1.5"/>
    <line x1="280" y1="1494" x2="280" y2="1314" stroke="#f7b731" stroke-width="1.5"/>
    <line x1="280" y1="1314" x2="310" y2="1314" stroke="#f7b731" stroke-width="1.5" marker-end="url(#arr)"/>

    <!-- NO de i<n → NO ENCONTRADO -->
    <line x1="310" y1="1314" x2="275" y2="1314" stroke="#f7b731" stroke-width="1.5"/>
    <text x="263" y="1307" text-anchor="middle" fill="#f7b731" font-size="11">NO</text>

    <!-- NO ENCONTRADO -->
    <rect x="100" y="1298" width="145" height="36" rx="8" fill="#1f0f0f" stroke="#ff5e57" stroke-width="1.5"/>
    <text x="172" y="1315" text-anchor="middle" fill="#ff5e57" font-size="12">NO ENCONTRADO</text>
    <text x="172" y="1330" text-anchor="middle" fill="#6b7280" font-size="10">retornar -1, pasos</text>

    <line x1="245" y1="1314" x2="275" y2="1314" stroke="#f7b731" stroke-width="1.5"/>
    <line x1="245" y1="1314" x2="245" y2="1314" stroke="#f7b731" stroke-width="1.5" marker-end="url(#arr)"/>

    <!-- FIN búsqueda -->
    <ellipse cx="380" cy="1580" rx="60" ry="22" fill="#1a2040" stroke="#f7b731" stroke-width="1.5"/>
    <text x="380" y="1585" text-anchor="middle" fill="#fcd34d" font-size="13">FIN</text>

    <line x1="577" y1="1434" x2="577" y2="1580" stroke="#f7b731" stroke-width="1"/>
    <line x1="577" y1="1580" x2="440" y2="1580" stroke="#f7b731" stroke-width="1" marker-end="url(#arr)"/>
    <line x1="172" y1="1334" x2="172" y2="1580" stroke="#ff5e57" stroke-width="1"/>
    <line x1="172" y1="1580" x2="320" y2="1580" stroke="#ff5e57" stroke-width="1" marker-end="url(#arr)"/>
  </g>
</svg>`;

  $('flowchart-svg').innerHTML = svg;
}

/* ═══════════════ Init ═══════════════ */
document.addEventListener('DOMContentLoaded', () => {
  buildFlowchart();
  
  // Dynamic inputs logic
  function updateDynamicInputs(countId, containerId) {
    const count = parseInt($(countId).value, 10);
    const container = $(containerId);
    if (isNaN(count) || count < 1 || count > 50) {
      container.innerHTML = '';
      return;
    }
    
    const currentCount = container.children.length;
    if (count > currentCount) {
      for (let i = currentCount; i < count; i++) {
        const inp = document.createElement('input');
        inp.type = 'number';
        inp.className = 'bubble-input';
        inp.placeholder = '0';
        container.appendChild(inp);
      }
    } else if (count < currentCount) {
      while (container.children.length > count) {
        container.removeChild(container.lastChild);
      }
    }
  }

  $('inp-n').addEventListener('input', () => updateDynamicInputs('inp-n', 'dynamic-inputs'));
  $('add-n').addEventListener('input', () => updateDynamicInputs('add-n', 'dynamic-add-inputs'));
  
  // Inicializar si el input ya tiene valor
  if ($('inp-n').value) updateDynamicInputs('inp-n', 'dynamic-inputs');
  if ($('add-n').value) updateDynamicInputs('add-n', 'dynamic-add-inputs');
});
