import { searchMeals } from "./api.js";

export async function searchAndDisplayRecipes(query) {
  const resultsContainer = document.querySelector("#recipe-results");
  const message = document.querySelector("#search-message");

  if (!resultsContainer) {
    return;
  }

  resultsContainer.innerHTML = `
    <p class="empty-message">Loading recipes...</p>
  `;

  if (message) {
    message.textContent = "";
  }

  try {
    const meals = await searchMeals(query);

    if (meals.length === 0) {
      resultsContainer.innerHTML = `
        <p class="empty-message">
          No recipes were found for "${query}". Try another search.
        </p>
      `;
      return;
    }

    displayRecipes(meals);
  } catch (error) {
    console.error("Recipe search error:", error);

    resultsContainer.innerHTML = `
      <p class="empty-message">
        Sorry, we could not load the recipes. Please try again.
      </p>
    `;
  }
}

function displayRecipes(meals) {
  const resultsContainer = document.querySelector("#recipe-results");

  resultsContainer.innerHTML = meals
    .map((meal) => createRecipeCard(meal))
    .join("");
}

function createRecipeCard(meal) {
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
            class="secondary-button favorite-button"
            data-id="${meal.idMeal}"
          >
            ♡ Favorite
          </button>
        </div>
      </div>
    </article>
  `;
}