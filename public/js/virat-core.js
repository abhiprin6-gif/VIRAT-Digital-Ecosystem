(() => {
  const VIRAT = {
    name: "VIRAT Digital Ecosystem",
    version: "1.0.0",

    setTheme(theme) {
      if (!["light", "dark"].includes(theme)) return;

      document.documentElement.dataset.theme = theme;

      try {
        localStorage.setItem("virat-theme", theme);
      } catch (error) {
        console.warn("Theme preference could not be saved.");
      }
    },

    init() {
      let theme = "light";

      try {
        theme = localStorage.getItem("virat-theme") || "light";
      } catch (error) {}

      this.setTheme(theme);
      console.log("VIRAT Core initialized.");
    }
  };

  window.VIRAT = VIRAT;
  VIRAT.init();
})();
