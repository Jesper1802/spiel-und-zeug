const productSections = document.getElementById("product-sections");
const categoryNav = document.getElementById("category-nav");

async function loadProducts() {
  if (!productSections || !categoryNav) return;

  try {
    const response = await fetch("./produkte.json", { cache: "no-cache" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    if (!Array.isArray(data.smartHome)) throw new Error("Ungültiges Datenformat");

    productSections.replaceChildren();
    categoryNav.replaceChildren();

    data.smartHome.forEach((category, index) => {
      const navLink = document.createElement("a");
      navLink.href = `#${category.id}`;
      navLink.textContent = category.titel.replace(/\.$/, "");
      categoryNav.append(navLink);

      const section = document.createElement("section");
      section.className = "product-category-section";
      section.id = category.id;

      const header = document.createElement("div");
      header.className = "product-section-heading";
      const label = document.createElement("p");
      label.className = "product-eyebrow";
      label.textContent = `KATEGORIE ${String(index + 1).padStart(2, "0")}`;
      const heading = document.createElement("h2");
      heading.textContent = category.titel;
      const description = document.createElement("p");
      description.className = "product-section-description";
      description.textContent = category.beschreibung;
      header.append(label, heading, description);

      const grid = document.createElement("div");
      grid.className = "product-card-grid";

      category.produkte.forEach(product => {
        const validLink = typeof product.link === "string" && /^https:\/\//i.test(product.link);
        const card = document.createElement(validLink ? "a" : "article");
        card.className = "product-item-card";
        if (validLink) {
          card.href = product.link;
          card.target = "_blank";
          card.rel = "noopener noreferrer sponsored";
          card.setAttribute("aria-label", `${product.name} beim Anbieter ansehen (neuer Tab)`);
        } else {
          card.classList.add("product-item-card--inactive");
        }

        const media = document.createElement("div");
        media.className = "product-item-media";
        if (product.bild) {
          const img = document.createElement("img");
          img.src = product.bild;
          img.alt = product.name;
          img.loading = "lazy";
          img.onerror = () => {
            media.replaceChildren();
            const placeholder = document.createElement("span");
            placeholder.className = "product-image-placeholder";
            placeholder.textContent = "Bild folgt";
            media.append(placeholder);
          };
          media.append(img);
        } else {
          const placeholder = document.createElement("span");
          placeholder.className = "product-image-placeholder";
          placeholder.textContent = "Bild folgt";
          media.append(placeholder);
        }

        const info = document.createElement("div");
        info.className = "product-item-info";
        const name = document.createElement("h3");
        name.textContent = product.name;
        const details = document.createElement("p");
        details.textContent = product.beschreibung || "";
        info.append(name, details);
        if (validLink) {
          const cta = document.createElement("span");
          cta.className = "product-item-link-label";
          cta.textContent = "Produkt ansehen ↗";
          info.append(cta);
        }
        card.append(media, info);
        grid.append(card);
      });

      section.append(header, grid);
      productSections.append(section);
    });
  } catch (error) {
    console.error("Fehler beim Laden der Produkte:", error);
    productSections.textContent = "Die Produkte konnten leider nicht geladen werden.";
  }
}

loadProducts();
