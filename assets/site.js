// Plantagenet lease site — light interactivity: compare sliders + photo lightbox.
// Inquiry form: on Netlify it submits via Netlify Forms; on any other static host
// the submit falls back to composing an email to the listing team.
(function () {
  var form = document.querySelector('form[name="inquiry"]');
  if (!form) return;
  if (location.hostname.indexOf('netlify.app') !== -1) return; // Netlify Forms handles it
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var fr = document.documentElement.lang === 'fr';
    var get = function (n) { var el = form.querySelector('[name="' + n + '"]'); return el ? el.value.trim() : ''; };
    var subject = (fr ? 'Demande — 179–181 Old Highway 17, Plantagenet' : 'Inquiry — 179–181 Old Highway 17, Plantagenet');
    var body = (fr ? 'Nom : ' : 'Name: ') + get('name') + '\n' +
      (fr ? 'Courriel ou téléphone : ' : 'Email or phone: ') + get('contact') + '\n' +
      (fr ? 'Entreprise / usage envisagé : ' : 'Business / intended use: ') + get('use') + '\n\n' + get('message');
    location.href = 'mailto:sales@chantalbenoit.ca?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });
})();

document.querySelectorAll('.compare').forEach(function (box) {
  var slider = box.querySelector('input[type=range]');
  if (!slider) return;
  var set = function () { box.style.setProperty('--pos', slider.value + '%'); };
  slider.addEventListener('input', set); set();
});

(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('#gallery .gallery figure a, section .gallery figure a'));
  links = links.filter(function (a) { return /\.(jpe?g|png)$/i.test(a.getAttribute('href') || ''); });
  if (!links.length) return;
  var lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = '<button class="lb-close" aria-label="Close">✕</button>' +
    '<button class="lb-prev" aria-label="Previous photo">‹</button>' +
    '<img alt=""><div class="lb-cap"></div>' +
    '<button class="lb-next" aria-label="Next photo">›</button>';
  document.body.appendChild(lb);
  var img = lb.querySelector('img'), cap = lb.querySelector('.lb-cap'), i = 0;
  function show(n) {
    i = (n + links.length) % links.length;
    var a = links[i], im = a.querySelector('img');
    img.src = a.href; img.alt = im ? im.alt : '';
    var fig = a.closest('figure'), fc = fig ? fig.querySelector('figcaption') : null;
    cap.textContent = fc ? fc.textContent.trim() : '';
  }
  function open(n) { show(n); lb.classList.add('open'); }
  function close() { lb.classList.remove('open'); }
  links.forEach(function (a, n) { a.addEventListener('click', function (e) { e.preventDefault(); open(n); }); });
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', function () { show(i - 1); });
  lb.querySelector('.lb-next').addEventListener('click', function () { show(i + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  });
})();
