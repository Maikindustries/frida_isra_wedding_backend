const invitedPeopleLiTemplate = document.querySelector(
  "[invited-people-template]"
);
const invitedPeopleLiContainer = document.querySelector(
  "[invited-people-li-container]"
);
const searchInput = document.querySelector("[data-search]");

let persons = [];

searchInput.addEventListener("input", (event) => {
  const value = event.target.value.toLowerCase();
  persons.forEach((person) => {
    const isVisible = person.name.toLowerCase().includes(value);
    person.element.classList.toggle("hide", !isVisible);
  });
});

fetch("https://jsonplaceholder.typicode.com/users")
  .then((res) => res.json())
  .then((data) => {
    persons = data.map((person) => {
      const li = invitedPeopleLiTemplate.content.cloneNode(true).children[0];
      const name = li.querySelector("[data-name]");
      const table = li.querySelector("[data-table]");
      const nPersons = li.querySelector("[data-persons]");
      person.id = person.id > 9 ? 3 : person.id;
      name.textContent = person.name;
      table.textContent = person.id;
      nPersons.textContent = person.id;
      // Logica que cambiar para mostar diferentes colores
      const confirmed =
        person.id % 2 === 0 ? "invitation-confirmed" : "invitation-rejected";
      //
      li.classList.add(confirmed);
      invitedPeopleLiContainer.append(li);
      return {
        name: person.name,
        table: person.id,
        nPersons: person.id,
        confirmed: confirmed,
        element: li,
      };
    });
  });
