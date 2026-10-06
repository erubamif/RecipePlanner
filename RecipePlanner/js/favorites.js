import { getFavorites, removeFavorite } from "./storage.js";
import { setupNavigation } from "./navigation.js";

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  displayFavorites();
});

function displayFavorites() {
  const resultsContainer = document.querySelector("#favorite-results");

  if (!resultsContainer) {
    return;
  }

  const favorites = getFavorites();

  if (favorites.length === 0) {
    resultsContainer.innerHTML = `
      <p class="empty-message">
        You have no favorite recipes yet.
        Search for a recipe and add it to your favorites.
      </p>
    `;
    return;
  }

  resultsContainer.innerHTML = favorites
    .map((meal) => createFavoriteCard(meal))
    .join("");

  setupRemoveButtons();
}

function createFavoriteCard(meal) {
  return `
    <article class="recipe-card">

      <img
        class="recipe-card-image"
        src="${meal.strMealThumb}"
        alt="${meal.strMeal}"
        loading="lazy"
      >

      <div class="recipe-card-content">

        <h3>${meal.strMeal}</h3>

        <p>
          ${meal.strCategory || "Recipe"}
          ${meal.strArea ? `• ${meal.strArea}` : ""}
        </p>

        <div class="recipe-card-actions">

          <a
            href="recipe-details.html?id=${meal.idMeal}"
            class="primary-button"
          >
            View Recipe
          </a>

          <button
            type="button"
            class="secondary-button remove-favorite-button"
            data-id="${meal.idMeal}"
          >
            Remove Favorite
          </button>

        </div>

      </div>

    </article>
  `;
}

function setupRemoveButtons() {
  const removeButtons = document.querySelectorAll(
    ".remove-favorite-button"
  );

  removeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const mealId = button.dataset.id;

      removeFavorite(mealId);

      displayFavorites();
    });
  });
}