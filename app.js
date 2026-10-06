// ============================================================
// MAFARM VEHICLE STATUTORY SYSTEM - FIREBASE CLOUD VERSION
// ============================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  setDoc,
  getDocs,
  writeBatch
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

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
const vehiclesRef = collection(db, "Vehicles");
let firebaseReady = false;
let firebaseUnsubscribe = null;

const INITIAL_DATA = [
  {
    "sl": 1,
    "vehicleNo": "KL 75 C 1725",
    "model": "BAJAJ PLATINA 100 ES",
    "vehicleType": "2 WL",
    "unit": "POS 3",
    "registrationDate": "2022-08-13",
    "fitnessExpiry": "2037-09-12",
    "insuranceExpiry": "2027-08-11",
    "taxExpiry": "2037-06-30",
    "pollutionExpiry": "2027-07-22"
  },
  {
    "sl": 2,
    "vehicleNo": "KL 75 C 1715",
    "model": "BAJAJ PLATINA 100 ES",
    "vehicleType": "2 WL",
    "unit": "RESTAURANT",
    "registrationDate": "2022-08-13",
    "fitnessExpiry": "2037-08-12",
    "insuranceExpiry": "2027-08-11",
    "taxExpiry": "2037-06-30",
    "pollutionExpiry": "2026-09-23"
  },
  {
    "sl": 3,
    "vehicleNo": "KL 75 C 1785",
    "model": "BAJAJ PLATINA 100 ES",
    "vehicleType": "2 WL",
    "unit": "COMMON",
    "registrationDate": "2022-08-13",
    "fitnessExpiry": "2037-08-12",
    "insuranceExpiry": "2027-08-11",
    "taxExpiry": "2037-06-30",
    "pollutionExpiry": "2027-07-07"
  },
  {
    "sl": 4,
    "vehicleNo": "KL 75 C 1705",
    "model": "BAJAJ PLATINA 100 ES",
    "vehicleType": "2 WL",
    "unit": "COMMON",
    "registrationDate": "2022-08-13",
    "fitnessExpiry": "2037-08-12",
    "insuranceExpiry": "2027-08-11",
    "taxExpiry": "2037-06-30",
    "pollutionExpiry": "2027-07-14"
  },
  {
    "sl": 5,
    "vehicleNo": "KL 46 M 7115",
    "model": "TVS STAR CITY",
    "vehicleType": "2WL",
    "unit": "FARM",
    "registrationDate": "2015-12-07",
    "fitnessExpiry": "2030-12-06",
    "insuranceExpiry": "2026-12-28",
    "taxExpiry": "2030-09-30",
    "pollutionExpiry": "2027-02-11"
  },
  {
    "sl": 6,
    "vehicleNo": "KL  75 A 6528",
    "model": "TVS XL 100 HEAVY DUTY",
    "vehicleType": "2WL",
    "unit": "KITCHEN",
    "registrationDate": "2020-09-17",
    "fitnessExpiry": "2035-09-16",
    "insuranceExpiry": "2027-09-03",
    "taxExpiry": "2035-06-30",
    "pollutionExpiry": "2026-08-07"
  },
  {
    "sl": 7,
    "vehicleNo": "KL 75 A 7891",
    "model": "TVS XL 100 HEAVY DUTY",
    "vehicleType": "2WL",
    "unit": "KITCHEN",
    "registrationDate": "2020-11-10",
    "fitnessExpiry": "2035-11-09",
    "insuranceExpiry": "2027-09-25",
    "taxExpiry": "2035-06-30",
    "pollutionExpiry": "2026-01-08"
  },
  {
    "sl": 8,
    "vehicleNo": "KL 75 8739",
    "model": "TVS XL 100 HEAVY DUTY",
    "vehicleType": "2WL",
    "unit": "PERINGOTTUKARA FARM",
    "registrationDate": "2019-08-08",
    "fitnessExpiry": "2034-08-07",
    "insuranceExpiry": "2027-08-07",
    "taxExpiry": "2034-06-30",
    "pollutionExpiry": "2026-09-30"
  },
  {
    "sl": 9,
    "vehicleNo": "KL 75 A 6543",
    "model": "TVS XL 100 HEAVY DUTY",
    "vehicleType": "2WL",
    "unit": "RESTAURANT",
    "registrationDate": "2020-09-17",
    "fitnessExpiry": "2035-09-16",
    "insuranceExpiry": "2027-09-03",
    "taxExpiry": "2035-06-30",
    "pollutionExpiry": "2027-08-11"
  },
  {
    "sl": 10,
    "vehicleNo": "KL 75 A 7810",
    "model": "TVS XL 100 HEAVY DUTY",
    "vehicleType": "2WL",
    "unit": "POS 2",
    "registrationDate": "2020-11-10",
    "fitnessExpiry": "2035-11-09",
    "insuranceExpiry": "2027-09-25",
    "taxExpiry": "2035-06-30",
    "pollutionExpiry": "2026-07-27"
  },
  {
    "sl": 11,
    "vehicleNo": "KL 75 A 7847",
    "model": "TVS XL 100 HEAVY DUTY",
    "vehicleType": "2WL",
    "unit": "KITCHEN",
    "registrationDate": "2020-11-10",
    "fitnessExpiry": "2035-11-09",
    "insuranceExpiry": "2027-09-25",
    "taxExpiry": "2035-06-30",
    "pollutionExpiry": "2027-04-06"
  },
  {
    "sl": 12,
    "vehicleNo": "KL 75 8052",
    "model": "TVS XL 100 HEAVY DUTY",
    "vehicleType": "2WL",
    "unit": "PAINOOR FARM",
    "registrationDate": "2019-07-15",
    "fitnessExpiry": "2034-07-14",
    "insuranceExpiry": "2027-09-05",
    "taxExpiry": "2034-03-31",
    "pollutionExpiry": "2026-07-28"
  },
  {
    "sl": 13,
    "vehicleNo": "KL 75 B 2806",
    "model": "TVS XL 100 HEAVY DUTY",
    "vehicleType": "2WL",
    "unit": "POS 2",
    "registrationDate": "2021-07-09",
    "fitnessExpiry": "2036-07-08",
    "insuranceExpiry": "2027-07-07",
    "taxExpiry": "2036-06-30",
    "pollutionExpiry": "2026-11-09"
  },
  {
    "sl": 14,
    "vehicleNo": "KL 75 B 2861",
    "model": "TVS XL 100 HEAVY DUTY",
    "vehicleType": "2WL",
    "unit": "POS 1",
    "registrationDate": "2021-07-09",
    "fitnessExpiry": "2036-07-08",
    "insuranceExpiry": "2027-07-07",
    "taxExpiry": "2036-06-30",
    "pollutionExpiry": "2025-11-18"
  },
  {
    "sl": 15,
    "vehicleNo": "KL 75 B 0388",
    "model": "MAHINDRA ALFA",
    "vehicleType": "3WL",
    "unit": "CHAIRMAN CAMPUS FARM",
    "registrationDate": "2021-02-20",
    "fitnessExpiry": "2027-04-25",
    "insuranceExpiry": "2027-02-03",
    "taxExpiry": "2026-12-31",
    "pollutionExpiry": "2027-03-12"
  },
  {
    "sl": 16,
    "vehicleNo": "KL 75 B 0743",
    "model": "MAHINDRA ALFA",
    "vehicleType": "3WL",
    "unit": "PAINOOR FARM",
    "registrationDate": "2021-03-09",
    "fitnessExpiry": "2027-04-25",
    "insuranceExpiry": "2027-01-02",
    "taxExpiry": "2026-09-30",
    "pollutionExpiry": "2025-09-25"
  },
  {
    "sl": 17,
    "vehicleNo": "KL 46 F 3737",
    "model": "PIAGGIO APE DEL VAN",
    "vehicleType": "3WL",
    "unit": "CHAIRMAN CAMPUS FARM",
    "registrationDate": "2012-02-13",
    "fitnessExpiry": "2027-03-25",
    "insuranceExpiry": "2027-01-29",
    "taxExpiry": "2026-12-31",
    "pollutionExpiry": "2027-01-10"
  },
  {
    "sl": 18,
    "vehicleNo": "KL 75 B 2606",
    "model": "PIAGGIO APE AUTO DX",
    "vehicleType": "3WL",
    "unit": "POS 2",
    "registrationDate": "2021-06-30",
    "fitnessExpiry": "2036-06-29",
    "insuranceExpiry": "2027-07-02",
    "taxExpiry": "2036-03-31",
    "pollutionExpiry": "2026-10-06"
  },
  {
    "sl": 19,
    "vehicleNo": "KL 75 B 4070",
    "model": "MAHINDRA ALPHA PASSANGER",
    "vehicleType": "3WL",
    "unit": "KITCHEN",
    "registrationDate": "2021-07-28",
    "fitnessExpiry": "2036-07-27",
    "insuranceExpiry": "2027-08-16",
    "taxExpiry": "2036-06-30",
    "pollutionExpiry": "2026-10-14"
  },
  {
    "sl": 20,
    "vehicleNo": "KL 75 C 2644",
    "model": "FORCE TRAVELLER DELIVERY VAN",
    "vehicleType": "4 WL",
    "unit": "RETAIL CC",
    "registrationDate": "2022-09-13",
    "fitnessExpiry": "2026-10-31",
    "insuranceExpiry": "2027-09-03",
    "taxExpiry": "2026-12-31",
    "pollutionExpiry": "2026-09-15"
  },
  {
    "sl": 21,
    "vehicleNo": "KL 75 C 3282",
    "model": "MARUTI SUZUKI EECO CARGO",
    "vehicleType": "4 WL",
    "unit": "VAP",
    "registrationDate": "2022-10-08",
    "fitnessExpiry": "2026-10-14",
    "insuranceExpiry": "2027-09-30",
    "taxExpiry": "2027-09-30",
    "pollutionExpiry": "2027-01-05"
  },
  {
    "sl": 22,
    "vehicleNo": "KL 75 C 1515",
    "model": "MAHINDRA BOLORO",
    "vehicleType": "4 WL",
    "unit": "HO COMMON",
    "registrationDate": "2022-06-27",
    "fitnessExpiry": "2037-06-26",
    "insuranceExpiry": "2027-05-27",
    "taxExpiry": "2037-03-31",
    "pollutionExpiry": "2027-06-29"
  },
  {
    "sl": 23,
    "vehicleNo": "KL 75 C  2253",
    "model": "MAHINDRA JEETO",
    "vehicleType": "4 WL",
    "unit": "VAP",
    "registrationDate": "2022-09-01",
    "fitnessExpiry": "2026-08-31",
    "insuranceExpiry": "2027-09-08",
    "taxExpiry": "2027-06-30",
    "pollutionExpiry": "2027-08-10"
  },
  {
    "sl": 24,
    "vehicleNo": "KL 75 C 2359",
    "model": "MAHINDRA JEETO",
    "vehicleType": "4 WL",
    "unit": "VAP",
    "registrationDate": "2022-09-01",
    "fitnessExpiry": "2026-09-05",
    "insuranceExpiry": "2027-09-06",
    "taxExpiry": "2027-06-30",
    "pollutionExpiry": "2027-08-12"
  },
  {
    "sl": 25,
    "vehicleNo": "KL 46 D 4545",
    "model": "BOLERO",
    "vehicleType": "4WL",
    "unit": "VAP",
    "registrationDate": "2010-10-29",
    "fitnessExpiry": "2030-10-27",
    "insuranceExpiry": "2026-10-28",
    "taxExpiry": "2030-09-30",
    "pollutionExpiry": "2026-10-09"
  },
  {
    "sl": 26,
    "vehicleNo": "KL  75 9196",
    "model": "BOLERO PICK UP",
    "vehicleType": "4WL",
    "unit": "PAINOOR FARM",
    "registrationDate": "2019-08-27",
    "fitnessExpiry": "2026-07-16",
    "insuranceExpiry": "2027-08-08",
    "taxExpiry": "2026-12-31",
    "pollutionExpiry": "2026-07-04"
  },
  {
    "sl": 27,
    "vehicleNo": "KL 75 A 9564",
    "model": "BOLERO PICK UP",
    "vehicleType": "4WL",
    "unit": "PAINOOR FARM",
    "registrationDate": "2021-01-22",
    "fitnessExpiry": "2027-04-07",
    "insuranceExpiry": "2027-01-19",
    "taxExpiry": "2026-12-31",
    "pollutionExpiry": "2027-04-05"
  },
  {
    "sl": 28,
    "vehicleNo": "KL 46 G 9191",
    "model": "DOST LE GOODS",
    "vehicleType": "4WL",
    "unit": "FARM CC",
    "registrationDate": "2013-01-03",
    "fitnessExpiry": "2027-07-22",
    "insuranceExpiry": "2026-12-29",
    "taxExpiry": "2027-09-30",
    "pollutionExpiry": "2027-01-17"
  },
  {
    "sl": 29,
    "vehicleNo": "KL 75 B 4164",
    "model": "MAHINDR SUPRO",
    "vehicleType": "4WL",
    "unit": "RETAIL CC",
    "registrationDate": "2021-09-01",
    "fitnessExpiry": "2027-11-23",
    "insuranceExpiry": "2027-08-16",
    "taxExpiry": "2027-06-30",
    "pollutionExpiry": "2026-11-23"
  },
  {
    "sl": 30,
    "vehicleNo": "KL 75 B 4197",
    "model": "BOLERO PICK UP",
    "vehicleType": "4WL",
    "unit": "Resturant",
    "registrationDate": "2021-09-01",
    "fitnessExpiry": "2027-10-29",
    "insuranceExpiry": "2027-08-01",
    "taxExpiry": "2026-09-30",
    "pollutionExpiry": "2027-01-26"
  },
  {
    "sl": 31,
    "vehicleNo": "KL 75 C 3684",
    "model": "TATA ACE GOLD",
    "vehicleType": "4WL",
    "unit": "KITCHEN",
    "registrationDate": "2022-10-25",
    "fitnessExpiry": "2026-11-04",
    "insuranceExpiry": "2027-09-21",
    "taxExpiry": "2027-09-30",
    "pollutionExpiry": "2026-11-11"
  },
  {
    "sl": 32,
    "vehicleNo": "KL 75 E 7692",
    "model": "TATA ACE EV",
    "vehicleType": "4WL",
    "unit": "RETAIL CC",
    "registrationDate": "2025-11-01",
    "fitnessExpiry": "2027-10-31",
    "insuranceExpiry": "2027-09-15",
    "taxExpiry": "2030-09-30",
    "pollutionExpiry": "ELECTRIC"
  },
  {
    "sl": 33,
    "vehicleNo": "KL 75 E 7241",
    "model": "TATA ACE EV",
    "vehicleType": "4WL",
    "unit": "VAP",
    "registrationDate": "2025-10-18",
    "fitnessExpiry": "2027-10-17",
    "insuranceExpiry": "2027-09-17",
    "taxExpiry": "2030-09-30",
    "pollutionExpiry": "ELECTRIC"
  },
  {
    "sl": 34,
    "vehicleNo": "KL 75 E 7606",
    "model": "KOMAKI E RICKSHAW WITH CART",
    "vehicleType": "3WL",
    "unit": "VAP",
    "registrationDate": "2025-10-17",
    "fitnessExpiry": "2027-10-16",
    "insuranceExpiry": "2027-09-14",
    "taxExpiry": "2030-09-30",
    "pollutionExpiry": "ELECTRIC"
  },
  {
    "sl": 35,
    "vehicleNo": "KL 75 B 6196",
    "model": "MAHINDRA TREO ELECTRONIC",
    "vehicleType": "3WL",
    "unit": "PAINOOR FARM",
    "registrationDate": "2021-12-02",
    "fitnessExpiry": "2027-02-18",
    "insuranceExpiry": "2026-11-28",
    "taxExpiry": "2027-09-30",
    "pollutionExpiry": "ELECTRIC"
  },
  {
    "sl": 36,
    "vehicleNo": "KL 75 E 9834",
    "model": "MARUTHI SUZUKI SUPER CARRY",
    "vehicleType": "4 WL",
    "unit": "VAP",
    "registrationDate": "2026-01-17",
    "fitnessExpiry": "2028-01-16",
    "insuranceExpiry": "2027-01-02",
    "taxExpiry": "2030-12-31",
    "pollutionExpiry": "2027-01-16"
  },
  {
    "sl": 37,
    "vehicleNo": "KL 75 C 4525",
    "model": "KUBOTA",
    "vehicleType": "4 WL",
    "unit": "PAINOOR FARM",
    "registrationDate": "2022-12-08",
    "fitnessExpiry": "2037-12-07",
    "insuranceExpiry": "2027-01-28",
    "taxExpiry": "2026-09-30",
    "pollutionExpiry": "2023-12-07"
  },
  {
    "sl": 38,
    "vehicleNo": "KL 75 F 0116",
    "model": "MARUTHI SUZUKI SUPER CARRY",
    "vehicleType": "4 WL",
    "unit": "VAP",
    "registrationDate": "2026-01-23",
    "fitnessExpiry": "2028-01-19",
    "insuranceExpiry": "2027-01-02",
    "taxExpiry": "2030-12-31",
    "pollutionExpiry": "2027-01-22"
  },
  {
    "sl": 39,
    "vehicleNo": "KL 08 BJ 5050",
    "model": "TOYOTA INNOVA CRYSTA",
    "vehicleType": "4 WL",
    "unit": "HO COMMON (Temporay)",
    "registrationDate": "2016-06-06",
    "fitnessExpiry": "2031-06-05",
    "insuranceExpiry": "2026-10-09",
    "taxExpiry": "2031-03-31",
    "pollutionExpiry": "2026-10-16"
  },
  {
    "sl": 40,
    "vehicleNo": "KL 75 F 3636",
    "model": "TATA PUNCH EV",
    "vehicleType": "4 WL",
    "unit": "Retail Common",
    "registrationDate": "2026-05-08",
    "fitnessExpiry": "2041-05-07",
    "insuranceExpiry": "2029-04-06",
    "taxExpiry": "2041-03-31",
    "pollutionExpiry": "ELECTRIC"
  },
  {
    "sl": 41,
    "vehicleNo": "KL 75 F 4646",
    "model": "TATA PUNCH EV",
    "vehicleType": "4 WL",
    "unit": "VAP",
    "registrationDate": "2026-06-12",
    "fitnessExpiry": "2041-06-11",
    "insuranceExpiry": "2029-04-21",
    "taxExpiry": "2041-03-31",
    "pollutionExpiry": "ELECTRIC"
  },
  {
    "sl": 42,
    "vehicleNo": "KL 7F F 4281",
    "model": "EICHER SEWAGE TANKER",
    "vehicleType": "6 WL",
    "unit": "Resturant",
    "registrationDate": "2026-06-18",
    "fitnessExpiry": "2028-06-14",
    "insuranceExpiry": "2027-04-22",
    "taxExpiry": "2026-09-30",
    "pollutionExpiry": "2027-06-17"
  },
  {
    "sl": 43,
    "vehicleNo": "KL 75 F 5368",
    "model": "TATA INTRA V70",
    "vehicleType": "4 WL",
    "unit": "RETAIL STORE",
    "registrationDate": "2026-07-24",
    "fitnessExpiry": "2028-07-16",
    "insuranceExpiry": "2027-06-14",
    "taxExpiry": "2026-09-30",
    "pollutionExpiry": "2027-07-23"
  }
];

const state = {
  // Keep the original 43 vehicles visible immediately while Firebase connects.
  vehicles: [...INITIAL_DATA],
  alertEmail: localStorage.getItem("mafarmAlertEmail") || "operationhead@mafarm.in",
  alertWindow: Number(localStorage.getItem("mafarmAlertWindow") || 30),
  backendUrl: localStorage.getItem("mafarmBackendUrl") || "",
  cloudConnected: false
};

const docs = [
  ["Fitness","fitnessExpiry"],["Insurance","insuranceExpiry"],["Tax","taxExpiry"],["Pollution","pollutionExpiry"]
];

const $ = id => document.getElementById(id);

function saveData(){
  // Vehicle data is stored in Firestore. Alert settings remain local to this browser.
}

function vehicleDocId(vehicleNo){
  return String(vehicleNo || "vehicle").trim().toUpperCase().replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80) || `vehicle-${Date.now()}`;
}

function cleanVehicle(v){
  const copy = {...v};
  delete copy._id;
  return copy;
}

function setFirebaseStatus(message, connected=false, error=false){
  const el = $("firebaseStatus");
  if (!el) return;
  el.innerHTML = `<b>Firebase:</b> ${message}`;
  el.style.background = error ? "#fdecec" : connected ? "#edf5ea" : "#fff6db";
  el.style.borderColor = error ? "#efb7b7" : connected ? "#d5e7cf" : "#f0dfaa";
}

function subscribeToVehicles(){
  if (firebaseUnsubscribe) firebaseUnsubscribe();
  setFirebaseStatus("Connecting to shared cloud database...");

  firebaseUnsubscribe = onSnapshot(vehiclesRef, (snapshot) => {
    firebaseReady = true;
    state.cloudConnected = true;

    if (snapshot.empty) {
      // Do not write automatically. The Migration button below performs the safe first migration.
      state.vehicles = [...INITIAL_DATA];
    } else {
      state.vehicles = snapshot.docs
        .map(d => ({...d.data(), _id: d.id}))
        .sort((a,b) => (Number(a.sl)||999999) - (Number(b.sl)||999999));
    }

    setFirebaseStatus("Connected — shared vehicle database is active.", true);
    render();
  }, (error) => {
    console.error("Firestore listener error:", error);
    firebaseReady = false;
    state.cloudConnected = false;
    setFirebaseStatus("Connection failed. Check Firestore Rules and internet.", false, true);
    render();
  });
}

async function migrateOriginalVehicles(){
  if (!firebaseReady) throw new Error("Firebase is not connected yet.");

  const snapshot = await getDocs(vehiclesRef);
  const existingByVehicle = new Map();
  snapshot.docs.forEach(d => {
    const data = d.data();
    if (data.vehicleNo) existingByVehicle.set(String(data.vehicleNo).trim().toUpperCase(), d.id);
  });

  const batch = writeBatch(db);
  const originalIds = new Set();

  INITIAL_DATA.forEach((vehicle, index) => {
    const key = String(vehicle.vehicleNo).trim().toUpperCase();
    const id = existingByVehicle.get(key) || vehicleDocId(vehicle.vehicleNo);
    originalIds.add(id);
    batch.set(doc(db, "Vehicles", id), cleanVehicle({...vehicle, sl: vehicle.sl || index + 1}), {merge:false});
  });

  // Remove old test/auto-ID documents only when they are duplicates of an original vehicle.
  snapshot.docs.forEach(d => {
    const data = d.data();
    const key = data.vehicleNo ? String(data.vehicleNo).trim().toUpperCase() : "";
    if (key && INITIAL_DATA.some(v => String(v.vehicleNo).trim().toUpperCase() === key) && !originalIds.has(d.id)) {
      batch.delete(d.ref);
    }
  });

  await batch.commit();
}

async function addVehicleToCloud(vehicle){
  if (!firebaseReady) throw new Error("Firebase is not connected yet.");
  const id = vehicleDocId(vehicle.vehicleNo);
  await setDoc(doc(db, "Vehicles", id), cleanVehicle(vehicle), {merge:true});
}

async function updateVehicleInCloud(id, vehicle){
  if (!firebaseReady) throw new Error("Firebase is not connected yet.");
  const newId = vehicleDocId(vehicle.vehicleNo);
  if (id && id !== newId) {
    const batch = writeBatch(db);
    batch.set(doc(db, "Vehicles", newId), cleanVehicle(vehicle), {merge:true});
    batch.delete(doc(db, "Vehicles", id));
    await batch.commit();
  } else {
    await setDoc(doc(db, "Vehicles", newId), cleanVehicle(vehicle), {merge:true});
  }
}

async function replaceAllVehiclesInCloud(vehicles){
  if (!firebaseReady) throw new Error("Firebase is not connected yet.");
  const snapshot = await getDocs(vehiclesRef);
  const batch = writeBatch(db);
  snapshot.docs.forEach(d => batch.delete(d.ref));
  vehicles.forEach((v,i) => {
    const ref = doc(db, "Vehicles", vehicleDocId(v.vehicleNo));
    batch.set(ref, cleanVehicle({...v, sl: v.sl || i+1}));
  });
  await batch.commit();
}

function parseDate(v){
  if(!v || v==="ELECTRIC") return null;
  const d = new Date(v+"T00:00:00");
  return isNaN(d) ? null : d;
}
function daysUntil(v){
  const d=parseDate(v); if(!d) return null;
  const today=new Date(); today.setHours(0,0,0,0);
  return Math.ceil((d-today)/86400000);
}
function fmt(v){
  if(!v || v==="ELECTRIC") return v==="ELECTRIC" ? "Electric" : "—";
  const d=parseDate(v); return d ? d.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "—";
}
function status(v){
  const n=daysUntil(v);
  if(n===null) return "na";
  if(n<0) return "expired";
  if(n<=state.alertWindow) return "warning";
  return "safe";
}
function statusLabel(v){
  const n=daysUntil(v);
  if(n===null) return "N/A";
  if(n<0) return `${Math.abs(n)} days overdue`;
  if(n===0) return "Expires today";
  return `${n} days`;
}
function allAlerts(){
  const out=[];
  state.vehicles.forEach((v,vi)=>{
    docs.forEach(([doc,key])=>{
      const n=daysUntil(v[key]);
      if(n!==null && n<=state.alertWindow) out.push({vi,vehicle:v,doc,key,date:v[key],days:n});
    });
  });
  return out.sort((a,b)=>a.days-b.days);
}
function render(){
  const now=new Date();
  $("todayText").textContent=now.toLocaleString("en-IN",{dateStyle:"full"});
  $("heroDate").textContent=now.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
  $("totalVehicles").textContent=state.vehicles.length;
  const alerts=allAlerts();
  $("expiring30").textContent=alerts.filter(x=>x.days>=0).length;
  $("expiredCount").textContent=alerts.filter(x=>x.days<0).length;
  $("compliantCount").textContent=state.vehicles.filter(v=>docs.every(([,k])=>{const n=daysUntil(v[k]); return n===null || n>state.alertWindow;})).length;

  $("dashboardAlerts").innerHTML=alerts.slice(0,8).map(x=>`
    <div class="alert-row">
      <span class="vehicle-name">${x.vehicle.vehicleNo}</span>
      <span class="doc">${x.doc}</span>
      <span>${fmt(x.date)}</span>
      <span class="pill ${x.days<0?'red':'amber'}">${statusLabel(x.date)}</span>
    </div>`).join("") || `<div class="muted">No statutory item is due within the alert window.</div>`;

  const counts={Fitness:0,Insurance:0,Tax:0,Pollution:0};
  state.vehicles.forEach(v=>docs.forEach(([doc,key])=>{const n=daysUntil(v[key]); if(n!==null&&n<=state.alertWindow) counts[doc]++;}));
  const max=Math.max(1,...Object.values(counts));
  $("typeSummary").innerHTML=Object.entries(counts).map(([k,n])=>`
    <div class="type-line"><span>${k}</span><div class="bar"><i style="width:${n/max*100}%"></i></div><b>${n}</b></div>`).join("");

  renderUnits();
  renderVehicles();
  renderAttention();
  renderReports();
}

function renderUnits(){
  const units=[...new Set(state.vehicles.map(v=>v.unit).filter(Boolean))].sort();
  const current=$("unitFilter").value;
  $("unitFilter").innerHTML=`<option value="">All Units</option>`+units.map(u=>`<option>${u}</option>`).join("");
  $("unitFilter").value=current;
}

function renderVehicles(){
  const q=$("searchInput").value.toLowerCase();
  const unit=$("unitFilter").value;
  const sf=$("statusFilter").value;
  const rows=[];
  state.vehicles.forEach((v,i)=>{
    const match=[v.vehicleNo,v.model,v.unit].join(" ").toLowerCase().includes(q);
    if(!match || (unit && v.unit!==unit)) return;
    const states=docs.map(([,k])=>status(v[k]));
    const vehicleHasExpired=states.includes("expired");
    const vehicleHas30=states.includes("warning");
    if(sf==="expired"&&!vehicleHasExpired)return;
    if(sf==="30"&&!vehicleHas30)return;
    if(sf==="safe"&&(vehicleHasExpired||vehicleHas30))return;
    rows.push(`<tr>
      <td><span class="vehicle-name">${v.vehicleNo}</span><br><span class="muted">${v.vehicleType||""}</span></td>
      <td>${v.model||"—"}</td><td>${v.unit||"—"}</td>
      <td><span class="vehicle-name">${v.responsiblePerson||"Not Assigned"}</span><br><span class="muted">${v.responsibleEmail||""}</span></td>
      ${docs.map(([doc,key])=>`<td><span class="date-status ${status(v[key])==='expired'?'red':status(v[key])==='warning'?'amber':'green'}">${fmt(v[key])}</span><br><span class="muted">${statusLabel(v[key])}</span></td>`).join("")}
      <td class="actions-cell"><button class="action-btn" onclick="editVehicle(${i})">Update</button>
      <button class="action-btn mail-btn" onclick="sendVehicleEmail(${i})">✉ Send</button></td>
    </tr>`);
  });
  $("vehicleTable").innerHTML=rows.join("")||`<tr><td colspan="9" class="muted">No records found.</td></tr>`;
  $("recordCount").textContent=`${rows.length} record(s)`;
}

function renderAttention(){
  const alerts=allAlerts();
  $("attentionCount").textContent=`${alerts.length} item(s)`;
  $("attentionTable").innerHTML=alerts.map(x=>`
    <tr>
      <td class="vehicle-name">${x.vehicle.vehicleNo}</td>
      <td>${x.vehicle.unit||"—"}</td>
      <td>${x.doc}</td>
      <td>${fmt(x.date)}</td>
      <td class="${x.days<0?'date-status red':'date-status amber'}">${statusLabel(x.date)}</td>
      <td><span class="pill ${x.days<0?'red':'amber'}">${x.days<0?'EXPIRED':'DUE SOON'}</span></td>
      <td><button class="action-btn" onclick="editVehicle(${x.vi})">Update Date</button></td>
    </tr>`).join("") || `<tr><td colspan="7" class="muted">Nothing requires attention.</td></tr>`;
}

function renderReports(){
  const total=state.vehicles.length;
  const vals={};
  docs.forEach(([doc,key])=>{
    vals[doc]=state.vehicles.reduce((n,v)=>n+(daysUntil(v[key])!==null&&daysUntil(v[key])<=state.alertWindow?1:0),0);
  });
  $("reportCards").innerHTML=Object.entries(vals).map(([k,v])=>`<div class="report-item"><span>${k} due/expired</span><b>${v}</b></div>`).join("")+
  `<div class="report-item"><span>Total vehicles</span><b>${total}</b></div>`;
}

function openModal(index=null){
  $("vehicleModal").classList.add("show");
  $("editIndex").value=index===null?"":index;
  $("modalTitle").textContent=index===null?"Add Vehicle":"Update Vehicle";
  const v=index===null?{vehicleNo:"",model:"",vehicleType:"",unit:"",responsiblePerson:"",responsibleEmail:"",registrationDate:"",fitnessExpiry:"",insuranceExpiry:"",taxExpiry:"",pollutionExpiry:""}:state.vehicles[index];
  $("fVehicleNo").value=v.vehicleNo||"";$("fModel").value=v.model||"";$("fVehicleType").value=v.vehicleType||"";$("fUnit").value=v.unit||"";
  if($("fResponsible")) $("fResponsible").value=v.responsiblePerson||"";
  if($("fResponsibleEmail")) $("fResponsibleEmail").value=v.responsibleEmail||"";
  $("fReg").value=v.registrationDate||"";$("fFitness").value=v.fitnessExpiry==="ELECTRIC"?"":v.fitnessExpiry||"";
  $("fInsurance").value=v.insuranceExpiry||"";$("fTax").value=v.taxExpiry||"";$("fPollution").value=v.pollutionExpiry==="ELECTRIC"?"":v.pollutionExpiry||"";
}
function closeModal(){$("vehicleModal").classList.remove("show")}
function editVehicle(i){openModal(i)}
window.editVehicle = editVehicle;

async function sendAlertEmail(){
  const alerts=allAlerts();
  if(!alerts.length){alert("No expired or upcoming items are currently within the alert window.");return;}
  const subject=`MAFARM Vehicle Statutory Alert – ${alerts.length} item(s)`;
  const rows=alerts.map(x=>`<tr><td>${x.vehicle.vehicleNo}</td><td>${x.vehicle.unit||""}</td><td>${x.doc}</td><td>${fmt(x.date)}</td><td>${statusLabel(x.date)}</td></tr>`).join("");
  const html=`<div style="font-family:Arial"><h2 style="color:#2f6b1f">MAFARM Vehicle Statutory Alert</h2><p>The following vehicle statutory documents require attention.</p><table border="1" cellpadding="8" cellspacing="0"><tr><th>Vehicle</th><th>Unit</th><th>Document</th><th>Expiry</th><th>Status</th></tr>${rows}</table><p>Generated by MAFARM Vehicle Statutory Management System.</p></div>`;
  if(state.backendUrl){
    try{
      const res=await fetch(state.backendUrl,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({action:"sendAlert",to:state.alertEmail,subject,html,alerts})});
      const data=await res.json();
      alert(data.message||"Alert email sent.");
      return;
    }catch(e){alert("Backend email failed. Please check the Web App URL and deployment.");return;}
  }
  // Fallback: open a mail client. This is NOT automatic sending.
  window.location.href=`mailto:${encodeURIComponent(state.alertEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("Vehicle statutory alert. Please open the system for full details.")}`;
}

async function sendVehicleEmail(index) {
  const v = state.vehicles[index];
  if (!v) return;

  const email = (v.responsibleEmail || '').trim();
  const btn = document.querySelector(`button[onclick="sendVehicleEmail(${index})"]`);
  const feedback = (text) => {
    if (btn) {
      const oldText = btn.textContent;
      btn.textContent = text;
      btn.disabled = true;
      setTimeout(() => { btn.textContent = oldText; btn.disabled = false; }, 1800);
    }
  };

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    feedback('Enter Email');
    return;
  }

  // Send only the compliance items that are expired or expiring within the configured alert window.
  const checks = [
    ['Fitness', v.fitnessExpiry],
    ['Insurance', v.insuranceExpiry],
    ['Tax', v.taxExpiry],
    ['Pollution', v.pollutionExpiry]
  ];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const urgent = [];

  checks.forEach(([name, raw]) => {
    if (!raw || raw === 'ELECTRIC') return;
    const d = new Date(raw + 'T00:00:00');
    if (isNaN(d)) return;
    const days = Math.ceil((d - today) / 86400000);
    if (days <= state.alertWindow) {
      urgent.push({name, raw, date: fmt(raw), days});
    }
  });

  if (!urgent.length) {
    feedback('No Due Item');
    return;
  }

  const rows = urgent.map(item => {
    let statusText;
    if (item.days < 0) {
      statusText = `EXPIRED ${Math.abs(item.days)} DAY${Math.abs(item.days) === 1 ? '' : 'S'} AGO`;
    } else if (item.days === 0) {
      statusText = 'EXPIRES TODAY';
    } else {
      statusText = `EXPIRES IN ${item.days} DAY${item.days === 1 ? '' : 'S'}`;
    }
    return `<tr>
      <td style="padding:9px;border:1px solid #d9e2dc">${escapeHtml(item.name)}</td>
      <td style="padding:9px;border:1px solid #d9e2dc">${escapeHtml(item.date)}</td>
      <td style="padding:9px;border:1px solid #d9e2dc;font-weight:700">${statusText}</td>
    </tr>`;
  }).join('');

  const summary = urgent.map(item => {
    if (item.days < 0) return `<strong>${escapeHtml(item.name)}</strong> expired ${Math.abs(item.days)} day${Math.abs(item.days) === 1 ? '' : 's'} ago.`;
    if (item.days === 0) return `<strong>${escapeHtml(item.name)}</strong> expires today.`;
    return `<strong>${escapeHtml(item.name)}</strong> will expire within ${item.days} day${item.days === 1 ? '' : 's'}.`;
  }).join('<br>');

  const subject = `Vehicle Statutory Compliance – ${v.vehicleNo} – Action Required`;
  const body = `<div style="font-family:Arial,sans-serif;font-size:14px;color:#222;line-height:1.5">
    <p>Dear ${escapeHtml(v.responsiblePerson || 'Responsible Person')},</p>
    <p>This is to inform you that the following statutory item(s) of <strong>Vehicle No. ${escapeHtml(v.vehicleNo)}</strong> have expired or will expire within <strong>${state.alertWindow} days</strong>.</p>
    <p>${summary}</p>
    <table style="border-collapse:collapse;width:100%;font-family:Arial,sans-serif;font-size:14px">
      <thead><tr style="background:#e8f3ec">
        <th style="padding:9px;border:1px solid #d9e2dc;text-align:left">Vehicle No.</th>
        <th style="padding:9px;border:1px solid #d9e2dc;text-align:left">Compliance Item</th>
        <th style="padding:9px;border:1px solid #d9e2dc;text-align:left">Expiry / Due Date</th>
        <th style="padding:9px;border:1px solid #d9e2dc;text-align:left">Days</th>
        <th style="padding:9px;border:1px solid #d9e2dc;text-align:left">Status</th>
      </tr></thead>
      <tbody>${urgent.map(item => {
        const daysText = item.days < 0 ? `${Math.abs(item.days)} day${Math.abs(item.days) === 1 ? '' : 's'} overdue` : item.days === 0 ? '0 days – Today' : `${item.days} day${item.days === 1 ? '' : 's'} remaining`;
        const statusText = item.days < 0 ? 'EXPIRED' : item.days === 0 ? 'EXPIRES TODAY' : 'EXPIRING';
        return `<tr>
          <td style="padding:9px;border:1px solid #d9e2dc"><strong>${escapeHtml(v.vehicleNo)}</strong></td>
          <td style="padding:9px;border:1px solid #d9e2dc">${escapeHtml(item.name)}</td>
          <td style="padding:9px;border:1px solid #d9e2dc">${escapeHtml(item.date)}</td>
          <td style="padding:9px;border:1px solid #d9e2dc;font-weight:700">${daysText}</td>
          <td style="padding:9px;border:1px solid #d9e2dc;font-weight:700">${statusText}</td>
        </tr>`;
      }).join('')}</tbody>
    </table>
    <p><strong>Vehicle Details</strong><br>
      Vehicle No.: ${escapeHtml(v.vehicleNo)}<br>
      Model: ${escapeHtml(v.model || '')}<br>
      Unit: ${escapeHtml(v.unit || '')}<br>
      Responsible Person: ${escapeHtml(v.responsiblePerson || '')}
    </p>
    <p><strong>Required Action:</strong> Please make the necessary arrangements immediately for renewal/completion of the above statutory compliance items and ensure that the vehicle remains legally compliant.</p>
    <p>Please treat this matter as a priority.</p>
    <p>Regards,<br><strong>Jinish M M</strong><br>Operation Head<br>Manappuram Agro Farms Limited (MAFARM)</p>
  </div>`;

  const backend = state.backendUrl || localStorage.getItem('mafarmBackendUrl') || '';
  if (backend) {
    try {
      const response = await fetch(backend, {
        method: 'POST',
        headers: {'Content-Type':'text/plain;charset=utf-8'},
        body: JSON.stringify({action:'sendVehicleEmail', to:email, subject, htmlBody:body, vehicle:v})
      });
      const result = await response.json();
      if (result && result.ok) feedback('Sent ✓');
      else feedback('Failed');
    } catch (e) {
      feedback('Failed');
    }
  } else {
    window.location.href = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(stripHtml(body))}`;
    feedback('Mail Opened');
  }
}

window.sendVehicleEmail = sendVehicleEmail;

function escapeHtml(x){ return String(x ?? '').replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c])); }
function stripHtml(x){ const d=document.createElement('div'); d.innerHTML=x; return d.textContent || d.innerText || ''; }

function importExcel(file){
  const reader=new FileReader();
  reader.onload=e=>{
    const wb=XLSX.read(e.target.result,{type:"array"});
    const ws=wb.Sheets[wb.SheetNames[0]];
    const rows=XLSX.utils.sheet_to_json(ws,{header:1,defval:""});
    // Find the header rows from the supplied format.
    const headers=rows[1]||[];
    const idx={vehicle:1,model:2,type:3,unit:4,reg:5,fitness:6,insurance:8,tax:10,pollution:12,responsible:13,responsibleEmail:14};
    const parsed=[];
    for(let i=2;i<rows.length;i++){
      const r=rows[i];
      if(!r[idx.vehicle]) continue;
      const excelDate=v=>{
        if(v==="electric"||v==="Electric") return "ELECTRIC";
        if(typeof v==="number"){
          const d=XLSX.SSF.parse_date_code(v); if(!d)return "";
          return `${d.y}-${String(d.m).padStart(2,"0")}-${String(d.d).padStart(2,"0")}`;
        }
        if(v instanceof Date)return v.toISOString().slice(0,10);
        if(typeof v==="string"){
          const d=new Date(v); if(!isNaN(d))return d.toISOString().slice(0,10);
        }
        return "";
      };
      parsed.push({sl:r[0],vehicleNo:String(r[idx.vehicle]).trim(),model:String(r[idx.model]||"").trim(),vehicleType:String(r[idx.type]||"").trim(),unit:String(r[idx.unit]||"").trim(),responsiblePerson:String(r[idx.responsible]||"").trim(),responsibleEmail:String(r[idx.responsibleEmail]||"").trim(),registrationDate:excelDate(r[idx.reg]),fitnessExpiry:excelDate(r[idx.fitness]),insuranceExpiry:excelDate(r[idx.insurance]),taxExpiry:excelDate(r[idx.tax]),pollutionExpiry:excelDate(r[idx.pollution])});
    }
    if (!firebaseReady) {
      alert("Firebase is not connected yet. Please wait and try again.");
      return;
    }
    if (!confirm(`This will replace the shared Firebase vehicle register with ${parsed.length} vehicles. Continue?`)) return;
    replaceAllVehiclesInCloud(parsed)
      .then(() => alert(`${parsed.length} vehicles imported to the shared Firebase database.`))
      .catch(err => { console.error(err); alert("Import failed: " + err.message); });
  };
  reader.readAsArrayBuffer(file);
}

function exportExcel(){
  const data=state.vehicles.map(v=>({"Vehicle No":v.vehicleNo,"Model":v.model,"Vehicle Type":v.vehicleType,"Unit":v.unit,"Responsible Person":v.responsiblePerson||"","Responsible Email":v.responsibleEmail||"","Registration Date":v.registrationDate,"Fitness Expiry":v.fitnessExpiry,"Insurance Expiry":v.insuranceExpiry,"Tax Expiry":v.taxExpiry,"Pollution Due":v.pollutionExpiry,"Fitness Status":statusLabel(v.fitnessExpiry),"Insurance Status":statusLabel(v.insuranceExpiry),"Tax Status":statusLabel(v.taxExpiry),"Pollution Status":statusLabel(v.pollutionExpiry)}));
  const ws=XLSX.utils.json_to_sheet(data);const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,"Vehicle Statutory");
  XLSX.writeFile(wb,"MAFARM_Vehicle_Statutory_Register.xlsx");
}

document.querySelectorAll(".nav-btn").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.page)));
document.querySelectorAll("[data-goto]").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.goto)));
function showPage(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.page===id));
  $(id).classList.add("active");
  const titles={dashboard:"Vehicle Statutory Dashboard",vehicles:"Vehicle Register",expiring:"Expiry Action Centre",reports:"Compliance Reports",settings:"System Settings"};
  $("pageTitle").textContent=titles[id];
}

$("searchInput").addEventListener("input",renderVehicles);
$("unitFilter").addEventListener("change",renderVehicles);
$("statusFilter").addEventListener("change",renderVehicles);
$("addVehicleBtn").addEventListener("click",()=>openModal());
$("closeModal").addEventListener("click",closeModal);$("cancelModal").addEventListener("click",closeModal);
$("importBtn").addEventListener("click",()=>$("excelInput").click());
$("excelInput").addEventListener("change",e=>{if(e.target.files[0])importExcel(e.target.files[0])});
$("exportBtn").addEventListener("click",exportExcel);
$("sendAlertBtn").addEventListener("click",sendAlertEmail);
$("saveSettings").addEventListener("click",()=>{
  state.alertEmail=$("alertEmail").value.trim()||"operationhead@mafarm.in";
  state.alertWindow=Math.max(1,Number($("alertWindow").value)||30);
  state.backendUrl=$("backendUrl").value.trim();
  localStorage.setItem("mafarmAlertEmail",state.alertEmail);
  localStorage.setItem("mafarmAlertWindow",state.alertWindow);
  localStorage.setItem("mafarmBackendUrl",state.backendUrl);
  render();alert("Settings saved.");
});

$("migrateVehiclesBtn")?.addEventListener("click", async ()=>{
  if (!confirm("Upload the original 43 MAFARM vehicles to Firebase? Existing records with the same vehicle number will be updated. Other records will be preserved.")) return;
  const btn=$("migrateVehiclesBtn");
  btn.disabled=true; btn.textContent="Migrating...";
  try {
    await migrateOriginalVehicles();
    alert("Migration completed. The original 43 vehicles are now in the shared Firebase database.");
  } catch(err) {
    console.error(err); alert("Migration failed: " + err.message);
  } finally { btn.disabled=false; btn.textContent="Migrate Original 43 Vehicles to Firebase"; }
});
$("vehicleForm").addEventListener("submit",async e=>{
  e.preventDefault();
  if (!firebaseReady) { alert("Firebase is not connected yet. Please wait and try again."); return; }
  const idx=$("editIndex").value;
  const v={vehicleNo:$("fVehicleNo").value.trim(),model:$("fModel").value.trim(),vehicleType:$("fVehicleType").value.trim(),unit:$("fUnit").value.trim(),responsiblePerson:$("fResponsible")?.value.trim()||"",responsibleEmail:$("fResponsibleEmail")?.value.trim()||"",registrationDate:$("fReg").value,fitnessExpiry:$("fFitness").value,insuranceExpiry:$("fInsurance").value,taxExpiry:$("fTax").value,pollutionExpiry:$("fPollution").value};
  try {
    if(idx==="") {
      v.sl = state.vehicles.length + 1;
      await addVehicleToCloud(v);
    } else {
      const existing=state.vehicles[Number(idx)];
      await updateVehicleInCloud(existing?._id, {...existing,...v});
    }
    closeModal();
  } catch(err) { console.error(err); alert("Could not save vehicle: " + err.message); }
});

$("alertEmail").value=state.alertEmail;
$("alertWindow").value=state.alertWindow;
$("backendUrl").value=state.backendUrl;
render();
subscribeToVehicles();
