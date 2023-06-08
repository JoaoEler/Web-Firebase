import app from "./firebase.js";
import { getAuth, signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from "firebase/auth";

const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", function() {
  const form = document.querySelector("form");
  const err = document.querySelector(".err");

  err.style.visibility = "hidden";

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const email = form.email.value;
    const password = form.password.value;

    setPersistence(auth, browserSessionPersistence)
    .then(() => {
      signInWithEmailAndPassword(auth, email, password)
      .then(function(userCredential) {
        const user = userCredential.user;
        localStorage.setItem("@MyHealth:user", JSON.stringify(user));
        window.location.href = "home.html";
      })
      .catch(function(error) {
        const errorMessage = error.message;
        console.error("Erro:", errorMessage);
        err.style.visibility = "visible";
      });
    })
    .catch((error) => {
      const errorMessage = error.message;
      console.error(errorMessage);
    });

    
  });
});