import { setupNavigation } from "./navigation.js";
import { searchAndDisplayRecipes } from "./recipes.js";

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupSearch();
});

function setupSearch() {
  const searchForm = document.querySelector("#search-form");
  const searchInput = document.querySelector("#search-input");

  if (!searchForm || !searchInput) {
    return;
  }

  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const query = searchInput.value.trim();

    if (query.length < 2) {
      return;
    }

    await searchAndDisplayRecipes(query);
  });
}