export function crearMenu(): string {
  return `<nav class="header-navigation" aria-label="Navegaci&oacute;n principal">
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-menu"
            aria-label="Abrir men&uacute; principal">
      <span class="menu-toggle-lines" aria-hidden="true"></span>
      <span class="visually-hidden">Abrir men&uacute; principal</span>
    </button>
    <ul class="navigation-list" id="primary-menu">
      <li>
        <a class="navigation-link" href="#inicio" aria-current="page">
          <span class="navigation-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="img" focusable="false">
              <path fill="currentColor"
                    d="M12 2.8l2.57 5.21 5.75.84-4.16 4.05.98 5.72L12 15.92l-5.14 2.70.98-5.72-4.16-4.05 5.75-.84L12 2.8z"/>
            </svg>
          </span>
          <span class="navigation-label">Inicio</span>
        </a>
      </li>
    </ul>
  </nav>
`;
}

export function iniciarMenu(header: HTMLElement): void {
  const menuToggle = header.querySelector<HTMLButtonElement>('.menu-toggle');
  const menu = header.querySelector<HTMLUListElement>('.navigation-list');
  const closeMenu = () => {
    if (!menuToggle || !menu) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir men\u00fa principal');
    menu.classList.remove('is-open');
  };

  if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
      const willOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
      menuToggle.setAttribute('aria-expanded', String(willOpen));
      menuToggle.setAttribute('aria-label', `${willOpen ? 'Cerrar' : 'Abrir'} men\u00fa principal`);
      menu.classList.toggle('is-open', willOpen);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMenu();
        menuToggle.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 700) closeMenu();
    });
  }

}
