/* ==========================================================================
   Dear Blanc Dental Studio · Comportamiento
   Sin dependencias. Todo degrada a HTML utilizable si falla el JS.
   ========================================================================== */
(function () {
  "use strict";

  var C = window.DB || {};
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ==========================================================================
     Intro de marca + revelado del titular
     La portada se va en cuanto la página carga (o a los 2.2 s como red de
     seguridad). No se repite dentro de la misma sesión y no aparece si el
     usuario pidió menos movimiento.
     ========================================================================== */
  var intro = $("#intro");
  var yaVista = (function () {
    try { return sessionStorage.getItem("db-intro") === "1"; } catch (e) { return false; }
  })();

  function revelarTitular() {
    var h = $("[data-reveal]");
    if (!h) return;
    if (reduce) return;
    // Envuelve cada palabra conservando la itálica del marcado original.
    (function envolver(nodo) {
      Array.prototype.slice.call(nodo.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (t) {
            if (!t.trim()) { frag.appendChild(document.createTextNode(t)); return; }
            var w = document.createElement("span"); w.className = "word";
            var inner = document.createElement("span"); inner.textContent = t;
            w.appendChild(inner); frag.appendChild(w);
          });
          nodo.replaceChild(frag, n);
        } else if (n.nodeType === 1) { envolver(n); }
      });
    })(h);

    $$(".word", h).forEach(function (w, i) {
      setTimeout(function () { w.classList.add("is-in"); }, 100 + i * 55);
    });
  }

  if (!intro) {
    revelarTitular();
  } else if (reduce || yaVista) {
    intro.classList.add("intro--skip");
    revelarTitular();
  } else {
    var cerrada = false;
    var cerrarIntro = function () {
      if (cerrada) return;
      cerrada = true;
      intro.setAttribute("data-done", "");
      try { sessionStorage.setItem("db-intro", "1"); } catch (e) {}
      revelarTitular();
      setTimeout(function () { intro.remove(); }, 1300);
    };
    var salvavidas = setTimeout(cerrarIntro, 2200);
    window.addEventListener("load", function () {
      // Deja que la línea dorada termine de dibujarse antes de salir.
      setTimeout(function () { clearTimeout(salvavidas); cerrarIntro(); }, 620);
    });
  }

  /* ---------- Enlaces de WhatsApp ---------- */
  var numeroListo = /^\d{10,15}$/.test(String(C.whatsapp || ""));

  function wa(texto) {
    return "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(texto);
  }

  if (numeroListo) {
    var base = wa(C.mensajeCita);
    var fab = $("#waFab");   if (fab) fab.href = base;
    var fw  = $("#footWa");  if (fw)  { fw.href = base; fw.target = "_blank"; fw.rel = "noopener"; }
    // Ficha de contacto del cierre (lámina 12): muestra el número real.
    var cw  = $("#closeWa");
    if (cw) {
      cw.href = base; cw.target = "_blank"; cw.rel = "noopener";
      cw.textContent = String(C.whatsapp).replace(/^52/, "").replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
    }
  } else {
    // Sin número real configurado: no dejamos enlaces rotos a la vista.
    var fab2 = $("#waFab"); if (fab2) fab2.remove();
    var fw2 = $("#footWa");
    if (fw2) { fw2.replaceWith(Object.assign(document.createElement("span"), { textContent: "WhatsApp por confirmar" })); }
    var cw2 = $("#closeWa");
    if (cw2 && cw2.parentElement) { cw2.parentElement.remove(); }
    console.warn("[Dear Blanc] Falta el número de WhatsApp en js/config.js");
  }

  /* ---------- Doctoralia: se oculta mientras no haya perfil ---------- */
  $$("[data-doctoralia]").forEach(function (el) {
    if (C.doctoralia) { el.href = C.doctoralia; el.target = "_blank"; el.rel = "noopener"; }
    else { el.remove(); }
  });

  /* ---------- Google Maps ---------- */
  var maps = $("#mapsLink"); if (maps && C.maps) maps.href = C.maps;

  var anio = $("#anio"); if (anio) anio.textContent = new Date().getFullYear();

  /* ---------- Menú móvil ---------- */
  var burger = $("#burger"), menu = $("#menu");
  function cerrarMenu() {
    if (!menu) return;
    menu.dataset.open = "false";
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Abrir menú");
  }
  if (burger && menu) {
    burger.addEventListener("click", function () {
      var abierto = menu.dataset.open === "true";
      menu.dataset.open = String(!abierto);
      burger.setAttribute("aria-expanded", String(!abierto));
      burger.setAttribute("aria-label", abierto ? "Abrir menú" : "Cerrar menú");
    });
    $$("a", menu).forEach(function (a) { a.addEventListener("click", cerrarMenu); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.dataset.open === "true") { cerrarMenu(); burger.focus(); }
    });
  }

  /* ==========================================================================
     Barra que acompaña el scroll
     Se compacta al salir del inicio, se retira al bajar y vuelve al subir.
     El estado "arriba del todo" lo decide un IntersectionObserver sobre un
     centinela; la dirección se mide con un listener pasivo throttleado a rAF.
     ========================================================================== */
  var nav = $(".nav");
  var hero = $(".hero");
  if (nav) {
    var centinela = document.createElement("div");
    centinela.setAttribute("aria-hidden", "true");
    centinela.style.cssText = "position:absolute;top:0;left:0;width:1px;height:130px;pointer-events:none";
    document.body.prepend(centinela);

    var arriba = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) {
        arriba = e[0].isIntersecting;
        if (arriba) {
          nav.removeAttribute("data-stuck");
          nav.removeAttribute("data-hidden");
          // Sobre la portada la barra va sin fondo. Es un atributo y no la
          // ausencia de "data-stuck" para que sin JS la barra sea opaca.
          if (hero) nav.setAttribute("data-over", "");
        } else {
          nav.setAttribute("data-stuck", "");
          nav.removeAttribute("data-over");
        }
      }, { threshold: 0 }).observe(centinela);
    }

    var ultimo = window.scrollY, pendiente = false;
    if (!reduce) window.addEventListener("scroll", function () {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(function () {
        pendiente = false;
        var y = window.scrollY;
        var delta = y - ultimo;
        if (Math.abs(delta) < 6) return;          // ignora el temblor del trackpad
        ultimo = y;
        if (menu && menu.dataset.open === "true") return;  // no la escondas con el menú abierto
        if (arriba) { nav.removeAttribute("data-hidden"); return; }
        if (delta > 0) nav.setAttribute("data-hidden", "");
        else nav.removeAttribute("data-hidden");
      });
    }, { passive: true });

    // Al abrir el menú o enfocar dentro de la barra, siempre visible.
    nav.addEventListener("focusin", function () { nav.removeAttribute("data-hidden"); });
    if (burger) burger.addEventListener("click", function () { nav.removeAttribute("data-hidden"); });
  }

  /* ---------- Sección actual en la barra ----------
     "¿Dónde estoy?" La barra ya subraya en hover; el mismo subrayado marca
     la sección en pantalla. Gana la última que cruzó la línea de la barra. */
  (function () {
    var enlaces = $$('.nav__links a[href^="#"], .menu__list a[href^="#"]');
    if (!enlaces.length || !("IntersectionObserver" in window)) return;
    var porId = {};
    enlaces.forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      (porId[id] = porId[id] || []).push(a);
    });
    var orden = Object.keys(porId);
    var visibles = [];
    var obs = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var i = visibles.indexOf(e.target.id);
        if (e.isIntersecting) { if (i < 0) visibles.push(e.target.id); }
        else if (i >= 0) { visibles.splice(i, 1); }
      });
      // Por orden del documento, no por orden de llegada: al subir rápido
      // las entradas llegan desordenadas y parpadearía la sección marcada.
      visibles.sort(function (x, y) { return orden.indexOf(x) - orden.indexOf(y); });
      enlaces.forEach(function (a) { a.removeAttribute("data-current"); });
      var actual = visibles[0];
      if (actual && porId[actual]) porId[actual].forEach(function (a) { a.setAttribute("data-current", ""); });
    }, { rootMargin: "-" + (parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 66) + "px 0px -55% 0px" });
    Object.keys(porId).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) obs.observe(sec);
    });
  })();

  /* El pill de WhatsApp estorba sobre el formulario: se retira mientras la
     agenda está en pantalla, que ahí el destino ya es el mismo. */
  (function () {
    var pill = $("#waFab"), agenda = $("#agenda");
    if (!pill || !agenda || !("IntersectionObserver" in window)) return;
    new IntersectionObserver(function (e) {
      pill.toggleAttribute("data-oculto", e[0].isIntersecting);
    }, { threshold: 0 }).observe(agenda);
  })();

  /* ---------- Revelado al entrar en pantalla ---------- */
  var revelables = $$(".rv");
  if (reduce || !("IntersectionObserver" in window)) {
    revelables.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e, i) {
        if (!e.isIntersecting) return;
        e.target.style.transitionDelay = Math.min(i * 60, 240) + "ms";
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revelables.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Pestañas de tratamientos (patrón WAI-ARIA) ---------- */
  var tabs = $$(".tx__tab");
  function activarTab(tab, enfocar) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute("aria-controls"));
      if (panel) { if (on) panel.setAttribute("data-active", ""); else panel.removeAttribute("data-active"); }
    });
    if (enfocar) {
      tab.focus();
      tab.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduce ? "auto" : "smooth" });
    }
    moverInk();
  }
  /* Subrayado que se desliza bajo la pestaña activa. Se mide después de
     pintar, y se vuelve a medir al redimensionar porque las pestañas
     cambian de ancho entre móvil y escritorio. */
  var ink = $(".tx__ink");
  function moverInk() {
    var on = $('.tx__tab[aria-selected="true"]');
    if (!ink || !on) return;
    ink.style.width = on.offsetWidth + "px";
    ink.style.transform = "translateX(" + on.offsetLeft + "px)";
  }
  if (ink) {
    requestAnimationFrame(moverInk);
    window.addEventListener("resize", moverInk);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(moverInk);
  }

  function recordarTab(tab) {
    if (!history.replaceState) return;
    history.replaceState(null, "", "?tx=" + tab.id.replace("tab-", ""));
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { activarTab(tab, false); recordarTab(tab); });
    tab.addEventListener("keydown", function (e) {
      var k = e.key, n = null;
      if (k === "ArrowRight" || k === "ArrowDown") n = tabs[(i + 1) % tabs.length];
      else if (k === "ArrowLeft" || k === "ArrowUp") n = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (k === "Home") n = tabs[0];
      else if (k === "End") n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); activarTab(n, true); }
    });
  });

  // Al cargar con ?tx=..., abre esa pestaña.
  (function () {
    var q = (location.search.match(/[?&]tx=([\w-]+)/) || [])[1];
    var t = q && document.getElementById("tab-" + q);
    if (t) activarTab(t, false);
  })();

  /* Los enlaces de "¿Qué quieres transformar?" seleccionan la pestaña
     correspondiente antes de que el navegador salte al ancla #tratamientos. */
  $$("[data-tab]").forEach(function (a) {
    a.addEventListener("click", function () {
      var tab = document.getElementById("tab-" + a.dataset.tab);
      if (tab) { activarTab(tab, false); recordarTab(tab); }
    });
  });

  /* ==========================================================================
     20. Tarjetas de tratamiento que se voltean
     Al entrar el bloque en pantalla, las tarjetas giran una tras otra,
     enseñan el reverso y vuelven. Es una pasada, no un bucle: repetirla
     sin parar convierte la sección en un letrero luminoso.

     Después el control es de quien mira. Con cursor manda el hover (CSS);
     con el dedo, el botón que cubre la tarjeta.
     ========================================================================== */
  (function () {
    var rejillas = $$(".svcs");
    if (!rejillas.length) return;

    // Toque y teclado: voltear y desvoltear.
    $$(".svc__girar").forEach(function (b) {
      b.addEventListener("click", function () {
        var card = b.closest(".svc");
        if (card.hasAttribute("data-flip")) card.removeAttribute("data-flip");
        else card.setAttribute("data-flip", "");
      });
    });
    // Con el reverso a la vista el botón desaparece; se vuelve con Escape
    // o al salir el foco de la tarjeta.
    $$(".svc").forEach(function (card) {
      card.addEventListener("keydown", function (e) {
        if (e.key === "Escape") card.removeAttribute("data-flip");
      });
    });

    if (reduce) return;   // sin pasada automática si se pidió menos movimiento

    /* Antes giraban las diez a la vez en cuanto la rejilla asomaba, y en
       menos de tres segundos ya había terminado todo. Ahora cada tarjeta se
       voltea cuando le toca a ella entrar en pantalla: el que baja marca el
       ritmo, y el reverso se queda el tiempo suficiente para leerlo. */
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        var card = e.target;
        io.unobserve(card);                       // una sola vez por tarjeta
        var t1 = setTimeout(function () { card.setAttribute("data-flip", ""); }, 420);
        var t2 = setTimeout(function () { card.removeAttribute("data-flip"); }, 3600);
        // Si alguien la toca a media pasada, se cancela y el control es suyo.
        card.addEventListener("pointerdown", function () {
          clearTimeout(t1); clearTimeout(t2);
        }, { once: true });
      });
    }, { threshold: .55 });

    $$(".svc").forEach(function (c) { io.observe(c); });
  })();

  /* ---------- "Consultar precio": un solo toque abre WhatsApp ----------
     En el sitio no se publican precios. El botón de cada tarjeta manda el
     nombre del tratamiento ya escrito para que la respuesta sea directa. */
  $$("[data-precio]").forEach(function (a) {
    if (!numeroListo) return;
    a.href = wa(
      "Hola, vi " + a.dataset.nombre + " en el sitio de Dear Blanc Dental Studio. " +
      "¿Me pueden compartir el precio y agendar una valoración?"
    );
    a.target = "_blank"; a.rel = "noopener";
  });

  /* Botones de WhatsApp directo repartidos por la página. */
  $$("[data-wa-directo]").forEach(function (a) {
    if (!numeroListo) return;
    a.href = wa(a.dataset.motivo === "valoracion"
      ? "Hola, quiero agendar mi valoración en Dear Blanc Dental Studio."
      : C.mensajeCita);
    a.target = "_blank"; a.rel = "noopener";
  });

  /* ==========================================================================
     21. Equipo: tarjetas que rotan solas
     Sin foto todavía, se dibuja un avatar con iniciales. La rotación se
     detiene al pasar el cursor, al enfocar con teclado y con
     prefers-reduced-motion.
     ========================================================================== */
  (function () {
    var stage = $("#teamStage"), dots = $("#teamDots");
    var gente = C.equipo || [];
    if (!stage || !gente.length) { var t = $("#equipo"); if (t) t.remove(); return; }

    var iniciales = function (n) {
      return n.split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join("").toUpperCase();
    };

    gente.forEach(function (p, i) {
      var card = document.createElement("article");
      card.className = "team__card";
      card.setAttribute("aria-hidden", i ? "true" : "false");
      if (!i) card.setAttribute("data-on", "");
      card.innerHTML =
        '<div class="team__shot">' +
          (p.foto
            ? '<img src="' + p.foto + '" alt="' + p.nombre + '" loading="lazy" decoding="async">'
            : '<span class="team__ini" aria-hidden="true">' + iniciales(p.nombre) + '</span>') +
        '</div>' +
        '<div class="team__meta"><h3>' + p.nombre + '</h3><p>' + p.area + '</p></div>';
      stage.appendChild(card);

      var d = document.createElement("button");
      d.type = "button"; d.className = "team__dot"; d.setAttribute("role", "tab");
      d.setAttribute("aria-label", p.nombre);
      d.setAttribute("aria-selected", i ? "false" : "true");
      d.addEventListener("click", function () { ir(i); reiniciar(); });
      dots.appendChild(d);
    });

    var cards = $$(".team__card", stage), puntos = $$(".team__dot", dots), n = 0, timer = null;

    function ir(i) {
      n = (i + cards.length) % cards.length;
      cards.forEach(function (c, k) {
        if (k === n) c.setAttribute("data-on", ""); else c.removeAttribute("data-on");
        c.setAttribute("aria-hidden", k === n ? "false" : "true");
      });
      puntos.forEach(function (d, k) { d.setAttribute("aria-selected", k === n ? "true" : "false"); });
    }
    function reiniciar() {
      clearInterval(timer);
      if (reduce) return;
      timer = setInterval(function () { ir(n + 1); }, 4200);
    }

    $$("[data-team]").forEach(function (b) {
      b.addEventListener("click", function () { ir(n + (b.dataset.team === "next" ? 1 : -1)); reiniciar(); });
    });
    var box = $("#equipo");
    box.addEventListener("mouseenter", function () { clearInterval(timer); });
    box.addEventListener("mouseleave", reiniciar);
    box.addEventListener("focusin",  function () { clearInterval(timer); });
    box.addEventListener("focusout", reiniciar);
    reiniciar();
  })();

  /* ==========================================================================
     22. Agenda en dos pasos (tres clics hasta WhatsApp)
     Tocas tratamiento -> avanza solo. Tocas horario -> se arma el resumen.
     Tocas enviar -> se abre WhatsApp. No pedimos nombre: eso se resuelve en
     la conversación y cada campo extra costaba un clic más.
     ========================================================================== */
  var form = $("#agendaForm");
  if (!form) return;

  var estado = { tratamiento: null, horario: null };
  var pasos = $$(".step", form);
  var puntos = $$(".dots span", form);
  var actual = 1;

  function pintarOpciones(contenedor, datos, campo, alElegir) {
    contenedor.innerHTML = "";
    datos.forEach(function (o) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "pick";
      b.setAttribute("aria-pressed", "false");
      b.dataset.id = o.id;
      b.innerHTML = o.nombre + (o.nota ? "<small>" + o.nota + "</small>" : "");
      b.addEventListener("click", function () {
        $$(".pick", contenedor).forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        estado[campo] = o;
        var err = contenedor.parentNode.querySelector(".err");
        if (err) err.style.display = "none";
        if (alElegir) alElegir();
      });
      contenedor.appendChild(b);
    });
  }

  pintarOpciones($("#pickTratamiento"), C.tratamientos || [], "tratamiento", function () { irA(2); });
  pintarOpciones($("#pickHorario"), C.horarios || [], "horario", pintarResumen);

  function irA(n) {
    actual = n;
    pasos.forEach(function (p) {
      if (Number(p.dataset.step) === n) p.setAttribute("data-active", "");
      else p.removeAttribute("data-active");
    });
    puntos.forEach(function (d, i) {
      if (i < n) d.setAttribute("data-on", ""); else d.removeAttribute("data-on");
    });
    if (n === 2) pintarResumen();
    var foco = $(".step[data-active] h3", form);
    if (foco) { foco.setAttribute("tabindex", "-1"); foco.focus({ preventScroll: true }); }
  }

  function pintarResumen() {
    var r = $("#resumen");
    if (!r) return;
    r.innerHTML =
      "<dl>" +
      "<dt>Tratamiento</dt><dd>" + (estado.tratamiento ? estado.tratamiento.nombre : "Por definir") + "</dd>" +
      "<dt>Horario</dt><dd>" + (estado.horario ? estado.horario.nombre + " (" + estado.horario.nota + ")" : "Por definir") + "</dd>" +
      "</dl>";
  }

  $$("[data-prev]", form).forEach(function (b) {
    b.addEventListener("click", function () { irA(Math.max(1, actual - 1)); });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!estado.horario) {
      var err = $("#errHorario");
      if (err) err.style.display = "block";
      return;
    }
    var texto =
      "Hola, quiero agendar una valoración en Dear Blanc Dental Studio.\n" +
      "Tratamiento: " + (estado.tratamiento ? estado.tratamiento.nombre : "Por definir") + "\n" +
      "Horario que me acomoda: " + estado.horario.nombre + " (" + estado.horario.nota + ")";

    if (!numeroListo) {
      console.warn("[Dear Blanc] Falta el número de WhatsApp. Mensaje:\n" + texto);
      return;
    }
    window.open(wa(texto), "_blank", "noopener");
  });

})();
