import { apiURL } from "./request_sender.js";

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

document.querySelector(".auth").addEventListener("click", async () => {
  try {
    const login = document.querySelector(".input-name").value;
    const password = document.querySelector(".input-password").value;

    const pass = await hashPassword(password);

    const req = await fetch(`${apiURL}/login`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ login, password: pass }),
    });

    console.log(req);
  } catch (error) {
    console.log(error);
  }
});

document.querySelector(".register").addEventListener("click", async () => {
  try {
    const login = document.querySelector(".input-name").value;
    const password = document.querySelector(".input-password").value;

    const pass = await hashPassword(password);

    const req = await fetch(`${apiURL}/players`, {
      method: "POST",
      body: JSON.stringify({ login, password: pass }),
    });
  } catch (error) {
    console.log(error);
  }
});

document.querySelector(".put-score-btn").addEventListener("click", async () => {
  try {
    const score = +document.querySelector(".put-score").value;

    const req = await fetch(`${apiURL}/players/sadamxuseinn`, {
      method: "PUT",
      body: JSON.stringify({ score }),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(req);
  } catch (error) {
    console.log(error);
  }
});
