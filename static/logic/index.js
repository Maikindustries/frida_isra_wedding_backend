// Set the date we're counting down to
const countDownDate = new Date("Apr 21, 2024 15:00:00").getTime();

// Update the count down every 1 second
const x = setInterval(function () {
  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  document.getElementById("days").innerHTML = days;
  document.getElementById("hours").innerHTML = hours;
  document.getElementById("minutes").innerHTML = minutes;
  document.getElementById("seconds").innerHTML = seconds;

  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("demo").innerHTML = "EXPIRED";
  }
}, 1000);

// function myNavFunc() {
//   // If it's an iPhone..
//   if (
//     navigator.platform.indexOf("iPhone") != -1 ||
//     navigator.platform.indexOf("iPod") != -1 ||
//     navigator.platform.indexOf("iPad") != -1
//   )
//     window.open("maps:https://goo.gl/maps/WbekMxVqSfBBnx2j9");
//   else window.open("https://goo.gl/maps/WbekMxVqSfBBnx2j9");
// }

// console.log("mike");
// const found = document.URL.match(/\\(\d+)/g);
// console.log(found);
// // get user info
// const data = {
//   id_invitado: document.URL,
// };
// fetch("http://192.168.1.85:5000/get_info", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify(data),
// })
//   .then((res) => res.json())
//   .then((data) => {
//     console.log(data);
//   })
