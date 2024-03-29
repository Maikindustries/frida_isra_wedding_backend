const TESTING = false;

let BASE_URL = "https://www.frida-isra-boda.com";
if (TESTING) {
  BASE_URL = "http://192.168.1.85:5000";
}

// Store values
let guestNameText = "";

// Selectors
// PLay music buttons
const playButton = document.getElementById("play-button");
const pauseButton = document.getElementById("pause-button");

// Confirmation section
const checkbox = document.querySelector(".c-a-select-checkbox");
const selectConfirmationContainer = document.querySelector(
  ".c-a-select-confirmation-container"
);

const guestResponseContainer = document.querySelector(
  ".c-a-guest-response-container"
);
const guestResponse = document.querySelector(".c-a-guest-response");
const confirmationButton = document.getElementById("c-a-send-confirmation");

// Selectors for animations
const aboutUsSection2ImgIsra = document.getElementById(
  "about-us-section2-img-isra"
);
const aboutUsSection2ImgFrida = document.getElementById(
  "about-us-section2-img-frida"
);
const aboutUsTextContainer2Isra = document.querySelector(
  ".about-us-text-container2--isra"
);
const aboutUsTextContainer2Frida = document.querySelector(
  ".about-us-text-container2--frida"
);
const countDownDate = document.querySelector(".countdown--date");
const locationItemCeremony = document.getElementById("location-item-ceremony");
const locationItemReception = document.getElementById(
  "location-item-reception"
);
const dressCodeMenImg = document.getElementById("dress-code-men-img");
const dressCodeWomenImg = document.getElementById("dress-code-women-img");
const aboutUsImg2Isra = document.querySelector(".about-us-img2--isra");
const aboutUsImg2Frida = document.querySelector(".about-us-img2--frida");
const aboutUsSmallTextContainerIsra = document.querySelector(
  ".about-us-small-text-container--isra"
);
const aboutUsSmallTextContainerFrida = document.querySelector(
  ".about-us-small-text-container--frida"
);

// Event Listeners
// Confirmation section
checkbox.addEventListener("click", (event) => {
  if (event.target.checked) {
    confirmationButton.innerText = "Confirmar asistencia";
  } else {
    confirmationButton.innerText = "Cancelar asistencia";
  }
});

// About us section
var x = window.matchMedia("(max-width: 704px)");
x.addListener(showAboutUsSectionMediaMatch);

// Gallery section
var y = window.matchMedia("(max-width: 700px)");
y.addListener(showGallerSectionMediaMatch);

// State variables
let isPlaying = false;
const song = new Audio("../static/audio/Lucky.mp3");

// Functions
function showAboutUsSectionMediaMatch(x) {
  const aboutUsSmallSection = document.querySelector(".about-us-small-section");
  const aboutUsSection2 = document.querySelector(".about-us-section2");

  if (x.matches) {
    // If media query matches
    aboutUsSection2.style.display = "none";
    aboutUsSmallSection.style.display = "";
  } else {
    aboutUsSection2.style.display = "";
    aboutUsSmallSection.style.display = "none";
  }
}

function saveAssistanceInDatabase() {
  // Confirmation section
  let confirmacion = "";
  let confirmationMessage = "";
  if (checkbox.checked) {
    confirmacion = "confirmada";
    confirmationMessage = `${guestNameText}, has confirmado tu asistencia.`;
  } else {
    confirmacion = "no vendra";
    confirmationMessage = `${guestNameText}, has rechazado tu asistencia.`;
  }

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get("id");
  console.log(id);
  let postData = {
    id: id,
    confirmacion: confirmacion,
  };

  fetch(`${BASE_URL}/guest/updateConfirmation`, {
    method: "POST",
    body: JSON.stringify(postData),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log(error);
      // Show error message prompt
    })
    .then((json) => {
      console.log(json);
      // Restore order of menus
      // Show success message prompt
      guestResponse.innerText = confirmationMessage;
      showOrHideConfirmationMenu();
    });
}

function showOrHideConfirmationMenu() {
  // Confirmation section
  selectConfirmationContainer.classList.toggle("hide");
  guestResponseContainer.classList.toggle("hide");
}

function getGuestInfo() {
  // Confirmation section
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get("id");
  console.log("id", id);
  const confirmationSection = document.getElementById(
    "section-confirm-assistance"
  );
  if (id === null || id === undefined || id.length != 32) {
    confirmationSection.style.display = "none";
    return;
    // don't do fetch
  }
  // return;
  fetch(`${BASE_URL}/guest/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => response.json())
    .catch((error) => {
      console.log(error);
      console.log("fetch to database failed");
    })
    .then((guest) => {
      if (guest === undefined) {
        confirmationSection.style.display = "none";
        return;
      }
      // save variable
      guestNameText = guest.nombre;

      const guestName = document.querySelector("[c-a-guest-name]");
      guestName.innerText = guest.nombre;

      if (guest.asistencia == "confirmada") {
        guestResponse.innerText = `${guest.nombre}, has confirmado tu asistencia.`;
        showOrHideConfirmationMenu();
      } else if (guest.asistencia == "no vendra") {
        guestResponse.innerText = `${guest.nombre}, has rechazado tu asistencia.`;
        showOrHideConfirmationMenu();
      } else {
        // "no revisada" o "revisada"
      }
    });
}

function setCountdown() {
  // Set the date we're counting down to
  const countDownDate = new Date("Apr 21, 2024 12:30:00").getTime();

  // Update the count down every 1 second
  let interval = setInterval(function () {
    // Get today's date and time
    const now = new Date().getTime();

    // Find the distance between now and the count down date
    const distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result in the element with id="demo"
    document.getElementById("days").innerHTML = days;
    document.getElementById("hours").innerHTML = hours;
    document.getElementById("minutes").innerHTML = minutes;
    document.getElementById("seconds").innerHTML = seconds;

    // If the count down is finished, write some text
    if (distance < 0) {
      clearInterval(interval);
      document.getElementById("demo").innerHTML = "EXPIRED";
    }
  }, 1000);
}

function showGallerSectionMediaMatch(x) {
  let gallerySectionVertical = document.getElementById(
    "gallery-section-vertical"
  );
  let gallerySectionHorizontal = document.getElementById(
    "gallery-section-horizontal"
  );
  let completeGalleryCarouselSection = document.querySelector(
    ".complete-gallery-carousel-section"
  );
  if (x.matches) {
    // If media query matches
    gallerySectionVertical.style.display = "none";
    gallerySectionHorizontal.style.display = "none";
    completeGalleryCarouselSection.style.display = "";
  } else {
    gallerySectionVertical.style.display = "";
    gallerySectionHorizontal.style.display = "";
    completeGalleryCarouselSection.style.display = "none";
  }
}

function showThanksTriangleMatch(x) {
  const thanksSvgBig = document.getElementById("thanks-svg-bg");
  const thanksSvgSmall = document.getElementById("thanks-svg-sm");
  if (x.matches) {
    thanksSvgBig.style.display = "";
    thanksSvgSmall.style.display = "none";
  } else {
    thanksSvgBig.style.display = "none";
    thanksSvgSmall.style.display = "";
  }
}

function loadImage(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animated-visible");
    }
  });
}

function playSong() {
  if (isPlaying) {
    song.pause();
    isPlaying = false;
    playButton.style.display = "";
    pauseButton.style.display = "none";
  } else {
    song.play();
    isPlaying = true;
    playButton.style.display = "none";
    pauseButton.style.display = "";
  }
}

// Observers for animations
const observer = new IntersectionObserver(loadImage, {
  root: null,
  rootMargin: "0px 0px 0px 0px",
  threshold: 0.4,
});

const observedItems = [
  aboutUsSection2ImgIsra,
  aboutUsSection2ImgFrida,
  aboutUsTextContainer2Isra,
  aboutUsTextContainer2Frida,
  countDownDate,
  locationItemCeremony,
  locationItemReception,
  dressCodeMenImg,
  dressCodeWomenImg,
  aboutUsSmallTextContainerIsra,
  aboutUsSmallTextContainerFrida,
  aboutUsImg2Isra,
  aboutUsImg2Frida,
];
observedItems.forEach((observedItem) => {
  observer.observe(observedItem);
});

// Calls

// About us section
// This mediaMatch needs to be called at the beginning obligatory
showAboutUsSectionMediaMatch(x);

// Confirmation section
getGuestInfo();

// Countdown section
setCountdown();

// Gallery section
// This mediaMatch needs to be called at the beginning obligatory
showGallerSectionMediaMatch(y);
