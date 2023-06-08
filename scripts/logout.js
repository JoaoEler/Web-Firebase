import app from "./firebase.js";
import { getAuth } from "firebase/auth";

const auth = getAuth(app);

const logout = document.querySelector('.bttn2');

logout.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem("@MyHealth:user");
    auth.signOut();
});

auth.onAuthStateChanged(user => {
    if(!user){
        localStorage.removeItem("@MyHealth:user");
        window.location.href = "index.html";
    }
})