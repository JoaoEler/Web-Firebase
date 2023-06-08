import app from "./firebase.js";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", function() {
  var form = document.querySelector("form");
  var msg = document.getElementById("msg");

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    console.log("ok");

    var email = form.email.value;
    var password = form.password.value;
    var name = form.name.value;
    var gender = form.gender.value;
    var nasc = form.date.value;

    var pass = document.getElementById("passwordInput");
    var repeat = document.getElementById("repeatInput");

    if (pass.value !== repeat.value) {
      msg.style.visibility = "visible";
      return;
    } else {
      msg.style.visibility = "hidden";
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(function(userCredential) {
        const user = userCredential.user;

        const userData = {
          name: name,
          gender: gender,
          nasc: nasc,
        };
        console.log(userData);
        const usersCollection = collection(db, "users");
        return setDoc(doc(usersCollection, user.uid), userData);
      })
      .then(function() {
        window.location.href = "entrar.html";
      })
      .catch(function(error) {
        const errorMessage = error.message;
        console.error("Erro:", errorMessage);
      });
  });
});