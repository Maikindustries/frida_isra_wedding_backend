const TESTING = false;

let BASE_URL = "https://www.frida-isra-boda.com";
if (TESTING) {
  BASE_URL = "http://192.168.1.85:5000";
}

// Selectors
// CONFIRMATION NUMBERS
const confirmedNumber = document.querySelector(".confirmed-number");
const unconfirmedNumber = document.querySelector(".unconfirmed-number");
const rejectedNumber = document.querySelector(".rejected-number");
// REGISTER GUEST

const filterByConfirmationSelect = document.querySelector(
  ".filter-by-confirmation-select"
);
// GUEST LIST
const guestsList = document.querySelector(".guests-list");
const guestTemplate = document.querySelector(".guest-template");
const guestInputTemplate = document.querySelector(".guest-input-template");

// Event Listeners
filterByConfirmationSelect.addEventListener("click", filterGuests);

// Functions
function showNumbers() {
  fetch(`${BASE_URL}/admin/get_numbers`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      confirmedNumber.innerHTML = data.confirmada;
      unconfirmedNumber.innerHTML = data["no confirmada"];
      rejectedNumber.innerHTML = data["no vendra"];
    })
    .catch((err) => {
      console.log("Confirmation Numbers", err);
    });
}

function showGuests() {
  fetch(`${BASE_URL}/admin/get_users`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      data.map((guest) => {
        // Selectors
        const guestLi = guestTemplate.content.cloneNode(true).children[0];
        const guestNameP = guestLi.querySelector(".guest-name");
        const guestTableP = guestLi.querySelector(".guest-table");

        guestNameP.innerHTML = guest.nombre;
        if (guest.mesa !== -1) {
          guestTableP.innerHTML = guest.mesa;
        }
        // Configure confirmation
        const guestConfirmation = guest.asistencia;
        let confirmationCss;
        if (guestConfirmation === "confirmada") {
          confirmationCss = "confirmed-guest";
        } else if (
          guestConfirmation === "no confirmada" ||
          guestConfirmation === "no revisada"
        ) {
          confirmationCss = "unconfirmed-guest";
        } else if (guestConfirmation === "no vendra") {
          confirmationCss = "rejected-guest";
        }

        guestLi.classList.add(confirmationCss);
        guestsList.appendChild(guestLi);
      });
    });
}

function filterGuests(e) {
  const guests = guestsList.childNodes;
  guests.forEach(function (guest) {
    if (e.target === undefined) {
      return;
    }
    console.log(e.target.value);
    switch (e.target.value) {
      case "all":
        guest.style.display = "";
        break;
      case "confirmed":
        if (guest.classList.contains("confirmed-guest")) {
          guest.style.display = "";
        } else {
          guest.style.display = "none";
        }
        break;
      case "unconfirmed":
        if (guest.classList.contains("unconfirmed-guest")) {
          guest.style.display = "";
        } else {
          guest.style.display = "none";
        }
        break;
      case "rejected":
        if (guest.classList.contains("rejected-guest")) {
          guest.style.display = "";
        } else {
          guest.style.display = "none";
        }
        break;
    }
  });
}

function deleteGuest(idInvitado, guestLi) {
  Swal.fire({
    title: "¿Quieres borrar esta persona?",
    showCancelButton: true,
    color: "white",

    background: " rgb(45, 45, 45)",
    confirmButtonColor: "green",
    confirmButtonText: "<p style='font-size:1.6rem'>Aceptar</p>",
    cancelButtonText: "<p style='font-size:1.6rem'>Cancelar</p>",
  }).then((result) => {
    if (result.isConfirmed) {
      const data = {
        id_invitado: idInvitado,
      };
      fetch(`${BASE_URL}/admin/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then(() => {
          Swal.fire("Borrado exitosamente!", "", "success");
          guestLi.remove();
        })
        .catch((err) => {
          li.remove();
          Swal.fire(
            "Fallo al borrar, verifica tu conexion a Internet",
            err,
            "info"
          );
        });
    } else if (result.isDenied) {
      Swal.fire(
        "Fallo al borrar, verifica tu conexion a Internet",
        err,
        "info"
      );
    }
  });
}

function updateGuestInDatabase(idInvitado, guestLi) {
  // Selectors
  const guestTableP = guestLi.querySelector(".guest-table");
  const guestTableInput = guestLi.querySelector(".guest-table-input");
  const guestNameP = guestLi.querySelector(".guest-name");
  const guestNameInput = guestLi.querySelector(".guest-name-input");

  //Logic
  const postData = {};

  if (guestTableInput.value !== "") {
    console.log(guestTableInput.value);
    postData["tableNumber"] = guestTableInput.value;
  }
  if (guestNameInput.value !== "") {
    console.log(guestNameInput.value);
    postData["guestName"] = guestNameInput.value;
  }
  if (Object.keys(postData).length === 0) {
    // Regresar al estado inicial del li
    toggleShowHideUpdateGuest(guestLi);
    return;
  }

  postData["idInvitado"] = idInvitado;
  fetch(`${BASE_URL}/admin/update2`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data["status"] === "ok") {
        if ("guestName" in postData) {
          guestNameP.innerText = postData["guestName"];
        }
        if ("tableNumber" in postData) {
          guestTableP.innerText = postData["tableNumber"];
        }
      } else {
        console.log("Connection not available");
      }
    });

  // Regresar al estado inicial del li
  toggleShowHideUpdateGuest(guestLi);
}

function toggleShowHideUpdateGuest(guestLi) {
  // Selectors
  const tableIcon = guestLi.querySelector(".guest-table-icon");
  const guestTableP = guestLi.querySelector(".guest-table");
  const guestTableInput = guestLi.querySelector(".guest-table-input");
  const guestNameP = guestLi.querySelector(".guest-name");
  const guestNameInput = guestLi.querySelector(".guest-name-input");
  const guestDeleteBtn = guestLi.querySelector(".guest-delete-btn");
  const guestShowUpdateMenuBtn = guestLi.querySelector(
    ".guest-show-update-menu-btn"
  );
  const guestCancelBtn = guestLi.querySelector(".guest-cancel-btn");
  const guestConfirmBtn = guestLi.querySelector(".guest-confirm-btn");

  // Logic
  guestTableP.classList.toggle("hide");
  guestNameP.classList.toggle("hide");

  guestTableInput.classList.toggle("hide");
  guestNameInput.classList.toggle("hide");

  guestDeleteBtn.classList.toggle("hide");
  guestShowUpdateMenuBtn.classList.toggle("hide");

  guestCancelBtn.classList.toggle("hide");
  guestConfirmBtn.classList.toggle("hide");

  const isShowingInputs = guestTableP.classList.contains("hide");
  if (isShowingInputs) {
    guestTableInput.placeholder = guestTableP.innerText;
    guestNameInput.placeholder = guestNameP.innerText;
    tableIcon.style.fontSize = "1rem";
  } else {
    tableIcon.style.fontSize = "2rem";
    guestTableInput.value = "";
    guestNameInput.value = "";
  }
}

// RUNS
showNumbers();
showGuests();
