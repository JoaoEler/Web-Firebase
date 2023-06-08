import app from "./firebase.js";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const auth = getAuth(app);

const resetPasswordForm = document.getElementById("resetPasswordForm");
const err = document.getElementById("err");
const acc = document.getElementById("acc");

resetPasswordForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = resetPasswordForm.email.value;

  sendPasswordResetEmail(auth, email)
    .then(() => {
        acc.style.visibility = "visible";
        err.style.visibility = "hidden";
    })
    .catch((error) => {
        console.error(error);
        acc.style.visibility = "hidden";
        err.style.visibility = "visible";
    });
});