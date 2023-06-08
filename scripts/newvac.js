import app from "./firebase.js";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const db = getFirestore(app);
const storage = getStorage(app);

const storedUser = localStorage.getItem("@MyHealth:user");
const user = JSON.parse(storedUser);
const userId = user.uid;

document.addEventListener("DOMContentLoaded", function() {
  const form = document.querySelector("form");
  const image = document.getElementById('imagem');
  image.style.visibility = 'hidden';

  const fileInput = document.querySelector('.pic');

  fileInput.addEventListener("change", function(event) {
    carregarImagem(event);
  });

  function carregarImagem(event) {
        const input = event.target;

        if (input.files && input.files[0]) {
            const reader = new FileReader();

            reader.onload = function(e) {
                image.src = e.target.result;
                image.style.visibility = 'visible';
            };

            reader.readAsDataURL(input.files[0]);
        } else {
            image.src = '';
            image.style.visibility = 'hidden';
        }
    }

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const datev = form.datev.value;
    const name = form.name.value;
    const dose = form.dose.value;
    const picFile = form.pic.files[0];
    const daten = form.daten.value;

    const fileName = `${Date.now()}-${picFile.name}`;

    const storageRef = ref(storage, fileName);

    uploadBytes(storageRef, picFile)
      .then(() => {
        return getDownloadURL(storageRef);
      })
      .then(function(picURL) {
        const vacinaData = {
          user: userId,
          datev: datev,
          name: name,
          dose: dose,
          pic: picURL,
          daten: daten,
        };

        return addDoc(collection(db, "vacinas"), vacinaData);
      })
      .then(() => {
        window.location.href = "home.html";
      })
      .catch(function(error) {
        console.error("Erro:", error);
      });
  });
});