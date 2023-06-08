import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAQ5PHBFAyWlH7fHnN7mIjnyztnIU5IysM",
  authDomain: "web-utfpr.firebaseapp.com",
  projectId: "web-utfpr",
  storageBucket: "web-utfpr.appspot.com",
  messagingSenderId: "637095353729",
  appId: "1:637095353729:web:bd32d0e19c5efb77fc1c80",
  measurementId: "G-M581R7K3ZB"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;