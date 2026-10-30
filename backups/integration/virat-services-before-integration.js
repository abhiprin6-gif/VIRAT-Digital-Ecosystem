(() => {
  const groups = [
    ["मुख्य सेवाएँ", [
      ["🔎","V Search","Smart Search"],
      ["🤖","VIRAT AI","AI Assistant"],
      ["🏛️","Government","सरकारी सेवाएँ"],
      ["💼","Career","Jobs & Opportunities"],
      ["🎓","Education","Learning & Courses"],
      ["☁️","Drive","Cloud Storage"]
    ]],
    ["Digital Services", [
      ["🎬","Videos","Video Platform"],
      ["💳","INSTANT PAY","Payment Demo"],
      ["🏢","VIRAT CSC","CSC Services"],
      ["🏪","Business","Business Directory"],
      ["💡","Innovation","New Ideas"],
      ["🔬","Research","Research Hub"],
      ["💻","Technology","Technology Hub"],
      ["🌾","Agriculture","Agriculture Services"],
      ["🏥","Health","Health Information"],
      ["📍","Local","Local Services"],
      ["🤝","Connect","Community Connect"],
      ["🛡️","Trust","Safety & Trust"],
      ["🧠","Memory","Personal Memory"],
      ["🔔","Notifications","Alerts"],
      ["⚙️","Admin","Administration"],
      ["☁️","Developer Cloud","Developer Platform"],
      ["🚀","Opportunity Engine","Opportunities"],
      ["📝","Citizen Problem Hub","Citizen Support"]
    ]],
    ["Productivity & Google-style Alternatives", [
      ["🗺️","V Maps","Maps & Navigation"],
      ["✉️","V Mail","Email Service"],
      ["📄","V Docs","Document Editor"],
      ["📊","V Sheets","Spreadsheets"],
      ["📽️","Slides","Presentation Tools"],
      ["📅","Calendar","Calendar"],
      ["📹","V Meet","Video Meetings"],
      ["🌐","Browser","Web Browser"],
      ["👤","Account","User Account"],
      ["🖼️","Photos","Photo Storage"],
      ["🌍","V Translate","Translation"],
      ["🎙️","Voice","Voice Tools"],
      ["🧪","V AI Studio","AI Development"],
      ["📰","News","News Reader"],
      ["📚","Books & Research","Books & Knowledge"]
    ]]
  ];

  const container = document.getElementById("virat-service-directory");
  if (!container) return;

  const search = document.getElementById("virat-service-search");
  const render = (query = "") => {
    const q = query.toLowerCase();
    container.innerHTML = "";

    groups.forEach(([heading, services]) => {
      const matches = services.filter(s =>
        (s[1] + " " + s[2]).toLowerCase().includes(q)
      );
      if (!matches.length) return;

      const section = document.createElement("section");
      const title = document.createElement("h2");
      title.textContent = heading;
      section.appendChild(title);

      const grid = document.createElement("div");
      grid.className = "virat-panel-grid";

      matches.forEach(([icon, name, description]) => {
        const card = document.createElement("a");
        card.className = "virat-panel";
        card.href = "#service-" + name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

        const symbol = document.createElement("span");
        symbol.className = "virat-icon";
        symbol.textContent = icon;

        const content = document.createElement("div");
        const heading = document.createElement("h3");
        heading.textContent = name;
        const detail = document.createElement("p");
        detail.textContent = description;

        content.append(heading, detail);
        card.append(symbol, content);
        grid.appendChild(card);
      });

      section.appendChild(grid);
      container.appendChild(section);
    });
  };

  search?.addEventListener("input", e => render(e.target.value));
  render();
})();
