// ============================================================
// MAFARM VEHICLE STATUTORY SYSTEM - FIREBASE CLOUD VERSION
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getFirestore,
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  getDocs,
  writeBatch
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

// ============================================================
// FIREBASE CONFIGURATION
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyA_LX4yZFVjyQ-PTqmlD-pzvjVfTcFHSNw",
  authDomain: "vehicle-details-d8d69.firebaseapp.com",
  projectId: "vehicle-details-d8d69",
  storageBucket: "vehicle-details-d8d69.firebasestorage.app",
  messagingSenderId: "1060071975299",
  appId: "1:1060071975299:web:cb81ad0ba403ba3a0faeb6",
  measurementId: "G-K6JKY2QMR0"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

let currentRole = null;
let currentUserProfile = null;

const vehiclesRef = collection(db, "Vehicles");

let firebaseReady = false;
let firebaseUnsubscribe = null;

// ============================================================
// LOGIN FUNCTIONS
// ============================================================

function loginEmailForCode(code) {
  const normalized = String(code || "").trim();

  if (normalized === "150884") {
    return "operationhead@mafarm.in";
  }

  return `${normalized}@mafarm-login.mafarm.in`;
}

function setAccessUI(role) {
  const admin = String(role || "").toLowerCase() === "admin";

  $("addVehicleBtn").hidden = !admin;
  $("importBtn").hidden = !admin;
  $("migrateVehiclesBtn").hidden = !admin;

  $("vehicleModal").querySelectorAll("input,button").forEach(el => {
    if (el.id !== "closeModal" && el.id !== "cancelModal") {
      el.disabled = !admin;
    }
  });

  $("vehicleModal").querySelector(".modal-actions").hidden = !admin;

  document.querySelectorAll(".action-btn").forEach(el => {
    if (el.classList.contains("mail-btn")) return;
    el.hidden = !admin;
  });

  $("authUserLabel").textContent =
    currentUserProfile?.name ||
    currentUserProfile?.employeeCode ||
    "Signed in";

  $("logoutBtn").hidden = false;
}

function showLogin(message = "") {
  $("loginOverlay").hidden = false;
  $("loginMessage").textContent = message;
  $("appShell").hidden = true;
}

async function handleLogin(event) {
  event.preventDefault();

  const code = $("loginEmployeeCode").value.trim();
  const password = $("loginPassword").value;

  if (!code || !password) return;

  $("loginSubmit").disabled = true;
  $("loginMessage").textContent = "Signing in...";

  try {
    await signInWithEmailAndPassword(
      auth,
      loginEmailForCode(code),
      password
    );
  } catch (error) {
    console.error(error);

    $("loginMessage").textContent =
      "Login failed. Check employee code and password, or contact the administrator.";
  } finally {
    $("loginSubmit").disabled = false;
  }
}

// ============================================================
// ORIGINAL 43 VEHICLE RECORDS
// ============================================================

const INITIAL_DATA = [
  {
    sl: 1,
    vehicleNo: "KL 75 C 1725",
    model: "BAJAJ PLATINA 100 ES",
    vehicleType: "2 WL",
    unit: "POS 3",
    registrationDate: "2022-08-13",
    fitnessExpiry: "2037-09-12",
    insuranceExpiry: "2027-08-11",
    taxExpiry: "2037-06-30",
    pollutionExpiry: "2027-07-22"
  },
  {
    sl: 2,
    vehicleNo: "KL 75 C 1715",
    model: "BAJAJ PLATINA 100 ES",
    vehicleType: "2 WL",
    unit: "RESTAURANT",
    registrationDate: "2022-08-13",
    fitnessExpiry: "2037-08-12",
    insuranceExpiry: "2027-08-11",
    taxExpiry: "2037-06-30",
    pollutionExpiry: "2026-09-23"
  },
  {
    sl: 3,
    vehicleNo: "KL 75 C 1785",
    model: "BAJAJ PLATINA 100 ES",
    vehicleType: "2 WL",
    unit: "COMMON",
    registrationDate: "2022-08-13",
    fitnessExpiry: "2037-08-12",
    insuranceExpiry: "2027-08-11",
    taxExpiry: "2037-06-30",
    pollutionExpiry: "2027-07-07"
  },
  {
    sl: 4,
    vehicleNo: "KL 75 C 1705",
    model: "BAJAJ PLATINA 100 ES",
    vehicleType: "2 WL",
    unit: "COMMON",
    registrationDate: "2022-08-13",
    fitnessExpiry: "2037-08-12",
    insuranceExpiry: "2027-08-11",
    taxExpiry: "2037-06-30",
    pollutionExpiry: "2027-07-14"
  },
  {
    sl: 5,
    vehicleNo: "KL 46 M 7115",
    model: "TVS STAR CITY",
    vehicleType: "2WL",
    unit: "FARM",
    registrationDate: "2015-12-07",
    fitnessExpiry: "2030-12-06",
    insuranceExpiry: "2026-12-28",
    taxExpiry: "2030-09-30",
    pollutionExpiry: "2027-02-11"
  },
  {
    sl: 6,
    vehicleNo: "KL  75 A 6528",
    model: "TVS XL 100 HEAVY DUTY",
    vehicleType: "2WL",
    unit: "KITCHEN",
    registrationDate: "2020-09-17",
    fitnessExpiry: "2035-09-16",
    insuranceExpiry: "2027-09-03",
    taxExpiry: "2035-06-30",
    pollutionExpiry: "2026-08-07"
  },
  {
    sl: 7,
    vehicleNo: "KL 75 A 7891",
    model: "TVS XL 100 HEAVY DUTY",
    vehicleType: "2WL",
    unit: "KITCHEN",
    registrationDate: "2020-11-10",
    fitnessExpiry: "2035-11-09",
    insuranceExpiry: "2027-09-25",
    taxExpiry: "2035-06-30",
    pollutionExpiry: "2026-01-08"
  },
  {
    sl: 8,
    vehicleNo: "KL 75 8739",
    model: "TVS XL 100 HEAVY DUTY",
    vehicleType: "2WL",
    unit: "PERINGOTTUKARA FARM",
    registrationDate: "2019-08-08",
    fitnessExpiry: "2034-08-07",
    insuranceExpiry: "2027-08-07",
    taxExpiry: "2034-06-30",
    pollutionExpiry: "2026-09-30"
  },
  {
    sl: 9,
    vehicleNo: "KL 75 A 6543",
    model: "TVS XL 100 HEAVY DUTY",
    vehicleType: "2WL",
    unit: "RESTAURANT",
    registrationDate: "2020-09-17",
    fitnessExpiry: "2035-09-16",
    insuranceExpiry: "2027-09-03",
    taxExpiry: "2035-06-30",
    pollutionExpiry: "2027-08-11"
  },
  {
    sl: 10,
    vehicleNo: "KL 75 A 7810",
    model: "TVS XL 100 HEAVY DUTY",
    vehicleType: "2WL",
    unit: "POS 2",
    registrationDate: "2020-11-10",
    fitnessExpiry: "2035-11-09",
    insuranceExpiry: "2027-09-25",
    taxExpiry: "2035-06-30",
    pollutionExpiry: "2026-07-27"
  },
  {
    sl: 11,
    vehicleNo: "KL 75 A 7847",
    model: "TVS XL 100 HEAVY DUTY",
    vehicleType: "2WL",
    unit: "KITCHEN",
    registrationDate: "2020-11-10",
    fitnessExpiry: "2035-11-09",
    insuranceExpiry: "2027-09-25",
    taxExpiry: "2035-06-30",
    pollutionExpiry: "2027-04-06"
  },
  {
    sl: 12,
    vehicleNo: "KL 75 8052",
    model: "TVS XL 100 HEAVY DUTY",
    vehicleType: "2WL",
    unit: "PAINOOR FARM",
    registrationDate: "2019-07-15",
    fitnessExpiry: "2034-07-14",
    insuranceExpiry: "2027-09-05",
    taxExpiry: "2034-03-31",
    pollutionExpiry: "2026-07-28"
  },
  {
    sl: 13,
    vehicleNo: "KL 75 B 2806",
    model: "TVS XL 100 HEAVY DUTY",
    vehicleType: "2WL",
    unit: "POS 2",
    registrationDate: "2021-07-09",
    fitnessExpiry: "2036-07-08",
    insuranceExpiry: "2027-07-07",
    taxExpiry: "2036-06-30",
    pollutionExpiry: "2026-11-09"
  },
  {
    sl: 14,
    vehicleNo: "KL 75 B 2861",
    model: "TVS XL 100 HEAVY DUTY",
    vehicleType: "2WL",
    unit: "POS 1",
    registrationDate: "2021-07-09",
    fitnessExpiry: "2036-07-08",
    insuranceExpiry: "2027-07-07",
    taxExpiry: "2036-06-30",
    pollutionExpiry: "2025-11-18"
  },
  {
    sl: 15,
    vehicleNo: "KL 75 B 0388",
    model: "MAHINDRA ALFA",
    vehicleType: "3WL",
    unit: "CHAIRMAN CAMPUS FARM",
    registrationDate: "2021-02-20",
    fitnessExpiry: "2027-04-25",
    insuranceExpiry: "2027-02-03",
    taxExpiry: "2026-12-31",
    pollutionExpiry: "2027-03-12"
  },
  {
    sl: 16,
    vehicleNo: "KL 75 B 0743",
    model: "MAHINDRA ALFA",
    vehicleType: "3WL",
    unit: "PAINOOR FARM",
    registrationDate: "2021-03-09",
    fitnessExpiry: "2027-04-25",
    insuranceExpiry: "2027-01-02",
    taxExpiry: "2026-09-30",
    pollutionExpiry: "2025-09-25"
  },
  {
    sl: 17,
    vehicleNo: "KL 46 F 3737",
    model: "PIAGGIO APE DEL VAN",
    vehicleType: "3WL",
    unit: "CHAIRMAN CAMPUS FARM",
    registrationDate: "2012-02-13",
    fitnessExpiry: "2027-03-25",
    insuranceExpiry: "2027-01-29",
    taxExpiry: "2026-12-31",
    pollutionExpiry: "2027-01-10"
  },
  {
    sl: 18,
    vehicleNo: "KL 75 B 2606",
    model: "PIAGGIO APE AUTO DX",
    vehicleType: "3WL",
    unit: "POS 2",
    registrationDate: "2021-06-30",
    fitnessExpiry: "2036-06-29",
    insuranceExpiry: "2027-07-02",
    taxExpiry: "2036-03-31",
    pollutionExpiry: "2026-10-06"
  },
  {
    sl: 19,
    vehicleNo: "KL 75 B 4070",
    model: "MAHINDRA ALPHA PASSANGER",
    vehicleType: "3WL",
    unit: "KITCHEN",
    registrationDate: "2021-07-28",
    fitnessExpiry: "2036-07-27",
    insuranceExpiry: "2027-08-16",
    taxExpiry: "2036-06-30",
    pollutionExpiry: "2026-10-14"
  },
  {
    sl: 20,
    vehicleNo: "KL 75 C 2644",
    model: "FORCE TRAVELLER DELIVERY VAN",
    vehicleType: "4 WL",
    unit: "RETAIL CC",
    registrationDate: "2022-09-13",
    fitnessExpiry: "2026-10-31",
    insuranceExpiry: "2027-09-03",
    taxExpiry: "2026-12-31",
    pollutionExpiry: "2026-09-15"
  },
  {
    sl: 21,
    vehicleNo: "KL 75 C 3282",
    model: "MARUTI SUZUKI EECO CARGO",
    vehicleType: "4 WL",
    unit: "VAP",
    registrationDate: "2022-10-08",
    fitnessExpiry: "2026-10-14",
    insuranceExpiry: "2027-09-30",
    taxExpiry: "2027-09-30",
    pollutionExpiry: "2027-01-05"
  },
  {
    sl: 22,
    vehicleNo: "KL 75 C 1515",
    model: "MAHINDRA BOLORO",
    vehicleType: "4 WL",
    unit: "HO COMMON",
    registrationDate: "2022-06-27",
    fitnessExpiry: "2037-06-26",
    insuranceExpiry: "2027-05-27",
    taxExpiry: "2037-03-31",
    pollutionExpiry: "2027-06-29"
  },
  {
    sl: 23,
    vehicleNo: "KL 75 C 2253",
    model: "MAHINDRA JEETO",
    vehicleType: "4 WL",
    unit: "VAP",
    registrationDate: "2022-09-01",
    fitnessExpiry: "2026-08-31",
    insuranceExpiry: "2027-09-08",
    taxExpiry: "2027-06-30",
    pollutionExpiry: "2027-08-10"
  },
  {
    sl: 24,
    vehicleNo: "KL 75 C 2359",
    model: "MAHINDRA JEETO",
    vehicleType: "4 WL",
    unit: "VAP",
    registrationDate: "2022-09-01",
    fitnessExpiry: "2026-09-05",
    insuranceExpiry: "2027-09-06",
    taxExpiry: "2027-06-30",
    pollutionExpiry: "2027-08-12"
  },
  {
    sl: 25,
    vehicleNo: "KL 46 D 4545",
    model: "BOLERO",
    vehicleType: "4WL",
    unit: "VAP",
    registrationDate: "2010-10-29",
    fitnessExpiry: "2030-10-27",
    insuranceExpiry: "2026-10-28",
    taxExpiry: "2030-09-30",
    pollutionExpiry: "2026-10-09"
  },
  {
    sl: 26,
    vehicleNo: "KL 75 9196",
    model: "BOLERO PICK UP",
    vehicleType: "4WL",
    unit: "PAINOOR FARM",
    registrationDate: "2019-08-27",
    fitnessExpiry: "2026-07-16",
    insuranceExpiry: "2027-08-08",
    taxExpiry: "2026-12-31",
    pollutionExpiry: "2026-07-04"
  },
  {
    sl: 27,
    vehicleNo: "KL 75 A 9564",
    model: "BOLERO PICK UP",
    vehicleType: "4WL",
    unit: "PAINOOR FARM",
    registrationDate: "2021-01-22",
    fitnessExpiry: "2027-04-07",
    insuranceExpiry: "2027-01-19",
    taxExpiry: "2026-12-31",
    pollutionExpiry: "2027-04-05"
  },
  {
    sl: 28,
    vehicleNo: "KL 46 G 9191",
    model: "DOST LE GOODS",
    vehicleType: "4WL",
    unit: "FARM CC",
    registrationDate: "2013-01-03",
    fitnessExpiry: "2027-07-22",
    insuranceExpiry: "2026-12-29",
    taxExpiry: "2027-09-30",
    pollutionExpiry: "2027-01-17"
  },
  {
    sl: 29,
    vehicleNo: "KL 75 B 4164",
    model: "MAHINDR SUPRO",
    vehicleType: "4WL",
    unit: "RETAIL CC",
    registrationDate: "2021-09-01",
    fitnessExpiry: "2027-11-23",
    insuranceExpiry: "2027-08-16",
    taxExpiry: "2027-06-30",
    pollutionExpiry: "2026-11-23"
  },
  {
    sl: 30,
    vehicleNo: "KL 75 B 4197",
    model: "BOLERO PICK UP",
    vehicleType: "4WL",
    unit: "Resturant",
    registrationDate: "2021-09-01",
    fitnessExpiry: "2027-10-29",
    insuranceExpiry: "2027-08-01",
    taxExpiry: "2026-09-30",
    pollutionExpiry: "2027-01-26"
  },
  {
    sl: 31,
    vehicleNo: "KL 75 C 3684",
    model: "TATA ACE GOLD",
    vehicleType: "4WL",
    unit: "KITCHEN",
    registrationDate: "2022-10-25",
    fitnessExpiry: "2026-11-04",
    insuranceExpiry: "2027-09-21",
    taxExpiry: "2027-09-30",
    pollutionExpiry: "2026-11-11"
  },
  {
    sl: 32,
    vehicleNo: "KL 75 E 7692",
    model: "TATA ACE EV",
    vehicleType: "4WL",
    unit: "RETAIL CC",
    registrationDate: "2025-11-01",
    fitnessExpiry: "2027-10-31",
    insuranceExpiry: "2027-09-15",
    taxExpiry: "2030-09-30",
    pollutionExpiry: "ELECTRIC"
  },
  {
    sl: 33,
    vehicleNo: "KL 75 E 7241",
    model: "TATA ACE EV",
    vehicleType: "4WL",
    unit: "VAP",
    registrationDate: "2025-10-18",
    fitnessExpiry: "2027-10-17",
    insuranceExpiry: "2027-09-17",
    taxExpiry: "2030-09-30",
    pollutionExpiry: "ELECTRIC"
  },
  {
    sl: 34,
    vehicleNo: "KL 75 E 7606",
    model: "KOMAKI E RICKSHAW WITH CART",
    vehicleType: "3WL",
    unit: "VAP",
    registrationDate: "2025-10-17",
    fitnessExpiry: "2027-10-16",
    insuranceExpiry: "2027-09-14",
    taxExpiry: "2030-09-30",
    pollutionExpiry: "ELECTRIC"
  },
  {
    sl: 35,
    vehicleNo: "KL 75 B 6196",
    model: "MAHINDRA TREO ELECTRONIC",
    vehicleType: "3WL",
    unit: "PAINOOR FARM",
    registrationDate: "2021-12-02",
    fitnessExpiry: "2027-02-18",
    insuranceExpiry: "2026-11-28",
    taxExpiry: "2027-09-30",
    pollutionExpiry: "ELECTRIC"
  },
  {
    sl: 36,
    vehicleNo: "KL 75 E 9834",
    model: "MARUTHI SUZUKI SUPER CARRY",
    vehicleType: "4 WL",
    unit: "VAP",
    registrationDate: "2026-01-17",
    fitnessExpiry: "2028-01-16",
    insuranceExpiry: "2027-01-02",
    taxExpiry: "2030-12-31",
    pollutionExpiry: "2027-01-16"
  },
  {
    sl: 37,
    vehicleNo: "KL 75 C 4525",
    model: "KUBOTA",
    vehicleType: "4 WL",
    unit: "PAINOOR FARM",
    registrationDate: "2022-12-08",
    fitnessExpiry: "2037-12-07",
    insuranceExpiry: "2027-01-28",
    taxExpiry: "2026-09-30",
    pollutionExpiry: "2023-12-07"
  },
  {
    sl: 38,
    vehicleNo: "KL 75 F 0116",
    model: "MARUTHI SUZUKI SUPER CARRY",
    vehicleType: "4 WL",
    unit: "VAP",
    registrationDate: "2026-01-23",
    fitnessExpiry: "2028-01-19",
    insuranceExpiry: "2027-01-02",
    taxExpiry: "2030-12-31",
    pollutionExpiry: "2027-01-22"
  },
  {
    sl: 39,
    vehicleNo: "KL 08 BJ 5050",
    model: "TOYOTA INNOVA CRYSTA",
    vehicleType: "4 WL",
    unit: "HO COMMON (Temporay)",
    registrationDate: "2016-06-06",
    fitnessExpiry: "2031-06-05",
    insuranceExpiry: "2026-10-09",
    taxExpiry: "2031-03-31",
    pollutionExpiry: "2026-10-16"
  },
  {
    sl: 40,
    vehicleNo: "KL 75 F 3636",
    model: "TATA PUNCH EV",
    vehicleType: "4 WL",
    unit: "Retail Common",
    registrationDate: "2026-05-08",
    fitnessExpiry: "2041-05-07",
    insuranceExpiry: "2029-04-06",
    taxExpiry: "2041-03-31",
    pollutionExpiry: "ELECTRIC"
  },
  {
    sl: 41,
    vehicleNo: "KL 75 F 4646",
    model: "TATA PUNCH EV",
    vehicleType: "4 WL",
    unit: "VAP",
    registrationDate: "2026-06-12",
    fitnessExpiry: "2041-06-11",
    insuranceExpiry: "2029-04-21",
    taxExpiry: "2041-03-31",
    pollutionExpiry: "ELECTRIC"
  },
  {
    sl: 42,
    vehicleNo: "KL 7F F 4281",
    model: "EICHER SEWAGE TANKER",
    vehicleType: "6 WL",
    unit: "Resturant",
    registrationDate: "2026-06-18",
    fitnessExpiry: "2028-06-14",
    insuranceExpiry: "2027-04-22",
    taxExpiry: "2026-09-30",
    pollutionExpiry: "2027-06-17"
  },
  {
    sl: 43,
    vehicleNo: "KL 75 F 5368",
    model: "TATA INTRA V70",
    vehicleType: "4 WL",
    unit: "RETAIL STORE",
    registrationDate: "2026-07-24",
    fitnessExpiry: "2028-07-16",
    insuranceExpiry: "2027-06-14",
    taxExpiry: "2026-09-30",
    pollutionExpiry: "2027-07-23"
  }
];

// ============================================================
// APPLICATION STATE
// ============================================================

const state = {
  vehicles: [...INITIAL_DATA],
  alertEmail: localStorage.getItem("mafarmAlertEmail") || "operationhead@mafarm.in",
  alertWindow: Number(localStorage.getItem("mafarmAlertWindow") || 30),
  backendUrl: localStorage.getItem("mafarmBackendUrl") || "",
  cloudConnected: false
};

const docs = [
  ["Fitness", "fitnessExpiry"],
  ["Insurance", "insuranceExpiry"],
  ["Tax", "taxExpiry"],
  ["Pollution", "pollutionExpiry"]
];

const $ = id => document.getElementById(id);
// ============================================================
// GENERAL FUNCTIONS
// ============================================================

function saveData() {
  // Vehicle data is stored in Firestore.
  // Alert settings remain local to this browser.
}

function vehicleDocId(vehicleNo) {
  return String(vehicleNo || "vehicle")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || `vehicle-${Date.now()}`;
}

function cleanVehicle(v) {
  const copy = { ...v };
  delete copy._id;
  return copy;
}

// ============================================================
// FIREBASE STATUS
// ============================================================

function setFirebaseStatus(message, connected = false, error = false) {
  const el = $("firebaseStatus");
  if (!el) return;

  el.innerHTML = `<b>Firebase:</b> ${message}`;

  el.style.background = error
    ? "#fdecec"
    : connected
      ? "#edf5ea"
      : "#fff6db";

  el.style.borderColor = error
    ? "#efb7b7"
    : connected
      ? "#d5e7cf"
      : "#f0dfaa";
}

// ============================================================
// FIRESTORE VEHICLE LISTENER
// ============================================================

function subscribeToVehicles() {
  if (firebaseUnsubscribe) {
    firebaseUnsubscribe();
  }

  setFirebaseStatus("Connecting to shared cloud database...");

  firebaseUnsubscribe = onSnapshot(
    vehiclesRef,

    (snapshot) => {
      firebaseReady = true;
      state.cloudConnected = true;

      if (snapshot.empty) {
        state.vehicles = [...INITIAL_DATA];
      } else {
        state.vehicles = snapshot.docs
          .map(d => ({
            ...d.data(),
            _id: d.id
          }))
          .sort((a, b) =>
            (Number(a.sl) || 999999) -
            (Number(b.sl) || 999999)
          );
      }

      setFirebaseStatus(
        "Connected — shared vehicle database is active.",
        true
      );

      render();
    },

    (error) => {
      console.error("Firestore listener error:", error);

      firebaseReady = false;
      state.cloudConnected = false;

      setFirebaseStatus(
        "Connection failed. Check Firestore Rules and internet.",
        false,
        true
      );

      render();
    }
  );
}

// ============================================================
// MIGRATE ORIGINAL 43 VEHICLES
// ============================================================

async function migrateOriginalVehicles() {
  if (!firebaseReady) {
    throw new Error("Firebase is not connected yet.");
  }

  const snapshot = await getDocs(vehiclesRef);

  const existingByVehicle = new Map();

  snapshot.docs.forEach(d => {
    const data = d.data();

    if (data.vehicleNo) {
      existingByVehicle.set(
        String(data.vehicleNo).trim().toUpperCase(),
        d.id
      );
    }
  });

  const batch = writeBatch(db);
  const originalIds = new Set();

  INITIAL_DATA.forEach((vehicle, index) => {
    const key = String(vehicle.vehicleNo)
      .trim()
      .toUpperCase();

    const id =
      existingByVehicle.get(key) ||
      vehicleDocId(vehicle.vehicleNo);

    originalIds.add(id);

    batch.set(
      doc(db, "Vehicles", id),
      cleanVehicle({
        ...vehicle,
        sl: vehicle.sl || index + 1
      }),
      { merge: false }
    );
  });

  snapshot.docs.forEach(d => {
    const data = d.data();

    const key = data.vehicleNo
      ? String(data.vehicleNo).trim().toUpperCase()
      : "";

    if (
      key &&
      INITIAL_DATA.some(
        v => String(v.vehicleNo).trim().toUpperCase() === key
      ) &&
      !originalIds.has(d.id)
    ) {
      batch.delete(d.ref);
    }
  });

  await batch.commit();
}

// ============================================================
// ADD VEHICLE
// ============================================================

async function addVehicleToCloud(vehicle) {
  if (!firebaseReady) {
    throw new Error("Firebase is not connected yet.");
  }

  const id = vehicleDocId(vehicle.vehicleNo);

  await setDoc(
    doc(db, "Vehicles", id),
    cleanVehicle(vehicle),
    { merge: true }
  );
}

// ============================================================
// UPDATE VEHICLE
// ============================================================

async function updateVehicleInCloud(id, vehicle) {
  if (!firebaseReady) {
    throw new Error("Firebase is not connected yet.");
  }

  const newId = vehicleDocId(vehicle.vehicleNo);

  if (id && id !== newId) {
    const batch = writeBatch(db);

    batch.set(
      doc(db, "Vehicles", newId),
      cleanVehicle(vehicle),
      { merge: true }
    );

    batch.delete(doc(db, "Vehicles", id));

    await batch.commit();
  } else {
    await setDoc(
      doc(db, "Vehicles", newId),
      cleanVehicle(vehicle),
      { merge: true }
    );
  }
}

// ============================================================
// REPLACE VEHICLE REGISTER
// ============================================================

async function replaceAllVehiclesInCloud(vehicles) {
  if (!firebaseReady) {
    throw new Error("Firebase is not connected yet.");
  }

  const snapshot = await getDocs(vehiclesRef);
  const batch = writeBatch(db);

  snapshot.docs.forEach(d => {
    batch.delete(d.ref);
  });

  vehicles.forEach((v, i) => {
    const ref = doc(
      db,
      "Vehicles",
      vehicleDocId(v.vehicleNo)
    );

    batch.set(
      ref,
      cleanVehicle({
        ...v,
        sl: v.sl || i + 1
      })
    );
  });

  await batch.commit();
}

// ============================================================
// DATE FUNCTIONS
// ============================================================

function parseDate(v) {
  if (!v || v === "ELECTRIC") return null;

  const d = new Date(v + "T00:00:00");

  return isNaN(d) ? null : d;
}

function daysUntil(v) {
  const d = parseDate(v);

  if (!d) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Math.ceil((d - today) / 86400000);
}

function fmt(v) {
  if (!v || v === "ELECTRIC") {
    return v === "ELECTRIC" ? "Electric" : "—";
  }

  const d = parseDate(v);

  return d
    ? d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      })
    : "—";
}

function status(v) {
  const n = daysUntil(v);

  if (n === null) return "na";
  if (n < 0) return "expired";
  if (n <= state.alertWindow) return "warning";

  return "safe";
}

function statusLabel(v) {
  const n = daysUntil(v);

  if (n === null) return "N/A";
  if (n < 0) return `${Math.abs(n)} days overdue`;
  if (n === 0) return "Expires today";

  return `${n} days`;
}

// ============================================================
// STATUTORY ALERTS
// ============================================================

function allAlerts() {
  const out = [];

  state.vehicles.forEach((v, vi) => {
    docs.forEach(([docName, key]) => {
      const n = daysUntil(v[key]);

      if (n !== null && n <= state.alertWindow) {
        out.push({
          vi,
          vehicle: v,
          doc: docName,
          key,
          date: v[key],
          days: n
        });
      }
    });
  });

  return out.sort((a, b) => a.days - b.days);
}

// ============================================================
// MAIN DASHBOARD
// ============================================================

function render() {
  const now = new Date();

  $("todayText").textContent =
    now.toLocaleString("en-IN", {
      dateStyle: "full"
    });

  $("heroDate").textContent =
    now.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

  $("totalVehicles").textContent =
    state.vehicles.length;

  const alerts = allAlerts();

  $("expiring30").textContent =
    alerts.filter(x => x.days >= 0).length;

  $("expiredCount").textContent =
    alerts.filter(x => x.days < 0).length;

  $("compliantCount").textContent =
    state.vehicles.filter(v =>
      docs.every(([, k]) => {
        const n = daysUntil(v[k]);
        return n === null || n > state.alertWindow;
      })
    ).length;

  $("dashboardAlerts").innerHTML =
    alerts.slice(0, 8).map(x => `
      <div class="alert-row">
        <span class="vehicle-name">
          ${x.vehicle.vehicleNo}
        </span>

        <span class="doc">${x.doc}</span>

        <span>${fmt(x.date)}</span>

        <span class="pill ${x.days < 0 ? "red" : "amber"}">
          ${statusLabel(x.date)}
        </span>
      </div>
    `).join("") ||
    `<div class="muted">
      No statutory item is due within the alert window.
    </div>`;

  const counts = {
    Fitness: 0,
    Insurance: 0,
    Tax: 0,
    Pollution: 0
  };

  state.vehicles.forEach(v => {
    docs.forEach(([docName, key]) => {
      const n = daysUntil(v[key]);

      if (n !== null && n <= state.alertWindow) {
        counts[docName]++;
      }
    });
  });

  const max = Math.max(
    1,
    ...Object.values(counts)
  );

  $("typeSummary").innerHTML =
    Object.entries(counts).map(([k, n]) => `
      <div class="type-line">
        <span>${k}</span>

        <div class="bar">
          <i style="width:${n / max * 100}%"></i>
        </div>

        <b>${n}</b>
      </div>
    `).join("");

  renderUnits();
  renderVehicles();
  renderAttention();
  renderReports();
}

// ============================================================
// UNIT FILTER
// ============================================================

function renderUnits() {
  const units = [
    ...new Set(
      state.vehicles
        .map(v => v.unit)
        .filter(Boolean)
    )
  ].sort();

  const current = $("unitFilter").value;

  $("unitFilter").innerHTML =
    `<option value="">All Units</option>` +
    units.map(u => `<option>${u}</option>`).join("");

  $("unitFilter").value = current;
}

// ============================================================
// VEHICLE REGISTER TABLE
// ============================================================

function renderVehicles() {
  const q = $("searchInput").value.toLowerCase();
  const unit = $("unitFilter").value;
  const sf = $("statusFilter").value;

  const rows = [];

  state.vehicles.forEach((v, i) => {
    const match = [
      v.vehicleNo,
      v.model,
      v.unit
    ].join(" ").toLowerCase().includes(q);

    if (!match || (unit && v.unit !== unit)) {
      return;
    }

    const states = docs.map(([, k]) => status(v[k]));

    const vehicleHasExpired =
      states.includes("expired");

    const vehicleHas30 =
      states.includes("warning");

    if (sf === "expired" && !vehicleHasExpired) return;
    if (sf === "30" && !vehicleHas30) return;

    if (
      sf === "safe" &&
      (vehicleHasExpired || vehicleHas30)
    ) {
      return;
    }

    rows.push(`
      <tr>
        <td>
          <span class="vehicle-name">${v.vehicleNo}</span>
          <br>
          <span class="muted">${v.vehicleType || ""}</span>
        </td>

        <td>${v.model || "—"}</td>
        <td>${v.unit || "—"}</td>

        <td>
          <span class="vehicle-name">
            ${v.responsiblePerson || "Not Assigned"}
          </span>
          <br>
          <span class="muted">
            ${v.responsibleEmail || ""}
          </span>
        </td>

        ${docs.map(([docName, key]) => `
          <td>
            <span class="date-status ${
              status(v[key]) === "expired"
                ? "red"
                : status(v[key]) === "warning"
                  ? "amber"
                  : "green"
            }">
              ${fmt(v[key])}
            </span>

            <br>

            <span class="muted">
              ${statusLabel(v[key])}
            </span>
          </td>
        `).join("")}

        <td class="actions-cell">
          <button
            class="action-btn"
            onclick="editVehicle(${i})">
            Update
          </button>

          <button
            class="action-btn mail-btn"
            onclick="sendVehicleEmail(${i})">
            ✉ Send
          </button>
        </td>
      </tr>
    `);
  });

  $("vehicleTable").innerHTML =
    rows.join("") ||
    `<tr>
      <td colspan="9" class="muted">
        No records found.
      </td>
    </tr>`;

  $("recordCount").textContent =
    `${rows.length} record(s)`;
}

// ============================================================
// EXPIRY ACTION CENTRE
// ============================================================

function renderAttention() {
  const alerts = allAlerts();

  $("attentionCount").textContent =
    `${alerts.length} item(s)`;

  $("attentionTable").innerHTML =
    alerts.map(x => `
      <tr>
        <td class="vehicle-name">
          ${x.vehicle.vehicleNo}
        </td>

        <td>${x.vehicle.unit || "—"}</td>
        <td>${x.doc}</td>
        <td>${fmt(x.date)}</td>

        <td class="${
          x.days < 0
            ? "date-status red"
            : "date-status amber"
        }">
          ${statusLabel(x.date)}
        </td>

        <td>
          <span class="pill ${
            x.days < 0 ? "red" : "amber"
          }">
            ${x.days < 0 ? "EXPIRED" : "DUE SOON"}
          </span>
        </td>

        <td>
          <button
            class="action-btn"
            onclick="editVehicle(${x.vi})">
            Update Date
          </button>
        </td>
      </tr>
    `).join("") ||
    `<tr>
      <td colspan="7" class="muted">
        Nothing requires attention.
      </td>
    </tr>`;
}

// ============================================================
// COMPLIANCE REPORTS
// ============================================================

function renderReports() {
  const total = state.vehicles.length;
  const vals = {};

  docs.forEach(([docName, key]) => {
    vals[docName] = state.vehicles.reduce(
      (n, v) =>
        n + (
          daysUntil(v[key]) !== null &&
          daysUntil(v[key]) <= state.alertWindow
            ? 1
            : 0
        ),
      0
    );
  });

  $("reportCards").innerHTML =
    Object.entries(vals).map(([k, v]) => `
      <div class="report-item">
        <span>${k} due/expired</span>
        <b>${v}</b>
      </div>
    `).join("") +

    `<div class="report-item">
      <span>Total vehicles</span>
      <b>${total}</b>
    </div>`;
}
async function sendAlertEmail(){
  const alerts=allAlerts();

  if(!alerts.length){
    alert("No expired or upcoming items are currently within the alert window.");
    return;
  }

  const subject=`MAFARM Vehicle Statutory Alert – ${alerts.length} item(s)`;

  const rows=alerts.map(x=>`
    <tr>
      <td>${x.vehicle.vehicleNo}</td>
      <td>${x.vehicle.unit||""}</td>
      <td>${x.doc}</td>
      <td>${fmt(x.date)}</td>
      <td>${statusLabel(x.date)}</td>
    </tr>
  `).join("");

  const html=`
    <div style="font-family:Arial">
      <h2 style="color:#2f6b1f">MAFARM Vehicle Statutory Alert</h2>
      <p>The following vehicle statutory documents require attention.</p>
      <table border="1" cellpadding="8" cellspacing="0">
        <tr>
          <th>Vehicle</th>
          <th>Unit</th>
          <th>Document</th>
          <th>Expiry</th>
          <th>Status</th>
        </tr>
        ${rows}
      </table>
      <p>Generated by MAFARM Vehicle Statutory Management System.</p>
    </div>
  `;

  if(state.backendUrl){
    try{
      const res=await fetch(state.backendUrl,{
        method:"POST",
        headers:{"Content-Type":"text/plain;charset=utf-8"},
        body:JSON.stringify({
          action:"sendAlert",
          to:state.alertEmail,
          subject,
          html,
          alerts
        })
      });

      const data=await res.json();
      alert(data.message||"Alert email sent.");
      return;

    }catch(e){
      alert("Backend email failed. Please check the Web App URL and deployment.");
      return;
    }
  }

  window.location.href=
    `mailto:${encodeURIComponent(state.alertEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("Vehicle statutory alert. Please open the system for full details.")}`;
}
