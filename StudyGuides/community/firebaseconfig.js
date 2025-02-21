// Import Firebase dependencies
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "api-key",
    authDomain: "auth-domain",
    projectId: "project-id",
    storageBucket: "bucket.appspot.com",
    messagingSenderId: "messaging-sender-id",
    appId: "app-id"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
