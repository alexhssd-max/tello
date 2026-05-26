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
const show = id => $(id).classList.remove('hidden');
const hide = id => $(id).classList.add('hidden');
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

  // Resetear resultados previos
  hide('search-result');
  hide('sort-results');
  hide('add-more-panel');
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

  const asc = bubbleSortAsc(currentArray);
  const desc = bubbleSortDesc(currentArray);

  lastAsc = asc;
  lastDesc = desc;

  // Ascendente
  renderBubbles('asc-bubbles', asc.sorted);
  $('asc-comparisons').textContent =
    `intercambios realizados: ${asc.comparisons}`;

  // Descendente
  renderBubbles('desc-bubbles', desc.sorted);
  $('desc-comparisons').textContent =
    `intercambios realizados: ${desc.comparisons}`;

  show('sort-results');
  $('sec-sort').scrollIntoView({ behavior: 'smooth', block: 'start' });
});


/* ═══════════════ DIAGRAMA DE FLUJO ═══════════════ */
function buildFlowchart() {
  const svg = `
<svg viewBox="0 0 960 2160" xmlns="http://www.w3.org/2000/svg"
     font-family="'JetBrains Mono', monospace" font-size="13">

  <defs>
    <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="#4f7cff"/>
    </marker>
  </defs>

  <!-- fondo -->
  <rect width="960" height="2160" fill="#0b0d12" rx="12"/>

  <!-- ── Título ── -->
  <text x="480" y="40" text-anchor="middle" fill="#e8eaf6"
        font-family="'Syne',sans-serif" font-size="15" font-weight="700"
        letter-spacing="2">DIAGRAMA DE FLUJO — BUBBLE SORT</text>
  <text x="480" y="58" text-anchor="middle" fill="#6b7280" font-size="11">
    Ascendente y Descendente
  </text>


  <!-- ════════════════════════════════════════
       FLUJO PRINCIPAL DE INTERFAZ
  ════════════════════════════════════════ -->
  <!-- INICIO PRINCIPAL -->
  <ellipse cx="480" cy="80" rx="60" ry="22" fill="#1a2040" stroke="#fcd34d" stroke-width="1.5"/>
  <text x="480" y="85" text-anchor="middle" fill="#fcd34d" font-size="13">INICIO</text>
  
  <line x1="480" y1="102" x2="480" y2="120" stroke="#fcd34d" stroke-width="1.5" marker-end="url(#arr)"/>
  
  <!-- Ingresar N -->
  <rect x="380" y="120" width="200" height="36" rx="8" fill="#111827" stroke="#3d3620" stroke-width="1"/>
  <text x="480" y="136" text-anchor="middle" fill="#e8eaf6" font-size="12">Ingresar N</text>
  <text x="480" y="150" text-anchor="middle" fill="#6b7280" font-size="10">(cantidad inicial)</text>
  
  <line x1="480" y1="156" x2="480" y2="190" stroke="#fcd34d" stroke-width="1.5" marker-end="url(#arr)"/>
  
  <!-- Llenar Array -->
  <rect x="380" y="190" width="200" height="36" rx="8" fill="#111827" stroke="#3d3620" stroke-width="1"/>
  <text x="480" y="212" text-anchor="middle" fill="#e8eaf6" font-size="12">Llenar array[] inicial</text>
  
  <line x1="480" y1="226" x2="480" y2="260" stroke="#fcd34d" stroke-width="1.5" marker-end="url(#arr)"/>
  
  <!-- ¿Agregar más? -->
  <polygon points="480,260 580,292 480,324 380,292" fill="#1a1810" stroke="#fcd34d" stroke-width="1.5"/>
  <text x="480" y="287" text-anchor="middle" fill="#fcd34d" font-size="11">¿Agregar</text>
  <text x="480" y="303" text-anchor="middle" fill="#fcd34d" font-size="11">más números?</text>
  
  <!-- SI -> Llenar más -->
  <line x1="580" y1="292" x2="620" y2="292" stroke="#fcd34d" stroke-width="1.5" marker-end="url(#arr)"/>
  <text x="600" y="285" text-anchor="middle" fill="#39d98a" font-size="11">SI</text>
  
  <!-- Box 1: Ingresar M -->
  <rect x="620" y="274" width="170" height="36" rx="8" fill="#111827" stroke="#3d3620" stroke-width="1"/>
  <text x="705" y="290" text-anchor="middle" fill="#e8eaf6" font-size="12">Ingresar M</text>
  <text x="705" y="304" text-anchor="middle" fill="#6b7280" font-size="10">(cant. a agregar)</text>
  
  <line x1="705" y1="310" x2="705" y2="334" stroke="#fcd34d" stroke-width="1.5" marker-end="url(#arr)"/>
  
  <!-- Box 2: Leer nuevos -->
  <rect x="620" y="334" width="170" height="36" rx="8" fill="#111827" stroke="#3d3620" stroke-width="1"/>
  <text x="705" y="356" text-anchor="middle" fill="#e8eaf6" font-size="12">Leer arrNuevo[]</text>

  <line x1="705" y1="370" x2="705" y2="394" stroke="#fcd34d" stroke-width="1.5" marker-end="url(#arr)"/>
  
  <!-- Box 3: Concatenar -->
  <rect x="620" y="394" width="170" height="36" rx="8" fill="#111827" stroke="#3d3620" stroke-width="1"/>
  <text x="705" y="416" text-anchor="middle" fill="#e8eaf6" font-size="12">arr = arr + arrNuevo</text>
  
  <!-- Vuelve al flujo principal saltando el llenado inicial -->
  <polyline points="705,430 705,445 840,445 840,243 480,243" fill="none" stroke="#fcd34d" stroke-width="1.5" marker-end="url(#arr)"/>
  
  <!-- NO -> Ejecutar algoritmos -->
  <line x1="480" y1="324" x2="480" y2="460" stroke="#fcd34d" stroke-width="1.5"/>
  <text x="495" y="340" text-anchor="middle" fill="#f7b731" font-size="11">NO</text>
  
  <!-- bifurcar a los dos métodos -->
  <line x1="480" y1="460" x2="170" y2="460" stroke="#fcd34d" stroke-width="1.5"/>
  <line x1="170" y1="460" x2="170" y2="485" stroke="#fcd34d" stroke-width="1.5" marker-end="url(#arr)"/>

  <line x1="480" y1="460" x2="790" y2="460" stroke="#fcd34d" stroke-width="1.5"/>
  <line x1="790" y1="460" x2="790" y2="485" stroke="#fcd34d" stroke-width="1.5" marker-end="url(#arr)"/>

  <g transform="translate(0, 420)">
  <!-- ════════════════════════════════════════
       LADO IZQUIERDO — ASCENDENTE
  ════════════════════════════════════════ -->

  <!-- columna label -->
  <rect x="70" y="70" width="200" height="24" rx="4" fill="#1a2040"/>
  <text x="170" y="87" text-anchor="middle" fill="#4f7cff" font-size="11"
        letter-spacing="1">ASCENDENTE ↑</text>

  <!-- INICIO -->
  <ellipse cx="170" cy="135" rx="60" ry="22" fill="#1a2040" stroke="#4f7cff" stroke-width="1.5"/>
  <text x="170" y="140" text-anchor="middle" fill="#a5b4fc" font-size="13">INICIO</text>

  <!-- flecha -->
  <line x1="170" y1="157" x2="170" y2="185" stroke="#4f7cff" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- leer array -->
  <rect x="70" y="185" width="200" height="44" rx="8" fill="#111827" stroke="#2e3450" stroke-width="1"/>
  <text x="170" y="204" text-anchor="middle" fill="#e8eaf6" font-size="12">n = arr.length</text>
  <text x="170" y="220" text-anchor="middle" fill="#6b7280" font-size="11">Leer array[]</text>

  <line x1="170" y1="229" x2="170" y2="257" stroke="#4f7cff" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- i = 0 -->
  <rect x="70" y="257" width="200" height="36" rx="8" fill="#111827" stroke="#2e3450" stroke-width="1"/>
  <text x="170" y="272" text-anchor="middle" fill="#e8eaf6" font-size="12">i = 0</text>
  <text x="170" y="287" text-anchor="middle" fill="#6b7280" font-size="11">(pasada exterior)</text>

  <line x1="170" y1="293" x2="170" y2="321" stroke="#4f7cff" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- ¿i < n-1? -->
  <polygon points="170,321 270,361 170,401 70,361" fill="#161c2e" stroke="#4f7cff" stroke-width="1.5"/>
  <text x="170" y="357" text-anchor="middle" fill="#a5b4fc" font-size="12">i &lt; n-1 ?</text>

  <!-- NO → FIN -->
  <line x1="270" y1="361" x2="310" y2="361" stroke="#4f7cff" stroke-width="1.5" marker-end="url(#arr)"/>
  <text x="290" y="354" text-anchor="middle" fill="#f7b731" font-size="11">NO</text>

  <!-- SI → -->
  <text x="145" y="412" text-anchor="middle" fill="#39d98a" font-size="11">SI</text>
  <line x1="170" y1="401" x2="170" y2="430" stroke="#4f7cff" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- j = 0 -->
  <rect x="70" y="430" width="200" height="36" rx="8" fill="#111827" stroke="#2e3450" stroke-width="1"/>
  <text x="170" y="445" text-anchor="middle" fill="#e8eaf6" font-size="12">j = 0</text>
  <text x="170" y="461" text-anchor="middle" fill="#6b7280" font-size="11">(pasada interior)</text>

  <line x1="170" y1="466" x2="170" y2="494" stroke="#4f7cff" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- ¿j < n-1-i? -->
  <polygon points="170,494 270,534 170,574 70,534" fill="#161c2e" stroke="#4f7cff" stroke-width="1.5"/>
  <text x="170" y="538" text-anchor="middle" fill="#a5b4fc" font-size="12">j &lt; n-1-i ?</text>

  <!-- SI → -->
  <text x="145" y="585" text-anchor="middle" fill="#39d98a" font-size="11">SI</text>
  <line x1="170" y1="574" x2="170" y2="602" stroke="#4f7cff" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- ¿arr[j] > arr[j+1]? -->
  <polygon points="170,602 270,642 170,682 70,642" fill="#161c2e" stroke="#7c5cfc" stroke-width="1.5"/>
  <text x="170" y="635" text-anchor="middle" fill="#c4b5fd" font-size="11">arr[j] &gt;</text>
  <text x="170" y="651" text-anchor="middle" fill="#c4b5fd" font-size="11">arr[j+1] ?</text>

  <!-- SI → SWAP -->
  <text x="145" y="693" text-anchor="middle" fill="#39d98a" font-size="11">SI</text>
  <line x1="170" y1="682" x2="170" y2="710" stroke="#4f7cff" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- SWAP -->
  <rect x="70" y="710" width="200" height="84" rx="8" fill="#0f1a2e" stroke="#7c5cfc" stroke-width="1.5"/>
  <text x="170" y="728" text-anchor="middle" fill="#c4b5fd" font-size="12">SWAP</text>
  <text x="170" y="744" text-anchor="middle" fill="#39d98a" font-size="11">intercambios++</text>
  <text x="170" y="758" text-anchor="middle" fill="#6b7280" font-size="11">temp = arr[j]</text>
  <text x="170" y="770" text-anchor="middle" fill="#6b7280" font-size="11">arr[j] = arr[j+1]</text>
  <text x="170" y="782" text-anchor="middle" fill="#6b7280" font-size="11">arr[j+1] = temp</text>

  <!-- NO → saltar swap (línea derecha) -->
  <line x1="270" y1="642" x2="295" y2="642" stroke="#4f7cff" stroke-width="1.5"/>
  <text x="282" y="635" text-anchor="middle" fill="#f7b731" font-size="11">NO</text>
  <line x1="295" y1="642" x2="295" y2="817" stroke="#4f7cff" stroke-width="1.5"/>
  <line x1="295" y1="817" x2="170" y2="817" stroke="#4f7cff" stroke-width="1.5" marker-end="url(#arr)"/>
  <line x1="170" y1="794" x2="170" y2="840" stroke="#4f7cff" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- j++ -->
  <rect x="70" y="840" width="200" height="36" rx="8" fill="#111827" stroke="#2e3450" stroke-width="1"/>
  <text x="170" y="862" text-anchor="middle" fill="#e8eaf6" font-size="12">j = j + 1</text>

  <!-- vuelve a ¿j < n-1-i? -->
  <line x1="70" y1="858" x2="30" y2="858" stroke="#4f7cff" stroke-width="1.5"/>
  <line x1="30" y1="858" x2="30" y2="534" stroke="#4f7cff" stroke-width="1.5"/>
  <line x1="30" y1="534" x2="70" y2="534" stroke="#4f7cff" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- NO de j < n-1-i → i++ -->
  <line x1="270" y1="534" x2="310" y2="534" stroke="#4f7cff" stroke-width="1.5"/>
  <text x="290" y="527" text-anchor="middle" fill="#f7b731" font-size="11">NO</text>
  <line x1="310" y1="534" x2="310" y2="938" stroke="#4f7cff" stroke-width="1.5"/>
  <line x1="310" y1="938" x2="270" y2="938" stroke="#4f7cff" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- i++ -->
  <rect x="70" y="920" width="200" height="36" rx="8" fill="#111827" stroke="#2e3450" stroke-width="1"/>
  <text x="170" y="942" text-anchor="middle" fill="#e8eaf6" font-size="12">i = i + 1</text>

  <!-- vuelve a ¿i < n-1? -->
  <line x1="70" y1="938" x2="10" y2="938" stroke="#4f7cff" stroke-width="1.5"/>
  <line x1="10" y1="938" x2="10" y2="361" stroke="#4f7cff" stroke-width="1.5"/>
  <line x1="10" y1="361" x2="70" y2="361" stroke="#4f7cff" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- FIN asc -->
  <ellipse cx="360" cy="361" rx="55" ry="22" fill="#1a2040" stroke="#39d98a" stroke-width="1.5"/>
  <text x="360" y="366" text-anchor="middle" fill="#39d98a" font-size="12">FIN ASC</text>

  <!-- mostrar array ordenado -->
  <line x1="360" y1="383" x2="360" y2="411" stroke="#4f7cff" stroke-width="1.5" marker-end="url(#arr)"/>
  <rect x="285" y="411" width="150" height="36" rx="8" fill="#0f1f17" stroke="#39d98a" stroke-width="1.5"/>
  <text x="360" y="428" text-anchor="middle" fill="#39d98a" font-size="12">Mostrar arr[]</text>
  <text x="360" y="442" text-anchor="middle" fill="#6b7280" font-size="10">ascendente</text>

  <!-- ════════════════════════════════════════
       LADO DERECHO — DESCENDENTE
  ════════════════════════════════════════ -->

  <!-- columna label -->
  <rect x="690" y="70" width="200" height="24" rx="4" fill="#1f1a40"/>
  <text x="790" y="87" text-anchor="middle" fill="#7c5cfc" font-size="11"
        letter-spacing="1">DESCENDENTE ↓</text>

  <!-- INICIO -->
  <ellipse cx="790" cy="135" rx="60" ry="22" fill="#1f1a40" stroke="#7c5cfc" stroke-width="1.5"/>
  <text x="790" y="140" text-anchor="middle" fill="#c4b5fd" font-size="13">INICIO</text>

  <line x1="790" y1="157" x2="790" y2="185" stroke="#7c5cfc" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- leer array -->
  <rect x="690" y="185" width="200" height="44" rx="8" fill="#12101f" stroke="#3d3460" stroke-width="1"/>
  <text x="790" y="204" text-anchor="middle" fill="#e8eaf6" font-size="12">n = arr.length</text>
  <text x="790" y="220" text-anchor="middle" fill="#6b7280" font-size="11">Leer array[]</text>

  <line x1="790" y1="229" x2="790" y2="257" stroke="#7c5cfc" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- i = 0 -->
  <rect x="690" y="257" width="200" height="36" rx="8" fill="#12101f" stroke="#3d3460" stroke-width="1"/>
  <text x="790" y="272" text-anchor="middle" fill="#e8eaf6" font-size="12">i = 0</text>
  <text x="790" y="287" text-anchor="middle" fill="#6b7280" font-size="11">(pasada exterior)</text>

  <line x1="790" y1="293" x2="790" y2="321" stroke="#7c5cfc" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- ¿i < n-1? -->
  <polygon points="790,321 890,361 790,401 690,361" fill="#161025" stroke="#7c5cfc" stroke-width="1.5"/>
  <text x="790" y="357" text-anchor="middle" fill="#c4b5fd" font-size="12">i &lt; n-1 ?</text>

  <!-- NO → FIN -->
  <line x1="690" y1="361" x2="655" y2="361" stroke="#7c5cfc" stroke-width="1.5" marker-end="url(#arr)"/>
  <text x="672" y="354" text-anchor="middle" fill="#f7b731" font-size="11">NO</text>

  <!-- SI → -->
  <text x="765" y="412" text-anchor="middle" fill="#39d98a" font-size="11">SI</text>
  <line x1="790" y1="401" x2="790" y2="430" stroke="#7c5cfc" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- j = 0 -->
  <rect x="690" y="430" width="200" height="36" rx="8" fill="#12101f" stroke="#3d3460" stroke-width="1"/>
  <text x="790" y="445" text-anchor="middle" fill="#e8eaf6" font-size="12">j = 0</text>
  <text x="790" y="461" text-anchor="middle" fill="#6b7280" font-size="11">(pasada interior)</text>

  <line x1="790" y1="466" x2="790" y2="494" stroke="#7c5cfc" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- ¿j < n-1-i? -->
  <polygon points="790,494 890,534 790,574 690,534" fill="#161025" stroke="#7c5cfc" stroke-width="1.5"/>
  <text x="790" y="538" text-anchor="middle" fill="#c4b5fd" font-size="12">j &lt; n-1-i ?</text>

  <!-- SI → -->
  <text x="765" y="585" text-anchor="middle" fill="#39d98a" font-size="11">SI</text>
  <line x1="790" y1="574" x2="790" y2="602" stroke="#7c5cfc" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- ¿arr[j] < arr[j+1]? -->
  <polygon points="790,602 890,642 790,682 690,642" fill="#161025" stroke="#4f7cff" stroke-width="1.5"/>
  <text x="790" y="635" text-anchor="middle" fill="#a5b4fc" font-size="11">arr[j] &lt;</text>
  <text x="790" y="651" text-anchor="middle" fill="#a5b4fc" font-size="11">arr[j+1] ?</text>

  <!-- SI → SWAP -->
  <text x="765" y="693" text-anchor="middle" fill="#39d98a" font-size="11">SI</text>
  <line x1="790" y1="682" x2="790" y2="710" stroke="#7c5cfc" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- SWAP -->
  <rect x="690" y="710" width="200" height="80" rx="8" fill="#12101f" stroke="#4f7cff" stroke-width="1.5"/>
  <text x="790" y="728" text-anchor="middle" fill="#c4b5fd" font-size="12">SWAP</text>
  <text x="790" y="744" text-anchor="middle" fill="#39d98a" font-size="11">intercambios++</text>
  <text x="790" y="758" text-anchor="middle" fill="#6b7280" font-size="11">temp = arr[j]</text>
  <text x="790" y="770" text-anchor="middle" fill="#6b7280" font-size="11">arr[j] = arr[j+1]</text>
  <text x="790" y="782" text-anchor="middle" fill="#6b7280" font-size="11">arr[j+1] = temp</text>

  <!-- NO → saltar swap -->
  <line x1="690" y1="642" x2="655" y2="642" stroke="#7c5cfc" stroke-width="1.5"/>
  <text x="672" y="635" text-anchor="middle" fill="#f7b731" font-size="11">NO</text>
  <line x1="655" y1="642" x2="655" y2="817" stroke="#7c5cfc" stroke-width="1.5"/>
  <line x1="655" y1="817" x2="790" y2="817" stroke="#7c5cfc" stroke-width="1.5" marker-end="url(#arr)"/>
  <line x1="790" y1="778" x2="790" y2="840" stroke="#7c5cfc" stroke-width="1.5" marker-end="url(#arr)"/>
  <!-- j++ -->
  <rect x="690" y="840" width="200" height="36" rx="8" fill="#12101f" stroke="#3d3460" stroke-width="1"/>
  <text x="790" y="862" text-anchor="middle" fill="#e8eaf6" font-size="12">j = j + 1</text>

  <!-- vuelve a ¿j < n-1-i? -->
  <line x1="890" y1="858" x2="925" y2="858" stroke="#7c5cfc" stroke-width="1.5"/>
  <line x1="925" y1="858" x2="925" y2="534" stroke="#7c5cfc" stroke-width="1.5"/>
  <line x1="925" y1="534" x2="890" y2="534" stroke="#7c5cfc" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- NO de j < n-1-i → i++ -->
  <line x1="690" y1="534" x2="650" y2="534" stroke="#7c5cfc" stroke-width="1.5"/>
  <text x="670" y="527" text-anchor="middle" fill="#f7b731" font-size="11">NO</text>
  <line x1="650" y1="534" x2="650" y2="938" stroke="#7c5cfc" stroke-width="1.5"/>
  <line x1="650" y1="938" x2="690" y2="938" stroke="#7c5cfc" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- i++ -->
  <rect x="690" y="920" width="200" height="36" rx="8" fill="#12101f" stroke="#3d3460" stroke-width="1"/>
  <text x="790" y="942" text-anchor="middle" fill="#e8eaf6" font-size="12">i = i + 1</text>

  <!-- vuelve a ¿i < n-1? -->
  <line x1="890" y1="938" x2="940" y2="938" stroke="#7c5cfc" stroke-width="1.5"/>
  <line x1="940" y1="938" x2="940" y2="361" stroke="#7c5cfc" stroke-width="1.5"/>
  <line x1="940" y1="361" x2="890" y2="361" stroke="#7c5cfc" stroke-width="1.5" marker-end="url(#arr)"/>

  <!-- FIN desc -->
  <ellipse cx="600" cy="361" rx="55" ry="22" fill="#1f1a40" stroke="#7c5cfc" stroke-width="1.5"/>
  <text x="600" y="366" text-anchor="middle" fill="#c4b5fd" font-size="12">FIN DESC</text>

  <!-- mostrar array ordenado desc -->
  <line x1="600" y1="383" x2="600" y2="411" stroke="#7c5cfc" stroke-width="1.5" marker-end="url(#arr)"/>
  <rect x="525" y="411" width="150" height="36" rx="8" fill="#12101f" stroke="#7c5cfc" stroke-width="1.5"/>
  <text x="600" y="428" text-anchor="middle" fill="#c4b5fd" font-size="12">Mostrar arr[]</text>
  <text x="600" y="442" text-anchor="middle" fill="#6b7280" font-size="10">descendente</text>

  <!-- ════════════════════════════════════════
       DIAGRAMA BÚSQUEDA LINEAL
  ════════════════════════════════════════ -->
  <g transform="translate(0, -150)">

    <!-- INICIO búsqueda -->
    <ellipse cx="480" cy="1165" rx="60" ry="22" fill="#1a2040" stroke="#f7b731" stroke-width="1.5"/>
    <text x="480" y="1170" text-anchor="middle" fill="#fcd34d" font-size="13">INICIO</text>

    <line x1="480" y1="1187" x2="480" y2="1212" stroke="#f7b731" stroke-width="1.5" marker-end="url(#arr)"/>

    <!-- i = 0 -->
    <rect x="380" y="1212" width="200" height="36" rx="8" fill="#111827" stroke="#3d3620" stroke-width="1"/>
    <text x="480" y="1228" text-anchor="middle" fill="#e8eaf6" font-size="12">i = 0</text>
    <text x="480" y="1244" text-anchor="middle" fill="#6b7280" font-size="11">pasos = 0</text>

    <line x1="480" y1="1248" x2="480" y2="1274" stroke="#f7b731" stroke-width="1.5" marker-end="url(#arr)"/>

    <!-- ¿i < n? -->
    <polygon points="480,1274 580,1314 480,1354 380,1314" fill="#1a1810" stroke="#f7b731" stroke-width="1.5"/>
    <text x="480" y="1307" text-anchor="middle" fill="#fcd34d" font-size="12">i &lt; n ?</text>
    <text x="480" y="1323" text-anchor="middle" fill="#6b7280" font-size="10">pasos++</text>

    <!-- SI → -->
    <text x="452" y="1365" text-anchor="middle" fill="#39d98a" font-size="11">SI</text>
    <line x1="480" y1="1354" x2="480" y2="1378" stroke="#f7b731" stroke-width="1.5" marker-end="url(#arr)"/>

    <!-- ¿arr[i] == target? -->
    <polygon points="480,1378 580,1415 480,1452 380,1415" fill="#1a1810" stroke="#f7b731" stroke-width="1.5"/>
    <text x="480" y="1408" text-anchor="middle" fill="#fcd34d" font-size="11">arr[i] ==</text>
    <text x="480" y="1424" text-anchor="middle" fill="#fcd34d" font-size="11">target ?</text>

    <!-- SI → ENCONTRADO -->
    <line x1="580" y1="1415" x2="620" y2="1415" stroke="#f7b731" stroke-width="1.5" marker-end="url(#arr)"/>
    <text x="598" y="1408" text-anchor="middle" fill="#39d98a" font-size="11">SI</text>
    <rect x="620" y="1398" width="165" height="36" rx="8" fill="#0f1f17" stroke="#39d98a" stroke-width="1.5"/>
    <text x="702" y="1415" text-anchor="middle" fill="#39d98a" font-size="12">ENCONTRADO</text>
    <text x="702" y="1430" text-anchor="middle" fill="#6b7280" font-size="10">retornar i, pasos</text>

    <!-- NO → i++ -->
    <text x="457" y="1463" text-anchor="middle" fill="#f7b731" font-size="11">NO</text>
    <line x1="480" y1="1452" x2="480" y2="1478" stroke="#f7b731" stroke-width="1.5" marker-end="url(#arr)"/>

    <!-- i++ -->
    <rect x="380" y="1478" width="200" height="32" rx="8" fill="#111827" stroke="#3d3620" stroke-width="1"/>
    <text x="480" y="1498" text-anchor="middle" fill="#e8eaf6" font-size="12">i = i + 1</text>

    <!-- vuelve a ¿i < n? -->
    <line x1="380" y1="1494" x2="350" y2="1494" stroke="#f7b731" stroke-width="1.5"/>
    <line x1="350" y1="1494" x2="350" y2="1314" stroke="#f7b731" stroke-width="1.5"/>
    <line x1="350" y1="1314" x2="380" y2="1314" stroke="#f7b731" stroke-width="1.5" marker-end="url(#arr)"/>

    <!-- NO de i<n → NO ENCONTRADO -->
    <line x1="380" y1="1314" x2="345" y2="1314" stroke="#f7b731" stroke-width="1.5"/>
    <text x="333" y="1307" text-anchor="middle" fill="#f7b731" font-size="11">NO</text>

    <!-- NO ENCONTRADO -->
    <rect x="150" y="1298" width="165" height="36" rx="8" fill="#1f0f0f" stroke="#ff5e57" stroke-width="1.5"/>
    <text x="232" y="1315" text-anchor="middle" fill="#ff5e57" font-size="12">NO ENCONTRADO</text>
    <text x="232" y="1330" text-anchor="middle" fill="#6b7280" font-size="10">retornar -1, pasos</text>

    <line x1="315" y1="1314" x2="345" y2="1314" stroke="#f7b731" stroke-width="1.5"/>
    <line x1="315" y1="1314" x2="315" y2="1314" stroke="#f7b731" stroke-width="1.5" marker-end="url(#arr)"/>

    <!-- FIN búsqueda -->
    <ellipse cx="480" cy="1580" rx="60" ry="22" fill="#1a2040" stroke="#f7b731" stroke-width="1.5"/>
    <text x="480" y="1585" text-anchor="middle" fill="#fcd34d" font-size="13">FIN</text>

    <line x1="702" y1="1434" x2="702" y2="1580" stroke="#f7b731" stroke-width="1"/>
    <line x1="702" y1="1580" x2="540" y2="1580" stroke="#f7b731" stroke-width="1" marker-end="url(#arr)"/>
    <line x1="232" y1="1334" x2="232" y2="1580" stroke="#ff5e57" stroke-width="1"/>
    <line x1="232" y1="1580" x2="420" y2="1580" stroke="#ff5e57" stroke-width="1" marker-end="url(#arr)"/>
  </g>
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
