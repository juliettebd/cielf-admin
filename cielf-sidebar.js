// ============================================================
// cielf-sidebar.js
// Charge sidebar.html dans #sidebar-container
// Met en évidence le lien actif selon la page courante
// Branche le bouton déconnexion
// ============================================================
import { deconnexion } from "./cielf-admin-auth.js";

export async function chargerSidebar() {
  const container = document.getElementById("sidebar-container");
  if (!container) return;

  // Charge le HTML de la sidebar
  const reponse = await fetch("sidebar.html");
  const html    = await reponse.text();
  container.innerHTML = html;

  // Met le lien actif en surbrillance selon l'URL courante
  const pageCourante = window.location.pathname.split("/").pop() || "dashboard.html";
  container.querySelectorAll(".nav-item").forEach(function(lien) {
    const href = lien.getAttribute("href");
    if (href && href === pageCourante) {
      lien.classList.add("active");
    }
  });

  // Branche le bouton déconnexion
  const btnDeco = document.getElementById("btn-deconnexion");
  if (btnDeco) {
    btnDeco.addEventListener("click", deconnexion);
  }

  // Mobile : menu toggle
  const menuToggle     = document.getElementById("menu-toggle");
  const sidebar        = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebar-overlay");
  if (menuToggle && sidebar && sidebarOverlay) {
    menuToggle.addEventListener("click", function() {
      sidebar.classList.toggle("open");
      sidebarOverlay.classList.toggle("open");
    });
    sidebarOverlay.addEventListener("click", function() {
      sidebar.classList.remove("open");
      sidebarOverlay.classList.remove("open");
    });
  }
}

// Met à jour le nom et le rôle affichés dans la sidebar
// À appeler depuis requireAdmin() une fois l'utilisateur connu
export function majSidebarUser(nom, role) {
  const elNom  = document.getElementById("sidebar-nom");
  const elRole = document.getElementById("sidebar-role");
  if (elNom)  elNom.textContent  = nom;
  if (elRole) elRole.textContent = role === "admin" ? "Administratrice" : "Éditrice";
}
