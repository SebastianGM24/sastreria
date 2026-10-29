/* =========================================================
   MARTÍNEZ-PEÑALVER · Trajes — main.js
   ========================================================= */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var WA_NUMBER = '34626839938';            // WhatsApp de la tienda
  var IMG_PATH = 'img/';                 // carpeta de imágenes
  var IMG_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG', '.WEBP'];
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------------------------------------------------
     FOTOS: hueco de la web → archivo de /img (sin extensión)
     Para cambiar una foto, cambia el nombre de la derecha.
     --------------------------------------------------------- */
  var SLOTS = {
    'hero-1': 'imagen13',
    'hero-2': 'imagen14',
    'hero-3': 'imagen6',
    'oferta': 'imagen1',
    'camiseria': 'imagen1 blancoynegro',
    'cat-trajes': 'imagen8',
    'cat-chaques': 'imagen12',
    'cat-complementos': 'imagen2',
    'guia-chaque': 'imagen4',
    'guia-traje': 'imagen11',
    'prod-chaque-negro': 'imagen12',
    'prod-chaque-azul': 'imagen11',
    'prod-chaque-gris': 'imagen3',
    'prod-traje-azul': 'imagen8',
    'prod-traje-beige': 'imagen10',
    'prod-traje-burdeos': 'imagen9',
    'prod-traje-cruzado': 'imagen5',
    'prod-traje-cuadros': 'imagen6',
    'prod-pajaritas': 'imagen2',
    'prod-tirantes': 'imagen2 blancoynegro',
    'prod-camisa': 'imagen10',
    'prod-corbatas': 'imagen6 blanco y negro',
    'prod-panuelos': 'imagen3 blancoynegro'
  };

  /* Punto de enfoque de cada foto (para que no se corten las caras).
     Formato CSS: 'horizontal vertical'. Por defecto: 'center 20%'. */
  var FOCUS = {
    'imagen1': 'center 40%',
    'imagen1 blancoynegro': 'center 18%',
    'imagen2': 'center 35%',
    'imagen2 blancoynegro': 'center 30%',
    'imagen3': 'center 30%',
    'imagen3 blancoynegro': 'center 50%',
    'imagen4': 'center 30%',
    'imagen5': 'center 22%',
    'imagen6': 'center 45%',
    'imagen6 blanco y negro': 'center 20%',
    'imagen7': 'center 28%',
    'imagen8': 'center 28%',
    'imagen9': 'center 45%',
    'imagen10': 'center 30%',
    'imagen11': 'center 22%',
    'imagen12': 'center 22%',
    'imagen13': 'center 50%',
    'imagen14': 'center 38%'
  };

  var SIL = '<svg class="sil" viewBox="0 0 120 150" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M42 6l-26 14-10 44 16 6 4 62h28V30z"/><path d="M78 6l26 14 10 44-16 6-4 62H66V30z"/>' +
    '<path d="M42 6l18 34 18-34"/><path d="M60 40v100"/><circle cx="60" cy="88" r="1.8" fill="currentColor"/><circle cx="60" cy="108" r="1.8" fill="currentColor"/></svg>';

  var money = function (n) { return n.toLocaleString('es-ES') + ' €'; };

  /* ---------------------------------------------------------
     Carga de imágenes: prueba extensiones y variantes del nombre
     (con espacios, sin espacios, con _ o -). Si no hay foto, usa
     el recorte con el nombre del hueco y, si no, un fondo de color.
     --------------------------------------------------------- */
  var imgCache = {};
  function baseOf(slot) { return SLOTS[slot] || slot; }
  function candidates(slot) {
    var file = baseOf(slot);
    var bases = [file];
    if (/\s/.test(file)) {
      bases.push(file.replace(/\s+/g, ''), file.replace(/\s+/g, '_'), file.replace(/\s+/g, '-'));
    }
    if (file !== slot) bases.push(slot);
    var out = [];
    bases.forEach(function (b) {
      IMG_EXTS.forEach(function (e) { out.push(IMG_PATH + encodeURIComponent(b) + e); });
    });
    return out;
  }
  function resolveSlot(slot) {
    if (imgCache[slot]) return imgCache[slot];
    var list = candidates(slot);
    imgCache[slot] = new Promise(function (resolve) {
      (function next(i) {
        if (i >= list.length) return resolve(null);
        var im = new Image();
        im.onload = function () { resolve({ url: list[i], w: im.naturalWidth, h: im.naturalHeight }); };
        im.onerror = function () { next(i + 1); };
        im.src = list[i];
      })(0);
    });
    return imgCache[slot];
  }
  function setBg(el, slot) {
    resolveSlot(slot).then(function (r) {
      if (!r) return;
      el.style.setProperty('--img', 'url("' + r.url + '")');
      el.style.setProperty('--pos', FOCUS[baseOf(slot)] || 'center 20%');
    });
  }
  function hydrateImages(root) {
    $$('img[data-slot]', root).forEach(function (img) {
      var slot = img.getAttribute('data-slot');
      resolveSlot(slot).then(function (r) {
        if (!r) { img.remove(); return; }
        img.style.objectPosition = FOCUS[baseOf(slot)] || 'center 20%';
        img.onload = function () { img.classList.add('ready'); };
        img.src = r.url;
      });
    });
  }

  /* Fondos con foto (data-bg) */
  $$('[data-bg]').forEach(function (el) {
    var name = el.getAttribute('data-bg');
    if (/^\d+$/.test(name)) name = 'hero-' + name;
    setBg(el, name);
  });
  var offerBg = $('#offerBg');
  if (offerBg) setBg(offerBg, 'oferta');

  /* ---------------------------------------------------------
     CATÁLOGO (edita aquí nombres, precios y fotos)
     --------------------------------------------------------- */
  var PRODUCTS = [
    { id: 1,  cat: 'chaque',  catName: 'Chaqué',   name: 'Chaqué negro clásico',      price: 298, old: 420, offer: true, img: 'prod-chaque-negro',  c1: '#2b2b2b', c2: '#0c0c0c', desc: 'Chaqué de corte tradicional en paño negro, con pantalón de raya diplomática. La máxima etiqueta para ceremonias de mañana y tarde.', list: ['Chaqué, chaleco y pantalón de raya', 'Cuello y solapa clásicos', 'Ajustes a tu medida', 'Prueba en tienda'] },
    { id: 2,  cat: 'chaque',  catName: 'Chaqué',   name: 'Chaqué azul real',           price: 298, old: 420, offer: true, img: 'prod-chaque-azul',   c1: '#1d4aa8', c2: '#0b2260', desc: 'Chaqué en azul vibrante, una de las tendencias de la temporada. Perfecto para novios que quieren destacar sin perder la etiqueta.', list: ['Chaleco cruzado a juego', 'Corte entallado', 'Combina con corbata de cachemir', 'Prueba en tienda'] },
    { id: 3,  cat: 'chaque',  catName: 'Chaqué',   name: 'Chaqué gris marengo',        price: 298, old: 420, offer: true, img: 'prod-chaque-gris',   c1: '#6a6f75', c2: '#2f3236', desc: 'Chaqué en gris marengo con chaleco cruzado. Una versión más actual del clásico para bodas de día.', list: ['Total grey o con pantalón de raya', 'Chaleco cruzado', 'Camisa blanca de cuello italiano', 'Prueba en tienda'] },
    { id: 7,  cat: 'traje',   catName: 'Traje',    name: 'Traje azul de tres piezas',  price: 245, img: 'prod-traje-azul',    c1: '#2f5fae', c2: '#122a5a', desc: 'Traje de paño azul con chaleco. El color estrella en bodas e invitados: versátil, favorecedor y siempre elegante.', list: ['Americana, chaleco y pantalón', 'Paño de lana fría', 'Corte slim o regular', 'Ajustes a tu medida'] },
    { id: 8,  cat: 'traje',   catName: 'Traje',    name: 'Traje beige arena',          price: 235, img: 'prod-traje-beige',   c1: '#c8b48a', c2: '#8a7549', desc: 'Beige y tonos tierra: la gran apuesta para bodas de día y verano. Ligero y muy fotogénico.', list: ['Dos botones', 'Tejido texturizado', 'Ideal con corbata burdeos', 'Ajustes a tu medida'] },
    { id: 9,  cat: 'traje',   catName: 'Traje',    name: 'Traje burdeos',              price: 260, img: 'prod-traje-burdeos', c1: '#7a2338', c2: '#3b0f1c', desc: 'Burdeos intenso para los que quieren salirse del trío de azul, negro y gris. Un traje con carácter.', list: ['Solapa de pico', 'Forro a contraste', 'Corbata violeta o dorada', 'Ajustes a tu medida'] },
    { id: 10, cat: 'traje',   catName: 'Traje',    name: 'Traje cruzado azul marino',  price: 285, img: 'prod-traje-cruzado', c1: '#1b2a52', c2: '#0a1124', desc: 'Doble botonadura en azul marino. Silueta clásica con aire contemporáneo, ideal para estilizar.', list: ['Doble botonadura', 'Solapa de pico', 'Botones de nácar', 'Ajustes a tu medida'] },
    { id: 11, cat: 'traje',   catName: 'Traje',    name: 'Traje gris de cuadros',      price: 255, img: 'prod-traje-cuadros', c1: '#9a9fa5', c2: '#4b5157', desc: 'Gris con cuadro ventana en tres piezas. Un estampado sutil, muy en línea con las tendencias de la temporada.', list: ['Chaleco a juego', 'Estampado sutil', 'Perfecto con corbata azul', 'Ajustes a tu medida'] },
    { id: 12, cat: 'complementos', catName: 'Complementos', name: 'Pajaritas de seda',     price: 24, img: 'prod-pajaritas', c1: '#6e1f4f', c2: '#2a0b1e', desc: 'Pajaritas de seda en azul, verde, burdeos, plata y estampados. Para chaqué o traje.', list: ['Varios colores', 'Ajustables', 'Disponible en tienda'] },
    { id: 13, cat: 'complementos', catName: 'Complementos', name: 'Tirantes de lujo',      price: 29, img: 'prod-tirantes',  c1: '#2a2a2a', c2: '#0f0f0f', desc: 'Tirantes elásticos en negro, azul, gris y beige. El detalle clásico que remata un look de gala.', list: ['Varios colores', 'Herrajes plateados', 'Disponible en tienda'] },
    { id: 14, cat: 'complementos', catName: 'Complementos', name: 'Camisas',                price: 69, img: 'prod-camisa',    c1: '#d9dde2', c2: '#8d96a0', desc: 'Camisas blancas o de color que se adaptan a tu estilo. Con cuello italiano, cuello para pajarita o puños franceses.', list: ['Tejidos de algodón', 'Cuello y puño a elegir', 'Para tu estilo'] },
    { id: 15, cat: 'complementos', catName: 'Complementos', name: 'Corbatas y plastrones', price: 35, img: 'prod-corbatas',  c1: '#2f4f8a', c2: '#101e3a', desc: 'Corbatas de cachemir, gris perla para ceremonias y plastrones para chaqué. Anchas, como manda el protocolo.', list: ['Cachemir y seda', 'Plastrón para chaqué', 'Pañuelos a juego'] },
    { id: 16, cat: 'complementos', catName: 'Complementos', name: 'Pañuelos y gemelos',    price: 18, img: 'prod-panuelos',  c1: '#a8872a', c2: '#5c4a12', desc: 'Pañuelos de bolsillo y gemelos para rematar el traje con un guiño de color y elegancia.', list: ['Pañuelos lisos y estampados', 'Gemelos plateados y dorados', 'Disponible en tienda'] }
  ];

  /* ---------------------------------------------------------
     TENDENCIAS: paleta interactiva
     --------------------------------------------------------- */
  var PALETTE = [
    { name: 'Azul real',      hex: '#1d4aa8', tag: 'Color estrella',     filter: 'traje',   desc: 'El azul sigue siendo el gran protagonista de bodas y ceremonias en 2027, desde el azul noche más sobrio hasta los tonos eléctricos y vibrantes.', tie: ['Burdeos', '#7a2338'],   pocket: ['Blanco', '#f4f1e8'],      shirt: 'Blanca',               shoes: 'Marrón oscuro',   ideal: 'bodas de día, invitados y novios' },
    { name: 'Azul noche',     hex: '#16254f', tag: 'Elegancia nocturna', filter: 'traje', desc: 'Más profundo que el negro y mucho más sofisticado bajo las luces. Es la alternativa de moda al negro para ceremonias de tarde y noche.', tie: ['Plata', '#bfc4cc'],     pocket: ['Gris perla', '#d5d8dd'],  shirt: 'Blanca',   shoes: 'Negro',           ideal: 'bodas de tarde y eventos de noche' },
    { name: 'Beige arena',    hex: '#c9b48b', tag: 'Tonos tierra',       filter: 'traje',   desc: 'Los tonos tierra se consolidan como base elegante. El beige es un fijo en los trajes de invitado: ligero, luminoso y muy favorecedor.', tie: ['Azul', '#2a4d8f'],      pocket: ['Burdeos', '#8a2a3c'],     shirt: 'Blanca o celeste',     shoes: 'Cognac',          ideal: 'bodas de día, primavera y verano' },
    { name: 'Marrón chocolate', hex: '#5b3a2a', tag: 'El marrón, nuevo negro', filter: 'traje', desc: 'Del chocolate al caramelo, los marrones se imponen como base de looks elegantes y atemporales. Calidez y presencia para otoño e invierno.', tie: ['Crema', '#e8dcc0'],     pocket: ['Naranja suave', '#d98c4a'], shirt: 'Crema o celeste',    shoes: 'Marrón',          ideal: 'eventos de tarde en otoño e invierno' },
    { name: 'Burdeos',        hex: '#6e1f35', tag: '«Berry tones»',      filter: 'traje',   desc: 'Burdeos, granate y malva: colores profundos y maduros, con un aire de dandi. Perfectos para quien quiere salirse del azul, el negro y el gris.', tie: ['Azul marino', '#1b2a52'], pocket: ['Gris perla', '#c9ccd1'], shirt: 'Blanca',              shoes: 'Negro',           ideal: 'invitados atrevidos y cenas' },
    { name: 'Verde botella',  hex: '#1f4d36', tag: 'Color con carácter', filter: 'traje',   desc: 'Un verde intenso y elegante que destaca sin estridencias. Funciona muy bien con chaleco beige y complementos dorados.', tie: ['Dorado', '#c9a227'],    pocket: ['Beige', '#d8c9a3'],       shirt: 'Blanca o marfil',      shoes: 'Marrón oscuro',   ideal: 'bodas de tarde y otoño' },
    { name: 'Gris marengo',   hex: '#474c52', tag: 'Chaqué «total grey»', filter: 'chaque', desc: 'El gris oscuro es el clásico del chaqué moderno. Con chaleco cruzado y corbata azul consigue un look sobrio, actual y muy elegante.', tie: ['Azul', '#2f5fae'],      pocket: ['Blanco', '#f4f1e8'],      shirt: 'Blanca de cuello italiano', shoes: 'Negro',      ideal: 'chaqué de día, ceremonias y trabajo' },
    { name: 'Azul hielo',     hex: '#b6c8da', tag: 'Neutro emocional',   filter: 'traje',   desc: 'Un azul frío y claro, entre el pastel y el glacial, que funciona como neutro y refresca cualquier look de primavera o verano.', tie: ['Azul marino', '#1b2a52'], pocket: ['Blanco', '#f4f1e8'],   shirt: 'Blanca',               shoes: 'Marrón claro',    ideal: 'ceremonias de día en primavera y verano' },
    { name: 'Negro',          hex: '#161616', tag: 'Clásico atemporal',          filter: 'chaque', desc: 'El clásico que nunca falla. Sobrio y elegante, perfecto para el chaqué y las ceremonias más formales.', tie: ['Plata', '#c0c4ca'],     pocket: ['Blanco', '#f4f1e8'],      shirt: 'Blanca',   shoes: 'Negro',    ideal: 'chaqué y ceremonias formales' },
    { name: 'Marfil piedra',  hex: '#e6dfcc', tag: 'Inspiración japonesa', filter: 'traje', desc: 'Siluetas depuradas y colores como el marfil o la piedra para un novio sereno, moderno y distinto.', tie: ['Verde', '#2f5a43'],      pocket: ['Verde claro', '#a9c0a8'], shirt: 'Blanca',               shoes: 'Marrón claro',    ideal: 'novios con estilo sereno y moderno' }
  ];

  /* ---------------------------------------------------------
     LOOKBOOK: fotos de inspiración
     (archivo sin extensión, texto, tipo)
     --------------------------------------------------------- */
  var LOOKS = [
    { f: 'imagen1 blancoynegro',   t: 'Elegancia en blanco y negro', k: 'bn' },
    { f: 'imagen12',               t: 'Negro sobre gris claro',       k: 'color' },
    { f: 'imagen2',                t: 'Pajarita verde y chaleco',     k: 'color' },
    { f: 'imagen6 blanco y negro', t: 'Retrato clásico',              k: 'bn' },
    { f: 'imagen11',               t: 'Azul sobre fondo azul',        k: 'color' },
    { f: 'imagen3',                t: 'Traje gris en otoño',          k: 'color' },
    { f: 'imagen2 blancoynegro',   t: 'Detalle de solapa',            k: 'bn' },
    { f: 'imagen13',               t: 'En el escaparate',             k: 'color' },
    { f: 'imagen8',                t: 'Azul grisáceo entre plantas',  k: 'color' },
    { f: 'imagen3 blancoynegro',   t: 'El último ajuste',             k: 'bn' },
    { f: 'imagen10',               t: 'Chaleco crema, tono tierra',   k: 'color' },
    { f: 'imagen4',                t: 'Paño negro en maniquí',        k: 'color' },
    { f: 'imagen6',                t: 'Traje gris claro de día',      k: 'color' },
    { f: 'imagen7',                t: 'Sentado con clase',            k: 'color' },
    { f: 'imagen5',                t: 'Corbata y camisa blanca',      k: 'color' },
    { f: 'imagen9',                t: 'Chaqueta colgada, detalle',    k: 'color' },
    { f: 'imagen14',               t: 'Silueta bajo el foco',              k: 'color' },
    { f: 'imagen1',                t: 'Entrada de gala',              k: 'color' }
  ];

  /* ---------------------------------------------------------
     Año del pie
     --------------------------------------------------------- */
  $('#year').textContent = '2027';

  /* ---------------------------------------------------------
     Cabecera, menú móvil y botón de subir
     --------------------------------------------------------- */
  var header = $('#header');
  var burger = $('#burger');
  var nav = $('#nav');
  var toTop = $('#toTop');
  var offerEl = offerBg;

  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('scrolled', y > 60);
    toTop.classList.toggle('show', y > 700);
    if (offerEl && !reduceMotion) {
      var r = offerEl.parentElement.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        offerEl.style.transform = 'translateY(' + (-r.top * 0.12).toFixed(1) + 'px)';
      }
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    burger.classList.remove('open');
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('lock');
  }
  burger.addEventListener('click', function () {
    var open = burger.classList.toggle('open');
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('lock', open);
  });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', closeMenu); });
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); });

  var navLinks = $$('.nav a[href^="#"]:not(.btn)');
  var sections = navLinks.map(function (a) { return $(a.getAttribute('href')); }).filter(Boolean);
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          navLinks.forEach(function (a) { a.classList.toggle('current', a.getAttribute('href') === '#' + e.target.id); });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------------------------------------------------------
     Hero (slider)
     --------------------------------------------------------- */
  (function heroSlider() {
    var slides = $$('.slide');
    var dotsWrap = $('#dots');
    var bar = $('#progress');
    var hero = $('.hero');
    var DURATION = 7000;
    var index = 0, start = performance.now(), paused = false, elapsedAtPause = 0;

    slides.forEach(function (_, i) {
      var d = document.createElement('button');
      d.className = 'dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Ir a la diapositiva ' + (i + 1));
      d.addEventListener('click', function () { go(i); });
      dotsWrap.appendChild(d);
    });
    var dots = $$('.dot', dotsWrap);

    function go(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) { s.classList.toggle('active', n === index); });
      dots.forEach(function (d, n) { d.classList.toggle('active', n === index); });
      start = performance.now(); elapsedAtPause = 0;
    }
    function tick(now) {
      if (!paused) {
        var p = Math.min((now - start) / DURATION, 1);
        bar.style.width = (p * 100) + '%';
        if (p >= 1) go(index + 1);
      }
      requestAnimationFrame(tick);
    }
    if (!reduceMotion) requestAnimationFrame(tick);

    $('#next').addEventListener('click', function () { go(index + 1); });
    $('#prev').addEventListener('click', function () { go(index - 1); });
    hero.addEventListener('mouseenter', function () { paused = true; elapsedAtPause = performance.now() - start; });
    hero.addEventListener('mouseleave', function () { paused = false; start = performance.now() - elapsedAtPause; });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { paused = true; elapsedAtPause = performance.now() - start; }
      else { paused = false; start = performance.now() - elapsedAtPause; }
    });
    var x0 = null;
    hero.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    hero.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  })();

  /* ---------------------------------------------------------
     Aparición al hacer scroll (con respaldo para que NUNCA
     quede nada oculto)
     --------------------------------------------------------- */
  function initReveal() {
    var pending = $$('.reveal');
    function show(el) { el.classList.add('in'); }

    if (reduceMotion) { pending.forEach(show); return; }

    function check() {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      pending = pending.filter(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.94 && r.bottom > 0) { show(el); return false; }
        if (r.bottom <= 0) { show(el); return false; }   // ya pasó por encima
        return true;
      });
      if (!pending.length) {
        window.removeEventListener('scroll', check);
        window.removeEventListener('resize', check);
      }
    }
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    window.addEventListener('load', check);
    check();
    setTimeout(check, 400);
    setTimeout(check, 1500);
  }

  /* ---------------------------------------------------------
     Colección: filtros, búsqueda y orden
     --------------------------------------------------------- */
  var grid = $('#grid');
  var modal = $('#modal');
  var state = { filter: 'all', q: '', sort: 'rec' };

  function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }

  function visibleProducts() {
    var q = norm(state.q.trim());
    var list = PRODUCTS.filter(function (p) {
      if (state.filter !== 'all' && p.cat !== state.filter) return false;
      if (!q) return true;
      return norm(p.name + ' ' + p.catName + ' ' + p.desc + ' ' + p.list.join(' ')).indexOf(q) !== -1;
    });
    if (state.sort === 'asc') list.sort(function (a, b) { return a.price - b.price; });
    else if (state.sort === 'desc') list.sort(function (a, b) { return b.price - a.price; });
    else if (state.sort === 'az') list.sort(function (a, b) { return a.name.localeCompare(b.name, 'es'); });
    return list;
  }

  function renderGrid() {
    var list = visibleProducts();
    grid.innerHTML = list.map(function (p, i) {
      var priceHtml = p.old ? '<s>' + money(p.old) + '</s>' + money(p.price) : (p.cat === 'complementos' ? 'desde ' : '') + money(p.price);
      return '<button class="card" data-id="' + p.id + '" style="--i:' + i + '" aria-label="Ver ' + p.name + '">' +
        '<div class="card-media" style="--c1:' + p.c1 + ';--c2:' + p.c2 + '">' + SIL +
        '<img data-slot="' + p.img + '" alt="' + p.name + '" decoding="async">' +
        (p.offer ? '<span class="badge-offer">Ofertón</span>' : '') +
        '<span class="quick">Ver detalle</span></div>' +
        '<div class="card-info"><small>' + p.catName + '</small><h3>' + p.name + '</h3><span class="price">' + priceHtml + '</span></div>' +
        '</button>';
    }).join('');
    hydrateImages(grid);
    $('#count').textContent = list.length === 1 ? 'Mostrando 1 prenda' : 'Mostrando ' + list.length + ' prendas';
    $('#empty').hidden = list.length > 0;
  }

  function setFilter(f) {
    state.filter = f;
    $$('#filters .chip').forEach(function (c) { c.classList.toggle('active', c.getAttribute('data-filter') === f); });
    renderGrid();
  }
  renderGrid();

  $$('#filters .chip').forEach(function (c) { c.addEventListener('click', function () { setFilter(c.getAttribute('data-filter')); }); });
  $$('.cat').forEach(function (c) { c.addEventListener('click', function () { setFilter(c.getAttribute('data-filter')); }); });
  $('#q').addEventListener('input', function (e) { state.q = e.target.value; renderGrid(); });
  $('#sort').addEventListener('change', function (e) { state.sort = e.target.value; renderGrid(); });

  /* ---------------------------------------------------------
     Ventana de producto
     --------------------------------------------------------- */
  var lastFocus = null;
  function openModal(id) {
    var p = PRODUCTS.filter(function (x) { return x.id === id; })[0];
    if (!p) return;
    lastFocus = document.activeElement;
    var media = $('#mMedia');
    media.style.setProperty('--c1', p.c1); media.style.setProperty('--c2', p.c2);
    media.innerHTML = SIL + '<img data-slot="' + p.img + '" alt="' + p.name + '">';
    hydrateImages(media);
    $('#mCat').textContent = p.catName;
    $('#mTitle').textContent = p.name;
    $('#mPrice').innerHTML = (p.old ? '<s style="color:var(--muted);font-size:1.2rem;margin-right:.5rem">' + money(p.old) + '</s>' : '') + money(p.price);
    $('#mDesc').textContent = p.desc;
    $('#mList').innerHTML = p.list.map(function (t) { return '<li>' + t + '</li>'; }).join('');
    var msg = 'Hola, me interesa «' + p.name + '» (' + money(p.price) + '). ¿Podéis darme información sobre disponibilidad y tallas?';
    $('#mWa').href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lock');
    $('.modal-close', modal).focus();
  }
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lock');
    if (lastFocus) lastFocus.focus();
  }
  grid.addEventListener('click', function (e) {
    var card = e.target.closest('.card');
    if (card) openModal(Number(card.getAttribute('data-id')));
  });
  $$('[data-close]', modal).forEach(function (el) { el.addEventListener('click', closeModal); });

  /* ---------------------------------------------------------
     Tendencias: explorador de color + carrusel de tonos
     --------------------------------------------------------- */
  /* (function colorExplorer() {
    var stage = $('#stage');
    var track = $('#swatches');
    var current = -1, timer = null, userTouched = false;

    track.innerHTML = PALETTE.map(function (c, i) {
      return '<button class="swatch" role="option" data-i="' + i + '" aria-selected="false" aria-label="' + c.name + '">' +
        '<span class="sw-color" style="background:' + c.hex + '"></span>' +
        '<span class="sw-name">' + c.name + '</span><small>' + c.tag + '</small></button>';
    }).join('');
    var swatches = $$('.swatch', track);

    function select(i, fromUser) {
      i = (i + PALETTE.length) % PALETTE.length;
      if (i === current) return;
      current = i;
      var c = PALETTE[i];
      stage.style.setProperty('--suit', c.hex);
      stage.style.setProperty('--tie', c.tie[1]);
      stage.style.setProperty('--pocket', c.pocket[1]);
      $('#cTag').textContent = c.tag;
      $('#cHex').textContent = c.hex.toUpperCase();
      $('#cName').textContent = c.name;
      $('#cDesc').textContent = c.desc;
      $('#pTie').textContent = c.tie[0];
      $('#pTieDot').style.background = c.tie[1];
      $('#pPocket').textContent = c.pocket[0];
      $('#pPocketDot').style.background = c.pocket[1];
      $('#pShirt').textContent = c.shirt;
      $('#pShoes').textContent = c.shoes;
      $('#cFor').textContent = c.ideal;
      $('#cLink').setAttribute('data-filter', c.filter);
      swatches.forEach(function (s, n) {
        s.classList.toggle('active', n === i);
        s.setAttribute('aria-selected', String(n === i));
      });
      var el = swatches[i];
      var left = el.offsetLeft - (track.clientWidth - el.offsetWidth) / 2;
      track.scrollTo({ left: left, behavior: reduceMotion || !fromUser && current === 0 ? 'auto' : 'smooth' });
      var info = $('.explorer-info');
      info.classList.remove('swap'); void info.offsetWidth; info.classList.add('swap');
    }

    function stopAuto() { userTouched = true; if (timer) { clearInterval(timer); timer = null; } }
    function startAuto() {
      if (reduceMotion || userTouched) return;
      timer = setInterval(function () { select(current + 1, false); }, 5000);
    }

    swatches.forEach(function (s) {
      s.addEventListener('click', function () { stopAuto(); select(Number(s.getAttribute('data-i')), true); });
    });
    $('#sPrev').addEventListener('click', function () { stopAuto(); select(current - 1, true); });
    $('#sNext').addEventListener('click', function () { stopAuto(); select(current + 1, true); });
    $('#explorer').addEventListener('mouseenter', function () { if (timer) { clearInterval(timer); timer = null; } });
    $('#explorer').addEventListener('mouseleave', startAuto);
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { stopAuto(); select(current + 1, true); }
      if (e.key === 'ArrowLeft') { stopAuto(); select(current - 1, true); }
    });

    // Arrastrar con el ratón
    var down = false, sx = 0, sl = 0, moved = false;
    track.addEventListener('mousedown', function (e) { down = true; moved = false; sx = e.pageX; sl = track.scrollLeft; track.classList.add('drag'); });
    window.addEventListener('mouseup', function () { down = false; track.classList.remove('drag'); });
    track.addEventListener('mousemove', function (e) {
      if (!down) return;
      if (Math.abs(e.pageX - sx) > 4) moved = true;
      track.scrollLeft = sl - (e.pageX - sx);
    });
    track.addEventListener('click', function (e) { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);

    $('#cLink').addEventListener('click', function () { setFilter(this.getAttribute('data-filter') || 'all'); });

    select(0, false);
    startAuto();
  })(); */

  /* ---------------------------------------------------------
     Guía de etiqueta (pestañas)
     --------------------------------------------------------- */
  $$('.tab').forEach(function (t) {
    t.addEventListener('click', function () {
      var id = t.getAttribute('data-tab');
      $$('.tab').forEach(function (x) { x.classList.toggle('active', x === t); x.setAttribute('aria-selected', String(x === t)); });
      $$('.panel').forEach(function (p) { p.classList.toggle('active', p.id === 'panel-' + id); });
    });
  });

  /* ---------------------------------------------------------
     Lookbook + visor
     --------------------------------------------------------- */
  (function lookbook() {
    var gridEl = $('#lookGrid');
    var lb = $('#lb');
    var lbImg = $('#lbImg');
    var shown = [];     // elementos visibles (para navegar)
    var idx = 0;
    var found = 0, checked = 0;

    gridEl.innerHTML = LOOKS.map(function (l, i) {
      return '<figure class="look" data-kind="' + l.k + '" data-i="' + i + '" tabindex="0" style="aspect-ratio:3/4">' +
        '<img alt="' + l.t + '" decoding="async">' +
        '<figcaption><span>' + l.t + '</span><svg width="18" height="18"><use href="#i-expand"/></svg></figcaption></figure>';
    }).join('');

    $$('.look', gridEl).forEach(function (fig) {
      var look = LOOKS[Number(fig.getAttribute('data-i'))];
      var img = $('img', fig);
      resolveSlot(look.f).then(function (r) {
        checked++;
        if (!r) { fig.remove(); }
        else {
          found++;
          fig.style.aspectRatio = r.w + ' / ' + r.h;
          fig.setAttribute('data-src', r.url);
          img.onload = function () { fig.classList.add('ready'); };
          img.src = r.url;
        }
        if (checked === LOOKS.length && found === 0) {
          var sec = $('#lookbook'); if (sec) sec.hidden = true;
          var nl = $('#navLook'); if (nl) nl.hidden = true;
        }
      });
    });

    $$('#lookFilters .chip').forEach(function (c) {
      c.addEventListener('click', function () {
        var f = c.getAttribute('data-look');
        $$('#lookFilters .chip').forEach(function (x) { x.classList.toggle('active', x === c); });
        $$('.look', gridEl).forEach(function (fig) {
          var ok = f === 'all' || fig.getAttribute('data-kind') === f;
          fig.classList.toggle('hide', !ok);
        });
      });
    });

    function list() { return $$('.look:not(.hide)', gridEl).filter(function (f) { return f.getAttribute('data-src'); }); }
    function show(i) {
      shown = list();
      if (!shown.length) return;
      idx = (i + shown.length) % shown.length;
      var fig = shown[idx];
      var look = LOOKS[Number(fig.getAttribute('data-i'))];
      lbImg.classList.remove('in');
      lbImg.onload = function () { lbImg.classList.add('in'); };
      lbImg.src = fig.getAttribute('data-src');
      lbImg.alt = look.t;
      $('#lbCap').textContent = look.t;
      $('#lbCount').textContent = (idx + 1) + ' / ' + shown.length;
    }
    function open(i) {
      show(i);
      lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lock');
    }
    function close() {
      lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('lock');
    }
    gridEl.addEventListener('click', function (e) {
      var fig = e.target.closest('.look'); if (!fig) return;
      open(list().indexOf(fig));
    });
    gridEl.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var fig = e.target.closest('.look'); if (!fig) return;
      e.preventDefault(); open(list().indexOf(fig));
    });
    $$('[data-lbclose]', lb).forEach(function (b) { b.addEventListener('click', close); });
    $('#lbPrev').addEventListener('click', function () { show(idx - 1); });
    $('#lbNext').addEventListener('click', function () { show(idx + 1); });
    document.addEventListener('keydown', function (e) {
      if (lb.classList.contains('open')) {
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowRight') show(idx + 1);
        if (e.key === 'ArrowLeft') show(idx - 1);
      } else if (modal.classList.contains('open') && e.key === 'Escape') {
        closeModal();
      }
    });
    var x0 = null;
    lb.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
      x0 = null;
    });
  })();

  /* ---------------------------------------------------------
     Preguntas frecuentes
     --------------------------------------------------------- */
  $$('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var open = q.getAttribute('aria-expanded') === 'true';
      $$('.faq-q').forEach(function (x) { x.setAttribute('aria-expanded', 'false'); });
      q.setAttribute('aria-expanded', String(!open));
    });
  });

  /* ---------------------------------------------------------
     Solicitud de información → WhatsApp
     --------------------------------------------------------- */
  (function informationForm() {
    var form = $('#informacion');
    var note = $('#formNote');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      ['f-name', 'f-phone', 'f-type'].forEach(function (id) {
        var el = $('#' + id);
        var valid = el.value.trim() !== '';
        el.parentElement.classList.toggle('error', !valid);
        if (!valid) ok = false;
      });
      if (!ok) { note.style.color = '#b3261e'; note.textContent = 'Por favor, completa los campos obligatorios.'; return; }

      var data = {
        name: $('#f-name').value.trim(),
        phone: $('#f-phone').value.trim(),
        type: $('#f-type').value,
        msg: $('#f-msg').value.trim()
      };
      var text = 'Hola, soy ' + data.name + '. Quiero solicitar información sobre: ' + data.type + '.' +
        (data.msg ? '\n' + data.msg : '') +
        '\nMi teléfono: ' + data.phone;
      window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
      note.style.color = ''; note.textContent = '¡Gracias! Se ha abierto WhatsApp con tu mensaje.';
      form.reset();
    });
    $$('input, select', form).forEach(function (el) {
      el.addEventListener('input', function () { el.parentElement.classList.remove('error'); });
    });
  })();

  initReveal();
})();