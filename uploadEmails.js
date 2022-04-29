import admin from "firebase-admin";

import serviceAccountKey from "./serviceAccountKey.js";

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

const db = app.firestore();

import fs from "fs";

const emailsDatabase = JSON.parse(fs.readFileSync("./emails.json", "utf8"));

console.log(emailsDatabase);

emailsDatabase.forEach((user) => {
  db.collection("users").doc(user.id).set(user);
});
