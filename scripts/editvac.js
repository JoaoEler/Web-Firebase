import app from "./firebase.js";
import { getFirestore, collection, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const db = getFirestore(app);
const vacinas = collection(db, "vacinas");
const storage = getStorage(app);

const popup = document.getElementById("popup");
const body = document.querySelector('body');
const image = document.getElementById('imagem');
image.style.visibility = 'hidden';

const form = document.querySelector('form');
const dataVacInput = form.querySelector('.dataVac');
const nameInput = form.querySelector('.nameInput');
const doseRadios = form.querySelectorAll('input[type="radio"][name="dose"]');
const dataNextInput = form.querySelector('.dataNext');

const storedData = localStorage.getItem('@vacina-dados');
const id = localStorage.getItem('@vacina-id');
const data = JSON.parse(storedData);
localStorage.removeItem('@vacina-dados');
localStorage.removeItem('@vacina-id');
const storedUser = localStorage.getItem("@MyHealth:user");
const user = JSON.parse(storedUser);
const userId = user.uid;

if (data) {
  dataVacInput.value = data.datev;
  dataNextInput.value = data.daten;
  nameInput.value = data.name;

  for (const radio of doseRadios) {
    if (radio.value === data.dose) {
      radio.checked = true;
      break;
    }
  }

  if (data.pic) {
    image.src = data.pic;
    image.style.visibility = 'visible';
  }
}

function abrir() {
  popup.classList.add('visible');
  body.classList.add('no-scroll');

  const sim = document.querySelector('.yes');
  const nao = document.querySelector('.no');

    sim.addEventListener("click", () => {
      remove();
    });

    nao.addEventListener("click", () => {
      fechar();
    });
}

function fechar() {
  popup.classList.remove('visible');
  body.classList.remove('no-scroll');
}

function carregarImagem(event) {
  const input = event.target;

  if (input.files && input.files[0]) {
    const reader = new FileReader();

    reader.onload = function (e) {
      image.src = e.target.result;
      image.style.visibility = 'visible';
    };

    reader.readAsDataURL(input.files[0]);
  } else {
    image.src = '';
    image.style.visibility = 'hidden';
  }
}

// function formatarData(data) {
//   const [dia, mes, ano] = data.split('/');
//   return `${ano}-${mes}-${dia}`;
// }

async function updateVaxData() {
    const doseValue = form.querySelector('input[type="radio"][name="dose"]:checked').value;
    const dateValue = dataVacInput.value;
    const nextDoseValue = dataNextInput.value;
    const titleValue = nameInput.value;
    let picFile = form.pic.files[0];

    if(!picFile){
      picFile = data.pic;
    }

    const fileName = `${Date.now()}-${picFile.name}`;

    const storageRef = ref(storage, fileName);
  
    try {
     if(form.pic.files[0]){
      console.log("ok")
      uploadBytes(storageRef, picFile)
      .then(() => {
        return getDownloadURL(storageRef);
      })
      .then(async function(picURL) {
        await updateDoc(doc(vacinas, id), {
            user: userId,
            dose: doseValue,
            datev: dateValue,
            daten: nextDoseValue,
            pic: picURL,
            name: titleValue
        });
      })
      .then(() => {
        window.location.href = "home.html";
      })
      .catch((error) => {
        console.error("Erro:", error);
      });
     } else {
      console.log("ok2")
      await updateDoc(doc(vacinas, id), {
        user: userId,
        dose: doseValue,
        datev: dateValue,
        daten: nextDoseValue,
        pic: picFile,
        name: titleValue
      }).then(() => {
        window.location.href = "home.html";
      })
      .catch((error) => {
        console.error("Erro:", error);
      });
     }
    } catch (error) {
      console.error("Erro:", error);
    }
  }

  async function remove() {
    try {
      await deleteDoc(doc(vacinas, id));

      window.location.href = "home.html";
    } catch (error) {
      console.error("Erro:", error);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const excluirButton = document.querySelector('.btnexc');
  
    const submitButton = document.querySelector('.btn');
  
    const fileInput = document.querySelector('.pic');
  
    excluirButton.addEventListener('click', (e) => {
      e.preventDefault();
      abrir();
    });
  
    submitButton.addEventListener('click', (e) => {
      console.log("submitting");
      e.preventDefault();
      updateVaxData();
    });
  
    fileInput.addEventListener("change", (e) => {
      carregarImagem(e);
    });
  });