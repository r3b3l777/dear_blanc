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
      setTimeout(function () { w.classList.add("is-in"); }, 120 + i * 80);
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
  } else {
    // Sin número real configurado: no dejamos enlaces rotos a la vista.
    var fab2 = $("#waFab"); if (fab2) fab2.remove();
    var fw2 = $("#footWa");
    if (fw2) { fw2.replaceWith(Object.assign(document.createElement("span"), { textContent: "WhatsApp por confirmar" })); }
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
  if (nav && !reduce) {
    var centinela = document.createElement("div");
    centinela.setAttribute("aria-hidden", "true");
    centinela.style.cssText = "position:absolute;top:0;left:0;width:1px;height:130px;pointer-events:none";
    document.body.prepend(centinela);

    var arriba = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) {
        arriba = e[0].isIntersecting;
        if (arriba) { nav.removeAttribute("data-stuck"); nav.removeAttribute("data-hidden"); }
        else { nav.setAttribute("data-stuck", ""); }
      }, { threshold: 0 }).observe(centinela);
    }

    var ultimo = window.scrollY, pendiente = false;
    window.addEventListener("scroll", function () {
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
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { activarTab(tab, false); });
    tab.addEventListener("keydown", function (e) {
      var k = e.key, n = null;
      if (k === "ArrowRight" || k === "ArrowDown") n = tabs[(i + 1) % tabs.length];
      else if (k === "ArrowLeft" || k === "ArrowUp") n = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (k === "Home") n = tabs[0];
      else if (k === "End") n = tabs[tabs.length - 1];
      if (n) { e.preventDefault(); activarTab(n, true); }
    });
  });

  /* Los enlaces de "¿Qué quieres transformar?" seleccionan la pestaña
     correspondiente antes de que el navegador salte al ancla #tratamientos. */
  $$("[data-tab]").forEach(function (a) {
    a.addEventListener("click", function () {
      var tab = document.getElementById("tab-" + a.dataset.tab);
      if (tab) activarTab(tab, false);
    });
  });

  /* ==========================================================================
     Agenda en 3 pasos
     ========================================================================== */
  var form = $("#agendaForm");
  if (!form) return;

  var estado = { tratamiento: null, horario: null };
  var pasos = $$(".step", form);
  var puntos = $$(".dots span", form);
  var actual = 1;

  function pintarOpciones(contenedor, datos, campo) {
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
      });
      contenedor.appendChild(b);
    });
  }

  pintarOpciones($("#pickTratamiento"), C.tratamientos || [], "tratamiento");
  pintarOpciones($("#pickHorario"), C.horarios || [], "horario");

  function irA(n) {
    actual = n;
    pasos.forEach(function (p) {
      if (Number(p.dataset.step) === n) p.setAttribute("data-active", "");
      else p.removeAttribute("data-active");
    });
    puntos.forEach(function (d, i) {
      if (i < n) d.setAttribute("data-on", ""); else d.removeAttribute("data-on");
    });
    if (n === 3) pintarResumen();
    var foco = $(".step[data-active] h3", form);
    if (foco) { foco.setAttribute("tabindex", "-1"); foco.focus({ preventScroll: true }); }
  }

  function pintarResumen() {
    var r = $("#resumen");
    r.innerHTML =
      "<dl>" +
      "<dt>Tratamiento</dt><dd>" + (estado.tratamiento ? estado.tratamiento.nombre : "Por definir") + "</dd>" +
      "<dt>Horario</dt><dd>" + (estado.horario ? estado.horario.nombre + " (" + estado.horario.nota + ")" : "Por definir") + "</dd>" +
      "</dl>";
  }

  function mostrarError(id) {
    var e = document.getElementById(id);
    if (e) { e.style.display = "block"; }
  }

  $$("[data-next]", form).forEach(function (b) {
    b.addEventListener("click", function () {
      if (actual === 1 && !estado.tratamiento) return mostrarError("errTratamiento");
      if (actual === 2 && !estado.horario) return mostrarError("errHorario");
      irA(actual + 1);
    });
  });
  $$("[data-prev]", form).forEach(function (b) {
    b.addEventListener("click", function () { irA(Math.max(1, actual - 1)); });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var nombre = $("#nombre").value.trim();
    var campoNombre = $("#fNombre");
    if (nombre.length < 2) {
      campoNombre.setAttribute("data-invalid", "");
      $("#nombre").focus();
      return;
    }
    campoNombre.removeAttribute("data-invalid");

    var extra = $("#mensaje").value.trim();
    var texto =
      "Hola, soy " + nombre + ". Me gustaría agendar una valoración en Dear Blanc Dental Studio.\n" +
      "Tratamiento: " + (estado.tratamiento ? estado.tratamiento.nombre : "Por definir") + "\n" +
      "Horario que me acomoda: " + (estado.horario ? estado.horario.nombre + " (" + estado.horario.nota + ")" : "Flexible") +
      (extra ? "\nNota: " + extra : "");

    if (!numeroListo) {
      alert("El número de WhatsApp todavía no está configurado en js/config.js.\n\nMensaje que se enviaría:\n\n" + texto);
      return;
    }
    window.open(wa(texto), "_blank", "noopener");
  });

  /* Los botones "Agendar este tratamiento" preseleccionan el paso 1. */
  $$("[data-agenda]").forEach(function (a) {
    a.addEventListener("click", function () {
      var b = $('#pickTratamiento .pick[data-id="' + a.dataset.agenda + '"]');
      if (b) b.click();
      irA(2);
    });
  });
})();
