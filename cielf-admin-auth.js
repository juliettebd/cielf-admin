// ============================================================
// cielf-admin-auth.js
// Vérifie que l'utilisateur est connecté ET admin/éditeur
// À inclure en premier script sur chaque page protégée
// ============================================================

import { initializeApp }                        from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc }            from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey:            "AIzaSyD7JCajQFLChA-1qa-_QfuadAeKlrb58ek",
  authDomain:        "cielf-membres.firebaseapp.com",
  projectId:         "cielf-membres",
  storageBucket:     "cielf-membres.firebasestorage.app",
  messagingSenderId: "534062662676",
  appId:             "1:534062662676:web:eab7dbe36db86716195301"
};

export const app  = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);

/**
 * Vérifie l'auth et le rôle admin.
 * @param {Function} onReady(user, role) — appelée si tout est OK
 * @param {string}   roleMin — "editeur" ou "admin" (défaut: "editeur")
 */
export function requireAdmin(onReady, roleMin = "editeur") {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "index.html";
      return;
    }
    const adminDoc = await getDoc(doc(db, "admins", user.uid));
    if (!adminDoc.exists()) {
      await signOut(auth);
      window.location.href = "index.html";
      return;
    }
    const role = adminDoc.data().role;
    // Si on exige "admin" et que l'utilisateur est seulement "editeur" → accès refusé
    if (roleMin === "admin" && role !== "admin") {
      window.location.href = "dashboard.html";
      return;
    }
    // Refresh sessionStorage
    sessionStorage.setItem("cielf_admin_role",  role);
    sessionStorage.setItem("cielf_admin_email", user.email);
    sessionStorage.setItem("cielf_admin_nom",   adminDoc.data().prenom || user.email);
    onReady(user, role);
  });
}

export async function deconnexion() {
  await signOut(auth);
  sessionStorage.clear();
  window.location.href = "index.html";
}
