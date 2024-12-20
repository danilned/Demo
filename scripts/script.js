const cookieExpiresIn = localStorage.getItem("cookieExpiresIn");
const isCookieExpired = !cookieExpiresIn
  ? true
  : cookieExpiresIn - new Date().getTime() <= 0;

const paths = window.location.pathname.split(/\//g);

switch (true) {
  case isCookieExpired &&
    !["authorization", "index"].some((cur) => paths.at(-1).includes(cur)): {
    localStorage.removeItem("username");

    window.location.pathname =
      paths.slice(0, -1).join("\\") + "/authorization.html";

    break;
  }
  default: {
    document.body.style.display = "block";
    document.body.style.opacity = 1;
  }
}

class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.registerAuthorizedListener(this);
    this.mountHeader(this, !isCookieExpired);
  }

  mountHeader(context, displayAuthorizedRoutes) {
    context.innerHTML = `
      <header>
        <nav class="navbar justify-content-center">
          <a class="nav-item" href="./index.html">Rules</a>
          <a class="nav-item" href="./authorization.html">Authorization</a>
          ${
            !displayAuthorizedRoutes
              ? ``
              : `
                      <a class="nav-item" href="./game.html">Game</a>
                      <a class="nav-item" href="./leaderboard.html">Leaderboard</a>`
          }
        </nav>
      </header>
    `;
  }

  registerAuthorizedListener(context) {
    document.addEventListener("authorized", () =>
      this.mountHeader(context, true)
    );
  }
}

customElements.define("header-component", Header);
