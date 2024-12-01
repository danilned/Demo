import { apiURL, retryRequest } from "./request_sender.js";

const tbody = document.querySelector(".table tbody");

let users = null;
let availablePages = null;
let currentPage = 0;
let itemsOnPage = 5;
const sortOrder = Object.freeze({
  score: 1,
  username: 0,
});

const insertRows = () => {
  users
    .slice(currentPage * itemsOnPage, currentPage * itemsOnPage + itemsOnPage)
    .forEach((element) => {
      const row = tbody.insertRow(null);
      const scoreRow = row.insertCell(null);
      const loginRow = row.insertCell(null);

      loginRow.innerText = element.Login;
      scoreRow.innerText = element.Score;
    });
};

const fetchUsers = async () => {
  try {
    const response = await retryRequest(`${apiURL}/players`, {
      method: "GET",
    });

    users = await response.json();

    availablePages = Math.floor(users.length / itemsOnPage) + 1;

    insertRows();
  } catch (error) {
    console.log(error);
  }
};

const sortTable = (columnIndex) => {
  const rows = Array.from(tbody.rows);

  const direction = (tbody.dataset.sortDirection =
    tbody.dataset.sortDirection === "asc" ? "desc" : "asc");

  rows.sort((a, b) => {
    const aText = a.cells[columnIndex].innerText;
    const bText = b.cells[columnIndex].innerText;

    if (columnIndex) {
      return direction === "asc" ? aText - bText : bText - aText;
    }

    return direction === "asc"
      ? aText.localeCompare(bText)
      : bText.localeCompare(aText);
  });

  rows.forEach((row) => tbody.appendChild(row));
};

document
  .querySelector(".search-container > input")
  .addEventListener("input", (event) => {
    const table = document.querySelector(".table");
    const tbody = table.querySelector("tbody");

    if (!event.target.value) {
      tbody.innerHTML = "";
      insertRows();
      return;
    }

    const rows = Array.from(table.rows).slice(1);

    const filteredRows = rows.filter((cur) =>
      cur.cells[sortOrder.username].innerText
        .toLowerCase()
        .includes(event.target.value.toLowerCase())
    );

    tbody.innerHTML = "";

    filteredRows.forEach((row) => tbody.appendChild(row));
  });

document.querySelectorAll(".sort-icon").forEach((cur) => {
  cur.onclick = (event) => {
    sortTable(sortOrder[event.target.attributes.type.value]);
  };
});

document.querySelectorAll(".buttons-count button").forEach((cur) => {
  cur.onclick = (event) => {
    itemsOnPage = +event.target.textContent;
    availablePages = Math.floor(users.length / itemsOnPage) + 1;

    const tbody = document.querySelector(".table tbody");
    tbody.innerHTML = "";

    insertRows();
  };
});

document.querySelectorAll(".pagination > li").forEach((cur) => {
  cur.onclick = (event) => {
    const tbody = document.querySelector(".table tbody");

    tbody.innerHTML = "";

    currentPage = Math.min(
      availablePages,
      Math.max(+event.target.attributes["data-value"].value, 0)
    );

    insertRows();
  };
});

fetchUsers();
