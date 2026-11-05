
import { getApp, initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

// Use the same Firebase project as the existing MAFARM application.
const firebaseConfig = {
  apiKey: "AIzaSyA_LX4yzVFjyQ-PTqmlD-pzvjVfTcFHSNw",
  authDomain: "vehicle-details-d8d69.firebaseapp.com",
  projectId: "vehicle-details-d8d69",
  storageBucket: "vehicle-details-d8d69.firebasestorage.app",
  messagingSenderId: "1060071975299",
  appId: "1:1060071975299:web:cb81ad0ba403ba3a0faeb6",
  measurementId: "G-K6JKY2QMR0"
};

// Reuse the default app and login session created by app.js.
const mainApp = getApp();
const auth = getAuth(mainApp);
const db = getFirestore(mainApp);

// A separate Auth instance is used only to create employee accounts.
// It prevents the current Admin login from being replaced.
const provisionApp = initializeApp(firebaseConfig, "MAFARMUserProvisioning");
const provisionAuth = getAuth(provisionApp);

const $ = id => document.getElementById(id);

let isAdmin = false;
let currentAdminUid = null;

function loginEmailForCode(code) {
  const normalized = String(code || "").trim();

  if (normalized === "150884") {
    return "operationhead@mafarm.in";
  }

  return `${normalized}@mafarm-login.mafarm.in`;
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function showMessage(message, type = "success") {
  const element = $("userMessage");
  if (!element) return;

  element.textContent = message;
  element.className = `user-message ${type}`;
}

function setUserPageAccess(allowed) {
  const menu = $("usersNavBtn");

  if (menu) {
    menu.hidden = !allowed;
  }

  if (!allowed && $("users")?.classList.contains("active")) {
    $("dashboard")?.classList.add("active");
    $("users")?.classList.remove("active");

    document.querySelectorAll(".nav-btn").forEach(button => {
      button.classList.toggle("active", button.dataset.page === "dashboard");
    });

    if ($("pageTitle")) {
      $("pageTitle").textContent = "Vehicle Statutory Dashboard";
    }
  }
}

// Verify the current signed-in user's Firestore profile.
onAuthStateChanged(auth, async user => {
  isAdmin = false;
  currentAdminUid = user?.uid || null;
  setUserPageAccess(false);

  if (!user) return;

  try {
    const profileRef = doc(db, "User", user.uid);
    const profileSnap = await getDoc(profileRef);

    if (!profileSnap.exists()) return;

    const profile = profileSnap.data();

    const role = String(
      profile.Role ?? profile.role ?? ""
    ).toLowerCase();

    const active = profile.Active ?? profile.active;

    isAdmin = role === "admin" && active === true;

    setUserPageAccess(isAdmin);

    if (isAdmin) {
      await loadUsers();
    }
  } catch (error) {
    console.error("User Management permission check failed:", error);
    setUserPageAccess(false);
  }
});

// Load all registered users from Firestore.
async function loadUsers() {
  if (!isAdmin) return;

  const tbody = $("usersTable");
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="6">Loading employees...</td></tr>';

  try {
    const snapshot = await getDocs(collection(db, "User"));

    const users = snapshot.docs.map(item => ({
      uid: item.id,
      ...item.data()
    }));

    $("userCount").textContent = `${users.length} registered account(s)`;

    if (!users.length) {
      tbody.innerHTML = '<tr><td colspan="6">No employees registered.</td></tr>';
      return;
    }

    tbody.innerHTML = users.map(user => {
      const code = user["Employee Code"] ?? user.employeeCode ?? "";
      const name = user.Name ?? user.name ?? "";
      const email = user.Email ?? user.email ?? "";
      const role = user.Role ?? user.role ?? "Employee";
      const active = (user.Active ?? user.active) === true;

      const isCurrentUser = user.uid === currentAdminUid;

      const action = isCurrentUser
        ? '<span class="current-user-label">Current Admin</span>'
        : `<button
             type="button"
             class="user-action-btn ${active ? "deactivate" : "activate"}"
             data-user-id="${escapeHTML(user.uid)}"
             data-user-active="${active}">
             ${active ? "Deactivate" : "Activate"}
           </button>`;

      return `
        <tr>
          <td><strong>${escapeHTML(code)}</strong></td>
          <td>${escapeHTML(name)}</td>
          <td>${escapeHTML(email)}</td>
          <td><span class="role-label">${escapeHTML(role)}</span></td>
          <td>
            <span class="user-status ${active ? "active" : "inactive"}">
              ${active ? "ACTIVE" : "INACTIVE"}
            </span>
          </td>
          <td>${action}</td>
        </tr>
      `;
    }).join("");

  } catch (error) {
    console.error("Load users failed:", error);

    $("userCount").textContent = "Unable to load";
    tbody.innerHTML =
      '<tr><td colspan="6">Unable to load employees. Please check Firestore Rules.</td></tr>';
  }
}

// Create a new Firebase Authentication account and Firestore profile.
async function createEmployee(event) {
  event.preventDefault();

  if (!isAdmin || !auth.currentUser) {
    showMessage("Only an active Admin can create employee accounts.", "error");
    return;
  }

  const code = $("uEmployeeCode").value.trim();
  const name = $("uName").value.trim();
  const email = $("uEmail").value.trim();
  const password = $("uPassword").value;
  const role = $("uRole").value;

  if (!code || !name || !email || !password) {
    showMessage("Please complete all required fields.", "error");
    return;
  }

  if (!/^[A-Za-z0-9_-]+$/.test(code)) {
    showMessage("Employee Code may contain letters, numbers, hyphens and underscores only.", "error");
    return;
  }

  if (code === "150884") {
    showMessage("Employee Code 150884 is reserved for the main Admin account.", "error");
    return;
  }

  if (password.length < 6) {
    showMessage("Password must contain at least 6 characters.", "error");
    return;
  }

  const button = $("createUserBtn");
  button.disabled = true;
  button.textContent = "Creating Account...";

  let newAuthUser = null;
  let profileSaved = false;

  try {
    // Confirm that the employee code has not already been registered.
    const snapshot = await getDocs(collection(db, "User"));

    const duplicate = snapshot.docs.some(item => {
      const existingCode =
        item.data()["Employee Code"] ?? item.data().employeeCode ?? "";

      return String(existingCode).trim().toLowerCase() === code.toLowerCase();
    });

    if (duplicate) {
      throw new Error("This Employee Code is already registered.");
    }

    const loginEmail = loginEmailForCode(code);

    // Create account through secondary Auth instance.
    const credential = await createUserWithEmailAndPassword(
      provisionAuth,
      loginEmail,
      password
    );

    newAuthUser = credential.user;

    // Save employee profile using the Admin's main Firestore session.
    await setDoc(doc(db, "User", newAuthUser.uid), {
      "Employee Code": code,
      "Name": name,
      "Email": email,
      "Role": role,
      "Active": true,
      "Login Email": loginEmail,
      "Created At": new Date().toISOString()
    });

    profileSaved = true;

    await signOut(provisionAuth);

    $("userForm").reset();

    showMessage(
      `Account created successfully for ${name}. Login Employee Code: ${code}`,
      "success"
    );

    await loadUsers();

  } catch (error) {
    console.error("Employee creation error:", error);

    if (newAuthUser && !profileSaved) {
      showMessage(
        "Firebase login was created but the employee profile could not be saved. Check Firestore create permissions before retrying.",
        "error"
      );
    } else if (error.code === "auth/email-already-in-use") {
      showMessage("An account already exists for this Employee Code.", "error");
    } else if (error.code === "auth/weak-password") {
      showMessage("Please enter a stronger password.", "error");
    } else {
      showMessage(error.message || "Unable to create employee account.", "error");
    }

    try {
      await signOut(provisionAuth);
    } catch (signOutError) {
      console.warn("Secondary sign-out:", signOutError);
    }

  } finally {
    button.disabled = false;
    button.textContent = "Create Employee Account";
  }
}

// Activate or deactivate an employee profile.
async function changeUserStatus(uid, currentlyActive) {
  if (!isAdmin) return;

  if (uid === currentAdminUid) {
    alert("You cannot deactivate your own Admin account.");
    return;
  }

  const newStatus = !currentlyActive;

  const confirmed = confirm(
    `Are you sure you want to ${newStatus ? "activate" : "deactivate"} this account?`
  );

  if (!confirmed) return;

  try {
    await setDoc(
      doc(db, "User", uid),
      { "Active": newStatus },
      { merge: true }
    );

    await loadUsers();

  } catch (error) {
    console.error("Status update failed:", error);
    alert("Unable to update employee status. Check Firestore Rules.");
  }
}

// Form submission.
$("userForm")?.addEventListener("submit", createEmployee);

// Refresh employee list.
$("refreshUsersBtn")?.addEventListener("click", loadUsers);

// Activate / deactivate buttons.
$("usersTable")?.addEventListener("click", event => {
  const button = event.target.closest("[data-user-id]");
  if (!button) return;

  changeUserStatus(
    button.dataset.userId,
    button.dataset.userActive === "true"
  );
});

// Update page title after the existing app.js navigation handler runs.
$("usersNavBtn")?.addEventListener("click", () => {
  setTimeout(() => {
    if ($("users")?.classList.contains("active") && isAdmin) {
      $("pageTitle").textContent = "User Management";
      loadUsers();
    }
  }, 0);
});
