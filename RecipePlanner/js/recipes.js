import {
  searchMeals,
  getCategories,
  getMealsByCategory,
} from "./api.js";

import { setupNavigation } from "./navigation.js";

document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();

  setupCategoryPage();
});

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
          No recipes were found for "${query}".
          Try another search.
        </p>
      `;
      return;
    }

    displayRecipes(meals, resultsContainer);
  } catch (error) {
    console.error("Recipe search error:", error);

    resultsContainer.innerHTML = `
      <p class="empty-message">
        Sorry, we could not load the recipes.
        Please try again.
      </p>
    `;
  }
}

async function setupCategoryPage() {
  const categoryContainer =
    document.querySelector("#category-buttons");

  const resultsContainer =
    document.querySelector("#category-results");

  if (!categoryContainer || !resultsContainer) {
    return;
  }

  try {
    const categories = await getCategories();

    categoryContainer.innerHTML = categories
      .map(
        (category) => `
          <button
            type="button"
            class="category-button"
            data-category="${category.strCategory}"
          >
            ${category.strCategory}
          </button>
        `
      )
      .join("");

    setupCategoryButtons();
  } catch (error) {
    console.error("Category loading error:", error);

    categoryContainer.innerHTML = `
      <p class="empty-message">
        Unable to load recipe categories.
      </p>
    `;
  }
}

function setupCategoryButtons() {
  const buttons =
    document.querySelectorAll(".category-button");

  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      const category = button.dataset.category;

      const resultsContainer =
        document.querySelector("#category-results");

      resultsContainer.innerHTML = `
        <p class="empty-message">
          Loading ${category} recipes...
        </p>
      `;

      try {
        const meals = await getMealsByCategory(category);

        if (meals.length === 0) {
          resultsContainer.innerHTML = `
            <p class="empty-message">
              No recipes found in this category.
            </p>
          `;
          return;
        }

        displayRecipes(meals, resultsContainer);
      } catch (error) {
        console.error("Category recipe error:", error);

        resultsContainer.innerHTML = `
          <p class="empty-message">
            Unable to load recipes for this category.
          </p>
        `;
      }
    });
  });
}

function displayRecipes(meals, container) {
  container.innerHTML = meals
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

        </div>

      </div>

    </article>
  `;
}