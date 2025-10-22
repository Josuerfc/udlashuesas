document.addEventListener("DOMContentLoaded", () => {
  // 📱 Menú hamburguesa en móvil
  const toggle = document.getElementById("toggle");
  const menu = document.querySelector(".menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      menu.classList.toggle("active");
    });
    document.querySelectorAll(".menu a").forEach(link => {
      link.addEventListener("click", () => {
        menu.classList.remove("active");
      });
    });
  }

  // 👀 Animación de entrada con IntersectionObserver
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  // Solo observamos elementos con clases de animación
  document.querySelectorAll(".fade-in-up, .fade-in-up-title").forEach(el => {
    observer.observe(el);
  });

  // 📊 Formato automático de resultados en tabla
  const resultadoCeldas = document.querySelectorAll(".fixture td:last-child");
  resultadoCeldas.forEach(celda => {
    const texto = celda.textContent.trim();
    const marcador = texto.match(/(\d+)\s*-\s*(\d+)/);
    if (marcador) {
      const local = parseInt(marcador[1]);
      const visitante = parseInt(marcador[2]);
      if (local > visitante) {
        celda.classList.add("resultado-victoria");
        celda.textContent = `✅ ${texto}`;
      } else if (local < visitante) {
        celda.classList.add("resultado-derrota");
        celda.textContent = `❌ ${texto}`;
      } else {
        celda.classList.add("resultado-empate");
        celda.textContent = `⚪ ${texto}`;
      }
    } else if (texto) {
      celda.classList.add("resultado-empate");
      celda.textContent = `⚪ ${texto}`;
    }
  });

  // 🎠 Carrusel de patrocinadores infinito
  const track = document.getElementById("carouselTrack");
  if (track) {
    const logos = Array.from(track.children);
    const fragment = document.createDocumentFragment();
    logos.forEach(logo => fragment.appendChild(logo.cloneNode(true)));
    track.appendChild(fragment);

    let position = 0;
    const speed = 0.5;
    let isPaused = false;

    function animate() {
      if (!isPaused) {
        position -= speed;
        track.style.transform = `translateX(${position}px)`;
        const resetPoint = track.scrollWidth / 2;
        if (Math.abs(position) >= resetPoint) {
          position = 0;
          track.style.transform = `translateX(0)`;
        }
      }
      requestAnimationFrame(animate);
    }
    animate();

    track.addEventListener("mouseenter", () => isPaused = true);
    track.addEventListener("mouseleave", () => isPaused = false);
    track.addEventListener("touchstart", () => isPaused = true);
    track.addEventListener("touchend", () => isPaused = false);
  }

  // 📅 Calendario con CSV
  const csvFile = "cont/calendario.csv";
  fetch(csvFile)
    .then(r => {
      if (!r.ok) throw new Error("No se pudo cargar el calendario");
      return r.text();
    })
    .then(csv => {
      Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        delimiter: ";",
        transformHeader: h => h.replace(/^\uFEFF/, "").trim().replace(/\s+/g, " "),
        transform: v => (v ?? "").trim(),
        complete: ({ data }) => {
          const tbody = document.querySelector("#tabla-calendario tbody");
          if (!data || data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">No hay partidos programados</td></tr>';
            return;
          }
          const camposEsperados = ["Fecha", "Rival", "Hora", "Campo", "Resultado"];
          data.forEach(row => {
            const tr = document.createElement("tr");
            camposEsperados.forEach(campo => {
              const td = document.createElement("td");
              td.textContent = (row[campo] ?? "");
              tr.appendChild(td);
            });
            tbody.appendChild(tr);
          });
        }
      });
    })
    .catch(err => console.error("Error al cargar el calendario:", err));

  // 📌 Pie de página animado
  const footer = document.querySelector("footer");
  if (footer) {
    const footerObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          footer.classList.add("visible");
          footerObs.unobserve(footer);
        }
      });
    }, { threshold: 0.2 });
    footerObs.observe(footer);
  }

  // 🔝 Botón scroll arriba
  const btnScroll = document.getElementById("btn-scroll-top");
  const seccionInicio = document.getElementById("inicio");
  const seccionSobre = document.getElementById("sobre");

  if (btnScroll && seccionInicio && seccionSobre) {
    const observerSobre = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) btnScroll.classList.add("visible");
      });
    }, { threshold: 0.2 });

    const observerInicio = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) btnScroll.classList.remove("visible");
      });
    }, { threshold: 0.6 });

    observerSobre.observe(seccionSobre);
    observerInicio.observe(seccionInicio);

    btnScroll.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // 📰 Carrusel de noticias (comentado porque lo quitaste del HTML)
  /*
  const trackNoticias = document.querySelector(".carrusel-track");
  if (trackNoticias) {
    const slides = Array.from(trackNoticias.children);
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");
    const lema = document.querySelector(".lema-container");
    let index = 0;

    function mostrarSlide(i) {
      trackNoticias.style.transform = `translateX(-${i * 100}%)`;
    }

    function siguiente() {
      index = (index + 1) % slides.length;
      mostrarSlide(index);
    }

    function anterior() {
      index = (index - 1 + slides.length) % slides.length;
      mostrarSlide(index);
    }

    nextBtn?.addEventListener("click", () => {
      siguiente();
      lema?.classList.add("oculto");
    });

    prevBtn?.addEventListener("click", () => {
      anterior();
      lema?.classList.add("oculto");
    });

    slides.forEach(slide => {
      slide.addEventListener("click", () => lema?.classList.add("oculto"));
    });

    setInterval(siguiente, 5000);

    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) lema?.classList.remove("oculto");
    });
  }
  */
});

fetch('data/noticias.json')
  .then(res => res.json())
  .then(noticias => {
    const principal = document.querySelector('.contenido-noticia');
    const tarjetas = document.querySelector('.tarjetas-noticias');
    const puntos = document.querySelector('.puntos-navegacion');
    const carrusel = document.querySelector('.carrusel-noticias');
    let indice = 0;
    let intervalo;

    function mostrarNoticia(i) {
      const noticia = noticias[i];
      principal.classList.remove('visible');
      setTimeout(() => {
        principal.innerHTML = `
          <h2>${noticia.titulo}</h2>
          <p>${noticia.contenido}</p>
        `;
        principal.classList.add('visible');
        actualizarPuntos(i);
      }, 200);
    }

    function mostrarTarjetas() {
      tarjetas.innerHTML = '';
      noticias.slice(1).forEach(n => {
        const card = document.createElement('article');
        card.className = 'tarjeta';
        card.innerHTML = `<h4>${n.titulo}</h4><p>${n.contenido}</p>`;
        tarjetas.appendChild(card);
      });
    }

    function crearPuntos() {
      puntos.innerHTML = '';
      noticias.forEach((_, i) => {
        const punto = document.createElement('div');
        punto.className = 'punto';
        punto.addEventListener('click', () => {
          indice = i;
          mostrarNoticia(indice);
          reiniciarCarrusel();
        });
        puntos.appendChild(punto);
      });
    }

    function actualizarPuntos(i) {
      document.querySelectorAll('.punto').forEach((p, idx) => {
        p.classList.toggle('activo', idx === i);
      });
    }

    function avanzarCarrusel() {
      indice = (indice + 1) % noticias.length;
      mostrarNoticia(indice);
    }

    function reiniciarCarrusel() {
      clearInterval(intervalo);
      intervalo = setInterval(avanzarCarrusel, 6000);
    }

    document.querySelector('.prev').addEventListener('click', () => {
      indice = (indice - 1 + noticias.length) % noticias.length;
      mostrarNoticia(indice);
      reiniciarCarrusel();
    });

    document.querySelector('.next').addEventListener('click', () => {
      indice = (indice + 1) % noticias.length;
      mostrarNoticia(indice);
      reiniciarCarrusel();
    });

    carrusel.addEventListener('mouseenter', () => {
      clearInterval(intervalo);
    });

    carrusel.addEventListener('mouseleave', () => {
      reiniciarCarrusel();
    });

    crearPuntos();
    mostrarNoticia(indice);
    mostrarTarjetas();
    reiniciarCarrusel();
  });

