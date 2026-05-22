# 🫧 BubbleSort — Programación Tradicional I

Aplicación web interactiva que implementa el **Algoritmo de la Burbuja** (Bubble Sort) con interfaz visual, búsqueda lineal y diagrama de flujo.

## 🚀 Ver en vivo

👉 [Abrir en GitHub Pages](https://TU_USUARIO.github.io/bubble-sort-java/)

---

## 📋 Funcionalidades

| # | Función | Descripción |
|---|---------|-------------|
| 01 | **Ingresar datos** | Define N (cantidad) e ingresa los números separados por espacio |
| 02 | **Array visual** | Muestra cada número como una burbuja interactiva |
| 03 | **Agregar más** | Añade más números al array existente con su propio N |
| 04 | **Búsqueda lineal** | Busca en el array original; indica en cuántos pasos encontró el número |
| 05 | **Ordenamiento** | Ejecuta Bubble Sort ascendente y descendente; muestra comparaciones |
| 06 | **Diagrama de flujo** | Diagrama SVG completo del algoritmo de ordenamiento y búsqueda |

---

## 🧮 Algoritmos implementados

### Bubble Sort Ascendente
```java
// Java equivalente
for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < n - 1 - i; j++) {
        comparaciones++;
        if (arr[j] > arr[j + 1]) {
            int temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
        }
    }
}
```

### Bubble Sort Descendente
```java
// Java equivalente
for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < n - 1 - i; j++) {
        comparaciones++;
        if (arr[j] < arr[j + 1]) {  // condición invertida
            int temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
        }
    }
}
```

### Búsqueda Lineal
```java
// Java equivalente
for (int i = 0; i < n; i++) {
    pasos++;
    if (arr[i] == target) {
        return i; // encontrado en posición i
    }
}
return -1; // no encontrado
```

### Complejidad
- **Tiempo**: O(n²) en el peor caso
- **Comparaciones**: n(n-1) / 2
- **Pasadas externas**: n - 1

---

## 📁 Estructura del proyecto

```
bubble-sort-java/
├── index.html          # Página principal
├── css/
│   └── style.css       # Estilos (tema oscuro terminal)
├── js/
│   ├── bubble.js       # Lógica del algoritmo
│   └── ui.js           # Interfaz y diagrama de flujo
└── README.md
```

---

## 🌐 Subir a GitHub Pages

1. Crea un repositorio en GitHub llamado `bubble-sort-java`
2. Sube todos los archivos
3. Ve a **Settings → Pages**
4. En **Source**, selecciona `main` branch y carpeta `/ (root)`
5. Guarda — en unos minutos tendrás tu URL pública

---

## 🎓 Materia

**Programación Tradicional I** — Algoritmo de la Burbuja  
Lenguaje base: **Java** (lógica implementada para web en JavaScript)

---

*Diseño: Dark Terminal / Code aesthetic*
