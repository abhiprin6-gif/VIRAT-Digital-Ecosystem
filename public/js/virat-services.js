(() => {
  const services = [
    ['V Search','🔎'],['VIRAT AI','🤖'],['Government','🏛️'],
    ['Career','💼'],['Education','🎓'],['Drive','☁️'],
    ['Videos','🎬'],['INSTANT PAY','💳'],['VIRAT CSC','🖥️'],
    ['Business','🏢'],['Innovation','💡'],['Research','🔬'],
    ['Technology','⚙️'],['Agriculture','🌾'],['Health','❤️'],
    ['Local','📍'],['Connect','🌐'],['Trust','🛡️'],
    ['Memory','🧠'],['Notifications','🔔'],['Admin','👨‍💻'],
    ['Developer Cloud','☁️'],['Opportunity Engine','🚀'],
    ['VIRAT Citizen Problem Hub','📢'],
    ['V Maps','🗺️'],['V Mail','✉️'],['V Docs','📄'],
    ['V Sheets','📊'],['Slides','📽️'],['Calendar','📅'],
    ['V Meet','📹'],['Browser','🌍'],['V Account','👤'],
    ['V Photos','🖼️'],['V Translate','🌐'],['V Voice','🎙️'],
    ['V AI Studio','🧪'],['V News','📰'],['V Books & Research','📚']
  ];

  const root = document.getElementById('virat-service-directory');
  const search = document.getElementById('virat-service-search');
  if (!root) return;

  function render(query = '') {
    root.innerHTML = '';
    services.filter(([name]) => name.toLowerCase().includes(query.toLowerCase()))
      .forEach(([name, icon]) => {
        const card = document.createElement('a');
        card.className = 'virat-panel';
        card.href = '#service-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const symbol = document.createElement('span');
        symbol.className = 'virat-icon';
        symbol.textContent = icon;
        const title = document.createElement('span');
        title.textContent = name;
        card.append(symbol, title);
        root.appendChild(card);
      });
  }

  if (search) search.addEventListener('input', e => render(e.target.value));
  render();
})();
