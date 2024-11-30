class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.mountHeader(this);
  }

  mountHeader(context) {
    context.innerHTML = `
      <header>
        <nav class="navbar justify-content-center">
          <a class="nav-item" href="./index.html">Rules</a>
          <a class="nav-item" href="./authorization.html">Authorization</a>
          <a class="nav-item" href="./game.html">Game</a>
          <a class="nav-item" href="./leaderboard.html">Leaderboard</a>
        </nav>
      </header>
    `;
  }
}

customElements.define("header-component", Header);
