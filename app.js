document.addEventListener("DOMContentLoaded", () => {
    // Proteger acceso si no ha iniciado sesión
    if (!localStorage.getItem("logueado")) {
        window.location.href = "index.html";
        return;
    }

    const formulario = document.getElementById("formulario");
    const tablaCard = document.getElementById("tablaCard");
    const toggleTabla = document.getElementById("toggleTabla");

    // Ocultar tabla al inicio
    if (tablaCard) tablaCard.style.display = "none";

    // Mostrar/ocultar la tabla
    if (toggleTabla) {
        toggleTabla.addEventListener("click", () => {
            tablaCard.style.display = (tablaCard.style.display === "none") ? "block" : "none";
        });
    }

    // Evento para calcular y registrar
    formulario.addEventListener("submit", (e) => {
        e.preventDefault();

        const monto = parseFloat(document.getElementById("monto").value);
        const conversion = parseFloat(document.getElementById("conversion").value);

        if (isNaN(monto) || monto <= 0 || isNaN(conversion) || conversion <= 0) {
            alert("Por favor ingresa valores válidos.");
            return;
        }

        const fecha = obtenerFechaActual();

        // Cálculos originales
        const deduccion21 = monto * 0.21;
        const restante21 = monto - deduccion21;
        const deduccion4 = restante21 * 0.04;
        const restanteFinal = restante21 - deduccion4;

        // Cálculos convertidos
        const montoConvertido = monto / conversion;
        const deduccion21Conv = montoConvertido * 0.21;
        const restante21Conv = montoConvertido - deduccion21Conv;
        const deduccion4Conv = restante21Conv * 0.04;
        const restanteFinalConv = restante21Conv - deduccion4Conv;

        const nuevoRegistro = {
            fecha,
            montoInicial: monto.toFixed(2),
            deduccion21: deduccion21.toFixed(2),
            restante21: restante21.toFixed(2),
            deduccion4: deduccion4.toFixed(2),
            restanteFinal: restanteFinal.toFixed(2),
            montoConvertido: montoConvertido.toFixed(2),
            deduccion21Convertido: deduccion21Conv.toFixed(2),
            restante21Convertido: restante21Conv.toFixed(2),
            deduccion4Convertido: deduccion4Conv.toFixed(2),
            restanteFinalConvertido: restanteFinalConv.toFixed(2)
        };

        let registros = JSON.parse(localStorage.getItem("registros")) || [];
        registros.push(nuevoRegistro);
        localStorage.setItem("registros", JSON.stringify(registros));

        actualizarTabla();
        formulario.reset();
    });

    actualizarTabla(); // Mostrar datos al cargar
});

// Utilidades
function obtenerFechaActual() {
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const año = fecha.getFullYear();
    const horas = String(fecha.getHours()).padStart(2, "0");
    const minutos = String(fecha.getMinutes()).padStart(2, "0");
    return `${año}-${mes}-${dia} ${horas}:${minutos}`;
}

function agregarFilaTabla(registro, index) {
    const tabla = document.querySelector("#tablaResultados tbody");

    const filaOriginal = tabla.insertRow();
    filaOriginal.innerHTML = `
        <td>${registro.fecha}</td>
        <td>$${registro.montoInicial}</td>
        <td>$${registro.deduccion21}</td>
        <td>$${registro.restante21}</td>
        <td>$${registro.deduccion4}</td>
        <td>$${registro.restanteFinal}</td>
        <td>
            <button onclick="editarRegistro(${index})">Editar</button>
            <button onclick="eliminarRegistro(${index})">Eliminar</button>
        </td>
    `;
    filaOriginal.style.fontWeight = "bold";
    filaOriginal.style.backgroundColor = "#e6f7ff";

    const filaConvertida = tabla.insertRow();
    filaConvertida.innerHTML = `
        <td>${registro.fecha}</td>
        <td>$${registro.montoConvertido} (Conv.)</td>
        <td>$${registro.deduccion21Convertido}</td>
        <td>$${registro.restante21Convertido}</td>
        <td>$${registro.deduccion4Convertido}</td>
        <td>$${registro.restanteFinalConvertido}</td>
        <td></td>
    `;
    filaConvertida.style.fontStyle = "italic";
    filaConvertida.style.backgroundColor = "#f9f9f9";
}

function actualizarTabla() {
    const tabla = document.querySelector("#tablaResultados tbody");
    tabla.innerHTML = "";

    let registros = JSON.parse(localStorage.getItem("registros")) || [];
    registros.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    registros.forEach((registro, index) => {
        agregarFilaTabla(registro, index);
    });
}

function eliminarRegistro(index) {
    let registros = JSON.parse(localStorage.getItem("registros")) || [];
    registros.splice(index, 1);
    localStorage.setItem("registros", JSON.stringify(registros));
    actualizarTabla();
}

function editarRegistro(index) {
    let registros = JSON.parse(localStorage.getItem("registros")) || [];
    let registro = registros[index];

    let nuevoMonto = parseFloat(prompt("Nuevo monto:", registro.montoInicial));
    let nuevaConversion = parseFloat(prompt("Nuevo valor de conversión:", registro.montoInicial / registro.montoConvertido));

    if (!isNaN(nuevoMonto) && !isNaN(nuevaConversion)) {
        const deduccion21 = nuevoMonto * 0.21;
        const restante21 = nuevoMonto - deduccion21;
        const deduccion4 = restante21 * 0.04;
        const restanteFinal = restante21 - deduccion4;

        const montoConvertido = nuevoMonto / nuevaConversion;
        const deduccion21Conv = montoConvertido * 0.21;
        const restante21Conv = montoConvertido - deduccion21Conv;
        const deduccion4Conv = restante21Conv * 0.04;
        const restanteFinalConv = restante21Conv - deduccion4Conv;

        registros[index] = {
            ...registro,
            fecha: obtenerFechaActual(),
            montoInicial: nuevoMonto.toFixed(2),
            deduccion21: deduccion21.toFixed(2),
            restante21: restante21.toFixed(2),
            deduccion4: deduccion4.toFixed(2),
            restanteFinal: restanteFinal.toFixed(2),
            montoConvertido: montoConvertido.toFixed(2),
            deduccion21Convertido: deduccion21Conv.toFixed(2),
            restante21Convertido: restante21Conv.toFixed(2),
            deduccion4Convertido: deduccion4Conv.toFixed(2),
            restanteFinalConvertido: restanteFinalConv.toFixed(2)
        };

        localStorage.setItem("registros", JSON.stringify(registros));
        actualizarTabla();
    } else {
        alert("Valores no válidos. No se realizó ninguna modificación.");
    }
}

function cerrarSesion() {
    localStorage.removeItem("logueado");
    window.location.href = "index.html";
}
