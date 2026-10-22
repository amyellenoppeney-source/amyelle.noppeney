/* Renders every page from content.json. You normally never edit this file. */
(async () => {
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const safeUrl = (u) => (/^(https?:|mailto:|files\/|[\w./-]+\.(pdf|html)$)/i.test(u || "") ? u : "#");
  const page = document.body.dataset.page;

  let C;
  try {
    const r = await fetch("content.json");
    if (!r.ok) throw new Error(r.status);
    C = await r.json();
  } catch (e) {
    $("#main").innerHTML = '<p class="wrap note">Content could not be loaded. If you opened the file directly, run a local server (see README). Otherwise check content.json for a typo.</p>';
    return;
  }
  const S = C.site;
  const p = (v) => (v ? `<p>${esc(v)}</p>` : "");
  const list = (a) => (a && a.length ? a : []);
  const tagList = (a) => `<ul class="tags">${list(a).map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;
  const flag = (it) => (it.placeholder ? '<span class="flag">Placeholder</span>' : "");
  const links = (ls) => {
    const out = list(ls).map((l) => `<a href="${esc(safeUrl(l.url))}"${/^https?:/.test(l.url) ? ' rel="noopener"' : ""}${l.download ? " download" : ""}>${esc(l.label)}</a>`);
    return out.length ? `<p class="links">${out.join("")}</p>` : "";
  };
  const sec = (title, body, id) => `<section class="wrap sec"${id ? ` id="${id}"` : ""}><h2>${title}</h2><div class="sec-body">${body}</div></section>`;
  const head = (h, intro) => `<div class="wrap page-head"><h1>${esc(h)}</h1>${intro ? `<p>${esc(intro)}</p>` : ""}</div>`;

  const pub = (x) => `<li class="item"><div class="when">${esc(x.year)}<br>${esc(x.type)}</div><div>
    <h3>${esc(x.title)}${flag(x)}</h3><p class="sub">${esc([x.authors, x.venue].filter(Boolean).join(", "))}</p>${p(x.summary)}${links(x.links)}</div></li>`;
  const proj = (x) => `<li class="item"><div class="when">${esc(x.period)}<br>${esc(x.status)}</div><div>
    <h3>${esc(x.title)}${flag(x)}</h3>${p(x.summary)}${links(x.links)}</div></li>`;
  const exp = (x) => `<li class="item"><div class="when">${esc(x.period)}</div><div>
    <h3>${esc(x.role)}${flag(x)}</h3><p class="sub">${esc([x.organisation, x.location].filter(Boolean).join(", "))}</p>${p(x.summary)}
    ${x.highlights && x.highlights.length ? `<ul>${x.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>` : ""}</div></li>`;

  // Header and footer
  $("#site-header").innerHTML = `<div class="wrap bar"><a class="brand" href="index.html">${esc(S.name)}</a>
    <nav aria-label="Main"><ul>${S.nav.map((n) => `<li><a href="${esc(n.file)}"${n.id === page ? ' aria-current="page"' : ""}>${esc(n.label)}</a></li>`).join("")}</ul></nav></div>`;
  $("#site-footer").innerHTML = `<div class="wrap"><span>&copy; ${new Date().getFullYear()} ${esc(S.name)}</span><span>${esc(S.footerNote)}</span></div>`;

  const pubs = list(C.publications).slice().sort((a, b) => String(b.year).localeCompare(String(a.year)));
  const B = {
    home() {
      const h = C.home;
      return `<div class="wrap hero"><div class="rule" aria-hidden="true"></div><div>
        <h1>${esc(S.name)}</h1><p class="role">${esc(S.role)}</p><p class="lede">${esc(h.intro)}</p></div></div>` +
        sec("Research interests", tagList(h.interests)) +
        sec("Selected publications", `<ul class="list">${pubs.filter((x) => x.featured).map(pub).join("") || '<li class="note">No featured publications yet.</li>'}</ul><p class="more"><a href="research.html">All research and publications</a></p>`) +
        sec("Featured projects", `<ul class="list">${list(C.projects).filter((x) => x.featured).map(proj).join("") || '<li class="note">No featured projects yet.</li>'}</ul>`);
    },
    research() {
      const types = [...new Set(pubs.map((x) => x.type))];
      return head("Research and publications", C.research.intro) +
        types.map((t) => sec(esc(t) + "s", `<ul class="list">${pubs.filter((x) => x.type === t).map(pub).join("")}</ul>`)).join("") +
        sec("Research projects", `<ul class="list">${list(C.projects).map(proj).join("")}</ul>`);
    },
    experience() {
      const E = C.experience;
      return head("Experience", E.intro) +
        E.groups.map((g) => sec(esc(g.title), `<ul class="list">${list(g.entries).map(exp).join("")}</ul>`)).join("");
    },
    about() {
      const A = C.about;
      return head("About", A.intro) +
        sec("Background", list(A.biography).map(p).join("")) +
        sec("Education", `<ul class="list">${list(A.education).map((x) => `<li class="item"><div class="when">${esc(x.period)}</div><div><h3>${esc(x.degree)}${flag(x)}</h3><p class="sub">${esc(x.institution)}</p>${p(x.detail)}</div></li>`).join("")}</ul>`) +
        sec("Languages", `<dl class="dl">${list(A.languages).map((l) => `<dt>${esc(l.language)}</dt><dd>${esc(l.level)}</dd>`).join("")}</dl>`) +
        sec("Methods", tagList(A.methods)) +
        sec("Technical skills", tagList(A.skills));
    },
    contact() {
      const K = C.contact, em = K.email;
      return head("Contact", K.intro) +
        sec("Email", em ? `<a class="big-link" href="mailto:${esc(em)}">${esc(em)}</a>${em.includes("example") ? '<p class="note">This is a placeholder address. Replace it in content.json.</p>' : ""}` : '<p class="note">No public email set.</p>') +
        sec("Profiles", `<ul class="list">${list(K.profiles).map((x) => `<li class="item"><div class="when">${esc(x.label)}</div><div><a href="${esc(safeUrl(x.url))}" rel="noopener">${esc(x.url)}</a></div></li>`).join("")}</ul>`);
    },
  };
  $("#main").innerHTML = (B[page] || B.home)();
})();
