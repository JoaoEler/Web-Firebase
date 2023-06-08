import app from "./firebase.js";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const db = getFirestore(app);
const vacinas = collection(db, "vacinas");
const pai = document.getElementById("itemsContainer");
const er = document.getElementById("err");
const busc = document.getElementById("busc");
const rendered = [];

const storedUser = localStorage.getItem("@MyHealth:user");
const user = JSON.parse(storedUser);
const userId = user.uid;

let timeoutId;

er.style.visibility = "hidden";
er.style.marginTop = "0"; 
er.style.marginBottom = "0"; 

busc.style.visibility = "hidden";
busc.style.marginTop = "0"; 
busc.style.marginBottom = "0"; 

function formatarData(data) {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

function filterVacinas() {
  clearTimeout(timeoutId);
  busc.style.visibility = "visible";
  busc.style.marginTop = "50px";
  busc.style.marginBottom = "250px";
  er.style.visibility = "hidden";
  er.style.marginTop = "0";
  er.style.marginBottom = "0";
  const searchValue = searchInput.value.toLowerCase();
  const vacinasContainer = document.getElementById("itemsContainer");
  vacinasContainer.innerHTML = "";
  rendered.length = 0;

  timeoutId = setTimeout(() => {
    if (searchValue === "") {
      rendered.length = 0; 
      buscarVacinas();
    } else {
      getDocs(vacinas)
        .then((querySnapshot) => {
          const matchingItems = [];
          const renderedIds = new Set(rendered);
          querySnapshot.forEach((doc) => {
            if (doc.data !== null) {
              const item = doc.data();
              if (item.user == userId && item.name.toLowerCase().includes(searchValue)) {
                item.id = doc.id;
                if (!renderedIds.has(item.id)) {
                  matchingItems.push(item);
                }
              }
            }
          });
  
          if(matchingItems.length == 0){
            busc.style.visibility = "hidden";
            busc.style.marginTop = "0"; 
            busc.style.marginBottom = "0"; 

            er.style.visibility = "visible";
            er.style.marginTop = "50px"; 
            er.style.marginBottom = "250px";
          } else {
            er.style.visibility = "hidden";
            er.style.marginTop = "0";
            er.style.marginBottom = "0";
          }
  
          matchingItems.forEach((item) => {
            const vacina = createItemElement(item, item.id);
            if (vacina) {
              pai.appendChild(vacina);
              rendered.push(item.id);
            }
          });
        })
        .catch((error) => {
          console.error("Erro:", error);
        });
    }
  }, 300);
}


function sendData(item, id) {
    const name = item.name;
    const dose = item.dose;
    const datev = item.datev;
    const imgSrc = item.pic;
    const daten = item.daten;

    const data = {
        name: name,
        dose: dose,
        datev: datev,
        pic: imgSrc,
        daten: daten
    };

    localStorage.setItem('@vacina-id', id);
    localStorage.setItem('@vacina-dados', JSON.stringify(data));
    window.location.href = 'editar_vacina.html';
}

function createItemElement(item, id) {
    busc.style.visibility = "hidden";
    busc.style.marginTop = "0"; 
    busc.style.marginBottom = "0"; 
    er.style.visibility = "hidden";
    er.style.marginTop = "0"; 
    er.style.marginBottom = "0"; 
    
    const div = document.createElement("div");
    div.classList.add("items");

    const title = document.createElement("h1");
    title.classList.add("title");
    title.textContent = item.name;
    div.appendChild(title);

    const dosebox = document.createElement("div");
    dosebox.classList.add("dosebox");
    div.appendChild(dosebox);

    const dose = document.createElement("h2");
    dose.classList.add("dose");
    dose.textContent = item.dose;
    dosebox.appendChild(dose);

    const date = document.createElement("h2");
    date.classList.add("data");
    date.textContent = formatarData(item.datev);
    div.appendChild(date);

    const img = document.createElement("img");
    img.classList.add("vacimg")
    img.src = item.pic;
    img.alt = "img";
    div.appendChild(img);

    const doseNext = document.createElement("h3");
    doseNext.classList.add("dosenx");
    doseNext.textContent = formatarData(item.datev);
    div.appendChild(doseNext);

    div.addEventListener("click", function () {
      sendData(item, id);
    });

    if (!rendered.includes(id)) {
      rendered.push(id);
      return div;
    } else {
      return null;
    }
}

function buscarVacinas() {
  getDocs(vacinas)
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if(doc.data !== null){
          const item = doc.data();
          if(item.user == userId){
            if (!rendered.includes(doc.id)) {
              const vacina = createItemElement(item, doc.id);
              pai.appendChild(vacina);
              rendered.push(doc.id);
            }
          }
        }
      })
      if (rendered.length == 0){
        er.style.visibility = "visible";
        er.style.marginTop = "50px"; 
        er.style.marginBottom = "250px"; 
      };
    })
    .catch((error) => {
      console.error("Erro:", error);
    });
}

window.onload = () => {
  const searchInput = document.getElementById("searchInput");

  buscarVacinas();
  searchInput.addEventListener("input", filterVacinas);
};