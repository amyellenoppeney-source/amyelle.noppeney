
/* Portfolio website: content comes from content.json. */
(async () => {
  const $ = (selector) => document.querySelector(selector);

  const esc = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c]));

  const safeUrl = (url) => {
    const value = String(url ?? "").trim();
    return /^(https?:\/\/|mailto:|tel:|images\/|files\/|[\w./-]+\.(pdf|html|png|jpe?g|webp|svg))$/i.test(value)
      ? value
      : "#";
  };

  const page = document.body.dataset.page || "home";
  const main = $("#main");
  if (!main) return;

  let C;
  try {
    const response = await fetch(
      new URL("content.json", window.location.href)
    );
    if (!response.ok) throw new Error("Could not load content.json");
    C = await response.json();
  } catch (error) {
    console.error(error);
    main.innerHTML =
      '<p class="wrap note">Could not load content.json. Check that the file is valid and published.</p>';
    return;
  }

  const S = C.site || {};
  const asList = (value) => Array.isArray(value) ? value : [];

  const p = (value, className = "") =>
    value
      ? `<p${className ? ` class="${esc(className)}"` : ""}>${esc(value)}</p>`
      : "";

  const flag = (item) =>
    item?.placeholder ? '<span class="flag">Draft</span>' : "";

  const sec = (title, body, id = "") => `
    <section class="wrap sec"${id ? ` id="${esc(id)}"` : ""}>
      <h2>${esc(title)}</h2>
      <div class="sec-body">${body}</div>
    </section>`;

  const head = (title, intro) => `
    <div class="wrap page-head">
      <h1>${esc(title)}</h1>
      ${intro ? `<p>${esc(intro)}</p>` : ""}
    </div>`;

  const tags = (items) => `
    <ul class="tags">
      ${asList(items).map((item) => `<li>${esc(item)}</li>`).join("")}
    </ul>`;

  const linkList = (items) => {
    const output = asList(items).map((link) => {
      const url = safeUrl(link.url);
      const external = /^https?:\/\//i.test(url);
      return `
        <a href="${esc(url)}"
          ${external ? 'target="_blank" rel="noopener noreferrer"' : ""}
          ${link.download ? "download" : ""}>
          ${esc(link.label || "Open link")} ↗
        </a>`;
    });

    return output.length
      ? `<p class="links">${output.join("")}</p>`
      : "";
  };

  const socialChips = (items) => `
    <div class="social-chips">
      ${asList(items).map((item) => `
        <a class="chip-link"
          href="${esc(safeUrl(item.url))}"
          target="_blank"
          rel="noopener noreferrer">
          ${esc(item.label)} <span aria-hidden="true">↗</span>
        </a>
      `).join("")}
    </div>`;

  const pub = (item) => `
    <li class="publication-card">
      ${item.cover ? `
        <a class="cover-link"
          href="${esc(safeUrl(item.cover))}"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open cover for ${esc(item.title)}">
          <img class="publication-cover"
            src="${esc(safeUrl(item.cover))}"
            alt="Cover of ${esc(item.title)}"
            loading="lazy">
        </a>
      ` : ""}
      <div class="publication-content">
        <div class="publication-meta">
          <span>${esc(item.type || "Publication")}</span>
          ${item.year ? `<span>${esc(item.year)}</span>` : ""}
        </div>
        <h3>${esc(item.title)}${flag(item)}</h3>
        <p class="sub">
          ${esc([item.authors, item.venue].filter(Boolean).join(" · "))}
        </p>
        ${p(item.summary, "publication-summary")}
        ${linkList(item.links)}
      </div>
    </li>`;

  const project = (item) => `
    <li class="item">
      <div class="when">
        ${esc(item.period)}
        ${item.status ? `<br>${esc(item.status)}` : ""}
      </div>
      <div>
        <h3>${esc(item.title)}${flag(item)}</h3>
        ${p(item.summary)}
        ${linkList(item.links)}
      </div>
    </li>`;

  const experienceItem = (item) => `
    <li class="item">
      <div class="when">${esc(item.period)}</div>
      <div>
        <h3>${esc(item.role)}${flag(item)}</h3>
        <p class="sub">
          ${esc([item.organisation, item.location].filter(Boolean).join(" · "))}
        </p>
        ${p(item.summary)}
        ${item.highlights?.length ? `
          <ul class="highlights">
            ${item.highlights.map((highlight) => `<li>${esc(highlight)}</li>`).join("")}
          </ul>
        ` : ""}
        ${linkList(item.links)}
      </div>
    </li>`;

  /* Header and footer */
  const nav = asList(S.nav);

  $("#site-header").innerHTML = `
    <div class="wrap bar">
      <a class="brand" href="index.html">${esc(S.name || "Portfolio")}</a>
      <nav aria-label="Main navigation">
        <ul>
          ${nav.map((item) => `
            <li>
              <a href="${esc(safeUrl(item.file))}"
                ${item.id === page ? 'aria-current="page"' : ""}>
                ${esc(item.label)}
              </a>
            </li>
          `).join("")}
        </ul>
      </nav>
    </div>`;

  $("#site-footer").innerHTML = `
    <div class="wrap footer-inner">
      <span>© ${new Date().getFullYear()} ${esc(S.name || "")}</span>
      <span>${esc(S.footerNote || "")}</span>
    </div>`;

  const publications = asList(C.publications).slice().sort((a, b) =>
    String(b.year || "").localeCompare(String(a.year || ""))
  );

  const pages = {
    home() {
      const home = C.home || {};
      const photo = home.photo || S.photo || "";

      return `
        <section class="wrap hero">
          <div class="hero-rule" aria-hidden="true"></div>

          ${photo ? `
            <div class="hero-portrait">
              <img src="${esc(safeUrl(photo))}"
                alt="${esc(S.name || "Portrait")}"
                fetchpriority="high">
            </div>
          ` : ""}

          <div class="hero-copy">
            <p class="eyebrow">Research · Policy · International Security</p>
            <h1>${esc(S.name || "Portfolio")}</h1>
            <p class="role">${esc(S.role || "")}</p>
            ${p(home.intro, "lede")}
          </div>
        </section>

        ${sec("Research interests", tags(home.interests), "interests")}

        ${home.approach
          ? sec("Approach", `<p class="approach">${esc(home.approach)}</p>`, "approach")
          : ""}

        <section class="wrap home-next">
          <p class="eyebrow">Explore the portfolio</p>
          <div class="home-next-links">
            <a href="research.html">
              <span>Research & publications</span><span aria-hidden="true">↗</span>
            </a>
            <a href="experience.html">
              <span>Experience & engagement</span><span aria-hidden="true">↗</span>
            </a>
            <a href="about.html">
              <span>Background & methods</span><span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>`;
    },

    research() {
      const research = C.research || {};
      const types = [...new Set(
        publications.map((item) => item.type || "Publication")
      )];

      const publicationSections = types.map((type) =>
        sec(type, `
          <ul class="publication-list">
            ${publications
              .filter((item) => (item.type || "Publication") === type)
              .map(pub)
              .join("")}
          </ul>`)
      ).join("");

      const projects = asList(C.projects);

      return head("Research & publications", research.intro) +
        (publicationSections ||
          sec("Publications", '<p class="note">Publications will be added here.</p>')) +
        (projects.length
          ? sec("Research projects", `<ul class="list">${projects.map(project).join("")}</ul>`)
          : "");
    },

    experience() {
      const experience = C.experience || {};
      const groups = asList(experience.groups)
        .filter((group) => asList(group.entries).length);

      return head("Experience & engagement", experience.intro) +
        groups.map((group) =>
          sec(group.title, `
            <ul class="list">
              ${asList(group.entries).map(experienceItem).join("")}
            </ul>`)
        ).join("") +
        (!groups.length
          ? sec("Experience", '<p class="note">Experience details will be added here.</p>')
          : "");
    },

    about() {
      const about = C.about || {};

      return head("About", about.intro) +
        (asList(about.biography).length
          ? sec("Background", asList(about.biography).map((paragraph) => p(paragraph)).join(""))
          : "") +
        (asList(about.education).length
          ? sec("Education", `
              <ul class="list">
                ${asList(about.education).map((item) => `
                  <li class="item">
                    <div class="when">${esc(item.period)}</div>
                    <div>
                      <h3>${esc(item.degree)}${flag(item)}</h3>
                      <p class="sub">${esc(item.institution)}</p>
                      ${p(item.detail)}
                    </div>
                  </li>
                `).join("")}
              </ul>`)
          : "") +
        (asList(about.languages).length
          ? sec("Languages", `
              <dl class="dl">
                ${asList(about.languages).map((item) => `
                  <div class="dl-row">
                    <dt>${esc(item.language)}</dt>
                    <dd>${esc(item.level)}</dd>
                  </div>
                `).join("")}
              </dl>`)
          : "") +
        (asList(about.methods).length
          ? sec("Research methods", tags(about.methods))
          : "") +
        (asList(about.skills).length
          ? sec("Technical skills", tags(about.skills))
          : "") +
        (S.cvUrl
          ? sec("Curriculum vitae", `
              <p class="links">
                <a href="${esc(safeUrl(S.cvUrl))}" target="_blank" rel="noopener noreferrer">
                  Download CV ↗
                </a>
              </p>`)
          : "");
    },

    contact() {
      const contact = C.contact || {};
      const endpoint = contact.formEndpoint || "";

      const form = `
        <form class="contact-form" id="contact-form"
          ${endpoint ? `action="${esc(endpoint)}" method="POST"` : ""}>
          <div class="form-field">
            <label for="contact-name">Name</label>
            <input id="contact-name" name="name" autocomplete="name" required>
          </div>
          <div class="form-field">
            <label for="contact-email">Email address</label>
            <input id="contact-email" name="email" type="email" autocomplete="email" required>
          </div>
          <div class="form-field">
            <label for="contact-subject">Subject</label>
            <input id="contact-subject" name="_subject" required>
          </div>
          <div class="form-field">
            <label for="contact-message">Message</label>
            <textarea id="contact-message" name="message" rows="6" required></textarea>
          </div>
          ${endpoint
            ? '<button class="submit-button" type="submit">Send message <span aria-hidden="true">↗</span></button>'
            : '<button class="submit-button" type="button" disabled>Send message</button><p class="note">The form is not active yet. Configure a Formspree endpoint in content.json to enable message delivery.</p>'}
          <p class="form-status" id="form-status" role="status" aria-live="polite"></p>
        </form>`;

      return head("Contact", contact.intro ||
        "For research collaboration, policy work or institutional enquiries.") +
        sec("Send a message", form) +
        (asList(contact.profiles).length
          ? sec("Find me online", socialChips(contact.profiles))
          : "");
    }
  };

  main.innerHTML = (pages[page] || pages.home)();

  /* Contact form: enabled only when a Formspree endpoint is configured. */
  const contactForm = $("#contact-form");

  if (contactForm && contactForm.action && contactForm.getAttribute("action")) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const status = $("#form-status");
      const button = contactForm.querySelector("button[type='submit']");
      if (!status || !button) return;

      status.textContent = "Sending…";
      button.disabled = true;

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: new FormData(contactForm),
          headers: { Accept: "application/json" }
        });

        if (!response.ok) throw new Error("Form submission failed");

        contactForm.reset();
        status.textContent = "Thank you. Your message has been sent.";
      } catch (error) {
        status.textContent = "Sorry, the message could not be sent. Please try again later.";
      } finally {
        button.disabled = false;
      }
    });
  }
})();
