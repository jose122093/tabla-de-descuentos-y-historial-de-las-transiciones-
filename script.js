// Referencias a elementos DOM
const form = document.getElementById('calcForm');
const priceInput = document.getElementById('price');
const exchangeInput = document.getElementById('exchangeRate');
const discountInput = document.getElementById('discount');
const resultDiv = document.getElementById('result');
const historyTableBody = document.querySelector('#historyTable tbody');
const clearHistoryBtn = document.getElementById('clearHistory');

// Función para calcular precio final con descuento
function calcularPrecioFinal(precio, descuento) {
  return precio - (precio * descuento) / 100;
}

// Validar entradas del formulario
function validarEntradas(precio, tasaCambio, descuento) {
  if (isNaN(precio) || precio <= 0) {
    alert('Por favor, ingresa un precio válido mayor que 0.');
    return false;
  }
  if (isNaN(tasaCambio) || tasaCambio <= 0) {
    alert('Por favor, ingresa una tasa de cambio válida mayor que 0.');
    return false;
  }
  if (isNaN(descuento) || descuento < 0 || descuento > 100) {
    alert('Por favor, ingresa un porcentaje de descuento entre 0 y 100.');
    return false;
  }
  return true;
}

// Guardar historial en localStorage
function guardarHistorial(historial) {
  localStorage.setItem('historialCambioDescuento', JSON.stringify(historial));
}

// Obtener historial desde localStorage
function obtenerHistorial() {
  const historialJSON = localStorage.getItem('historialCambioDescuento');
  return historialJSON ? JSON.parse(historialJSON) : [];
}

// Actualizar tabla historial en el DOM
function actualizarTabla(historial) {
  historyTableBody.innerHTML = '';
  historial.forEach(registro => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>$${registro.precio.toFixed(2)}</td>
      <td>${registro.tasaCambio}</td>
      <td>${registro.descuento}%</td>
      <td>$${registro.precioFinalLocal.toFixed(2)}</td>
      <td>$${registro.precioFinalUSD.toFixed(2)}</td>
      <td>${registro.fecha}</td>
    `;
    historyTableBody.appendChild(tr);
  });
}

// Evento submit del formulario
form.addEventListener('submit', e => {
  e.preventDefault();

  const precio = parseFloat(priceInput.value);
  const tasaCambio = parseFloat(exchangeInput.value);
  const descuento = parseFloat(discountInput.value);

  if (!validarEntradas(precio, tasaCambio, descuento)) return;

  const precioFinalLocal = calcularPrecioFinal(precio, descuento);
  const precioFinalUSD = precioFinalLocal * tasaCambio;

  resultDiv.textContent = `Precio final: $${precioFinalLocal.toFixed(2)} (Local) / $${precioFinalUSD.toFixed(2)} (USD)`;

  const fechaHora = new Date().toLocaleString();

  const nuevoRegistro = {
    precio,
    tasaCambio,
    descuento,
    precioFinalLocal,
    precioFinalUSD,
    fecha: fechaHora,
  };

  // Guardar historial
  const historialActual = obtenerHistorial();
  historialActual.unshift(nuevoRegistro); // Agregar al inicio
  guardarHistorial(historialActual);
  actualizarTabla(historialActual);

  form.reset();
});

// Borrar historial
clearHistoryBtn.addEventListener('click', () => {
  if (confirm('¿Seguro que quieres borrar todo el historial?')) {
    localStorage.removeItem('historialCambioDescuento');
    actualizarTabla([]);
    resultDiv.textContent = '';
  }
});

// Cargar historial al iniciar página
document.addEventListener('DOMContentLoaded', () => {
  const historialGuardado = obtenerHistorial();
  actualizarTabla(historialGuardado);
});
