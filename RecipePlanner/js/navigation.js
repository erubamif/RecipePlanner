export function setupNavigation() {
  const menuButton = document.querySelector("#menu-button");
  const mainNav = document.querySelector("#main-nav");

  if (!menuButton || !mainNav) {
    return;
  }

  menuButton.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");

    menuButton.setAttribute("aria-expanded", isOpen);
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );
  });

  const navLinks = mainNav.querySelectorAll("a");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation menu");
    });
  });
}