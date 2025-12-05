const $anhoActual = document.getElementById('anhoActual');
const $body = document.getElementById('body');
const $listaNav = document.querySelectorAll('.nav_ul a[href^="#"]');
const $btnDarkMode = document.getElementById('botonModoOscuro');

/* cambio de visualizacion*/
window.addEventListener('scroll', ()=>{
	$body.classList.toggle('scroll', window.scrollY > 20)
})

const temaGuardado = localStorage.getItem("theme");

/* modo oscuro*/
const modClaro =()=>{
	localStorage.setItem("theme", "light")
	$btnDarkMode.classList.add("fa-regular")
	$btnDarkMode.classList.add("fa-moon")
	$btnDarkMode.classList.remove("fa-solid")
	$btnDarkMode.classList.remove("fa-sun")
	$body.classList.remove("dark")
}
const modOscuro =()=>{
	localStorage.setItem("theme", "dark")
	$btnDarkMode.classList.remove("fa-regular")
	$btnDarkMode.classList.remove("fa-moon")
	$btnDarkMode.classList.add("fa-solid")
	$btnDarkMode.classList.add("fa-sun")
	$body.classList.add("dark")
}

// Recordar preferencia de modo
if (temaGuardado === "dark") {
  modOscuro();
} else if (temaGuardado === "light") {
  modClaro();
} else {
  // Si no hay preferencia guardada, usar la del sistema
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    modOscuro();
  } else {
    modClaro();
  }
}
// Escuchar cambios del sistema
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {e.matches ? modOscuro() : modClaro();});
// Alternar manualmente
$btnDarkMode.addEventListener('click', ()=> {if($body.classList.contains("dark")){modClaro()}else{ modOscuro()}})

// //Actualizar Año
$anhoActual.innerHTML = new Date().getFullYear();

/*barra navegacion*/
const observer = new IntersectionObserver(
	(entries) => {
		entries.forEach(entry => {
			const id = entry.target.getAttribute("id");
			const menuLink = document.querySelector(`.nav_ul a[href="#${id}"]`);

			if (entry.isIntersecting) {
				menuLink.classList.add("active");
			}
			else {
				menuLink.classList.remove("active");
			}
		})
	},
    { rootMargin: "-30% 0px -70% 0px" }
);
$listaNav.forEach(menuLink => {
	const hash = menuLink.getAttribute("href");
	const target = document.querySelector(hash);
	if (target) {
		observer.observe(target);
	}
});

const $galeria_mockup = document.querySelector(".carrusel_imagenes");
const cantidad = 12;
let rutas = [];
let indiceActual = 0;
let imagenesVisibles = 2; // Puedes cambiar a 2 o 3

function detectarVisibles() {
  const ancho = window.innerWidth;
  const antes = imagenesVisibles;

	if (ancho < 650) imagenesVisibles = 1;
	else if (ancho < 1950) imagenesVisibles = 2;
	else imagenesVisibles = 3;
}

detectarVisibles()

function verificarImagen(ruta) {
  return fetch(ruta, { method: 'HEAD' })
    .then(res => res.ok ? ruta : null)
    .catch(() => null);
}

async function generarRutasMockups() {
  const promesas = [];

  for (let i = 1; i <= cantidad; i++) {
    const ruta = `./assets/imagenes/servicios/servicios (${i}).jpg`;
    promesas.push(verificarImagen(ruta));
  }

  const resultados = await Promise.all(promesas);
  rutas = resultados.filter(r => r !== null);

  if (rutas.length > 0) {
    mostrarCarrusel();
  }
}

function mostrarCarrusel() {
  $galeria_mockup.innerHTML = "";

  rutas.forEach(ruta => {
    const img = document.createElement("img");
    img.src = ruta;
    img.alt = "Servicio";
    img.classList.add("mockup_img");
    img.style.width = `${100 / imagenesVisibles}%`; // Distribuye el espacio
    $galeria_mockup.appendChild(img);
  });

  actualizarCarrusel();
}

function actualizarCarrusel() {
  const porcentaje = (100 / imagenesVisibles) * indiceActual;
  $galeria_mockup.style.transform = `translateX(-${porcentaje}%)`;
}

document.getElementById("prev").addEventListener("click", () => {
  indiceActual--;
  if (indiceActual < 0) {
    indiceActual = rutas.length - imagenesVisibles;
  }
  actualizarCarrusel();
});

document.getElementById("next").addEventListener("click", () => {
  indiceActual++;
  if (indiceActual > rutas.length - imagenesVisibles) {
    indiceActual = 0;
  }
  actualizarCarrusel();
});

document.addEventListener("DOMContentLoaded", () => {
  generarRutasMockups();
  detectarVisibles();
});

window.addEventListener("resize", () => {
  detectarVisibles();
  mostrarCarrusel(); // recalcula tamaños y re-renderiza
});
