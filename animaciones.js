document.addEventListener("DOMContentLoaded", function () {

    let indice = 0;
    const fotos = document.querySelectorAll(".foto");

    function cambiarFoto(direccion) {

        fotos[indice].classList.remove("activa");

        indice += direccion;

        if (indice >= fotos.length) {
            indice = 0;
        }

        if (indice < 0) {
            indice = fotos.length - 1;
        }

        fotos[indice].classList.add("activa");
    }

    window.cambiarFoto = cambiarFoto;

    setInterval(function () {
        cambiarFoto(1);
    }, 3000);

});



/* galeria */

/* ==========================
   1. SELECCIONAR ELEMENTOS
========================== */

const gallery = document.getElementById("gallery");
const galleryItems = [...gallery.querySelectorAll(".gallery-item")];

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxCategory = document.getElementById("lightboxCategory");
const lightboxCounter = document.getElementById("lightboxCounter");

const closeButton = document.getElementById("closeLightbox");
const prevButton = document.getElementById("prevImage");
const nextButton = document.getElementById("nextImage");
const photoCount = document.getElementById("photoCount");

let currentIndex = 0;
let lastFocusedElement = null;

/* ==========================
   2. CONTADOR DE FOTOGRAFÍAS
========================== */

photoCount.textContent =
  `${galleryItems.length} ${galleryItems.length === 1
    ? "fotografía"
    : "fotografías"}`;

/* ==========================
   3. ABRIR EL LIGHTBOX
========================== */

function openLightbox(index) {
  currentIndex = index;
  lastFocusedElement = document.activeElement;

  updateLightbox();

  lightbox.classList.add("active");
  lightbox.removeAttribute("inert");
  lightbox.setAttribute("aria-hidden", "false");

  document.body.classList.add("lightbox-open");

  closeButton.focus();
}

/* ==========================
   4. ACTUALIZAR LA IMAGEN
========================== */

function updateLightbox() {
  const item = galleryItems[currentIndex];
  const thumbnail = item.querySelector("img");

  lightboxImage.src = thumbnail.src;
  lightboxImage.alt = thumbnail.alt;

  lightboxTitle.textContent =
    item.dataset.title || thumbnail.alt;

  lightboxCategory.textContent =
    item.dataset.category || "Fotografía";

  lightboxCounter.textContent =
    `${currentIndex + 1} / ${galleryItems.length}`;

  // Reiniciar la animación de entrada.
  lightboxImage.style.animation = "none";
  void lightboxImage.offsetWidth;
  lightboxImage.style.animation = "";
}

/* ==========================
   5. NAVEGAR ENTRE IMÁGENES
========================== */

function showNextImage() {
  currentIndex = (currentIndex + 1) % galleryItems.length;
  updateLightbox();
}

function showPreviousImage() {
  currentIndex =
    (currentIndex - 1 + galleryItems.length) % galleryItems.length;

  updateLightbox();
}

/* ==========================
   6. CERRAR EL LIGHTBOX
========================== */

function closeLightbox() {
  if (!lightbox.classList.contains("active")) return;

  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
  lightbox.setAttribute("inert", "");

  document.body.classList.remove("lightbox-open");

  // Devolver el foco a la fotografía seleccionada.
  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

/* ==========================
   7. EVENTOS DE LA GALERÍA
========================== */

galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    openLightbox(index);
  });
});

closeButton.addEventListener("click", closeLightbox);

nextButton.addEventListener("click", showNextImage);

prevButton.addEventListener("click", showPreviousImage);

// Cerrar cuando se hace clic en el fondo oscuro.
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

/* ==========================
   8. CONTROLES DEL TECLADO
========================== */

document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("active")) return;

  switch (event.key) {
    case "Escape":
      closeLightbox();
      break;

    case "ArrowRight":
      showNextImage();
      break;

    case "ArrowLeft":
      showPreviousImage();
      break;
  }
});
