MAFARM VEHICLE STATUTORY SYSTEM — GITHUB + FIREBASE
====================================================

This package is prepared for GitHub Pages + Firebase Firestore.

FILES
-----
index.html      Website
app.js          Vehicle data + Firebase integration
style.css       Design
mafarm-logo.png Logo
Code.gs         Existing Google Apps Script email backend

FIREBASE PROJECT
----------------
Project ID: vehicle-details-d8d69
Firestore collection: Vehicles

IMPORTANT FIRST TEST
--------------------
1. Upload these files to a GitHub repository.
2. Enable GitHub Pages from Settings > Pages.
3. Open the HTTPS GitHub Pages URL. Do NOT double-click index.html.
4. Open Settings inside the website.
5. Wait until Firebase says: Connected — shared vehicle database is active.
6. Click “Migrate Original 43 Vehicles to Firebase” once.
7. Confirm. The original 43 records are uploaded using vehicle-number-based IDs.

The migration does NOT automatically delete unrelated Firestore records. If an existing Firestore record has the same vehicle number as an original vehicle, it is updated to the original register.

MULTI-USER
----------
All users visiting the GitHub Pages URL read/write the same Firestore Vehicles collection. Changes are reflected in real time.

SECURITY WARNING
----------------
The Firebase web configuration is intended to be present in a browser. Security must come from Firebase Authentication + Firestore Rules, not from hiding the web config.

For initial testing, Firestore Test Mode can be used. BEFORE sharing the site with staff, enable Firebase Authentication and replace Test Mode rules with authenticated/role-based rules.

GITHUB PAGES
------------
1. Create a GitHub repository, e.g. MAFARM-Vehicle-System.
2. Upload index.html, app.js, style.css, mafarm-logo.png, Code.gs, README.txt.
3. Repository > Settings > Pages.
4. Source: Deploy from a branch.
5. Branch: main. Folder: / (root).
6. Save.
7. Open the HTTPS URL GitHub provides.

The browser URL must begin with https://...github.io/... rather than file:///...

NEXT SECURITY STEP
------------------
After the first successful test, configure Firebase Authentication (email/password) and Firestore Rules so only authorized MAFARM users can read/write the vehicle data.
