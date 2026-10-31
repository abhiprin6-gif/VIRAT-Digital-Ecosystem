(() => {
  if (window.viratServiceNavigationLoaded) return;
  window.viratServiceNavigationLoaded = true;

  document.addEventListener('click', function (event) {
    const card = event.target.closest('.panel, .eco-card');
    if (!card) return;
    if (event.target.closest('a, button, input, select, textarea')) return;

    const heading = card.querySelector('h1,h2,h3,h4,.title');
    const name = (heading ? heading.textContent : card.textContent)
      .trim().replace(/\s+/g, ' ').slice(0, 100);

    if (!name) return;

    event.preventDefault();
    event.stopPropagation();
    window.location.href =
      '/public/open-service.html?name=' + encodeURIComponent(name);
  }, true);
})();
