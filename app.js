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
