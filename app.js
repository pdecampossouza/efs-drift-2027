"use strict";

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.getElementById("main-nav");
function closeMenu() {
  navigation.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
}
menuButton.addEventListener("click", () => {
  const expanded = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(expanded));
  navigation.classList.toggle("is-open", expanded);
});
navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menuButton.focus();
  }
});
window.matchMedia("(min-width: 821px)").addEventListener("change", closeMenu);

// Schematic membership functions only: no empirical data or measured results.
const curveGroup = document.getElementById("curve-series");
const ns = "http://www.w3.org/2000/svg";
const rows = [
  { baseline: 72, means: [150, 270, 360], widths: [31, 34, 26] },
  { baseline: 157, means: [150, 292, 365], widths: [31, 43, 26] },
  { baseline: 242, means: [150, 310, 370], widths: [31, 34, 23] },
];
rows.forEach((row, rowIndex) => {
  row.means.forEach((mean, i) => {
    const path = document.createElementNS(ns, "path");
    const points = [];
    for (let x = 60; x <= 430; x += 2) {
      const y = row.baseline - 56 * Math.exp(-0.5 * ((x - mean) / row.widths[i]) ** 2);
      points.push(`${x},${y.toFixed(2)}`);
    }
    path.setAttribute("d", `M${points.join(" L")}`);
    path.setAttribute("fill", i === 1 ? "url(#fill-orange)" : "url(#fill-mint)");
    path.setAttribute("stroke", i === 1 ? "#ffb38f" : "#a3dcc7");
    path.setAttribute("stroke-width", i === 1 ? "2.5" : "1.7");
    path.setAttribute("opacity", i === 2 ? "0.55" : "1");
    if (rowIndex < 2) path.classList.add("curve-earlier");
    curveGroup.appendChild(path);
  });
});

const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
const panel = document.getElementById("concept-content");
const caption = document.getElementById("concept-caption");
const captions = {
  detect: "Identify where and when change occurs, and distinguish persistent drift from noise.",
  adapt: "Update parameters, rules and memory as conditions change, while managing complexity and resources.",
  explain: "Track the meaning of evolving rules and make adaptation decisions understandable over time.",
};
function selectTab(tab, focus = false) {
  tabs.forEach((item) => {
    const selected = item === tab;
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  panel.dataset.mode = tab.dataset.mode;
  panel.setAttribute("aria-labelledby", tab.id);
  caption.textContent = captions[tab.dataset.mode];
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", (event) => {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      selectTab(tabs[next], true);
    }
  });
});

document.getElementById("share-button").addEventListener("click", async () => {
  const status = document.getElementById("share-status");
  let timeout;
  status.textContent = "Copying page link…";
  try {
    await Promise.race([
      navigator.clipboard.writeText(window.location.origin + window.location.pathname),
      new Promise((_, reject) => { timeout = setTimeout(() => reject(new Error("Clipboard unavailable")), 2500); }),
    ]);
    status.textContent = "Link copied. Thank you for sharing the session!";
  } catch {
    status.textContent = "Please copy the page URL from your browser’s address bar.";
  } finally {
    clearTimeout(timeout);
  }
});
