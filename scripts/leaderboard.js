import { apiURL } from "./request_sender.js";

const table = document.querySelector(".table tbody");

const fetchUsers = async () => {
  try {
    const users = await fetch(`${apiURL}/players`, {
      method: "GET",
    }).then((data) => data.json());

    users.forEach((element) => {
      const row = table.insertRow(null);
      const scoreRow = row.insertCell(null);
      const loginRow = row.insertCell(null);

      loginRow.innerText = element.Login;
      scoreRow.innerText = element.Score;
    });
  } catch (error) {
    console.log(error);
  }
};

document.querySelectorAll(".sort-icon").forEach((cur) => {
  cur.onclick = (element) => {
    const rows = Array.from(table.rows);

    const columnIndex =
      element.target.attributes.type.value === "score" ? 1 : 0;
    const direction = (table.dataset.sortDirection =
      table.dataset.sortDirection === "asc" ? "desc" : "asc");

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

    rows.forEach((row) => table.appendChild(row));
  };
});

fetchUsers();
