document.getElementById("startButton").addEventListener("click", startScanner);
let closeButton = document.getElementById("closeButton");

let scanner; // Variable global para almacenar el escáner

function startScanner() {
  document.getElementById("datos").style.display = "none"; // Muestra el lector
  document.getElementById("contenedorCamara").style.display = "block"; // Muestra el lector
  closeButton.addEventListener("click", closeScanner);

  scanner = new Html5QrcodeScanner("reader", {
    qrbox: {
      width: 300,
      height: 200,
    },
    fps: 20,
  });
  scanner.render(success, error);
}

function success(result) {
  document.getElementById("contenedorCamara").style.display = "none"; // Oculta el lector después del éxito
  document.getElementById("datos").style.display = "block"; // Muestra el lector

  // Verificar si el resultado contiene 8 '@'
  const atIndex = result.indexOf("@");
  const count = result.split("@").length - 1;
  if (count !== 8 || atIndex === -1) {
    // Mostrar mensaje de error si no hay 8 '@' o no se encuentra ninguno
    document.getElementById("result").innerHTML = "No es un DNI válido.";
    setTimeout(function () {
      document.getElementById("result").innerHTML = "";
    }, 3000);
    scanner.clear();
    return;
  }

  // Dividir los datos por el caracter '@'
  const data = result.split("@");

  // Crear el objeto con los campos requeridos
  const dniObj = {
    apellido: data[1],
    nombre: data[2],
    sexo: data[3],
    dni: data[4],
    fechaNacimiento: data[6],
    edad: calcularEdad(data[6]), // Calcular la edad usando la función calcularEdad()
  };

  document.getElementById("inputApellido").value = dniObj.apellido;
  document.getElementById("inputEdad").value = dniObj.edad;
  document.getElementById("inputDNI").value = dniObj.dni;
  document.getElementById("inputNombre").value = dniObj.nombre;
  if (dniObj.sexo == "M") {
    document.getElementById("selectSexo").value = "Masculino";
  } else {
    document.getElementById("selectSexo").value = "Femenino";
  }

  const parts = dniObj.fechaNacimiento.split("/");
  const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
  document.getElementById("inputFechaNacimiento").value = formattedDate;
  // Detener el escáner y ocultar el lector
  scanner.clear();
  document.getElementById("contenedorCamara").style.display = "none";
}
// Función para calcular la edad a partir de una fecha de nacimiento (en formato dd/mm/yyyy)
function calcularEdad(fechaNacimiento) {
  const hoy = new Date();
  const partesFecha = fechaNacimiento.split("/"); // Dividir la fecha en partes (día, mes, año)
  const fechaNac = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]); // Crear objeto Date con el año, mes y día invertidos
  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  const mes = hoy.getMonth() - fechaNac.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
    edad--;
  }
  return edad;
}

function error(err) {
  console.error(err);
}

function closeScanner() {
  scanner.clear();
  document.getElementById("contenedorCamara").style.display = "none"; // Oculta el lector cuando se hace clic en el botón "X"
  document.getElementById("datos").style.display = "block"; // Muestra el lector
}
