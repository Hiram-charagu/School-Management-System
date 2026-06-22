(function () {
  const app = document.querySelector(".app");
  const sidebar = document.querySelector(".sidebar");
  const topbar = document.querySelector(".topbar");
  if (!app || !sidebar || !topbar) return;

  if (!document.getElementById("portal-ui-style")) {
    const style = document.createElement("style");
    style.id = "portal-ui-style";
    style.textContent = `
      .menu-toggle { display:none; border:none; background:#0f172a; color:#fff; border-radius:8px; width:36px; height:36px; cursor:pointer; }
      .sidebar-overlay { display:none; }
      .portal-footer { margin: 1rem; margin-top: .5rem; background:#0f172a; color:#e2e8f0; text-align:center; padding:.8rem; border-radius:10px; }
      .portal-footer p { margin: 0; font-size: .9rem; }
      .lecturer-header-center { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:.35rem; margin:0 auto; text-align:center; }
      .lecturer-header-center .logo-img { width:48px; height:48px; margin:0 auto; }
      .lecturer-profile-chip { margin-left:auto; display:flex; flex-direction:column; align-items:flex-end; gap:2px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:.35rem .55rem; }
      .lecturer-profile-chip strong { font-size:.85rem; line-height:1.1; color:#0f172a; }
      .lecturer-profile-chip span { font-size:.75rem; color:#475569; line-height:1.1; }
      @media (max-width: 992px){
        .menu-toggle { display:inline-flex; align-items:center; justify-content:center; }
        .app { grid-template-columns: 1fr !important; }
        .sidebar {
          position: fixed;
          top: 0;
          left: -270px;
          width: 260px;
          height: 100vh;
          z-index: 1001;
          transition: left .22s ease;
        }
        .app.sidebar-open .sidebar { left: 0; }
        .sidebar-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15,23,42,.45);
          z-index: 1000;
          display: none;
        }
        .app.sidebar-open .sidebar-overlay { display:block; }
        body.no-scroll { overflow: hidden; }
        .lecturer-profile-chip { display:none; }
      }
    `;
    document.head.appendChild(style);
  }

  if (!document.querySelector(".menu-toggle")) {
    const btn = document.createElement("button");
    btn.className = "menu-toggle";
    btn.type = "button";
    btn.setAttribute("aria-label", "Open menu");
    btn.textContent = "\u2630";
    topbar.prepend(btn);
  }

  let overlay = document.querySelector(".sidebar-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "sidebar-overlay";
    app.appendChild(overlay);
  }

  const open = () => {
    app.classList.add("sidebar-open");
    document.body.classList.add("no-scroll");
  };
  const close = () => {
    app.classList.remove("sidebar-open");
    document.body.classList.remove("no-scroll");
  };

  document.querySelector(".menu-toggle")?.addEventListener("click", () => {
    if (app.classList.contains("sidebar-open")) close();
    else open();
  });
  overlay.addEventListener("click", close);

  document.querySelectorAll(".menu a, .logout").forEach((a) => a.addEventListener("click", close));

  if (!document.querySelector(".portal-footer")) {
    const footer = document.createElement("footer");
    footer.className = "portal-footer";
    footer.innerHTML = "<p>&copy; 2026 Umma University. All rights reserved.</p>";
    app.insertAdjacentElement("afterend", footer);
  }

  // Lecturer header layout: logo above centered heading + profile at right
  if (localStorage.getItem("umma_user_role") === "lecturer" && topbar) {
    const heading = topbar.querySelector("h2");
    const logo = topbar.querySelector(".logo-img");

    if (heading) {
      const center = document.createElement("div");
      center.className = "lecturer-header-center";

      if (logo) {
        logo.remove();
        center.appendChild(logo);
      }

      heading.remove();
      center.appendChild(heading);
      topbar.appendChild(center);
    }

    let profile = {};
    try {
      profile = JSON.parse(localStorage.getItem("umma_lecturer_profile") || "{}");
    } catch {}

    if (!topbar.querySelector(".lecturer-profile-chip")) {
      const chip = document.createElement("div");
      chip.className = "lecturer-profile-chip";
      chip.innerHTML = `<strong>${profile.fullName || "Lecturer"}</strong><span>${profile.staffNo || ""}</span>`;
      topbar.appendChild(chip);
    }
  }
})();
