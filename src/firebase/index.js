import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

import { config } from "./config";

const app = firebase.initializeApp(config);

const db = app.firestore();
const auth = app.auth();
const storage = app.storage();

export { db, auth, storage };
