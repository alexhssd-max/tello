/**
 * BubbleSort — Lógica del Algoritmo
 * Programación Tradicional I
 *
 * Equivalente Java traducido a JavaScript para web.
 * Toda la lógica es pura: sin manipulación DOM aquí.
 */

/**
 * Ordena un array de forma ASCENDENTE usando burbuja.
 * @param {number[]} arr - Array original
 * @returns {{ sorted: number[], comparisons: number }}
 */
function bubbleSortAsc(arr) {
  const a = [...arr];
  const n = a.length;
  let comparisons = 0;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      if (a[j] > a[j + 1]) {
        comparisons++; // Contar solo cuando hay intercambio
        // Intercambio (swap)
        let temp = a[j];
        a[j] = a[j + 1];
        a[j + 1] = temp;
      }
    }
  }

  return { sorted: a, comparisons };
}

/**
 * Ordena un array de forma DESCENDENTE usando burbuja.
 * @param {number[]} arr - Array original
 * @returns {{ sorted: number[], comparisons: number }}
 */
function bubbleSortDesc(arr) {
  const a = [...arr];
  const n = a.length;
  let comparisons = 0;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      if (a[j] < a[j + 1]) {
        comparisons++; // Contar solo cuando hay intercambio
        // Intercambio (swap)
        let temp = a[j];
        a[j] = a[j + 1];
        a[j + 1] = temp;
      }
    }
  }

  return { sorted: a, comparisons };
}

/**
 * Búsqueda lineal en el array original.
 * @param {number[]} arr - Array donde buscar
 * @param {number} target - Número a buscar
 * @returns {{ found: boolean, index: number, steps: number }}
 */
function linearSearch(arr, target) {
  let steps = 0;

  for (let i = 0; i < arr.length; i++) {
    steps++;
    if (arr[i] === target) {
      return { found: true, index: i, steps };
    }
  }

  return { found: false, index: -1, steps };
}

/**
 * Valida y parsea la cadena de números ingresada.
 * @param {string} input - Texto del campo
 * @param {number} n - Cantidad esperada
 * @returns {{ nums: number[], error: string|null }}
 */
function parseNumbers(input, n) {
  const parts = input.trim().split(/[\s,]+/).filter(Boolean);

  if (parts.length !== n) {
    return {
      nums: [],
      error: `Se esperaban ${n} número(s), pero se ingresaron ${parts.length}.`
    };
  }

  const nums = [];
  for (let i = 0; i < parts.length; i++) {
    const val = parseInt(parts[i], 10);
    if (isNaN(val)) {
      return { nums: [], error: `"${parts[i]}" no es un número entero válido.` };
    }
    nums.push(val);
  }

  return { nums, error: null };
}
