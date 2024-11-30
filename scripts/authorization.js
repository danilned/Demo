import {
  apiURL,
  retryRequest,
  cookieExpireInMillis,
} from "./request_sender.js";

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

const alertContainer = document.querySelector(".alert");
const alertInfo = document.querySelector(".alert > .info");

document.querySelector(".auth").addEventListener("click", async () => {
  try {
    const login = document.querySelector(".input-name").value;
    const password = document.querySelector(".input-password").value;

    const pass = await hashPassword(password);

    const response = await retryRequest(`${apiURL}/login`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ login, password: pass }),
    });

    await response.json();

    localStorage.setItem(
      "cookieExpiresIn",
      new Date().getTime() + cookieExpireInMillis
    );
    localStorage.setItem("username", login);

    alertInfo.innerText = "Пользователь успешно авторизован!";
    alertContainer.classList.add("show");

    document.dispatchEvent(new Event("authorized"));
  } catch (error) {
    alertInfo.innerText = error.message ?? "Ошибка при авторизации";
    alertContainer.classList.add("show");
  } finally {
    setTimeout(() => {
      alertContainer.classList.remove("show");
    }, 2000);
  }
});

document.querySelector(".register").addEventListener("click", async () => {
  try {
    const login = document.querySelector(".input-name").value;
    const password = document.querySelector(".input-password").value;

    const pass = await hashPassword(password);

    const response = await retryRequest(`${apiURL}/players`, {
      method: "POST",
      body: JSON.stringify({ login, password: pass }),
    });

    await response.json();

    alertInfo.innerText = "Пользователь успешно зарегистрирован!";
    alertContainer.classList.add("show");
  } catch (error) {
    alertInfo.innerText = error.message ?? "Ошибка при регистрации";
    alertContainer.classList.add("show");
  } finally {
    setTimeout(() => {
      alertContainer.classList.remove("show");
    }, 2000);
  }
});
